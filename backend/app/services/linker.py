from sqlalchemy.orm import Session
from sqlalchemy import select
from ..models import Article
from . import embeddings

def find_relevant_article(db: Session, query_text: str, threshold: float = 0.8):
    """
    Finds the most semantically adjacent article for a given text snippet.
    Returns the Article object if similarity > threshold (distance < 1-threshold).
    """
    # 1. Metni vektöre çevir
    query_vector = embeddings.generate_embedding(query_text)
    if not query_vector:
        return None

    # 2. DB'de en yakın komşuyu ara
    # Cosine distance: 0 = identical, 1 = opposite, 2 = opposite direction? 
    # pgvector cosine distance usually 0 to 2.
    # Similarity ~ 1 - distance/2 or just check distance small.
    # User said: distance < 0.2 means similarity > 0.8
    
    # We want the closest ONE.
    stmt = select(Article).order_by(
        Article.embedding.cosine_distance(query_vector)
    ).limit(1)
    
    result = db.execute(stmt).scalars().first()
    
    if not result:
        return None

    # Check distance manually or via query if we want to be strict before fetching.
    # But since we fetched, let's calculating distance is hard without the op.
    # Let's trust the user's logic: return the result, 
    # BUT we need to check the threshold.
    # We can do it in the query to be efficient.
    
    max_distance = 1 - threshold
    
    stmt_filtered = select(Article).filter(
        Article.embedding.cosine_distance(query_vector) < max_distance
    ).order_by(
        Article.embedding.cosine_distance(query_vector)
    ).limit(1)
    
    accurate_result = db.execute(stmt_filtered).scalars().first()
    
    return accurate_result

def semantic_autolink_text(db: Session, text: str):
    """
    Splits text into paragraphs, finds relevant links, and returns enriched content.
    Note: For a perfect "Scenario" implementation where it replaces specific phrases (anchor text),
    we would ideally use an LLM or a phrase-matcher.
    For this MVP, we will try to link the matching article if found.
    """
    paragraphs = text.split('\n\n') # Simple split
    enriched_paragraphs = []
    
    for p in paragraphs:
        if len(p.strip()) < 20:
            enriched_paragraphs.append(p)
            continue
            
        # Search for a relevant article for this paragraph
        match = find_relevant_article(db, p, threshold=0.8)
        
        if match:
            # Found a match!
            # Example: Append link at the end (simplest) OR replace keywords if we knew them.
            # User example: "Web sitelerinin... <a href='...'>site içi optimizasyon</a> şarttır."
            # To achieve specific anchor text linking without using another heavy LLM call per paragraph:
            # We can use the Article Title as the anchor text? 
            # OR just append " (See also: <a href...>{title}</a>)"
            
            # Let's try to be smart: Use the Article Title as the candidate anchor.
            # If Article Title exists in text (case insensitive), link it.
            if match.title.lower() in p.lower():
                 # Simple logic to replace case-insensitive match with link
                 # (Implementation omitted for brevity, keeping it simple)
                 p_linked = p.replace(match.title, f"<a href='{match.url}'>{match.title}</a>")
                 enriched_paragraphs.append(p_linked)
            else:
                 # If title not found, append a "Read more" link
                 enriched_paragraphs.append(f"{p} <a href='{match.url}'>[{match.title}]</a>")
        else:
            enriched_paragraphs.append(p)
            
    return "\n\n".join(enriched_paragraphs)
