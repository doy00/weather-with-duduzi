import React, { useCallback } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import type { FavoriteLocation } from '@/features/favorites/types/favorite.types';
import type { WeatherData } from '@/types/weather.types';
import { FavoriteCard } from '@/features/favorites/components/FavoriteCard';

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  weatherResults: UseQueryResult<WeatherData, Error>[];
  onSelectFavorite: (favorite: FavoriteLocation) => void;
  onRemove: (id: string) => void;
  onUpdateNickname: (id: string, nickname: string) => Promise<void>;
}

export const FavoritesList = React.memo<FavoritesListProps>(({
  favorites,
  weatherResults,
  onSelectFavorite,
  onRemove,
  onUpdateNickname,
}) => {
  const handleRemove = useCallback((id: string) => {
    onRemove(id);
  }, [onRemove]);

  const handleUpdateNickname = useCallback((id: string, nickname: string) => {
    return onUpdateNickname(id, nickname);
  }, [onUpdateNickname]);

  if (favorites.length === 0) return null;

  return (
    <div className="mt-10 mb-6">
      <h3 className="text-xs font-black opacity-60 mb-4 uppercase tracking-widest px-2">
        즐겨찾는 지역
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((fav, index) => {
          const favWeather = weatherResults[index]?.data;
          const favLoading = weatherResults[index]?.isLoading;

          return (
            <FavoriteCard
              key={fav.id}
              favorite={fav}
              weather={favWeather}
              isLoading={favLoading ?? false}
              onClick={() => onSelectFavorite(fav)}
              onRemove={handleRemove}
              onEditNickname={handleUpdateNickname}
            />
          );
        })}
      </div>
    </div>
  );
});
