import React from 'react';
import { Search, MapPin, Heart } from 'lucide-react';
import { GlassCard } from '@/features/shared/components/GlassCard';

interface LocationHeaderProps {
  locationName: string;
  isFavorite: boolean;
  onSearchClick: () => void;
  onFavoriteToggle: () => void;
}

export const LocationHeader = React.memo<LocationHeaderProps>(({
  locationName,
  isFavorite,
  onSearchClick,
  onFavoriteToggle,
}) => (
  <div className="flex justify-between items-center mb-8">
    <button
      onClick={onSearchClick}
      className="p-3 glass rounded-full active:scale-90 transition-all"
      aria-label="지역 검색"
    >
      <Search size={24} aria-hidden="true" />
    </button>
    <div className="flex items-center gap-2">
      <MapPin size={18} className="text-white/80" aria-hidden="true" />
      <h1 className="text-xl font-bold tracking-tight">{locationName}</h1>
    </div>
    <button
      onClick={onFavoriteToggle}
      className="p-3 glass rounded-full active:scale-90 transition-all"
      aria-label={isFavorite ? "즐겨찾기에서 제거" : "즐겨찾기에 추가"}
      aria-pressed={isFavorite}
    >
      <Heart size={24} fill={isFavorite ? "white" : "none"} aria-hidden="true" />
    </button>
  </div>
));
