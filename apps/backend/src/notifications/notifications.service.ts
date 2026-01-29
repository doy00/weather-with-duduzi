import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as webPush from 'web-push';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SubscribePushDto } from './dto/subscribe-push.dto';
import { CreateNotificationSettingDto } from './dto/create-notification-setting.dto';
import { UpdateNotificationSettingDto } from './dto/update-notification-setting.dto';

// 로컬 데이터에서 메시지 import
import * as dyMessages from '../data/dy-message.json';
import * as busydogMessages from '../data/busydog-message.json';

// ===== 타입 정의 (파일 상단) =====
interface MessageData {
  id: number;
  text: string;
  conditions: MessageConditions;
  priority: number;
}

interface MessageConditions {
  type: 'specificDate' | 'weather' | 'temperature' | 'default';
  date?: string;
  weatherMain?: string;
  feelsLike?: {
    min: number | null;
    max: number | null;
  };
}

interface MessagesFile {
  messages: MessageData[];
}

interface WeatherData {
  main: { feels_like: number };
  weather: Array<{ main: string }>;
}

interface NotificationSubscription {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

interface NotificationSetting {
  id: string;
  favorite_id: string;
  scheduled_days?: number[];
  favorite: {
    lat: number;
    lon: number;
    name: string;
    nickname?: string;
  };
  subscription: NotificationSubscription;
}

interface NotificationPayload {
  title: string;
  body: string;
  icon: string;
  data: {
    url: string;
    favoriteId?: string;
  };
}

// ===== Service =====
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const vapidPublicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const vapidSubject = this.configService.get<string>('VAPID_SUBJECT');

    this.logger.log(`VAPID Public Key: ${vapidPublicKey}`);
    this.logger.log(`VAPID Private Key: ${vapidPrivateKey ? 'Set' : 'Not Set'}`);
    this.logger.log(`VAPID Subject: ${vapidSubject}`);
    // VAPID 설정
    (
      webPush as {
        setVapidDetails: (
          subject: string,
          publicKey: string,
          privateKey: string,
        ) => void;
      }
    ).setVapidDetails(
      vapidSubject as string,
      vapidPublicKey as string,
      vapidPrivateKey as string,
    );

