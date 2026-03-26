# 📚 프로젝트 문서

이 폴더는 Weather with Duduzi 프로젝트의 기술 문서를 포함합니다.

---

## 📋 문서 목록

### 구현 가이드

| 문서 | 설명 | 작성일 |
|------|------|--------|
| [I18N_IMPLEMENTATION.md](./I18N_IMPLEMENTATION.md) | 7개 언어 다국어 지원 구현 (Gemini API 자동 번역) | 2026-03-26 |
| [PWA_SETUP_COMPLETE.md](./PWA_SETUP_COMPLETE.md) | PWA (Progressive Web App) 구현 가이드 | - |
| [ANDROID_WIDGET_COMPLETE.md](./ANDROID_WIDGET_COMPLETE.md) | Android 위젯 구현 가이드 | - |
| [CI_CD_SETUP.md](./CI_CD_SETUP.md) | CI/CD 파이프라인 설정 가이드 | - |

### 기술 문서

| 문서 | 설명 | 작성일 |
|------|------|--------|
| [TECH_STACK_ANALYSIS.md](./TECH_STACK_ANALYSIS.md) | 기술 스택 분석 및 선정 이유 | - |
| [README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md) | 프로젝트 구현 상세 설명 | - |

### 설치 가이드

| 문서 | 설명 | 작성일 |
|------|------|--------|
| [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) | 프로젝트 설치 및 초기 설정 가이드 | - |

---

## 🔍 빠른 찾기

### 다국어 지원을 구현하고 싶다면
→ [I18N_IMPLEMENTATION.md](./I18N_IMPLEMENTATION.md)
- AI 기반 자동 번역 (Gemini API)
- 7개 언어 지원 (한국어, 영어, 일본어, 인도네시아어, 태국어, 베트남어, 스페인어)
- GitHub Actions 자동화

### PWA로 만들고 싶다면
→ [PWA_SETUP_COMPLETE.md](./PWA_SETUP_COMPLETE.md)
- Service Worker 구현
- 오프라인 지원
- 앱 설치 기능

### Android 위젯을 추가하고 싶다면
→ [ANDROID_WIDGET_COMPLETE.md](./ANDROID_WIDGET_COMPLETE.md)
- Capacitor 설정
- 네이티브 Android 위젯

### CI/CD를 설정하고 싶다면
→ [CI_CD_SETUP.md](./CI_CD_SETUP.md)
- GitHub Actions 워크플로우
- 자동 배포 설정

### 기술 스택을 이해하고 싶다면
→ [TECH_STACK_ANALYSIS.md](./TECH_STACK_ANALYSIS.md)
- React 19 + TypeScript
- Vite + TailwindCSS v4
- Zustand + React Query

### 프로젝트 설치부터 시작하고 싶다면
→ [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- 환경 설정
- 의존성 설치
- 개발 서버 실행

---

## 📝 문서 작성 가이드

새로운 기능을 구현하면 다음 형식으로 문서를 작성해주세요:

```markdown
# 기능 이름

**날짜**: YYYY-MM-DD
**상태**: ✅ 구현 완료 / 🚧 진행 중 / 📋 계획됨

## 개요
(간단한 설명)

## 구현 내용
(상세 구현 설명)

## 사용 방법
(개발자 가이드)

## 트러블슈팅
(자주 발생하는 문제 및 해결 방법)

## 참고 자료
(외부 링크, API 문서 등)
```

---

**마지막 업데이트**: 2026-03-26
