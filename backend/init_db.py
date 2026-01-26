from app.database import engine, SessionLocal
from app.models import Article, Base
from sqlalchemy import text
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    try:
        db = SessionLocal()
        # Enable pgvector extension
        logger.info("Enabling pgvector extension...")
        db.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        db.commit()
        logger.info("pgvector extension enabled.")
        
        # Create tables
        logger.info("Creating tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Tables created successfully.")
        
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
