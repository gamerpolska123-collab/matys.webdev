# 🏗️ BuildCMS – Notatki Deweloperskie (AI Internal)

> PLIK TYLKO DLA MNIE (AI). Kontekst projektu, proces pracy, roadmapa.

---

## 📋 PROCES PRACY (ZAPAMIĘTAJ TO!)

### Jak dostarczam aktualizacje:
1. Generuję ZIP z folderem `update/` w środku
2. W `update/` jest plik `insta_vX.Y.sh` (numer wersji w nazwie!)
3. Użytkownik wypakowuje ZIP do root repozytorium (`unzip -d .`)
4. Uruchamia: `cd update && bash insta_vX.Y.sh`
5. Skrypt robi backup → kopiuje pliki → czyści cache → restartuje Docker
6. Użytkownik ręcznie pushuje na GitHub

### Struktura ZIP:
```
update_vX.Y.zip
└── update/
    ├── insta_vX.Y.sh          ← SKRYPT INSTALACYJNY
    ├── app/static/...         ← pliki do nadpisania
    ├── modules/...            ← pliki do nadpisania
    └── README.md              ← TEN PLIK (notatki)
```

---

## 📌 AKTUALNY STAN

**Wersja:** 2.1b-fix  
**Data:** 2026-07-29  
**Status:** Builder się otwiera, layout działa, ale sekcje się nie ładują (FIX w trakcie testów)

### Co działa:
- [x] Layout 3-pane (Outline | Canvas | Properties)
- [x] Ciemny motyw (slate + amber)
- [x] Toolbar (zapisz, publikuj, mobile toggle)
- [x] Modal "Dodaj sekcję"
- [x] Drag & drop outline tree (JS gotowy)
- [x] Inline editing (double-click, contenteditable)

### Co NIE działa / do testowania:
- [ ] Ładowanie sekcji z API (pokazuje "Ładowanie..." lub pusty stan)
- [ ] Rich text formatting
- [ ] Media picker
- [ ] Repeater editor

---

## 🗂️ MAPA PLIKÓW

| Plik | Cel | Reusable |
|------|-----|----------|
| `app/static/js/admin/api-client.js` | Fetch wrapper | TAK |
| `app/static/js/admin/ui-utils.js` | Toast, confirm, modal | TAK |
| `app/static/js/admin/builder/inline-preview.js` | Render sekcji inline + edit | TAK |
| `app/static/js/admin/builder/outline-tree.js` | Lewy panel drzewa | TAK |
| `app/static/js/admin/builder/property-panel.js` | Prawy panel formularza | TAK |
| `app/static/js/admin/builder/builder-core.js` | Łączy wszystko + API | NIE (zależy od reszty) |
| `app/static/css/admin/builder.css` | Style buildera | NIE |
| `app/templates/admin/builder/index.html` | Layout HTML buildera | NIE |

---

## 🛣️ ROADMAPA

### v2.1b-fix (AKTUALNY) – Naprawa ładowania
- Debugowanie API, obsługa pustego stanu, console.log

### v2.2 – Rich Editing
- Floating toolbar (bold, italic, link, heading)
- Media picker modal
- Repeater editor (services, features)

### v2.3 – Polish
- Undo/redo, animacje, keyboard shortcuts

### v3.0 – v1.1 Release
- Formularz kontaktowy, SEO, stabilizacja

---

## ⚠️ WAŻNE

1. **Nie używaj iframe** – inline preview jest lepsze
2. **content_json** = zwykły obiekt JSON w bazie
3. **Tailwind CDN** – nie budujemy CSS
4. **Docker** – `docker compose restart` po każdej zmianie
5. **GitHub** – użytkownik pushuje ręcznie

---

*Ostatnia aktualizacja: 2026-07-29 – v2.1b-fix*
