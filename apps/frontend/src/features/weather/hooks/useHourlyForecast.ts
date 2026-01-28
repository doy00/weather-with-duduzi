import { useQuery } from '@tanstack/react-query';
import { fetchHourlyWeather } from '@/features/weather/services/weatherService';
import { HourlyWeather } from '@/types/weather.types';

export const useHourlyForecast = (lat: number | null, lon: number | null) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['hourly', lat, lon],
    queryFn: () => fetchHourlyWeather(lat!, lon!),
    enabled: !!lat && !!lon,
    retry: 1,
  });

  return {
    data: data as HourlyWeather | undefined,
    isLoading,
    isError,
  };
};
