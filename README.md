# AI SEO SaaS Platform 🚀

Yapay zeka destekli, evrensel içerik tarama ve otomatik linkleme platformu.

## 🌟 Özellikler

*   **Evrensel Tarama:** Herhangi bir web sitesini ve sitemap'ini tarar.
*   **AI Analizi:** İçeriğin blog yazısı olup olmadığını ve konusunu anlar.
*   **Vektör Veritabanı:** Supabase (pgvector) üzerinde anlamsal arama yapar.
*   **Otomatik Linkleme:** Yeni yazılan yazılara, eski içeriklerden en alakalı linkleri önerir.
*   **Modern Arayüz:** Streamlit tabanlı kullanıcı dostu panel.

## 🛠️ Kurulum

1.  Repoyu klonlayın.
2.  `backend` klasörüne girin.
3.  `pip install -r requirements.txt` ile kütüphaneleri yükleyin.
4.  `.env` dosyasını oluşturun (Supabase ve OpenAI anahtarları ile).
5.  `python run.py` ile backend'i, `streamlit run frontend.py` ile arayüzü başlatın.

## ☁️ Deployment (Render)

Bu proje Docker ile konteynerize edilmiştir. Render üzerinde "Web Service" olarak kolayca yayınlanabilir.
- **Root Directory:** `backend`
- **Build Command:** (Docker otomatik)
