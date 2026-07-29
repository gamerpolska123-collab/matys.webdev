/**
 * PropertyPanel – Reusable right sidebar properties editor
 * Usage: PropertyPanel.init('#properties', schema, data, { onChange: (key, value) => {} })
 */
const PropertyPanel = {
  container: null,
  handlers: {},
  schema: [],
  data: {},

  init(selector, schema, data, options = {}) {
    this.container = document.querySelector(selector);
    this.schema = schema || [];
    this.data = data || {};
    this.handlers = options;
    this.render();
    return this;
  },

  render() {
    if (!this.container) return;
    if (!this.schema.length) {
      this.container.innerHTML = `<div class="text-center text-gray-500 py-8"><i class="fas fa-mouse-pointer text-2xl mb-2"></i><p class="text-xs">Kliknij sekcję aby edytować</p></div>`;
      return;
    }
    this.container.innerHTML = this.schema.map(field => this.renderField(field)).join('');
    this.bindEvents();
  },

  renderField(field) {
    const v = this.data[field.name] !== undefined ? this.data[field.name] : '';
    let input = '';
    const baseClass = "w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors";
    switch (field.type) {
      case 'text':
        input = `<input type="text" name="${field.name}" value="${this.escape(v)}" class="${baseClass}" placeholder="${field.label}">`;
        break;
      case 'textarea':
        input = `<textarea name="${field.name}" rows="3" class="${baseClass} resize-none" placeholder="${field.label}">${this.escape(v)}</textarea>`;
        break;
      case 'color':
        input = `<div class="flex gap-2"><input type="color" name="${field.name}" value="${v || '#000000'}" class="w-10 h-10 rounded border border-gray-700 cursor-pointer"><input type="text" value="${v}" class="${baseClass} flex-1" readonly></div>`;
        break;
      case 'select':
        input = `<select name="${field.name}" class="${baseClass}">${field.options.map(o => `<option value="${o[0]}" ${v === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('')}</select>`;
        break;
      case 'image':
        input = `<div class="space-y-2"><div class="aspect-video bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden">${v ? `<img src="${v}" class="w-full h-full object-cover">` : '<i class="fas fa-image text-gray-600 text-2xl"></i>'}</div><input type="text" name="${field.name}" value="${this.escape(v)}" class="${baseClass}" placeholder="URL obrazka"></div>`;
        break;
      case 'toggle':
        input = `<label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" name="${field.name}" ${v ? 'checked' : ''} class="w-4 h-4 rounded border-gray-600 text-amber-500 focus:ring-amber-500 bg-gray-800"><span class="text-sm text-gray-300">Włączone</span></label>`;
        break;
      default:
        input = `<input type="text" name="${field.name}" value="${this.escape(v)}" class="${baseClass}">`;
    }
    return `<div class="space-y-1.5"><label class="text-xs font-medium text-gray-500 uppercase tracking-wider">${field.label}</label>${input}</div>`;
  },

  bindEvents() {
    this.container.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('input', () => {
        const name = el.name;
        let value = el.type === 'checkbox' ? el.checked : el.value;
        this.data[name] = value;
        if (this.handlers.onChange) this.handlers.onChange(name, value);
      });
    });
  },

  escape(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },

  setData(schema, data) {
    this.schema = schema;
    this.data = data;
    this.render();
  },

  clear() {
    this.schema = [];
    this.data = {};
    this.render();
  }
};
window.PropertyPanel = PropertyPanel;
