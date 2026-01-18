import React, { useMemo } from 'react';
import { WeatherData } from '../../../types/weather.types';
import { GlassCard } from '../../shared/components/GlassCard';
import { getBubbleMessage, getDogBubbleMessage } from '../../shared/utils/bubble-helpers';
import messagesData from '../../../data/dy-message.json';
import dogMessagesData from '../../../data/busydog-message.json';

interface BubbleMessageProps {
  weather: WeatherData;
}

export const BubbleMessage: React.FC<BubbleMessageProps> = ({ weather }) => {
  const rabbitMessage = useMemo(
    () => getBubbleMessage(weather, messagesData.messages),
    [weather]
  );

  const dogMessage = useMemo(
    () => getDogBubbleMessage(weather, dogMessagesData.messages),
    [weather]
  );

  return (
    <div className="space-y-4">
      <GlassCard className="animate-in fade-in zoom-in duration-500">
        <p className="text-lg font-light leading-relaxed opacity-95 whitespace-pre-line">
          {rabbitMessage}
        </p>
      </GlassCard>
      <GlassCard className="animate-in fade-in zoom-in duration-500 delay-100">
        <p className="text-lg font-light leading-relaxed opacity-95 whitespace-pre-line">
          {dogMessage}
        </p>
      </GlassCard>
    </div>
  );
};
