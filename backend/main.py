"""
AUTOTRADE – NEoWave 기반 자동매매 백엔드
UI개발정의서 / 시스템개발정의서 참조
.env의 BINANCE_API_KEY, BINANCE_API_SECRET 사용 (노출 금지)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import health, wave, econ, chat, rules, rag, market, udf
import config  # noqa: F401 – .env 로드

app = FastAPI(title="AUTOTRADE API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(wave.router, prefix="/api/wave", tags=["wave"])
app.include_router(econ.router, prefix="/api/econ", tags=["econ"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(rules.router, prefix="/api/rules", tags=["rules"])
app.include_router(rag.router, prefix="/api/rag", tags=["rag"])
app.include_router(market.router, prefix="/api/market", tags=["market"])
app.include_router(udf.router, prefix="/api", tags=["udf"])


@app.get("/")
def root():
    return {"app": "AUTOTRADE", "docs": "/docs"}
