/**
 * Mobile Preview Toggle
 * Użycie: MobilePreview.init('#preview-frame', '#toggle-btn')
 */
const MobilePreview = {
  init(frameSelector, btnSelector) {
    const frame = document.querySelector(frameSelector);
    const btn = document.querySelector(btnSelector);
    if (!frame || !btn) return;
    let mobile = false;
    btn.addEventListener('click', () => {
      mobile = !mobile;
      frame.style.width = mobile ? '375px' : '100%';
      frame.style.margin = mobile ? '0 auto' : '0';
      btn.innerHTML = mobile
        ? '<i class="fas fa-desktop"></i> Desktop'
        : '<i class="fas fa-mobile-alt"></i> Mobile';
      btn.classList.toggle('bg-blue-600', mobile);
      btn.classList.toggle('bg-gray-600', !mobile);
    });
  }
};
window.MobilePreview = MobilePreview;
