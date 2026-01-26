import { API_BASE_URL } from '@/config/constants';
import { handleApiError } from '@/lib/error';
import type { WeatherData, HourlyWeather } from '@/types/weather.types';
import type { GeocodingResult } from '@/types/location.types';

export const fetchCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/current?lat=${lat}&lon=${lon}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: error.message || '날씨 데이터를 가져올 수 없습니다.',
      };
    }

    const data = await response.json();
    return data.weather;
  } catch (error) {
    const message = handleApiError(error, 'Fetch Current Weather', '날씨 데이터를 가져올 수 없습니다.');
    throw new Error(message);
  }
};

export const fetchHourlyWeather = async (lat: number, lon: number): Promise<HourlyWeather> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/weather/hourly?lat=${lat}&lon=${lon}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: error.message || '시간별 날씨 데이터를 가져올 수 없습니다.',
      };
    }

    const data = await response.json();
    return data.forecast;
  } catch (error) {
    const message = handleApiError(error, 'Fetch Hourly Weather', '시간별 날씨 데이터를 가져올 수 없습니다.');
    throw new Error(message);
  }
};

export const geocodeLocation = async (query: string): Promise<GeocodingResult[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/location/geocode?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: error.message || '지역 검색 중 오류가 발생했습니다.',
      };
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    const message = handleApiError(error, 'Geocode Location', '지역 검색 중 오류가 발생했습니다.');
    throw new Error(message);
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/location/reverse-geocode?lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: error.message || '역지오코딩에 실패했습니다.',
      };
    }

    const data = await response.json();
    return data.locationName;
  } catch (error) {
    // reverseGeocode는 실패해도 fallback 반환 (UX 향상)
    return '내 위치';
  }
};
