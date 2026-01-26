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

  // 현재 시간부터 24시간 이내의 데이터 사용 (rolling 24시간)
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const next24HoursData = hourlyData.list.filter(item => {
    const itemDate = new Date(item.dt * 1000);
    return itemDate >= now && itemDate <= next24Hours;
  });

  if (next24HoursData.length === 0) return null;

  const temps = next24HoursData.map(item => item.main.temp);
  return {
    min: Math.min(...temps),
    max: Math.max(...temps)
  };
};
