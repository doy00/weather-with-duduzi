import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBubbleMessage } from './bubble-helpers';
import {
  mockWeatherData,
  mockWeatherDataRainy,
  mockWeatherDataSnowy,
  mockWeatherDataCold,
  mockWeatherDataHot,
} from '@/test/mocks/fixtures/weatherFixtures';
import { mockMessages } from '@/test/mocks/fixtures/messageFixtures';

describe('bubble-helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getBubbleMessage', () => {
    it('특정 날짜 메시지 (최고 우선순위) - 새해', () => {
      vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
      const result = getBubbleMessage(mockWeatherData(37, 126), mockMessages);
      expect(result).toBe('새해 복 많이 받으세요! 🎉');
    });

    it('특정 날짜 메시지 (최고 우선순위) - 크리스마스', () => {
      vi.setSystemTime(new Date('2026-12-25T12:00:00Z'));
      const result = getBubbleMessage(mockWeatherData(37, 126), mockMessages);
      expect(result).toBe('크리스마스입니다! 🎄');
    });

    it('날씨 조건 메시지 - 비', () => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
      const result = getBubbleMessage(mockWeatherDataRainy(), mockMessages);
      expect(result).toBe('비가 오는 날이에요 🌧️');
    });

    it('날씨 조건 메시지 - 눈', () => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
      const result = getBubbleMessage(mockWeatherDataSnowy(), mockMessages);
      expect(result).toBe('눈이 내리는 날이에요 ❄️');
    });

    it('온도 조건 메시지 - 추움 (feels_like <= 5)', () => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
      const result = getBubbleMessage(mockWeatherDataCold(), mockMessages);
      expect(result).toBe('추운 날씨네요 🥶');
    });

    it('온도 조건 메시지 - 더움 (feels_like >= 28)', () => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
      const result = getBubbleMessage(mockWeatherDataHot(), mockMessages);
      expect(result).toBe('더운 날씨네요 🔥');
    });

    it('기본 메시지 (조건 미매칭)', () => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
      const result = getBubbleMessage(mockWeatherData(37, 126), mockMessages);
      expect(result).toBe('좋은 하루 보내세요!');
    });

    it('우선순위가 같은 메시지 중 랜덤 선택', () => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));

      // 같은 우선순위의 메시지 추가
      const messagesWithDuplicates = [
        ...mockMessages,
        {
          id: 8,
          text: '비가 많이 와요 🌧️',
          conditions: { type: 'weather', weatherMain: 'Rain' },
          priority: 80,
        },
      ];

      const result = getBubbleMessage(mockWeatherDataRainy(), messagesWithDuplicates);
      expect(['비가 오는 날이에요 🌧️', '비가 많이 와요 🌧️']).toContain(result);
    });
  });
});
