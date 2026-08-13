import type { WeatherWarning } from "./domain.ts";
import { WeatherServiceError } from "./errors.ts";

interface KmaWarningItem {
  stnId: string;
  tmFc: string;
  warnVar: string;
  warnStress?: string;
  command?: string;
}

// Best-effort labels for the KMA warning phenomenon/level codes. Official field docs
// (data.go.kr 15000415) were unreachable from this environment, so these are not
// independently verified. Unmapped codes fall back to the raw code instead of guessing,
// so the UI never shows an invented label.
const WARNING_TYPE_LABELS: Record<string, string> = {
  T: "태풍",
  R: "호우",
  D: "건조",
  C: "한파",
  S: "대설",
  W: "강풍",
  V: "풍랑",
  N: "지진해일",
  O: "폭풍해일",
  H: "폭염",
  F: "안개",
  Y: "황사"
};

const WARNING_LEVEL_LABELS: Record<string, string> = {
  "1": "주의보",
  "2": "경보",
  "3": "예비특보"
};

// Best-effort: 통보구분(command) "2" is treated as a lift/cancellation and excluded.
const LIFTED_COMMAND_CODE = "2";

const NODATA_RESULT_CODE = "03";

export function normalizeKmaWarnings(raw: unknown): WeatherWarning[] {
  const items = extractKmaWarningItems(raw);
  const latestByType = new Map<string, KmaWarningItem>();

  for (const item of items) {
    if (item.command === LIFTED_COMMAND_CODE) {
      continue;
    }

    const existing = latestByType.get(item.warnVar);

    if (!existing || item.tmFc > existing.tmFc) {
      latestByType.set(item.warnVar, item);
    }
  }

  return [...latestByType.values()]
    .sort((left, right) => right.tmFc.localeCompare(left.tmFc))
    .map(toWeatherWarning);
}

function toWeatherWarning(item: KmaWarningItem): WeatherWarning {
  const typeLabel = WARNING_TYPE_LABELS[item.warnVar] ?? item.warnVar;
  const levelLabel = item.warnStress
    ? (WARNING_LEVEL_LABELS[item.warnStress] ?? item.warnStress)
    : null;

  return {
    type: item.warnVar,
    level: levelLabel,
    title: levelLabel ? `${typeLabel} ${levelLabel}` : typeLabel,
    issuedAt: formatIssuedAt(item.tmFc)
  };
}

function formatIssuedAt(tmFc: string): string | null {
  if (tmFc.length < 12) {
    return null;
  }

  const year = tmFc.slice(0, 4);
  const month = tmFc.slice(4, 6);
  const day = tmFc.slice(6, 8);
  const hour = tmFc.slice(8, 10);
  const minute = tmFc.slice(10, 12);
  return `${year}-${month}-${day}T${hour}:${minute}:00+09:00`;
}

function extractKmaWarningItems(raw: unknown): KmaWarningItem[] {
  if (!isRecord(raw)) {
    throw new WeatherServiceError("invalid_upstream_response");
  }

  const response = raw.response;

  if (!isRecord(response)) {
    throw new WeatherServiceError("invalid_upstream_response");
  }

  const header = response.header;

  if (!isRecord(header) || typeof header.resultCode !== "string") {
    throw new WeatherServiceError("invalid_upstream_response");
  }

  if (header.resultCode === NODATA_RESULT_CODE) {
    return [];
  }

  if (header.resultCode !== "00") {
    throw new WeatherServiceError("upstream_error");
  }

  const body = response.body;

  if (!isRecord(body)) {
    throw new WeatherServiceError("invalid_upstream_response");
  }

  const items = body.items;

  if (items === "" || items === undefined || items === null) {
    return [];
  }

  if (!isRecord(items) || !Array.isArray(items.item)) {
    throw new WeatherServiceError("invalid_upstream_response");
  }

  return items.item.filter(isKmaWarningItem);
}

function isKmaWarningItem(value: unknown): value is KmaWarningItem {
  return (
    isRecord(value) &&
    typeof value.stnId === "string" &&
    typeof value.tmFc === "string" &&
    typeof value.warnVar === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
