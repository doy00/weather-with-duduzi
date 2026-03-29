import { describe, it, expect } from 'vitest';
import {
  fetchCurrentWeather,
  fetchHourlyWeather,
  geocodeLocation,
  reverseGeocode,
} from './weatherService';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('weatherService', () => {
  describe('fetchCurrentWeather', () => {
    it('성공: 정상 날씨 데이터를 가져온다', async () => {
      const result = await fetchCurrentWeather(37.5665, 126.978);

      expect(result).toHaveProperty('weather');
      expect(result).toHaveProperty('main');
      expect(result.coord.lat).toBe(37.5665);
      expect(result.coord.lon).toBe(126.978);
      expect(result.name).toBe('서울');
    });

    it('에러: 401 - API 키가 유효하지 않습니다', async () => {
      server.use(
        http.get('https://api.openweathermap.org/data/2.5/weather', () =>
          HttpResponse.json({ message: 'Invalid API key' }, { status: 401 })
        )
      );

      await expect(fetchCurrentWeather(37.5665, 126.978)).rejects.toThrow(
        'API 키가 유효하지 않습니다'
      );
    });

    it('에러: 404 - 해당 장소의 정보가 제공되지 않습니다', async () => {
      await expect(fetchCurrentWeather(999, 999)).rejects.toThrow(
        '해당 장소의 정보가 제공되지 않습니다'
      );
    });

    it('에러: 네트워크 오류', async () => {
      server.use(
        http.get('https://api.openweathermap.org/data/2.5/weather', () =>
          HttpResponse.error()
        )
      );

      await expect(fetchCurrentWeather(37.5665, 126.978)).rejects.toThrow();
    });
  });

  describe('fetchHourlyWeather', () => {
    it('성공: 시간별 날씨 데이터를 가져온다', async () => {
      const result = await fetchHourlyWeather(37.5665, 126.978);

      expect(result).toHaveProperty('list');
      expect(Array.isArray(result.list)).toBe(true);
      expect(result.list.length).toBeGreaterThan(0);
      expect(result.list[0]).toHaveProperty('dt');
      expect(result.list[0]).toHaveProperty('main');
    });

    it('에러: 404 - 시간별 날씨 데이터를 가져올 수 없습니다', async () => {
      await expect(fetchHourlyWeather(999, 999)).rejects.toThrow(
        '시간별 날씨 데이터를 가져올 수 없습니다'
      );
    });

    it('에러: 네트워크 오류', async () => {
      server.use(
        http.get('https://api.openweathermap.org/data/2.5/forecast', () =>
          HttpResponse.error()
        )
      );

      await expect(fetchHourlyWeather(37.5665, 126.978)).rejects.toThrow();
    });
  });

  describe('geocodeLocation', () => {
    it('성공: 지역명으로 좌표를 가져온다', async () => {
      const result = await geocodeLocation('서울');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('lat');
      expect(result[0]).toHaveProperty('lon');
      expect(result[0]).toHaveProperty('name');
    });

    it('에러: 검색 결과가 없습니다', async () => {
      await expect(geocodeLocation('nonexistent')).rejects.toThrow(
        '해당 장소의 정보가 제공되지 않습니다'
      );
    });

    it('에러: 빈 쿼리로 검색', async () => {
      await expect(geocodeLocation('')).rejects.toThrow(
        '해당 장소의 정보가 제공되지 않습니다'
      );
    });
  });

  describe('reverseGeocode', () => {
    it('성공: Kakao API로 상세 주소 가져오기', async () => {
      const result = await reverseGeocode(37.5665, 126.978);

      expect(result).toBe('서울특별시 강남구 역삼동');
    });

    it('폴백: Kakao 실패 시 OpenWeatherMap 사용', async () => {
      server.use(
        http.get('https://dapi.kakao.com/v2/local/geo/coord2address.json', () =>
          HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
        )
      );

      const result = await reverseGeocode(37.5665, 126.978);

      expect(result).toBe('서울특별시');
    });

    it('폴백: 모든 API 실패 시 "내 위치" 반환', async () => {
      server.use(
        http.get('https://dapi.kakao.com/v2/local/geo/coord2address.json', () =>
          HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
        ),
        http.get('https://api.openweathermap.org/geo/1.0/reverse', () =>
          HttpResponse.json([])
        )
      );

      const result = await reverseGeocode(37.5665, 126.978);

      expect(result).toBe('내 위치');
    });

    it('폴백: OpenWeatherMap도 실패 시 "내 위치" 반환', async () => {
      const result = await reverseGeocode(999, 999);

      expect(result).toBe('내 위치');
    });
  });
});
