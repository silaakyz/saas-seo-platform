import trafilatura
from htmldate import find_date
from datetime import datetime

def fetch_article_content(url: str):
    """
    Fetches the article content from the given URL using Trafilatura.
    Returns a dictionary with title, content, and published_date.
    """
    downloaded = trafilatura.fetch_url(url)
    if not downloaded:
        return None

    # Extract clean text
    content = trafilatura.extract(downloaded)
    
    # Try to extract title specifically if extract() didn't give it clearly, 
    # but trafilatura usually handles it. 
    # Let's extract metadata to get the title reliably.
    metadata = trafilatura.extract_metadata(downloaded)
    title = metadata.title if metadata else None
    
    # Find date
    try:
        date_str = find_date(downloaded)
        pub_date = datetime.strptime(date_str, '%Y-%m-%d') if date_str else datetime.utcnow()
    except:
        pub_date = datetime.utcnow()

    if not content:
        return None

    return {
        "title": title,
        "content": content,
        "published_at": pub_date
    }
