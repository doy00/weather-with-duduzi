import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FONT_CONFIGS } from '@/lib/locales/fonts';
import type { LanguageCode } from '@/types/language.types';

export function useFontLoader() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const langCode = i18n.language as LanguageCode;
    const config = FONT_CONFIGS[langCode] || FONT_CONFIGS.ko;

    // 이미 로드된 경우 스킵
    const existingLink = document.querySelector(`link[data-font="${langCode}"]`);
    if (existingLink) {
      // CSS 변수만 업데이트
      document.documentElement.style.setProperty('--font-primary', config.primary);
      return;
    }

    // 폰트 CDN 로딩
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = config.cdn;
    link.setAttribute('data-font', langCode);
    document.head.appendChild(link);

    // CSS 변수 업데이트
    document.documentElement.style.setProperty('--font-primary', config.primary);
  }, [i18n.language]);
}
