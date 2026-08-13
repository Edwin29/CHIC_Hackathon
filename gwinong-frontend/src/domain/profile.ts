export type CurrentStage =
  | "curiosity"
  | "exploration"
  | "planning"
  | "preparation"
  | "execution"
  | "settlement";

export type Purpose = "farming" | "rural_life" | "undecided" | "unknown";
export type TargetPeriod =
  | "within_6_months"
  | "within_1_year"
  | "one_to_three_years"
  | "undecided"
  | "unknown";
export type InformationLevel =
  | "none"
  | "informal_only"
  | "official_checked"
  | "consulted_or_educated"
  | "mixed"
  | "unknown";
export type FamilyDiscussion =
  | "discussed"
  | "partial"
  | "not_discussed"
  | "not_applicable"
  | "unknown";
export type EducationExperience =
  | "none"
  | "theory"
  | "field_experience"
  | "practical_course"
  | "unknown";
export type FarmingExperience =
  | "none"
  | "short_help"
  | "field_practice"
  | "actual_farming"
  | "unknown";

export interface UserProfile {
  name: string;
  currentStage: CurrentStage;
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
