import React from 'react';
import { HourlyWeather } from '@/types/weather.types';
import { GlassCard } from '@/features/shared/components/GlassCard';
import { formatTemperature, formatHour } from '@/features/shared/utils/formatters';

interface HourlyForecastProps {
  hourlyData?: HourlyWeather;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  if (!hourlyData) return null;

  return (
    <GlassCard>
      <h3 className="text-xs font-black opacity-60 mb-6 uppercase tracking-widest">
        오늘의 시간대별 날씨
      </h3>
      <div className="flex overflow-x-auto gap-8 pb-4 custom-scrollbar">
        {hourlyData.list.slice(0, 15).map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center min-w-[55px] animate-in fade-in slide-in-from-right-2 duration-300"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <span className="text-[11px] font-bold opacity-60 mb-3">
              {formatHour(item.dt, idx)}
            </span>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
              alt="weather"
              className="w-12 h-12 drop-shadow-md"
            />
            <span className="text-lg font-bold mt-2">{formatTemperature(item.main.temp)}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
