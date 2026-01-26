from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from .database import get_db, engine
from .models import Base, Article
from .services import crawler, embeddings, linker
from .worker import start_scheduler
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    start_scheduler()
    yield
    # Shutdown (if needed)

app = FastAPI(title="SEO Automation API", lifespan=lifespan)

class IngestRequest(BaseModel):
    url: str
    user_id: str

class SearchRequest(BaseModel):
    query: str
    threshold: Optional[float] = 0.8

from fastapi import BackgroundTasks

@app.post("/ingest")
def ingest_url(request: IngestRequest, background_tasks: BackgroundTasks):
    from .services import ingestion
    # Run in background to avoid HTTP timeout on Render
    background_tasks.add_task(ingestion.process_universal_target, request.url, request.user_id)
    return {"message": "Ingestion started", "details": "Tarama işlemi arka planda başlatıldı. Sitenin boyutuna göre birkaç dakika sürebilir. Lütfen bekleyin."}

@app.post("/search")
def search_articles(request: SearchRequest, db: Session = Depends(get_db)):
    """
    Finds semantically similar articles using Cosine Similarity.
    """
    # 1. Embed query
    query_vector = embeddings.generate_embedding(request.query)
    if not query_vector:
        raise HTTPException(status_code=500, detail="Failed to embed query")

    # 2. Search in DB
    # Note: linker service will handle the SQLalchemy specific vector query
    results = linker.find_similar_articles(db, query_vector, request.threshold)
    
    return results

@app.post("/autolink")
def autolink_content(request: SearchRequest, db: Session = Depends(get_db)):
    """
    Takes a text (query) and attempts to insert semantic links to existing articles.
    """
    # Using the 'query' field of SearchRequest to pass the content text
    content = request.query
    if not content:
        raise HTTPException(status_code=400, detail="No content provided")
        
    linked_content = linker.semantic_autolink_text(db, content)
    
    return {"original": content, "enriched": linked_content}

@app.post("/admin/force-refresh")
def force_refresh_content(db: Session = Depends(get_db)):
    """
    Manually triggers the background update job.
    """
    from .worker import check_and_update_articles
    # Since worker uses its own SessionLocal, we can just call it directly.
    # ideally we should run this in background task to avoid blocking API
    from fastapi import BackgroundTasks
    # But since I didn't inject background_tasks here, let's just call it (demo) 
    # OR better: run in thread? The worker function is synchronous.
    # Let's run it synchronously for the toast confirmation, or usually background is better.
    # For demo simplicity -> Synchronous ok, or use existing scheduler.
    
    # Let's verify scheduler job exists? 
    # Or just call the function.
    try:
        check_and_update_articles()
        return {"message": "Update job triggered manually."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "ok", "service": "SEO Automation Backend", "version": "1.1"}

@app.get("/debug/routes")
def list_routes():
    return [route.path for route in app.routes]
