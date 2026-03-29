# 즐겨찾기 기능 완성 - 설정 가이드

## ✅ 완료된 작업

1. ✅ 모노레포 구조 전환 완료
2. ✅ NestJS 백엔드 구축 완료
3. ✅ 프론트엔드 리팩토링 완료
4. ✅ API 클라이언트 & React Query 통합 완료
5. ✅ 빌드 테스트 통과

## 🔧 남은 설정 단계

### 1. Supabase 프로젝트에서 API Key 가져오기

1. **Supabase Dashboard** 접속: https://supabase.com/dashboard
2. 프로젝트 선택: `cdltkcztuvijnmebxeuz`
3. **Settings** → **API** 메뉴 이동
4. 다음 값 복사:
   - **Project URL**: `https://cdltkcztuvijnmebxeuz.supabase.co`
   - **anon public key**: `eyJ...` (긴 JWT 토큰)

### 2. 백엔드 환경 변수 설정

`apps/backend/.env` 파일 수정:

```env
SUPABASE_URL=https://cdltkcztuvijnmebxeuz.supabase.co
SUPABASE_ANON_KEY=여기에_실제_anon_key_입력
PORT=3001
```

### 3. Supabase에 테이블 생성

**방법 1: Supabase Dashboard SQL Editor 사용**

1. Supabase Dashboard → **SQL Editor** 메뉴
2. 루트 디렉토리의 `setup-supabase.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기
4. **RUN** 버튼 클릭

**방법 2: MCP를 통한 자동 실행 (이미 설정됨)**

MCP가 이미 설정되어 있으므로, 다음 명령어로 실행 가능합니다:

```bash
# SQL 파일을 Supabase에 직접 실행
# (MCP 도구가 제공하는 경우)
```

### 4. 서버 실행

**백엔드 서버**:
```bash
pnpm dev:backend
```

**프론트엔드 개발 서버**:
```bash
pnpm dev
```

**동시 실행**:
```bash
pnpm dev:all
```

### 5. 테스트

1. **프론트엔드** → http://localhost:5173
2. **백엔드 API** → http://localhost:3001/api/favorites

**기능 테스트 체크리스트**:
- [ ] 즐겨찾기 추가 (성공 시 Toast 표시)
- [ ] 중복 추가 시 에러 메시지
- [ ] 6개 초과 시 에러 메시지
- [ ] 즐겨찾기 삭제
- [ ] 별칭 수정
- [ ] 페이지 새로고침 후 데이터 유지

## 📁 주요 변경 파일

### 백엔드
- `apps/backend/src/favorites/` - Favorites 모듈
- `apps/backend/src/supabase/` - Supabase 연동
- `apps/backend/.env` - 환경 변수 (설정 필요)

### 프론트엔드
- `apps/frontend/src/features/favorites/hooks/useFavoritesQuery.ts` - React Query 훅
- `apps/frontend/src/features/favorites/services/favoritesApi.ts` - API 클라이언트
- `apps/frontend/src/lib/error.ts` - 에러 핸들러
- `apps/frontend/src/features/shared/components/Toast.tsx` - Toast UI
- `apps/frontend/src/pages/MainPage.tsx` - 메인 페이지 (alert → toast)

### 삭제된 파일
- `apps/frontend/src/features/favorites/hooks/useFavorites.ts` (localStorage 버전)

## 🚀 다음 단계

환경 변수를 설정하고 테이블을 생성한 후:

```bash
# 개발 서버 시작
pnpm dev:all
```

브라우저에서 http://localhost:5173 접속하여 테스트하세요!
