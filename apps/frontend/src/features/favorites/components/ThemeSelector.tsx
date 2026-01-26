import React from 'react';
import { Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FAVORITE_THEMES } from '../constants/themes';
import type { FavoriteThemeId } from '../constants/themes';

interface ThemeSelectorProps {
  currentThemeId: FavoriteThemeId;
  onThemeChange: (themeId: FavoriteThemeId) => void;
}

export function ThemeSelector({ currentThemeId, onThemeChange }: ThemeSelectorProps) {
  const { t } = useTranslation(['common', 'themes']);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-semibold"
        aria-label={t('common:favorites.ariaLabel.changeTheme')}
      >
        <Palette size={16} aria-hidden="true" />
        <span>{t('themes:selector.button')}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="absolute top-full mt-2 right-0 z-50 glass rounded-2xl p-4 w-64">
            <h4 className="text-xs font-bold opacity-60 uppercase mb-3">{t('themes:selector.title')}</h4>
            <div className="space-y-2">
              {Object.values(FAVORITE_THEMES).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id as FavoriteThemeId);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full p-3 rounded-xl text-left transition-all',
                    currentThemeId === theme.id
                      ? 'ring-2 ring-white/40'
                      : 'hover:bg-white/10'
                  )}
                  aria-pressed={currentThemeId === theme.id}
                >
                  <div
                    className="h-12 rounded-lg mb-2"
                    style={{ background: theme.preview }}
                    aria-hidden="true"
                  />
                  <div className="text-sm font-semibold">{t(`themes:${theme.id}.name`)}</div>
                  <div className="text-xs opacity-60">{t(`themes:${theme.id}.description`)}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
