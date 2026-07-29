#!/bin/bash
# ============================================================
# BuildCMS Installer v2.1b – Inline Preview Builder
# ============================================================
# Użycie:
#   1. Wypakuj ZIP do głównego katalogu repozytorium
#   2. cd update
#   3. bash insta_v2.1b.sh
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION="2.1b"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  BuildCMS Installer v${VERSION}                           ║"
echo "║  Inline Preview Builder – no iframe                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Sprawdź czy jesteśmy w root repozytorium
cd "$SCRIPT_DIR/.."
if [ ! -f "docker-compose.yml" ]; then
    echo "[BŁĄD] Nie znaleziono docker-compose.yml"
    echo "       Uruchom ten skrypt z katalogu repozytorium (gdzie jest docker-compose.yml)"
    echo "       cd /sciezka/do/repo && bash update/insta_v${VERSION}.sh"
    exit 1
fi

echo "[1/4] Tworzenie kopii zapasowej..."
BACKUP_DIR="backups/update_${VERSION}_${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"

# Backup tylko plików które nadpiszemy
if [ -d "app/static/js/admin/builder" ]; then
    cp -r app/static/js/admin/builder "$BACKUP_DIR/js_builder_" 2>/dev/null || true
fi
if [ -d "app/static/css/admin" ]; then
    cp -r app/static/css/admin "$BACKUP_DIR/css_admin_" 2>/dev/null || true
fi
if [ -d "app/templates/admin/builder" ]; then
    cp -r app/templates/admin/builder "$BACKUP_DIR/templates_builder_" 2>/dev/null || true
fi
if [ -d "modules/onepage/templates" ]; then
    cp -r modules/onepage/templates "$BACKUP_DIR/modules_onepage_" 2>/dev/null || true
fi

echo "       Backup zapisany w: $BACKUP_DIR"

echo ""
echo "[2/4] Kopiowanie nowych plików..."

# JS builder modules
if [ -d "update/app/static/js/admin/builder" ]; then
    mkdir -p app/static/js/admin/builder
    cp -r update/app/static/js/admin/builder/* app/static/js/admin/builder/
    echo "       ✓ app/static/js/admin/builder/"
fi

# CSS
if [ -d "update/app/static/css/admin" ]; then
    mkdir -p app/static/css/admin
    cp -r update/app/static/css/admin/* app/static/css/admin/
    echo "       ✓ app/static/css/admin/"
fi

# Templates
if [ -d "update/app/templates/admin/builder" ]; then
    mkdir -p app/templates/admin/builder
    cp -r update/app/templates/admin/builder/* app/templates/admin/builder/
    echo "       ✓ app/templates/admin/builder/"
fi

# Modules onepage
if [ -d "update/modules/onepage/templates" ]; then
    mkdir -p modules/onepage/templates
    cp -r update/modules/onepage/templates/* modules/onepage/templates/
    echo "       ✓ modules/onepage/templates/"
fi

echo ""
echo "[3/4] Czyszczenie cache..."
find app -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find modules -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true

echo ""
echo "[4/4] Restart kontenerów Docker..."
docker compose restart

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  ✅ Instalacja v${VERSION} zakończona!                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Sprawdź:"
echo "  • Panel admina:  http://twoj-serwer:85/admin"
echo "  • Builder:       http://twoj-serwer:85/admin/builder"
echo "  • Strona:        http://twoj-serwer:85/"
echo ""
echo "Pliki do ręcznego wgrania na GitHub:"
echo "  app/static/js/admin/builder/"
echo "  app/static/css/admin/builder.css"
echo "  app/templates/admin/builder/index.html"
echo "  modules/onepage/templates/index.html"
echo ""
