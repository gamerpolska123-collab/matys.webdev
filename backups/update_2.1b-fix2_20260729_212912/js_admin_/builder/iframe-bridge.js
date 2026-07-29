/**
 * IframeBridge – Reusable postMessage wrapper for iframe↔parent communication
 * Usage in PARENT: IframeBridge.init('#preview', { onSelect: (id) => {...} })
 * Usage in IFRAME: IframeBridgeChild.init({ selectors: ['[data-section-id]'] })
 */

// PARENT side
const IframeBridge = {
  iframe: null,
  handlers: {},
  init(iframeSelector, options = {}) {
    this.iframe = document.querySelector(iframeSelector);
    this.handlers = options;
    window.addEventListener('message', (e) => {
      if (e.source !== this.iframe?.contentWindow) return;
      const { type, payload } = e.data || {};
      if (type && this.handlers[type]) {
        this.handlers[type](payload);
      }
    });
    return this;
  },
  send(type, payload) {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage({ type, payload }, '*');
    }
  },
  reload() {
    if (this.iframe) this.iframe.src = this.iframe.src;
  }
};
window.IframeBridge = IframeBridge;
