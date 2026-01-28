import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 번역 파일 import
import koCommon from '@/lib/locales/ko/common.json';
import koWeather from '@/lib/locales/ko/weather.json';
import koErrors from '@/lib/locales/ko/errors.json';
import koLocations from '@/lib/locales/ko/locations.json';
import koThemes from '@/lib/locales/ko/themes.json';

import enCommon from '@/lib/locales/en/common.json';
import enWeather from '@/lib/locales/en/weather.json';
import enErrors from '@/lib/locales/en/errors.json';
import enLocations from '@/lib/locales/en/locations.json';
import enThemes from '@/lib/locales/en/themes.json';

const resources = {
  ko: {
    common: koCommon,
    weather: koWeather,
    errors: koErrors,
    locations: koLocations,
    themes: koThemes,
  },
  en: {
    common: enCommon,
    weather: enWeather,
    errors: enErrors,
    locations: enLocations,
    themes: enThemes,
  },
};

i18n
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko', // 기본 언어
    defaultNS: 'common',
    ns: ['common', 'weather', 'errors', 'locations', 'themes'],
    interpolation: {
      escapeValue: false, // React가 XSS 방어
    },
    detection: {
      order: ['localStorage', 'navigator'], // 저장된 언어 → 브라우저 언어
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// 개발 환경에서 번역 누락 감지
if (import.meta.env.DEV) {
  i18n.on('missingKey', (lngs, namespace, key) => {
    console.warn(`Missing translation: ${namespace}:${key}`);
  });
}

export default i18n;
