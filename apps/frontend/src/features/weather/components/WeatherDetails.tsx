import React from 'react';
import { useTranslation } from 'react-i18next';
import { WeatherData } from '@/types/weather.types';
import { GlassCard } from '@/features/shared/components/GlassCard';
import { formatTemperature } from '@/features/shared/utils/formatters';

interface WeatherDetailsProps {
  weather: WeatherData;
}

export const WeatherDetails = React.memo<WeatherDetailsProps>(({ weather }) => {
  const { t } = useTranslation('weather');

  return (
    <GlassCard className="mt-4 mb-10">
      <div className="grid grid-cols-2 gap-8 py-2">
        <div className="border-r border-white/10">
          <p className="text-[11px] font-black opacity-40 mb-2 tracking-widest uppercase">
            {t('details.feelsLike')}
          </p>
          <p className="text-2xl font-semibold">{formatTemperature(weather.main.feels_like)}</p>
        </div>
        <div className="pl-4">
          <p className="text-[11px] font-black opacity-40 mb-2 tracking-widest uppercase">
            {t('details.humidity')}
          </p>
          <p className="text-2xl font-semibold">{weather.main.humidity}%</p>
        </div>
      </div>
    </GlassCard>
  );
});
