/**
 * Page Builder – szkielet v1.1
 * Zarządza listą sekcji, drag & drop, preview toggle
 */
document.addEventListener('DOMContentLoaded', () => {
  const sectionList = document.getElementById('builder-sections');
  if (!sectionList) return;

  // Inicjalizacja DnD
  Sortable.init('#builder-sections', {
    onSort: async (ids) => {
      try {
        await api.post('/api/homepage/sections/reorder', { order: ids });
        UI.toast('Kolejność zapisana');
      } catch (e) {
        UI.toast(e.message, 'error');
      }
    }
  });

  // Toggle widoczności sekcji
  document.querySelectorAll('.toggle-visibility').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      try {
        await api.post(`/api/homepage/sections/${id}/toggle`);
        btn.classList.toggle('text-green-600');
        btn.classList.toggle('text-gray-400');
        UI.toast('Widoczność zmieniona');
      } catch (e) {
        UI.toast(e.message, 'error');
      }
    });
  });
});
