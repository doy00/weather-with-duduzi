import { describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useHourlyForecast } from './useHourlyForecast';
import { renderHookWithQueryClient } from '@/test/utils/test-utils';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('useHourlyForecast', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('lat, lon이 있을 때 시간별 예보 데이터 가져오기', async () => {
    const { result } = renderHookWithQueryClient(() =>
      useHourlyForecast(37.5665, 126.978)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.list).toBeDefined();
    expect(Array.isArray(result.current.data?.list)).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('성공: list 배열 반환', async () => {
    const { result } = renderHookWithQueryClient(() =>
      useHourlyForecast(37.5665, 126.978)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data?.list.length).toBeGreaterThan(0);
    expect(result.current.data?.list[0]).toHaveProperty('dt');
    expect(result.current.data?.list[0]).toHaveProperty('main');
    expect(result.current.data?.list[0]).toHaveProperty('weather');
  });

  it('lat = null일 때 쿼리 비활성화', async () => {
    const { result } = renderHookWithQueryClient(() =>
      useHourlyForecast(null, 126.978)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
  });

  it('lon = null일 때 쿼리 비활성화', async () => {
    const { result } = renderHookWithQueryClient(() =>
      useHourlyForecast(37.5665, null)
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeUndefined();
  });

  it('API 에러 시 isError = true', async () => {
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/forecast', () =>
        HttpResponse.json({ message: 'city not found' }, { status: 404 })
      )
    );

    const { result } = renderHookWithQueryClient(() =>
      useHourlyForecast(999, 999)
    );

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 5000 }
    );
  });

  it('네트워크 에러 처리', async () => {
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/forecast', () =>
        HttpResponse.error()
      )
    );

    const { result } = renderHookWithQueryClient(() =>
      useHourlyForecast(37.5665, 126.978)
    );

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 5000 }
    );
  });

  it('재시도 1회 설정 확인', async () => {
    let attemptCount = 0;

    server.use(
      http.get('https://api.openweathermap.org/data/2.5/forecast', () => {
        attemptCount++;
        return HttpResponse.json({ message: 'Server error' }, { status: 500 });
      })
    );

    const { result } = renderHookWithQueryClient(() =>
      useHourlyForecast(37.5665, 126.978)
    );

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 5000 }
    );

    expect(attemptCount).toBe(2);
  });
});
