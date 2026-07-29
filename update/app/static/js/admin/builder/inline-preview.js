/**
 * InlinePreview – Render sections directly in builder canvas
 * v2.1b-fix: better error handling, empty state support
 */
const InlinePreview = {
  container: null,
  sections: [],
  handlers: {},
  activeId: null,
  draggedId: null,

  init(selector, sections, options = {}) {
    this.container = document.querySelector(selector);
    this.handlers = options;
    this.sections = sections || [];
    this.render();
    return this;
  },

  render() {
    if (!this.container) {
      console.error('[InlinePreview] Nie znaleziono kontenera');
      return;
    }
    if (!this.sections.length) {
      console.log('[InlinePreview] Brak sekcji do renderowania');
      return;
    }
    this.container.innerHTML = this.sections.map(s => this.renderSection(s)).join('');
    this.attachEvents();
    console.log('[InlinePreview] Wyrenderowano', this.sections.length, 'sekcji');
  },

  renderSection(section) {
    const data = section.content_json || {};
    const type = section.section_type;
    const isVisible = section.is_visible !== false;
    const wrapperClass = `builder-canvas-section relative group border-2 transition-all cursor-pointer ${this.activeId === section.id ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-transparent hover:border-amber-400'} ${!isVisible ? 'opacity-50' : ''}`;

    const toolbar = `
      <div class="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span class="bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">${type}</span>
        <button data-action="edit" data-id="${section.id}" class="w-7 h-7 bg-slate-800 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors" title="Edytuj"><i class="fas fa-cog text-xs"></i></button>
        <button data-action="move" data-id="${section.id}" class="w-7 h-7 bg-slate-800 text-white rounded flex items-center justify-center hover:bg-slate-600 cursor-grab transition-colors" title="Przenieś" draggable="true"><i class="fas fa-arrows-alt text-xs"></i></button>
        <button data-action="delete" data-id="${section.id}" class="w-7 h-7 bg-slate-800 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors" title="Usuń"><i class="fas fa-trash text-xs"></i></button>
      </div>
    `;

    let html = '';
    switch (type) {
      case 'hero':
        html = `<section class="${wrapperClass} relative min-h-[500px] flex items-center justify-center bg-cover bg-center" style="background-image: url('${data.background_image || ''}')" data-section-id="${section.id}">${toolbar}<div class="absolute inset-0" style="background-color: ${data.overlay_color || 'rgba(0,0,0,0.5)'}" data-builder-bg></div><div class="relative z-10 text-center px-4 max-w-4xl mx-auto"><h1 data-editable="heading" class="text-4xl md:text-6xl font-bold text-white mb-4 outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.heading || 'Nagłówek'}</h1><p data-editable="subheading" class="text-lg md:text-xl text-gray-200 mb-8 outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.subheading || 'Podtytuł'}</p>${data.button_text ? `<a href="${data.button_url || '#'}" class="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors pointer-events-none">${data.button_text}</a>` : ''}</div></section>`;
        break;
      case 'about':
        html = `<section class="${wrapperClass} py-16 md:py-24 bg-white" data-section-id="${section.id}">${toolbar}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid md:grid-cols-2 gap-12 items-center"><div class="${data.image_position === 'left' ? 'md:order-2' : 'md:order-1'}"><h2 data-editable="heading" class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.heading || 'O nas'}</h2><div data-editable="content" class="prose text-gray-600 leading-relaxed outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.content || 'Opis firmy...'}</div></div><div class="${data.image_position === 'left' ? 'md:order-1' : 'md:order-2'}">${data.image ? `<img src="${data.image}" class="rounded-2xl shadow-lg w-full object-cover h-80">` : '<div class="bg-gray-100 rounded-2xl h-80 flex items-center justify-center text-gray-400"><i class="fas fa-image text-4xl"></i></div>'}</div></div></div></section>`;
        break;
      case 'services': {
        const items = data.items || [{icon:'fa-tools',title:'Usługa 1',desc:'Opis'}];
        html = `<section class="${wrapperClass} py-16 md:py-24 bg-gray-50" data-section-id="${section.id}">${toolbar}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 data-editable="heading" class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 outline-none focus:ring-2 focus:ring-amber-400 rounded px-2 inline-block" contenteditable="false">${data.heading || 'Nasze usługi'}</h2><div class="w-16 h-1 bg-amber-500 mx-auto rounded"></div></div><div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">${items.map(item => `<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100"><div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xl mb-4"><i class="fas ${item.icon || 'fa-tools'}"></i></div><h3 class="text-lg font-bold text-gray-900 mb-2">${item.title || 'Usługa'}</h3><p class="text-gray-600 text-sm">${item.desc || ''}</p></div>`).join('')}</div></div></section>`;
        break; }
      case 'gallery': {
        const imgs = data.images || [];
        html = `<section class="${wrapperClass} py-16 md:py-24 bg-white" data-section-id="${section.id}">${toolbar}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 data-editable="heading" class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 outline-none focus:ring-2 focus:ring-amber-400 rounded px-2 inline-block" contenteditable="false">${data.heading || 'Galeria'}</h2><div class="w-16 h-1 bg-amber-500 mx-auto rounded"></div></div><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">${imgs.map(img => `<div class="aspect-square rounded-xl overflow-hidden"><img src="${img}" class="w-full h-full object-cover"></div>`).join('')}</div></div></section>`;
        break; }
      case 'contact':
        html = `<section class="${wrapperClass} py-16 md:py-24 bg-gray-900 text-white" data-section-id="${section.id}">${toolbar}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid md:grid-cols-2 gap-12"><div><h2 data-editable="heading" class="text-3xl md:text-4xl font-bold mb-6 outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.heading || 'Skontaktuj się z nami'}</h2><p class="text-gray-300 mb-8">Jesteśmy do Twojej dyspozycji.</p><div class="space-y-4">${data.phone ? `<div class="flex items-center gap-4"><div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center"><i class="fas fa-phone"></i></div><div><p class="text-xs text-gray-400">Telefon</p><p data-editable="phone" class="font-medium outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.phone}</p></div></div>` : ''}${data.email ? `<div class="flex items-center gap-4"><div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center"><i class="fas fa-envelope"></i></div><div><p class="text-xs text-gray-400">Email</p><p data-editable="email" class="font-medium outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.email}</p></div></div>` : ''}${data.address ? `<div class="flex items-center gap-4"><div class="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center"><i class="fas fa-map-marker-alt"></i></div><div><p class="text-xs text-gray-400">Adres</p><p data-editable="address" class="font-medium outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.address}</p></div></div>` : ''}</div></div><div class="bg-white/10 rounded-2xl p-8 backdrop-blur"><p class="text-gray-300 text-center">Formularz kontaktowy</p></div></div></div></section>`;
        break;
      case 'cta':
        html = `<section class="${wrapperClass} relative py-20 md:py-28 bg-cover bg-center" style="background-image: url('${data.background_image || ''}')" data-section-id="${section.id}">${toolbar}<div class="absolute inset-0 bg-gray-900/70"></div><div class="relative z-10 max-w-4xl mx-auto px-4 text-center"><h2 data-editable="heading" class="text-3xl md:text-5xl font-bold text-white mb-6 outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.heading || 'Zacznijmy współpracę!'}</h2>${data.button_text ? `<a href="${data.button_url || '#'}" class="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors pointer-events-none">${data.button_text}</a>` : ''}</div></section>`;
        break;
      case 'text':
        html = `<section class="${wrapperClass} py-16 md:py-24 bg-white" data-section-id="${section.id}">${toolbar}<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">${data.heading ? `<h2 data-editable="heading" class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.heading}</h2>` : ''}<div data-editable="content" class="prose prose-lg text-gray-600 mx-auto outline-none focus:ring-2 focus:ring-amber-400 rounded px-2" contenteditable="false">${data.content || 'Treść...'}</div></div></section>`;
        break;
      case 'features': {
        const fitems = data.items || [{icon:'fa-star',value:'100',label:'Zadowolonych klientów'}];
        html = `<section class="${wrapperClass} py-16 md:py-24 bg-amber-50" data-section-id="${section.id}">${toolbar}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="text-center mb-12"><h2 data-editable="heading" class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 outline-none focus:ring-2 focus:ring-amber-400 rounded px-2 inline-block" contenteditable="false">${data.heading || 'Dlaczego my?'}</h2><div class="w-16 h-1 bg-amber-500 mx-auto rounded"></div></div><div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">${fitems.map(item => `<div class="text-center"><div class="w-16 h-16 bg-white text-amber-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm"><i class="fas ${item.icon || 'fa-star'}"></i></div><div class="text-3xl font-bold text-gray-900 mb-1">${item.value || '0'}</div><div class="text-gray-600 text-sm">${item.label || ''}</div></div>`).join('')}</div></div></section>`;
        break; }
      default:
        html = `<section class="${wrapperClass} p-8 bg-gray-100" data-section-id="${section.id}">${toolbar}<p class="text-gray-500">Nieznany typ: ${type}</p></section>`;
    }
    return html;
  },

  attachEvents() {
    if (!this.container) return;

    this.container.querySelectorAll('[data-section-id]').forEach(sec => {
      sec.addEventListener('click', (e) => {
        if (e.target.closest('[data-editable]') || e.target.closest('[data-action]')) return;
        const id = parseInt(sec.dataset.sectionId);
        this.select(id);
      });
    });

    this.container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id);
        if (action === 'edit') {
          this.select(id);
          if (this.handlers.onEdit) this.handlers.onEdit(id);
        } else if (action === 'delete') {
          if (this.handlers.onDelete) this.handlers.onDelete(id);
        }
      });
    });

    // DnD
    this.container.querySelectorAll('[data-action="move"]').forEach(btn => {
      btn.addEventListener('dragstart', (e) => {
        this.draggedId = parseInt(btn.dataset.id);
        btn.closest('[data-section-id]').classList.add('opacity-50');
        e.dataTransfer.effectAllowed = 'move';
      });
      btn.addEventListener('dragend', (e) => {
        btn.closest('[data-section-id]').classList.remove('opacity-50');
        this.draggedId = null;
      });
    });

    this.container.querySelectorAll('[data-section-id]').forEach(sec => {
      sec.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!this.draggedId || parseInt(sec.dataset.sectionId) === this.draggedId) return;
        const rect = sec.getBoundingClientRect();
        const after = e.clientY > rect.top + rect.height / 2;
        const draggedEl = this.container.querySelector(`[data-section-id="${this.draggedId}"]`);
        if (draggedEl) {
          this.container.insertBefore(draggedEl, after ? sec.nextSibling : sec);
        }
      });
      sec.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!this.draggedId) return;
        const newOrder = Array.from(this.container.children).map(el => parseInt(el.dataset.sectionId)).filter(Boolean);
        if (this.handlers.onReorder) this.handlers.onReorder(newOrder);
      });
    });

    // Inline editing
    this.container.querySelectorAll('[data-editable]').forEach(el => {
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.enableEdit(el);
      });
      el.addEventListener('blur', () => this.disableEdit(el));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && el.tagName !== 'TEXTAREA' && !el.dataset.multiline) {
          e.preventDefault();
          el.blur();
        }
      });
    });
  },

  enableEdit(el) {
    el.contentEditable = 'true';
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  },

  disableEdit(el) {
    el.contentEditable = 'false';
    const sectionId = parseInt(el.closest('[data-section-id]').dataset.sectionId);
    const key = el.dataset.editable;
    const value = el.innerHTML;
    if (this.handlers.onFieldChange) {
      this.handlers.onFieldChange(sectionId, key, value);
    }
  },

  select(id) {
    this.activeId = id;
    this.container.querySelectorAll('[data-section-id]').forEach(sec => {
      const isActive = parseInt(sec.dataset.sectionId) === id;
      sec.classList.toggle('border-amber-500', isActive);
      sec.classList.toggle('ring-2', isActive);
      sec.classList.toggle('ring-amber-500/20', isActive);
      sec.classList.toggle('border-transparent', !isActive);
    });
    if (this.handlers.onSelect) this.handlers.onSelect(id);
  },

  updateSection(id, key, value) {
    const sec = this.container.querySelector(`[data-section-id="${id}"]`);
    if (!sec) return;
    const el = sec.querySelector(`[data-editable="${key}"]`);
    if (el && el.innerHTML !== value) el.innerHTML = value;
    if (key === 'background_image') sec.style.backgroundImage = value ? `url('${value}')` : '';
    if (key === 'overlay_color') {
      const overlay = sec.querySelector('[data-builder-bg]');
      if (overlay) overlay.style.backgroundColor = value;
    }
  },

  addSection(section) {
    this.sections.push(section);
    const div = document.createElement('div');
    div.innerHTML = this.renderSection(section);
    this.container.appendChild(div.firstElementChild);
    this.attachEvents();
    this.select(section.id);
  },

  removeSection(id) {
    const sec = this.container.querySelector(`[data-section-id="${id}"]`);
    if (sec) sec.remove();
    this.sections = this.sections.filter(s => s.id !== id);
    if (this.activeId === id) {
      this.activeId = null;
      if (this.handlers.onSelect) this.handlers.onSelect(null);
    }
  },

  refresh(sections) {
    this.sections = sections;
    this.render();
  }
};
window.InlinePreview = InlinePreview;
