# 🏗️ BuildCMS – Notatki Deweloperskie (v1.1)

> TEN PLIK JEST DLA MNIE (AI). Zawiera roadmapę, spis plików, decyzje architektoniczne i checklistę.
> Użytkownik go nie czyta – ma być moim szybkim źródłem kontekstu.

---

## 📌 Aktualny stan (Etap 1 ✅)

**Wersja:** 1.1-dev-etap1  
**Data:** 2026-07-29  
**Co działa:**
- [x] Podział JS na reusable moduły (`api-client`, `drag-drop`, `ui-utils`, `mobile-preview`)
- [x] Komponenty UI (`sidebar`, `navbar`, `toast`)
- [x] Nowy `base.html` z mobile-first layoutem
- [x] Szkielet Page Buildera (`/admin/builder`) z listą sekcji + iframe preview
- [x] Endpoint `/admin/builder` w `admin.py`
- [x] `update.sh` do wgrywania aktualizacji

**Co jeszcze NIE działa (Etap 2+):**
- [ ] Drag & drop nie zapisuje kolejności w bazie (brak endpointu `/api/homepage/sections/reorder`)
- [ ] Brak modalu edycji elementu w sekcji
- [ ] Brak predefiniowanych szablonów HTML dla sekcji (hero, about, services...)
- [ ] Frontend onepage nie jest w pełni responsywny
- [ ] Brak endpointu `/api/homepage/sections/{id}/toggle`

---

## 🗂️ Mapa plików (co gdzie jest)

### Reusable JS (przyszłe projekty)
| Plik | Co robi | Zależności |
|------|---------|------------|
| `app/static/js/admin/api-client.js` | Fetch wrapper z obsługą błędów | Brak |
| `app/static/js/admin/drag-drop.js` | Sortable drag & drop | Brak |
| `app/static/js/admin/ui-utils.js` | Toast, confirm, modal toggle | Brak |
| `app/static/js/admin/mobile-preview.js` | Toggle iframe width mobile/desktop | Brak |
| `app/static/js/admin/page-builder.js` | Główny kontroler buildera | api-client, drag-drop, ui-utils |

### Komponenty HTML (reusable)
| Plik | Co zawiera |
|------|------------|
| `app/templates/admin/components/sidebar.html` | Menu boczne z modułami, responsive (hamburger) |
| `app/templates/admin/components/navbar.html` | Górny pasek z togglem sidebaru, user, preview link |
| `app/templates/admin/components/toast.html` | Kontener na powiadomienia (zarządzany przez ui-utils.js) |

### Style
| Plik | Co zawiera |
|------|------------|
| `app/static/css/admin/builder.css` | Style buildera (hover, toolbar, preview-frame) |
| `app/static/css/admin/responsive.css` | Poprawki mobilne admina (sidebar, builder) |

### Szablony
| Plik | Co zawiera |
|------|------------|
| `app/templates/base.html` | NOWY layout: sidebar + navbar + main, ładuje wszystkie JS reusable |
| `app/templates/admin/builder/index.html` | Główny ekran buildera: lista sekcji (lewo) + iframe preview (prawo) |

### Backend
| Plik | Co zawiera |
|------|------------|
| `app/routers/admin.py` | Endpointy HTML: `/admin`, `/admin/builder`, `/admin/pages/*`, `/admin/settings`, `/admin/media` |
| `app/routers/api.py` | Endpointy JSON: CRUD sekcji, settings, media, upload |
| `app/models/page.py` | `Page` + `PageSection` (pole `content_json` do przyszłej edycji elementów) |

---

## 🛣️ Roadmapa do v1.1

### Etap 1: Szkielet Reusable ✅
Cel: Podzielić kod na moduły, poprawić base.html, stworzyć szkielet buildera.

### Etap 2: Page Builder Core ⏳
**Pliki do zmiany/dodania:**
- `app/routers/api.py` – dodać:
  - `POST /api/homepage/sections/reorder` (przyjmuje `{order: [id1, id2, ...]}`)
  - `POST /api/homepage/sections/{id}/toggle` (przełącza `is_visible`)
  - `GET /api/sections/{id}` (pobiera pełne dane sekcji do edycji)
