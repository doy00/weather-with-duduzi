export interface LanguageInfo {
  code: string;
  label: string;
  flag: string;
  nativeName: string;
}

export const LANGUAGES: readonly LanguageInfo[] = [
  { code: 'ko', label: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'id', label: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
  { code: 'th', label: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
  { code: 'vi', label: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];
