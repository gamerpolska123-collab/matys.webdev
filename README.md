# 🏗️ Construction CMS v1.0.1

Profesjonalny system CMS dla firm budowlanych.  
Zoptymalizowany pod Raspberry Pi + Docker.

---

## 📑 Spis treści

- [🏗️ Construction CMS v1.0.1](#️-construction-cms-v101)
  - [📑 Spis treści](#-spis-treści)
  - [🗂️ Pełny spis plików (Mapa Repozytorium)](#️-pełny-spis-plików-mapa-repozytorium)
    - [📁 Główne pliki konfiguracyjne](#-główne-pliki-konfiguracyjne)
    - [📁 app/ – Kod aplikacji backend](#-app-kod-aplikacji-backend)
    - [📁 app/core/ – Rdzeń systemu](#-appcore-rdzeń-systemu)
    - [📁 app/models/ – Modele bazy danych](#-appmodels-modele-bazy-danych)
    - [📁 app/routers/ – Endpointy API](#-approuters-endpointy-api)
    - [📁 app/templates/ – Szablony HTML](#-apptemplates-szablony-html)
    - [📁 app/templates/admin/ – Panel administracyjny](#-apptemplatesadmin-panel-administracyjny)
    - [📁 app/templates/admin/pages/ – Zarządzanie stronami](#-apptemplatesadminpages-zarządzanie-stronami)
    - [📁 app/templates/auth/ – Autentykacja](#-apptemplatesauth-autentykacja)
    - [📁 modules/ – Moduły rozszerzeń](#-modules-moduły-rozszerzeń)
    - [📁 modules/onepage/ – Strona wizytówka](#-modulesonepage-strona-wizytówka)
    - [📁 modules/blog/ – Blog (placeholder)](#-modulesblog-blog-placeholder)
    - [📁 modules/shop/ – Sklep (placeholder)](#-modulesshop-sklep-placeholder)
    - [📁 alembic/ – Migracje bazy (Alembic)](#-alembic-migracje-bazy-alembic)
    - [📁 migrations/ – Migracje bazy (kopia)](#-migrations-migracje-bazy-kopia)
    - [📁 scripts/ – Skrypty pomocnicze](#-scripts-skrypty-pomocnicze)
    - [📁 docker/ – Pliki Docker (alternatywne)](#-docker-pliki-docker-alternatywne)
    - [📁 data/ – Baza danych SQLite](#-data-baza-danych-sqlite)
    - [📁 backups/ – Kopie zapasowe](#-backups-kopie-zapasowe)
  - [🚀 Szybki start](#-szybki-start)
    - [1. Pierwsze uruchomienie](#1-pierwsze-uruchomienie)
    - [2. Panel administracyjny](#2-panel-administracyjny)
    - [3. Aktualizacja (bez utraty danych!)](#3-aktualizacja-bez-utraty-danych)
  - [🔌 Porty](#-porty)
  - [📦 Moduły](#-moduły)
  - [🔒 Bezpieczeństwo (PRZED produkcją!)](#-bezpieczeństwo-przed-produkcją)
  - [🌐 API](#-api)
  - [💾 Backup ręczny](#-backup-ręczny)
  - [📝 Notatki deweloperskie](#-notatki-deweloperskie)

---

## 🗂️ Pełny spis plików (Mapa Repozytorium)

> Kliknij nazwę pliku, aby przejść bezpośrednio do jego zawartości na GitHub.

### 📁 Główne pliki konfiguracyjne

| Plik | Opis | Link |
|------|------|------|
| `README.md` | Ten plik – dokumentacja projektu | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/README.md) |
| `.env` | Konfiguracja środowiska (persistence) | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/.env) |
| `.env.example` | Szablon konfiguracji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/.env.example) |
| `.dockerignore` | Ignorowane pliki w Dockerze | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/.dockerignore) |
| `Dockerfile` | Obraz Docker aplikacji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/Dockerfile) |
| `docker-compose.yml` | Konfiguracja Docker Compose | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/docker-compose.yml) |
| `nginx.conf` | Konfiguracja serwera Nginx | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/nginx.conf) |
| `requirements.txt` | Zależności Python | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/requirements.txt) |
| `alembic.ini` | Konfiguracja migracji Alembic | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/alembic.ini) |
| `start.sh` | Skrypt startowy aplikacji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/start.sh) |
| `update.sh` | Skrypt aktualizacji (root) | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/update.sh) |

### 📁 app/ – Kod aplikacji backend

> **⚠️ Nadpisywany przy aktualizacji!**

| Plik | Opis | Link |
|------|------|------|
| `app/__init__.py` | Inicjalizacja pakietu app | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/__init__.py) |
| `app/__version__.py` | Wersja aplikacji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/__version__.py) |
| `app/main.py` | Główny plik aplikacji FastAPI | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/main.py) |
| `app/config.py` | Konfiguracja aplikacji (pydantic) | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/config.py) |
| `app/database.py` | Połączenie z bazą SQLite + session | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/database.py) |

### 📁 app/core/ – Rdzeń systemu

| Plik | Opis | Link |
|------|------|------|
| `app/core/__init__.py` | Inicjalizacja pakietu core | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/core/__init__.py) |
| `app/core/security.py` | Haszowanie haseł, tokeny JWT | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/core/security.py) |
| `app/core/module_manager.py` | Menadżer modułów (ładowanie) | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/core/module_manager.py) |

### 📁 app/models/ – Modele bazy danych

| Plik | Opis | Link |
|------|------|------|
| `app/models/__init__.py` | Eksport modeli | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/models/__init__.py) |
| `app/models/base.py` | Baza modeli SQLAlchemy | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/models/base.py) |
| `app/models/user.py` | Model użytkownika | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/models/user.py) |
| `app/models/page.py` | Model strony CMS | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/models/page.py) |
| `app/models/site.py` | Model ustawień strony | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/models/site.py) |
| `app/models/media.py` | Model plików/multimediów | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/models/media.py) |

### 📁 app/routers/ – Endpointy API

| Plik | Opis | Link |
|------|------|------|
| `app/routers/__init__.py` | Inicjalizacja routerów | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/routers/__init__.py) |
| `app/routers/auth.py` | Logowanie, wylogowanie, tokeny | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/routers/auth.py) |
| `app/routers/admin.py` | Panel admina (strony, ustawienia) | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/routers/admin.py) |
| `app/routers/api.py` | Publiczne API (CRUD stron, media) | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/routers/api.py) |

### 📁 app/templates/ – Szablony HTML

| Plik | Opis | Link |
|------|------|------|
| `app/templates/base.html` | Bazowy layout HTML (Jinja2) | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/templates/base.html) |

### 📁 app/templates/admin/ – Panel administracyjny

| Plik | Opis | Link |
|------|------|------|
| `app/templates/admin/dashboard.html` | Dashboard admina | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/templates/admin/dashboard.html) |
| `app/templates/admin/media.html` | Zarządzanie mediami | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/templates/admin/media.html) |
| `app/templates/admin/sections.html` | Zarządzanie sekcjami stron | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/templates/admin/sections.html) |
| `app/templates/admin/settings.html` | Ustawienia strony | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/templates/admin/settings.html) |

