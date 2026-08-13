import { useEffect, useMemo, useState } from "react";
import type { UserProfile } from "../../../domain/profile";
import type { WeatherSummary } from "../../../domain/weather";
import {
  getWeatherService,
  WeatherServiceError,
  type WeatherService
} from "../../../services/weather";

const defaultWeatherService = getWeatherService();

export type WeatherViewStatus =
  | "idle"
  | "loading"
  | "success-live"
  | "success-fixture"
  | "unsupported-region"
  | "error";

export interface WeatherSummaryModel {
  status: WeatherViewStatus;
  summary: WeatherSummary | null;
  region: string | null;
  crop: string | null;
  errorMessage: string | null;
  reload(): void;
}

interface UseWeatherSummaryOptions {
  profile: UserProfile | null;
  service?: WeatherService;
}

export function useWeatherSummary({
  profile,
  service = defaultWeatherService
}: UseWeatherSummaryOptions): WeatherSummaryModel {
  const region = profile?.targetRegion ?? null;
  const crop = profile?.targetCrop ?? null;
  const [reloadKey, setReloadKey] = useState(0);
  const [state, setState] = useState<{
    status: WeatherViewStatus;
    summary: WeatherSummary | null;
    errorMessage: string | null;
  }>({
    status: "idle",
    summary: null,
    errorMessage: null
  });

  useEffect(() => {
    if (!region) {
      setState({
        status: "unsupported-region",
        summary: null,
        errorMessage: "프로필에 관심 지역이 설정되어 있지 않습니다."
      });
      return;
    }

    let active = true;
    setState({ status: "loading", summary: null, errorMessage: null });

    service
      .getSummary(region, crop ?? undefined)
      .then((summary) => {
        if (!active) {
          return;
        }

        setState({
          status: summary.live.forecast ? "success-live" : "success-fixture",
          summary,
          errorMessage: null
        });
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        if (error instanceof WeatherServiceError && error.code === "unsupported-region") {
          setState({
            status: "unsupported-region",
            summary: null,
            errorMessage: error.message
          });
          return;
        }

        setState({
          status: "error",
          summary: null,
          errorMessage: error instanceof Error ? error.message : "날씨 조회에 실패했습니다."
        });
      });

    return () => {
      active = false;
    };
  }, [crop, region, reloadKey, service]);

  return useMemo(
    () => ({
      ...state,
      region,
      crop,
      reload() {
        setReloadKey((previous) => previous + 1);
      }
    }),
    [crop, region, state]
  );
}
