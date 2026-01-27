import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LocationItem } from '@/types/location.types';
import { useGeolocation } from '@/features/location/hooks/useGeolocation';
import { useLocationSearch } from '@/features/location/hooks/useLocationSearch';
import { useGeocode } from '@/features/location/hooks/useGeocode';
import { reverseGeocode } from '@/features/weather/services/weatherService';
import { useFavoritesQuery } from '@/features/favorites/hooks/useFavoritesQuery';
import { useFavoriteWeather } from '@/features/favorites/hooks/useFavoriteWeather';
import { useTheme } from '@/features/favorites/hooks/useTheme';
import { handleApiError, isErrorStatus } from '@/lib/error';
import { toast } from '@/features/shared/components/Toast';
import { useWeatherData } from '@/features/weather/hooks/useWeatherData';
import { useHourlyForecast } from '@/features/weather/hooks/useHourlyForecast';
import { calculateDailyMinMax } from '@/features/shared/utils/weather-helpers';
import { useTimeBasedBackground } from '@/features/shared/hooks/useTimeBasedBackground';
import { LocationHeader } from '@/features/location/components/LocationHeader';
import { SearchOverlay } from '@/features/location/components/SearchOverlay';
import { WeatherDisplay } from '@/features/weather/components/WeatherDisplay';
import { BubbleMessage } from '@/features/weather/components/BubbleMessage';
import { DDayCard } from '@/features/weather/components/DDayCard';
import { WeatherSuggestion } from '@/features/weather/components/WeatherSuggestion';
import { HourlyForecast } from '@/features/weather/components/HourlyForecast';
import { WeatherDetails } from '@/features/weather/components/WeatherDetails';
import { FavoritesList } from '@/features/favorites/components/FavoritesList';
import { ThemeSelector } from '@/features/favorites/components/ThemeSelector';
import { LoadingScreen } from '@/features/shared/components/LoadingScreen';
import { ErrorScreen } from '@/features/shared/components/ErrorScreen';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { WidgetSync } from '@/plugins/WidgetSync';
import { DEFAULT_LOCATION } from '@/config/constants';
import { cn } from '@/lib/utils';
import { SEO } from '@/lib/components/SEO';

