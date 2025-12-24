/* utils.js */
export function apiGet(params = {}) {
  const url = new URL(window.CONFIG.API_BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return fetch(url).then(r => r.json());
}

export function apiPost(payload = {}) {
  return fetch(window.CONFIG.API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: window.CONFIG.TOKEN, ...payload })
  }).then(r => r.json());
}

export function escapeHTML(str = '') {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

export function setSrc(id, url) {
  const el = document.getElementById(id);
  if (el) el.src = url;
}

export function show(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
}

export function hide(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}