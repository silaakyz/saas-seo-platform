#!/bin/bash

# Backend'i arka planda başlat (Port 8000)
# Ana dizin 'backend' oldugu icin ve main.py 'app' icinde oldugu icin app.main:app kullaniyoruz.
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Frontend'i başlat (Port 8501)
# Backend URL'ini Docker icinde localhost olarak gorebilir (ayni container)
export API_URL="http://localhost:8000"
streamlit run frontend.py --server.port 8501 --server.address 0.0.0.0
