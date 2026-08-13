import { useMemo, useState } from "react";
import type {
  CurrentStage,
  EducationExperience,
  FamilyDiscussion,
  FarmingExperience,
  InformationLevel,
  Purpose,
  TargetPeriod,
  UserProfile
} from "../../../domain/profile";
import { demoProfile } from "../../../fixtures/demo-profile";
import { localProfileStore } from "../../../stores/profile-store";

const UNKNOWN_FIELD_BY_VALUE: Partial<Record<keyof OnboardingDraft, keyof UserProfile>> = {
  purpose: "purpose",
  targetPeriod: "targetPeriod",
  informationLevel: "informationLevel",
  familyDiscussion: "familyDiscussion",
  educationExperience: "educationExperience",
  farmingExperience: "farmingExperience"
};

export type OnboardingStepId =
  | "name"
  | "currentStage"
  | "purpose"
  | "targetPeriod"
  | "informationLevel"
  | "familyDiscussion"
  | "regionCrop"
  | "experience";

export interface OnboardingDraft {
  name: string;
  currentStage: CurrentStage | null;
  purpose: Purpose | null;
  targetPeriod: TargetPeriod | null;
  informationLevel: InformationLevel | null;
  familyDiscussion: FamilyDiscussion | null;
  targetRegion: string | null;
  targetCrop: string | null;
  educationExperience: EducationExperience | null;
  farmingExperience: FarmingExperience | null;
  unknownFields: string[];
}

export interface OnboardingController {
  currentStep: OnboardingStepId;
  currentStepIndex: number;
  totalSteps: number;
  draft: OnboardingDraft;
  progressLabel: string;
  canGoBack: boolean;
  canContinue: boolean;
  setName(name: string): void;
  updateDraft(update: Partial<OnboardingDraft>): void;
  setUnknownFields(fields: string[]): void;
  back(): void;
  next(): UserProfile | null;
  loadDemoProfile(): UserProfile;
}

const steps: OnboardingStepId[] = [
  "name",
  "currentStage",
  "purpose",
  "targetPeriod",
  "informationLevel",
  "familyDiscussion",
  "regionCrop",
  "experience"
];

const initialDraft: OnboardingDraft = {
  name: "",
  currentStage: null,
  purpose: null,
  targetPeriod: null,
  informationLevel: null,
  familyDiscussion: null,
  targetRegion: null,
  targetCrop: null,
  educationExperience: null,
  farmingExperience: null,
  unknownFields: []
};

export function useOnboarding(): OnboardingController {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [draft, setDraft] = useState<OnboardingDraft>(initialDraft);
  const currentStep = steps[currentStepIndex];

  const canContinue = useMemo(() => {
    if (currentStep === "name") {
      return draft.name.trim().length > 0;
    }

    if (currentStep === "regionCrop") {
      return (
        draft.targetRegion !== null ||
        draft.targetCrop !== null ||
        hasUnknownField(draft, "targetRegion") ||
        hasUnknownField(draft, "targetCrop")
      );
    }

    if (currentStep === "experience") {
      return draft.educationExperience !== null && draft.farmingExperience !== null;
    }

    return draft[currentStep] !== null;
  }, [currentStep, draft]);

  return {
    currentStep,
    currentStepIndex,
    totalSteps: steps.length,
    draft,
    progressLabel: `${currentStepIndex + 1} / ${steps.length}`,
    canGoBack: currentStepIndex > 0,
    canContinue,
    setName(name) {
      setDraft((previous) => ({ ...previous, name }));
    },
    updateDraft(update) {
      setDraft((previous) => {
        const unknownFields = new Set(previous.unknownFields);

        for (const [field, value] of Object.entries(update)) {
          const userProfileField = UNKNOWN_FIELD_BY_VALUE[field as keyof OnboardingDraft];

          if (!userProfileField) {
            continue;
          }

          if (value === "unknown") {
            unknownFields.add(userProfileField);
          } else {
            unknownFields.delete(userProfileField);
          }
        }

        return { ...previous, ...update, unknownFields: [...unknownFields] };
      });
    },
    setUnknownFields(fields) {
      setDraft((previous) => ({
        ...previous,
        unknownFields: mergeUnknownFields(previous.unknownFields, fields)
      }));
    },
    back() {
      setCurrentStepIndex((previous) => Math.max(0, previous - 1));
    },
    next() {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex((previous) => previous + 1);
        return null;
      }

      const profile = createProfile(draft);
      localProfileStore.save(profile);
      return profile;
    },
    loadDemoProfile() {
      localProfileStore.save(demoProfile);
      return demoProfile;
    }
  };
}

function createProfile(draft: OnboardingDraft): UserProfile {
  if (!draft.currentStage) {
    throw new Error("currentStage is required");
  }

  return {
    name: draft.name.trim(),
    currentStage: draft.currentStage,
    purpose: draft.purpose === "unknown" ? null : draft.purpose,
    targetPeriod: draft.targetPeriod === "unknown" ? null : draft.targetPeriod,
    informationLevel:
      draft.informationLevel === "unknown" ? null : draft.informationLevel,
    familyDiscussion:
      draft.familyDiscussion === "unknown" ? null : draft.familyDiscussion,
    targetRegion: draft.targetRegion,
    targetCrop: draft.targetCrop,
    educationExperience:
      draft.educationExperience === "unknown" ? null : draft.educationExperience,
    farmingExperience:
      draft.farmingExperience === "unknown" ? null : draft.farmingExperience,
    unknownFields: draft.unknownFields
  };
}

function hasUnknownField(draft: OnboardingDraft, field: keyof UserProfile): boolean {
  return draft.unknownFields.includes(field);
}

function mergeUnknownFields(current: string[], next: string[]): string[] {
  const merged = new Set(current);

  for (const field of ["targetRegion", "targetCrop"]) {
    merged.delete(field);
  }

  for (const field of next) {
    merged.add(field);
  }

  return [...merged];
}

