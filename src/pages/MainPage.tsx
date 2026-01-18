import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationItem } from '../types/location.types';
import { useGeolocation } from '../features/location/hooks/useGeolocation';
import { useLocationSearch } from '../features/location/hooks/useLocationSearch';
import { useGeocode } from '../features/location/hooks/useGeocode';
import { useFavorites } from '../features/favorites/hooks/useFavorites';
import { useFavoriteWeather } from '../features/favorites/hooks/useFavoriteWeather';
import { useWeatherData } from '../features/weather/hooks/useWeatherData';
import { useHourlyForecast } from '../features/weather/hooks/useHourlyForecast';
import { LocationHeader } from '../features/location/components/LocationHeader';
import { SearchOverlay } from '../features/location/components/SearchOverlay';
import { WeatherDisplay } from '../features/weather/components/WeatherDisplay';
import { GreetingMessage } from '../features/weather/components/GreetingMessage';
import { WeatherSuggestion } from '../features/weather/components/WeatherSuggestion';
import { HourlyForecast } from '../features/weather/components/HourlyForecast';
import { WeatherDetails } from '../features/weather/components/WeatherDetails';
import { FavoritesList } from '../features/favorites/components/FavoritesList';
import { LoadingScreen } from '../features/shared/components/LoadingScreen';
import { ErrorScreen } from '../features/shared/components/ErrorScreen';
import { DEFAULT_LOCATION } from '../config/constants';

export const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'main' | 'search'>('main');
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Location management
  const { coords, locationStatus } = useGeolocation();
  const searchResults = useLocationSearch(searchQuery);
  const { geocode } = useGeocode();
  const { favorites, addFavorite, removeFavorite, updateNickname, isFavorite } = useFavorites();

  // Weather queries
  const lat = selectedLocation?.lat ?? coords?.lat ?? DEFAULT_LOCATION.lat;
  const lon = selectedLocation?.lon ?? coords?.lon ?? DEFAULT_LOCATION.lon;
  const { data: weather, isLoading: isWeatherLoading, isError: isWeatherError, refetch: refetchWeather } = useWeatherData(lat, lon);
  const { data: hourly } = useHourlyForecast(lat, lon);
  const favoriteWeatherResults = useFavoriteWeather(favorites);

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

  const handleSelectLocation = async (fullName: string) => {
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
      setView('main');
      setSearchQuery("");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("날씨 정보를 가져오는 중 오류가 발생했습니다.");
      }
    }
  };

  const handleToggleFavorite = () => {
    if (!selectedLocation) return;

    const isFav = isFavorite(selectedLocation.fullName);
    if (isFav) {
      const fav = favorites.find(f => f.fullName === selectedLocation.fullName);
      if (fav) removeFavorite(fav.id);
    } else {
      try {
        addFavorite(selectedLocation);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  };

  // Loading state
  if ((isWeatherLoading || locationStatus) && !weather) {
    return <LoadingScreen statusMessage={locationStatus || "전 세계 기상 데이터를 확인 중..."} />;
  }

  // Error state
  if (isWeatherError) {
    return <ErrorScreen onRetry={() => refetchWeather()} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen text-white relative flex flex-col">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-galaxy-blue-start to-galaxy-blue-end"></div>

      <div className="relative z-10 px-4 pt-8 pb-20 flex-1 overflow-y-auto">
        {/* Header */}
        {selectedLocation && (
          <LocationHeader
            locationName={selectedLocation.name}
            isFavorite={isFavorite(selectedLocation.fullName)}
            onSearchClick={() => setView('search')}
            onFavoriteToggle={handleToggleFavorite}
          />
        )}

        {/* Greeting Message */}
        {weather && <GreetingMessage weather={weather} />}

        {/* Main Weather Display */}
        {weather && <WeatherDisplay weather={weather} />}

        {/* Weather Suggestion */}
        <WeatherSuggestion weather={weather} />

        {/* Hourly Forecast */}
        <HourlyForecast hourlyData={hourly} />

        {/* Favorites List */}
        <FavoritesList
          favorites={favorites}
          weatherResults={favoriteWeatherResults}
          onSelectFavorite={(fav) => {
            navigate(`/detail/${fav.id}`);
          }}
          onRemove={removeFavorite}
          onUpdateNickname={updateNickname}
        />

        {/* Weather Details */}
        {weather && <WeatherDetails weather={weather} />}
      </div>

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
  );
};
