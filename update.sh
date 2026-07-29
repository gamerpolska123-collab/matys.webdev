#!/bin/bash

# Przejdź automatycznie do folderu, w którym znajduje się skrypt
cd "$(dirname "$0")" || exit

# Sprawdź, czy są jakiekolwiek zmiany
if [[ -n $(git status -s) ]]; then
    echo "Wykryto zmiany. Aktualizuję projekt..."
    
    git add .
    git commit -m "Automatyczna aktualizacja: $(date '+%Y-%m-%d %H:%M:%S')"
    git push -u origin main
    
    echo "Gotowe! Zmiany zostały wysłane na GitHub."
    bash scripts/update.sh
else
    echo "Brak nowych zmian do wysłania."
fi
