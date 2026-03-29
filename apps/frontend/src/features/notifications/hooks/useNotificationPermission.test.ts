import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useNotificationPermission } from './useNotificationPermission';
import { resetTestSubscriptions, setTestSubscription } from '@/test/mocks/handlers/notificationHandlers';

// Mock PushSubscription
class MockPushSubscription {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  toJSON() {
    return {
      endpoint: this.endpoint,
      keys: {
        p256dh: 'mock-p256dh-key',
        auth: 'mock-auth-key',
      },
    };
  }

  unsubscribe() {
    return Promise.resolve(true);
  }
}

describe('useNotificationPermission', () => {
  let mockServiceWorkerRegistration: {
    pushManager: {
      getSubscription: ReturnType<typeof vi.fn>;
      subscribe: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(() => {
    resetTestSubscriptions();

    // Mock Service Worker API
    mockServiceWorkerRegistration = {
      pushManager: {
        getSubscription: vi.fn(),
        subscribe: vi.fn(),
      },
    };

    Object.defineProperty(global.navigator, 'serviceWorker', {
      value: {
        ready: Promise.resolve(mockServiceWorkerRegistration),
      },
      configurable: true,
      writable: true,
    });

    // Mock PushManager in window
    Object.defineProperty(global.window, 'PushManager', {
      value: class PushManager {},
      configurable: true,
      writable: true,
    });

    // Mock VAPID key
    vi.stubEnv('VITE_VAPID_PUBLIC_KEY', 'BNxnJ8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('초기 상태', () => {
    it('permission이 default인 경우 구독 로드 안 함', () => {
      // Mock Notification API
      Object.defineProperty(global, 'Notification', {
        value: {
          permission: 'default',
          requestPermission: vi.fn(),
        },
        configurable: true,
        writable: true,
      });

      const { result } = renderHook(() => useNotificationPermission());

      expect(result.current.permission).toBe('default');
      expect(result.current.subscriptionId).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(mockServiceWorkerRegistration.pushManager.getSubscription).not.toHaveBeenCalled();
    });

    it('permission이 denied인 경우 구독 로드 안 함', () => {
      Object.defineProperty(global, 'Notification', {
        value: {
          permission: 'denied',
          requestPermission: vi.fn(),
        },
        configurable: true,
        writable: true,
      });

      const { result } = renderHook(() => useNotificationPermission());

      expect(result.current.permission).toBe('denied');
      expect(result.current.subscriptionId).toBeNull();
      expect(mockServiceWorkerRegistration.pushManager.getSubscription).not.toHaveBeenCalled();
    });

    it('Notification API가 없는 경우 permission은 default', () => {
      // Remove Notification API
      Object.defineProperty(global, 'Notification', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      const { result } = renderHook(() => useNotificationPermission());

      expect(result.current.permission).toBe('default');
      expect(result.current.subscriptionId).toBeNull();
    });
  });

  describe('loadExistingSubscription', () => {
    it('권한이 granted이고 기존 구독이 있는 경우 subscriptionId 설정', async () => {
      const mockSubscription = new MockPushSubscription('https://fcm.googleapis.com/test-endpoint');
      mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(mockSubscription);

      // Set existing subscription in mock server
      setTestSubscription('https://fcm.googleapis.com/test-endpoint', 'existing-sub-id');

      Object.defineProperty(global, 'Notification', {
        value: {
          permission: 'granted',
          requestPermission: vi.fn(),
        },
        configurable: true,
        writable: true,
      });

      const { result } = renderHook(() => useNotificationPermission());

      expect(result.current.permission).toBe('granted');

      await waitFor(() => {
        expect(result.current.subscriptionId).toBe('existing-sub-id');
      });

      expect(mockServiceWorkerRegistration.pushManager.getSubscription).toHaveBeenCalled();
    });

    it('권한이 granted이지만 구독이 없는 경우 subscriptionId null', async () => {
      mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(null);

      Object.defineProperty(global, 'Notification', {
        value: {
          permission: 'granted',
          requestPermission: vi.fn(),
        },
        configurable: true,
        writable: true,
      });

      const { result } = renderHook(() => useNotificationPermission());

      await waitFor(() => {
        expect(mockServiceWorkerRegistration.pushManager.getSubscription).toHaveBeenCalled();
      });

      expect(result.current.subscriptionId).toBeNull();
    });

    it('getPushSubscription 실패 시 에러 로깅 + subscriptionId null', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockServiceWorkerRegistration.pushManager.getSubscription.mockRejectedValue(
        new Error('Service Worker not ready')
      );

      Object.defineProperty(global, 'Notification', {
        value: {
          permission: 'granted',
          requestPermission: vi.fn(),
        },
        configurable: true,
        writable: true,
      });

      const { result } = renderHook(() => useNotificationPermission());

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to load existing subscription:',
          expect.any(Error)
        );
      });

      expect(result.current.subscriptionId).toBeNull();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('requestPermission', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'Notification', {
        value: {
          permission: 'default',
          requestPermission: vi.fn(),
        },
        configurable: true,
        writable: true,
      });
    });

    it('권한 요청 성공 → 구독 생성 → subscriptionId 설정', async () => {
      const mockSubscription = new MockPushSubscription('https://fcm.googleapis.com/new-endpoint');

      (global.Notification.requestPermission as ReturnType<typeof vi.fn>).mockResolvedValue('granted');
      mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(null);
      mockServiceWorkerRegistration.pushManager.subscribe.mockResolvedValue(mockSubscription);

      const { result } = renderHook(() => useNotificationPermission());

      expect(result.current.permission).toBe('default');
      expect(result.current.isLoading).toBe(false);

      let permissionResult: NotificationPermission | undefined;

      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe('granted');
      expect(result.current.permission).toBe('granted');
      expect(result.current.isLoading).toBe(false);

      await waitFor(() => {
        expect(result.current.subscriptionId).toBeTruthy();
      });

      expect(mockServiceWorkerRegistration.pushManager.subscribe).toHaveBeenCalled();
    });

    it('권한 거부 시 subscriptionId 설정 안 함', async () => {
      (global.Notification.requestPermission as ReturnType<typeof vi.fn>).mockResolvedValue('denied');

      const { result } = renderHook(() => useNotificationPermission());

      let permissionResult: NotificationPermission | undefined;

      await act(async () => {
        permissionResult = await result.current.requestPermission();
      });

      expect(permissionResult).toBe('denied');
      expect(result.current.permission).toBe('denied');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.subscriptionId).toBeNull();
      expect(mockServiceWorkerRegistration.pushManager.subscribe).not.toHaveBeenCalled();
    });

    it('Notification API 미지원 시 에러', async () => {
      Object.defineProperty(global, 'Notification', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      const { result } = renderHook(() => useNotificationPermission());

      await act(async () => {
        await expect(result.current.requestPermission()).rejects.toThrow(
          '이 브라우저는 알림을 지원하지 않습니다'
        );
      });
    });

    it('에러 발생 시 isLoading false로 복원', async () => {
      (global.Notification.requestPermission as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Permission request failed')
      );

      const { result } = renderHook(() => useNotificationPermission());

      await act(async () => {
        await expect(result.current.requestPermission()).rejects.toThrow('Permission request failed');
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('권한 허용 후 기존 구독이 있으면 재사용', async () => {
      const existingSubscription = new MockPushSubscription('https://fcm.googleapis.com/existing');

      (global.Notification.requestPermission as ReturnType<typeof vi.fn>).mockResolvedValue('granted');
      mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(existingSubscription);

      // Set existing subscription in mock server
      setTestSubscription('https://fcm.googleapis.com/existing', 'existing-id');

      const { result } = renderHook(() => useNotificationPermission());

      await act(async () => {
        await result.current.requestPermission();
      });

      await waitFor(() => {
        expect(result.current.subscriptionId).toBe('existing-id');
      });

      // subscribeToPush는 기존 구독이 있으면 재사용하지만 여전히 호출됨
      expect(mockServiceWorkerRegistration.pushManager.getSubscription).toHaveBeenCalled();
    });
  });
});
