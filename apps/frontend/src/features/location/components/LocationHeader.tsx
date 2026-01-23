import React from 'react';
import { Search, MapPin, Heart } from 'lucide-react';
import { GlassCard } from '@/features/shared/components/GlassCard';

interface LocationHeaderProps {
  locationName: string;
  isFavorite: boolean;
  onSearchClick: () => void;
  onFavoriteToggle: () => void;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({
  locationName,
  isFavorite,
  onSearchClick,
  onFavoriteToggle,
}) => (
  <div className="flex justify-between items-center mb-8">
    <button onClick={onSearchClick} className="p-3 glass rounded-full active:scale-90 transition-all">
      <Search size={24} />
    </button>
    <div className="flex items-center gap-2">
      <MapPin size={18} className="text-white/80" />
      <h1 className="text-xl font-bold tracking-tight">{locationName}</h1>
    </div>
    <button onClick={onFavoriteToggle} className="p-3 glass rounded-full active:scale-90 transition-all">
      <Heart size={24} fill={isFavorite ? "white" : "none"} />
    </button>
  </div>
);
