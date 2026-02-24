"""
TradingView Charting Library – UDF (Universal Data Feed) 백엔드
바이낸스 캔들 데이터를 UDF 형식으로 제공.
"""
import time
from typing import Any

from fastapi import APIRouter, Query, HTTPException

from api.market import fetch_klines, INTERVAL_MAP

router = APIRouter(prefix="/udf", tags=["udf"])

# TradingView resolution → Binance interval
UDF_RESOLUTION_MAP = {
    "1": "1m",
    "5": "5m",
    "15": "15m",
    "30": "30m",
    "60": "1h",
    "240": "4h",
    "1D": "1d",
    "D": "1d",
    "1W": "1w",
    "W": "1w",
    "1M": "1M",
    "M": "1M",
}

# 기본 심볼 그룹 (워치리스트용)
DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"]


@router.get("/config")
def udf_config() -> dict[str, Any]:
    """Charting Library 초기 설정."""
    return {
        "supported_resolutions": ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
        "supports_group_request": True,
        "supports_search": True,
        "supports_marks": False,
        "supports_timescale_marks": False,
        "supports_time": True,
        "exchanges": [{"value": "Binance", "name": "Binance", "desc": "Binance Spot"}],
        "symbols_types": [{"value": "crypto", "name": "Cryptocurrency"}],
        "currency_codes": [{"id": "USD", "code": "USD", "name": "US Dollar"}],
    }


@router.get("/symbol_info")
def udf_symbol_info(group: str = Query("crypto", description="심볼 그룹")) -> dict[str, Any]:
    """심볼 그룹 정보 (response-as-a-table)."""
    symbols = DEFAULT_SYMBOLS
    return {
        "symbol": symbols,
        "description": [f"{s} / USDT" for s in symbols],
        "exchange_listed_name": ["Binance"] * len(symbols),
        "minmovement": 1,
        "minmovement2": 0,
        "pricescale": [2, 2, 4, 2, 4],  # 소수 자리
        "has-intraday": True,
        "has-daily": True,
        "has-weekly-and-monthly": True,
        "type": ["crypto"] * len(symbols),
        "ticker": symbols,
        "timezone": "Etc/UTC",
        "session-regular": "24x7",
        "supported-resolutions": ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
    }


@router.get("/search")
def udf_search(
    query: str = Query("", description="검색어"),
    type_: str = Query("", alias="type"),
    limit: int = Query(30, ge=1, le=100),
) -> list[dict[str, Any]]:
    """심볼 검색 (Charting Library Symbol Search)."""
    q = (query or "").upper().strip()
    results = []
    for s in DEFAULT_SYMBOLS:
        if not q or q in s:
            results.append({
                "symbol": s,
                "full_name": s,
                "description": f"{s} / USDT",
                "exchange": "Binance",
                "ticker": s,
                "type": "crypto",
            })
        if len(results) >= limit:
            break
    return results


@router.get("/symbols")
def udf_symbols(symbol: str = Query(..., description="심볼 이름 (예: BTCUSDT)")) -> dict[str, Any]:
    """단일 심볼 resolve."""
    s = symbol.upper().strip()
    if not s.endswith("USDT"):
        s = f"{s}USDT" if not s.endswith("USDT") else s
    return {
        "symbol": s,
        "description": f"{s} / USDT",
        "exchange": "Binance",
        "minmovement": 1,
        "minmovement2": 0,
        "pricescale": 2,
        "has_intraday": True,
        "has_daily": True,
        "has_weekly_and_monthly": True,
        "type": "crypto",
        "ticker": s,
        "timezone": "Etc/UTC",
        "session": "24x7",
        "supported_resolutions": ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
    }


@router.get("/history")
def udf_history(
    symbol: str = Query(..., description="심볼 (예: BTCUSDT)"),
    from_ts: int = Query(..., alias="from", description="Unix timestamp (초)"),
    to_ts: int = Query(..., alias="to", description="Unix timestamp (초)"),
    resolution: str = Query(..., description="1, 5, 15, 30, 60, 240, 1D, 1W, 1M"),
    countback: int | None = Query(None, description="요청 봉 개수 (우선)"),
) -> dict[str, Any]:
    """과거 봉 데이터 (UDF 형식)."""
    interval = UDF_RESOLUTION_MAP.get(resolution, resolution)
    if interval not in INTERVAL_MAP and interval not in INTERVAL_MAP.values():
        interval = "1h"
    limit = countback if countback is not None and 1 <= countback <= 5000 else 1000
    try:
        raw = fetch_klines(symbol.upper(), interval, limit)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    if not raw:
        return {"s": "no_data", "nextTime": to_ts}
    t, o, h, l, c, v = [], [], [], [], [], []
    for r in raw:
        if not isinstance(r, (list, tuple)) or len(r) < 6:
            continue
        t.append(int(r[0]) // 1000)
        o.append(float(r[1]))
        h.append(float(r[2]))
        l.append(float(r[3]))
        c.append(float(r[4]))
        v.append(float(r[5]))
    if not t:
        return {"s": "no_data", "nextTime": to_ts}
    return {
        "s": "ok",
        "t": t,
        "o": o,
        "h": h,
        "l": l,
        "c": c,
        "v": v,
    }


@router.get("/time")
def udf_time() -> int:
    """서버 시간 (Unix 초)."""
    return int(time.time())
