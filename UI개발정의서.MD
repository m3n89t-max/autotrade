UI개발정의서.md
AUTOTRADE – NEoWave 기반 자동매매 시스템

버전: v1.0
작성일: 2026-02-21

본 시스템은 연구·교육·시스템 설계 지원 목적이며 투자 자문이 아님.

1. 프로젝트 개요
1.1 목표

글렌 닐리(NEoWave) 기반 파동 분석 시각화

대안 시나리오 비교

자동매매 로직 연결

미국 경제지표 리스크 반영

AI 채팅 기반 전략 설계 보조

2. 전체 UI 구조
┌─────────────────────────────────────────────────────────────┐
│ Top Bar                                                     │
├───────────────┬─────────────────────────────┬──────────────┤
│ Left Sidebar  │      Real-time Chart        │ Right Dock   │
│ (Watchlist)   │                             │ (AI/Econ)    │
├───────────────┴─────────────────────────────┴──────────────┤
│ Bottom Panel (Order / Positions / Logs)                    │
└─────────────────────────────────────────────────────────────┘
3. Top Bar 정의
3.1 구성요소
ID	컴포넌트	설명
TB-SYMBOL	심볼 검색	자동완성 검색
TB-EXCHANGE	거래소 선택	Binance/NYSE 등
TB-TF	타임프레임	1m ~ 1W
TB-STRATEGY	전략 ON/OFF	Auto Trading 토글
TB-ECON	경제지표 카운트다운	High Impact까지 남은 시간
TB-ACCOUNT	계정	잔고/설정
3.2 동작 규칙

심볼 변경 → 차트 + 파동 재계산

타임프레임 변경 → Wave Engine 재실행

브로커 연결 끊김 → 주문 버튼 비활성화

4. Left Sidebar (Watchlist 패널)
4.1 워치리스트 테이블
컬럼	설명
Symbol	종목코드
Last	현재가
Change %	등락률
Volume	거래량
Wave	Impulse / Corrective / Unclear
Trigger	진입 조건 근접도 (%)
동작

Row 클릭 → 차트 변경

우클릭 → 삭제/고정/알림 설정

5. Center Panel – 실시간 차트
5.1 기본 기능

캔들 차트

거래량

RSI / MACD / ATR (보조지표)

5.2 파동 오버레이
항목	설명
Primary Scenario	기본 카운트
Alternative Scenario	대안 카운트
Invalidation Line	무효화 가격
Trigger Zone	진입 후보 영역
Target Lines	TP1 / TP2
5.3 차트 툴바

Scenario A/B 전환

Auto Label ON/OFF

Snapshot to Chat

6. Right Dock
6.1 Tab 구조

Tab1: AI Chat

Tab2: US Economic Calendar

Tab3: Notes / Rulebook

6.2 AI Chat
출력 템플릿 (고정 구조)

AI 응답은 항상 아래 블록 포함:

Primary Scenario:
Alternative Scenario:
Invalidation:
Entry Trigger:
Risk (SL / Position Size):
기능

현재 차트 컨텍스트 자동 인식

/wave validate

/strategy draft

/risk check

6.3 US Economic Calendar
필터

날짜

Impact (High/Medium/Low)

지표 유형 (CPI/FOMC/NFP/GDP)

테이블 구조

| Time (ET) | Event | Impact | Forecast | Actual | Previous | Surprise |

기능

발표 전 카운트다운

발표 후 Actual 자동 업데이트

Surprise = Actual - Forecast

자동매매 차단 설정:

발표 전 N분

발표 후 M분

7. Bottom Panel
7.1 Order Entry
항목	설명
Side	Long / Short
Order Type	Market / Limit / Stop
Quantity	수량
Entry Price	지정가 입력
Stop Loss	무효화 연동 가능
Take Profit	분할 설정 가능
Risk %	계좌 대비 리스크
Auto Size	ATR 기반 자동 계산
버튼

Preview

Place Order

Arm Strategy

7.2 Positions
항목	설명
Symbol	종목
Entry	진입가
Size	수량
PnL	손익
SL	손절
TP	목표
7.3 Logs

전략 실행 로그

주문 체결 로그

시스템 에러 로그

경제지표 알림

8. 상태 관리 모델
appState:
  symbol
  timeframe
  exchange
  wave:
    primary
    alternative
    invalidation
    triggers
    targets
  econ:
    events[]
    blackoutWindows[]
  orders:
    openOrders[]
    positions[]
  ui:
    activeTab
    modals[]
9. 이벤트 흐름 정의
9.1 심볼 변경
User Select Symbol
→ Load OHLCV
→ Run Wave Engine
→ Update Chart
→ AI 요약 자동 생성
9.2 경제지표 발표
Econ WS Update
→ Actual 값 수신
→ Surprise 계산
→ Alert 표시
→ 전략 차단 여부 확인
9.3 전략 자동 실행
Trigger 조건 충족
→ Risk Check
→ Econ Blackout Check
→ Order Preview
→ Broker 전송
10. UI 색상 규칙
상태	색상
Confirmed	Green
Warning	Amber
Invalidation	Red
Neutral	Gray
11. 예외 처리

WS 끊김 → 상단 경고 배너

브로커 오류 → 주문 버튼 비활성화

데이터 지연 → Latency 표시

경제지표 시간 오류 → ET 기준 고정

12. 필수 구현 체크리스트

 리사이즈 가능한 패널

 WebSocket 재연결 로직

 주문 이중 확인 모달

 경제지표 차단 로직 UI 반영

 시나리오 A/B 동시 표시

 전략 ON/OFF 가드레일

13. 권장 기술 스택

Frontend: React + TypeScript

Chart: TradingView Charting Library

Backend: FastAPI

DB: PostgreSQL

Realtime: WebSocket

상태관리: Zustand or Redux

14. 향후 확장

백테스트 화면

전략 성능 대시보드

멀티계정 지원

15. 과거 데이터 기반 테스트 (백테스트) UI

정의서에는 없으나, 과거 데이터 기반 테스트가 필요하므로 아래 요구사항을 개발정의에 포함한다.

15.1 백테스트 화면 구성

- **기간 설정**: 시작일–종료일 (또는 “최근 N일”) 선택
- **심볼·타임프레임**: 실시간 차트와 동일 옵션 (TB-SYMBOL, TB-TF)
- **실행 버튼**: 백테스트 실행 후 결과 로딩 표시
- **결과 요약**: 수익률, MDD, 거래 횟수, 승률 (시스템 개발정의서 §16.4 참조)
- **결과 차트**: 구간별 equity curve(누적 수익 곡선), 진입/청산 마커
- **Rule·Wave 통계**: 구간 내 Rule 적용/위반 건수, 시나리오 전환 횟수

15.2 재생(Replay) 모드 UI (선택)

- 재생 재생/일시정지, 재생 속도(1x, 2x, 5x 등)
- 현재 재생 시점(날짜/시간) 표시
- 재생 시 차트에 해당 시점까지만 표시하고, Wave/전략 상태를 단계별로 확인 가능하도록 구성

15.3 연동

- 백엔드 “과거 데이터 기반 테스트” API(시스템 개발정의서 §16)와 연동
- 테스트 구간·심볼·타임프레임 전달 및 결과 수신 후 위 요약·차트·통계 표시

