import { WEATHER_API_KEY, WEATHER_BASE_URL } from '@/config/constants';
import { WeatherData, HourlyWeather } from '@/types/weather.types';
import { GeocodingResult } from '@/types/location.types';

export const fetchCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
    );

    if (response.status === 401) {
      throw new Error("API 키가 유효하지 않습니다.");
    }
    if (response.status === 404) {
      throw new Error("해당 장소의 정보가 제공되지 않습니다.");
    }
    if (!response.ok) {
      throw new Error("날씨 데이터를 가져올 수 없습니다.");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("네트워크 오류가 발생했습니다.");
  }
};

export const fetchHourlyWeather = async (lat: number, lon: number): Promise<HourlyWeather> => {
  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
    );

    if (!response.ok) {
      throw new Error("시간별 날씨 데이터를 가져올 수 없습니다.");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("네트워크 오류가 발생했습니다.");
  }
};

export const geocodeLocation = async (query: string): Promise<GeocodingResult[]> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query},KR&limit=5&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      return [];
    }

    const results = await response.json();
    if (!Array.isArray(results) || results.length === 0) {
      throw new Error("해당 장소의 정보가 제공되지 않습니다.");
    }

    return results.map((result: any) => ({
      lat: result.lat,
      lon: result.lon,
      name: result.name,
    }));
  } catch (error) {
    if (error instanceof Error && error.message === "해당 장소의 정보가 제공되지 않습니다.") {
      throw error;
    }
    throw new Error("지역 검색 중 오류가 발생했습니다.");
  }
};
