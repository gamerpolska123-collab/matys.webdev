#!/bin/bash
# ============================================================
# Construction CMS - Skrypt aktualizacji
# Użycie: ./scripts/update.sh [wersja]
# ============================================================

set -e

CMS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$CMS_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
VERSION="${1:-latest}"

echo "=========================================="
echo "  Construction CMS - Aktualizacja"
echo "  Wersja docelowa: $VERSION"
echo "=========================================="
echo ""

# 1. Backup bazy danych
echo "[1/6] Tworzenie backupu bazy danych..."
mkdir -p "$BACKUP_DIR"
if [ -f "$CMS_DIR/data/cms.db" ]; then
    cp "$CMS_DIR/data/cms.db" "$BACKUP_DIR/cms.db.$TIMESTAMP.bak"
    echo "      ✓ Backup zapisany: backups/cms.db.$TIMESTAMP.bak"
else
    echo "      ℹ Brak bazy do backupu (pierwsze uruchomienie?)"
fi

# 2. Backup uploads
echo "[2/6] Tworzenie backupu plików..."
if [ -d "$CMS_DIR/uploads" ] && [ "$(ls -A $CMS_DIR/uploads)" ]; then
    tar -czf "$BACKUP_DIR/uploads.$TIMESTAMP.tar.gz" -C "$CMS_DIR" uploads/
    echo "      ✓ Backup uploads: backups/uploads.$TIMESTAMP.tar.gz"
else
    echo "      ℹ Brak plików do backupu"
fi

# 3. Zatrzymanie kontenerów
echo "[3/6] Zatrzymywanie kontenerów..."
cd "$CMS_DIR"
docker compose down

# 4. Aktualizacja kodu (przykład dla git)
echo "[4/6] Aktualizacja kodu..."
if [ -d ".git" ]; then
    git fetch origin
    git checkout "$VERSION" || git pull origin main
    echo "      ✓ Kod zaktualizowany przez git"
else
    echo "      ℹ Brak repozytorium git. Ręcznie podmień pliki app/ i modules/"
    echo "      ℹ Twoje dane w data/ i uploads/ oraz .env są BEZPIECZNE"
fi

# 5. Przebudowa obrazu (tylko jeśli requirements się zmieniły)
echo "[5/6] Przebudowa obrazu Docker..."
docker compose build --no-cache

# 6. Uruchomienie
echo "[6/6] Uruchamianie..."
docker compose up -d

echo ""
echo "=========================================="
echo "  ✓ Aktualizacja zakończona!"
echo "=========================================="
echo ""
echo "Sprawdź status:"
echo "  docker compose ps"
echo "  docker logs -f matys-cms-app"
echo ""
echo "Wersja API:"
echo "  curl http://localhost:85/api/version"
echo ""
