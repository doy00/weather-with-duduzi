-- display_order 컬럼 추가 (기본값 0)
ALTER TABLE favorites
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 기존 데이터 순서 할당 (created_at 기준)
WITH ordered_favorites AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS new_order
  FROM favorites
)
UPDATE favorites
SET display_order = ordered_favorites.new_order
FROM ordered_favorites
WHERE favorites.id = ordered_favorites.id;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_favorites_display_order ON favorites(display_order);

COMMENT ON COLUMN favorites.display_order IS '사용자 지정 표시 순서 (0부터 시작)';
