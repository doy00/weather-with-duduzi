# CI/CD 파이프라인 설정 가이드

## 📋 개요

이 프로젝트는 GitHub Actions와 Vercel을 사용한 완전 자동화된 CI/CD 파이프라인을 구축했습니다.

### 구성 요소

- **CI (Continuous Integration)**: 자동 린트, 타입 체크, 테스트, 빌드
- **Preview 배포**: PR 생성 시 자동으로 Preview 환경 배포
- **Production 배포**: main 브랜치 머지 시 프로덕션 자동 배포

---

## 🚀 워크플로우 구성

### 1. CI 워크플로우 (`.github/workflows/ci.yml`)

**트리거**:
- `main`, `development`, `feature/**` 브랜치에 push
- `main`, `development` 브랜치로 PR 생성

**실행 작업**:
- ✅ pnpm 의존성 설치 (캐싱 적용)
- ✅ TypeScript 타입 체크 (Frontend + Backend)
- ✅ Vitest 테스트 실행
- ✅ 프로덕션 빌드 검증

**장점**:
- 잘못된 코드가 main에 머지되는 것을 방지
- 빌드 실패를 PR 단계에서 조기 발견
- 타임아웃 10분 설정으로 무한 대기 방지

---

### 2. Preview 배포 워크플로우 (`.github/workflows/preview-deploy.yml`)

**트리거**:
- `main`, `development` 브랜치로 PR 생성/업데이트

**실행 작업**:
- ✅ Frontend 빌드
- ✅ Vercel Preview 환경 배포
- ✅ PR에 Preview URL 자동 코멘트

**Preview URL 예시**:
```
https://weather-with-duduzi-123.vercel.app
```

**장점**:
- QA/리뷰어가 실제 동작하는 버전 확인 가능
- 머지 전 사전 검증
- 각 PR마다 독립된 환경 제공

---

### 3. Production 배포 워크플로우 (`.github/workflows/production-deploy.yml`)

**트리거**:
- `main` 브랜치에 push (머지 완료 시)

**실행 작업**:
- ✅ 전체 테스트 재실행 (안전성 보장)
- ✅ 프로덕션 빌드
- ✅ Vercel Production 배포

**Production URL**:
```
https://weather-with-duduzi.vercel.app
```

**장점**:
- 수동 배포 불필요 (휴먼 에러 방지)
- 테스트 통과 후에만 배포
- 배포 시간 단축 (3-5분 이내)

---

## ⚙️ GitHub Secrets 설정

Vercel 배포를 위해 다음 Secrets를 **GitHub Repository Settings**에 추가해야 합니다.

### 1. Vercel 계정 생성 및 프로젝트 연동

#### Step 1: Vercel CLI 설치 및 로그인
```bash
# Vercel CLI 설치
pnpm add -g vercel

# Vercel 로그인
vercel login

# 프로젝트 연동 (루트에서 실행)
cd apps/frontend
vercel link
```

#### Step 2: Vercel 토큰 및 프로젝트 정보 확인

**Vercel Token 발급**:
1. https://vercel.com/account/tokens 접속
2. "Create Token" 클릭
3. 토큰 이름: `GitHub Actions CI/CD`
4. Scope: `Full Account`
5. 생성된 토큰 복사

**Organization ID 및 Project ID 확인**:
```bash
cat apps/frontend/.vercel/project.json
```

출력 예시:
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxx"
}
```

### 2. GitHub Secrets 등록

**Settings > Secrets and variables > Actions > New repository secret**

| Secret 이름 | 값 | 설명 |
|------------|-----|------|
| `VERCEL_TOKEN` | `vercel_xxxxxx` | Vercel API 토큰 |
| `VERCEL_ORG_ID` | `team_xxxxxx` | Vercel Organization ID |
| `VERCEL_PROJECT_ID` | `prj_xxxxxx` | Vercel Project ID |
| `GEMINI_API_KEY` | `AIzaSyxxxxxx` | Google Gemini API 키 |

---

## 🔧 Vercel 환경 변수 설정

Vercel 대시보드에서 환경 변수 추가:

1. https://vercel.com/dashboard 접속
2. 프로젝트 선택
3. **Settings > Environment Variables**
4. 다음 변수 추가:

| 변수명 | 값 | 환경 |
|--------|-----|------|
| `GEMINI_API_KEY` | `AIzaSyxxxxxx` | Production, Preview |

---

## 📝 사용 방법

### 일반적인 개발 플로우

```bash
# 1. 새 기능 브랜치 생성
git checkout -b feature/add-new-feature

# 2. 코드 작성 및 커밋
git add .
git commit -m "feat: 새 기능 추가"

# 3. 푸시
git push origin feature/add-new-feature

# 4. GitHub에서 PR 생성
# → CI 자동 실행 (타입 체크, 테스트, 빌드)
# → Preview 배포 자동 실행
# → PR에 Preview URL 코멘트 자동 추가

