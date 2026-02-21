"""
AI Chat API – RAG + Rule 기반 응답 (시스템개발정의서 §10)
Primary / Alternative / Invalidation / Entry Trigger / Risk 블록 출력
"""
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    symbol: str | None = None
    context: dict | None = None


class ChatResponse(BaseModel):
    primary_scenario: str
    alternative_scenario: str
    invalidation: str
    entry_trigger: str
    risk: str
    sources: list[dict]  # 근거 규칙/청크


@router.post("/ask", response_model=ChatResponse)
def chat_ask(req: ChatRequest):
    # TODO: RAG 검색 + 활성 규칙 검색 → AI 생성 → 근거 표시
    return ChatResponse(
        primary_scenario="",
        alternative_scenario="",
        invalidation="",
        entry_trigger="",
        risk="",
        sources=[],
    )
