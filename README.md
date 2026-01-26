# 🚀 AI SEO SaaS Platform (v1.2) - Teknik Dokümantasyon

**Otonom İçerik Yönetimi ve Semantik SEO Platformu**

[![Python 3.11](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)](https://fastapi.tiangolo.com/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.31-FF4B4B.svg)](https://streamlit.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/AI-Model-412991.svg)](https://openai.com/)

---

## 📖 1. Proje Açıklaması
Bu proje, web sitelerinin SEO (Arama Motoru Optimizasyonu) süreçlerini otonom hale getiren, yapay zeka destekli bir SaaS platformudur. Geleneksel SEO araçlarından farklı olarak sadece analiz yapmaz; içeriği **anlar**, **linkler** ve **günceller**.

### Temel Yetenekler:
*   **Akıllı Tarama (Universal Ingestion):** Her türlü web sitesini ve sitemap'i tarayıp yapılandırılmış veriye dönüştürür.
*   **Anlamsal Linkleme (Semantic Linking):** Anahtar kelime eşleşmesi yerine anlam (vektör) eşleşmesi yaparak en doğru iç link önerilerini sunar.
*   **Otonom Güncelleme:** İçeriklerin güncelliğini takip eder ve eskimiş makaleleri Google rakiplerine bakarak (SERP Analizi) otomatik yeniler.
*   **Knowledge Graph:** Site içindeki varlıkların (Kişi, Teknoloji, Marka) haritasını çıkarır.

---

## 🎯 2. Senaryo Tanımı
Dijital ajanslar ve büyük blog sahipleri için üç temel sorun vardır:
1.  **Eski İçerik:** Yüzlerce yazının güncelliğini korumak imkansızdır.
2.  **Yanlış Linkleme:** Editörler eski yazıları hatırlamaz, bu yüzden yeni yazılardan eskilere link verilemez (yetim sayfalar).
3.  **Rakip Takibi:** Her yazı için Google'da rakipleri manuel inceleyip içeriği güncellemek saatler sürer.

**Çözüm Senaryosu:**
Kullanıcı, bir URL girer veya Sitemap adresini verir. Sistem tüm siteyi tarar ve Vektör Veritabanına kaydeder. Kullanıcı yeni bir yazı yazarken sistem, "Bu yazı X, Y ve Z eski yazılarınızla alakalı, şuralara link ver" der. Ayrıca, arka planda çalışan "Worker", 6 aydır güncellenmemiş bir yazı bulduğunda Google'da o konuyu aratır, rakiplerin yeni başlıklarını analiz eder ve yazıyı (HTML yapısını bozmadan) modernize eder.

---

## 🏗️ 3. MVC Mimarisi ve Teknik Yapı

Proje, modern ve ölçeklenebilir bir mimari üzerine kurulmuştur. **Model-View-Controller (MVC)** prensiplerine sadık kalınmıştır.

### **Model (Veri Katmanı)**
`app/models.py` dosyasında PostgreSQL tabloları tanımlanmıştır:
*   **Article:** İçerik, vektör (embedding), özet ve HTML yapısı.
*   **Entity:** Kişi, kurum veya kavramlar.
*   **ArticleEntity:** Makaleler ve varlıklar arasındaki ilişki.
*   **Supabase (PostgreSQL + pgvector):** Verilerin fiziksel olarak saklandığı bulut veritabanı.

### **View (Sunum Katmanı)**
Kullanıcı ile etkileşime giren arayüz katmanıdır:
*   **Streamlit (`frontend.py`):** Python ile yazılmış reaktif web arayüzü.
    *   Tarama ekranı, Linkleme editörü, Konu Haritası görselleştirmesi.
    *   JSON API yanıtlarını insan tarafından okunabilir grafiklere ve kartlara dönüştürür.

### **Controller (İş Mantığı Katmanı)**
Veri ile arayüz arasındaki köprüdür. `backend/app/main.py` ve servisler:
*   **Ingestion Service (`ingestion.py`):** Veriyi çeker, temizler ve AI ile analiz eder.
*   **Serp Service (`serp.py`):** Google API ile rakipleri analiz eder.
*   **Linker Service (`linker.py`):** Vektör araması yaparak alakalı içerikleri bulur.
*   **Worker (`worker.py`):** Arka planda zamanlanmış görevleri (Cron Jobs) yönetir.

---

## 📊 4. Veritabanı ER Diyagramı

Sistemin kalbinde ilişkisel ve vektörel veritabanı bulunur.

```mermaid
erDiagram
    ARTICLES {
        int id PK
        string url
        string title
        text content_summary
        vector embedding "1536 dim"
        string target_keyword
        text html_structure_sample "Raw HTML"
        datetime last_crawled_at
    }

    ENTITIES {
        int id PK
        string name
        string category "Person, Org, etc."
    }

    ARTICLE_ENTITIES {
        int id PK
        int article_id FK
        int entity_id FK
    }

    ARTICLES ||--o{ ARTICLE_ENTITIES : contains
    ENTITIES ||--o{ ARTICLE_ENTITIES : appears_in
```

---

## 🔌 5. API Endpoint Listesi

Backend servislerine erişim sağlayan RESTful API uç noktaları:

| Metot | Endpoint | Açıklama |
| :--- | :--- | :--- |
| `POST` | `/ingest` | Verilen URL'i tarar, analiz eder ve veritabanına kaydeder. |
| `POST` | `/search` | Vektör araması yapar. Benzer içerikleri getirir. |
| `POST` | `/autolink` | Verilen metin taslağı için iç link önerileri üretir. |
| `POST` | `/admin/force-refresh` | Zamanlanmış güncellemeyi (Worker) manuel tetikler. |
| `GET` | `/` | Sağlık kontrolü (Health Check). |
| `GET` | `/debug/routes` | Tüm aktif rotaları listeler. |

---

## 🛠️ 6. Kurulum Adımları

Projeyi kendi ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler
*   Python 3.9+
*   Supabase Hesabı (Veritabanı için)
*   OpenAI API Key
*   Serper.dev API Key

### Adım 1: Repoyu İndir
```bash
git clone https://github.com/KULLANICI_ADINIZ/saas-seo-platform.git
cd saas-seo-platform/backend
```

### Adım 2: Sanal Ortamı Kur
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac:
source venv/bin/activate
```

### Adım 3: Kütüphaneleri Yükle
```bash
pip install -r requirements.txt
```

### Adım 4: Ayarları Yap (.env)
`backend` klasörü içinde `.env` dosyası oluşturun:
```env
DATABASE_URL=postgresql://user:pass@host:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
OPENAI_API_KEY=sk-proj-...
SERPER_API_KEY=your-serper-key
```

### Adım 5: Başlat 🚀
Uygulamayı tek komutla başlatabilirsiniz (Windows Git Bash veya Linux):
```bash
./run_app.sh
```

Veya manuel olarak:
```bash
# Terminal 1 (Backend)
python run.py

# Terminal 2 (Frontend)
streamlit run frontend.py
```

