import type { AppRoute } from "../../../pages/useRoute";
import type { UserProfile } from "../../../domain/profile";
import { getStageLabel, stageRoadmap } from "./stage-labels";

export interface HomeAction {
  id: string;
  label: string;
  description: string;
  route: AppRoute;
  primary?: boolean;
}

export interface HomeShellModel {
  profile: UserProfile | null;
  name: string | null;
  stageLabel: string | null;
  roadmap: Array<{
    stage: UserProfile["currentStage"];
    label: string;
    active: boolean;
  }>;
  actions: HomeAction[];
  hasMissingProfileFields: boolean;
  missingFieldCount: number;
}

const homeActions: HomeAction[] = [
  {
    id: "policies",
    label: "정부 지원 매칭 확인하기",
    description: "현재 프로필 기준으로 볼 수 있는 지원 정보로 이동합니다.",
    route: "/policies",
    primary: true
  },
  {
    id: "weather",
    label: "농장 날씨·위험",
    description: "관심 지역과 작목을 바탕으로 날씨 화면으로 이동합니다.",
    route: "/weather"
  },
  {
    id: "field-programs",
    label: "현장체험 연결",
    description: "현장체험과 교육 프로그램 탐색 화면으로 이동합니다.",
    route: "/field-programs"
  },
  {
    id: "contract-check",
    label: "거래 서면 점검",
    description: "거래 문서 샘플 점검 화면으로 이동합니다.",
    route: "/contract-check"
  },
  {
    id: "profile",
    label: "프로필 마저 설정하기",
    description: "모르겠어요로 남긴 항목을 다시 확인합니다.",
    route: "/profile"
  }
];

export function createHomeShellModel(profile: UserProfile | null): HomeShellModel {
  return {
    profile,
    name: profile?.name ?? null,
    stageLabel: profile ? getStageLabel(profile.currentStage) : null,
    roadmap: stageRoadmap.map((item) => ({
      ...item,
      active: profile?.currentStage === item.stage
    })),
    actions: homeActions,
    hasMissingProfileFields: Boolean(profile?.unknownFields.length),
    missingFieldCount: profile?.unknownFields.length ?? 0
  };
}

