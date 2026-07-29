#!/bin/bash

# Sprawdź, czy są jakiekolwiek zmiany w folderze
if [[ -n $(git status -s) ]]; then
    echo "Wykryto zmiany. Aktualizuję projekt..."
    
    # Dodaj wszystkie zmienione pliki
    git add .
    
    # Utwórz commit z aktualną datą i godziną
    git commit -m "Automatyczna aktualizacja: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Wyślij zmiany na GitHub
    git push
    
    echo "Gotowe! Zmiany zostały wysłane na GitHub."
else
    echo "Brak nowych zmian do wysłania."
fi
