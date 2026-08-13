import type { UserProfile } from "../../../domain/profile";
import { educationFixtures } from "../../../fixtures/education";

export function getProfileEducationSuggestions(profile: UserProfile | null) {
  if (!profile) {
    return [];
  }

  return educationFixtures.filter((fixture) =>
    profile.unknownFields.includes(fixture.unknownField)
  );
}