# 5. 리뷰 및 머지
# → main 브랜치에 머지
# → Production 배포 자동 실행
```

### PR 생성 시 자동으로 실행되는 것

✅ **CI 워크플로우** (약 3-5분 소요)
- TypeScript 타입 체크
- Vitest 테스트 실행
- 빌드 검증

✅ **Preview 배포** (약 2-3분 소요)
- Frontend 빌드
- Vercel Preview 환경 배포
- PR에 Preview URL 코멘트

### main 브랜치 머지 시 자동으로 실행되는 것

✅ **Production 배포** (약 3-5분 소요)
- 전체 테스트 재실행
- 프로덕션 빌드
- Vercel Production 배포

---

## 🚨 트러블슈팅

### 1. CI 실패 시

#### 타입 에러
```bash
# 로컬에서 타입 체크
pnpm --filter frontend exec tsc --noEmit
```

#### 테스트 실패
```bash
# 로컬에서 테스트 실행
pnpm --filter frontend test:run
```

#### 빌드 실패
```bash
# 로컬에서 빌드 테스트
pnpm --filter frontend build
```

### 2. Vercel 배포 실패 시

#### 환경 변수 누락
- GitHub Secrets 확인: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Vercel 대시보드에서 `GEMINI_API_KEY` 확인

#### 빌드 커맨드 오류
```bash
# vercel.json 확인
cat apps/frontend/vercel.json
```

#### 로그 확인
1. GitHub Actions 탭에서 실패한 워크플로우 클릭
2. 실패한 Job 클릭
3. 에러 메시지 확인

### 3. Preview URL이 코멘트되지 않을 때

**원인**: GitHub Actions 권한 부족

**해결**:
1. Repository Settings > Actions > General
2. **Workflow permissions** 섹션에서
3. ✅ **Read and write permissions** 선택
4. ✅ **Allow GitHub Actions to create and approve pull requests** 체크

---

## 📊 워크플로우 성능

### 예상 실행 시간

| 워크플로우 | 평균 소요 시간 | 비고 |
|----------|--------------|------|
| CI (Lint & Test) | 3-5분 | 캐싱 적용 시 2-3분 |
| Preview 배포 | 2-4분 | Vercel 빌드 포함 |
| Production 배포 | 4-6분 | 테스트 + 빌드 + 배포 |

### 캐싱 전략

- ✅ pnpm 의존성 캐싱 (Node.js setup action)
- ✅ Vercel 빌드 캐싱 (자동)
- ✅ GitHub Actions 캐시 (dependencies)

---

## 🔒 보안 고려사항

### 환경 변수 보호

- ❌ 절대 `.env` 파일을 Git에 커밋하지 않기
- ✅ GitHub Secrets 사용
- ✅ Vercel Environment Variables 사용

### 의존성 보안

```bash
# 취약점 스캔 (수동)
pnpm audit

# 자동 업데이트 (Dependabot 권장)
# .github/dependabot.yml 추가 고려
```

---

## 📈 향후 개선 사항

### 추가 가능한 기능

1. **ESLint 워크플로우 추가**
   ```yaml
   - name: Run ESLint
     run: pnpm --filter frontend lint
   ```

2. **테스트 커버리지 리포트**
   ```yaml
   - name: Upload coverage to Codecov
     uses: codecov/codecov-action@v4
   ```

3. **성능 모니터링 (Lighthouse CI)**
   ```yaml
   - name: Run Lighthouse CI
     uses: treosh/lighthouse-ci-action@v10
   ```

4. **자동 릴리즈 노트 생성**
   ```yaml
   - name: Generate release notes
     uses: release-drafter/release-drafter@v5
   ```

5. **Slack/Discord 알림**
   ```yaml
   - name: Notify Slack
     uses: 8398a7/action-slack@v3
   ```

---

## 📚 참고 자료

- [GitHub Actions 공식 문서](https://docs.github.com/en/actions)
- [Vercel 배포 가이드](https://vercel.com/docs/deployments/overview)
- [pnpm Workspace CI 설정](https://pnpm.io/continuous-integration)

---

## ✅ 체크리스트

CI/CD 파이프라인 구축 완료 여부를 확인하세요:

- [ ] `.github/workflows/ci.yml` 파일 존재
- [ ] `.github/workflows/preview-deploy.yml` 파일 존재
- [ ] `.github/workflows/production-deploy.yml` 파일 존재
- [ ] `apps/frontend/vercel.json` 파일 존재
- [ ] GitHub Secrets 설정 완료
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
  - [ ] `GEMINI_API_KEY`
- [ ] Vercel 환경 변수 설정 완료
- [ ] GitHub Actions Workflow permissions 설정
- [ ] 첫 PR 생성 및 Preview 배포 테스트
- [ ] main 브랜치 머지 및 Production 배포 테스트

---

**구축 완료! 🎉**

이제 모든 PR마다 자동으로 CI가 실행되고, Preview가 배포되며, main 머지 시 자동으로 프로덕션에 배포됩니다.
