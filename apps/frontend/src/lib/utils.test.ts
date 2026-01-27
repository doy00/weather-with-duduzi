import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('단일 클래스명 반환', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('여러 클래스명 병합', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  it('조건부 클래스: falsy 값 제거', () => {
    const condition1 = false;
    const condition2: boolean | null = null;
    const condition3: boolean | undefined = undefined;

    expect(cn('base', condition1 && 'hidden', 'active')).toBe('base active');
    expect(cn('base', condition2 && 'hidden', 'active')).toBe('base active');
    expect(cn('base', condition3 && 'hidden', 'active')).toBe('base active');
  });

  it('조건부 클래스: truthy 값 포함', () => {
    const condition1 = true;
    const condition2 = 1;

    expect(cn('base', condition1 && 'active')).toBe('base active');
    expect(cn('base', condition2 && 'active')).toBe('base active');
  });

  it('중복 Tailwind 클래스 병합: 마지막 값 우선', () => {
    // twMerge가 처리: 같은 속성의 클래스는 마지막 것만 적용
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('객체 형태 클래스', () => {
    expect(cn({ 'text-red-500': true, 'bg-blue-500': false })).toBe('text-red-500');
  });

  it('배열 형태 클래스', () => {
    expect(cn(['text-red-500', 'bg-blue-500'])).toBe('text-red-500 bg-blue-500');
  });

  it('복잡한 조합', () => {
    const isActive = true;
    const hasError = false;

    const result = cn(
      'base-class',
      isActive && 'active',
      hasError && 'error',
      { disabled: false, highlighted: true }
    );

    expect(result).toContain('base-class');
    expect(result).toContain('active');
    expect(result).toContain('highlighted');
    expect(result).not.toContain('error');
    expect(result).not.toContain('disabled');
  });

  it('빈 입력: 빈 문자열 반환', () => {
    expect(cn()).toBe('');
  });

  it('모두 falsy 값: 빈 문자열 반환', () => {
    expect(cn(false, null, undefined)).toBe('');
  });

  it('Tailwind 충돌 해결: padding 예제', () => {
    // p-4와 px-6가 충돌 시 twMerge가 올바르게 병합
    const result = cn('p-4', 'px-6');
    expect(result).toBe('p-4 px-6');
  });

  it('Tailwind 충돌 해결: 같은 속성', () => {
    // 같은 속성의 여러 값 중 마지막 것만 적용
    const result = cn('bg-red-500', 'bg-green-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });
});
