# Weather with Duduzi - API 문서

## 📚 개요

날씨 앱 + Daily Inspiration Message 백엔드 API 문서입니다.

## 🚀 시작하기

### 1. 서버 실행

```bash
cd apps/backend
pnpm install
pnpm start:dev
```

### 2. API 문서 확인

서버 실행 후 브라우저에서 아래 URL로 접속하세요.

```
http://localhost:3001/api/docs
```

**Swagger UI**로 제공되는 인터랙티브 API 문서를 확인할 수 있습니다.

## 📖 API 엔드포인트

### Base URL

```
http://localhost:3001
```

### Favorites API

#### 1. 즐겨찾기 목록 조회

```http
GET /api/favorites
```

**응답 예시**

```json
{
  "favorites": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "full_name": "서울특별시 강남구",
      "name": "강남구",
      "nickname": "우리집",
      "lat": 37.4979,
      "lon": 127.0276,
      "created_at": "2024-01-24T12:00:00Z",
      "updated_at": "2024-01-24T12:00:00Z"
    }
  ]
}
```

#### 2. 즐겨찾기 추가

```http
POST /api/favorites
```

**요청 본문**

```json
{
  "fullName": "서울특별시 강남구",
  "name": "강남구",
  "nickname": "우리집",
  "lat": 37.4979,
  "lon": 127.0276
}
```

**필드 설명**

| 필드       | 타입   | 필수 | 설명                          |
| ---------- | ------ | ---- | ----------------------------- |
| fullName   | string | ✅   | 지역 전체 이름                |
| name       | string | ✅   | 지역 간략 이름                |
| nickname   | string | ❌   | 사용자 지정 닉네임            |
| lat        | number | ✅   | 위도 (-90 ~ 90)               |
| lon        | number | ✅   | 경도 (-180 ~ 180)             |

**응답 예시**

```json
{
  "favorite": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "full_name": "서울특별시 강남구",
    "name": "강남구",
    "nickname": "우리집",
    "lat": 37.4979,
    "lon": 127.0276,
    "created_at": "2024-01-24T12:00:00Z",
    "updated_at": "2024-01-24T12:00:00Z"
  }
}
```

#### 3. 즐겨찾기 닉네임 수정

```http
PATCH /api/favorites/:id/nickname
```

**요청 본문**

```json
{
  "nickname": "회사"
}
```

**응답 예시**

```json
{
  "favorite": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "full_name": "서울특별시 강남구",
    "name": "강남구",
    "nickname": "회사",
    "lat": 37.4979,
    "lon": 127.0276,
    "created_at": "2024-01-24T12:00:00Z",
    "updated_at": "2024-01-24T12:05:00Z"
  }
}
```

#### 4. 즐겨찾기 삭제

```http
DELETE /api/favorites/:id
```

**응답**

- 상태 코드: `204 No Content`
- 응답 본문 없음

## 🧪 Postman으로 테스트하기

### 1. Postman Collection 가져오기

1. Postman 앱 실행
2. **Import** 버튼 클릭
3. `apps/backend/postman_collection.json` 파일 선택
4. **Import** 클릭

### 2. Environment 설정 (선택)

Collection에 이미 `baseUrl` 변수가 설정되어 있습니다.

```
baseUrl: http://localhost:3001
```

다른 환경(운영 서버 등)에서 테스트하려면 Environment를 생성하세요.

### 3. 요청 실행

1. **Weather with Duduzi API** Collection 열기
2. **Favorites** 폴더 확장
3. 원하는 API 선택 (예: "Get All Favorites")
4. **Send** 버튼 클릭

**Sample Response**가 미리 저장되어 있어 API 응답 형식을 참고할 수 있습니다.

## 🔧 에러 응답

### 400 Bad Request (유효성 검증 실패)

```json
{
  "statusCode": 400,
  "message": [
    "lat must not be greater than 90",
    "lon must be a number conforming to the specified constraints"
  ],
  "error": "Bad Request"
}
```

### 404 Not Found (리소스 없음)

```json
{
  "statusCode": 404,
  "message": "즐겨찾기를 찾을 수 없습니다",
  "error": "Not Found"
}
```

### 500 Internal Server Error (서버 오류)

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## 📝 API 스펙

### Validation Rules

#### CreateFavoriteDto

- `fullName`: string, 필수
- `name`: string, 필수
- `nickname`: string, 선택
- `lat`: number, 필수, -90 ~ 90 범위
- `lon`: number, 필수, -180 ~ 180 범위

#### UpdateNicknameDto

- `nickname`: string, 필수, 최소 1자

### Response Wrapper

모든 성공 응답은 객체로 감싸집니다.

```typescript
// 단일 리소스
{ "favorite": FavoriteEntity }

// 리소스 배열
{ "favorites": FavoriteEntity[] }
```

## 🌐 CORS 설정

현재 개발 환경에서는 다음 origin만 허용합니다.

```
http://localhost:5173
```

운영 환경 배포 시 `main.ts`에서 CORS 설정을 업데이트하세요.

## 📦 스키마 정보

### FavoriteEntity

```typescript
{
  id: string;              // UUID
  user_id?: string;        // 사용자 ID (향후 인증 구현 시)
  full_name: string;       // 지역 전체 이름
  name: string;            // 지역 간략 이름
  nickname?: string;       // 사용자 지정 닉네임
  lat: number;             // 위도
  lon: number;             // 경도
  created_at: string;      // 생성 일시 (ISO 8601)
  updated_at: string;      // 수정 일시 (ISO 8601)
}
```

## 🔗 관련 링크

- **Swagger UI**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **OpenAPI JSON**: [http://localhost:3001/api/docs-json](http://localhost:3001/api/docs-json)
- **Postman Collection**: `apps/backend/postman_collection.json`

## 🚧 향후 계획

- [ ] 사용자 인증 (JWT)
- [ ] API Rate Limiting
- [ ] Pagination 추가
- [ ] 에러 로깅 (Sentry)
- [ ] API 버저닝 (v1, v2)
