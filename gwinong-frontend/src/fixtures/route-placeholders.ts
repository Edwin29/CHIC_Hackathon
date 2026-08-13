export interface RoutePlaceholder {
  path: string;
  label: string;
  packet: string;
}

export const routePlaceholders: RoutePlaceholder[] = [
  { path: "/onboarding", label: "온보딩", packet: "PACKET 1" },
  { path: "/home", label: "홈", packet: "PACKET 2" },
  { path: "/weather", label: "농장 날씨·위험", packet: "PACKET 4" },
  { path: "/policies", label: "정부 지원 매칭", packet: "PACKET 5" },
  { path: "/field-programs", label: "현장체험 연결", packet: "PACKET 5" },
  { path: "/contract-check", label: "거래 서면 점검", packet: "PACKET 5" },
  { path: "/profile", label: "프로필", packet: "PACKET 1" }
];

