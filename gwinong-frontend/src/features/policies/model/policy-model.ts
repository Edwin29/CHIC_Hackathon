import type { UserProfile } from "../../../domain/profile";
import { policyFixtures } from "../../../fixtures/policies";

export function getPolicyMatches(profile: UserProfile | null) {
  if (!profile?.targetRegion) {
    return policyFixtures;
  }

  return policyFixtures.filter((policy) =>
    policy.regionTags.includes(profile.targetRegion ?? "")
  );
}

