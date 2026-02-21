"""
RAG API – 시스템개발정의서 §4 Chunking, §5 Vector Index, §5.2 검색
"""
from fastapi import APIRouter, UploadFile
from pydantic import BaseModel

router = APIRouter()


class IndexRequest(BaseModel):
    source_id: str
    text: str
    metadata: dict | None = None


class QueryRequest(BaseModel):
    query: str
    top_k: int = 5


class ChunkResult(BaseModel):
    chunk_id: str
    source_id: str
    text: str
    score: float


@router.post("/index")
def index_chunk(req: IndexRequest):
    # TODO: Chunking(500~1000토큰) → Vector DB 저장
    return {"chunk_ids": []}


@router.post("/upload")
async def upload_document(file: UploadFile):
    # TODO: TXT/PDF/PNG → 텍스트 추출 → Chunking → Index + Rule 후보 추출
    return {"source_id": "", "chunk_count": 0, "rule_candidates": []}


@router.post("/search", response_model=list[ChunkResult])
def search(req: QueryRequest):
    # TODO: Vector 검색 Top-K
    return []
