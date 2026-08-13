import type { WeatherSummary } from "../domain/weather";

export const weatherSummaryFixture: WeatherSummary = {
  location: { id: "goesan", name: "충청북도 괴산군" },
  crop: "고추",
  fetchedAt: "2026-08-14T00:00:00+09:00",
  sourceIssuedAt: null,
  forecasts: [],
  warnings: [],
  cropGuidance: [],
  live: {
    forecast: false,
    warnings: false,
    cropGuidance: false
  }
};

