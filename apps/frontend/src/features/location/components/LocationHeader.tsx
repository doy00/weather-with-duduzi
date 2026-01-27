import React from 'react';
import { Search, MapPin, Heart, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/features/shared/components/LanguageSwitcher';

interface LocationHeaderProps {
  locationName: string;
  isFavorite: boolean;
  onSearchClick: () => void;
  onFavoriteToggle: () => void;
  onNotificationClick?: () => void;
}

export const LocationHeader = React.memo<LocationHeaderProps>(({
  locationName,
  isFavorite,
  onSearchClick,
  onFavoriteToggle,
  onNotificationClick,
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="grid grid-cols-3 items-center gap-4 mb-8">
      <div className="flex gap-2">
        <button
          onClick={onSearchClick}
          className="p-3 glass rounded-full active:scale-90 transition-all"
          aria-label={t('search.ariaLabel.search')}
        >
          <Search size={24} aria-hidden="true" />
        </button>
        {onNotificationClick && (
          <button
            onClick={onNotificationClick}
            className="p-3 glass rounded-full active:scale-90 transition-all"
            aria-label={t('notifications.ariaLabel.settings')}
          >
            <Bell size={24} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-center gap-2">
        <MapPin size={18} className="text-white/80" aria-hidden="true" />
        <h1 className="text-xl font-bold tracking-tight">{locationName}</h1>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onFavoriteToggle}
          className="p-3 glass rounded-full active:scale-90 transition-all"
          aria-label={isFavorite ? t('favorites.ariaLabel.remove') : t('favorites.ariaLabel.add')}
          aria-pressed={isFavorite}
        >
          <Heart size={24} fill={isFavorite ? "white" : "none"} aria-hidden="true" />
        </button>
        <LanguageSwitcher />
      </div>
    </div>
  );
});
