import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from './mocks/server';
import i18n from '@/config/i18n';

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'warn' });

  // Add in-memory resources to production i18n instance
  const languages = ['ko', 'en'];
  const namespaces = ['common', 'weather', 'errors', 'locations', 'themes', 'messages'];

  const resources = {
    ko: {
      common: {},
      weather: {
        hourly: {
          now: '지금',
        },
      },
      errors: {
        'geolocation.PERMISSION_DENIED': '위치 정보 권한이 거부되었습니다',
        'geolocation.POSITION_UNAVAILABLE': '위치를 확인할 수 없습니다',
        'geolocation.TIMEOUT': '위치 요청 시간이 초과되었습니다',
        'geolocation.UNKNOWN': '알 수 없는 오류가 발생했습니다',
      },
      locations: {},
      themes: {},
      messages: {},
    },
    en: {
      common: {},
      weather: {
        hourly: {
          now: 'Now',
        },
      },
      errors: {
        'geolocation.PERMISSION_DENIED': 'User denied Geolocation',
        'geolocation.POSITION_UNAVAILABLE': 'Location unavailable',
        'geolocation.TIMEOUT': 'Location request timed out',
        'geolocation.UNKNOWN': 'Unknown geolocation error',
      },
      locations: {},
      themes: {},
      messages: {},
    },
  };

  // Add resource bundles to existing i18n instance
  languages.forEach((lng) => {
    namespaces.forEach((ns) => {
      i18n.addResourceBundle(lng, ns, resources[lng][ns], true, true);
    });
  });

  // Change language to Korean (default for tests)
  await i18n.changeLanguage('ko');

  // Mock BroadcastChannel
  if (typeof globalThis.BroadcastChannel === 'undefined') {
    class BroadcastChannelMock {
      private name: string;
      onmessage: ((event: MessageEvent) => void) | null = null;

      constructor(name: string) {
        this.name = name;
      }

      postMessage(message: unknown) {
        if (this.onmessage) {
          this.onmessage(new MessageEvent('message', { data: message }));
        }
      }

      close() {
        this.onmessage = null;
      }
    }

    globalThis.BroadcastChannel = BroadcastChannelMock as typeof BroadcastChannel;
  }
});
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
vi.stubEnv('VITE_VAPID_PUBLIC_KEY', 'BNxnJ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8');
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3001');