    // Supabase 클라이언트
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SECRET_KEY')!,
    ) as SupabaseClient;
  }

  // ===== Public API =====

  async subscribePush(
    dto: SubscribePushDto,
    userAgent?: string,
  ): Promise<unknown> {
    const { endpoint, keys } = dto;

    // 기존 구독 확인
    const { data: existing } = await this.supabase
      .from('notification_subscriptions')
      .select('*')
      .eq('endpoint', endpoint)
      .single();

    if (existing) {
      return existing as unknown;
    }

    // 새 구독 생성
    const { data, error } = await this.supabase
      .from('notification_subscriptions')
      .insert({
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        user_agent: userAgent || dto.userAgent,
      })
      .select()
      .single();

    if (error) {
      this.logger.error('구독 생성 실패', error);
      throw new Error('구독 생성에 실패했습니다');
    }

    return data as unknown;
  }

  async createNotificationSetting(
    subscriptionId: string,
    dto: CreateNotificationSettingDto,
  ): Promise<unknown> {
    const { data, error } = await this.supabase
      .from('notification_settings')
      .insert({
        subscription_id: subscriptionId,
        favorite_id: dto.favorite_id,
        enabled: dto.enabled ?? true,
        scheduled_time: dto.scheduled_time,
        scheduled_days: dto.scheduled_days,
      })
      .select()
      .single();

    if (error) {
      this.logger.error('알림 설정 생성 실패', error);
      throw new Error('알림 설정 생성에 실패했습니다');
    }

    return data as unknown;
  }

  async getNotificationSettingsByFavorite(
    favoriteId: string,
  ): Promise<unknown[]> {
    const { data, error } = await this.supabase
      .from('notification_settings')
      .select('*')
      .eq('favorite_id', favoriteId);

    if (error) {
      this.logger.error('알림 설정 조회 실패', error);
      throw new Error('알림 설정 조회에 실패했습니다');
    }

    return (data as unknown[]) || [];
  }

  async updateNotificationSetting(
    id: string,
    dto: UpdateNotificationSettingDto,
  ): Promise<unknown> {
    const { data, error } = await this.supabase
      .from('notification_settings')
      .update({
        enabled: dto.enabled,
        scheduled_time: dto.scheduled_time,
        scheduled_days: dto.scheduled_days,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error('알림 설정 수정 실패', error);
      throw new NotFoundException('알림 설정을 찾을 수 없습니다');
    }

    return data as unknown;
  }

  async deleteNotificationSetting(id: string) {
    const { error } = await this.supabase
      .from('notification_settings')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error('알림 설정 삭제 실패', error);
      throw new NotFoundException('알림 설정을 찾을 수 없습니다');
    }

    return { success: true };
  }

  // ===== Cron 스케줄러 (매 시간 정각) =====
  @Cron('0 * * * *')
  async handleScheduledNotifications() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentDay = now.getDay();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;

    this.logger.log(`시간 알림 체크: ${currentTime}, 요일: ${currentDay}`);

    const { data: settings, error } = await this.supabase
      .from('notification_settings')
      .select(
        `
        *,
        favorite:favorites(*),
        subscription:notification_subscriptions(*)
      `,
      )
      .eq('enabled', true)
      .eq('scheduled_time', currentTime)
      .not('scheduled_days', 'is', null);

    if (error) {
      this.logger.error('알림 설정 조회 실패', error);
      return;
    }

    const todaySettings = ((settings as NotificationSetting[]) || []).filter(
      (setting) => setting.scheduled_days?.includes(currentDay),
    );

    this.logger.log(`전송할 알림: ${todaySettings.length}개`);

    for (const setting of todaySettings) {
      try {
        const weather = await this.fetchWeather(
          setting.favorite.lat,
          setting.favorite.lon,
        );

        const message = this.selectMessage(weather);

        await this.sendPushNotification(setting.subscription, {
          title: setting.favorite.nickname || setting.favorite.name,
          body: message,
          icon: '/icons/icon-192x192.png',
          data: { url: '/', favoriteId: setting.favorite_id },
        });

        this.logger.log(
          `알림 전송 성공: ${setting.favorite.name} - "${message}"`,
        );
      } catch (error) {
        this.logger.error(`알림 전송 실패: ${setting.id}`, error);
      }
    }
  }

  // ===== Private: 메시지 선택 로직 =====
  private selectMessage(weather: WeatherData): string {
    // 두 JSON 파일 중 랜덤 선택
    const messagesFile: MessagesFile =
      Math.random() < 0.5
        ? (dyMessages as MessagesFile)
        : (busydogMessages as MessagesFile);

    const messages = messagesFile.messages;
    const today = new Date();
    const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const feelsLike = Math.round(weather.main.feels_like);
    const weatherMain = weather.weather[0]?.main;

    // 조건 필터링
    const matchedMessages = messages.filter((message) => {
      const {
        type,
        date,
        weatherMain: msgWeather,
        feelsLike: tempRange,
      } = message.conditions;

      if (type === 'specificDate') {
        if (!date) return false;
        if (date.length === 10) {
          return date === `${today.getFullYear()}-${monthDay}`;
        }
        return date === monthDay;
      }

      if (type === 'weather') {
        return weatherMain === msgWeather;
      }

      if (type === 'temperature') {
        if (!tempRange) return false;
        const minMatch = tempRange.min === null || feelsLike >= tempRange.min;
        const maxMatch = tempRange.max === null || feelsLike <= tempRange.max;
        return minMatch && maxMatch;
      }

      if (type === 'default') {
        return true;
      }

      return false;
    });

    // Priority 정렬 및 랜덤 선택
    const sortedMessages = matchedMessages.sort(
      (a, b) => b.priority - a.priority,
    );
    const highestPriority = sortedMessages[0]?.priority;
    const highestPriorityMessages = sortedMessages.filter(
      (msg) => msg.priority === highestPriority,
    );

    if (highestPriorityMessages.length === 0) {
      return '좋은 하루 보내세요!';
    }

    const randomIndex = Math.floor(
      Math.random() * highestPriorityMessages.length,
    );
    return highestPriorityMessages[randomIndex].text;
  }

  // ===== Private: 날씨 조회 =====
  private async fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    const apiKey = this.configService.get('OPENWEATHERMAP_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`날씨 조회 실패: ${response.statusText}`);
    }

    return response.json();
  }

  // ===== Private: 푸시 전송 =====
  private async sendPushNotification(
    subscription: NotificationSubscription,
    payload: NotificationPayload,
  ): Promise<void> {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
      },
    };

    try {
      await webPush.sendNotification(pushSubscription, JSON.stringify(payload));
    } catch (error: unknown) {
      const typedError = error as { statusCode?: number };
      if (typedError.statusCode === 410 || typedError.statusCode === 404) {
        this.logger.warn(`구독 만료, 삭제: ${subscription.endpoint}`);
        await this.supabase
          .from('notification_subscriptions')
          .delete()
          .eq('id', subscription.id);
      } else {
        throw error;
      }
    }
  }
}
