import { http, HttpResponse } from 'msw';

export const i18nHandlers = [
  // Intercept i18n translation file requests and return empty objects
  http.get('/locales/:lang/:namespace.json', () => {
    return HttpResponse.json({});
  }),
];
