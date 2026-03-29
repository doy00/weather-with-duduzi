import { useState, useEffect } from 'react';
import { subscribeToPush, getPushSubscription } from '../services/pushService';
import { subscribeNotificationApi } from '../services/notificationApi';

interface UseNotificationPermissionReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  isLoading: boolean;
  subscriptionId: string | null;
}

export function useNotificationPermission(): UseNotificationPermissionReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  // 기존 구독 정보 로드
  const loadExistingSubscription = async () => {
    try {
      // 1. 브라우저의 Push 구독 확인
      const subscription = await getPushSubscription();

      if (!subscription) {
        setSubscriptionId(null);
        return;
      }

      // 2. 백엔드에 구독 정보 전송 (기존 구독이면 ID 반환)
      const subscriptionJson = subscription.toJSON();
      const response = await subscribeNotificationApi({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscriptionJson.keys!.p256dh,
          auth: subscriptionJson.keys!.auth,
        },
        userAgent: navigator.userAgent,
      });

      // 3. subscriptionId 상태 설정
      setSubscriptionId(response.id);
    } catch (error) {
      console.error('Failed to load existing subscription:', error);
      setSubscriptionId(null);
    }
  };

  useEffect(() => {
    if ('Notification' in window && window.Notification) {
      setPermission(window.Notification.permission);

      // 이미 권한이 허용된 경우 기존 구독 정보 로드
      if (window.Notification.permission === 'granted') {
        loadExistingSubscription();
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window) || !window.Notification) {
      throw new Error('이 브라우저는 알림을 지원하지 않습니다');
    }

    setIsLoading(true);
    try {
      const result = await window.Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // Service Worker 푸시 구독
        const subscription = await subscribeToPush();
        const subscriptionJson = subscription.toJSON();

        // 백엔드에 구독 정보 전송
        const response = await subscribeNotificationApi({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscriptionJson.keys!.p256dh,
            auth: subscriptionJson.keys!.auth,
          },
          userAgent: navigator.userAgent,
        });

        setSubscriptionId(response.id);
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permission,
    requestPermission,
    isLoading,
    subscriptionId,
  };
}
