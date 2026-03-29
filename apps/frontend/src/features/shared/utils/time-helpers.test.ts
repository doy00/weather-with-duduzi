import { describe, it, expect } from 'vitest';
import { getTimePeriod, getGradientClasses, getTimeBasedGradient } from './time-helpers';

describe('time-helpers', () => {
  describe('getTimePeriod', () => {
    it('5-7시: dawn', () => {
      expect(getTimePeriod(5)).toBe('dawn');
      expect(getTimePeriod(6)).toBe('dawn');
      expect(getTimePeriod(7)).toBe('dawn');
    });

    it('8-11시: morning', () => {
      expect(getTimePeriod(8)).toBe('morning');
      expect(getTimePeriod(10)).toBe('morning');
      expect(getTimePeriod(11)).toBe('morning');
    });

    it('12-16시: afternoon', () => {
      expect(getTimePeriod(12)).toBe('afternoon');
      expect(getTimePeriod(14)).toBe('afternoon');
      expect(getTimePeriod(16)).toBe('afternoon');
    });

    it('17-19시: evening', () => {
      expect(getTimePeriod(17)).toBe('evening');
      expect(getTimePeriod(18)).toBe('evening');
      expect(getTimePeriod(19)).toBe('evening');
    });

    it('20-4시: night', () => {
      expect(getTimePeriod(20)).toBe('night');
      expect(getTimePeriod(22)).toBe('night');
      expect(getTimePeriod(0)).toBe('night');
      expect(getTimePeriod(2)).toBe('night');
      expect(getTimePeriod(4)).toBe('night');
    });
  });

  describe('getGradientClasses', () => {
    it('dawn 그라디언트', () => {
      const result = getGradientClasses('dawn');
      expect(result).toBe('from-dawn-start to-dawn-end');
    });

    it('morning 그라디언트', () => {
      const result = getGradientClasses('morning');
      expect(result).toBe('from-morning-start to-morning-end');
    });

    it('afternoon 그라디언트', () => {
      const result = getGradientClasses('afternoon');
      expect(result).toBe('from-afternoon-start to-afternoon-end');
    });

    it('evening 그라디언트', () => {
      const result = getGradientClasses('evening');
      expect(result).toBe('from-evening-start to-evening-end');
    });

    it('night 그라디언트', () => {
      const result = getGradientClasses('night');
      expect(result).toBe('from-night-start to-night-end');
    });
  });

  describe('getTimeBasedGradient', () => {
    it('새벽 시간 (6시)', () => {
      const result = getTimeBasedGradient(6);
      expect(result.timePeriod).toBe('dawn');
      expect(result.gradientClasses).toBe('from-dawn-start to-dawn-end');
    });

    it('아침 시간 (10시)', () => {
      const result = getTimeBasedGradient(10);
      expect(result.timePeriod).toBe('morning');
      expect(result.gradientClasses).toBe('from-morning-start to-morning-end');
    });

    it('오후 시간 (14시)', () => {
      const result = getTimeBasedGradient(14);
      expect(result.timePeriod).toBe('afternoon');
      expect(result.gradientClasses).toBe('from-afternoon-start to-afternoon-end');
    });

    it('저녁 시간 (18시)', () => {
      const result = getTimeBasedGradient(18);
      expect(result.timePeriod).toBe('evening');
      expect(result.gradientClasses).toBe('from-evening-start to-evening-end');
    });

    it('밤 시간 (22시)', () => {
      const result = getTimeBasedGradient(22);
      expect(result.timePeriod).toBe('night');
      expect(result.gradientClasses).toBe('from-night-start to-night-end');
    });
  });
});
