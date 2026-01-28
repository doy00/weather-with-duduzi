import React from 'react';
import { WeatherData } from '@/types/weather.types';
import { formatTemperature } from '@/features/shared/utils/formatters';
import { getWeatherDescription } from '@/features/shared/utils/weather-helpers';

interface WeatherDisplayProps {
  weather: WeatherData;
  dailyMinMax?: { min: number; max: number } | null;
}

export const WeatherDisplay = React.memo<WeatherDisplayProps>(({ weather, dailyMinMax }) => {
  const tempMax = dailyMinMax?.max ?? weather.main.temp_max;
  const tempMin = dailyMinMax?.min ?? weather.main.temp_min;

  return (
    <div className="text-center mb-10 animate-in fade-in zoom-in duration-500">
      <p className="text-[80px] sm:text-[100px] lg:text-[120px] font-thin leading-none mb-4 tracking-tighter">
        {formatTemperature(weather.main.temp)}
      </p>
      <div className="flex justify-center gap-4 text-xl font-semibold opacity-90">
        <span className="flex items-center gap-1">
          ↑{formatTemperature(tempMax)}
        </span>
        <span className="opacity-40">|</span>
        <span className="flex items-center gap-1">
          ↓{formatTemperature(tempMin)}
        </span>
      </div>
      <p className="mt-4 text-2xl font-light opacity-90">
        {getWeatherDescription(weather.weather[0].main, weather.weather[0].description)}
      </p>
    </div>
  );
});
