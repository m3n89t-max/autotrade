# TradingView Charting Library 연동 가이드

이 프로젝트는 **TradingView Charting Library**를 사용해 차트를 표시합니다.  
데이터는 백엔드 UDF(Universal Data Feed)를 통해 **바이낸스** 캔들을 제공합니다.

## 1. 라이선스

TradingView Charting Library는 **상용 사용 시 라이선스**가 필요합니다.

- [TradingView Charting Library](https://www.tradingview.com/charting-library-docs/) 에서 라이선스 및 다운로드 방법을 확인하세요.
- 라이선스를 받으면 라이브러리 패키지(파일)를 받을 수 있습니다.

## 2. 설치 (라이브러리 파일 배치)

1. TradingView에서 제공하는 **Charting Library** 패키지를 받습니다.
2. 패키지 안의 **`charting_library`** 폴더 전체를 프로젝트의 **`public/charting_library/`** 에 복사합니다.

```
autotrade/
  public/
    charting_library/     ← 여기에 라이브러리 파일 전체
      charting_library.standalone.js
      (기타 에셋들)
```

3. **`charting_library.standalone.js`** 가 다음 경로에 있어야 합니다.  
   (패키지에 따라 `bundles/charting_library.standalone.js` 등 다른 위치일 수 있습니다.)
   - 필요한 경우: `public/charting_library/charting_library.standalone.js` 로 복사하거나,
   - `src/components/TradingViewChartPanel.tsx` 의 `CHARTING_LIBRARY_SCRIPT` 경로를 실제 파일 경로에 맞게 수정하세요.

## 3. 동작 방식

- **프론트**: `TradingViewChartPanel` 이 `public/charting_library/` 의 스크립트를 로드하고, UDF 데이터피드 URL로 **`/api/udf`** 를 사용합니다.
- **백엔드**: FastAPI 라우터 `backend/api/udf.py` 가 다음 UDF 엔드포인트를 제공합니다.
  - `GET /api/udf/config` – 설정
  - `GET /api/udf/symbol_info?group=...` – 심볼 그룹
  - `GET /api/udf/symbols?symbol=...` – 심볼 resolve
  - `GET /api/udf/search?query=...` – 심볼 검색
  - `GET /api/udf/history?symbol=...&from=...&to=...&resolution=...` – 캔들 데이터 (바이낸스 연동)
  - `GET /api/udf/time` – 서버 시간

## 4. 라이브러리가 없을 때

`public/charting_library/` 에 파일이 없으면 차트 영역에 안내 문구가 표시됩니다.  
위 2번 단계대로 라이브러리 파일을 배치한 뒤 새로고침하면 됩니다.

## 5. Lightweight Charts로 되돌리기

기존 **Lightweight Charts** 기반 차트로 다시 사용하려면:

- `src/App.tsx` 에서 `TradingViewChartPanel` 대신 `ChartPanel` 을 import 하여 사용하면 됩니다.

```tsx
import { ChartPanel } from '@/components/ChartPanel'
// ...
<ChartPanel />
```
