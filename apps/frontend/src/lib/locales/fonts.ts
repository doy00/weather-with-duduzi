import type { LanguageCode } from '@/types/language.types';

interface FontConfig {
  primary: string;
  fallback: string;
  cdn: string;
}

export const FONT_CONFIGS: Record<LanguageCode, FontConfig> = {
  ko: {
    primary: 'Pretendard',
    fallback: 'sans-serif',
    cdn: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
  },
  en: {
    primary: 'Pretendard',
    fallback: 'sans-serif',
    cdn: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
  },
  ja: {
    primary: 'Noto Sans JP',
    fallback: 'sans-serif',
    cdn: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap',
  },
  th: {
    primary: 'Noto Sans Thai',
    fallback: 'sans-serif',
    cdn: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700&display=swap',
  },
  vi: {
    primary: 'Noto Sans',
    fallback: 'sans-serif',
    cdn: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap',
  },
  id: {
    primary: 'Pretendard',
    fallback: 'sans-serif',
    cdn: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
  },
  es: {
    primary: 'Pretendard',
    fallback: 'sans-serif',
    cdn: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
  },
};
