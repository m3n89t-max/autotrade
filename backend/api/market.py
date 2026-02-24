"""
바이낸스 시세 API – K线(캔들) 조회 (공개 API, API 키 불필요)
차트용 과거/현재 OHLCV 제공. 1000봉 초과 시 endTime으로 구간 반복 요청.
"""
import urllib.parse
import urllib.request
import json
from typing import Optional

from fastapi import APIRouter, Query, HTTPException

router = APIRouter()

BINANCE_KLINES = "https://api.binance.com/api/v3/klines"
MAX_PER_REQUEST = 1000

# UI 타임프레임 → Binance interval
INTERVAL_MAP = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "30m": "30m",
    "1H": "1h",
    "4H": "4h",
    "1D": "1d",
    "1W": "1w",
    "1M": "1M",
}


def fetch_klines_chunk(
    symbol: str, interval: str, limit: int = 500, end_time_ms: Optional[int] = None
) -> list:
    """바이낸스 공개 API로 K线 한 번 조회 (최대 1000봉). [ openTime, open, high, low, close, volume, ... ] """
    interval = INTERVAL_MAP.get(interval, interval)
    params = {"symbol": symbol, "interval": interval, "limit": min(limit, MAX_PER_REQUEST)}
    if end_time_ms is not None:
        params["endTime"] = end_time_ms
    url = f"{BINANCE_KLINES}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "AUTOTRADE/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode())
    except OSError as e:
        raise HTTPException(status_code=502, detail=f"Binance API error: {str(e)}")
    if isinstance(data, dict) and ("code" in data or "msg" in data):
        raise HTTPException(status_code=502, detail=data.get("msg", "Binance API error"))
    if not isinstance(data, list):
        raise HTTPException(status_code=502, detail="Unexpected Binance response")
    return data


def fetch_klines(symbol: str, interval: str, limit: int) -> list:
    """limit이 1000 이하면 1회, 초과면 endTime으로 과거 구간 반복 요청해 1년치까지 확보."""
    if limit <= MAX_PER_REQUEST:
        return fetch_klines_chunk(symbol, interval, limit)
    # 1000봉씩 과거로 요청 (응답은 시계순: [과거 ... 최신])
    raw: list = []
    end_time_ms: Optional[int] = None
    while len(raw) < limit:
        chunk = fetch_klines_chunk(symbol, interval, MAX_PER_REQUEST, end_time_ms)
        if not chunk:
            break
        raw = chunk + raw
        if len(chunk) < MAX_PER_REQUEST:
            break
        # 다음 요청은 이번 청크 가장 과거 시점 이전
        end_time_ms = int(chunk[0][0]) - 1
    return raw[:limit]


@router.get("/klines")
def get_klines(
    symbol: str = Query(..., description="예: BTCUSDT"),
    interval: str = Query("1h", description="1m, 5m, 15m, 30m, 1H, 4H, 1D, 1W"),
    limit: int = Query(1000, ge=1, le=600000, description="최대 60만봉, 1년 1분봉 약 52만봉"),
):
    """
    바이낸스에서 캔들 데이터 조회. 1000봉 초과 시 자동으로 과거 구간 반복 요청.
    반환: [{ time, open, high, low, close, volume }, ...]
    """
    try:
        raw = fetch_klines(symbol, interval, limit)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Klines error: {str(e)}")
    out = []
    for r in raw:
        if not isinstance(r, (list, tuple)) or len(r) < 6:
            continue
        t_ms = int(r[0])
        # lightweight-charts: time은 초 단위 unix 또는 "YYYY-MM-DD" 문자열
        out.append({
            "time": t_ms // 1000,
            "open": float(r[1]),
            "high": float(r[2]),
            "low": float(r[3]),
            "close": float(r[4]),
            "volume": float(r[5]),
        })
    return out
