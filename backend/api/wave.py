"""
Wave Engine API – 심볼/타임프레임 변경 시 OHLCV 로드 및 파동 재계산
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class WaveRequest(BaseModel):
    symbol: str
    timeframe: str


class WaveResponse(BaseModel):
    primary: str
    alternative: str
    invalidation: float | None
    triggers: list[dict]
    targets: list[dict]


@router.post("/run", response_model=WaveResponse)
def run_wave_engine(req: WaveRequest):
    # TODO: Load OHLCV → Run Wave Engine → Return wave state
    return WaveResponse(
        primary="",
        alternative="",
        invalidation=None,
        triggers=[],
        targets=[],
    )