### 📁 app/templates/admin/pages/ – Zarządzanie stronami

| Plik | Opis | Link |
|------|------|------|
| `app/templates/admin/pages/list.html` | Lista stron CMS | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/templates/admin/pages/list.html) |
| `app/templates/admin/pages/edit.html` | Edycja strony | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/templates/admin/pages/edit.html) |
| `app/templates/admin/pages/sections.html` | Edycja sekcji strony | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/templates/admin/pages/sections.html) |

### 📁 app/templates/auth/ – Autentykacja

| Plik | Opis | Link |
|------|------|------|
| `app/templates/auth/login.html` | Formularz logowania | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/app/templates/auth/login.html) |

### 📁 modules/ – Moduły rozszerzeń

> **⚠️ Nadpisywane przy aktualizacji!**

| Plik | Opis | Link |
|------|------|------|
| `modules/__init__.py` | Inicjalizacja modułów | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/modules/__init__.py) |

### 📁 modules/onepage/ – Strona wizytówka

| Plik | Opis | Link |
|------|------|------|
| `modules/onepage/__init__.py` | Router + logika modułu OnePage | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/modules/onepage/__init__.py) |
| `modules/onepage/templates/index.html` | Szablon strony wizytówki | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/modules/onepage/templates/index.html) |

### 📁 modules/blog/ – Blog (placeholder)

| Plik | Opis | Link |
|------|------|------|
| `modules/blog/__init__.py` | Placeholder modułu bloga | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/modules/blog/__init__.py) |

### 📁 modules/shop/ – Sklep (placeholder)

| Plik | Opis | Link |
|------|------|------|
| `modules/shop/__init__.py` | Placeholder modułu sklepu | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/modules/shop/__init__.py) |

### 📁 alembic/ – Migracje bazy (Alembic)

