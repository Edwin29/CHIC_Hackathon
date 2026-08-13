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
      sampleForecast: forecastWithAllCoreValues
    },
    null,
    2
  )
);
