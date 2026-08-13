import type { WeatherLocation } from "./domain.ts";
import { WeatherServiceError } from "./errors.ts";

export interface KmaWarningAdapter {
  fetchWarnings(input: KmaWarningRequest): Promise<unknown>;
}

export interface KmaWarningRequest {
  location: WeatherLocation;
  serviceKey: string;
  now: Date;
}

interface KmaWarningAdapterOptions {
  endpoint?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
  windowHours?: number;
}

const DEFAULT_ENDPOINT = "https://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList";
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function createKmaWarningAdapter(
  options: KmaWarningAdapterOptions = {}
): KmaWarningAdapter {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const timeoutMs = options.timeoutMs ?? 4_000;
  const fetchImpl = options.fetchImpl ?? fetch;
  const windowHours = options.windowHours ?? 24;

  return {
    async fetchWarnings(input) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const url = createKmaWarningUrl(endpoint, input, windowHours);
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

function createKmaWarningUrl(
  endpoint: string,
  input: KmaWarningRequest,
  windowHours: number
): URL {
  const url = new URL(endpoint);
  const toTmFc = formatKstTimestamp(input.now);
  const fromTmFc = formatKstTimestamp(
    new Date(input.now.getTime() - windowHours * 60 * 60 * 1000)
  );

  url.searchParams.set("serviceKey", normalizeServiceKey(input.serviceKey));
  url.searchParams.set("pageNo", "1");
  url.searchParams.set("numOfRows", "50");
  url.searchParams.set("dataType", "JSON");
  url.searchParams.set("stnId", input.location.warningStnId);
  url.searchParams.set("fromTmFc", fromTmFc);
  url.searchParams.set("toTmFc", toTmFc);

  return url;
}

function formatKstTimestamp(date: Date): string {
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kst.getUTCDate()).padStart(2, "0");
  const hour = String(kst.getUTCHours()).padStart(2, "0");
  const minute = String(kst.getUTCMinutes()).padStart(2, "0");
  return `${year}${month}${day}${hour}${minute}`;
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
