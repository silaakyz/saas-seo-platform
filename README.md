# 🚀 AI SEO SaaS Platform (v1.2)

Yapay zeka destekli, otonom ve modern bir SEO yönetim platformu. İçeriklerinizi analiz eder, anlamsal olarak linkler, rakipleri takip eder ve modası geçmiş içerikleri otomatik yeniler.

![Python](https://img.shields.io/badge/Python-3.11-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Build-green) ![Streamlit](https://img.shields.io/badge/Streamlit-Tips-red) ![Supabase](https://img.shields.io/badge/Supabase-Orchestrator-orange) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT4-purple)

---

## 🌟 Öne Çıkan Özellikler

### 1. 🧠 Akıllı İçerik Analizi (Ingestion Engine)
*   **Evrensel Tarayıcı:** `trafilatura` ile herhangi bir URL'i veya Sitemap'i tarar.
*   **AI Metadata:** GPT-4o-mini kullanarak içeriğin türünü ("Blog" vs "Ürün"), yayın tarihini ve **hedef anahtar kelimesini** otomatik çıkarır.
*   **Vektör Veritabanı:** İçeriği 1536 boyutlu vektörlere dönüştürüp `pgvector` üzerinde saklar.
*   **Knowledge Graph (Varlık Çıkarma):** Metindeki önemli kişileri, markaları ve kavramları (Entity) tespit edip veritabanına işler.

### 2. ⚡ Otonom İçerik Yenileme (Auto-Refresh Loop)
Sistem, "Yaz ve Unut" mantığıyla çalışmaz. Eski içerikleri sürekli canlı tutar:
*   **Zamanlayıcı:** 6 aydan eski makaleleri otomatik tespit eder.
*   **Yapı Koruyan "Mega Prompt":** Sitenizin **React, WordPress veya HTML** olduğunu anlar ve DOM yapısını (class, id, div) bozmadan sadece metni günceller.
*   **SERP Entegrasyonu (Rakip Zekası):** Güncelleme yapmadan önce Google'daki (`Serper.dev`) ilk 5 rakibi analiz eder. Rakiplerin bahsettiği ama sizin eksik olduğunuz konuları içeriğe ekler.

### 3. 🕸️ Knowledge Graph (Konu Haritası)
Web sitenizdeki binlerce içerik arasındaki gizli bağlantıları görün.
*   Makaleler ve içindeki Varlıklar (Entity) arasındaki ilişkileri görselleştirir.
*   Streamlit üzerinde interaktif, fizik kurallı (physics-based) grafik sunar.

### 4. 🔗 Anlamsal İç Linkleme (Smart Linker)
Sadece kelime eşleşmesi değil, anlam eşleşmesi yapar.
*   "Yapay Zeka" hakkındaki bir yazıya, içinde "Makine Öğrenimi" geçen diğer yazınızı otomatik önerir (Cosine Similarity).

---

## 🏗️ Mimari ve Teknolojiler

Bu proje **Microservice-ready** monolitik bir yapıda tasarlanmıştır.

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Backend** | Python (FastAPI) | API servisi ve asenkron işçiler (Workers). |
| **Frontend** | Streamlit | Kullanıcı arayüzü ve yönetim paneli. |
| **Database** | Supabase (PostgreSQL) | Veri ve Vektör saklama (`pgvector` eklentisi ile). |
| **AI Engine** | OpenAI | GPT-4o-mini (Analiz/Rewrite) & text-embedding-3-small. |
| **Search** | Serper.dev | Google arama sonuçları ve rakip analizi. |
| **Deployment** | Docker & Render | Konteynerize edilmiş, tek tıkla deploy yapısı. |

---

## 🛠️ Kurulum (Local Development)

Projeyi yerel makinenizde çalıştırmak için:

1.  **Repoyu Klonlayın:**
    ```bash
    git clone https://github.com/KULLANICI_ADINIZ/saas-seo-platform.git
    cd saas-seo-platform/backend
    ```

2.  **Sanal Ortam Kurun:**
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    ```

3.  **Bağımlılıkları Yükleyin:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Çevresel Değişkenleri (.env) Ayarlayın:**
    `backend/.env` dosyası oluşturun ve şunu ekleyin:
    ```env
    DATABASE_URL=postgresql://user:pass@supabase_host:5432/postgres
    SUPABASE_URL=https://xyz.supabase.co
    SUPABASE_KEY=anon_key_...
    OPENAI_API_KEY=sk-...
    SERPER_API_KEY=sk-... (Serper.dev'den alınan key)
    ```

5.  **Uygulamayı Başlatın:**
    *   **Backend & Frontend (Tek Komut):** `./run_app.sh` (Git Bash veya Linux)
    *   **Veya Ayrı Ayrı:**
        ```bash
        # Terminal 1
        python run.py
        # Terminal 2
        streamlit run frontend.py
        ```

---

## ☁️ Deployment (Canlıya Alma)

Bu proje **Render.com** uyumludur.

1.  GitHub reponuzu Render'a bağlayın.
2.  **Service Type:** Web Service
3.  **Root Directory:** `backend`
4.  **Build Command:** (Docker seçilirse otomatik algılar)
5.  **Environment Variables** kısmına `.env` içindeki değerleri ekleyin.

---

## 🔮 Gelecek Planları (Roadmap)

*   [ ] **CMS Entegrasyonu:** WordPress/Shopify API ile güncellemeleri direkt siteye basma.
*   [ ] **Multi-Agent:** Araştırmacı, Yazar ve Editör ajanlarının ayrılması.
*   [ ] **Detaylı Raporlama:** PDF formatında aylık SEO gelişim raporu.

---
*Geliştirici: Antigravity Agent* 🤖
