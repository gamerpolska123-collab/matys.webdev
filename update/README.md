# 🏗️ BuildCMS – Notatki Deweloperskie (AI Internal)

> TEN PLIK JEST TYLKO DLA MNIE (AI).
> Zawiera kompletny kontekst projektu, proces pracy, mapę plików i roadmapę.
> Użytkownik go nie czyta – nie musi rozumieć struktury.

---

## 📋 PROCES PRACY (zapamiętaj to!)

### Jak dostarczam aktualizacje:
1. Generuję ZIP z folderem `update/` w środku
2. W `update/` jest plik `insta_vX.Y.sh` (np. `insta_v2.1b.sh`)
3. Użytkownik wypakowuje ZIP do root repozytorium
4. Uruchamia: `cd update && bash insta_vX.Y.sh`
5. Skrypt robi backup, kopiuje pliki, czyści cache, restartuje Docker
6. Użytkownik ręcznie pushuje zmiany na GitHub

### Struktura ZIP:
```
update_etapX_Y.zip
└── update/
    ├── insta_vX.Y.sh          ← SKRYPT INSTALACYJNY
    ├── app/
    │   ├── static/js/admin/builder/...
    │   ├── static/css/admin/...
    │   └── templates/admin/builder/...
    ├── modules/onepage/templates/...
    └── README.md              ← TEN PLIK (notatki)
```

### Jak użytkownik instaluje:
```bash
cd /sciezka/do/repo
unzip update_etap2_1b.zip -d .
cd update
bash insta_v2.1b.sh
```

---

## 📌 AKTUALNY STAN (v2.1b)

**Data:** 2026-07-29  
**Wersja:** 1.1-dev-etap2.1b  

### Co działa:
- [x] Inline Preview Builder (bez iframe)
- [x] Profesjonalny ciemny motyw (slate + amber)
- [x] 3-pane layout: Outline | Canvas | Properties
- [x] Kliknij sekcję = zaznacza + pokazuje properties
- [x] **Double-click tekst = inline editing** (contenteditable)
- [x] Live update z prawego panelu natychmiast na canvasie
- [x] Drag & drop w outline tree
- [x] Mobile toggle (375px)
- [x] 8 typów sekcji: hero, about, services, gallery, contact, cta, text, features
- [x] Reusable JS moduły: inline-preview, outline-tree, property-panel

### Co NIE działa (następne etapy):
- [ ] Rich text formatting (bold, italic, link)
- [ ] Media picker (modal z biblioteki obrazków)
- [ ] Repeater editor (dodawanie/usuwanie kart usług)
- [ ] Undo/redo stack
- [ ] Gallery management (dodawanie/usuwanie zdjęć)
- [ ] Formularz kontaktowy z backendem (SMTP)

---

## 🗂️ MAPA PLIKÓW (co gdzie jest)

### Reusable JS (przenośne między projektami)
| Plik | Co robi | Zależności |
|------|---------|-----------|
| `app/static/js/admin/api-client.js` | Fetch wrapper z błędami | ZERO |
| `app/static/js/admin/ui-utils.js` | Toast, confirm, modal | ZERO |
| `app/static/js/admin/builder/inline-preview.js` | Render sekcji inline + DnD + inline edit | ZERO |
| `app/static/js/admin/builder/outline-tree.js` | Lewy panel drzewa sekcji | ZERO |
| `app/static/js/admin/builder/property-panel.js` | Prawy panel formularza z JSON schema | ZERO |
| `app/static/js/admin/builder/builder-core.js` | Łączy wszystko + API calls | api-client, ui-utils, 3 moduły wyżej |

### Style
| Plik | Co zawiera |
|------|------------|
| `app/static/css/admin/builder.css` | Style canvas, outline, property panel, scrollbars, dark theme |

### Szablony
| Plik | Co zawiera |
|------|------------|
| `app/templates/admin/builder/index.html` | Pełny ekran builder, 3-pane layout, ciemny motyw |
| `modules/onepage/templates/index.html` | Frontend strony (renderuje sekcje z bazy) |

### Backend
| Plik | Co zawiera |
|------|------------|
| `app/routers/api.py` | API: CRUD sekcji, reorder, toggle, media, settings |
| `app/routers/admin.py` | Endpointy HTML: /admin, /admin/builder, /admin/pages, itp. |
| `app/models/page.py` | Page + PageSection (content_json jako JSON) |

---

## 🧬 ARCHITEKTURA BUILDERA

```
┌─────────────────────────────────────────────────────────────┐
│ Toolbar (zapisz / publikuj / undo / mobile)                │
├──────────┬──────────────────────────────┬───────────────────┤
│ Outline  │  Canvas (InlinePreview)      │  Properties       │
│ (lewo)   │                              │  (prawo)          │
│          │  ┌────────────────────────┐  │                   │
│  Drag    │  │ [toolbar] Hero Section │  │  - heading        │
│  & drop  │  │                        │  │  - subheading     │
│  lista   │  │  TYTUŁ (dblclick=edit) │  │  - button text    │
│  sekcji  │  │  Podtytuł...           │  │  - background     │
│          │  └────────────────────────┘  │  - color picker   │
│          │  ┌────────────────────────┐  │                   │
│          │  │ [toolbar] O nas        │  │                   │
│          │  │  Tekst...              │  │                   │
│          │  └────────────────────────┘  │                   │
└──────────┴──────────────────────────────┴───────────────────┘
```