- `app/static/js/admin/page-builder.js` – podpiąć prawdziwe API do DnD i toggle
- `app/templates/admin/builder/index.html` – modal edycji sekcji (title, type, content)
- `modules/onepage/templates/index.html` – dodać renderowanie sekcji po typach z `content_json`

**Szablony sekcji (predefiniowane HTML w `content_json` lub w szablonie Jinja):**
- `hero` – baner z tłem, nagłówkiem, przyciskiem
- `about` – tekst + obraz
- `services` – grid kart usług
- `gallery` – grid zdjęć
- `contact` – dane kontaktowe + mapa
- `cta` – call to action
- `text` – zwykły tekst
- `features` – liczniki/ikony

### Etap 3: Edycja Elementów ⏳
**Pliki do zmiany:**
- `app/templates/admin/builder/edit-modal.html` – modal z edycją pól JSON sekcji
- `app/static/js/admin/section-editor.js` – nowy moduł: edycja pól formularza na podstawie typu sekcji
- `app/routers/api.py` – `PUT /api/sections/{id}` rozbudowany o walidację `content_json`

**Typy pól w edytorze:**
- text, textarea, image (z pickerem mediów), color, select, repeater (lista elementów)

### Etap 4: Mobile & UX ⏳
**Pliki do zmiany:**
- `modules/onepage/templates/index.html` – dodać `<meta viewport>`, poprawić klasy Tailwind (md:, lg:)
- `app/static/css/admin/responsive.css` – dopracować breakpointy
- `app/templates/admin/builder/index.html` – mobilny podgląd w iframe (375px)

### Etap 5: Stabilizacja v1.1 ⏳
**Pliki do zmiany:**
- `app/routers/api.py` – dodać brakujące endpointy CRUD dla `Page` (POST/PUT/DELETE `/api/pages/{id}`)
- `app/__version__.py` – zmienić na `1.1.0`
- `README.md` (użytkownika) – zaktualizować dokumentację

---

## 🔧 Decyzje architektoniczne

1. **Reusable JS** – każdy plik JS to samodzielny moduł bez zależności zewnętrznych (poza Tailwind/FontAwesome w HTML). Można skopiować do innego projektu.
2. **content_json** – pole JSON w `PageSection` przechowuje strukturę elementów w sekcji. Przykład dla `hero`:
   ```json
   {
     "heading": "Firma Budowlana MAX",
     "subheading": "Budujemy z pasją od 1998",
     "button_text": "Zadzwoń",
     "button_url": "tel:+48123456789",
     "background_image": "/uploads/hero.jpg",
     "overlay_color": "rgba(0,0,0,0.5)"
   }
   ```
3. **Szablony Jinja vs JSON** – frontend (`modules/onepage/templates/index.html`) renderuje sekcje na podstawie `section_type` + `content_json`. Nie przechowujemy pełnego HTML w bazie.
4. **Mobile preview** – iframe z src="/" + toggle width 375px/100%. Nie wymaga osobnego endpointu.

---

## 🐍 Snippety (kopiuj-wklej)

### Dodanie endpointu reorder w api.py:
```python
class SectionReorder(BaseModel):
    order: List[int]

@router.post("/homepage/sections/reorder")
async def reorder_sections(data: SectionReorder, db: Session = Depends(get_db)):
    for idx, section_id in enumerate(data.order):
        sec = db.query(PageSection).filter(PageSection.id == section_id).first()
        if sec:
            sec.sort_order = idx
    db.commit()
    return {"ok": True}
```

### Dodanie endpointu toggle w api.py:
```python
@router.post("/homepage/sections/{section_id}/toggle")
async def toggle_section(section_id: int, db: Session = Depends(get_db)):
    section = db.query(PageSection).filter(PageSection.id == section_id).first()
    if not section: raise HTTPException(404, "Section not found")
    section.is_visible = not section.is_visible
    db.commit(); db.refresh(section)
    return {"visible": section.is_visible}
```

---

## ✅ Checklist przed kolejnym etapem

- [ ] Użytkownik potwierdził że Etap 1 działa (panel admina się otwiera, builder się wyświetla)
- [ ] Pliki są na GitHub (użytkownik ręcznie pushuje)
- [ ] Docker działa po restarcie
- [ ] Brak błędów 500 w `/admin/builder`

---

*Ostatnia aktualizacja: 2026-07-29 – Etap 1 zakończony*
