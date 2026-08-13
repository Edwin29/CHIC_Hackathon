import type { WeatherLocation } from "./domain.ts";
import { WeatherServiceError } from "./errors.ts";

const SUPPORTED_LOCATIONS: Record<string, WeatherLocation> = {
  "충청북도 괴산군": {
    id: "goesan",
    name: "충청북도 괴산군",
    // Verified against the KMA short-term forecast guide grid table referenced by data.go.kr 15084084.
    nx: 74,
    ny: 111
  }
};

export function resolveLocation(region: string): WeatherLocation {
  const location = SUPPORTED_LOCATIONS[region];

  if (!location) {
    throw new WeatherServiceError("unsupported_region");
  }

  return location;
}
