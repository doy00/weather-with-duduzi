import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
  localStorage.clear();
});
afterAll(() => server.close());

// Mock environment variables
vi.stubEnv('VITE_WEATHER_API_KEY', 'test-api-key');
vi.stubEnv('VITE_WEATHER_BASE_URL', 'https://api.openweathermap.org/data/2.5');
vi.stubEnv('VITE_KAKAO_API_KEY', 'test-kakao-key');
