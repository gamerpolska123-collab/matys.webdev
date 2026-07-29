/**
 * Section Editor – generuje formularz edycji na podstawie typu sekcji
 * Użycie: SectionEditor.open(section)
 */
const SectionEditor = {
  schemas: {
    hero: [
      { name: 'heading', label: 'Nagłówek', type: 'text' },
      { name: 'subheading', label: 'Podtytuł', type: 'text' },
      { name: 'button_text', label: 'Tekst przycisku', type: 'text' },
      { name: 'button_url', label: 'URL przycisku', type: 'text' },
      { name: 'background_image', label: 'Tło (URL obrazka)', type: 'image' },
      { name: 'overlay_color', label: 'Kolor nakładki', type: 'color' }
    ],
    about: [
      { name: 'heading', label: 'Nagłówek', type: 'text' },
      { name: 'content', label: 'Treść', type: 'textarea' },
      { name: 'image', label: 'Obrazek', type: 'image' },
      { name: 'image_position', label: 'Pozycja obrazka', type: 'select', options: [['left','Po lewej'],['right','Po prawej']] }
    ],
    services: [
      { name: 'heading', label: 'Nagłówek', type: 'text' },
      { name: 'items', label: 'Usługi', type: 'repeater', fields: [
        { name: 'icon', label: 'Ikona (fa-*)', type: 'text' },
        { name: 'title', label: 'Tytuł', type: 'text' },
        { name: 'desc', label: 'Opis', type: 'textarea' }
      ]}
    ],
    gallery: [
      { name: 'heading', label: 'Nagłówek', type: 'text' },
      { name: 'images', label: 'Zdjęcia', type: 'gallery' }
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
      { name: 'heading', label: 'Nagłówek (opcjonalny)', type: 'text' },
      { name: 'content', label: 'Treść', type: 'richtext' }
    ],
    features: [
      { name: 'heading', label: 'Nagłówek', type: 'text' },
      { name: 'items', label: 'Elementy', type: 'repeater', fields: [
        { name: 'icon', label: 'Ikona (fa-*)', type: 'text' },
        { name: 'value', label: 'Wartość/liczba', type: 'text' },
        { name: 'label', label: 'Etykieta', type: 'text' }
      ]}
    ]
  },

  open(section) {
    const modal = document.getElementById('editSectionModal');
    const form = document.getElementById('editSectionForm');
    const fieldsContainer = document.getElementById('editSectionFields');
    if (!modal || !form || !fieldsContainer) return;

    document.getElementById('editSectionId').value = section.id;
    document.getElementById('editSectionTitle').value = section.title || '';
    document.getElementById('editSectionType').value = section.section_type;

    const schema = this.schemas[section.section_type] || [];
    const data = section.content_json || {};
    fieldsContainer.innerHTML = schema.map(field => this.renderField(field, data[field.name])).join('');

    // Inicjalizacja repeaterów
    fieldsContainer.querySelectorAll('[data-repeater]').forEach(el => {
      this.initRepeater(el);
    });

    UI.modal('editSectionModal', true);
  },

  renderField(field, value) {
    const v = value !== undefined ? value : '';
    let input = '';
    switch (field.type) {
      case 'text':
        input = `<input type="text" name="${field.name}" value="${this.escape(v)}" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none">`;
        break;
      case 'textarea':
        input = `<textarea name="${field.name}" rows="3" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none">${this.escape(v)}</textarea>`;
        break;
      case 'richtext':
        input = `<textarea name="${field.name}" rows="5" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none font-mono text-sm">${this.escape(v)}</textarea>`;
        break;
      case 'color':
        input = `<input type="color" name="${field.name}" value="${this.escape(v) || '#000000'}" class="w-full h-10 border border-gray-200 rounded-lg cursor-pointer">`;
        break;
      case 'select':
        input = `<select name="${field.name}" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none bg-white">` +
          field.options.map(o => `<option value="${o[0]}" ${v === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('') + '</select>';
        break;
      case 'image':
        input = `<div class="flex gap-2">
          <input type="text" name="${field.name}" value="${this.escape(v)}" placeholder="/uploads/obraz.jpg" class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none">
          <button type="button" onclick="SectionEditor.pickImage(this)" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"><i class="fas fa-image"></i></button>
        </div>`;
        break;
      case 'repeater':
        const items = Array.isArray(v) ? v : [];
        input = `<div data-repeater="${field.name}" class="space-y-2">
          <div class="repeater-items space-y-2">${items.map((item, idx) => this.renderRepeaterItem(field.fields, item, idx)).join('')}</div>
          <button type="button" onclick="SectionEditor.addRepeaterItem(this)" class="text-sm text-amber-600 hover:text-amber-700 font-medium"><i class="fas fa-plus"></i> Dodaj element</button>
        </div>`;
        break;
      case 'gallery':
        const imgs = Array.isArray(v) ? v : [];
        input = `<div data-gallery="${field.name}" class="space-y-2">
          <div class="gallery-items grid grid-cols-3 gap-2">${imgs.map((img, idx) => `
            <div class="relative group">
              <img src="${img}" class="w-full h-20 object-cover rounded-lg border">
              <button type="button" onclick="this.parentElement.remove()" class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"><i class="fas fa-times"></i></button>
              <input type="hidden" name="${field.name}[]" value="${this.escape(img)}">
            </div>`).join('')}</div>
          <button type="button" onclick="SectionEditor.pickGalleryImage(this)" class="text-sm text-amber-600 hover:text-amber-700 font-medium"><i class="fas fa-plus"></i> Dodaj zdjęcie</button>
        </div>`;
        break;
    }
    return `<div class="space-y-1"><label class="block text-sm font-medium text-gray-700">${field.label}</label>${input}</div>`;
  },

  renderRepeaterItem(fields, data, idx) {
    return `<div class="repeater-item bg-gray-50 rounded-lg p-3 space-y-2 relative">
      <button type="button" onclick="this.closest('.repeater-item').remove()" class="absolute top-2 right-2 text-gray-400 hover:text-red-500"><i class="fas fa-times"></i></button>
      ${fields.map(f => `<div><label class="text-xs text-gray-500">${f.label}</label>
        ${f.type === 'textarea'
          ? `<textarea name="${f.name}[]" rows="2" class="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-amber-400 outline-none">${this.escape(data?.[f.name] || '')}</textarea>`
          : `<input type="text" name="${f.name}[]" value="${this.escape(data?.[f.name] || '')}" class="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-amber-400 outline-none">`
        }</div>`).join('')}
    </div>`;
  },

  addRepeaterItem(btn) {
    const container = btn.closest('[data-repeater]').querySelector('.repeater-items');
    const fields = JSON.parse(btn.closest('[data-repeater]').dataset.fields || '[]');
    const div = document.createElement('div');
    div.innerHTML = this.renderRepeaterItem(fields, {}, container.children.length);
    container.appendChild(div.firstElementChild);
  },

  initRepeater(el) {
    // fields schema zapisana w data-attributes – używamy globalnego schematu
    const name = el.dataset.repeater;
    const schema = Object.values(this.schemas).find(s => s.find(f => f.name === name && f.type === 'repeater'));
    if (schema) {
      const field = schema.find(f => f.name === name);
      el.dataset.fields = JSON.stringify(field.fields);
    }
  },

  pickImage(btn) {
    const input = btn.previousElementSibling;
    const url = prompt('Podaj URL obrazka (lub przejdź do Media i skopiuj URL):', input.value);
    if (url !== null) input.value = url;
  },

  pickGalleryImage(btn) {
    const url = prompt('Podaj URL zdjęcia:');
    if (!url) return;
    const container = btn.closest('[data-gallery]').querySelector('.gallery-items');
    const name = btn.closest('[data-gallery]').dataset.gallery;
    const div = document.createElement('div');
    div.className = 'relative group';
    div.innerHTML = `<img src="${url}" class="w-full h-20 object-cover rounded-lg border">
      <button type="button" onclick="this.parentElement.remove()" class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"><i class="fas fa-times"></i></button>
      <input type="hidden" name="${name}[]" value="${this.escape(url)}">`;
    container.appendChild(div);
  },

  escape(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },

  collectData(form) {
    const fd = new FormData(form);
    const data = { title: fd.get('title'), content_json: {} };
    const type = document.getElementById('editSectionType').value;
    const schema = this.schemas[type] || [];
    schema.forEach(field => {
      if (field.type === 'repeater') {
        const items = [];
        const container = form.querySelector(`[data-repeater="${field.name}"] .repeater-items`);
        if (container) {
          container.querySelectorAll('.repeater-item').forEach(item => {
            const obj = {};
            field.fields.forEach(f => {
              const el = item.querySelector(`[name="${f.name}[]"]`);
              obj[f.name] = el ? el.value : '';
            });
            items.push(obj);
          });
        }
        data.content_json[field.name] = items;
      } else if (field.type === 'gallery') {
        const imgs = [];
        form.querySelectorAll(`[name="${field.name}[]"]`).forEach(el => imgs.push(el.value));
        data.content_json[field.name] = imgs;
      } else {
        const el = form.querySelector(`[name="${field.name}"]`);
        if (el) data.content_json[field.name] = el.value;
      }
    });
    return data;
  }
};

window.SectionEditor = SectionEditor;

// Submit handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('editSectionForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editSectionId').value;
      const data = SectionEditor.collectData(form);
      try {
        await api.put('/api/sections/' + id, data);
        UI.toast('Sekcja zapisana');
        UI.modal('editSectionModal', false);
        location.reload();
      } catch (err) {
        UI.toast(err.message, 'error');
      }
    });
  }
});
