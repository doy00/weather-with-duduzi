import React, { useMemo } from 'react';
import { WeatherData } from '@/types/weather.types';
import { GlassCard } from '@/features/shared/components/GlassCard';
import { getBubbleMessage, getDogBubbleMessage } from '@/features/shared/utils/bubble-helpers';
import { MessageData } from '@/types/message.types';
import messagesData from '@/data/dy-message.json';
import dogMessagesData from '@/data/busydog-message.json';
import dyImage from '@/assets/icons/ImageDy.png';
import busydogImage from '@/assets/icons/ImageBusydog.png';

interface BubbleMessageProps {
  weather: WeatherData;
}

export const BubbleMessage: React.FC<BubbleMessageProps> = ({ weather }) => {
  const rabbitMessage = useMemo(
    () => getBubbleMessage(weather, messagesData.messages as MessageData[]),
    [weather]
  );

  const dogMessage = useMemo(
    () => getDogBubbleMessage(weather, dogMessagesData.messages as MessageData[]),
    [weather]
  );

  return (
    <div className="space-y-4">
      <GlassCard className="min-h-0 rounded-full p-3 animate-in fade-in zoom-in duration-500">
        <div className="flex gap-3 items-start">
          <img
            src={dyImage}
            alt="dy 캐릭터"
            className="w-12 h-12 object-cover shrink-0 drop-shadow-lg"
          />
          <p className="text-lg font-light leading-relaxed opacity-95 whitespace-pre-line flex-1 justify-center align-center">
            {rabbitMessage}
          </p>
        </div>
      </GlassCard>
      <GlassCard className="min-h-0 rounded-full p-3 animate-in fade-in zoom-in duration-500 delay-100">
        <div className="flex gap-3 items-start">
          <img
            src={busydogImage}
            alt="비지독 이미지"
            className="w-12 h-12 -translate-y-1 object-cover shrink-0 drop-shadow-lg"
          />
          <p className="text-lg font-light leading-relaxed opacity-95 whitespace-pre-line flex-1 align-center">
            {dogMessage}
          </p>
        </div>
      </GlassCard>
    </div>
  );
};
