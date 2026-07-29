#!/bin/bash
# ============================================================
# BuildCMS Installer v2.1b-fix2
# Czysta instalacja z cache bustingiem
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION="2.1b-fix2"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  BuildCMS Installer v${VERSION}                         ║"
echo "║  Czysta instalacja + cache busting                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$SCRIPT_DIR/.."
if [ ! -f "docker-compose.yml" ]; then
    echo "[BŁĄD] Nie znaleziono docker-compose.yml"
    exit 1
fi

echo "[1/3] Backup..."
BACKUP_DIR="backups/update_${VERSION}_${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"
cp -r app/static/js/admin "$BACKUP_DIR/js_admin_" 2>/dev/null || true
cp -r app/static/css/admin "$BACKUP_DIR/css_admin_" 2>/dev/null || true
cp -r app/templates/admin "$BACKUP_DIR/templates_admin_" 2>/dev/null || true
cp -r modules/onepage/templates "$BACKUP_DIR/modules_onepage_" 2>/dev/null || true
echo "       Backup: $BACKUP_DIR"

echo ""
echo "[2/3] Kopiowanie plików..."
mkdir -p app/static/js/admin/builder
mkdir -p app/static/css/admin
mkdir -p app/templates/admin/builder
mkdir -p modules/onepage/templates

cp update/app/static/js/admin/*.js app/static/js/admin/ 2>/dev/null || true
cp update/app/static/js/admin/builder/*.js app/static/js/admin/builder/ 2>/dev/null || true
cp update/app/static/css/admin/*.css app/static/css/admin/ 2>/dev/null || true
cp update/app/templates/admin/builder/*.html app/templates/admin/builder/ 2>/dev/null || true
cp update/modules/onepage/templates/*.html modules/onepage/templates/ 2>/dev/null || true

echo "       ✓ Wszystkie pliki skopiowane"

echo ""
echo "[3/3] Czyszczenie cache i restart..."
find app -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find modules -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
docker compose restart

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ v${VERSION} zainstalowane!                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "WAŻNE: Wyczyść cache przeglądarki (Ctrl+Shift+R)"
echo "       lub otwórz w trybie incognito (Ctrl+Shift+N)"
echo ""
echo "Sprawdź: http://twoj-serwer:85/admin/builder"
echo ""
