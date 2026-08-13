# UserProfile 및 Demo Fixtures

## 김미숙 데모

```json
{
  "name": "김미숙",
  "currentStage": "exploration",
  "purpose": "farming",
  "targetPeriod": "within_1_year",
  "informationLevel": "mixed",
  "familyDiscussion": "partial",
  "targetRegion": "충청북도 괴산군",
  "targetCrop": "고추",
  "educationExperience": "theory",
  "farmingExperience": "none",
  "unknownFields": []
}
```

## 온보딩 enum 권장

```ts
type CurrentStage = "curiosity" | "exploration" | "planning" | "preparation" | "execution" | "settlement";
type Purpose = "farming" | "rural_life" | "undecided" | "unknown";
type TargetPeriod = "within_6_months" | "within_1_year" | "one_to_three_years" | "undecided" | "unknown";
type InformationLevel = "none" | "informal_only" | "official_checked" | "consulted_or_educated" | "unknown";
type FamilyDiscussion = "discussed" | "partial" | "not_discussed" | "not_applicable" | "unknown";
type EducationExperience = "none" | "theory" | "field_experience" | "practical_course" | "unknown";
type FarmingExperience = "none" | "short_help" | "field_practice" | "actual_farming" | "unknown";
```

## 정책 fixture

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
  dataMode: "fixture";
}
```

구현 시 현재 공식 원문을 직접 확인한 1~2건만 넣는다.

## 교육 fixture

unknownFields에 연결하는 단순 map. 추천엔진은 만들지 않는다.

예:
- farmingExperience unknown → 현장체험·실습 정보
- informationLevel unknown → 귀농귀촌 공식 정보

## 현장체험 fixture

```ts
interface FieldProgramFixture {
  id: string;
  title: string;
  organization: string;
  regionTags: string[];
  cropTags: string[];
  summary: string;
  sourceUrl: string;
  dataMode: "fixture";
}
```

## 계약 fixture

샘플 결과:
- 거래 당사자: ok
- 거래 금액: ok
- 지급기한: check
- 반품·감액 기준: check

반드시 샘플 결과임을 표시한다.

## Weather fallback

실제 API 실패 시만 사용. `live.forecast=false`이며 UI에 demo/fallback임을 표시한다.
