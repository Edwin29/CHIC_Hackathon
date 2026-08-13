import type { CurrentStage } from "../../../domain/profile";

const STAGE_LABELS: Record<CurrentStage, string> = {
  curiosity: "궁금증",
  exploration: "탐색",
  planning: "계획",
  preparation: "준비",
  execution: "실행",
  settlement: "자립"
};

export const stageRoadmap: Array<{ stage: CurrentStage; label: string }> = [
  { stage: "curiosity", label: STAGE_LABELS.curiosity },
  { stage: "exploration", label: STAGE_LABELS.exploration },
  { stage: "planning", label: STAGE_LABELS.planning },
  { stage: "preparation", label: STAGE_LABELS.preparation },
  { stage: "execution", label: STAGE_LABELS.execution },
  { stage: "settlement", label: STAGE_LABELS.settlement }
];

export function getStageLabel(stage: CurrentStage): string {
  return STAGE_LABELS[stage];
}
