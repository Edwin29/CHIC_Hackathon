import type { PolicyFixture } from "../domain/demo-features";

export const policyFixtures: PolicyFixture[] = [
  {
    id: "goesan-home-repair",
    title: "귀농귀촌인 주택 수리비지원",
    organization: "괴산군",
    summary: "귀농귀촌인의 주거환경 개선과 농촌 조기 정착을 돕는 주택수리비 지원 예시입니다.",
    targetText:
      "괴산군 전입 5년 이내 귀농귀촌인 등 세부 요건은 공식 공고에서 확인해야 합니다.",
    regionTags: ["충청북도 괴산군"],
    sourceUrl: "https://goesan.go.kr/rfarm/contents.do?key=1649",
    demoMatchReason: "프로필 관심 지역이 괴산군이라 지역 지원정책 예시로 표시합니다.",
    dataMode: "fixture"
  },
  {
    id: "goesan-startup-loan",
    title: "귀농 농업창업 및 주택구입 융자지원",
    organization: "괴산군",
    summary:
      "귀농인의 초기 창업비용과 주택자금 부담을 줄이기 위한 융자지원 안내 예시입니다.",
    targetText:
      "연령, 전입 기간, 교육 이수 등 자격요건은 공식 안내와 담당 부서 확인이 필요합니다.",
    regionTags: ["충청북도 괴산군"],
    sourceUrl: "https://goesan.go.kr/rfarm/contents.do?key=1649",
    demoMatchReason: "김미숙 데모 프로필이 영농 목적과 1년 내 준비 상태라 계획 자금 확인 항목으로 표시합니다.",
    dataMode: "fixture"
  }
];

