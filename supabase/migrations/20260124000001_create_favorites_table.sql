-- favorites 테이블 생성
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  full_name TEXT NOT NULL,
  name TEXT NOT NULL,
  nickname TEXT,
  lat NUMERIC(10, 7) NOT NULL,
  lon NUMERIC(10, 7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_full_name ON favorites(full_name);

-- RLS (Row Level Security) 활성화
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 임시 정책: 모든 사용자 읽기/쓰기 허용 (인증 구현 전)
DROP POLICY IF EXISTS "Enable all for everyone" ON favorites;
CREATE POLICY "Enable all for everyone" ON favorites
  FOR ALL USING (true);
