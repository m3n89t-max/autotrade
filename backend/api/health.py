from fastapi import APIRouter

from config import is_binance_configured

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/binance-status")
def binance_status():
    """Binance API 키 설정 여부만 반환 (키 값은 절대 노출 안 함)"""
    return {"configured": is_binance_configured()}
