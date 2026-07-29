/**
 * BuilderCore v2.1b-fix – Inline Preview Builder
 * FIX: lepsza obsługa błędów, pusty stan, debugowanie
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Builder] Inicjalizacja...');

  const state = {
    sections: [],
    activeId: null,
    schemas: {
      hero: [
        { name: 'heading', label: 'Nagłówek', type: 'text' },
        { name: 'subheading', label: 'Podtytuł', type: 'text' },
        { name: 'button_text', label: 'Tekst przycisku', type: 'text' },
        { name: 'button_url', label: 'URL przycisku', type: 'text' },
        { name: 'background_image', label: 'Tło (URL)', type: 'image' },
        { name: 'overlay_color', label: 'Nakładka', type: 'color' }
      ],
      about: [
        { name: 'heading', label: 'Nagłówek', type: 'text' },
        { name: 'content', label: 'Treść', type: 'textarea' },
        { name: 'image', label: 'Obrazek (URL)', type: 'image' },
        { name: 'image_position', label: 'Pozycja obrazka', type: 'select', options: [['left','Po lewej'],['right','Po prawej']] }
      ],
      services: [
        { name: 'heading', label: 'Nagłówek', type: 'text' }
      ],
      gallery: [
        { name: 'heading', label: 'Nagłówek', type: 'text' }
      ],
      contact: [
        { name: 'heading', label: 'Nagłówek', type: 'text' },
        { name: 'phone', label: 'Telefon', type: 'text' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'address', label: 'Adres', type: 'textarea' }
      ],
      cta: [
        { name: 'heading', label: 'Nagłówek', type: 'text' },
        { name: 'button_text', label: 'Tekst przycisku', type: 'text' },
        { name: 'button_url', label: 'URL przycisku', type: 'text' },
        { name: 'background_image', label: 'Tło (URL)', type: 'image' }
      ],
      text: [
        { name: 'heading', label: 'Nagłówek', type: 'text' },
        { name: 'content', label: 'Treść', type: 'textarea' }
      ],
      features: [
        { name: 'heading', label: 'Nagłówek', type: 'text' }
      ]
    },
    defaults: {
      hero: { heading: 'Nowy nagłówek', subheading: 'Podtytuł', button_text: 'Zadzwoń', button_url: '#', background_image: '', overlay_color: 'rgba(0,0,0,0.5)' },
      about: { heading: 'O nas', content: 'Opis firmy...', image: '', image_position: 'right' },
      services: { heading: 'Nasze usługi' },
      gallery: { heading: 'Galeria' },
      contact: { heading: 'Kontakt', phone: '', email: '', address: '' },
      cta: { heading: 'Zacznijmy!', button_text: 'Napisz', button_url: '#', background_image: '' },
      text: { heading: '', content: 'Treść...' },
      features: { heading: 'Dlaczego my?' }
    }
  };

  async function loadSections() {
    try {
      console.log('[Builder] Pobieranie sekcji z API...');
      const res = await api.get('/api/homepage/sections');
      console.log('[Builder] Odpowiedź API:', res.status);

      if (!res.ok) {
        const errText = await res.text();
        console.error('[Builder] Błąd API:', res.status, errText);
        UI.toast('Błąd API: ' + res.status, 'error');
        showEmptyState();
        return;
      }

      const data = await res.json();
      console.log('[Builder] Pobrano sekcji:', data.length);

      // Handle both array and object response
      state.sections = Array.isArray(data) ? data : (data.sections || []);

      if (state.sections.length === 0) {
        console.log('[Builder] Brak sekcji – pokazuję pusty stan');
        showEmptyState();
      } else {
        initBuilder();
      }
    } catch (e) {
      console.error('[Builder] Błąd ładowania:', e);
      UI.toast('Błąd ładowania: ' + e.message, 'error');
      showEmptyState();
    }
  }

  function showEmptyState() {
    const canvas = document.getElementById('previewCanvas');
    if (canvas) {
      canvas.innerHTML = `
        <div class="flex flex-col items-center justify-center h-96 text-slate-400">
          <i class="fas fa-layer-group text-4xl mb-4 text-slate-600"></i>
          <p class="text-sm mb-2">Brak sekcji na stronie</p>
          <p class="text-xs text-slate-600 mb-4">Dodaj pierwszą sekcję aby zacząć</p>
          <button onclick="UI.modal('addSectionModal', true)" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-sm font-bold transition-colors">
            <i class="fas fa-plus mr-2"></i>Dodaj sekcję
          </button>
        </div>
      `;
    }
    // Still init outline tree (empty)
    OutlineTree.init('#outlineTree', [], {
      onSelect: (id) => selectSection(id),
      onReorder: async (ids) => {
        try {
          await api.post('/api/homepage/sections/reorder', { order: ids });
          UI.toast('Kolejność zapisana');
        } catch (e) { UI.toast(e.message, 'error'); }
      }
    });
  }

  function initBuilder() {
    console.log('[Builder] Inicjalizacja InlinePreview...');

    InlinePreview.init('#previewCanvas', state.sections, {
      onSelect: (id) => selectSection(id),
      onEdit: (id) => selectSection(id),
      onDelete: (id) => deleteSection(id),
      onReorder: async (ids) => {
        try {
          await api.post('/api/homepage/sections/reorder', { order: ids });
          UI.toast('Kolejność zapisana');
        } catch (e) { UI.toast(e.message, 'error'); }
      },
      onFieldChange: (id, key, value) => {
        const sec = state.sections.find(s => s.id === id);
        if (sec) {
          sec.content_json = sec.content_json || {};
          sec.content_json[key] = value;
        }
        if (state.activeId === id) {
          PropertyPanel.data[key] = value;
        }
      }
    });

    OutlineTree.init('#outlineTree', state.sections, {
      onSelect: (id) => {
        InlinePreview.select(id);
        selectSection(id);
      },
      onReorder: async (ids) => {
        try {
          await api.post('/api/homepage/sections/reorder', { order: ids });
          UI.toast('Kolejność zapisana');
          // Reorder local state
          state.sections.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
        } catch (e) { UI.toast(e.message, 'error'); }
      }
    });
  }

  function selectSection(id) {
    if (!id) {
      state.activeId = null;
      PropertyPanel.clear();
      return;
    }
    state.activeId = id;
    const section = state.sections.find(s => s.id === id);
    if (!section) return;

    OutlineTree.setActive(id);
    InlinePreview.select(id);

    const schema = state.schemas[section.section_type] || [];
    PropertyPanel.init('#propertyPanel', schema, section.content_json || {}, {
      onChange: (key, value) => {
        InlinePreview.updateSection(id, key, value);
        section.content_json = section.content_json || {};
        section.content_json[key] = value;
      }
    });
  }

  // Save button
  document.getElementById('btnSave')?.addEventListener('click', async () => {
    const section = state.sections.find(s => s.id === state.activeId);
    if (!section) { UI.toast('Wybierz sekcję do zapisu', 'error'); return; }
    try {
      await api.put('/api/sections/' + section.id, {
        title: section.title,
        content_json: section.content_json
      });
      UI.toast('Zapisano');
    } catch (e) { UI.toast(e.message, 'error'); }
  });

  // Publish
  document.getElementById('btnPublish')?.addEventListener('click', async () => {
    try {
      for (const sec of state.sections) {
        await api.put('/api/sections/' + sec.id, {
          title: sec.title,
          content_json: sec.content_json
        });
      }
      await api.post('/api/homepage/toggle-publish');
      UI.toast('Wszystko zapisane i opublikowane');
    } catch (e) { UI.toast(e.message, 'error'); }
  });

  // Device toggle
  document.getElementById('btnDevice')?.addEventListener('click', () => {
    const canvas = document.getElementById('previewCanvas');
    const isMobile = canvas.classList.toggle('preview-mobile');
    document.getElementById('btnDevice').innerHTML = isMobile
      ? '<i class="fas fa-desktop mr-2"></i>Desktop'
      : '<i class="fas fa-mobile-alt mr-2"></i>Mobile';
  });

  // Add section
  document.getElementById('btnAddSection')?.addEventListener('click', () => {
    UI.modal('addSectionModal', true);
  });

  window.addSectionType = async (type) => {
    try {
      const res = await api.post('/api/homepage/sections', {
        title: type.charAt(0).toUpperCase() + type.slice(1),
        section_type: type,
        content_json: state.defaults[type] || {},
        is_visible: true
      });
      const newSection = await res.json();
      state.sections.push(newSection);

      // If first section, re-init everything
      if (state.sections.length === 1) {
        initBuilder();
      } else {
        InlinePreview.addSection(newSection);
        OutlineTree.init('#outlineTree', state.sections, {
          onSelect: (id) => { InlinePreview.select(id); selectSection(id); },
          onReorder: async (ids) => {
            await api.post('/api/homepage/sections/reorder', { order: ids });
            UI.toast('Kolejność zapisana');
          }
        });
      }
      UI.toast('Dodano sekcję');
      UI.modal('addSectionModal', false);
      selectSection(newSection.id);
    } catch (e) {
      console.error('[Builder] Błąd dodawania:', e);
      UI.toast(e.message, 'error');
    }
  };

  async function deleteSection(id) {
    if (!UI.confirm('Usunąć tę sekcję?')) return;
    try {
      await api.del('/api/sections/' + id);
      InlinePreview.removeSection(id);
      state.sections = state.sections.filter(s => s.id !== id);

      if (state.sections.length === 0) {
        showEmptyState();
      } else {
        OutlineTree.init('#outlineTree', state.sections, {
          onSelect: (id) => { InlinePreview.select(id); selectSection(id); },
          onReorder: async (ids) => {
            await api.post('/api/homepage/sections/reorder', { order: ids });
            UI.toast('Kolejność zapisana');
          }
        });
      }

      if (state.activeId === id) {
        state.activeId = null;
        PropertyPanel.clear();
      }
      UI.toast('Sekcja usunięta');
    } catch (e) { UI.toast(e.message, 'error'); }
  }

  window.deleteActiveSection = () => {
    if (state.activeId) deleteSection(state.activeId);
  };

  window.toggleSectionVisibility = async () => {
    if (!state.activeId) return;
    try {
      const res = await api.post('/api/homepage/sections/' + state.activeId + '/toggle');
      const section = state.sections.find(s => s.id === state.activeId);
      if (section) section.is_visible = res.visible;
      OutlineTree.updateVisibility(state.activeId, res.visible);
      UI.toast(res.visible ? 'Widoczna' : 'Ukryta');
    } catch (e) { UI.toast(e.message, 'error'); }
  };

  // Start
  loadSections();
});
