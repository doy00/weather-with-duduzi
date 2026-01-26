import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang; // HTML lang 속성 변경
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 p-3 glass rounded-full active:scale-90 transition-all"
      aria-label={`Change language to ${i18n.language === 'ko' ? 'English' : '한국어'}`}
    >
      <Languages size={18} aria-hidden="true" />
      <span className="text-xs font-bold uppercase">
        {i18n.language === 'ko' ? 'EN' : 'KO'}
      </span>
    </button>
  );
}
