#!/bin/bash
# Skrypt aktualizacji BuildCMS v1.1 – Etap 1
# Użycie: bash scripts/update.sh

set -e

echo "[UPDATE] BuildCMS v1.1 Etap 1 – Szkielet Reusable"
echo "[UPDATE] Nadpisuję app/templates, app/static, app/routers..."

# Zakładamy że skrypt jest uruchamiany z root repo
if [ ! -f "docker-compose.yml" ]; then
    echo "[ERROR] Uruchom z root repozytorium (gdzie jest docker-compose.yml)"
    exit 1
fi

# Kopia zapasowa starego app/
BACKUP_DIR="backups/app_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r app "$BACKUP_DIR/" 2>/dev/null || true
echo "[UPDATE] Stary app/ skopiowany do $BACKUP_DIR"

# Nadpisanie plików
rsync -av --exclude='__pycache__' update_etap1/app/ app/
rsync -av update_etap1/scripts/ scripts/

echo "[UPDATE] Pliki zaktualizowane."
echo "[UPDATE] Restartuję kontenery..."
docker compose restart

echo "[UPDATE] Gotowe. Sprawdź http://twoj-serwer:85/admin/builder"
