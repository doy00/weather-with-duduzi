export interface NotificationSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export interface NotificationSetting {
  id: string;
  subscription_id: string;
  favorite_id: string;
  enabled: boolean;
  scheduled_time?: string;
  scheduled_days?: number[];
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationSettingInput {
  subscription_id: string;
  favorite_id: string;
  enabled?: boolean;
  scheduled_time?: string;
  scheduled_days?: number[];
}

export interface UpdateNotificationSettingInput {
  enabled?: boolean;
  scheduled_time?: string;
  scheduled_days?: number[];
}

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface SubscribePushInput {
  endpoint: string;
  keys: PushSubscriptionKeys;
  userAgent?: string;
}
