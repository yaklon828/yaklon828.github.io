document.addEventListener('DOMContentLoaded', () => {
  // API 設定
  const API_BASE = 'https://script.google.com/macros/s/AKfycbwUH8ZThEojOldo8LabZrBWXTYITYyeLJzaHnHxBLJ1v1Kg3bVyRSivAdG6uWLKXo1E/exec';
  const TOKEN = '740828';

  // 登入事件
  const btnLogin = document.getElementById('btnLogin');
  if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
      const memberIdEl = document.getElementById('memberId');
      const memberId = memberIdEl ? memberIdEl.value.trim() : '';
      if (!memberId) { alert('請輸入會員ID'); return; }

      try {
        const res = await fetch(`${API_BASE}?action=profile&memberId=${encodeURIComponent(memberId)}`);
        const data = await res.json();

        if (!data.found) { alert('查無會員'); return; }

        // 顯示會員資料
        document.getElementById('profile').style.display = 'block';
        document.getElementById('name').textContent = data.name || memberId;
        document.getElementById('rank').textContent = data.rank;
        document.getElementById('spend').textContent = data.spend || 0;
        document.getElementById('avatar').src = data.avatarURL || '';
        document.getElementById('icon').textContent = iconByCode(data.iconCode, data.rank);

        // 特效提示
        if (data.rank === '皇帝') enterEffect('皇上駕到！');
        if (data.rank === '皇后') enterEffect('皇后娘娘登場！');

        // 載入留言牆
        window.__memberId = memberId;
        loadFeed();
      } catch (err) {
        console.error(err);
        alert('登入失敗，請稍後再試');
      }
    });
  }

  // 發布留言
  const btnPost = document.getElementById('post');
  if (btnPost) {
    btnPost.addEventListener('click', async () => {
      const contentEl = document.getElementById('content');
      const content = contentEl ? contentEl.value.trim() : '';
      if (!content) { alert('請輸入內容'); return; }

      try {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'postChatter',
            token: TOKEN,
            memberId: window.__memberId,
            content
          })
        });
        const data = await res.json();
        if (data.ok) {
          contentEl.value = '';
          loadFeed();
        } else {
          alert('發布失敗');
        }
      } catch (err) {
        console.error(err);
        alert('系統錯誤，請稍後再試');
      }
    });
  }

  // 載入留言牆
  async function loadFeed() {
    try {
      const res = await fetch(`${API_BASE}?action=feed`);
      const data = await res.json();
      const container = document.getElementById('feed');
      container.innerHTML = '';

      data.rows.reverse().forEach(row => {
        const card = document.createElement('div');
        card.className = 'post';
        card.innerHTML = `
          <div><strong>${row.memberId}</strong>：${escapeHTML(row.content)}</div>
          ${row.editedBy ? `<div style="color:#c00;">御筆：${row.editedBy} 勾掉「${escapeHTML(row.editedDiff || '')}」</div>` : ''}
          <button class="strike">御筆勾字</button>
        `;
        card.querySelector('.strike').addEventListener('click', () => strikePrompt(row.postId));
        container.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      alert('留言牆載入失敗');
    }
  }

  // 身份圖示
  function iconByCode(code, rank) {
    const map = {
      emperor: '👑',
      queen: '👑',
      duke: '🛡️',
      minister: '📜',
      consort: '💎',
      noble: '🌸',
      maid: '🪷'
    };
    if (map[code]) return map[code];
    if (rank === '皇帝' || rank === '皇后') return '👑';
    return '⭐';
  }

  // 登場特效
  function enterEffect(text) {
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
    setTimeout(() => el.remove(), 2000);
  }

  // HTML 安全處理
  function escapeHTML(str = '') {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 御筆勾字
  async function strikePrompt(postId) {
    const start = Number(prompt('開始位置（0為第一個字）'));
    const end = Number(prompt('結束位置（不含該位置）'));
    if (isNaN(start) || isNaN(end)) return;

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'strikeText',
          token: TOKEN,
          postId,
          editorId: window.__memberId,
          removeIndices: [start, end]
        })
      });
      const data = await res.json();
      if (data.ok) loadFeed();
      else alert('御筆勾字失敗');
    } catch (err) {
      console.error(err);
      alert('系統錯誤，請稍後再試');
    }
  }
});
