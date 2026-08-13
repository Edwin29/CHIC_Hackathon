import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getCropGuidanceFixture } from "./crop-guidance.fixture.ts";

describe("getCropGuidanceFixture", () => {
  it("returns official links for a supported crop", () => {
    const guidance = getCropGuidanceFixture("고추");

    assert.ok(guidance.length > 0);
    for (const entry of guidance) {
      assert.equal(entry.live, false);
      assert.ok(entry.sourceUrl.startsWith("https://"));
    }
  });

  it("returns an empty list when crop is null", () => {
    assert.deepEqual(getCropGuidanceFixture(null), []);
  });

  it("returns an empty list for an unmapped crop instead of guessing", () => {
    assert.deepEqual(getCropGuidanceFixture("파인애플"), []);
  });
});
