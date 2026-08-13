# Codex 작업 패킷

각 패킷은 앞 패킷 완료 후 진행한다. 다음 패킷을 선행 구현하지 않는다.

## PACKET 0 — 프로젝트 기준선

목적: FE/BE 경계 고정.

Frontend:
- React + TypeScript + Vite
- route placeholder
- domain/store/service/fixture/ui 분리

Backend:
- TypeScript + Supabase Edge Function 골격
- weather shared module 골격

금지: 실제 디자인/API/DB/AI.

완료: 양쪽 실행, lint/typecheck, README 책임 경계.

Branch: `chore/project-foundation`

---

## PACKET 1 — 온보딩 + UserProfile

- 현재 귀농단계 직접 선택
- C1~C6
- 모르겠어요
- LocalStorage
- `/onboarding → /home`
- 김미숙 demo loader

규칙:
- LLM 없음
- Backend 없음
- stage 재추론 없음
- unknownFields 저장

Branch: `feat/onboarding-profile`

---

## PACKET 2 — Home Functional Shell

- 이름
- 현재 단계
- 6단계 roadmap
- 정책 CTA
- 날씨
- 현장체험
- 계약서
- 프로필 마저 설정하기

기능은 route 이동만. 디자인 고정 금지.

Branch: `feat/home-shell`

---

## PACKET 3 — Backend Weather API v1

목적: 기상청 단기예보 실제 연동.

논리 endpoint: `GET /v1/weather/summary`

입력: region, crop

```text
HTTP
→ WeatherApplicationService
→ LocationResolver
→ KmaForecastAdapter
→ Normalizer
→ WeatherSummary
```

v1 지역: 충청북도 괴산군.

필수:
- KMA_SERVICE_KEY server only
- 공식 grid 검증
- 최신 사용 가능한 base_date/base_time
- TMP/REH/POP/PTY/WSD/SKY normalize
- timeout
- fixture fallback
- live flag

테스트: 정상/no key/timeout/malformed/unsupported/fallback.

Branch: `feat/weather-api-v1`

---

## PACKET 4 — Frontend Weather Integration

```ts
interface WeatherService {
  getSummary(region: string, crop?: string): Promise<WeatherSummary>;
}
```

- HttpWeatherService
- MockWeatherService
- useWeatherSummary
- /weather
- profile region/crop 자동 사용

상태: loading/live/fallback/unsupported/error.

View 직접 fetch 금지.

Branch: `feat/weather-integration`

---

## CHECKPOINT A — 핵심 MVP

```text
온보딩 → 김미숙 → 홈 → 탐색 → 농장 날씨·위험 → 괴산 실제 KMA
```

이 흐름을 검증하고 PACKET 5로 간다.

---

## PACKET 5 — Dummy Feature Pack

정책:
- 공식 정책 1~2건 fixture
- profile 단순 필터
- 공식 링크
- 자격 확정 금지

프로필:
- unknownFields
- 교육/자료 fixture

현장체험:
- 공식 프로그램 2~3건 fixture
- region/crop 단순 필터
- 공식 링크

계약:
- 파일 선택 → 분석 중 → fixture
- 데모 문구

Branch: `feat/demo-feature-pack`

---

## PACKET 6 — 기상특보 (선택)

핵심 MVP가 완성된 경우에만.
- KmaWarningAdapter
- warnings normalize
- live.warnings

지역코드 연결이 불안정하면 중단.

Branch: `feat/weather-warnings`

---

## PACKET 7 — 작물 정보 (선택)

우선 공식 링크 fixture.
시간이 충분하면 농촌진흥청 adapter.

금지: 날씨→병명 확정, 농약 추천.

Branch: `feat/crop-guidance`

---

## PACKET 8 — Demo Hardening

새 기능 금지.

골든패스:
`온보딩 → 홈 → 실제 weather → 정책 fixture → 현장체험 fixture → 계약 fixture`

Frontend: localStorage/refresh/loading/error/fallback/routes/design boundary.
Backend: CORS/key/timeout/unsupported/fallback.

Branch: `fix/demo-hardening`
