# 프론트엔드 디자인 교체 계약

## 목적

현재 Codex Frontend는 최종 디자인이 아니다. 디자인팀이 화면을 전면 교체할 수 있도록 **View와 기능/상태를 분리**한다.

## 반드시 유지할 인터페이스

```ts
interface UserProfile {
  name: string;
  currentStage: "curiosity" | "exploration" | "planning" | "preparation" | "execution" | "settlement";
  purpose: string | null;
  targetPeriod: string | null;
  informationLevel: string | null;
  familyDiscussion: string | null;
  targetRegion: string | null;
  targetCrop: string | null;
  educationExperience: string | null;
  farmingExperience: string | null;
  unknownFields: string[];
}
```

```ts
interface WeatherService {
  getSummary(region: string, crop?: string): Promise<WeatherSummary>;
}
```

## 패턴

```text
Page
 ├─ model/hook
 │   ├─ store
 │   └─ service
 └─ View
     ├─ props
     └─ callbacks
```

예: `WeatherPage → useWeatherSummary() + WeatherView`.

## View 금지사항

- LocalStorage 직접 parsing
- API URL 조합
- fetch 직접 호출
- KMA category 해석
- 정책 필터 규칙
- 비즈니스 상태 계산

## 디자인팀 변경 권장

```text
features/*/ui/
pages/
styles/
assets/
```

협의 필요:
```text
domain/
stores/
services/
fixtures/
features/*/model/
```

## 상태 계약

Weather:
- loading
- success-live
- success-fixture
- unsupported-region
- error

온보딩:
- current question
- progress
- selected option
- complete

Home:
- name
- current stage
- missing profile 여부

Codex는 색상/폰트/애니메이션/최종 카드 디자인을 강하게 고정하지 않는다.
