@echo off
echo AutoSEO Sistemi Baslatiliyor...

echo 1. Backend (Motor) Baslatiliyor (Port 3000)...
start "AutoSEO Backend - Core" cmd /k "cd core & npm run start"

echo 2. Panel (Frontend) Baslatiliyor (Port 3001)...
start "AutoSEO Dashboard - Panel" cmd /k "cd panel & npm run start -- -p 3001"

echo.
echo ===================================================
echo Sistem baslatildi!
echo Panel: http://localhost:3001
echo API: http://localhost:3000
echo ===================================================
echo Lutfen acilan diger pencereleri kapatmayin.
pause
