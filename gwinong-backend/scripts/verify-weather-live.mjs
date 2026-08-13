import assert from "node:assert/strict";
import { createWeatherApplicationService } from "../supabase/functions/_shared/weather/application.ts";

if (!process.env.KMA_SERVICE_KEY) {
  console.error("KMA_SERVICE_KEY is required for live weather verification.");
  process.exit(1);
}

if (process.env.KMA_SERVICE_KEY.includes("여기에")) {
  console.error("KMA_SERVICE_KEY still looks like a placeholder value.");
  process.exit(1);
}

const service = createWeatherApplicationService();
const summary = await service.getSummary({
  region: "충청북도 괴산군",
  crop: "고추"
});

assert.equal(summary.location.id, "goesan");
assert.equal(summary.location.name, "충청북도 괴산군");
assert.equal(summary.crop, "고추");

if (!summary.live.forecast) {
  console.error(
    JSON.stringify(
      {
        liveForecast: summary.live.forecast,
        fallback: summary.fallback ?? null,
        sourceIssuedAt: summary.sourceIssuedAt,
        forecastCount: summary.forecasts.length
      },
      null,
      2
    )
  );
  throw new Error("Expected live KMA forecast, but fallback data was returned.");
}

assert.equal(summary.live.forecast, true);
assert.equal(summary.fallback, undefined);
assert.equal(typeof summary.sourceIssuedAt, "string");
assert.ok(summary.sourceIssuedAt?.length);
assert.ok(summary.forecasts.length > 0);

const forecastWithAllCoreValues = summary.forecasts.find(
  (forecast) =>
    forecast.temperatureC !== null &&
    forecast.humidityPct !== null &&
    forecast.precipitationProbabilityPct !== null &&
    forecast.precipitationType !== null &&
    forecast.windSpeedMps !== null &&
    forecast.sky !== null
);

assert.ok(
  forecastWithAllCoreValues,
  "Expected at least one forecast with TMP/REH/POP/PTY/WSD/SKY normalized."
);

console.log(
  JSON.stringify(
    {
      liveForecast: summary.live.forecast,
      sourceIssuedAt: summary.sourceIssuedAt,
      forecastCount: summary.forecasts.length,
      sampleForecast: forecastWithAllCoreValues,
      liveWarnings: summary.live.warnings,
      warnings: summary.warnings
    },
    null,
    2
  )
);

// live.warnings is informational only: the warning zone code (location-resolver.ts
// warningStnId) could not be verified against official KMA docs from the sandbox that
// implemented PACKET 6, so it is not asserted here. Confirm liveWarnings=true (or that
// `warnings` looks correct when a real alert is active) when running this against a
// network that can reach data.go.kr.
if (!summary.live.warnings) {
  console.warn(
    "live.warnings is false — verify the warningStnId in location-resolver.ts against " +
      "the official KMA warning zone mapping before relying on this in a demo."
  );
}
