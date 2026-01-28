import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GEOLOCATION_TIMEOUT, DEFAULT_LOCATION } from '@/config/constants';

interface Coords {
  lat: number;
  lon: number;
}

export const useGeolocation = () => {
  const { t } = useTranslation('errors');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>(t('geolocation.checking'));

  useEffect(() => {
    const initLocation = () => {
      if (!navigator.geolocation) {
        setError(t('geolocation.notSupported'));
        setLocationStatus(t('geolocation.fallbackToSeoul'));
        setCoords({ lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon });
        setIsLoading(false);
        return;
      }

      setLocationStatus(t('geolocation.checking'));

      const geoOptions = {
        enableHighAccuracy: false,
        timeout: GEOLOCATION_TIMEOUT,
        maximumAge: Infinity,
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setCoords(newCoords);
          setLocationStatus("");
          setIsLoading(false);
        },
        (err) => {
          console.warn(`Geolocation error (${err.code}): ${err.message}`);
          setError(err.message);
          setLocationStatus(t('geolocation.fallbackToSeoul'));
          setCoords({ lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon });
          setIsLoading(false);
        },
        geoOptions
      );
    };

    initLocation();
  }, [t]);

  return {
    coords,
    isLoading,
    error,
    locationStatus,
  };
};
