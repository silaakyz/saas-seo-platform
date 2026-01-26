import requests
import json
import os

def get_competitor_analysis(keyword):
    """
    Hedef kelime için Google'daki ilk 5 sonucu çeker ve özetler.
    """
    url = "https://google.serper.dev/search"
    api_key = os.getenv("SERPER_API_KEY")

    if not api_key:
        print("Warning: SERPER_API_KEY not found in environment variables.")
        return "Rakip analizi yapılamadı (API Key eksik)."

    payload = json.dumps({
        "q": keyword,
        "num": 5, # İlk 5 rakip yeterli
        "gl": "tr", # Türkiye sonuçları (Kullanıcı seçimine göre değişebilir)
        "hl": "tr"
    })
    
    headers = {
        'X-API-KEY': api_key,
        'Content-Type': 'application/json'
    }

    try:
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
        results = response.json().get("organic", [])
        
        if not results:
            return "Rakip verisi bulunamadı."

        # LLM'e göndermek için veriyi özetleyelim
        analysis_text = f"Google '{keyword}' aramasındaki ilk 5 rakip:\n"
        for item in results:
            analysis_text += f"- Başlık: {item.get('title')}\n  Link: {item.get('link')}\n  Özet: {item.get('snippet')}\n\n"
            
        return analysis_text
        
    except Exception as e:
        print(f"Serper Hatası: {e}")
        return "Rakip verisi çekilemedi."