### Flow edycji:
1. User klika sekcję w Canvas → `InlinePreview.select(id)` → zaznacza ramką
2. `builder-core.js` → `selectSection(id)` → otwiera `PropertyPanel` po prawej
3. User zmienia wartość w input → `PropertyPanel.onChange(key, value)`
4. → `InlinePreview.updateSection(id, key, value)` → natychmiast aktualizuje DOM
5. User klika "Zapisz" → `api.put('/api/sections/' + id)` → zapis w bazie
6. User klika "Opublikuj" → zapisuje WSZYSTKIE sekcje + toggle publish

### Inline editing (double-click):
1. User duble-klika tekst w Canvas
2. `contenteditable="true"` + autofocus + select all
3. Blur lub Enter → zapisuje do `state.sections[].content_json[key]`
4. Jeśli sekcja jest aktywna w PropertyPanel → synchronizuje wartość

---

## 🛣️ ROADMAPA DO v1.1

### Etap 2.1b: Inline Builder ✅ (AKTUALNY)
- Inline preview bez iframe
- Dark theme
- Double-click inline editing
- Live property updates

### Etap 2.2: Rich Editing ⏳
- [ ] Floating toolbar nad zaznaczonym tekstem (bold, italic, link, H2/H3)
- [ ] Media picker modal – grid obrazków z `/api/media`
- [ ] Repeater editor – dodaj/usuń/edytuj karty usług i cech
- [ ] Gallery management – drag & drop upload, sortowanie

### Etap 2.3: Polish ⏳
- [ ] Undo/redo stack (Command+Z / Ctrl+Z)
- [ ] Animacje przejść między sekcjami
- [ ] Mobile preview z realnymi wymiarami (iPhone, iPad, Desktop)
- [ ] Keyboard shortcuts (Delete = usuń sekcję, Escape = anuluj)

### Etap 3: Frontend & Mobile ⏳
- [ ] Dopracowanie responsywności onepage
- [ ] Formularz kontaktowy z backendem (SMTP/email)
- [ ] SEO: dynamiczne meta tags, sitemap.xml
- [ ] Google Analytics integration

### Etap 4: Stabilizacja v1.1 ⏳
- [ ] Finalne testy
- [ ] Dokumentacja użytkownika (README.md publiczne)
- [ ] Wersja 1.1.0

---

## 🐍 SZYBKIE SNIPPETY

### Dodanie nowego typu sekcji:
1. Schema w `builder-core.js` → `state.schemas['nowy_typ']`
2. Render w `inline-preview.js` → `case 'nowy_typ':`
3. Ikona w `builder/index.html` → modal "Dodaj sekcję"
4. Frontend w `modules/onepage/templates/index.html` → `{% elif section.section_type == 'nowy_typ' %}`

### Dodanie nowego pola do schematu:
```js
{ name: 'nowe_pole', label: 'Etykieta', type: 'text' }
```
Typy: text, textarea, color, select, image, toggle.

### Dodanie obsługi nowego pola w inline-preview:
W `renderSection()` dla danego typu:
```html
<p data-editable="nowe_pole" contenteditable="false">${data.nowe_pole || 'Domyślna wartość'}</p>
```

---

## 📦 HISTORIA WERSJI

| Wersja | Data | Co zawiera | Plik instalacyjny |
|--------|------|-----------|-------------------|
| 2.1b | 2026-07-29 | Inline Preview Builder, dark theme, double-click edit | `insta_v2.1b.sh` |
| 2.1 | 2026-07-29 | Iframe builder (porzucony) | `insta_v2.1.sh` |
| 2.0 | 2026-07-29 | Szkielet reusable, komponenty UI | `insta_v2.0.sh` |
| 1.0.1 | (przed) | Podstawowy CMS z formularzami | – |

---

## ⚠️ WAŻNE UWAGI

1. **Nie używaj iframe** – inline preview jest lepsze (Webflow, Framer tak robią)
2. **Moduły JS są reusable** – można skopiować do innych projektów bez zmian
3. **content_json** przechowuje dane sekcji jako zwykły obiekt JSON
4. **Nie przechowuj HTML w bazie** – renderuj z template na podstawie typu + JSON
5. **Tailwind CDN** – używamy tylko CDN, nie budujemy CSS
6. **Docker** – po każdej zmianie `docker compose restart`
7. **GitHub** – użytkownik pushuje ręcznie, ja nie mam dostępu do repo

---

## ✅ CHECKLIST PRZED KOLEJNYM ETAPem

- [ ] Użytkownik potwierdził że v2.1b działa
- [ ] Builder otwiera się na pełnym ekranie
- [ ] Double-click na tekst włącza edycję
- [ ] Property panel aktualizuje canvas live
- [ ] Mobile toggle działa
- [ ] Brak błędów 500 w konsoli
- [ ] Pliki są na GitHub (użytkownik pushnął)

---

*Ostatnia aktualizacja: 2026-07-29 – v2.1b*
*Następny etap: 2.2 – Rich Editing + Media Picker*
