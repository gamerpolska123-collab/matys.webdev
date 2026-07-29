/**
 * BuilderCore v2.1 – Profesjonalny Page Builder
 * Łączy: IframeBridge, OutlineTree, PropertyPanel, API
 */
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    sections: [],
    activeSectionId: null,
    schemas: {
      hero: [
        { name: 'heading', label: 'Nagłówek', type: 'text' },
        { name: 'subheading', label: 'Podtytuł', type: 'text' },
        { name: 'button_text', label: 'Tekst przycisku', type: 'text' },
        { name: 'button_url', label: 'URL przycisku', type: 'text' },
        { name: 'background_image', label: 'Tło', type: 'image' },
        { name: 'overlay_color', label: 'Nakładka', type: 'color' }
      ],
      about: [
        { name: 'heading', label: 'Nagłówek', type: 'text' },
        { name: 'content', label: 'Treść', type: 'textarea' },
        { name: 'image', label: 'Obrazek', type: 'image' },
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
        { name: 'background_image', label: 'Tło', type: 'image' }
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

  // Load sections
  async function loadSections() {
    try {
      const res = await api.get('/api/homepage/sections');
      state.sections = await res.json();
      OutlineTree.init('#outlineTree', state.sections, {
        onSelect: (id) => selectSection(id),
        onReorder: async (ids) => {
          try {
            await api.post('/api/homepage/sections/reorder', { order: ids });
            UI.toast('Kolejność zapisana');
            reloadPreview();
          } catch (e) { UI.toast(e.message, 'error'); }
        }
      });
    } catch (e) { UI.toast(e.message, 'error'); }
  }

  // Select section
  function selectSection(id) {
    state.activeSectionId = id;
    const section = state.sections.find(s => s.id === id);
    if (!section) return;

    OutlineTree.setActive(id);

    // Scroll iframe to section
    IframeBridge.send('scrollTo', { sectionId: id });

    // Highlight in iframe
    IframeBridge.send('highlight', { sectionId: id });

    // Load properties
    const schema = state.schemas[section.section_type] || [];
    PropertyPanel.init('#propertyPanel', schema, section.content_json || {}, {
      onChange: (key, value) => {
        // Live update in iframe
        IframeBridge.send('updateSection', {
          sectionId: id,
          key: key,
          value: value
        });
      }
    });
  }

  // Iframe bridge handlers
  IframeBridge.init('#previewFrame', {
    sectionClick: (payload) => {
      selectSection(payload.sectionId);
    },
    sectionHover: (payload) => {
      // Optional: sync hover with outline tree
    }
  });

  // Save handler
  document.getElementById('btnSave')?.addEventListener('click', async () => {
    const section = state.sections.find(s => s.id === state.activeSectionId);
    if (!section) { UI.toast('Wybierz sekcję do zapisu', 'error'); return; }

    const data = PropertyPanel.data;
    try {
      await api.put('/api/sections/' + section.id, {
        title: section.title,
        content_json: data
      });
      UI.toast('Zapisano');
      // Update local state
      section.content_json = data;
      reloadPreview();
    } catch (e) { UI.toast(e.message, 'error'); }
  });

  // Publish toggle
  document.getElementById('btnPublish')?.addEventListener('click', async () => {
    try {
      const res = await api.post('/api/homepage/toggle-publish');
      UI.toast(res.published ? 'Opublikowano' : 'Wycofano');
      reloadPreview();
    } catch (e) { UI.toast(e.message, 'error'); }
  });

  // Mobile preview toggle
  document.getElementById('btnDevice')?.addEventListener('click', () => {
    const frame = document.getElementById('previewFrame');
    const isMobile = frame.classList.toggle('mobile-view');
    frame.style.width = isMobile ? '375px' : '100%';
    frame.style.margin = isMobile ? '0 auto' : '0';
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
      await api.post('/api/homepage/sections', {
        title: type.charAt(0).toUpperCase() + type.slice(1),
        section_type: type,
        content_json: state.defaults[type] || {},
        is_visible: true
      });
      UI.toast('Dodano sekcję');
      UI.modal('addSectionModal', false);
      await loadSections();
      reloadPreview();
    } catch (e) { UI.toast(e.message, 'error'); }
  };

  // Delete section
  window.deleteActiveSection = async () => {
    if (!state.activeSectionId) return;
    if (!UI.confirm('Usunąć tę sekcję?')) return;
    try {
      await api.del('/api/sections/' + state.activeSectionId);
      UI.toast('Sekcja usunięta');
      state.activeSectionId = null;
      PropertyPanel.clear();
      await loadSections();
      reloadPreview();
    } catch (e) { UI.toast(e.message, 'error'); }
  };

  // Toggle visibility
  window.toggleSectionVisibility = async () => {
    if (!state.activeSectionId) return;
    try {
      const res = await api.post('/api/homepage/sections/' + state.activeSectionId + '/toggle');
      const section = state.sections.find(s => s.id === state.activeSectionId);
      if (section) section.is_visible = res.visible;
      OutlineTree.updateVisibility(state.activeSectionId, res.visible);
      UI.toast(res.visible ? 'Widoczna' : 'Ukryta');
      reloadPreview();
    } catch (e) { UI.toast(e.message, 'error'); }
  };

  function reloadPreview() {
    const frame = document.getElementById('previewFrame');
    frame.src = frame.src;
  }

  // Init
  loadSections();
});
