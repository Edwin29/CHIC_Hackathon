import type { WeatherLocation } from "./domain.ts";
import { WeatherServiceError } from "./errors.ts";

const SUPPORTED_LOCATIONS: Record<string, WeatherLocation> = {
  "충청북도 괴산군": {
    id: "goesan",
    name: "충청북도 괴산군",
    // Verified against the KMA short-term forecast guide grid table referenced by data.go.kr 15084084.
    nx: 74,
    ny: 111,
    // Weather warning zone code for data.go.kr 15000415 (getWthrWrnList stnId).
    // Provided directly by the project owner; official docs (data.go.kr / apihub.kma.go.kr /
    // data.kma.go.kr) were unreachable from this environment's network policy, so the value
    // could not be independently cross-checked against the KMA warning-zone mapping service.
    // normalizeKmaWarnings() fails closed (fixture fallback, live.warnings=false) if this is wrong.
    warningStnId: "11C10303"
  }
};

export function resolveLocation(region: string): WeatherLocation {
  const location = SUPPORTED_LOCATIONS[region];

  if (!location) {
    throw new WeatherServiceError("unsupported_region");
  }

  return location;
}
