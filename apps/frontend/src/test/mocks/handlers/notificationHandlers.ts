import { http, HttpResponse } from 'msw';
import type { SubscribePushInput, NotificationSubscription } from '@/features/notifications/types/notification.types';

const BASE_URL = 'http://localhost:3001';

// 테스트용 구독 저장소
const testSubscriptions = new Map<string, NotificationSubscription>();

export const notificationHandlers = [
  // POST /notifications/subscribe - 푸시 구독
  http.post(`${BASE_URL}/notifications/subscribe`, async ({ request }) => {
    const body = await request.json() as SubscribePushInput;

    // 기존 구독 확인
    const existing = testSubscriptions.get(body.endpoint);
    if (existing) {
      return HttpResponse.json(existing);
    }

    // 새 구독 생성
    const newSubscription: NotificationSubscription = {
      id: `sub_${Date.now()}`,
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
      created_at: new Date().toISOString(),
    };

    testSubscriptions.set(body.endpoint, newSubscription);
    return HttpResponse.json(newSubscription, { status: 201 });
  }),
];

// 테스트 헬퍼
export function resetTestSubscriptions() {
  testSubscriptions.clear();
}

export function setTestSubscription(endpoint: string, id: string) {
  testSubscriptions.set(endpoint, {
    id,
    endpoint,
    p256dh: 'test-p256dh',
    auth: 'test-auth',
    created_at: new Date().toISOString(),
  });
}
