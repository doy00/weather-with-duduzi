-- 알림 시스템 테이블 생성

-- 1. notification_subscriptions: 푸시 구독 정보 (기기별)
CREATE TABLE IF NOT EXISTS notification_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,        -- 기기 고유 ID 역할
  p256dh TEXT NOT NULL,                 -- 암호화 키
  auth TEXT NOT NULL,                   -- 인증 키
  user_agent TEXT,                      -- 브라우저 정보
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스: endpoint로 빠른 조회
CREATE INDEX IF NOT EXISTS idx_subscriptions_endpoint
ON notification_subscriptions(endpoint);

-- 2. notification_settings: 알림 설정 (즐겨찾기별)
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES notification_subscriptions(id) ON DELETE CASCADE,
  favorite_id UUID REFERENCES favorites(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,

  -- 시간대별 알림 설정 (MVP)
  scheduled_time TIME,                  -- 예: 07:00:00
  scheduled_days INTEGER[],             -- 요일 배열 [1,2,3,4,5] = 평일 (0=일요일, 6=토요일)

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 동일 구독에서 동일 즐겨찾기의 중복 설정 방지
  UNIQUE(subscription_id, favorite_id)
);

-- 인덱스: 효율적인 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_settings_subscription
ON notification_settings(subscription_id);

CREATE INDEX IF NOT EXISTS idx_settings_favorite
ON notification_settings(favorite_id);

CREATE INDEX IF NOT EXISTS idx_settings_scheduled_time
ON notification_settings(scheduled_time);

CREATE INDEX IF NOT EXISTS idx_settings_enabled
ON notification_settings(enabled);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_subscriptions_updated_at
BEFORE UPDATE ON notification_subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
BEFORE UPDATE ON notification_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 코멘트 추가
COMMENT ON TABLE notification_subscriptions IS '푸시 알림 구독 정보 (기기별 관리)';
COMMENT ON TABLE notification_settings IS '알림 설정 (즐겨찾기별 시간대 알림)';
COMMENT ON COLUMN notification_settings.scheduled_days IS '요일 배열: 0=일요일, 1=월요일, ..., 6=토요일';
