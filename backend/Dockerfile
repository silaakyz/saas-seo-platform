# 1. Python 3.10'un hafif sürümünü kullan
FROM python:3.10-slim

# 2. Çalışma klasörünü ayarla
WORKDIR /app

# 3. Sistem bağımlılıklarını yükle (Postgres ve derleyiciler için)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 4. Kütüphaneleri kopyala ve yükle
COPY requirements.txt .

# Çözüm: Pip güncelle ve requests'i elle yükle (Blink vb. hataları önlemek için)
RUN pip install --upgrade pip setuptools wheel
RUN pip install requests

RUN pip install --no-cache-dir -r requirements.txt

# 5. Tüm proje kodlarını kopyala
COPY . .

# 6. Başlatma Script'ini hazırla
COPY run_app.sh .
RUN chmod +x run_app.sh

# 7. Konteyner çalıştığında bu komutu uygula
CMD ["./run_app.sh"]
