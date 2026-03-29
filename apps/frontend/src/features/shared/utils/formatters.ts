import { format } from 'date-fns';
import { ko, enUS, ja, id as idLocale, th, vi, es } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import i18n from '@/config/i18n';

const LOCALE_MAP: Record<string, Locale> = {
  ko,
  en: enUS,
  ja,
  id: idLocale,
  th,
  vi,
  es,
};

export function getDateFnsLocale(langCode: string): Locale {
  return LOCALE_MAP[langCode] || enUS;
}

// 언어별 시간 패턴
const HOUR_PATTERNS: Record<string, string> = {
  ko: 'H시',
  en: 'h a',
  ja: 'H時',
  id: 'HH:mm',
  th: 'HH:mm น.',
  vi: 'HH:mm',
  es: 'H:mm',
};

export const formatHour = (timestamp: number, index: number): string => {
  if (index === 0) return i18n.t('weather:hourly.now');

  const date = new Date(timestamp * 1000);
  const langCode = i18n.language;
  const pattern = HOUR_PATTERNS[langCode] || 'HH:mm';

  return format(date, pattern, { locale: getDateFnsLocale(langCode) });
};

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

// 숫자 포맷 (습도, 풍속 등)
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat(i18n.language).format(value);
};
