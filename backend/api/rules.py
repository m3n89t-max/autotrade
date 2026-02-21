"""
Rule DB API – 시스템개발정의서 §6 Rule DSL, §7 Rule Candidate, §8 Engine 연동
"""
from fastapi import APIRouter, UploadFile
from pydantic import BaseModel
from typing import Literal

router = APIRouter()


class RuleCandidate(BaseModel):
    rule_id: str
    rule_type: Literal[
        "wave.validation", "wave.invalidation",
        "strategy.entry", "strategy.exit", "risk", "econ.blackout"
    ]
    name: str
    priority: int
    if_conditions: list[str]
    then_verdict: str
    exceptions: list[dict] | None = None
    applies_to: dict | None = None
    source_doc_id: str | None = None
    source_chunk_id: str | None = None
    confidence: float
    status: Literal["draft", "active", "deprecated"]


@router.get("/active", response_model=list[RuleCandidate])
def list_active_rules():
    # TODO: Rule DB 조회 (status=active)
    return []


@router.post("/review/approve")
def approve_rule(rule_id: str = ""):
    # TODO: status=active
    return {"ok": True}


@router.post("/review/reject")
def reject_rule(rule_id: str = ""):
    return {"ok": True}


@router.post("/extract")
async def extract_candidates(file: UploadFile):
    # TODO: 업로드 문서 → Rule 후보 자동 추출 (§7)
    return {"candidates": []}
