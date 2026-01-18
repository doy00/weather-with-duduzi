import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { FavoriteLocation } from '../../../types/location.types';
import { WeatherData } from '../../../types/weather.types';
import { FavoriteCard } from './FavoriteCard';

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  weatherResults: UseQueryResult<WeatherData, Error>[];
  onSelectFavorite: (favorite: FavoriteLocation) => void;
  onRemove: (id: string) => void;
  onUpdateNickname: (id: string, nickname: string) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  weatherResults,
  onSelectFavorite,
  onRemove,
  onUpdateNickname,
}) => {
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
              onRemove={onRemove}
              onEditNickname={onUpdateNickname}
            />
          );
        })}
      </div>
    </div>
  );
};
