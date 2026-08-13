import type { UserProfile } from "../../../domain/profile";
import { fieldProgramFixtures } from "../../../fixtures/field-programs";

export function getFieldProgramMatches(profile: UserProfile | null) {
  return fieldProgramFixtures.filter((program) => {
    const regionMatches =
      !profile?.targetRegion || program.regionTags.includes(profile.targetRegion);
    const cropMatches =
      !profile?.targetCrop ||
      program.cropTags.includes(profile.targetCrop) ||
      program.cropTags.includes("공통");

    return regionMatches && cropMatches;
  });
}

