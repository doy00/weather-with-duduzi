import { setupServer } from 'msw/node';
import { backendHandlers } from './handlers/backendHandlers';
import { i18nHandlers } from './handlers/i18nHandlers';
import { weatherHandlers } from './handlers/weatherHandlers';
import { kakaoHandlers } from './handlers/kakaoHandlers';
import { favoritesHandlers } from './handlers/favoritesHandlers';
import { notificationHandlers } from './handlers/notificationHandlers';

export const server = setupServer(
  ...backendHandlers,
  ...i18nHandlers,
  ...weatherHandlers,
  ...kakaoHandlers,
  ...favoritesHandlers,
  ...notificationHandlers
);
