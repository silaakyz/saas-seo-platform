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

def rewrite_article(text: str, target_keyword: str = ""):
    """
    Rewrites the article using GPT-4o-mini to modernize it while preserving HTML structure.
    Uses the 'Mega Prompt'.
    """
    import json
    
    prompt = f"""
SİSTEM ROLÜ:
Sen uzman bir Frontend Developer ve SEO Editörüsün. Görevin, sana verilen eski bir web sayfası içeriğini analiz etmek, teknolojisini tespit etmek ve HTML yapısını (DOM Tree, CSS Class'ları, ID'leri) %100 KORUYARAK içeriği güncellemektir.

GÖREVLER:
1. ALTYAPI ANALİZİ: Verilen HTML koduna bakarak bu sitenin altyapısını tespit et (WordPress, React/Next.js, Wix, Shopify veya Standart HTML).
2. İÇERİK GÜNCELLEME: Makale metnini günümüz (2025-2026) bilgilerine göre modernize et. Asla uydurma bilgi ekleme.
3. YAPI KORUMA (KRİTİK): 
   - <div class="...">, <span id="..."> gibi yapısal etiketlere ASLA dokunma.
   - React data attribute'larını (data-reactid, data-v-...) asla silme.
   - Sadece taglerin içindeki "innerText" (Görünen Metin) kısmını değiştir.
   - Görsel linklerini (img src) koru veya yer tutucu (placeholder) koy, silme.

GİRDİ VERİSİ (ESKİ HTML):
{text[:15000]}

HEDEF KEYWORD:
{target_keyword}

ÇIKTI FORMATI (JSON):
Cevabını SADECE aşağıdaki JSON formatında ver:
{{
  "tech_stack": "Tespit edilen altyapı (örn: React, WordPress)",
  "html_structure_analysis": "Kısaca yapının analizi (örn: Tailwind kullanılmış, yoğun div yapısı var)",
  "updated_html_content": "Güncellenmiş, yapısı bozulmamış HTML kodu"
}}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Sen bir veri çıkarma ve frontend uzmanısın. Sadece JSON döndür."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        content_json = json.loads(response.choices[0].message.content)
        print(f"[{target_keyword}] Altyapı: {content_json.get('tech_stack')} | Analiz: {content_json.get('html_structure_analysis')}")
        return content_json.get('updated_html_content')
        
    except Exception as e:
        print(f"Error rewriting article: {e}")
        return None
