const API_BASE = 'https://script.google.com/macros/s/AKfycbwUH8ZThEojOldo8LabZrBWXTYITYyeLJzaHnHxBLJ1v1Kg3bVyRSivAdG6uWLKXo1E/exec';
const TOKEN = 'YOUR_SECRET_TOKEN';

document.getElementById('btnLogin').addEventListener('click', async () => {
  const memberId = document.getElementById('memberId').value.trim();
  const res = await fetch(`${API_BASE}?action=profile&memberId=${encodeURIComponent(memberId)}`);
  const data = await res.json();
  if (!data.found) { alert('查無會員'); return; }

  document.getElementById('profile').style.display = 'block';
  document.getElementById('name').textContent = data.name || memberId;
  document.getElementById('rank').textContent = data.rank;
  document.getElementById('spend').textContent = data.spend || 0;
  document.getElementById('avatar').src = data.avatarURL || '';
  document.getElementById('icon').textContent = iconByCode(data.iconCode, data.rank);

  if (data.rank === '皇帝') enterEffect('皇上駕到！');
  if (data.rank === '皇后') enterEffect('皇后娘娘登場！');

  loadFeed();
  window.__memberId = memberId;
});

function iconByCode(code, rank) {
  const map = { emperor: '👑', queen: '👑', duke: '🛡️', minister: '📜', consort: '💎', noble: '🌸', maid: '🪷' };
  if (map[code]) return map[code];
  if (rank === '皇帝' || rank === '皇后') return '👑';
  return '⭐';
}

function enterEffect(text){
  const el = document.createElement('div');
  el.textContent = text;
  el.style.position = 'fixed';
  el.style.top = '20px';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.background = '#000';
  el.style.color = '#ffd700';
  el.style.padding = '12px 16px';
  el.style.borderRadius = '8px';
  el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
  el.style.zIndex = '9999';
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 2000);
}

document.getElementById('post').addEventListener('click', async () => {
  const content = document.getElementById('content').value.trim();
  if (!content) return;
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ action:'postChatter', token:TOKEN, memberId: window.__memberId, content })
  });
  const data = await res.json();
  if (data.ok) { document.getElementById('content').value=''; loadFeed(); }
});

async function loadFeed(){
  const res = await fetch(`${API_BASE}?action=feed`);
  const data = await res.json();
  const container = document.getElementById('feed');
  container.innerHTML = '';
  data.rows.reverse().forEach(row => {
    const card = document.createElement('div');
    card.className = 'post';
    card.innerHTML = `
      <div><strong>${row.memberId}</strong>：${escapeHTML(row.content)}</div>
      ${row.editedBy ? `<div style="color:#c00;">御筆：${row.editedBy} 勾掉「${escapeHTML(row.editedDiff||'')}」</div>` : ''}
      <button class="strike">御筆勾字</button>
    `;
    card.querySelector('.strike').addEventListener('click', () => strikePrompt(row.postId));
    container.appendChild(card);
  });
}

function escapeHTML(str=''){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function strikePrompt(postId){
  const start = Number(prompt('開始位置（0為第一個字）'));
  const end   = Number(prompt('結束位置（不含該位置）'));
  if (isNaN(start) || isNaN(end)) return;
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ action:'strikeText', token:TOKEN, postId, editorId: window.__memberId, removeIndices:[start,end] })
  });
  const data = await res.json();
  if (data.ok) loadFeed();
}