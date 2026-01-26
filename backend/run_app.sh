#!/bin/bash

# Backend'i arka planda başlat (Port 8000)
# Ana dizin 'backend' oldugu icin ve main.py 'app' icinde oldugu icin app.main:app kullaniyoruz.
# Backend (Internal): Port 8000
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Frontend (Public): Use Render's PORT variable (default to 8501 if missing)
# This ensures Render routes external traffic to Streamlit, not FastAPI.
export API_URL="http://localhost:8000"
streamlit run frontend.py --server.port ${PORT:-8501} --server.address 0.0.0.0
