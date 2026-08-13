import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createWeatherApplicationService,
  selectLatestKmaBaseTime
} from "./application.ts";
import { WeatherServiceError } from "./errors.ts";
import type { KmaForecastAdapter } from "./kma-forecast.adapter.ts";

const query = { region: "충청북도 괴산군", crop: "고추" };
const fixedNow = () => new Date("2026-08-14T03:20:00.000Z");

describe("selectLatestKmaBaseTime", () => {
  it("selects the latest KMA base time with a 10 minute availability buffer", () => {
    assert.deepEqual(
      selectLatestKmaBaseTime(new Date("2026-08-14T05:09:00.000Z")),
      { baseDate: "20260814", baseTime: "1100" }
    );
    assert.deepEqual(
      selectLatestKmaBaseTime(new Date("2026-08-14T05:10:00.000Z")),
      { baseDate: "20260814", baseTime: "1400" }
    );
  });

  it("uses yesterday 2300 before the first available KST issue", () => {
    assert.deepEqual(
      selectLatestKmaBaseTime(new Date("2026-08-13T17:09:00.000Z")),
      { baseDate: "20260813", baseTime: "2300" }
    );
  });
});

describe("WeatherApplicationService", () => {
  it("returns normalized live KMA forecasts", async () => {
    const service = createWeatherApplicationService({
      serviceKey: "secret",
      now: fixedNow,
      adapter: createAdapter(kmaResponse())
    });

    const summary = await service.getSummary(query);

    assert.equal(summary.location.id, "goesan");
    assert.equal(summary.location.name, "충청북도 괴산군");
    assert.equal(summary.crop, "고추");
    assert.equal(summary.live.forecast, true);
    assert.equal(summary.sourceIssuedAt, "20260814T11:00:00+09:00");
    assert.deepEqual(summary.forecasts[0], {
      date: "20260814",
      time: "1200",
      temperatureC: 28,
      humidityPct: 70,
      precipitationProbabilityPct: 20,
      precipitationType: "none",
      windSpeedMps: 2.1,
      sky: "cloudy"
    });
  });

  it("returns explicit fixture fallback when the key is missing", async () => {
    const service = createWeatherApplicationService({
      serviceKey: null,
      now: fixedNow,
      adapter: createAdapter(kmaResponse())
    });

    const summary = await service.getSummary(query);

    assert.equal(summary.live.forecast, false);
    assert.deepEqual(summary.cropGuidance, []);
    assert.deepEqual(summary.fallback, { used: true, reason: "missing_api_key" });
    assert.equal(summary.forecasts[0]?.date, "2026-08-14");
  });

  it("returns fixture fallback on upstream timeout", async () => {
    const service = createWeatherApplicationService({
      serviceKey: "secret",
      now: fixedNow,
      adapter: createThrowingAdapter(new WeatherServiceError("upstream_timeout"))
    });

    const summary = await service.getSummary(query);

    assert.equal(summary.live.forecast, false);
    assert.deepEqual(summary.cropGuidance, []);
    assert.deepEqual(summary.fallback, { used: true, reason: "upstream_timeout" });
    assert.equal(summary.forecasts[0]?.date, "2026-08-14");
  });

  it("returns fixture fallback on malformed upstream payload", async () => {
    const service = createWeatherApplicationService({
      serviceKey: "secret",
      now: fixedNow,
      adapter: createAdapter({ response: { header: { resultCode: "00" }, body: {} } })
    });

    const summary = await service.getSummary(query);

    assert.equal(summary.live.forecast, false);
    assert.deepEqual(summary.cropGuidance, []);
    assert.deepEqual(summary.fallback, {
      used: true,
      reason: "invalid_upstream_response"
    });
    assert.equal(summary.forecasts[0]?.date, "2026-08-14");
  });

  it("throws unsupported_region without pretending to have fixture data", async () => {
    const service = createWeatherApplicationService({
      serviceKey: "secret",
      now: fixedNow,
      adapter: createAdapter(kmaResponse())
    });

    await assert.rejects(
      () => service.getSummary({ region: "서울특별시 중구", crop: "고추" }),
      new WeatherServiceError("unsupported_region")
    );
  });
});

function createAdapter(response: unknown): KmaForecastAdapter {
  return {
    async fetchForecast() {
      return response;
    }
  };
}

function createThrowingAdapter(error: Error): KmaForecastAdapter {
  return {
    async fetchForecast() {
      throw error;
    }
  };
}

function kmaResponse() {
  return {
    response: {
      header: { resultCode: "00", resultMsg: "OK" },
      body: {
        items: {
          item: [
            item("TMP", "28"),
            item("REH", "70"),
            item("POP", "20"),
            item("PTY", "0"),
            item("WSD", "2.1"),
            item("SKY", "3")
          ]
        }
      }
    }
  };
}

function item(category: string, fcstValue: string) {
  return {
    baseDate: "20260814",
    baseTime: "1100",
    fcstDate: "20260814",
    fcstTime: "1200",
    category,
    fcstValue
  };
}
