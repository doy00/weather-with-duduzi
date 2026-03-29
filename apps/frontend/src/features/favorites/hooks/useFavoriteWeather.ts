import { useEffect } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import type { FavoriteLocation } from '@/features/favorites/types/favorite.types';
import { fetchCurrentWeather } from '@/features/weather/services/weatherService';
import { tabSync } from '@/lib/tabSync';

export const useFavoriteWeather = (favorites: FavoriteLocation[]) => {
  const queryClient = useQueryClient();

  // 다른 탭의 날씨 업데이트 수신
  useEffect(() => {
    const unsubscribe = tabSync.subscribe((message) => {
      if (message.type === 'WEATHER_UPDATE') {
        const { lat, lon, weather } = message.data;
        queryClient.setQueryData(['weather', lat, lon], weather);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  const results = useQueries({
    queries: favorites.map((fav) => ({
      queryKey: ['weather', fav.lat, fav.lon],
      queryFn: async () => {
        const weather = await fetchCurrentWeather(fav.lat, fav.lon);

        // 다른 탭에 브로드캐스트
        tabSync.send({
          type: 'WEATHER_UPDATE',
          data: { lat: fav.lat, lon: fav.lon, weather },
        });

        return weather;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true, // 탭 포커스 시 자동 refetch
    })),
  });

  return results;
};
