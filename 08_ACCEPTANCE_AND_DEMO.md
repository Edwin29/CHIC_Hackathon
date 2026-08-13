# 완료 기준 및 데모 시나리오

## P0

### Onboarding
- [ ] currentStage 선택
- [ ] C1~C6
- [ ] 모르겠어요
- [ ] UserProfile 저장
- [ ] 새로고침 복구
- [ ] 김미숙 demo

### Home
- [ ] 이름
- [ ] currentStage
- [ ] roadmap
- [ ] 정책 CTA
- [ ] 날씨/현장체험/계약 route

### Weather Backend
- [ ] KMA key Frontend 미노출
- [ ] 괴산 공식 grid 검증
- [ ] 단기예보 호출
- [ ] TMP/REH/POP/PTY/WSD/SKY
- [ ] normalized response
- [ ] timeout
- [ ] unsupported region
- [ ] fixture fallback
- [ ] live flag

### Weather Frontend
- [ ] profile region 자동 사용
- [ ] crop 표시
- [ ] loading/live/fallback/error

## P1
- [ ] 정책 fixture 1~2건 + 공식 링크 + 자격 확정 아님
- [ ] 현장체험 fixture 2~3건 + 공식 링크
- [ ] 계약 파일 선택 + 샘플 결과 + demo 표시

## 골든패스

### T1 온보딩
김미숙 → 탐색 → C1~C6 → 홈.
기대: `지금은 탐색이에요`.

### T2 날씨 실데이터
괴산+고추 → weather → 실제 KMA.
기대: 위치, 작물, 기온/습도/강수확률/풍속/하늘상태, 조회시각, live.

### T3 KMA 장애
기대: crash 없음, fallback, demo 표시.

### T4 정책
기대: 공식 링크, 프로필 기준 데모 추천, 최종 자격 확인 안내.

### T5 현장체험
기대: 공식 페이지 CTA, 자동예약 표현 없음.

### T6 계약
파일 선택 → 분석 중 → fixture. 샘플 결과 명시.

## 자르는 순서
1. 작물 농작업 정보
2. 기상특보
3. 교육자료 세부화
4. 현장체험 필터 정교화

절대 자르지 않음:
- 온보딩/profile/home
- weather service boundary
- KMA v1 또는 명시적 fallback
- live/fixture 구분
