from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class Article(Base):
    __tablename__ = 'articles'

    id = Column(Integer, primary_key=True)
    url = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    content_summary = Column(Text) # Vektörleme için özet
    
    # --- YENİ EKLENECEK SATIR ---
    target_keyword = Column(String, nullable=True) # Anahtar kelimeyi burada saklayacağız
    # ----------------------------
    
    publish_date = Column(DateTime, default=datetime.utcnow)
    
    # KRİTİK KISIM: Makalenin anlamını tutan 1536 boyutlu vektör (OpenAI standardı)
    embedding = Column(Vector(1536))
    
    is_updated_by_ai = Column(Boolean, default=False)
    last_crawled_at = Column(DateTime, default=datetime.utcnow)

    # Universal Pipeline Metadata
    user_id = Column(String, nullable=True) # Supabase User ID
    raw_content_hash = Column(String, nullable=True) # Değişiklik takibi için
