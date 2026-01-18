import React from 'react';
import { WeatherData } from '../../../types/weather.types';
import { formatTemperature } from '../../shared/utils/formatters';

interface WeatherDisplayProps {
  weather: WeatherData;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => (
  <div className="text-center mb-10 animate-in fade-in zoom-in duration-500">
    <p className="text-[80px] sm:text-[100px] lg:text-[120px] font-thin leading-none mb-4 tracking-tighter">
      {formatTemperature(weather.main.temp)}
    </p>
    <div className="flex justify-center gap-4 text-xl font-semibold opacity-90">
      <span className="flex items-center gap-1">
        ↑{formatTemperature(weather.main.temp_max)}
      </span>
      <span className="opacity-40">|</span>
      <span className="flex items-center gap-1">
        ↓{formatTemperature(weather.main.temp_min)}
      </span>
    </div>
    <p className="mt-4 text-2xl font-light opacity-90">{weather.weather[0].description}</p>
  </div>
);
