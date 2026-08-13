import type { WeatherErrorCode } from "./domain.ts";

export class WeatherServiceError extends Error {
  constructor(readonly code: WeatherErrorCode) {
    super(code);
    this.name = "WeatherServiceError";
  }
}

export function isWeatherError(error: unknown): error is WeatherServiceError {
  return error instanceof WeatherServiceError;
}

