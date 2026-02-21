# AUTOTRADE – NEoWave 기반 자동매매 시스템

연구·교육·시스템 설계 지원 목적이며 투자 자문이 아님.

## 구조

- **프론트엔드**: React + TypeScript + Vite (UI개발정의서)
- **백엔드**: FastAPI (시스템개발정의서 – RAG + Rule DB)
- **상태**: Zustand (appState)
- **차트**: lightweight-charts
- **레이아웃**: 리사이즈 가능 패널 (react-resizable-panels)

## UI 구성

- **Top Bar**: 심볼 검색(TB-SYMBOL), 거래소(TB-EXCHANGE), 타임프레임(TB-TF), 전략 ON/OFF(TB-STRATEGY), 경제지표 카운트다운(TB-ECON), 계정(TB-ACCOUNT)
- **Left Sidebar**: Watchlist (Symbol, Last, Chg%, Vol, Wave, Trigger)
- **Center**: 실시간 캔들 차트, 파동 오버레이, Scenario A/B, Snapshot to Chat
- **Right Dock**: AI Chat, US Economic Calendar, Notes / Rulebook
- **Bottom Panel**: Order Entry, Positions, Logs

## 실행 방법

### 프론트엔드

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속. (서버 실행은 사용자가 직접 해 주세요.)

### 백엔드

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API 문서: `http://localhost:8000/docs`

## 참고 문서

- `UI개발정의서.MD` – 화면 구성, 상태, 이벤트 흐름
- `시스템 개발정의서.md` – RAG, Rule DSL, Rule Review, 엔진 연동
