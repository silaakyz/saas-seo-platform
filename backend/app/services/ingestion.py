import trafilatura
from trafilatura.sitemaps import sitemap_search
import json
from datetime import datetime
from openai import OpenAI
from ..models import Article, Entity, ArticleEntity
from ..database import SessionLocal

# LLM ve Veritabanı Ayarları
client = OpenAI() # .env dosyasından key'i otomatik okur

def process_universal_target(url, user_id):
    """
    Bu fonksiyon 'Evrensel Giriş Kapısı'dır.
    URL ana sayfa mı yoksa tekil makale mi karar verir ve akışı başlatır.
    """
    db = SessionLocal()
    print(f"🚀 Evrensel tarama başladı: {url}")

    # ADIM 1: KEŞİF (DISCOVERY)
    # Önce bunun bir sitemap veya ana sayfa olup olmadığına bakalım
    urls_to_process = []
    
    # Sitemap araması yap (Trafilatura'nın evrensel sitemap bulucusu)
    try:
        sitemap_links = sitemap_search(url)
    except Exception as e:
        print(f"Sitemap search error: {e}")
        sitemap_links = []
    
    if sitemap_links:
        print(f"📦 Sitemap bulundu! {len(sitemap_links)} link içeriyor.")
        urls_to_process = sitemap_links
    else:
        # Sitemap yoksa, sayfayı tekil bir makale gibi varsayalım
        print("ℹ️ Sitemap bulunamadı, tekil URL işleniyor.")
        urls_to_process = [url]

    # Bulunan her URL için Evrensel Çıkarma işlemini yap
    processed_count = 0
    for target_url in urls_to_process:
        # Zaten ekli mi kontrol et (Tekrar işleme)
        exists = db.query(Article).filter(Article.url == target_url).first()
        if exists:
            continue
            
        success = pipeline_execution(target_url, db, user_id)
        if success:
            processed_count += 1
            
    db.close()
    return f"{processed_count} makale başarıyla evrensel analizden geçirildi."

def pipeline_execution(url, db, user_id):
    """
    Tek bir URL'yi 3 aşamalı evrensel filtreden geçirir.
    """
    try:
        # ADIM 2: EVRENSEL ÇIKARMA (EXTRACTION)
        downloaded = trafilatura.fetch_url(url)
        
        if downloaded is None:
            return False
            
        # HTML'den temiz metni ayıkla (Reklamları, menüleri atar)
        text_content = trafilatura.extract(downloaded, include_comments=False)
        
        if not text_content or len(text_content) < 500:
            # Çok kısa içerikleri (İletişim sayfası vb.) atla
            return False

        # ADIM 3: ANLAMLANDIRMA & TARİH (INTELLIGENCE via LLM)
        # Trafilatura tarihi bazen kaçırabilir, en garantisi LLM'e sormaktır.
        # Ayrıca "Bu bir blog yazısı mı?" kontrolünü de LLM yapar.
        
        analysis = analyze_with_llm(text_content[:3000]) # İlk 3000 karakter yeterli
        
        if not analysis.get("is_blog_post"):
            print(f"⏩ Blog yazısı değil, atlanıyor: {url}")
            return False

        # ADIM 4: VEKTÖRLEŞTİRME (EMBEDDING)
        # Başlık + Özet bilgisini vektöre çevir
        vector_text = f"{analysis['title']} {analysis['summary']}"
        embedding = get_embedding(vector_text)

        if not embedding or len(embedding) == 0:
            print(f"❌ Embedding oluşturulamadı (Muhtemelen OpenAI kotası doldu): {url}")
            return False

        # ADIM 5: KAYIT (STORAGE)
        publish_date_val = analysis.get('publish_date')
        if hasattr(publish_date_val, 'startswith'): # is boolean check if string
             try:
                 publish_date_val = datetime.strptime(publish_date_val, '%Y-%m-%d')
             except:
                 publish_date_val = datetime.utcnow()
        else:
             publish_date_val = datetime.utcnow()

        new_article = Article(
            url=url,
            title=analysis['title'],
            content_summary=analysis['summary'],
            publish_date=publish_date_val,
            embedding=embedding,
            user_id=user_id,
            target_keyword=analysis.get('target_keyword', analysis['title']),
            html_structure_sample=str(downloaded)[:100000] if downloaded else None, # İlk 100KB'ı sakla
            raw_content_hash=str(hash(text_content)) # Değişiklik takibi için
        )
        
        db.add(new_article)
        db.commit()
        
        # Entity Kaydı
        if analysis.get("entities"):
            for ent in analysis["entities"]:
                # Entity var mı diye bak, yoksa oluştur
                existing_entity = db.query(Entity).filter(Entity.name == ent['name']).first()
                if not existing_entity:
                    existing_entity = Entity(name=ent['name'], category=ent['category'])
                    db.add(existing_entity)
                    db.commit()
                
                # İlişkiyi kaydet
                rel = ArticleEntity(article_id=new_article.id, entity_id=existing_entity.id)
                db.add(rel)
            db.commit()

        print(f"✅ Eklendi: {analysis['title']}")
        return True

    except Exception as e:
        print(f"❌ Hata ({url}): {e}")
        return False

def analyze_with_llm(text_chunk):
    """
    GPT-4o-mini kullanarak metinden yapısal veri çıkarır.
    """
    prompt = """
    Aşağıdaki metni analiz et ve JSON formatında şu bilgileri ver:
    1. is_blog_post: (boolean) Bu bir makale mi?
    2. title: (string) Başlık.
    3. summary: (string) 2 cümlelik özet.
    4. publish_date: (string) YYYY-MM-DD. Yoksa null.
    
    5. target_keyword: (string) Bu makaleyi en iyi tanımlayan 1-2 kelimelik SEO anahtar kelimesi (Örn: 'SEO Fiyatları', 'Python Dersleri'). Başlıktan türet.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Sen bir veri çıkarma uzmanısın. Sadece JSON döndür."},
                {"role": "user", "content": f"{prompt}\n\nMETİN:\n{text_chunk}"}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"LLM Error: {e}")
        return {"is_blog_post": False}

def get_embedding(text):
    """
    OpenAI Text Embedding 3 Small ile vektör oluşturur.
    """
    try:
        response = client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Embedding Error: {e}")
        return []
