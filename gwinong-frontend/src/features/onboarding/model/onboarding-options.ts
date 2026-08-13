import type {
  CurrentStage,
  EducationExperience,
  FamilyDiscussion,
  FarmingExperience,
  InformationLevel,
  Purpose,
  TargetPeriod
} from "../../../domain/profile";

export interface OnboardingOption<TValue extends string> {
  label: string;
  value: TValue;
}

export const stageOptions: OnboardingOption<CurrentStage>[] = [
  { label: "아직 고민만 하고 있어요", value: "curiosity" },
  { label: "지역·작물 정보를 알아보는 중이에요", value: "exploration" },
  { label: "자금·계획을 준비 중이에요", value: "planning" },
  { label: "실행 준비를 구체화하고 있어요", value: "preparation" },
  { label: "이미 농사를 시작했어요", value: "execution" },
  { label: "농장을 운영하며 정착 중이에요", value: "settlement" }
];

export const purposeOptions: OnboardingOption<Purpose>[] = [
  { label: "직접 농사를 짓고 싶어요", value: "farming" },
  { label: "농촌 생활을 먼저 경험하고 싶어요", value: "rural_life" },
  { label: "아직 방향을 정하지 못했어요", value: "undecided" },
  { label: "모르겠어요", value: "unknown" }
];

export const targetPeriodOptions: OnboardingOption<TargetPeriod>[] = [
  { label: "6개월 안에 시작하고 싶어요", value: "within_6_months" },
  { label: "1년 안에 준비하고 싶어요", value: "within_1_year" },
  { label: "1~3년 정도 보고 있어요", value: "one_to_three_years" },
  { label: "아직 정하지 않았어요", value: "undecided" },
  { label: "모르겠어요", value: "unknown" }
];

export const informationLevelOptions: OnboardingOption<InformationLevel>[] = [
  { label: "아직 거의 찾아보지 않았어요", value: "none" },
  { label: "주변 이야기 위주로 들었어요", value: "informal_only" },
  { label: "공식 정보를 확인해 봤어요", value: "official_checked" },
  { label: "상담이나 교육을 받아봤어요", value: "consulted_or_educated" },
  { label: "모르겠어요", value: "unknown" }
];

export const familyDiscussionOptions: OnboardingOption<FamilyDiscussion>[] = [
  { label: "가족과 충분히 이야기했어요", value: "discussed" },
  { label: "일부만 이야기했어요", value: "partial" },
  { label: "아직 이야기하지 않았어요", value: "not_discussed" },
  { label: "혼자 결정하면 돼요", value: "not_applicable" },
  { label: "모르겠어요", value: "unknown" }
];

export const educationExperienceOptions: OnboardingOption<EducationExperience>[] = [
  { label: "교육 경험이 없어요", value: "none" },
  { label: "이론 교육을 일부 들었어요", value: "theory" },
  { label: "현장체험을 해봤어요", value: "field_experience" },
  { label: "실습 중심 교육을 들었어요", value: "practical_course" },
  { label: "모르겠어요", value: "unknown" }
];

export const farmingExperienceOptions: OnboardingOption<FarmingExperience>[] = [
  { label: "영농 경험이 없어요", value: "none" },
  { label: "짧게 도와본 적이 있어요", value: "short_help" },
  { label: "현장 실습을 해봤어요", value: "field_practice" },
  { label: "직접 농사를 지어봤어요", value: "actual_farming" },
  { label: "모르겠어요", value: "unknown" }
];

export interface RegionCropOption {
  label: string;
  region: string | null;
  crop: string | null;
  unknownFields: string[];
}

export const regionCropOptions: RegionCropOption[] = [
  {
    label: "충청북도 괴산군 · 고추",
    region: "충청북도 괴산군",
    crop: "고추",
    unknownFields: []
  },
  {
    label: "지역은 괴산, 작목은 아직 고민 중",
    region: "충청북도 괴산군",
    crop: null,
    unknownFields: ["targetCrop"]
  },
  {
    label: "지역·작목 모두 모르겠어요",
    region: null,
    crop: null,
    unknownFields: ["targetRegion", "targetCrop"]
  }
];

