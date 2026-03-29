import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimeBasedBackground } from './useTimeBasedBackground';

describe('useTimeBasedBackground', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('초기 렌더: 현재 시간 기반 그라디언트 반환', () => {
    const { result } = renderHook(() => useTimeBasedBackground());

    expect(result.current).toHaveProperty('gradientClasses');
    expect(result.current).toHaveProperty('timePeriod');
    expect(typeof result.current.gradientClasses).toBe('string');
    expect(typeof result.current.timePeriod).toBe('string');
  });

  it('timePeriod 값 확인', () => {
    // 오전 6시로 설정 (dawn: 5-8시)
    vi.setSystemTime(new Date('2024-01-15T06:00:00'));

    const { result } = renderHook(() => useTimeBasedBackground());

    expect(result.current.timePeriod).toBe('dawn');
  });

  it('매 분마다 업데이트 확인 - timePeriod 변경 시', () => {
    // 7:59에서 시작 (dawn)
    vi.setSystemTime(new Date('2024-01-15T07:59:00'));

    const { result } = renderHook(() => useTimeBasedBackground());

    expect(result.current.timePeriod).toBe('dawn');

    // 시스템 시간을 8:00으로 변경 (morning)
    vi.setSystemTime(new Date('2024-01-15T08:00:00'));

    // 1분 경과하여 interval 실행
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    // timePeriod가 dawn → morning으로 변경됨
    expect(result.current.timePeriod).toBe('morning');
  });

  it('매 분마다 업데이트 확인 - timePeriod 변경 없으면 상태 업데이트 안 됨', () => {
    const { result } = renderHook(() => useTimeBasedBackground());

    const initialTimePeriod = result.current.timePeriod;

    // 1분 경과 (같은 timePeriod 내)
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    // timePeriod가 변경되지 않았다면 상태도 변경 안 됨
    expect(result.current.timePeriod).toBe(initialTimePeriod);
  });

  it('컴포넌트 언마운트 시 interval 정리', () => {
    const { unmount } = renderHook(() => useTimeBasedBackground());

    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });
});
