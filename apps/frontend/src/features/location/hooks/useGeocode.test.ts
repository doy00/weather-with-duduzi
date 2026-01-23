import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGeocode } from './useGeocode';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import * as weatherService from '@/features/weather/services/weatherService';

describe('useGeocode', () => {
  it('성공: 지명 → 좌표 변환', async () => {
    const { result } = renderHook(() => useGeocode());

    const geocodeResult = await result.current.geocode('서울');

    expect(geocodeResult).toHaveProperty('name', '서울');
    expect(geocodeResult).toHaveProperty('lat', 37.5665);
    expect(geocodeResult).toHaveProperty('lon', 126.978);
  });

  it('성공: 첫 번째 결과 반환', async () => {
    const { result } = renderHook(() => useGeocode());

    const geocodeResult = await result.current.geocode('부산');

    expect(geocodeResult).toBeDefined();
    expect(geocodeResult).toHaveProperty('name');
    expect(geocodeResult).toHaveProperty('lat');
    expect(geocodeResult).toHaveProperty('lon');
  });

  it('검색 결과 없음: 에러 throw', async () => {
    const { result } = renderHook(() => useGeocode());

    await expect(result.current.geocode('nonexistent')).rejects.toThrow(
      '해당 장소의 정보가 제공되지 않습니다.'
    );
  });

  it('빈 쿼리: 에러 throw', async () => {
    const { result } = renderHook(() => useGeocode());

    await expect(result.current.geocode('')).rejects.toThrow(
      '해당 장소의 정보가 제공되지 않습니다.'
    );
  });

  it('네트워크 에러: 에러 메시지', async () => {
    server.use(
      http.get('https://api.openweathermap.org/geo/1.0/direct', () =>
        HttpResponse.error()
      )
    );

    const { result } = renderHook(() => useGeocode());

    await expect(result.current.geocode('서울')).rejects.toThrow();
  });

  it('Error 인스턴스가 아닌 에러: 일반 에러 메시지', async () => {
    // geocodeLocation이 문자열을 던지는 경우 시뮬레이션
    vi.spyOn(weatherService, 'geocodeLocation').mockRejectedValue('String error');

    const { result } = renderHook(() => useGeocode());

    await expect(result.current.geocode('서울')).rejects.toThrow(
      '지역 검색 중 오류가 발생했습니다.'
    );

    vi.restoreAllMocks();
  });

  it('geocode 함수는 useCallback으로 메모이제이션됨', () => {
    const { result, rerender } = renderHook(() => useGeocode());

    const geocodeFunc1 = result.current.geocode;

    rerender();

    const geocodeFunc2 = result.current.geocode;

    expect(geocodeFunc1).toBe(geocodeFunc2);
  });
});
