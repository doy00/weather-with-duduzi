import React, { useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { FavoriteLocation } from '@/features/favorites/types/favorite.types';
import type { WeatherData } from '@/types/weather.types';
import { formatTemperature } from '@/features/shared/utils/formatters';
import { NicknameEditor } from '@/features/favorites/components/NicknameEditor';

interface FavoriteCardProps {
  favorite: FavoriteLocation;
  weather?: WeatherData;
  isLoading: boolean;
  onClick?: () => void;
  onRemove: (id: string) => void;
  onEditNickname: (id: string, nickname: string) => Promise<void>;
  themeClassName?: string;
  themeTextClassName?: string;
}

export const FavoriteCard = React.memo<FavoriteCardProps>(({
  favorite,
  weather,
  isLoading,
  onClick,
  onRemove,
  onEditNickname,
  themeClassName = 'glass bg-white/10',
  themeTextClassName = 'text-white',
}) => {
  const { t } = useTranslation('common');
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-5 relative rounded-3xl transition-all duration-300 cursor-pointer active:scale-95',
        themeClassName,
        themeTextClassName
      )}
      role="button"
      tabIndex={0}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(favorite.id);
        }}
        className={cn(
          'absolute top-3 right-3 p-1 rounded-full',
          themeTextClassName === 'text-white'
            ? 'glass bg-black/10 hover:bg-black/20'
            : 'bg-gray-200/80 hover:bg-gray-300/80'
        )}
        aria-label={`${favorite.nickname || favorite.name} ${t('favorites.ariaLabel.remove')}`}
      >
        <X size={14} aria-hidden="true" />
      </button>

      <div className="flex flex-col h-full justify-between">
        <div className="mb-4">
          {editingId === favorite.id ? (
            <NicknameEditor
              initialValue={favorite.nickname || favorite.name}
              onSave={async (nickname) => {
                try {
                  await onEditNickname(favorite.id, nickname);
                  setEditingId(null);
                } catch (error) {
                  console.error('Failed to update nickname:', error);
                }
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-[15px] font-bold truncate max-w-[100px]">
                {favorite.nickname || favorite.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(favorite.id);
                }}
                className="text-[10px] opacity-60 flex items-center gap-1 mt-1 font-semibold"
                aria-label={`${favorite.nickname || favorite.name} ${t('favorites.ariaLabel.edit')}`}
              >
                <Edit2 size={10} aria-hidden="true" /> {t('favorites.nickname')}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          {isLoading ? (
            <div className="w-8 h-8 bg-white/10 animate-pulse rounded-full" />
          ) : weather ? (
            <>
              <p className="text-3xl font-light">{formatTemperature(weather.main.temp)}</p>
              <div className="text-[10px] font-bold opacity-70 text-right leading-tight">
                <div>↑{formatTemperature(weather.main.temp_max)}</div>
                <div>↓{formatTemperature(weather.main.temp_min)}</div>
              </div>
            </>
          ) : (
            <span className="text-[10px] opacity-40">{t('favorites.noData')}</span>
          )}
        </div>
      </div>
    </div>
  );
});