| Plik | Opis | Link |
|------|------|------|
| `alembic/README` | Opis migracji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/alembic/README) |
| `alembic/env.py` | Środowisko migracji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/alembic/env.py) |
| `alembic/script.py.mako` | Szablon nowej migracji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/alembic/script.py.mako) |

### 📁 migrations/ – Migracje bazy (kopia)

| Plik | Opis | Link |
|------|------|------|
| `migrations/README` | Opis migracji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/migrations/README) |
| `migrations/env.py` | Środowisko migracji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/migrations/env.py) |
| `migrations/script.py.mako` | Szablon nowej migracji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/migrations/script.py.mako) |
| `migrations/versions/.gitkeep` | Placeholder folderu wersji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/migrations/versions/.gitkeep) |

### 📁 scripts/ – Skrypty pomocnicze

| Plik | Opis | Link |
|------|------|------|
| `scripts/update.sh` | ⭐ Główny skrypt aktualizacji | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/scripts/update.sh) |
| `scripts/backup.sh` | ⭐ Ręczny backup bazy + uploads | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/scripts/backup.sh) |

### 📁 docker/ – Pliki Docker (alternatywne)

| Plik | Opis | Link |
|------|------|------|
| `docker/Dockerfile` | Alternatywny Dockerfile | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/docker/Dockerfile) |
| `docker/docker-compose.yml` | Alternatywny docker-compose | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/docker/docker-compose.yml) |
| `docker/nginx.conf` | Alternatywna konfiguracja Nginx | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/docker/nginx.conf) |

### 📁 data/ – Baza danych SQLite

> **🔒 PERSISTENT – NIE nadpisuj przy aktualizacji!**

| Plik | Opis | Link |
|------|------|------|
| `data/cms.db` | Główna baza SQLite | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/data/cms.db) |

### 📁 backups/ – Kopie zapasowe

| Plik | Opis | Link |
|------|------|------|
| `backups/cms.db.20260729_153355.bak` | Przykładowy backup bazy | [Otwórz](https://github.com/gamerpolska123-collab/matys.webdev/blob/main/backups/cms.db.20260729_153355.bak) |

---

## 🚀 Szybki start

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

---

## 🔌 Porty

| Usługa | Port wewnętrzny | Port zewnętrzny |
|--------|-----------------|-----------------|
| App    | 8000            | tylko Docker    |
| Nginx  | 80              | 85 (konfiguracja w `.env`) |

---

## 📦 Moduły

| Moduł   | Status         | Opis              |
|---------|----------------|-------------------|
| OnePage | ✅ Gotowe      | Strona wizytówka  |
| Blog    | ⏳ Placeholder | W przygotowaniu  |
| Sklep   | ⏳ Placeholder | W przygotowaniu  |

---

## 🔒 Bezpieczeństwo (PRZED produkcją!)

Zmień w `.env`:

```bash
SECRET_KEY=twoj-losowy-klucz-min-50-znakow
ADMIN_PASSWORD=silne-haslo-min-12-znakow
```

---

## 🌐 API

| Endpoint           | Metoda | Opis                  |
|--------------------|--------|-----------------------|
| `/health`          | GET    | Status serwera        |
| `/api/version`     | GET    | Wersja aplikacji      |
| `/docs`            | GET    | Swagger UI (dokumentacja) |

---

## 💾 Backup ręczny

```bash
./scripts/backup.sh
```

Tworzy kopie w `backups/`:
- `cms.db.YYYYMMDD_HHMMSS.bak`
- `uploads.YYYYMMDD_HHMMSS.tar.gz`

---

## 📝 Notatki deweloperskie

> Ten plik README jest twoją **mapą nawigacyjną** repozytorium.  
> Każdy plik ma bezpośredni link do GitHub – kliknij i edytuj bez szukania.

**Wskazówki dla przyszłego siebie:**
- Chcesz zmienić wygląd strony? → `modules/onepage/templates/index.html`
- Chcesz dodać endpoint API? → `app/routers/api.py`
- Chcesz zmienić model bazy? → `app/models/` + `alembic/env.py`
- Chcesz zmienić panel admina? → `app/templates/admin/`
- Chcesz zmienić haszowanie/tokeny? → `app/core/security.py`
- Chcesz dodać nowy moduł? → Utwórz folder w `modules/` i zarejestruj w `app/core/module_manager.py`
- Chcesz zmienić porty? → `.env` + `docker-compose.yml`
- Chcesz zrobić backup? → `./scripts/backup.sh`
- Chcesz zaktualizować? → `./scripts/update.sh`

---

*Ostatnia aktualizacja mapy: 2026-07-29*
