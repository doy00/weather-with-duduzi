import { useState, useEffect } from 'react';
import { GEOLOCATION_TIMEOUT, DEFAULT_LOCATION } from '@/config/constants';

interface Coords {
  lat: number;
  lon: number;
}

export const useGeolocation = () => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("위치 정보 확인 중...");

  useEffect(() => {
    const initLocation = () => {
      if (!navigator.geolocation) {
        setError("브라우저가 위치 정보를 지원하지 않습니다.");
        setLocationStatus("위치 정보를 가져올 수 없어 기본 위치(서울)를 사용합니다.");
        setCoords({ lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon });
        setIsLoading(false);
        return;
      }

      setLocationStatus("사용자 위치를 파악하고 있습니다...");

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
          setLocationStatus("위치 정보를 가져올 수 없어 기본 위치(서울)를 사용합니다.");
          setCoords({ lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon });
          setIsLoading(false);
        },
        geoOptions
      );
    };

    initLocation();
  }, []);

  return {
    coords,
    isLoading,
    error,
    locationStatus,
  };
};
