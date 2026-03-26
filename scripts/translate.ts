import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { config } from 'dotenv';

// backend/.env 파일 로드
config({ path: join(__dirname, '../apps/backend/.env') });

// 환경 변수 체크
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY environment variable is required');
  console.error('   Please add it to apps/backend/.env:');
  console.error('   GEMINI_API_KEY=your_api_key_here');
  console.error('');
  console.error('   Or set it temporarily with:');
  console.error('   export GEMINI_API_KEY=your_api_key');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const LANGUAGES = ['en', 'ja', 'id', 'th', 'vi', 'es'];
const NAMESPACES = ['common', 'weather', 'errors', 'locations', 'themes'];

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ja: 'Japanese (日本語)',
  id: 'Indonesian (Bahasa Indonesia)',
  th: 'Thai (ไทย)',
  vi: 'Vietnamese (Tiếng Việt)',
  es: 'Spanish (Español)',
};

const CONTEXT_GUIDE: Record<string, string> = {
  weather: '감정적이고 친근한 톤 (K-pop 팬 대상)',
  common: '캐주얼하고 자연스러운 표현',
  errors: '명확하고 간결한 에러 메시지',
  locations: '도시명 (현지 표기 우선)',
  themes: '테마 이름 (간결)',
};

async function translateNamespace(
  namespace: string,
  sourceContent: Record<string, unknown>,
  targetLang: string
): Promise<Record<string, unknown>> {
  const prompt = `
You are a professional translator for a K-pop weather app.
Translate the following JSON into ${LANGUAGE_NAMES[targetLang]}.

Context (${namespace}): ${CONTEXT_GUIDE[namespace]}

Source (Korean):
${JSON.stringify(sourceContent, null, 2)}

Rules:
1. Keep all JSON keys unchanged
2. Translate only values
3. Preserve {{variables}} exactly (e.g., {{hour}}, {{temp}})
4. Match the emotional tone of original
5. Use native speaker style, not literal translation
6. For city names in 'locations': use local script if applicable

Respond with ONLY valid JSON, no markdown blocks, no explanations.
`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-flash-lite-preview', // 2026년 최저가 모델 ($0.25/1M tokens)
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3, // 일관성 유지
      maxOutputTokens: 8192,
    },
  });

  const response = result.response;
  const text = response.text();

  // 마크다운 코드 블록 제거 (있는 경우)
  const cleanedText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

  return JSON.parse(cleanedText) as Record<string, unknown>;
}

async function main() {
  const localesDir = 'apps/frontend/public/locales';

  console.log('🌏 Starting translation process...\n');
  console.log(`Target languages: ${LANGUAGES.map(l => LANGUAGE_NAMES[l]).join(', ')}\n`);

  let totalTranslated = 0;
  let totalFailed = 0;

  for (const namespace of NAMESPACES) {
    console.log(`📦 Translating namespace: ${namespace}`);
    console.log('─'.repeat(50));

    const sourceFile = join(localesDir, 'ko', `${namespace}.json`);
    const sourceContent = JSON.parse(await readFile(sourceFile, 'utf-8')) as Record<
      string,
      unknown
    >;

    for (const lang of LANGUAGES) {
      process.stdout.write(`   ${LANGUAGE_NAMES[lang]}: `);

      try {
        const translated = await translateNamespace(namespace, sourceContent, lang);

        const targetFile = join(localesDir, lang, `${namespace}.json`);
        await writeFile(targetFile, JSON.stringify(translated, null, 2) + '\n');

        console.log('✅');
        totalTranslated++;
      } catch (error) {
        console.error('❌');
        console.error(`      Error: ${error instanceof Error ? error.message : String(error)}`);
        totalFailed++;
      }
    }

    console.log('');
  }

  console.log('─'.repeat(50));
  console.log(`\n✨ Translation complete!`);
  console.log(`   ✅ Translated: ${totalTranslated}`);
  console.log(`   ❌ Failed: ${totalFailed}`);

  if (totalFailed > 0) {
    console.error('\n⚠️  Some translations failed. Please check the errors above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
