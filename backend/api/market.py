"""
바이낸스 시세 API – K线(캔들) 조회 (공개 API, API 키 불필요)
차트용 과거/현재 OHLCV 제공
"""
import urllib.parse
import urllib.request
import json
from fastapi import APIRouter, Query

router = APIRouter()

BINANCE_KLINES = "https://api.binance.com/api/v3/klines"

# UI 타임프레임 → Binance interval
INTERVAL_MAP = {
    "1m": "1m",
    "5m": "5m",
    "15m": "15m",
    "1H": "1h",
    "4H": "4h",
    "1D": "1d",
    "1W": "1w",
}


def fetch_klines(symbol: str, interval: str, limit: int = 500) -> list:
    """바이낸스 공개 API로 K线 조회. [ openTime, open, high, low, close, volume, ... ] """
    interval = INTERVAL_MAP.get(interval, interval)
    params = urllib.parse.urlencode({"symbol": symbol, "interval": interval, "limit": limit})
    url = f"{BINANCE_KLINES}?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "AUTOTRADE/1.0"})
    with urllib.request.urlopen(req, timeout=10) as res:
        return json.loads(res.read().decode())


@router.get("/klines")
def get_klines(
    symbol: str = Query(..., description="예: BTCUSDT"),
    interval: str = Query("1h", description="1m, 5m, 15m, 1H, 4H, 1D, 1W"),
    limit: int = Query(500, ge=1, le=1000),
):
    """
    바이낸스에서 캔들 데이터 조회.
    반환: [{ time, open, high, low, close, volume }, ...]
    """
    raw = fetch_klines(symbol, interval, limit)
    out = []
    for r in raw:
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
