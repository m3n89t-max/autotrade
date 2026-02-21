"""
환경 변수 로드 – .env에 있는 Binance API 키 등 사용
키는 절대 로그/응답에 노출하지 말 것.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

# 프로젝트 루트(autotrade) 또는 backend 폴더의 .env 로드
for base in [Path(__file__).resolve().parent.parent, Path(__file__).resolve().parent]:
    env_path = base / ".env"
    if env_path.exists():
        load_dotenv(env_path)
        break


def get_binance_api_key() -> str:
    """Binance API Key (.env의 BINANCE_API_KEY)"""
    return os.environ.get("BINANCE_API_KEY", "").strip()


def get_binance_api_secret() -> str:
    """Binance API Secret (.env의 BINANCE_SECRET_KEY)"""
    return os.environ.get("BINANCE_SECRET_KEY", "").strip()


def is_binance_configured() -> bool:
    """Binance 연동 가능 여부 (키가 설정되었는지만 확인, 값 노출 안 함)"""
    return bool(get_binance_api_key() and get_binance_api_secret())
