import streamlit as st
import requests
from supabase import create_client, Client

import os

# FastAPI Backend Adresi
# Docker/Render ortaminda environment variable olarak gelecek
API_URL = os.getenv("API_URL", "http://127.0.0.1:8000")

st.set_page_config(page_title="AI SEO Linker", page_icon="🔗", layout="wide")

# --- SUPABASE AUTHENTICATION ---
# Render Environment Variables'dan okur
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Initialize Client
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except:
    st.warning("Supabase bağlantısı yapılamadı. URL ve KEY değerlerini kontrol edin.")
    supabase = None

if 'user' not in st.session_state:
    st.session_state.user = None

def login_screen():
    col1, col2, col3 = st.columns([1,2,1])
    with col2:
        st.title("🔐 Giriş Yap")
        st.write("SaaS SEO Platformuna hoş geldiniz.")
        
        email = st.text_input("Email")
        password = st.text_input("Şifre", type="password")

        if st.button("Giriş Yap", type="primary"):
            if not supabase:
                 st.error("Supabase konfigürasyonu eksik.")
                 return
                 
            try:
                session = supabase.auth.sign_in_with_password({"email": email, "password": password})
                st.session_state.user = session.user
                st.success("Giriş başarılı!")
                st.rerun()
            except Exception as e:
                st.error(f"Giriş Başarısız: {e}")

# Ana Akış Kontrolü
if not st.session_state.user:
    login_screen()
    # Demo/Development modunda bypass etmek isterseniz bu alttaki satiri acabilirsiniz:
    # st.session_state.user = {"email": "demo@user.com"}
    st.stop()
    
# --- SIDEBAR USER INFO ---
with st.sidebar:
    st.write(f"👤 **{st.session_state.user.email}**")
    if st.button("Çıkış Yap"):
        supabase.auth.sign_out()
        st.session_state.user = None
        st.rerun()
    st.divider()



# Başlık ve Tasarım
st.title("🔗 AI Destekli İç Linkleme & İçerik Yönetimi")
st.markdown("---")

# Menü Sekmeleri
tabs = st.tabs(["🌎 Site Tarama (Ingest)", "✍️ Makale Linkleme", "⚙️ Yönetim & Loglar"])

# --- SEKME 1: YENİ URL EKLEME ---
with tabs[0]:
    st.header("Yeni İçerik Ekle")
    st.info("Sisteme yeni bir blog yazısı veya site URL'si ekleyin. Sistem bunu tarayıp vektör veritabanına işleyecektir.")
    
    url_input = st.text_input("Web Sitesi / Makale URL'si:", placeholder="https://site.com/blog/yeni-yazi")
    
    if st.button("🚀 Evrensel Taramayı Başlat", type="primary"):
        if url_input:
            if not st.session_state.user:
                 st.error("Lütfen önce giriş yapın.")
            else:
                with st.spinner('Evrensel tarama (Sitemap + Analiz) yapılıyor...'):
                    try:
                        # UPDATED: Endpoint matches backend '/ingest'
                        payload = {"url": url_input, "user_id": st.session_state.user.id}
                        
                        # Note: st.session_state.user.id might be UUID or string depending on Supabase version.
                        # Assuming it works directly. If payload needs string, str() it.
                        
                        response = requests.post(f"{API_URL}/ingest", json=payload)
                        if response.status_code == 200:
                            st.success(f"Başarılı! {response.json().get('details')}")
                        else:
                            st.error(f"Hata: {response.text}")
                    except Exception as e:
                        st.error(f"Bağlantı Hatası: {e}")
        else:
            st.warning("Lütfen geçerli bir URL girin.")

# --- SEKME 2: EDİTÖR & LİNKLEME ---
with tabs[1]:
    st.header("Akıllı İçerik Linkleme")
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Ham Metin")
        content_input = st.text_area("Makale taslağını buraya yapıştırın:", height=400)
        analyze_btn = st.button("✨ Linkleri Oluştur")

    with col2:
        st.subheader("Sonuç (Linklenmiş Metin)")
        if analyze_btn and content_input:
            with st.spinner('Yapay zeka veritabanındaki alakalı içerikleri arıyor...'):
                try:
                    # Backend'e istek at
                    # UPDATED: Endpoint matches backend '/autolink', payload key is 'query'
                    payload = {"query": content_input} 
                    res = requests.post(f"{API_URL}/autolink", json=payload)
                    
                    if res.status_code == 200:
                        data = res.json()
                        linked_html = data.get("enriched", "")
                        
                        # HTML Önizleme
                        st.markdown(linked_html, unsafe_allow_html=True)
                        
                        st.divider()
                        # Kodu kopyalamak için alan
                        st.code(linked_html, language="html")
                        
                        st.success("İşlem tamamlandı! Yukarıdaki metinde bulunan anahtar kelimeler otomatik linklendi.")
                    else:
                        st.error("Bir hata oluştu.")
                        st.write(res.text)
                except Exception as e:
                    st.error(f"Sunucuya ulaşılamadı: {e}")
        else:
            st.info("Soldaki alana metin girip butona basınca sonuç burada görünecek.")

# --- SEKME 3: YÖNETİM ---
with tabs[2]:
    st.header("Sistem Yönetimi")
    
    st.write("### 🕒 Zamanlanmış Görevler")
    st.write("Sistem her gece 03:00'te eski içerikleri güncellemek için otomatik çalışır.")
    
    if st.button("⚡ Manuel Güncellemeyi Tetikle (Force Refresh)"):
        try:
            res = requests.post(f"{API_URL}/admin/force-refresh")
            if res.status_code == 200:
                st.toast("Güncelleme botu arka planda çalışmaya başladı!", icon="🤖")
                st.success("Bot tetiklendi. Backend loglarını kontrol edin.")
            else:
                st.error("Bot tetiklenemedi.")
        except:
            st.error("Backend servisine ulaşılamıyor.")

    st.markdown("---")
    st.caption("Developed with FastAPI & Streamlit")
    
    with st.expander("🛠️ Debug Bilgileri"):
        st.write(f"**API URL:** `{API_URL}`")
        st.write(f"**Supabase URL:** `{SUPABASE_URL}`")
        try:
            health = requests.get(f"{API_URL}/")
            st.write(f"**API Durumu:** 🟢 Aktif ({health.json()})")
            
            routes = requests.get(f"{API_URL}/debug/routes")
            st.write(f"**Rota Listesi:** {routes.json()}")
        except Exception as e:
             st.write(f"**API Durumu:** 🔴 Kapalı/Hata ({e})")
