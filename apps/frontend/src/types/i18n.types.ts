import 'react-i18next';
import type koCommon from '@/lib/locales/ko/common.json';
import type koWeather from '@/lib/locales/ko/weather.json';
import type koErrors from '@/lib/locales/ko/errors.json';
import type koLocations from '@/lib/locales/ko/locations.json';
import type koThemes from '@/lib/locales/ko/themes.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof koCommon;
      weather: typeof koWeather;
      errors: typeof koErrors;
      locations: typeof koLocations;
      themes: typeof koThemes;
    };
  }
}
