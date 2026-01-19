import { useQuery } from '@tanstack/react-query';
import { fetchCurrentWeather } from '@/features/weather/services/weatherService';
import { WeatherData } from '@/types/weather.types';

export const useWeatherData = (lat: number | null, lon: number | null) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['weather', lat, lon],
    queryFn: () => fetchCurrentWeather(lat!, lon!),
    enabled: !!lat && !!lon,
    retry: 1,
  });

  return {
    data: data as WeatherData | undefined,
    isLoading,
    isError,
    error,
    refetch,
  };
};
