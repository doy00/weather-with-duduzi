import { describe, it, expect } from 'vitest';
import { getWeatherSuggestion, calculateDailyMinMax } from './weather-helpers';
import {
  mockWeatherData,
  mockWeatherDataRainy,
  mockWeatherDataSnowy,
  mockWeatherDataCold,
  mockWeatherDataHot,
  mockHourlyWeatherEmpty,
  mockHourlyWeatherToday,
} from '@/test/mocks/fixtures/weatherFixtures';

describe('weather-helpers', () => {
  describe('getWeatherSuggestion', () => {
    it('undefined 입력 시 로딩 메시지', () => {
      const result = getWeatherSuggestion(undefined);
      expect(result).toBe('날씨 정보를 확인하고 있습니다...');
    });

    it('비 올 때 우산 메시지', () => {
      const result = getWeatherSuggestion(mockWeatherDataRainy());
      expect(result).toContain('우산');
      expect(result).toContain('☂️');
    });

    it('눈 올 때 주의 메시지', () => {
      const result = getWeatherSuggestion(mockWeatherDataSnowy());
      expect(result).toContain('눈이');
      expect(result).toContain('주의');
      expect(result).toContain('❄️');
    });

    it('5도 미만 추운 날씨 메시지', () => {
      const result = getWeatherSuggestion(mockWeatherDataCold());
      expect(result).toContain('춥습니다');
      expect(result).toContain('🧣');
    });

    it('28도 초과 더운 날씨 메시지', () => {
      const result = getWeatherSuggestion(mockWeatherDataHot());
      expect(result).toContain('무더운');
      expect(result).toContain('☀️');
    });

    it('맑고 쾌적한 날씨 메시지', () => {
      const result = getWeatherSuggestion(mockWeatherData(37.5665, 126.978));
      expect(result).toContain('맑고 쾌적한');
      expect(result).toContain('😊');
    });
  });

  describe('calculateDailyMinMax', () => {
    it('undefined 입력 시 null 반환', () => {
      const result = calculateDailyMinMax(undefined);
      expect(result).toBeNull();
    });

    it('빈 배열 입력 시 null 반환', () => {
      const result = calculateDailyMinMax(mockHourlyWeatherEmpty());
      expect(result).toBeNull();
    });

    it('오늘 날짜의 최저/최고 온도 계산', () => {
      const result = calculateDailyMinMax(mockHourlyWeatherToday());

      expect(result).not.toBeNull();
      expect(result?.min).toBe(10);
      expect(result?.max).toBe(20);
    });

    it('내일 데이터는 제외', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTs = Math.floor(tomorrow.getTime() / 1000);

      const hourlyData = {
        list: [
          {
            dt: tomorrowTs + 3600,
            main: { temp: 100 },
            weather: [{ icon: '01d' }],
          },
        ],
      };

      const result = calculateDailyMinMax(hourlyData);
      expect(result).toBeNull();
    });
  });
});
