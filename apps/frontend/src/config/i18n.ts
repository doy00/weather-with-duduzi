import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

import type { FallbackLanguageMap } from '@/types/language.types';

// 비지원 언어에 대한 폴백 전략
const fallbackLanguageMap: FallbackLanguageMap = {
  zh: ['en', 'ko'], // 중국어 → 영어 → 한국어
  pt: ['es', 'en', 'ko'], // 포르투갈어 → 스페인어 → 영어 → 한국어
  fr: ['en', 'ko'], // 프랑스어 → 영어 → 한국어
  de: ['en', 'ko'], // 독일어 → 영어 → 한국어
  default: ['ko'], // 기타 → 한국어
};

i18n
  .use(HttpBackend) // 동적 번역 파일 로딩
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next)
  .init({
    fallbackLng: fallbackLanguageMap,
    defaultNS: 'common',
    ns: ['common', 'weather', 'errors', 'locations', 'themes', 'messages'],
    supportedLngs: ['ko', 'en', 'ja', 'id', 'th', 'vi', 'es'], // 지원 언어
    interpolation: {
      escapeValue: false, // React가 XSS 방어
    },
    detection: {
      // querystring 우선 → localStorage → 브라우저 → htmlTag
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      // querystring 파라미터 이름 (?lng=en)
      lookupQuerystring: 'lng',
      // localStorage 키
      lookupLocalStorage: 'i18nextLng',
      // 캐싱 전략
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'], // 개발 모드 제외
      // 언어 코드 정규화 (en-US → en)
      convertDetectedLanguage: (lng: string): string => {
        return lng.split('-')[0];
      },
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // 번역 파일 경로
    },
  });

// HTML lang 속성 자동 업데이트
i18n.on('languageChanged', (lng: string) => {
  document.documentElement.setAttribute('lang', lng);

  if (import.meta.env.DEV) {
    console.info(`[i18n] Language changed to: ${lng}`);
  }
});

// 개발 환경 디버깅
if (import.meta.env.DEV) {
  i18n.on('initialized', (options) => {
    console.info('[i18n] Initialized');
    console.info('[i18n] Detected language:', i18n.language);
    console.info('[i18n] Supported languages:', options.supportedLngs);
  });

  i18n.on('failedLoading', (lng: string, ns: string, msg: string) => {
    console.error(`[i18n] Failed to load ${ns} for ${lng}:`, msg);
  });

  i18n.on('missingKey', (lngs: readonly string[], namespace: string, key: string) => {
    console.warn(`[i18n] Missing translation: ${namespace}:${key}`);
  });
}

export default i18n;
