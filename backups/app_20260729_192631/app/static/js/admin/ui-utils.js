/**
 * UI Utils – reusable toast, modal, confirm
 */
const UI = {
  toast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white text-sm z-[100] transition-opacity duration-300 ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2500);
  },
  confirm(msg) { return window.confirm(msg); },
  modal(id, show = true) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('hidden', !show);
    el.classList.toggle('flex', show);
  }
};
window.UI = UI;
