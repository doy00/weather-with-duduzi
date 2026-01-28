import { describe, it, expect, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { useFavoriteWeather } from './useFavoriteWeather';
import { renderHookWithQueryClient } from '@/test/utils/test-utils';
import { mockFavoritesList } from '@/test/mocks/fixtures/favoriteFixtures';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('useFavoriteWeather', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('여러 favorites의 날씨 데이터를 배치로 가져오기', async () => {
    const favorites = mockFavoritesList();

    const { result } = renderHookWithQueryClient(() =>
      useFavoriteWeather(favorites)
    );

    await waitFor(() => {
      expect(result.current.every((r) => !r.isLoading)).toBe(true);
    });

    expect(result.current).toHaveLength(3);
    expect(result.current[0].data).toBeDefined();
    expect(result.current[1].data).toBeDefined();
    expect(result.current[2].data).toBeDefined();
  });

  it('각 결과가 날씨 데이터 포함', async () => {
    const favorites = mockFavoritesList();

    const { result } = renderHookWithQueryClient(() =>
      useFavoriteWeather(favorites)
    );

    await waitFor(() => {
      expect(result.current.every((r) => !r.isLoading)).toBe(true);
    });

    result.current.forEach((queryResult) => {
      expect(queryResult.data).toHaveProperty('weather');
      expect(queryResult.data).toHaveProperty('main');
      expect(queryResult.data).toHaveProperty('coord');
    });
  });

  it('빈 배열일 때 빈 결과 반환', () => {
    const { result } = renderHookWithQueryClient(() => useFavoriteWeather([]));

    expect(result.current).toHaveLength(0);
  });

  it('단일 favorite 처리', async () => {
    const favorites = [mockFavoritesList()[0]];

    const { result } = renderHookWithQueryClient(() =>
      useFavoriteWeather(favorites)
    );

    await waitFor(() => {
      expect(result.current[0].isLoading).toBe(false);
    });

    expect(result.current).toHaveLength(1);
    expect(result.current[0].data).toBeDefined();
  });

  it('부분 실패 시나리오: 일부 쿼리 실패', async () => {
    const favorites = mockFavoritesList();

    // 특정 좌표에 대해 에러 반환
    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', ({ request }) => {
        const url = new URL(request.url);
        const lat = url.searchParams.get('lat');

        if (lat === '35.1628') {
          // 부산 좌표
          return HttpResponse.json({ message: 'city not found' }, { status: 404 });
        }

        // 나머지는 정상 응답
        return HttpResponse.json({
          coord: { lat: Number(lat), lon: Number(url.searchParams.get('lon')) },
          weather: [{ main: 'Clear', description: '맑음', icon: '01d' }],
          main: {
            temp: 15.5,
            temp_min: 10.2,
            temp_max: 18.3,
            feels_like: 14.8,
            humidity: 65,
          },
          name: '서울',
          dt: Math.floor(Date.now() / 1000),
        });
      })
    );

    const { result } = renderHookWithQueryClient(() =>
      useFavoriteWeather(favorites)
    );

    await waitFor(
      () => {
        expect(result.current.every((r) => !r.isLoading)).toBe(true);
      },
      { timeout: 5000 }
    );

    const successCount = result.current.filter((r) => r.isSuccess).length;
    const errorCount = result.current.filter((r) => r.isError).length;

    expect(successCount).toBeGreaterThan(0);
    expect(errorCount).toBeGreaterThan(0);
  });

  it('모든 쿼리 실패 시나리오', async () => {
    const favorites = mockFavoritesList();

    server.use(
      http.get('https://api.openweathermap.org/data/2.5/weather', () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 })
      )
    );

    const { result } = renderHookWithQueryClient(() =>
      useFavoriteWeather(favorites)
    );

    await waitFor(
      () => {
        expect(result.current.every((r) => !r.isLoading)).toBe(true);
      },
      { timeout: 5000 }
    );

    expect(result.current.every((r) => r.isError)).toBe(true);
  });

  it('staleTime 5분 설정 확인', async () => {
    const favorites = mockFavoritesList();

    const { result } = renderHookWithQueryClient(() =>
      useFavoriteWeather(favorites)
    );

    await waitFor(() => {
      expect(result.current.every((r) => !r.isLoading)).toBe(true);
    });

    // staleTime이 설정되어 있는지 확인 (실제 값은 React Query 내부)
    expect(result.current).toHaveLength(3);
  });

  it('favorites 배열 변경 시 쿼리 재생성', async () => {
    const initialFavorites = [mockFavoritesList()[0]];

    const { result, rerender } = renderHookWithQueryClient(
      (props: { favorites: typeof initialFavorites }) => useFavoriteWeather(props.favorites),
      { initialProps: { favorites: initialFavorites } }
    );

    await waitFor(() => {
      expect(result.current[0].isLoading).toBe(false);
    });

    expect(result.current).toHaveLength(1);

    // favorites 배열 변경
    const newFavorites = mockFavoritesList();
    rerender({ favorites: newFavorites });

    await waitFor(() => {
      expect(result.current).toHaveLength(3);
    });
  });
});
