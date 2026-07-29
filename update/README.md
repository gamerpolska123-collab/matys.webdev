# BuildCMS – Notatki Deweloperskie (AI Internal)

## PROCES PRACY
1. ZIP z folderem `update/` i `insta_vX.Y.sh`
2. Użytkownik: `unzip update_vX.Y.zip -d . && cd update && bash insta_vX.Y.sh`
3. Skrypt: backup → kopiowanie → restart Docker
4. Użytkownik pushuje na GitHub ręcznie

## AKTUALNY STAN
**Wersja:** 2.1b-fix2
**Data:** 2026-07-29
**Zmiany:** Cache busting, inline fallback styles, czysta instalacja

## MAPA PLIKÓW
| Plik | Cel |
|------|-----|
| `app/static/js/admin/api-client.js` | Fetch wrapper |
| `app/static/js/admin/ui-utils.js` | Toast, confirm, modal |
| `app/static/js/admin/builder/inline-preview.js` | Render sekcji inline |
| `app/static/js/admin/builder/outline-tree.js` | Lewy panel |
| `app/static/js/admin/builder/property-panel.js` | Prawy panel |
| `app/static/js/admin/builder/builder-core.js` | Kontroler |
| `app/static/css/admin/builder.css` | Style |
| `app/templates/admin/builder/index.html` | Layout |
| `modules/onepage/templates/index.html` | Frontend |

## ROADMAPA
- v2.1b-fix2 (aktualny) – naprawa stylów i ładowania
- v2.2 – Rich editing, media picker
- v2.3 – Undo/redo, polish
- v3.0 – v1.1 release

*Cache busting: ?v=2.1b-fix2 we wszystkich URLach JS/CSS*
