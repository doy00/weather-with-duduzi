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

    it('특정 연도를 포함한 날짜 (YYYY-MM-DD 형식)', () => {
      vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));

      const messagesWithFullDate = [
        {
          id: 10,
          text: '2026년 1월 15일입니다!',
          conditions: { type: 'specificDate' as const, date: '2026-01-15' },
          priority: 100,
        },
        ...mockMessages,
      ];

      const result = getBubbleMessage(mockWeatherData(37, 126), messagesWithFullDate);
      expect(result).toBe('2026년 1월 15일입니다!');
    });

    it('specificDate에 date가 없을 때: 매칭 실패', () => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));

      const messagesWithNoDate = [
        {
          id: 11,
          text: '날짜 없음',
          conditions: { type: 'specificDate' as const },
          priority: 100,
        },
        ...mockMessages,
      ];

      const result = getBubbleMessage(mockWeatherData(37, 126), messagesWithNoDate);
      expect(result).not.toBe('날짜 없음');
    });

    it('temperature에 tempRange가 없을 때: 매칭 실패', () => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));

      const messagesWithNoRange = [
        {
          id: 12,
          text: '온도 범위 없음',
          conditions: { type: 'temperature' as const },
          priority: 70,
        },
        ...mockMessages,
      ];

      const result = getBubbleMessage(mockWeatherData(37, 126), messagesWithNoRange);
      expect(result).not.toBe('온도 범위 없음');
    });

    it('알 수 없는 type: 매칭 실패', () => {
      vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));

      const messagesWithUnknownType = [
        {
          id: 13,
          text: '알 수 없는 타입',
          conditions: { type: 'unknown' as any },
          priority: 100,
        },
        ...mockMessages,
      ];

      const result = getBubbleMessage(mockWeatherData(37, 126), messagesWithUnknownType);
      expect(result).not.toBe('알 수 없는 타입');
    });
  });

  describe('getDogBubbleMessage', () => {
    it('getBubbleMessage와 동일한 결과 반환', async () => {
      const { getDogBubbleMessage } = await import('./bubble-helpers');
      vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
      const result = getDogBubbleMessage(mockWeatherData(37, 126), mockMessages);
      expect(result).toBe('새해 복 많이 받으세요! 🎉');
    });
  });
});
