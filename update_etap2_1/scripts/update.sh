#!/bin/bash
# BuildCMS v1.1 – Etap 2.1: Nowy szkielet buildera (interaktywny iframe)
set -e

echo "[UPDATE] BuildCMS v1.1 Etap 2.1 – Professional Builder Skeleton"
if [ ! -f "docker-compose.yml" ]; then
    echo "[ERROR] Uruchom z root repozytorium"
    exit 1
fi

BACKUP_DIR="backups/app_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r app "$BACKUP_DIR/" 2>/dev/null || true
cp -r modules "$BACKUP_DIR/" 2>/dev/null || true
echo "[UPDATE] Backup w $BACKUP_DIR"

rsync -av --exclude='__pycache__' update_etap2_1/app/ app/
rsync -av --exclude='__pycache__' update_etap2_1/modules/ modules/
rsync -av update_etap2_1/scripts/ scripts/

echo "[UPDATE] Pliki zaktualizowane. Restart..."
docker compose restart

echo "[UPDATE] Gotowe. Sprawdź /admin/builder"
