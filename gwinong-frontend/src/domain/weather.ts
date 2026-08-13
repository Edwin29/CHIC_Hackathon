export type DataMode = "live" | "fixture";

export interface WeatherSummary {
  location: { id: string; name: string };
  crop: string | null;
  fetchedAt: string;
  sourceIssuedAt: string | null;
  forecasts: WeatherForecast[];
  warnings: WeatherWarning[];
  cropGuidance: CropGuidance[];
  fallback?: WeatherFallback;
  live: {
    forecast: boolean;
    warnings: boolean;
    cropGuidance: boolean;
  };
}

export interface WeatherForecast {
  date: string;
  time: string;
  temperatureC: number | null;
  humidityPct: number | null;
  precipitationProbabilityPct: number | null;
  precipitationType:
    | "none"
    | "rain"
    | "rain_snow"
    | "snow"
    | "shower"
    | "unknown"
    | null;
  windSpeedMps: number | null;
  sky: "clear" | "cloudy" | "overcast" | "unknown" | null;
}

export interface WeatherWarning {
  type: string;
  level: string | null;
  title: string;
  issuedAt: string | null;
}

export interface CropGuidance {
  title: string;
  source: string;
  sourceUrl: string;
  live: boolean;
}

export interface WeatherFallback {
  used: boolean;
  reason:
    | "missing_api_key"
    | "upstream_timeout"
    | "upstream_error"
    | "invalid_upstream_response";
}
