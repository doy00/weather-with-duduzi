import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFavoritesQuery } from '@/features/favorites/hooks/useFavoritesQuery';
import { useWeatherData } from '@/features/weather/hooks/useWeatherData';
import { useHourlyForecast } from '@/features/weather/hooks/useHourlyForecast';
import { calculateDailyMinMax } from '@/features/shared/utils/weather-helpers';
import { useTimeBasedBackground } from '@/features/shared/hooks/useTimeBasedBackground';
import { WeatherDisplay } from '@/features/weather/components/WeatherDisplay';
import { WeatherSuggestion } from '@/features/weather/components/WeatherSuggestion';
import { HourlyForecast } from '@/features/weather/components/HourlyForecast';
import { WeatherDetails } from '@/features/weather/components/WeatherDetails';
import { LanguageSwitcher } from '@/features/shared/components/LanguageSwitcher';
import { LoadingScreen } from '@/features/shared/components/LoadingScreen';
import { ErrorScreen } from '@/features/shared/components/ErrorScreen';
import { SEO } from '@/lib/components/SEO';

export const DetailPage: React.FC = () => {
  const { t } = useTranslation(['errors', 'common']);
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
        <p className="font-bold text-2xl mb-4">{t('errors:screen.favoriteNotFound')}</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 font-bold glass rounded-3xl active:scale-95 transition-all"
        >
          {t('common:button.backToMain')}
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

  // Dynamic SEO data
  const locationName = favorite.nickname || favorite.name;
  const currentTemp = weather ? `${Math.round(weather.main.temp)}°` : '';
  const weatherDesc = weather?.weather[0]?.description || t('common:seo.defaultTitle');
  const seoTitle = weather
    ? `${locationName} ${currentTemp} - ${weatherDesc}`
    : `${locationName} ${t('common:seo.defaultTitle')}`;
  const seoDescription = weather
    ? `${locationName}의 현재 날씨는 ${currentTemp}, ${weatherDesc}입니다. 시간별 예보와 상세 날씨 정보를 확인하세요.`
    : `${locationName}의 ${t('common:seo.defaultDescription')}`;

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`${locationName} 날씨, ${locationName} 날씨 예보, ${locationName} 실시간 날씨`}
        ogUrl={window.location.href}
        canonical={window.location.href}
      />
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
          <LanguageSwitcher />
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
    </>
  );
};
