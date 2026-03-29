import { API_BASE_URL } from '@/config/constants';
import type {
  SubscribePushInput,
  NotificationSubscription,
  CreateNotificationSettingInput,
  UpdateNotificationSettingInput,
  NotificationSetting,
} from '../types/notification.types';

// 푸시 구독
export async function subscribeNotificationApi(
  input: SubscribePushInput
): Promise<NotificationSubscription> {
  const response = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('푸시 구독에 실패했습니다');
  }

  return response.json();
}

// 알림 설정 생성
export async function createNotificationSetting(
  input: CreateNotificationSettingInput
): Promise<NotificationSetting> {
  const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('알림 설정 생성에 실패했습니다');
  }

  return response.json();
}

// 즐겨찾기별 알림 설정 조회
export async function getNotificationSettingsByFavorite(
  favoriteId: string
): Promise<NotificationSetting[]> {
  const response = await fetch(
    `${API_BASE_URL}/notifications/settings/favorite/${favoriteId}`
  );

  if (!response.ok) {
    throw new Error('알림 설정 조회에 실패했습니다');
  }

  return response.json();
}

// 알림 설정 수정
export async function updateNotificationSetting(
  id: string,
  input: UpdateNotificationSettingInput
): Promise<NotificationSetting> {
  const response = await fetch(`${API_BASE_URL}/notifications/settings/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('알림 설정 수정에 실패했습니다');
  }

  return response.json();
}

// 알림 설정 삭제
export async function deleteNotificationSetting(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/notifications/settings/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('알림 설정 삭제에 실패했습니다');
  }
}
