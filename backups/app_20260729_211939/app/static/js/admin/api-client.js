/**
 * CMS API Client – reusable fetch wrapper
 * Użycie: api.get('/api/pages').then(r => r.json())
 */
const api = {
  base: '',
  async request(method, url, body = null, headers = {}) {
    const opts = { method, headers: { 'Content-Type': 'application/json', ...headers }, credentials: 'same-origin' };
    if (body && typeof body === 'object') opts.body = JSON.stringify(body);
    const res = await fetch(this.base + url, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Błąd sieci' }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res;
  },
  get(url)  { return this.request('GET', url); },
  post(url, body) { return this.request('POST', url, body); },
  put(url, body)  { return this.request('PUT', url, body); },
  del(url)  { return this.request('DELETE', url); }
};
window.api = api;
