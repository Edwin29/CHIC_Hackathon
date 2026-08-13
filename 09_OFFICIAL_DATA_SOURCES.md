# 공식 데이터 소스

기준일: 2026-08-14

Codex는 구현 전에 공식 문서를 다시 열어 endpoint/parameter를 확인한다.

## P0 — 기상청 단기예보 조회서비스

https://www.data.go.kr/data/15084084/openapi.do

현재 확인:
- REST
- JSON + XML
- 실시간
- 전국
- 5km × 5km 격자
- 개발계정 자동승인
- 2026-07-09 수정된 API 페이지/가이드

주요 category:
- TMP 기온
- SKY 하늘상태
- PTY 강수형태
- POP 강수확률
- REH 습도
- WSD 풍속
- PCP 1시간 강수량
- SNO 적설

MVP: TMP/SKY/PTY/POP/REH/WSD.

## P2 — 기상청 기상특보 조회서비스

https://www.data.go.kr/data/15000415/openapi.do

현재 확인:
- REST
- JSON + XML
- 실시간
- 개발계정 자동승인
- 2026-06-01 수정

MVP 선택사항. 지역코드 매핑이 불안정하면 구현하지 않는다.

## P2 — 농촌진흥청 농작업일정 정보

https://www.data.go.kr/data/15033498/openapi.do

현재 확인:
- LINK API
- XML
- 작목별 시기별 농작업
- 수분·토양·병해충 방제 등

MVP는 공식 링크 fixture 우선.

## 정책/현장체험

실시간 API를 붙이지 않는다. 구현 당시 공식 원문 1~3개를 직접 확인하여 fixture로 사용한다. 오래된 자료를 현재 모집중처럼 표시하지 않는다.

## 데이터 표기

`live`와 `fixture`를 구분한다.
