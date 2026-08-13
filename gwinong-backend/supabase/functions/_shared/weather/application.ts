import { createWeatherFixture } from "./fixture.ts";
import { createKmaForecastAdapter, type KmaForecastAdapter } from "./kma-forecast.adapter.ts";
import { resolveLocation } from "./location-resolver.ts";
import { normalizeKmaForecast } from "./normalizer.ts";
import type { WeatherFallback, WeatherSummary, WeatherSummaryQuery } from "./domain.ts";
import { WeatherServiceError } from "./errors.ts";
import { getKmaServiceKey } from "./runtime.ts";

export interface WeatherApplicationService {
  getSummary(query: WeatherSummaryQuery): Promise<WeatherSummary>;
}

interface WeatherApplicationDependencies {
  adapter?: KmaForecastAdapter;
  now?: () => Date;
  serviceKey?: string | null;
}

export function createWeatherApplicationService(
  dependencies: WeatherApplicationDependencies = {}
): WeatherApplicationService {
  const adapter = dependencies.adapter ?? createKmaForecastAdapter();
  const now = dependencies.now ?? (() => new Date());
  const serviceKey = dependencies.serviceKey ?? getKmaServiceKey();

  return {
    async getSummary(query) {
      const location = resolveLocation(query.region);
      const crop = query.crop ?? null;

      if (!serviceKey) {
        return createWeatherFixture({
          location: { id: location.id, name: location.name },
          crop,
          fetchedAt: now(),
          fallbackReason: "missing_api_key"
        });
      }

      try {
        const upstream = await adapter.fetchForecast({
          location,
          serviceKey,
          issuedAt: selectLatestKmaBaseTime(now())
        });

        return normalizeKmaForecast(upstream, {
          location,
          crop,
          fetchedAt: now()
        });
      } catch (error) {
        if (error instanceof WeatherServiceError && error.code === "unsupported_region") {
          throw error;
        }

        return createWeatherFixture({
          location: { id: location.id, name: location.name },
          crop,
          fetchedAt: now(),
          fallbackReason: getFallbackReason(error)
        });
      }
    }
  };
}

function getFallbackReason(error: unknown): WeatherFallback["reason"] {
  if (error instanceof WeatherServiceError && error.code !== "unsupported_region") {
    return error.code;
  }

  return "upstream_error";
}

export interface KmaBaseTime {
  baseDate: string;
  baseTime: string;
}

const KMA_BASE_HOURS = [2, 5, 8, 11, 14, 17, 20, 23];
const KMA_AVAILABLE_DELAY_MINUTES = 10;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function selectLatestKmaBaseTime(now: Date): KmaBaseTime {
  const kstDate = new Date(now.getTime() + KST_OFFSET_MS);
  const availableMinutes = kstDate.getUTCHours() * 60 + kstDate.getUTCMinutes();
  const latestHour = [...KMA_BASE_HOURS]
    .reverse()
    .find((hour) => availableMinutes >= hour * 60 + KMA_AVAILABLE_DELAY_MINUTES);

  if (latestHour !== undefined) {
    return {
      baseDate: formatKstDate(kstDate),
      baseTime: `${String(latestHour).padStart(2, "0")}00`
    };
  }

  const yesterdayKst = new Date(kstDate.getTime() - 24 * 60 * 60 * 1000);
  return {
    baseDate: formatKstDate(yesterdayKst),
    baseTime: "2300"
  };
}

function formatKstDate(kstDate: Date): string {
  const year = kstDate.getUTCFullYear();
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}
