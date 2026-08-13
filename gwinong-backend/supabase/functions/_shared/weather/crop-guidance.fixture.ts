import type { CropGuidance } from "./domain.ts";

// PACKET 7 (선택): crop guidance is fixture-only in v1 — "우선 공식 링크 fixture" per
// 07_CODEX_WORK_PACKETS.md. All *.go.kr domains were unreachable from this environment
// (same organization egress block hit during PACKET 6), so only stable, well-known
// top-level official domains are used here rather than guessed deep article permalinks.
// Verify these still resolve to the intended pages before a live demo, and prefer a more
// specific official URL (confirmed by directly opening it) if time allows — see
// 09_OFFICIAL_DATA_SOURCES.md's rule to check official sources before using them as fixtures.
const CROP_GUIDANCE_FIXTURES: Record<string, CropGuidance[]> = {
  고추: [
    {
      title: "농사로 – 작목별 재배기술 정보",
      source: "농촌진흥청 농사로",
      sourceUrl: "https://www.nongsaro.go.kr",
      live: false
    },
    {
      title: "농촌진흥청 공식 홈페이지",
      source: "농촌진흥청",
      sourceUrl: "https://www.rda.go.kr",
      live: false
    }
  ]
};

export function getCropGuidanceFixture(crop: string | null): CropGuidance[] {
  if (!crop) {
    return [];
  }

  return CROP_GUIDANCE_FIXTURES[crop] ?? [];
}
