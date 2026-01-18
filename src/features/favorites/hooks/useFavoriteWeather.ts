import { useQueries } from '@tanstack/react-query';
import { FavoriteLocation } from '../../../types/location.types';
import { fetchCurrentWeather } from '../../weather/services/weatherService';

export const useFavoriteWeather = (favorites: FavoriteLocation[]) => {
  const results = useQueries({
    queries: favorites.map(fav => ({
      queryKey: ['weather', fav.lat, fav.lon],
      queryFn: () => fetchCurrentWeather(fav.lat, fav.lon),
      staleTime: 1000 * 60 * 5,
    })),
  });

  return results;
};
