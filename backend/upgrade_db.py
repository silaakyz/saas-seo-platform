from app.database import engine
from sqlalchemy import text
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def upgrade_db():
    try:
        with engine.connect() as conn:
            logger.info("Attempting to add target_keyword column...")
            try:
                conn.execute(text("ALTER TABLE articles ADD COLUMN IF NOT EXISTS target_keyword VARCHAR;"))
                conn.commit()
                logger.info("Column added successfully (or already existed).")
            except Exception as e:
                # E.g. UndefinedTable error
                logger.warning(f"Alter table failed: {e}. Trying to create tables instead...")
                from app.models import Base
                Base.metadata.create_all(bind=engine)
                logger.info("Tables created using metadata.create_all.")
            
    except Exception as e:
        logger.error(f"Error upgrading database: {e}")

if __name__ == "__main__":
    upgrade_db()
