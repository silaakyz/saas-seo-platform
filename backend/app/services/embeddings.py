import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_embedding(text: str):
    """
    Generates an embedding vector for the given text using OpenAI's text-embedding-3-small model.
    """
    try:
        # Ensure text is not too long for the model
        text = text[:8000] 
        
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None

def analyze_content(text: str):
    """
    Uses GPT-4o-mini to extract a clean title and a short summary (for embedding).
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{
                "role": "system", 
                "content": "You are an SEO expert. Extract the Title and a Summary (max 3 sentences) from the provided text. Return JSON: {\"title\": \"...\", \"summary\": \"...\"}"
            }, {
                "role": "user", 
                "content": text[:4000]
            }],
            response_format={ "type": "json_object" }
        )
        import json
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error analyzing content: {e}")
        return {"title": "Unknown", "summary": text[:200]}

def rewrite_article(text: str):
    """
    Rewrites the article using GPT-4o-mini to modernize it.
    """
    prompt = (
        "Sen profesyonel bir editörsün. Aşağıdaki makale eskidi. "
        "İçeriği modernize et, güncel örnekler ekle, tarihleri bugüne uyarla, "
        "okunabilirliği artır. Ancak URL yapısını ve ana başlığı değiştirme. "
        "HTML formatında çıktı ver."
    )
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": text[:15000]} # Limit context somewhat
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error rewriting article: {e}")
        return None
