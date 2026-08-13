import type { WeatherFallback, WeatherSummary } from "./domain.ts";
import { getCropGuidanceFixture } from "./crop-guidance.fixture.ts";

interface WeatherFixtureInput {
  location: WeatherSummary["location"];
  crop: string | null;
  fetchedAt?: Date;
  fallbackReason?: WeatherFallback["reason"];
}

export function createWeatherFixture(input: WeatherFixtureInput): WeatherSummary {
  return {
    location: input.location,
    crop: input.crop,
    fetchedAt: (input.fetchedAt ?? new Date()).toISOString(),
    sourceIssuedAt: null,
    forecasts: [
      {
        date: formatKstDate(input.fetchedAt ?? new Date()),
        time: "0900",
        temperatureC: 27,
        humidityPct: 72,
        precipitationProbabilityPct: 30,
        precipitationType: "none",
        windSpeedMps: 1.8,
        sky: "cloudy"
      }
    ],
    warnings: [],
    cropGuidance: getCropGuidanceFixture(input.crop),
    fallback: input.fallbackReason
      ? {
          used: true,
          reason: input.fallbackReason
        }
      : undefined,
    live: {
      forecast: false,
      warnings: false,
      cropGuidance: false
    }
  };
}

function formatKstDate(date: Date): string {
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kstDate.toISOString().slice(0, 10);
}
