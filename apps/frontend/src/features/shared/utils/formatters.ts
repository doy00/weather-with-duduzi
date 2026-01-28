import { format } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import i18n from '@/config/i18n';

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

export const formatHour = (timestamp: number, index: number): string => {
  if (index === 0) return i18n.t('weather:hourly.now');

  const date = new Date(timestamp * 1000);
  const locale = i18n.language === 'ko' ? ko : enUS;

  // 한국어: "14시", 영어: "2 PM"
  const pattern = i18n.language === 'ko' ? 'H시' : 'h a';

  return format(date, pattern, { locale });
};
