import type { WeatherSummary } from "../domain/weather";

export const weatherSummaryFixture: WeatherSummary = {
  location: { id: "goesan", name: "충청북도 괴산군" },
  crop: "고추",
  fetchedAt: "2026-08-14T00:00:00+09:00",
  sourceIssuedAt: null,
  forecasts: [],
  warnings: [],
  cropGuidance: [
    {
      title: "농사로 – 작목별 재배기술 정보",
      source: "농촌진흥청 농사로",
      sourceUrl: "https://www.nongsaro.go.kr",
      live: false
    },
    {
      title: "농촌진흥청 공식 홈페이지",
      source: "농촌진흥청",
      sourceUrl: "https://www.rda.go.kr",
      live: false
    }
  ],
  live: {
    forecast: false,
    warnings: false,
    cropGuidance: false
  }
};

