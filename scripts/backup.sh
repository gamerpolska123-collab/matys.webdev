#!/bin/bash
# Backup ręczny bazy i plików
CMS_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$CMS_DIR/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

echo "[BACKUP] Tworzenie kopii zapasowej..."

if [ -f "$CMS_DIR/data/cms.db" ]; then
    cp "$CMS_DIR/data/cms.db" "$BACKUP_DIR/cms.db.$TIMESTAMP.bak"
    echo "  ✓ Baza: backups/cms.db.$TIMESTAMP.bak"
fi

if [ -d "$CMS_DIR/uploads" ]; then
    tar -czf "$BACKUP_DIR/uploads.$TIMESTAMP.tar.gz" -C "$CMS_DIR" uploads/
    echo "  ✓ Uploads: backups/uploads.$TIMESTAMP.tar.gz"
fi

echo "  ✓ Backup zakończony"
