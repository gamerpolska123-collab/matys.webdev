# Construction CMS

test Profesjonalny system CMS dla firm budowlanych.
Zoptymalizowany pod Raspberry Pi + Docker.

## Szybki start

```bash
cd docker
docker-compose up --build
```

Aplikacja działa na porcie **85** (aby nie kolidować z istniejącym serwerem HTTP/HTTPS na portach 80/443).

- Panel admina: http://twoj-serwer:85/admin
- Strona: http://twoj-serwer:85/
- API docs: http://twoj-serwer:85/docs
- Domyślne dane logowania: `admin@firma.pl` / `admin123`

## Stack technologiczny

- **Backend**: FastAPI + SQLAlchemy 2.0
- **Baza**: SQLite (plik `data/cms.db`)
- **Frontend admin**: Jinja2 + HTMX + Tailwind CSS
- **Auth**: JWT + bcrypt
- **Docker**: Alpine Linux (ARM-ready)
- **Proxy**: Nginx (port zewnętrzny 85, wewnętrzny 80)

## Architektura modułów

Moduły w katalogu `modules/`:
- `onepage` – strona wizytówka (gotowe)
- `blog` – placeholder
- `shop` – placeholder

Każdy moduł eksportuje `router` i opcjonalnie `admin_menu`.

## Wdrożenie na serwerze z istniejącym HTTP

Skoro masz już serwer na portach 80/443, nasz stack używa portu **85**:

```bash
# Przenieś pliki na serwer
scp construction-cms.zip user@serwer:/home/user/

# Rozpakuj i uruchom
unzip construction-cms.zip
cd construction-cms/docker
docker-compose up -d

# Sprawdź czy działa
curl http://localhost:85/health
```

Jeśli chcesz dodać domenę (np. `cms.twojadomena.pl`) do istniejącego serwera Apache/Nginx na porcie 80/443, skonfiguruj reverse proxy:

### Przykład dla Apache:
```apache
<VirtualHost *:80>
    ServerName cms.twojadomena.pl
    ProxyPreserveHost On
    ProxyPass / http://localhost:85/
    ProxyPassReverse / http://localhost:85/
</VirtualHost>
```

### Przykład dla Nginx (główny):
```nginx
server {
    listen 80;
    server_name cms.twojadomena.pl;
    location / {
        proxy_pass http://localhost:85;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Zmiana hasła / SECRET_KEY

Przed produkcją edytuj plik `.env` w głównym katalogu:
```bash
nano .env
```

Zmień przynajmniej:
- `SECRET_KEY` – losowy ciąg min. 32 znaki
- `ADMIN_PASSWORD` – silne hasło

Następnie zrestartuj:
```bash
cd docker
docker-compose down
docker-compose up -d
```