export const MainPage: React.FC = () => {
  const { t } = useTranslation(['errors', 'common']);
  const navigate = useNavigate();
  const [view, setView] = useState<'main' | 'search'>('main');
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Time-based background
  const { gradientClasses } = useTimeBasedBackground();

  // Location management
  const { coords, locationStatus } = useGeolocation();
  const searchResults = useLocationSearch(searchQuery);
  const { geocode } = useGeocode();
  const {
    favorites,
    addFavorite,
    removeFavorite,
    updateNickname,
    reorderFavorites,
    isFavorite,
  } = useFavoritesQuery();

  // Theme management
  const { theme, themeId, setThemeId } = useTheme();

  // Weather queries
  const lat = selectedLocation?.lat ?? coords?.lat ?? DEFAULT_LOCATION.lat;
  const lon = selectedLocation?.lon ?? coords?.lon ?? DEFAULT_LOCATION.lon;
  const { data: weather, isLoading: isWeatherLoading, isError: isWeatherError, refetch: refetchWeather } = useWeatherData(lat, lon);
  const { data: hourly } = useHourlyForecast(lat, lon);
  const favoriteWeatherResults = useFavoriteWeather(favorites);
  const dailyMinMax = calculateDailyMinMax(hourly);

  // Update location name from weather data when using geolocation
  useEffect(() => {
    const updateLocationName = async () => {
      if (weather && selectedLocation?.id === 'current' && selectedLocation.name === t('common:location.myLocation')) {
        try {
          const koreanName = await reverseGeocode(selectedLocation.lat, selectedLocation.lon);
          setSelectedLocation(prev => prev ? {
            ...prev,
            name: koreanName,
            fullName: koreanName
          } : null);
        } catch {
          // 실패 시 영어 이름 사용
          setSelectedLocation(prev => prev ? {
            ...prev,
            name: weather.name,
            fullName: weather.name
          } : null);
        }
      }
    };

    updateLocationName();
  }, [weather, selectedLocation?.id, selectedLocation?.name, selectedLocation?.lat, selectedLocation?.lon, t]);

  // Initialize default location if not set
  if (!selectedLocation && coords) {
    setSelectedLocation({
      id: 'current',
      fullName: t('common:location.myLocation'),
      name: t('common:location.myLocation'),
      lat: coords.lat,
      lon: coords.lon,
    });
  }

  const handleSelectLocation = useCallback(async (fullName: string) => {
    try {
      const parts = fullName.split('-');
      const name = parts[parts.length - 1];
      const geo = await geocode(name);

      setSelectedLocation({
        id: Date.now().toString(),
        fullName,
        name,
        lat: geo.lat,
        lon: geo.lon,
      });

      await WidgetSync.updateWidgetLocation(geo.lat, geo.lon);

      setView('main');
      setSearchQuery("");
    } catch (error) {
      const message = handleApiError(error, 'Select Location', t('errors:toast.locationFailed'));
      toast.error(message);
    }
  }, [geocode, t]);

  const handleToggleFavorite = useCallback(async () => {
    if (!selectedLocation) return;

    const isFav = isFavorite(selectedLocation.fullName);

    if (isFav) {
      try {
        const fav = favorites.find(f => f.fullName === selectedLocation.fullName);
        if (fav) {
          await removeFavorite(fav.id);
          toast.success(t('errors:toast.favoriteRemoved'));
        }
      } catch (error) {
        const message = handleApiError(error, 'Remove Favorite', t('errors:toast.favoriteRemoveFailed'));
        toast.error(message);
      }
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...locationData } = selectedLocation;
        await addFavorite(locationData);
        toast.success(t('errors:toast.favoriteAdded'));
      } catch (error) {
        if (isErrorStatus(error, 409)) {
          toast.error(t('errors:toast.favoriteExists'));
          return;
        }
        if (isErrorStatus(error, 400)) {
          toast.error(t('errors:toast.favoriteLimit'));
          return;
        }
        const message = handleApiError(error, 'Add Favorite', t('errors:toast.favoriteAddFailed'));
        toast.error(message);
      }
    }
  }, [selectedLocation, favorites, isFavorite, addFavorite, removeFavorite, t]);

  const handleSelectFavorite = useCallback((fav: import('@/types/location.types').FavoriteLocation) => {
    navigate(`/detail/${fav.id}`);
  }, [navigate]);

  const handleReorderFavorites = useCallback(
    async (favoriteIds: string[]) => {
      try {
        await reorderFavorites({ favoriteIds });
      } catch (error) {
        const message = handleApiError(
          error,
          'Reorder Favorites',
          t('errors:toast.orderUpdateFailed')
        );
        toast.error(message);
        throw error;
      }
    },
    [reorderFavorites, t]
  );

  // Loading state
  if ((isWeatherLoading || locationStatus) && !weather) {
    return <LoadingScreen statusMessage={locationStatus || t('errors:loading.status')} />;
  }

  // Error state
  if (isWeatherError) {
    return <ErrorScreen onRetry={() => refetchWeather()} />;
  }

  // Dynamic SEO data
  const locationName = selectedLocation?.name || t('common:location.myLocation');
  const currentTemp = weather ? `${Math.round(weather.main.temp)}°` : '';
  const weatherDesc = weather?.weather[0]?.description || t('common:seo.defaultTitle');
  const seoTitle = weather
    ? `${locationName} ${currentTemp} - ${weatherDesc}`
    : t('common:seo.defaultTitle');
  const seoDescription = weather
    ? `${locationName}의 현재 날씨는 ${currentTemp}, ${weatherDesc}입니다. 시간별 예보와 상세 날씨 정보를 확인하세요.`
    : t('common:seo.defaultDescription');

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={t('common:seo.defaultKeywords')}
        ogUrl={window.location.href}
        canonical={window.location.href}
      />
      <div className="max-w-md mx-auto min-h-screen text-white relative flex flex-col">
        <div className={`fixed inset-0 z-0 bg-gradient-to-b ${gradientClasses} transition-colors duration-1000`}></div>

      <div
        className={cn(
          "relative z-10 px-3 md:px-4 pt-6 md:pt-8 pb-20 flex-1 overflow-y-auto space-y-3 md:space-y-6",
          view === 'search' && "pointer-events-none opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex flex-col gap-2 mb-2">
          {selectedLocation && (
            <LocationHeader
              locationName={selectedLocation.name}
              isFavorite={isFavorite(selectedLocation.fullName)}
              onSearchClick={() => setView('search')}
              onFavoriteToggle={handleToggleFavorite}
              onNotificationClick={() => navigate('/settings/notifications')}
            />
          )}
          <div className="flex items-center justify-end gap-2">
            {favorites.length > 0 && (
              <ThemeSelector currentThemeId={themeId} onThemeChange={setThemeId} />
            )}
          </div>
        </div>

        {/* Bubble Message */}
        {weather && <BubbleMessage weather={weather} />}

        {/* Main Weather Display */}
        {weather && <WeatherDisplay weather={weather} dailyMinMax={dailyMinMax} />}

        {/* Weather Suggestion */}
        <WeatherSuggestion weather={weather} />

        {/* Hourly Forecast */}
        <HourlyForecast hourlyData={hourly} />

        {/* Favorites List */}
        <FavoritesList
          favorites={favorites}
          weatherResults={favoriteWeatherResults}
          onSelectFavorite={handleSelectFavorite}
          onRemove={removeFavorite}
          onUpdateNickname={updateNickname}
          onReorder={handleReorderFavorites}
          themeClassName={theme.cardClassName}
          themeTextClassName={theme.textClassName}
        />

        {/* Weather Details */}
        {weather && <WeatherDetails weather={weather} />}

        {/* D-Day Card */}
        <DDayCard />
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={view === 'search'}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClose={() => setView('main')}
        onSelectLocation={handleSelectLocation}
        searchResults={searchResults}
      />
    </div>
    </>
  );
};
