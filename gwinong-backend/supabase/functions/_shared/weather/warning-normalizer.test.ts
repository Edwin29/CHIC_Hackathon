import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeKmaWarnings } from "./warning-normalizer.ts";
import { WeatherServiceError } from "./errors.ts";

describe("normalizeKmaWarnings", () => {
  it("maps a live warning item into a WeatherWarning", () => {
    const warnings = normalizeKmaWarnings({
      response: {
        header: { resultCode: "00", resultMsg: "OK" },
        body: {
          items: {
            item: [
              {
                stnId: "11C10303",
                tmFc: "202608141100",
                warnVar: "R",
                warnStress: "2",
                command: "1"
              }
            ]
          }
        }
      }
    });

    assert.deepEqual(warnings, [
      {
        type: "R",
        level: "경보",
        title: "호우 경보",
        issuedAt: "2026-08-14T11:00:00+09:00"
      }
    ]);
  });

  it("returns an empty list on NODATA_ERROR (no active warnings)", () => {
    const warnings = normalizeKmaWarnings({
      response: {
        header: { resultCode: "03", resultMsg: "NODATA_ERROR" },
        body: { items: "" }
      }
    });

    assert.deepEqual(warnings, []);
  });

  it("keeps only the latest entry per warning type", () => {
    const warnings = normalizeKmaWarnings({
      response: {
        header: { resultCode: "00", resultMsg: "OK" },
        body: {
          items: {
            item: [
              {
                stnId: "11C10303",
                tmFc: "202608140900",
                warnVar: "R",
                warnStress: "1",
                command: "1"
              },
              {
                stnId: "11C10303",
                tmFc: "202608141400",
                warnVar: "R",
                warnStress: "2",
                command: "3"
              }
            ]
          }
        }
      }
    });

    assert.deepEqual(warnings, [
      {
        type: "R",
        level: "경보",
        title: "호우 경보",
        issuedAt: "2026-08-14T14:00:00+09:00"
      }
    ]);
  });

  it("excludes entries whose latest command is a lift/cancellation", () => {
    const warnings = normalizeKmaWarnings({
      response: {
        header: { resultCode: "00", resultMsg: "OK" },
        body: {
          items: {
            item: [
              {
                stnId: "11C10303",
                tmFc: "202608141100",
                warnVar: "W",
                warnStress: "1",
                command: "2"
              }
            ]
          }
        }
      }
    });

    assert.deepEqual(warnings, []);
  });

  it("falls back to the raw code when a type/level is unmapped", () => {
    const warnings = normalizeKmaWarnings({
      response: {
        header: { resultCode: "00", resultMsg: "OK" },
        body: {
          items: {
            item: [
              {
                stnId: "11C10303",
                tmFc: "202608141100",
                warnVar: "Z",
                warnStress: "9",
                command: "1"
              }
            ]
          }
        }
      }
    });

    assert.deepEqual(warnings, [
      {
        type: "Z",
        level: "9",
        title: "Z 9",
        issuedAt: "2026-08-14T11:00:00+09:00"
      }
    ]);
  });

  it("throws invalid_upstream_response on a malformed envelope", () => {
    assert.throws(
      () => normalizeKmaWarnings({ response: { header: { resultCode: "00" } } }),
      new WeatherServiceError("invalid_upstream_response")
    );
  });

  it("throws upstream_error on a non-NODATA failure result code", () => {
    assert.throws(
      () =>
        normalizeKmaWarnings({
          response: {
            header: { resultCode: "99", resultMsg: "SERVICE ERROR" },
            body: { items: "" }
          }
        }),
      new WeatherServiceError("upstream_error")
    );
  });
});
