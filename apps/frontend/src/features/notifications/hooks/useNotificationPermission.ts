import { useState, useEffect } from 'react';
import { subscribeToPush } from '../services/pushService';
import { subscribeNotificationApi } from '../services/notificationApi';

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      throw new Error('이 브라우저는 알림을 지원하지 않습니다');
    }

    setIsLoading(true);
    try {
      const result = await Notification.requestPermission();
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

  return { permission, requestPermission, isLoading, subscriptionId };
}
