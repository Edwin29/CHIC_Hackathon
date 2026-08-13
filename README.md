# 귀농 통합서비스 MVP

해커톤용 `귀농 통합서비스` MVP 저장소입니다. 현재 기준 문서는 루트의 `00_READ_THIS_FIRST.md`부터 `09_OFFICIAL_DATA_SOURCES.md`까지이며, 구현은 `07_CODEX_WORK_PACKETS.md`의 PACKET 순서를 따릅니다.

## PACKET 0 기준선

이 단계는 실제 기능을 구현하지 않고 프론트엔드와 백엔드의 책임 경계를 고정합니다.

### Frontend

- 위치: `gwinong-frontend`
- 기술: React + TypeScript + Vite
- 책임: 화면, local profile, navigation, backend client, loading/error/fallback 상태, demo fixtures
- 금지: 기상청 직접 호출, API key 보관, 기상 데이터 해석, 실제 정책 자격판정, OCR/AI 계약 판정
- 교체 가능 영역: `src/features/*/ui`, `src/pages`, `src/styles`, `src/assets`
- 기능 계약 영역: `src/domain`, `src/stores`, `src/services`, `src/fixtures`, `src/features/*/model`

### Backend

- 위치: `gwinong-backend`
- 기술: TypeScript + Supabase Edge Function 형태
- 책임: weather endpoint, API key 보호, 지역 해석, KMA adapter, normalize, timeout/error, fixture fallback
- 금지: UI 의존, raw KMA response 노출, frontend로 API key 전달, DB/Auth/LLM 도입

## PACKET 1 온보딩 + UserProfile

- `/onboarding`에서 이름, 현재 귀농단계, C1~C6 객관식 입력을 받습니다.
- `모르겠어요` 선택은 후속 질문 루프 없이 `null` 값과 `unknownFields`로 저장합니다.
- 완료 시 `UserProfile`을 LocalStorage에 저장하고 `/home`으로 이동합니다.
- 김미숙 데모 로더는 문서의 데모 프로필을 그대로 LocalStorage에 저장합니다.
- 현재 단계는 사용자가 직접 선택한 값을 저장하며 C1~C6로 재추론하지 않습니다.

## PACKET 2 Home Functional Shell

- `/home`은 저장된 프로필의 이름과 현재 귀농단계를 표시합니다.
- 6단계 로드맵은 `궁금증 → 탐색 → 계획 → 준비 → 실행 → 자립` 순서이며, 현재 단계만 강조합니다.
- 정부 지원 매칭, 농장 날씨·위험, 현장체험 연결, 거래 서면 점검, 프로필 마저 설정하기는 route 이동 CTA만 제공합니다.
- 실제 정책 fixture, 날씨 API 호출, 현장체험 fixture, 계약서 샘플 분석은 다음 패킷 범위입니다.

## PACKET 3 Backend Weather API v1

- 논리 endpoint: `GET /v1/weather/summary?region=충청북도%20괴산군&crop=고추`
- 서버 환경변수: `KMA_SERVICE_KEY`
- v1 지원 지역은 `충청북도 괴산군`이며 KMA 격자는 공식 단기예보 활용가이드 좌표표 기준 `nx=74`, `ny=111`입니다.
- KMA 호출은 백엔드 adapter 안에서만 수행하며 서비스키와 raw KMA 응답은 프론트엔드에 노출하지 않습니다.
- `TMP/REH/POP/PTY/WSD/SKY`만 `WeatherSummary`로 normalize합니다.
- 서비스키 누락, timeout, upstream 오류, malformed 응답은 `live.forecast=false` fixture fallback을 반환합니다.
- 미지원 지역은 `unsupported_region` 오류로 응답합니다.

## PACKET 4 Frontend Weather Integration

- `/weather`는 저장된 `UserProfile.targetRegion`과 `targetCrop`을 자동으로 사용합니다.
- View는 직접 `fetch`하지 않고 `useWeatherSummary` hook과 `WeatherService`를 통해 조회합니다.
- 기본 개발 API base URL은 `http://127.0.0.1:54321`이며, `VITE_WEATHER_API_BASE_URL`로 교체할 수 있습니다.
- `VITE_WEATHER_SERVICE_MODE=mock`이면 `MockWeatherService` fixture를 사용합니다.
- 화면 상태는 loading, success-live, success-fixture, unsupported-region, error로 분리합니다.

## PACKET 5 Dummy Feature Pack

- `/policies`는 괴산군 공식 귀농귀촌 지원정책 원문을 확인한 fixture 2건을 표시합니다.
- 정책 화면은 `현재 프로필 기준 추천 예시`와 `최종 자격은 공식 공고에서 확인`을 명시합니다.
- `/field-programs`는 공식 링크 기반 현장체험 fixture 3건을 표시하며 자동예약·직접중개를 제공하지 않습니다.
- `/profile`은 `unknownFields` 기반 교육·자료 fixture를 보여줍니다.
- `/contract-check`은 파일 선택 후 샘플 분석 fixture를 표시하며 OCR이나 법률판단을 하지 않습니다.

## Scripts

```bash
pnpm install
pnpm dev
pnpm dev:backend
pnpm lint
pnpm --filter gwinong-backend test
pnpm --filter gwinong-backend test:weather:live
pnpm typecheck
```
