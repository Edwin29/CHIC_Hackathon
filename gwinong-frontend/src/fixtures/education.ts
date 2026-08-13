import type { EducationFixture } from "../domain/demo-features";

export const educationFixtures: EducationFixture[] = [
  {
    id: "field-practice-info",
    title: "현장체험·실습 정보 확인",
    summary: "영농 경험을 아직 정하지 못했다면 현장체험과 실습 프로그램부터 확인합니다.",
    unknownField: "farmingExperience",
    sourceUrl: "https://goesan.go.kr/rfarm/RfarmEduList.do?key=1650",
    dataMode: "fixture"
  },
  {
    id: "official-info-check",
    title: "귀농귀촌 공식 정보 확인",
    summary: "정보수집 상태가 불확실하면 지자체 교육정보와 공식 안내 페이지를 먼저 확인합니다.",
    unknownField: "informationLevel",
    sourceUrl: "https://goesan.go.kr/rfarm/index.do",
    dataMode: "fixture"
  }
];

