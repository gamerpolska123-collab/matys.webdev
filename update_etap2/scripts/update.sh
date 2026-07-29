#!/bin/bash
# BuildCMS v1.1 – Etap 2: Page Builder Core
set -e

echo "[UPDATE] BuildCMS v1.1 Etap 2 – Page Builder Core"
if [ ! -f "docker-compose.yml" ]; then
    echo "[ERROR] Uruchom z root repozytorium"
    exit 1
fi

BACKUP_DIR="backups/app_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r app "$BACKUP_DIR/" 2>/dev/null || true
cp -r modules "$BACKUP_DIR/" 2>/dev/null || true
echo "[UPDATE] Backup w $BACKUP_DIR"

rsync -av --exclude='__pycache__' update_etap2/app/ app/
rsync -av --exclude='__pycache__' update_etap2/modules/ modules/
rsync -av update_etap2/scripts/ scripts/

echo "[UPDATE] Pliki zaktualizowane. Restart..."
docker compose restart

echo "[UPDATE] Gotowe. Sprawdź:"
echo "  - /admin/builder (drag & drop, edycja sekcji)"
echo "  - / (strona główna z sekcjami)"
