# Codex 시작 지시문

이 저장소는 해커톤용 `귀농 통합서비스` MVP를 구현한다.

먼저 이 패키지의 00~09 문서를 순서대로 읽어라.

## 무엇을 왜 만드는가

귀농 준비자는 자신의 준비 단계에 따라 필요한 정책, 교육·현장체험, 기상, 거래 정보를 서로 다른 기관에서 찾아야 한다.

이 MVP는 복잡한 AI 상담 프로젝트가 아니다. **한 번 만든 귀농 프로필을 공통 입력으로 사용해 여러 귀농 기능을 연결하는 서비스 구조를 검증한다.**

핵심 데모:
`객관식 온보딩 → UserProfile → 홈 → 괴산/고추 프로필 → 기상청 공식 단기예보`

## 반드시 구현
- 객관식 온보딩 C1~C6
- currentStage
- UserProfile local persistence
- home functional shell
- Backend KMA weather API
- Frontend WeatherService integration
- live/fixture 구분

## 더미
- 정책
- 교육자료
- 현장체험
- 계약서 점검

## 구현 금지
- LLM
- RAG
- 로그인/DB
- 정책 실시간 자격판정
- OCR
- 자동 매칭/예약
- 병해 진단
- 농약 추천

## 아키텍처

Frontend는 이후 디자인팀이 거의 전면 교체한다.
- UI와 state/service 분리
- View에서 fetch 금지
- WeatherService
- ProfileStore
- fixture와 UI 분리

Backend:
- UI를 모름
- KMA key 보호
- raw KMA response 미노출
- normalized WeatherSummary 반환
- 장애 시 명시적 fixture fallback

## 작업 방식

`07_CODEX_WORK_PACKETS.md`의 PACKET 0부터 순서대로 진행한다.

각 패킷마다:
1. 요구사항 짧게 요약
2. 수정 예정 경로 제시
3. 구현
4. 테스트/typecheck
5. DONE 확인
6. 핵심 Trade-off/미해결 문제만 보고

다음 패킷을 선행 구현하지 않는다.
PACKET 4 완료 시 골든패스를 검증한 뒤 PACKET 5로 이동한다.

과거 아키텍처가 저장소에 있어도 이 handoff를 최신 authority로 사용한다.
