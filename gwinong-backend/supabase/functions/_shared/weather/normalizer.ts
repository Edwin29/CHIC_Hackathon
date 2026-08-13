import type { WeatherForecast, WeatherLocation, WeatherSummary } from "./domain.ts";
import { WeatherServiceError } from "./errors.ts";

interface NormalizeContext {
  location: WeatherLocation;
  crop: string | null;
  fetchedAt: Date;
}

interface KmaForecastItem {
  baseDate: string;
  baseTime: string;
  fcstDate: string;
  fcstTime: string;
  category: string;
  fcstValue: string;
}

export function normalizeKmaForecast(raw: unknown, context: NormalizeContext): WeatherSummary {
  const items = extractKmaItems(raw);
  const sourceIssuedAt = findSourceIssuedAt(items);
  const forecastsByDateTime = new Map<string, WeatherForecast>();

  for (const item of items) {
    if (!isSupportedCategory(item.category)) {
      continue;
    }

    const key = `${item.fcstDate}-${item.fcstTime}`;
    const forecast =
      forecastsByDateTime.get(key) ??
      createEmptyForecast(item.fcstDate, item.fcstTime);

    applyForecastValue(forecast, item.category, item.fcstValue);
    forecastsByDateTime.set(key, forecast);
  }

  const forecasts = [...forecastsByDateTime.values()]
    .sort((left, right) => `${left.date}${left.time}`.localeCompare(`${right.date}${right.time}`))
    .slice(0, 24);

  if (forecasts.length === 0) {
    throw new WeatherServiceError("invalid_upstream_response");
  }

  return {
    location: { id: context.location.id, name: context.location.name },
    crop: context.crop,
    fetchedAt: context.fetchedAt.toISOString(),
    sourceIssuedAt,
    forecasts,
    warnings: [],
    cropGuidance: [],
    live: {
      forecast: true,
      warnings: false,
      cropGuidance: false
    }
  };
}

function extractKmaItems(raw: unknown): KmaForecastItem[] {
  if (!isRecord(raw)) {
    throw new WeatherServiceError("invalid_upstream_response");
  }

  const response = raw.response;

  if (!isRecord(response)) {
    throw new WeatherServiceError("invalid_upstream_response");
  }

  const header = response.header;

  if (!isRecord(header) || header.resultCode !== "00") {
    throw new WeatherServiceError("upstream_error");
  }

  const body = response.body;

  if (!isRecord(body) || !isRecord(body.items) || !Array.isArray(body.items.item)) {
    throw new WeatherServiceError("invalid_upstream_response");
  }

  return body.items.item.filter(isKmaForecastItem);
}

function isKmaForecastItem(value: unknown): value is KmaForecastItem {
  return (
    isRecord(value) &&
    typeof value.baseDate === "string" &&
    typeof value.baseTime === "string" &&
    typeof value.fcstDate === "string" &&
    typeof value.fcstTime === "string" &&
    typeof value.category === "string" &&
    typeof value.fcstValue === "string"
  );
}

function findSourceIssuedAt(items: KmaForecastItem[]): string | null {
  const first = items[0];

  if (!first) {
    return null;
  }

  return `${first.baseDate}T${first.baseTime.slice(0, 2)}:${first.baseTime.slice(2)}:00+09:00`;
}

function isSupportedCategory(category: string): boolean {
  return ["TMP", "REH", "POP", "PTY", "WSD", "SKY"].includes(category);
}

function createEmptyForecast(date: string, time: string): WeatherForecast {
  return {
    date,
    time,
    temperatureC: null,
    humidityPct: null,
    precipitationProbabilityPct: null,
    precipitationType: null,
    windSpeedMps: null,
    sky: null
  };
}

function applyForecastValue(
  forecast: WeatherForecast,
  category: string,
  value: string
): void {
  switch (category) {
    case "TMP":
      forecast.temperatureC = parseNumericValue(value);
      break;
    case "REH":
      forecast.humidityPct = parseNumericValue(value);
      break;
    case "POP":
      forecast.precipitationProbabilityPct = parseNumericValue(value);
      break;
    case "PTY":
      forecast.precipitationType = normalizePrecipitationType(value);
      break;
    case "WSD":
      forecast.windSpeedMps = parseNumericValue(value);
      break;
    case "SKY":
      forecast.sky = normalizeSky(value);
      break;
  }
}

function parseNumericValue(value: string): number | null {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

function normalizePrecipitationType(value: string): WeatherForecast["precipitationType"] {
  switch (value) {
    case "0":
      return "none";
    case "1":
      return "rain";
    case "2":
      return "rain_snow";
    case "3":
      return "snow";
    case "4":
      return "shower";
    default:
      return "unknown";
  }
}

function normalizeSky(value: string): WeatherForecast["sky"] {
  switch (value) {
    case "1":
      return "clear";
    case "3":
      return "cloudy";
    case "4":
      return "overcast";
    default:
      return "unknown";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
