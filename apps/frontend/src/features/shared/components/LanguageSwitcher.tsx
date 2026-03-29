import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LANGUAGES } from '@/types/language.types';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = (langCode: string) => {
    // URL에서 lng 파라미터 제거 (localStorage가 우선하도록)
    const url = new URL(window.location.href);
    if (url.searchParams.has('lng')) {
      url.searchParams.delete('lng');
      window.history.replaceState({}, '', url.toString());
    }

    i18n.changeLanguage(langCode);
    // HTML lang 속성은 i18n 이벤트 리스너가 자동으로 업데이트
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="flex items-center gap-2 p-3 glass rounded-full active:scale-90 transition-all outline-none"
        aria-label="Change language"
      >
        <Globe size={24} aria-hidden="true" />
        <span className="text-xs font-bold uppercase">
          {currentLang.code}
        </span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="glass p-2 rounded-xl shadow-lg min-w-[200px] z-50"
          sideOffset={8}
        >
          {LANGUAGES.map((lang) => (
            <DropdownMenu.Item
              key={lang.code}
              className="flex items-center gap-3 p-3 hover:bg-white/20 rounded-lg cursor-pointer outline-none focus:bg-white/20"
              onSelect={() => handleLanguageChange(lang.code)}
            >
              <span className="text-2xl" role="img" aria-label={lang.label}>
                {lang.flag}
              </span>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-sm">{lang.nativeName}</span>
                <span className="text-xs opacity-70">{lang.label}</span>
              </div>
              {lang.code === i18n.language && (
                <Check size={16} className="ml-auto" aria-label="Selected" />
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
