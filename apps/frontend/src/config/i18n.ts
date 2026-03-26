import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) // 동적 번역 파일 로딩
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next)
  .init({
    fallbackLng: 'ko', // 기본 언어
    defaultNS: 'common',
    ns: ['common', 'weather', 'errors', 'locations', 'themes'],
    supportedLngs: ['ko', 'en', 'ja', 'id', 'th', 'vi', 'es'], // 지원 언어
    interpolation: {
      escapeValue: false, // React가 XSS 방어
    },
    detection: {
      order: ['localStorage', 'navigator'], // 저장된 언어 → 브라우저 언어
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // 번역 파일 경로
    },
  });

// 개발 환경에서 번역 누락 감지
if (import.meta.env.DEV) {
  i18n.on('missingKey', (lngs, namespace, key) => {
    console.warn(`Missing translation: ${namespace}:${key}`);
  });
}

export default i18n;
