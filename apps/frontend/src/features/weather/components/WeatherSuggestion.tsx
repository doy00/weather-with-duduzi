import React from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { WeatherData } from '@/types/weather.types';
import { GlassCard } from '@/features/shared/components/GlassCard';
import { getWeatherSuggestion } from '@/features/shared/utils/weather-helpers';

interface WeatherSuggestionProps {
  weather?: WeatherData;
}

export const WeatherSuggestion = React.memo<WeatherSuggestionProps>(({ weather }) => {
  const { t } = useTranslation('weather');

  return (
    <GlassCard className="bg-white/10 border-white/20 mb-6">
      <div className="flex items-start gap-4">
        <div className="bg-white/20 p-2.5 rounded-2xl">
          <Info className="text-white" size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">
            {t('briefing.title')}
          </p>
          <p className="text-[15px] font-semibold leading-relaxed">
            {getWeatherSuggestion(weather)}
          </p>
        </div>
      </div>
    </GlassCard>
  );
});
