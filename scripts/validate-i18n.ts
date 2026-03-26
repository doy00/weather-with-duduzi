import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { glob } from 'glob';

interface ValidationError {
  file: string;
  key: string;
  issue: string;
  severity: 'error' | 'warning';
}

async function getAllKeys(langDir: string): Promise<Map<string, string>> {
  const keys = new Map<string, string>();
  const files = await readdir(langDir);

  for (const file of files) {
    if (!file.endsWith('.json')) continue;

    const namespace = file.replace('.json', '');
    const content = JSON.parse(await readFile(join(langDir, file), 'utf-8')) as Record<
      string,
      unknown
    >;

    const flattenKeys = (obj: Record<string, unknown>, prefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flattenKeys(value as Record<string, unknown>, fullKey);
        } else {
          keys.set(`${namespace}:${fullKey}`, String(value));
        }
      }
    };

    flattenKeys(content);
  }

  return keys;
}

function extractVariables(text: string): string[] {
  return [...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((val, idx) => val === b[idx]);
}

async function getUsedKeysFromCode(): Promise<Set<string>> {
  const usedKeys = new Set<string>();
  const tsxFiles = await glob('apps/frontend/src/**/*.{ts,tsx}');

  for (const file of tsxFiles) {
    const content = await readFile(file, 'utf-8');

    // t('namespace:key') 패턴 감지
    const matches = content.matchAll(/t\(['"`]([^'"`]+)['"`]\)/g);
    for (const match of matches) {
      usedKeys.add(match[1]);
    }
  }

  return usedKeys;
}

async function validateTranslations(): Promise<ValidationError[]> {
  const errors: ValidationError[] = [];
  const localesDir = 'apps/frontend/public/locales';

  // 1. 한국어를 기준으로 모든 키 수집
  const koKeys = await getAllKeys(join(localesDir, 'ko'));

  // 2. 다른 언어 검증
  const languages = ['en', 'ja', 'id', 'th', 'vi', 'es'];

  for (const lang of languages) {
    const langKeys = await getAllKeys(join(localesDir, lang));

    // 누락된 키
    for (const [key] of koKeys) {
      if (!langKeys.has(key)) {
        errors.push({
          file: `${lang}/${key.split(':')[0]}.json`,
          key,
          issue: `Missing translation key`,
          severity: 'error',
        });
      }
    }

    // 변수 불일치
    for (const [key, koValue] of koKeys) {
      const langValue = langKeys.get(key);
      if (!langValue) continue;

      const koVars = extractVariables(koValue);
      const langVars = extractVariables(langValue);

      if (!arraysEqual(koVars, langVars)) {
        errors.push({
          file: `${lang}/${key.split(':')[0]}.json`,
          key,
          issue: `Variable mismatch: expected [${koVars.join(', ')}], got [${langVars.join(', ')}]`,
          severity: 'error',
        });
      }
    }
  }

  // 3. 사용되지 않는 키 감지
  const usedKeys = await getUsedKeysFromCode();
  for (const [key] of koKeys) {
    if (!usedKeys.has(key)) {
      errors.push({
        file: `ko/${key.split(':')[0]}.json`,
        key,
        issue: `Unused translation key`,
        severity: 'warning',
      });
    }
  }

  return errors;
}

async function main() {
  console.log('🔍 Validating i18n translations...\n');

  const errors = await validateTranslations();

  if (errors.length === 0) {
    console.log('✅ All validations passed!');
    process.exit(0);
  }

  const errorCount = errors.filter((e) => e.severity === 'error').length;
  const warningCount = errors.filter((e) => e.severity === 'warning').length;

  console.log(`Found ${errorCount} errors, ${warningCount} warnings:\n`);

  for (const error of errors) {
    const icon = error.severity === 'error' ? '❌' : '⚠️';
    console.log(`${icon} ${error.file}`);
    console.log(`   ${error.key}: ${error.issue}\n`);
  }

  if (errorCount > 0) {
    console.error('❌ Validation failed. Please fix the errors above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
