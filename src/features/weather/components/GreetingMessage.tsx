import React, { useMemo } from 'react';
import { WeatherData } from '../../../types/weather.types';
import { GlassCard } from '../../shared/components/GlassCard';
import { getGreetingMessage } from '../../shared/utils/greeting-helpers';
import messagesData from '../../../data/messages.json';

interface GreetingMessageProps {
  weather: WeatherData;
}

export const GreetingMessage: React.FC<GreetingMessageProps> = ({ weather }) => {
  const message = useMemo(
    () => getGreetingMessage(weather, messagesData.messages),
    [weather]
  );

  return (
    <GlassCard className="animate-in fade-in zoom-in duration-500">
      <p className="text-lg font-light leading-relaxed opacity-95 whitespace-pre-line">
        {message}
      </p>
    </GlassCard>
  );
};
