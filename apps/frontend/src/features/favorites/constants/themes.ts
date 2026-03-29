export const FAVORITE_THEMES = {
  default: {
    id: 'default',
    name: '기본',
    description: '반투명 글래스 스타일',
    cardClassName: 'glass bg-white/10',
    textClassName: 'text-white',
    preview: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  },
  dark: {
    id: 'dark',
    name: '다크',
    description: '진한 검정 배경',
    cardClassName: 'bg-black/60 backdrop-blur-md',
    textClassName: 'text-white',
    preview: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)',
  },
  light: {
    id: 'light',
    name: '라이트',
    description: '밝은 흰색 배경',
    cardClassName: 'bg-white/80 backdrop-blur-md',
    textClassName: 'text-gray-900',
    preview: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.9) 100%)',
  },
  colorful: {
    id: 'colorful',
    name: '컬러풀',
    description: '핑크-퍼플 그라데이션',
    cardClassName: 'bg-gradient-to-br from-pink-500/60 to-purple-500/60 backdrop-blur-md',
    textClassName: 'text-white',
    preview: 'linear-gradient(135deg, rgba(236,72,153,0.6) 0%, rgba(168,85,247,0.6) 100%)',
  },
} as const;

export type FavoriteThemeId = keyof typeof FAVORITE_THEMES;
export const DEFAULT_THEME_ID: FavoriteThemeId = 'default';
