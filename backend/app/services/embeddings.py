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

def intelligent_content_rewrite(old_html, target_keyword):
    """
    LLM kullanarak sayfa yapısını analiz eder ve bozmadan içeriği günceller.
    """
    import json
    
    # 1. Promptu Hazırla
    system_prompt = """
    Sen uzman bir Frontend Developer ve SEO Editörüsün. 
    Sana verilen HTML içeriğini, CSS class'larını ve DOM yapısını HİÇ BOZMADAN, 
    sadece metinleri güncelleyerek (rewriting) modernize etmelisin.
    Cevabı kesinlikle JSON formatında döndür.
    """
    
    user_prompt = f"""
    Lütfen aşağıdaki HTML içeriğini analiz et ve güncelle.
    
    HEDEF KEYWORD: {target_keyword}
    
    ESKİ HTML İÇERİĞİ:
    {old_html[:15000]}
    
    İSTENEN JSON ÇIKTISI FORMATI:
    {{
      "tech_stack": "WordPress/React/Wix/HTML",
      "updated_html_content": "Buraya güncellenmiş HTML gelecek"
    }}
    """

    try:
        # 2. OpenAI'a Gönder (JSON Modunda)
        response = client.chat.completions.create(
            model="gpt-4o-mini", # Veya gpt-4-turbo (Daha karmaşık yapılar için)
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}, # <--- BU ÇOK ÖNEMLİ
            temperature=0.7
        )

        # 3. JSON Yanıtı İşle
        result = json.loads(response.choices[0].message.content)
        
        print(f"🕵️ Tespit Edilen Altyapı: {result.get('tech_stack')}")
        
        return result.get('updated_html_content')

    except Exception as e:
        print(f"❌ AI Güncelleme Hatası: {e}")
        return None
