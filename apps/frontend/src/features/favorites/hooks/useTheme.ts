import { useState, useEffect } from 'react';
import { FAVORITE_THEMES, DEFAULT_THEME_ID } from '../constants/themes';
import type { FavoriteThemeId } from '../constants/themes';

const THEME_STORAGE_KEY = 'weather_favorite_theme';

export function useTheme() {
  const [themeId, setThemeId] = useState<FavoriteThemeId>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME_ID;

    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved && saved in FAVORITE_THEMES
      ? (saved as FavoriteThemeId)
      : DEFAULT_THEME_ID;
  });

  const theme = FAVORITE_THEMES[themeId];

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  }, [themeId]);

  return {
    theme,
    themeId,
    setThemeId,
    allThemes: Object.values(FAVORITE_THEMES),
  };
}
