import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { WeatherData } from '@/types/weather.types';
import { GlassCard } from '@/features/shared/components/GlassCard';
import { getBubbleMessage, getDogBubbleMessage } from '@/features/shared/utils/bubble-helpers';
import { MessageData } from '@/types/message.types';
import messagesData from '@weather-duduzi/shared/data/dy-message.json';
import dogMessagesData from '@weather-duduzi/shared/data/busydog-message.json';
import dyImage from '@/assets/icons/ImageDy.png';
import busydogImage from '@/assets/icons/ImageBusydog.png';

interface BubbleMessageProps {
  weather: WeatherData;
}

export const BubbleMessage = React.memo<BubbleMessageProps>(({ weather }) => {
  const { t } = useTranslation('weather');
  const rabbitMessage = useMemo(
    () => getBubbleMessage(weather, messagesData.messages as MessageData[]),
    [weather]
  );

  const dogMessage = useMemo(
    () => getDogBubbleMessage(weather, dogMessagesData.messages as MessageData[]),
    [weather]
  );

  return (
    <div className="space-y-2 md:space-y-4">
      <GlassCard className="min-h-0 rounded-full p-2 md:p-3 animate-in fade-in slide-in-from-left-8 duration-500">
        <div className="flex gap-2 md:gap-3 items-center">
          <img
            src={dyImage}
            alt={t('character.dyAlt')}
            className="w-6 h-6 md:w-12 md:h-12 object-cover shrink-0 drop-shadow-lg"
          />
          <p className="text-sm md:text-base lg:text-lg font-light leading-snug md:leading-relaxed opacity-95 whitespace-pre-line flex-1">
            {rabbitMessage}
          </p>
        </div>
      </GlassCard>
      <GlassCard className="min-h-0 rounded-full p-2 md:p-3 animate-in fade-in slide-in-from-left-8 duration-500 delay-300">
        <div className="flex gap-2 md:gap-3 items-center">
          <img
            src={busydogImage}
            alt={t('character.busydogAlt')}
            className="w-6 h-6 md:w-12 md:h-12 object-cover shrink-0 drop-shadow-lg"
          />
          <p className="text-sm md:text-base lg:text-lg font-light leading-snug md:leading-relaxed opacity-95 whitespace-pre-line flex-1">
            {dogMessage}
          </p>
        </div>
      </GlassCard>
    </div>
  );
});
