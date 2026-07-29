#!/bin/bash
# ============================================================
# BuildCMS Installer v2.1b-fix – Inline Preview Builder FIX
# Poprawione ładowanie sekcji, obsługa błędów, empty state
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION="2.1b-fix"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  BuildCMS Installer v${VERSION}                         ║"
echo "║  FIX: ładowanie sekcji, empty state, debugowanie          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$SCRIPT_DIR/.."
if [ ! -f "docker-compose.yml" ]; then
    echo "[BŁĄD] Nie znaleziono docker-compose.yml"
    echo "       cd /sciezka/do/repo && bash update/insta_v${VERSION}.sh"
    exit 1
fi

echo "[1/3] Backup..."
BACKUP_DIR="backups/update_${VERSION}_${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"
cp -r app/static/js/admin/builder "$BACKUP_DIR/js_builder_" 2>/dev/null || true
cp -r app/static/css/admin "$BACKUP_DIR/css_admin_" 2>/dev/null || true
cp -r app/templates/admin/builder "$BACKUP_DIR/templates_builder_" 2>/dev/null || true
echo "       Backup: $BACKUP_DIR"

echo ""
echo "[2/3] Kopiowanie plików..."
mkdir -p app/static/js/admin/builder
mkdir -p app/static/css/admin
mkdir -p app/templates/admin/builder
cp -r update/app/static/js/admin/builder/* app/static/js/admin/builder/
cp update/app/static/css/admin/* app/static/css/admin/ 2>/dev/null || true
cp update/app/templates/admin/builder/* app/templates/admin/builder/ 2>/dev/null || true
echo "       ✓ builder-core.js (poprawiony)"
echo "       ✓ inline-preview.js (poprawiony)"
echo "       ✓ builder/index.html"

echo ""
echo "[3/3] Restart..."
find app -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
docker compose restart

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ v${VERSION} zainstalowane!                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Sprawdź w przeglądarce (F12 → Console):"
echo "  [Builder] Inicjalizacja..."
echo "  [Builder] Pobieranie sekcji z API..."
echo "  [Builder] Wyrenderowano X sekcji"
echo ""
echo "Jeśli nadal widzisz 'Ładowanie sekcji...' – sprawdź czy:"
echo "  1. Jesteś zalogowany w panelu admina"
echo "  2. Endpoint /api/homepage/sections działa (sprawdź w Network)"
echo ""
