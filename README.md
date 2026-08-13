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

## PACKET 6 기상특보 (선택, 완료)

- `WeatherSummary.warnings`와 `live.warnings`를 채우는 `KmaWarningAdapter` + `normalizeKmaWarnings`를 추가했습니다.
- 특보 조회는 예보 조회와 완전히 독립적으로 동작합니다. 즉 특보 조회가 실패해도 `live.forecast`는 영향받지 않고 `live.warnings`만 false로 내려갑니다.
- 괴산군 특보구역코드(`warningStnId`, `location-resolver.ts`)는 이 작업을 수행한 네트워크 환경에서 `data.go.kr`/`apihub.kma.go.kr`/`data.kma.go.kr` 접근이 모두 차단되어 공식 매핑 서비스로 교차검증하지 못했습니다. 프로젝트 담당자가 직접 제공한 값을 사용했으며, 응답 형식이 예상과 다르면 무조건 fixture fallback(`live.warnings=false`)으로 떨어지도록 방어적으로 구현되어 있습니다. 실제 네트워크 접근이 가능한 환경에서 `pnpm --filter gwinong-backend test:weather:live` 실행 결과의 `liveWarnings` 값을 한 번 확인하는 것을 권장합니다.

## PACKET 7 작물 정보 (선택, 완료)

- `WeatherSummary.cropGuidance`(계약에는 PACKET 3부터 있었지만 비어 있던 필드)를 실제 fixture로 채웠습니다.
- 농촌진흥청 라이브 adapter는 구현하지 않았습니다 — 문서의 "우선 공식 링크 fixture" 지침과, PACKET 6에서 확인된 `*.go.kr` 전체 네트워크 차단, 그리고 `08_ACCEPTANCE_AND_DEMO.md`의 자르는 순서 1순위라는 점을 감안한 결정입니다.
- 링크는 검증 가능한 최상위 공식 도메인(`nongsaro.go.kr`, `rda.go.kr`)만 사용했습니다. 세부 게시글 경로는 이 환경에서 확인할 수 없어 추측해 넣지 않았습니다.
- 날씨 값에서 병명을 확정하거나 농약을 추천하지 않습니다.

## PACKET 8 Demo Hardening (완료)

- 새 기능을 추가하지 않고 골든패스(온보딩 → 홈 → 실제 weather → 정책 fixture → 현장체험 fixture → 계약 fixture)를 헤드리스 브라우저로 직접 클릭해 검증했습니다.
- LocalStorage 새로고침 복구, weather의 loading/success-live/success-fixture/error 상태, 계약서 파일선택→분석중→fixture 흐름을 모두 확인했습니다.
- 백엔드는 CORS preflight, `unsupported_region`(400), 없는 라우트(404), 잘못된 메서드(405), 키 누락/timeout/malformed fallback을 모두 확인했습니다.
- 결함이 발견되지 않아 코드 변경 없이 통과했습니다.

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
