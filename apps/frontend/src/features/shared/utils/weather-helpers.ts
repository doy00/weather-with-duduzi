import i18n from '@/config/i18n';
import { WeatherData, HourlyWeather } from '@/types/weather.types';

export const getWeatherDescription = (weatherMain: string, description: string): string => {
  const main = weatherMain.toLowerCase();

  // 날씨 상태 번역
  const translationKey = `weather:status.${main}`;
  const translated = i18n.t(translationKey);

  // 번역 키가 없으면 원본 description 사용
  return translated !== translationKey ? translated : description;
};

export const getWeatherSuggestion = (data: WeatherData | undefined): string => {
  if (!data) return i18n.t('weather:suggestion.loading');

  const main = data.weather[0].main.toLowerCase();
  const temp = data.main.temp;

  if (main.includes('rain') || main.includes('drizzle')) {
    return i18n.t('weather:suggestion.rain');
  }
  if (main.includes('snow')) {
    return i18n.t('weather:suggestion.snow');
  }
  if (temp < 5) {
    return i18n.t('weather:suggestion.cold');
  }
  if (temp > 28) {
    return i18n.t('weather:suggestion.hot');
  }
  return i18n.t('weather:suggestion.clear');
};

export const calculateDailyMinMax = (hourlyData: HourlyWeather | undefined): { min: number; max: number } | null => {
  if (!hourlyData || !hourlyData.list.length) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTimestamps = hourlyData.list.filter(item => {
    const itemDate = new Date(item.dt * 1000);
    return itemDate >= today && itemDate < tomorrow;
  });

  if (todayTimestamps.length === 0) return null;

  const temps = todayTimestamps.map(item => item.main.temp);
  return {
    min: Math.min(...temps),
    max: Math.max(...temps)
  };
};
