# MVP 기능 명세

## 1. Route

```text
/onboarding
/home
/weather
/policies
/field-programs
/contract-check
/profile
```

## 2. 온보딩

첫 질문 예:
> 요즘 귀농 준비, 어디까지 오셨어요?

선택:
- 아직 고민만 하고 있어요 → curiosity
- 지역·작물 정보를 알아보는 중이에요 → exploration
- 자금·계획을 준비 중이에요 → planning
- 실행 준비를 구체화하고 있어요 → preparation
- 이미 농사를 시작했어요 → execution
- 농장을 운영하며 정착 중이에요 → settlement

### C1~C6

- C1 귀농·귀촌 목적
- C2 희망 시기
- C3 정보수집 상태
- C4 가족 논의 상태
- C5 지역·작목
- C6 교육·영농경험

`모르겠어요`는 루프를 돌리지 않고 null/unknown으로 저장하고 `unknownFields`에 추가한다.

## 3. 홈

필수:

```text
안녕하세요, {name}님
지금은 {stageLabel}이에요
```

로드맵:
`궁금증 → 탐색 → 계획 → 준비 → 실행 → 자립`

상시 CTA:
- 정부 지원 매칭 확인하기

기능:
- 농장 날씨·위험
- 현장체험 연결
- 거래 서면 점검
- 프로필 마저 설정하기

## 4. 정부 지원 매칭

Frontend fixture.

```ts
interface PolicyFixture {
  id: string;
  title: string;
  organization: string;
  summary: string;
  targetText: string;
  regionTags: string[];
  sourceUrl: string;
  demoMatchReason: string;
}
```

표시: `현재 프로필 기준 추천 예시` / `최종 자격은 공식 공고에서 확인`.

## 5. 현장체험 연결

Frontend fixture + 공식 링크.

- 직접 연락처 중개 없음
- 자동 예약 없음
- 실시간 잔여석 없음
- 공식 페이지 연결

## 6. 계약서 점검

```text
파일 선택 → 분석 중 → 샘플 결과
```

예:
- 거래 당사자: 확인
- 거래 금액: 확인
- 지급기한: 확인 필요
- 반품·감액 기준: 확인 필요

반드시 `현재 데모에서는 샘플 분석 결과를 제공합니다.` 표시.

## 7. 농장 날씨·위험

입력:
- profile.targetRegion
- profile.targetCrop

출력:
- 위치
- 작물
- 예보 조회 시각
- 기온
- 습도
- 강수확률
- 강수형태
- 풍속
- 하늘상태
- live 여부

v1:
- 기상특보 미구현
- crop guidance 미구현

## 8. live / fixture

```ts
type DataMode = "live" | "fixture";
```

더미를 실시간처럼 표현하지 않는다.
