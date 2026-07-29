/**
 * Page Builder Core v1.1 – Etap 2
 * Zarządza listą sekcji, drag & drop, toggle visibility, modal edycji
 */
document.addEventListener('DOMContentLoaded', () => {
  const sectionList = document.getElementById('builder-sections');
  if (!sectionList) return;

  // Inicjalizacja DnD z realnym API
  Sortable.init('#builder-sections', {
    onSort: async (ids) => {
      try {
        await api.post('/api/homepage/sections/reorder', { order: ids.map(Number) });
        UI.toast('Kolejność zapisana');
      } catch (e) {
        UI.toast(e.message, 'error');
      }
    }
  });

  // Toggle widoczności
  document.querySelectorAll('.toggle-visibility').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      try {
        const res = await api.post(`/api/homepage/sections/${id}/toggle`);
        const visible = res.visible;
        btn.innerHTML = `<i class="fas fa-eye${visible ? '' : '-slash'}"></i>`;
        btn.className = `toggle-visibility ${visible ? 'text-green-600' : 'text-gray-400'}`;
        UI.toast(visible ? 'Sekcja widoczna' : 'Sekcja ukryta');
      } catch (e) {
        UI.toast(e.message, 'error');
      }
    });
  });
});

async function addSection(type) {
  // Domyślne content_json dla typu
  const defaults = {
    hero: { heading: 'Nowy nagłówek', subheading: 'Podtytuł', button_text: 'Zadzwoń', button_url: '#', background_image: '', overlay_color: 'rgba(0,0,0,0.5)' },
    about: { heading: 'O nas', content: 'Opis firmy...', image: '', image_position: 'right' },
    services: { heading: 'Nasze usługi', items: [{icon:'fa-tools',title:'Usługa 1',desc:'Opis'}] },
    gallery: { heading: 'Galeria', images: [] },
    contact: { heading: 'Kontakt', phone: '', email: '', address: '' },
    cta: { heading: 'Zacznijmy współpracę!', button_text: 'Napisz do nas', button_url: '#', background_image: '' },
    text: { heading: '', content: 'Treść...' },
    features: { heading: 'Dlaczego my?', items: [{icon:'fa-star',value:'100',label:'Zadowolonych klientów'}] }
  };
  try {
    await api.post('/api/homepage/sections', {
      title: 'Nowa sekcja',
      section_type: type,
      content: '',
      content_json: defaults[type] || {},
      is_visible: true
    });
    UI.toast('Sekcja dodana');
    location.reload();
  } catch (e) {
    UI.toast(e.message, 'error');
  }
}

async function deleteSection(id) {
  if (!UI.confirm('Usunąć tę sekcję?')) return;
  try {
    await api.del('/api/sections/' + id);
    UI.toast('Sekcja usunięta');
    location.reload();
  } catch (e) {
    UI.toast(e.message, 'error');
  }
}

async function editSection(id) {
  try {
    const res = await api.get('/api/sections/' + id);
    const section = await res.json();
    SectionEditor.open(section);
  } catch (e) {
    UI.toast(e.message, 'error');
  }
}

// Mobile preview
if (document.getElementById('previewFrame') && document.getElementById('previewToggle')) {
  MobilePreview.init('#previewFrame', '#previewToggle');
}
