@echo off
echo Test Crawl Istegi Gonderiliyor...
echo Hedef: https://example.com/sitemap.xml (Ornek)

curl -X POST http://localhost:3000/crawler/start ^
  -H "Content-Type: application/json" ^
  -d "{\"url\": \"https://www.w3.org/WAI/sitemap.xml\", \"siteId\": \"test-site-1\"}"

echo.
echo.
echo ===================================================
echo Istek gonderildi!
echo Backend terminalinde (Core penceresi) loglari kontrol edin.
echo "Processing..." ve "Keyword extracted" loglarini gormelisiniz.
echo ===================================================
pause
