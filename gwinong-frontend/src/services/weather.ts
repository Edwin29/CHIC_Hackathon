import type { WeatherSummary } from "../domain/weather";
import { weatherSummaryFixture } from "../fixtures/weather-summary";

export type WeatherServiceMode = "http" | "mock";
export type WeatherServiceErrorCode = "unsupported-region" | "request-failed";

export class WeatherServiceError extends Error {
  constructor(
    readonly code: WeatherServiceErrorCode,
    message: string
  ) {
    super(message);
    this.name = "WeatherServiceError";
  }
}

export interface WeatherService {
  mode: WeatherServiceMode;
  getSummary(region: string, crop?: string): Promise<WeatherSummary>;
}

export class HttpWeatherService implements WeatherService {
  readonly mode = "http";

  constructor(private readonly baseUrl: string) {}

  async getSummary(region: string, crop?: string): Promise<WeatherSummary> {
    const url = new URL("/v1/weather/summary", this.baseUrl);
    url.searchParams.set("region", region);

    if (crop) {
      url.searchParams.set("crop", crop);
    }

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;

        if (body?.error === "unsupported_region") {
          throw new WeatherServiceError(
            "unsupported-region",
            "지원하지 않는 지역입니다."
          );
        }
      }

      throw new WeatherServiceError(
        "request-failed",
        `Weather request failed: ${response.status}`
      );
    }

    return response.json() as Promise<WeatherSummary>;
  }
}

export class MockWeatherService implements WeatherService {
  readonly mode = "mock";

  async getSummary(region: string, crop?: string): Promise<WeatherSummary> {
    return {
      ...weatherSummaryFixture,
      location: { ...weatherSummaryFixture.location, name: region },
      crop: crop ?? weatherSummaryFixture.crop
    };
  }
}

export function getWeatherService(): WeatherService {
  const apiBaseUrl = import.meta.env.VITE_WEATHER_API_BASE_URL as string | undefined;
  const serviceMode = import.meta.env.VITE_WEATHER_SERVICE_MODE as string | undefined;

  if (serviceMode === "mock") {
    return new MockWeatherService();
  }

  return new HttpWeatherService(apiBaseUrl ?? "http://127.0.0.1:54321");
}
