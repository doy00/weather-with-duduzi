
import { WEATHER_API_KEY, WEATHER_BASE_URL } from '../constants';
import { WeatherData, HourlyWeather } from '../types';

export const fetchCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  const response = await fetch(`${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`);
  if (!response.ok) throw new Error("Weather data not available");
  return response.json();
};

export const fetchHourlyWeather = async (lat: number, lon: number): Promise<HourlyWeather> => {
  const response = await fetch(`${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`);
  if (!response.ok) throw new Error("Forecast data not available");
  return response.json();
};

export const geocodeLocation = async (query: string) => {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query},KR&limit=5&appid=${WEATHER_API_KEY}`);
  if (!response.ok) return [];
  return response.json();
};
