#!/bin/bash
# Skrypt startowy dla Raspberry Pi / Linux

echo "=== Construction CMS - Start ==="
echo ""

# Sprawdź czy Docker działa
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker nie jest uruchomiony!"
    echo "   Uruchom: sudo systemctl start docker"
    exit 1
fi

echo "🐳 Docker OK"
echo "🧹 Czyszczenie starych kontenerów..."

cd "$(dirname "$0")/docker"

docker-compose down 2>/dev/null
docker-compose rm -f 2>/dev/null

echo "🏗️  Budowanie i uruchamianie..."
docker-compose up --build -d

echo ""
echo "⏳ Oczekiwanie na uruchomienie..."
sleep 5

echo ""
echo "=== Status ==="
docker-compose ps

echo ""
echo "=== Logi aplikacji (ostatnie 20 linii) ==="
docker logs --tail 20 construction-cms-app

echo ""
echo "🌐 Sprawdź w przeglądarce:"
echo "   http://$(hostname -I | awk '{print $1}'):85"
echo ""
echo "📋 Logi na żywo:"
echo "   docker logs -f construction-cms-app"
