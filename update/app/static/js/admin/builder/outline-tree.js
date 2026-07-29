/**
 * OutlineTree – Reusable left sidebar section tree (dark theme)
 */
const OutlineTree = {
  container: null,
  handlers: {},
  activeId: null,

  init(selector, sections, options = {}) {
    this.container = document.querySelector(selector);
    this.handlers = options;
    this.render(sections);
    return this;
  },

  render(sections) {
    if (!this.container) return;
    this.container.innerHTML = sections.map((s, i) => `
      <div class="outline-item group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm
        ${this.activeId === s.id ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}"
        data-id="${s.id}" draggable="true">
        <i class="fas fa-grip-vertical text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab text-[10px]"></i>
        <span class="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">${i + 1}</span>
        <span class="flex-1 truncate">${s.title || s.section_type}</span>
        <i class="fas fa-eye${s.is_visible ? '' : '-slash'} text-[10px] ${s.is_visible ? 'text-emerald-400' : 'text-slate-600'}"></i>
      </div>
    `).join('');

    this.container.querySelectorAll('.outline-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.id);
        this.setActive(id);
        if (this.handlers.onSelect) this.handlers.onSelect(id);
      });
    });

    let dragged = null;
    this.container.querySelectorAll('.outline-item').forEach(el => {
      el.addEventListener('dragstart', e => {
        dragged = el;
        el.classList.add('opacity-50');
      });
      el.addEventListener('dragend', () => {
        el.classList.remove('opacity-50');
        dragged = null;
        const ids = Array.from(this.container.children).map(c => parseInt(c.dataset.id));
        if (this.handlers.onReorder) this.handlers.onReorder(ids);
      });
      el.addEventListener('dragover', e => {
        e.preventDefault();
        if (!dragged || dragged === el) return;
        const rect = el.getBoundingClientRect();
        const after = e.clientY > rect.top + rect.height / 2;
        this.container.insertBefore(dragged, after ? el.nextSibling : el);
      });
    });
  },

  setActive(id) {
    this.activeId = id;
    this.container.querySelectorAll('.outline-item').forEach(el => {
      const isActive = parseInt(el.dataset.id) === id;
      el.className = `outline-item group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm
        ${isActive ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`;
    });
  },

  updateVisibility(id, visible) {
    const el = this.container.querySelector(`[data-id="${id}"]`);
    if (el) {
      const icon = el.querySelector('.fa-eye, .fa-eye-slash');
      if (icon) {
        icon.className = `fas fa-eye${visible ? '' : '-slash'} text-[10px] ${visible ? 'text-emerald-400' : 'text-slate-600'}`;
      }
    }
  }
};
window.OutlineTree = OutlineTree;
