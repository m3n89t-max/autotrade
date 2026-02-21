"""
US Economic Calendar API – 이벤트 목록, Actual 업데이트, blackout
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class EconEvent(BaseModel):
    id: str
    timeET: str
    event: str
    impact: str
    forecast: str | None
    actual: str | None
    previous: str | None
    surprise: float | None
    countdownMinutes: int | None


@router.get("/events", response_model=list[EconEvent])
def get_events():
    # TODO: 날짜/Impact/유형 필터, 실제 데이터 소스 연동
    return []


@router.get("/blackout")
def get_blackout_windows():
    return {"windows": []}
