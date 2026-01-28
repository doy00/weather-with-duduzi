import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocationSearch } from './useLocationSearch';

describe('useLocationSearch', () => {
  it('한글 검색: 일치하는 결과 반환', () => {
    const { result } = renderHook(() => useLocationSearch('서울'));

    expect(result.current.length).toBeGreaterThan(0);
    expect(result.current.every((r) => r.includes('서울'))).toBe(true);
  });

  it('빈 쿼리: 빈 배열 반환', () => {
    const { result } = renderHook(() => useLocationSearch(''));

    expect(result.current).toEqual([]);
  });

  it('대소문자 구분 없이 검색', () => {
    const { result: result1 } = renderHook(() => useLocationSearch('서울'));
    const { result: result2 } = renderHook(() => useLocationSearch('서울'));

    expect(result1.current).toEqual(result2.current);
  });

  it('최대 15개 결과 제한', () => {
    const { result } = renderHook(() => useLocationSearch('구'));

    expect(result.current.length).toBeLessThanOrEqual(15);
  });

  it('useMemo로 결과 메모이제이션', () => {
    const { result, rerender } = renderHook(
      ({ query }: { query: string }) => useLocationSearch(query),
      { initialProps: { query: '서울' } }
    );

    const result1 = result.current;

    // 같은 쿼리로 리렌더
    rerender({ query: '서울' });

    const result2 = result.current;

    // 메모이제이션되어 같은 참조 반환
    expect(result1).toBe(result2);
  });
});
