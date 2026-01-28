import React from 'react';
import { useTranslation } from 'react-i18next';
import { HourlyWeather } from '@/types/weather.types';
import { GlassCard } from '@/features/shared/components/GlassCard';
import { formatTemperature, formatHour } from '@/features/shared/utils/formatters';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourlyData?: HourlyWeather;
}

export const HourlyForecast = React.memo<HourlyForecastProps>(({ hourlyData }) => {
  const { t } = useTranslation('weather');

  if (!hourlyData) return null;

  return (
    <GlassCard>
      <h3 className="text-xs font-black opacity-60 mb-6 uppercase tracking-widest">
        {t('hourly.title')}
      </h3>
      <div className="flex overflow-x-auto gap-8 pb-4 custom-scrollbar">
        {hourlyData.list.slice(0, 15).map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center min-w-[55px] opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
            style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
          >
            <span className="text-[11px] font-bold opacity-60 mb-3">
              {formatHour(item.dt, idx)}
            </span>
            <WeatherIcon iconCode={item.weather[0].icon} size={40} className="text-white" />
            <span className="text-lg font-bold mt-2">{formatTemperature(item.main.temp)}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
});
