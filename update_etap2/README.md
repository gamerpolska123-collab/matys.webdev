# 🏗️ BuildCMS – Notatki Deweloperskie (v1.1)

> TEN PLIK JEST DLA MNIE (AI). Zawiera roadmapę, spis plików, decyzje architektoniczne i checklistę.

---

## 📌 Aktualny stan (Etap 2 ✅)

**Wersja:** 1.1-dev-etap2  
**Data:** 2026-07-29  
**Co działa:**
- [x] Podział JS na reusable moduły (etap 1)
- [x] Page Builder z listą sekcji + iframe preview (etap 1)
- [x] **Drag & drop zapisuje kolejność w bazie** (`/api/homepage/sections/reorder`)
- [x] **Toggle widoczności sekcji** (`/api/homepage/sections/{id}/toggle`)
- [x] **Modal edycji sekcji** z generowanym formularzem na podstawie typu
- [x] **8 predefiniowanych typów sekcji**: hero, about, services, gallery, contact, cta, text, features
- [x] **Frontend onepage renderuje sekcje dynamicznie** z `content_json`
- [x] **Responsywny navbar** z hamburgerem na mobile
- [x] **CRUD stron** via API (GET/POST/PUT/DELETE `/api/pages`)
- [x] Toggle publikacji strony z buildera

**Co jeszcze NIE działa (Etap 3+):**
- [ ] Picker obrazów z biblioteki mediów (teraz ręczny URL)
- [ ] Rich text editor (teraz textarea HTML)
- [ ] Animacje scroll-triggered
- [ ] Formularz kontaktowy z backendem (teraz placeholder alert)

---

## 🗂️ Mapa plików

### Reusable JS
| Plik | Co robi |
|------|---------|
| `app/static/js/admin/api-client.js` | Fetch wrapper |
| `app/static/js/admin/drag-drop.js` | Sortable DnD |
| `app/static/js/admin/ui-utils.js` | Toast, confirm, modal |
| `app/static/js/admin/mobile-preview.js` | Toggle iframe width |
| `app/static/js/admin/page-builder.js` | Kontroler buildera (DnD, toggle, delete) |
| `app/static/js/admin/section-editor.js` | **NOWY** – generuje formularz edycji z schematu |

### Szablony Admin
| Plik | Co zawiera |
|------|------------|
| `app/templates/admin/builder/index.html` | Builder: lista sekcji + iframe + modale (dodaj/edytuj) |
| `app/templates/admin/components/*.html` | Sidebar, navbar, toast |
| `app/templates/base.html` | Layout admina |

### Szablony Frontend
| Plik | Co zawiera |
|------|------------|
| `modules/onepage/templates/index.html` | **NOWY** – dynamiczne renderowanie 8 typów sekcji, responsive |

### Backend
| Plik | Co zawiera |
|------|------------|
| `app/routers/api.py` | **Zaktualizowany** – reorder, toggle, get section, CRUD pages |
| `app/routers/admin.py` | Endpointy HTML (z etapu 1) |
| `app/models/page.py` | Page + PageSection (content_json) |

---

## 🧬 Schematy sekcji (content_json)

Typy pól w SectionEditor.schemas:
- `text` – input text
- `textarea` – textarea
- `richtext` – textarea (HTML do |safe w Jinja)
- `color` – input color
- `select` – select z options
- `image` – input text + przycisk (picker w etapie 3)
- `repeater` – lista elementów z podpolami (services, features)
- `gallery` – grid zdjęć z +/-

---

## 🛣️ Roadmapa

### Etap 1: Szkielet Reusable ✅
### Etap 2: Page Builder Core ✅
### Etap 3: Edycja Elementów ⏳
- Picker mediów (modal z gridem obrazków z /api/media)
- Rich text editor (np. Quill.js lub prosty WYSIWYG)
- Walidacja content_json po stronie backendu

### Etap 4: Mobile & UX ⏳
- Dopracowanie breakpointów onepage
- Mobile preview w adminie (już jest szkielet)
- Smooth scroll + animacje AOS

### Etap 5: Stabilizacja v1.1 ⏳
- Formularz kontaktowy z backendem (SMTP/email)
- SEO: sitemap.xml, meta tags dynamiczne
- Wersja 1.1.0

---

## 🐍 Szybkie snippety

### Dodanie nowego typu sekcji:
1. Dodaj schemat w `section-editor.js` → `SectionEditor.schemas['nowy_typ']`
2. Dodaj renderowanie w `modules/onepage/templates/index.html` → `{% elif section.section_type == 'nowy_typ' %}`
3. Dodaj ikonę w `builder/index.html` → modal "Dodaj sekcję"

### Dodanie nowego pola do schematu:
```js
{ name: 'nowe_pole', label: 'Etykieta', type: 'text' }
```
Typy: text, textarea, richtext, color, select, image, repeater, gallery.

---

## ✅ Checklist

- [ ] Użytkownik potwierdził że Etap 2 działa
- [ ] DnD zapisuje kolejność (sprawdzić w bazie sort_order)
- [ ] Edycja sekcji zapisuje content_json
- [ ] Frontend wyświetla wszystkie 8 typów poprawnie
- [ ] Mobile menu działa na stronie
- [ ] Brak błędów 500

---

*Ostatnia aktualizacja: 2026-07-29 – Etap 2 zakończony*
