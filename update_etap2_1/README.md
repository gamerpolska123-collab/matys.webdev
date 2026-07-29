# 🏗️ BuildCMS – Notatki Deweloperskie (v1.1)

> PLIK DLA MNIE (AI). Roadmapa, spis plików, decyzje architektoniczne.

---

## 📌 Aktualny stan (Etap 2.1 ✅)

**Wersja:** 1.1-dev-etap2.1  
**Data:** 2026-07-29  

**Co działa:**
- [x] Profesjonalny layout buildera (ciemny motyw, pełny ekran)
- [x] **Iframe jako główny canvas** (większość ekranu)
- [x] **Lewy panel:** drzewo sekcji (outline) z DnD
- [x] **Prawy panel:** właściwości aktywnej sekcji (PropertyPanel)
- [x] **Górny toolbar:** zapis, publikuj, undo, device toggle
- [x] **Komunikacja iframe↔parent** przez postMessage (IframeBridge)
- [x] **Kliknięcie sekcji w iframe** = zaznacza ją, otwiera properties, scrolluje outline
- [x] **Outline w iframe** – hover border + label typu sekcji
- [x] **Live update** – zmiana w prawym panelu natychmiast aktualizuje iframe (bez reload)
- [x] Mobile preview toggle (375px)
- [x] Reusable moduły JS: iframe-bridge, outline-tree, property-panel

**Co jeszcze NIE działa (Etap 2.2+):**
- [ ] Inline editing bezpośrednio w iframe (kliknij tekst = edytuj)
- [ ] Dodawanie/usuwanie sekcji z poziomu buildera (przyciski są, API jest, ale trzeba przetestować)
- [ ] Rich text editor w property panel
- [ ] Picker obrazów z biblioteki mediów
- [ ] Undo/redo

---

## 🗂️ Mapa plików

### Reusable JS (builder/)
| Plik | Co robi | Niezależność |
|------|---------|-------------|
| `iframe-bridge.js` | postMessage wrapper iframe↔parent | Zero zależności |
| `outline-tree.js` | Lewy panel drzewa sekcji z DnD | Zero zależności |
| `property-panel.js` | Prawy panel formularza z schematu | Zero zależności |
| `builder-core.js` | Łączy wszystko + API calls | Wymaga api-client, ui-utils, 3 moduły wyżej |

### Szablony
| Plik | Co zawiera |
|------|------------|
| `admin/builder/index.html` | **NOWY** – pełny ekran, ciemny motyw, iframe canvas |
| `modules/onepage/templates/index.html` | Z `data-section-id`, `data-editable`, bridge JS na końcu |

### Style
| Plik | Co zawiera |
|------|------------|
| `admin/builder.css` | Ciemny motyw buildera, layout, modale, outline |

---

## 🧬 Architektura komunikacji iframe

```
PARENT (builder/index.html)
  ├── IframeBridge.send('updateSection', {sectionId, key, value})
  ├── IframeBridge.send('scrollTo', {sectionId})
  └── IframeBridge.send('highlight', {sectionId})
        ↓ postMessage
IFRAME (onepage/index.html)
  ├── sectionClick → postMessage → parent → selectSection(id)
  ├── sectionHover → postMessage → parent (opcjonalnie)
  └── updateSection → znajduje [data-editable] i aktualizuje DOM
```

Atrybuty w iframe:
- `data-section-id` – na każdym `<section>`
- `data-editable` – na elementach edytowalnych (heading, subheading, content, phone, email, image, background_image)
- `data-builder-ignore` – na navbar/footer (nieklikalne w trybie buildera)

---

## 🛣️ Roadmapa

### Etap 2.1: Szkielet nowego buildera ✅
### Etap 2.2: Inline editing w iframe ⏳
- Kliknij tekst w iframe → contenteditable
- Blur → wyślij update do parenta → zapisz w bazie
- Reusable: `inline-editor.js`

### Etap 2.3: Rich text + media picker ⏳
- Quill.js lub prosty WYSIWYG w property panel
- Modal z gridem obrazków z `/api/media`
- Reusable: `media-picker.js`

### Etap 2.4: Polish & stabilizacja ⏳
- Undo/redo stack
- Animacje przejść
- Responsywność buildera na tabletach
- Finalne testy

### Etap 3: Mobile & frontend ⏳
- Dopracowanie onepage na mobile
- Formularz kontaktowy z backendem

### Etap 4: v1.1 release ⏳

---

## 🐍 Szybkie snippety

### Dodanie nowego pola edytowalnego:
1. W `onepage/index.html` dodaj `data-editable="nazwa_pola"` do elementu
2. W `builder-core.js` → `state.schemas['typ_sekcji']` dodaj pole
3. W iframe bridge (na końcu onepage) dodaj obsługę w `updateSection`

### Dodanie nowego typu sekcji:
1. Schema w `builder-core.js`
2. Render w `onepage/index.html`
3. Label w `builder.css` (builder-section-label)
4. Ikona w `builder/index.html` modal

---

## ✅ Checklist

- [ ] Builder otwiera się na pełnym ekranie z ciemnym motywem
- [ ] Iframe pokazuje stronę z outline (pomarańczowa ramka na hover)
- [ ] Kliknięcie sekcji w iframe zaznacza ją w outline i otwiera properties
- [ ] Zmiana w properties natychmiast aktualizuje iframe
- [ ] Mobile toggle działa (375px)
- [ ] Dodawanie/usuwanie sekcji działa
- [ ] Brak błędów 500

---

*Ostatnia aktualizacja: 2026-07-29 – Etap 2.1 zakończony*
