import type { WeatherLocation } from "./domain.ts";
import type { KmaBaseTime } from "./application.ts";
import { WeatherServiceError } from "./errors.ts";

export interface KmaForecastAdapter {
  fetchForecast(input: KmaForecastRequest): Promise<unknown>;
}

export interface KmaForecastRequest {
  location: WeatherLocation;
  serviceKey: string;
  issuedAt: KmaBaseTime;
}

interface KmaForecastAdapterOptions {
  endpoint?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

const DEFAULT_ENDPOINT =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

export function createKmaForecastAdapter(
  options: KmaForecastAdapterOptions = {}
): KmaForecastAdapter {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const timeoutMs = options.timeoutMs ?? 4_000;
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    async fetchForecast(input) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const url = createKmaForecastUrl(endpoint, input);
        const response = await fetchImpl(url, { signal: controller.signal });

        if (!response.ok) {
          throw new WeatherServiceError("upstream_error");
        }

        return response.json();
      } catch (error) {
        if (error instanceof WeatherServiceError) {
          throw error;
        }

        if (isAbortError(error)) {
          throw new WeatherServiceError("upstream_timeout");
        }

        throw new WeatherServiceError("upstream_error");
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}

function createKmaForecastUrl(endpoint: string, input: KmaForecastRequest): URL {
  const url = new URL(endpoint);

  url.searchParams.set("serviceKey", normalizeServiceKey(input.serviceKey));
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", "1000");
  url.searchParams.set("dataType", "JSON");
  url.searchParams.set("base_date", input.issuedAt.baseDate);
  url.searchParams.set("base_time", input.issuedAt.baseTime);
  url.searchParams.set("nx", String(input.location.nx));
  url.searchParams.set("ny", String(input.location.ny));

  return url;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function normalizeServiceKey(serviceKey: string): string {
  try {
    return serviceKey.includes("%") ? decodeURIComponent(serviceKey) : serviceKey;
  } catch {
    return serviceKey;
  }
}
