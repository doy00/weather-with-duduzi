import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useFavoritesQuery } from '@/features/favorites/hooks/useFavoritesQuery';
import { useWeatherData } from '@/features/weather/hooks/useWeatherData';
import { useHourlyForecast } from '@/features/weather/hooks/useHourlyForecast';
import { calculateDailyMinMax } from '@/features/shared/utils/weather-helpers';
import { useTimeBasedBackground } from '@/features/shared/hooks/useTimeBasedBackground';
import { WeatherDisplay } from '@/features/weather/components/WeatherDisplay';
import { WeatherSuggestion } from '@/features/weather/components/WeatherSuggestion';
import { HourlyForecast } from '@/features/weather/components/HourlyForecast';
import { WeatherDetails } from '@/features/weather/components/WeatherDetails';
import { LoadingScreen } from '@/features/shared/components/LoadingScreen';
import { ErrorScreen } from '@/features/shared/components/ErrorScreen';

export const DetailPage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const navigate = useNavigate();
  const { favorites } = useFavoritesQuery();

  // Time-based background
  const { gradientClasses } = useTimeBasedBackground();

  const favorite = favorites.find(f => f.id === locationId);

  // Weather queries
  const { data: weather, isLoading, isError, refetch } = useWeatherData(
    favorite?.lat ?? null,
    favorite?.lon ?? null
  );
  const { data: hourly } = useHourlyForecast(favorite?.lat ?? null, favorite?.lon ?? null);
  const dailyMinMax = calculateDailyMinMax(hourly);

  if (!favorite) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen text-white bg-gradient-to-b ${gradientClasses} transition-colors duration-1000 p-6 text-center`}>
        <p className="font-bold text-2xl mb-4">즐겨찾기를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 font-bold glass rounded-3xl active:scale-95 transition-all"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading && !weather) {
    return <LoadingScreen statusMessage={`${favorite.nickname || favorite.name}의 날씨를 불러오는 중...`} />;
  }

  // Error state
  if (isError) {
    return <ErrorScreen onRetry={() => refetch()} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen text-white relative flex flex-col">
      <div className={`fixed inset-0 z-0 bg-gradient-to-b ${gradientClasses} transition-colors duration-1000`}></div>

      <div className="relative z-10 px-4 pt-8 pb-20 flex-1 overflow-y-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-3 glass rounded-full active:scale-90 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold flex-1">
            {favorite.nickname || favorite.name}
          </h1>
        </div>

        {/* Main Weather Display */}
        {weather && <WeatherDisplay weather={weather} dailyMinMax={dailyMinMax} />}

        {/* Weather Suggestion */}
        <WeatherSuggestion weather={weather} />

        {/* Hourly Forecast */}
        <HourlyForecast hourlyData={hourly} />

        {/* Weather Details */}
        {weather && <WeatherDetails weather={weather} />}

      </div>
    </div>
  );
};
