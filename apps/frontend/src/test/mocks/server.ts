import { setupServer } from 'msw/node';
import { weatherHandlers } from './handlers/weatherHandlers';
import { kakaoHandlers } from './handlers/kakaoHandlers';

export const server = setupServer(...weatherHandlers, ...kakaoHandlers);
