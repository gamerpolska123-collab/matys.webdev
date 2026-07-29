# Construction CMS v1.0.1

Profesjonalny system CMS dla firm budowlanych.
Zoptymalizowany pod Raspberry Pi + Docker.

## Struktura projektu (podział na kod i dane)

```
construction-cms/
├── app/                    ← KOD APLIKACJI (nadpisywany przy aktualizacji)
│   ├── main.py
│   ├── routers/
│   ├── models/
│   ├── templates/
│   └── static/
├── modules/                ← MODUŁY (nadpisywane przy aktualizacji)
│   ├── onepage/
│   ├── blog/
│   └── shop/
├── migrations/             ← MIGRACJE BAZY (nadpisywane)
├── scripts/                ← SKRYPTY POMOCNICZE
│   ├── update.sh           ← GŁÓWNY SKRYPT AKTUALIZACJI
│   └── backup.sh           ← Ręczny backup
├── data/                   ← BAZA SQLITE (PERSISTENT - NIE nadpisuj!)
├── uploads/                ← PLIKI UŻYTKOWNIKA (PERSISTENT - NIE nadpisuj!)
├── backups/                ← Automatyczne kopie zapasowe
├── .env                    ← KONFIGURACJA (PERSISTENT)
├── docker-compose.yml      ← Docker Compose
├── Dockerfile
├── nginx.conf
└── requirements.txt
```

## Szybki start

### 1. Pierwsze uruchomienie

```bash
# Skopiuj szablon konfiguracji
cp .env.example .env

# Edytuj .env (zmień SECRET_KEY i hasło admina!)
nano .env

# Uruchom
docker compose up --build -d

# Sprawdź
curl http://localhost:85/health
curl http://localhost:85/api/version
```

### 2. Panel administracyjny

- **URL:** `http://twoj-serwer:85/admin`
- **Login:** `admin@firma.pl`
- **Hasło:** (z pliku `.env`, domyślnie `admin123`)

### 3. Aktualizacja (bez utraty danych!)

```bash
# Sposób 1: Skrypt automatyczny (zalecany)
./scripts/update.sh

# Sposób 2: Ręcznie
docker compose down
# Podmień pliki w app/ i modules/
docker compose up --build -d
```

**Co jest bezpieczne (nie ginie przy aktualizacji):**
- `data/cms.db` – baza danych
- `uploads/` – wgrane pliki
- `.env` – konfiguracja
- `backups/` – kopie zapasowe

**Co się aktualizuje:**
- `app/` – kod backendu
- `modules/` – moduły
- `requirements.txt` – zależności
- `Dockerfile` – obraz

## Porty

| Usługa | Port wewnętrzny | Port zewnętrzny |
|--------|-----------------|-----------------|
| App    | 8000            | tylko Docker    |
| Nginx  | 80              | 85 (konfiguracja w `.env`) |

## Moduły

| Moduł  | Status      | Opis                  |
|--------|-------------|----------------------|
| OnePage| ✅ Gotowe   | Strona wizytówka      |
| Blog   | ⏳ Placeholder | W przygotowaniu    |
| Sklep  | ⏳ Placeholder | W przygotowaniu    |

## Bezpieczeństwo (PRZED produkcją!)

Zmień w `.env`:
```bash
SECRET_KEY=twoj-losowy-klucz-min-50-znakow
ADMIN_PASSWORD=silne-haslo-min-12-znakow
```

## API

- **Health:** `GET /health`
- **Wersja:** `GET /api/version`
- **Docs:** `http://twoj-serwer:85/docs`

## Backup ręczny

```bash
./scripts/backup.sh
```

Tworzy kopie w `backups/`:
- `cms.db.YYYYMMDD_HHMMSS.bak`
- `uploads.YYYYMMDD_HHMMSS.tar.gz`
