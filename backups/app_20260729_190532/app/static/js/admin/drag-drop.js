/**
 * Reusable Drag & Drop Sortable
 * Użycie: Sortable.init('#list', { onSort: (ids) => {...} })
 */
const Sortable = {
  init(selector, options = {}) {
    const container = document.querySelector(selector);
    if (!container) return;
    let dragged = null;
    container.querySelectorAll('[draggable="true"]').forEach(el => {
      el.addEventListener('dragstart', e => {
        dragged = el;
        el.classList.add('opacity-50');
        e.dataTransfer.effectAllowed = 'move';
      });
      el.addEventListener('dragend', () => {
        el.classList.remove('opacity-50');
        dragged = null;
        if (options.onSort) {
          const ids = Array.from(container.children).map(c => c.dataset.id).filter(Boolean);
          options.onSort(ids);
        }
      });
      el.addEventListener('dragover', e => {
        e.preventDefault();
        if (!dragged || dragged === el) return;
        const rect = el.getBoundingClientRect();
        const after = e.clientY > rect.top + rect.height / 2;
        container.insertBefore(dragged, after ? el.nextSibling : el);
      });
    });
  }
};
window.Sortable = Sortable;
