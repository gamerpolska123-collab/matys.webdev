/**
 * BuilderCore v2.1b – Inline Preview Builder (no iframe)
 */
document.addEventListener('DOMContentLoaded', () => {
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
      const res = await api.get('/api/homepage/sections');
      state.sections = await res.json();

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
          // Update local state
          const sec = state.sections.find(s => s.id === id);
          if (sec) {
            sec.content_json = sec.content_json || {};
            sec.content_json[key] = value;
          }
          // Sync property panel if this section is active
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
            InlinePreview.refresh(state.sections.sort((a,b) => ids.indexOf(a.id) - ids.indexOf(b.id)));
          } catch (e) { UI.toast(e.message, 'error'); }
        }
      });
    } catch (e) { UI.toast(e.message, 'error'); }
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
        // Update local state
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

  // Save all (publish)
  document.getElementById('btnPublish')?.addEventListener('click', async () => {
    try {
      // Save all sections that have changes
      for (const sec of state.sections) {
        await api.put('/api/sections/' + sec.id, {
          title: sec.title,
          content_json: sec.content_json
        });
      }
      const res = await api.post('/api/homepage/toggle-publish');
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
      InlinePreview.addSection(newSection);
      OutlineTree.init('#outlineTree', state.sections, {
        onSelect: (id) => { InlinePreview.select(id); selectSection(id); },
        onReorder: async (ids) => {
          await api.post('/api/homepage/sections/reorder', { order: ids });
          UI.toast('Kolejność zapisana');
        }
      });
      UI.toast('Dodano sekcję');
      UI.modal('addSectionModal', false);
      selectSection(newSection.id);
    } catch (e) { UI.toast(e.message, 'error'); }
  };

  async function deleteSection(id) {
    if (!UI.confirm('Usunąć tę sekcję?')) return;
    try {
      await api.del('/api/sections/' + id);
      InlinePreview.removeSection(id);
      state.sections = state.sections.filter(s => s.id !== id);
      OutlineTree.init('#outlineTree', state.sections, {
        onSelect: (id) => { InlinePreview.select(id); selectSection(id); },
        onReorder: async (ids) => {
          await api.post('/api/homepage/sections/reorder', { order: ids });
          UI.toast('Kolejność zapisana');
        }
      });
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

  // Init
  loadSections();
});
