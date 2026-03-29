import { describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useWeatherData } from './useWeatherData';
import { renderHookWithQueryClient } from '@/test/utils/test-utils';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('useWeatherData', () => {
  beforeEach(() => {
    // 각 테스트 전에 서버 핸들러 초기화
    server.resetHandlers();
  });

  describe('정상 데이터 fetching', () => {
    it('lat, lon이 있을 때 데이터 가져오기', async () => {
      const { result } = renderHookWithQueryClient(() =>
        useWeatherData(37.5665, 126.978)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.coord.lat).toBe(37.5665);
      expect(result.current.data?.coord.lon).toBe(126.978);
      expect(result.current.isError).toBe(false);
    });

    it('isLoading -> false, data 존재', async () => {
      const { result } = renderHookWithQueryClient(() =>
        useWeatherData(37.5665, 126.978)
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toHaveProperty('weather');
      expect(result.current.data).toHaveProperty('main');
      expect(result.current.data).toHaveProperty('name');
    });

    it('refetch 함수 작동', async () => {
      const { result } = renderHookWithQueryClient(() =>
        useWeatherData(37.5665, 126.978)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe('function');

      // refetch 호출
      const refetchResult = await result.current.refetch();
      expect(refetchResult.data).toBeDefined();
    });
  });

  describe('조건부 쿼리 비활성화', () => {
    it('lat = null일 때 쿼리 비활성화', async () => {
      const { result } = renderHookWithQueryClient(() =>
        useWeatherData(null, 126.978)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
    });

    it('lon = null일 때 쿼리 비활성화', async () => {
      const { result } = renderHookWithQueryClient(() =>
        useWeatherData(37.5665, null)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
    });

    it('lat, lon 모두 null일 때 쿼리 비활성화', async () => {
      const { result } = renderHookWithQueryClient(() =>
        useWeatherData(null, null)
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('에러 처리', () => {
    it('API 에러 시 isError = true', async () => {
      server.use(
        http.get('https://api.openweathermap.org/data/2.5/weather', () =>
          HttpResponse.json({ message: 'city not found' }, { status: 404 })
        )
      );

      const { result } = renderHookWithQueryClient(() =>
        useWeatherData(999, 999)
      );

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 5000 }
      );

      expect(result.current.error).toBeDefined();
    });

    it('error 객체 존재', async () => {
      server.use(
        http.get('https://api.openweathermap.org/data/2.5/weather', () =>
          HttpResponse.json({ message: 'Invalid API key' }, { status: 401 })
        )
      );

      const { result } = renderHookWithQueryClient(() =>
        useWeatherData(37.5665, 126.978)
      );

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 5000 }
      );

      expect(result.current.error).toBeDefined();
    });

    it('재시도 1회 설정 확인', async () => {
      let attemptCount = 0;

      server.use(
        http.get('https://api.openweathermap.org/data/2.5/weather', () => {
          attemptCount++;
          return HttpResponse.json({ message: 'Server error' }, { status: 500 });
        })
      );

      const { result } = renderHookWithQueryClient(() =>
        useWeatherData(37.5665, 126.978)
      );

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 5000 }
      );

      // retry: 1이므로 총 2번 시도 (초기 1번 + 재시도 1번)
      expect(attemptCount).toBe(2);
    });
  });
});
