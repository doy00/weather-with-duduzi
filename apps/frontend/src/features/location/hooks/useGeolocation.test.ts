import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';
import { DEFAULT_LOCATION } from '@/config/constants';

describe('useGeolocation', () => {
  let mockGeolocation: {
    getCurrentPosition: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Mock geolocation
    mockGeolocation = {
      getCurrentPosition: vi.fn(),
    };

    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('정상 위치 조회', () => {
    it('성공: coords 설정, isLoading = false', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 37.5665,
            longitude: 126.978,
          },
        });
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.coords).toEqual({
        lat: 37.5665,
        lon: 126.978,
      });
      expect(result.current.error).toBeNull();
    });

    it('locationStatus: 빈 문자열', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 37.5665,
            longitude: 126.978,
          },
        });
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.locationStatus).toBe('');
    });
  });

  describe('브라우저 미지원', () => {
    it('navigator.geolocation 없음 → 서울 좌표 폴백', async () => {
      Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.coords).toEqual({
        lat: DEFAULT_LOCATION.lat,
        lon: DEFAULT_LOCATION.lon,
      });
    });

    it('error 메시지: "브라우저가 위치 정보를 지원하지 않습니다."', async () => {
      Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('브라우저가 위치 정보를 지원하지 않습니다.');
    });

    it('locationStatus: "위치 정보를 가져올 수 없어 기본 위치(서울)를 사용합니다."', async () => {
      Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.locationStatus).toBe(
        '위치 정보를 가져올 수 없어 기본 위치(서울)를 사용합니다.'
      );
    });
  });

  describe('권한 거부', () => {
    it('PERMISSION_DENIED → 서울 좌표 폴백', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({
          code: 1, // PERMISSION_DENIED
          message: 'User denied Geolocation',
        });
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.coords).toEqual({
        lat: DEFAULT_LOCATION.lat,
        lon: DEFAULT_LOCATION.lon,
      });
    });

    it('error 메시지 설정', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({
          code: 1,
          message: 'User denied Geolocation',
        });
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('User denied Geolocation');
    });

    it('locationStatus: "위치 정보를 가져올 수 없어 기본 위치(서울)를 사용합니다."', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({
          code: 1,
          message: 'User denied Geolocation',
        });
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.locationStatus).toBe(
        '위치 정보를 가져올 수 없어 기본 위치(서울)를 사용합니다.'
      );
    });
  });

  describe('타임아웃', () => {
    it('TIMEOUT → 서울 좌표 폴백', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({
          code: 3, // TIMEOUT
          message: 'Timeout expired',
        });
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.coords).toEqual({
        lat: DEFAULT_LOCATION.lat,
        lon: DEFAULT_LOCATION.lon,
      });
    });

    it('error 메시지: TIMEOUT', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({
          code: 3,
          message: 'Timeout expired',
        });
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Timeout expired');
    });
  });

  describe('위치 정보 사용 불가', () => {
    it('POSITION_UNAVAILABLE → 서울 좌표 폴백', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({
          code: 2, // POSITION_UNAVAILABLE
          message: 'Position unavailable',
        });
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.coords).toEqual({
        lat: DEFAULT_LOCATION.lat,
        lon: DEFAULT_LOCATION.lon,
      });
    });

    it('error 메시지 설정', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
        error({
          code: 2,
          message: 'Position unavailable',
        });
      });

      const { result } = renderHook(() => useGeolocation());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('Position unavailable');
    });
  });
});
