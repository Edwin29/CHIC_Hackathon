import type { FieldProgramFixture } from "../domain/demo-features";

export const fieldProgramFixtures: FieldProgramFixture[] = [
  {
    id: "goesan-weekend-farm",
    title: "괴산군 주말농장 운영",
    organization: "괴산군농업기술센터",
    regionTags: ["충청북도 괴산군"],
    cropTags: ["고추", "공통"],
    summary: "괴산군농업기술센터 일원에서 귀농귀촌인을 대상으로 농사 체험 기회를 제공하는 안내입니다.",
    sourceUrl: "https://goesan.go.kr/rfarm/contents.do?key=1649",
    dataMode: "fixture"
  },
  {
    id: "goesan-rural-living",
    title: "농촌에서 살아보기",
    organization: "괴산군",
    regionTags: ["충청북도 괴산군"],
    cropTags: ["공통"],
    summary: "귀농 전 2~3개월 농촌에 거주하며 일자리와 농촌생활 체험기회를 확인하는 프로그램 안내입니다.",
    sourceUrl: "https://goesan.go.kr/rfarm/contents.do?key=1649",
    dataMode: "fixture"
  },
  {
    id: "goesan-seoul-farm",
    title: "괴산 서울농장 농촌체험 프로그램",
    organization: "서울시지역상생교류사업단",
    regionTags: ["충청북도 괴산군"],
    cropTags: ["고추", "공통"],
    summary: "괴산 등 6개 시군 서울농장에서 농촌체험 프로그램과 교육장, 숙소, 실습장을 운영합니다.",
    sourceUrl: "https://sangsaeng.seoul.go.kr/view/new_pages.farm.farm_summary.do",
    dataMode: "fixture"
  }
];

