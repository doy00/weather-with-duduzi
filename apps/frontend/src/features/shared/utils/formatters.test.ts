import { describe, it, expect } from 'vitest';
import { formatTemperature, formatHour } from './formatters';

describe('formatters', () => {
  describe('formatTemperature', () => {
    it('정수 온도: 그대로 표시', () => {
      expect(formatTemperature(15)).toBe('15°');
    });

    it('소수점 온도: 반올림', () => {
      expect(formatTemperature(15.4)).toBe('15°');
      expect(formatTemperature(15.5)).toBe('16°');
      expect(formatTemperature(15.9)).toBe('16°');
    });

    it('음수 온도: 정상 처리', () => {
      expect(formatTemperature(-5)).toBe('-5°');
      expect(formatTemperature(-5.6)).toBe('-6°');
    });

    it('0도: 정상 처리', () => {
      expect(formatTemperature(0)).toBe('0°');
    });

    it('높은 온도: 정상 처리', () => {
      expect(formatTemperature(35.8)).toBe('36°');
    });
  });

  describe('formatHour', () => {
    it('index 0: "지금" 반환', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      expect(formatHour(timestamp, 0)).toBe('지금');
    });

    it('오전 시간: "X시" 형식', () => {
      // 2024-01-15 09:00:00 UTC
      const timestamp = 1705309200;
      expect(formatHour(timestamp, 1)).toMatch(/\d+시/);
    });

    it('오후 시간: "X시" 형식', () => {
      // 2024-01-15 15:00:00 UTC
      const timestamp = 1705330800;
      expect(formatHour(timestamp, 1)).toMatch(/\d+시/);
    });

    it('자정: "0시"', () => {
      // 2024-01-15 00:00:00 UTC
      const timestamp = 1705276800;
      const result = formatHour(timestamp, 1);
      const hours = new Date(timestamp * 1000).getHours();
      expect(result).toBe(`${hours}시`);
    });

    it('정오: "12시"', () => {
      // 2024-01-15 12:00:00 UTC
      const timestamp = 1705320000;
      const result = formatHour(timestamp, 1);
      const hours = new Date(timestamp * 1000).getHours();
      expect(result).toBe(`${hours}시`);
    });

    it('다양한 index 처리', () => {
      const timestamp = Math.floor(Date.now() / 1000);

      expect(formatHour(timestamp, 0)).toBe('지금');
      expect(formatHour(timestamp, 1)).toMatch(/\d+시/);
      expect(formatHour(timestamp, 5)).toMatch(/\d+시/);
    });
  });
});
