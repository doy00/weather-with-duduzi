import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
      if (weather && selectedLocation?.id === 'current' && selectedLocation.name === '내 위치') {
        try {
          const koreanName = await reverseGeocode(selectedLocation.lat, selectedLocation.lon);
          setSelectedLocation(prev => prev ? {
            ...prev,
            name: koreanName,
            fullName: koreanName
          } : null);
        } catch (error) {
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
  }, [weather, selectedLocation?.id, selectedLocation?.name, selectedLocation?.lat, selectedLocation?.lon]);

  // Initialize default location if not set
  if (!selectedLocation && coords) {
    setSelectedLocation({
      id: 'current',
      fullName: '내 위치',
      name: '내 위치',
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
      const message = handleApiError(error, 'Select Location', '위치 선택에 실패했습니다.');
      toast.error(message);
    }
  }, [geocode]);

  const handleToggleFavorite = useCallback(async () => {
    if (!selectedLocation) return;

    const isFav = isFavorite(selectedLocation.fullName);

    if (isFav) {
      try {
        const fav = favorites.find(f => f.fullName === selectedLocation.fullName);
        if (fav) {
          await removeFavorite(fav.id);
          toast.success('즐겨찾기에서 제거되었습니다.');
        }
      } catch (error) {
        const message = handleApiError(error, 'Remove Favorite', '즐겨찾기 제거에 실패했습니다.');
        toast.error(message);
      }
    } else {
      try {
        const { id, ...locationData } = selectedLocation;
        await addFavorite(locationData);
        toast.success('즐겨찾기에 추가되었습니다.');
      } catch (error) {
        if (isErrorStatus(error, 409)) {
          toast.error('이미 즐겨찾기에 등록된 지역입니다.');
          return;
        }
        if (isErrorStatus(error, 400)) {
          toast.error('즐겨찾기는 최대 6개까지 가능합니다.');
          return;
        }
        const message = handleApiError(error, 'Add Favorite', '즐겨찾기 추가에 실패했습니다.');
        toast.error(message);
      }
    }
  }, [selectedLocation, favorites, isFavorite, addFavorite, removeFavorite]);

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
          '순서 변경에 실패했습니다.'
        );
        toast.error(message);
        throw error;
      }
    },
    [reorderFavorites]
  );

  // Loading state
  if ((isWeatherLoading || locationStatus) && !weather) {
    return <LoadingScreen statusMessage={locationStatus || "전 세계 기상 데이터를 확인 중..."} />;
  }

  // Error state
  if (isWeatherError) {
    return <ErrorScreen onRetry={() => refetchWeather()} />;
  }

  // Dynamic SEO data
  const locationName = selectedLocation?.name || '내 위치';
  const currentTemp = weather ? `${Math.round(weather.main.temp)}°` : '';
  const weatherDesc = weather?.weather[0]?.description || '실시간 날씨';
  const seoTitle = weather
    ? `${locationName} ${currentTemp} - ${weatherDesc}`
    : '실시간 날씨 정보';
  const seoDescription = weather
    ? `${locationName}의 현재 날씨는 ${currentTemp}, ${weatherDesc}입니다. 시간별 예보와 상세 날씨 정보를 확인하세요.`
    : '실시간 날씨 정보와 시간별 예보를 제공하는 날씨 앱. 즐겨찾기 기능으로 여러 지역의 날씨를 한눈에 확인하세요.';

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="날씨, 날씨 예보, 실시간 날씨, 시간별 예보, 일기예보, weather, forecast"
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
        <div className="flex items-center justify-between mb-2">
          {selectedLocation && (
            <LocationHeader
              locationName={selectedLocation.name}
              isFavorite={isFavorite(selectedLocation.fullName)}
              onSearchClick={() => setView('search')}
              onFavoriteToggle={handleToggleFavorite}
              onNotificationClick={() => navigate('/settings/notifications')}
            />
          )}
          {favorites.length > 0 && (
            <ThemeSelector currentThemeId={themeId} onThemeChange={setThemeId} />
          )}
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
