import { setupServer } from 'msw/node';
import { weatherHandlers } from './handlers/weatherHandlers';
import { kakaoHandlers } from './handlers/kakaoHandlers';
import { favoritesHandlers } from './handlers/favoritesHandlers';
import { notificationHandlers } from './handlers/notificationHandlers';

export const server = setupServer(
  ...weatherHandlers,
  ...kakaoHandlers,
  ...favoritesHandlers,
  ...notificationHandlers
);
