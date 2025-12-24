/* feed.js */
import { apiGet, apiPost, escapeHTML } from './utils.js';
import { getCurrentMemberId } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const btnPost = document.getElementById('post');
  if (btnPost) {
    btnPost.addEventListener('click', async () => {
      const contentEl = document.getElementById('content');
      const content = contentEl?.value.trim();
      if (!content) { alert('請輸入內容'); return; }

      const res = await apiPost({
        action: 'postChatter',
        memberId: getCurrentMemberId(),
        content
      });

      if (res.ok) {
        contentEl.value = '';
        document.dispatchEvent(new CustomEvent('feed:reload'));
      } else {
        alert('發布失敗：' + res.error);
      }
    });
  }
});

document.addEventListener('feed:reload', async () => {
  const feedEl = document.getElementById('feed');
  const marqueeEl = document.getElementById('marquee-strip');
  if (!feedEl) return;

  const res = await apiGet({ action: 'feed' });
  feedEl.innerHTML = '';

  res.rows.slice().reverse().forEach(row => {
    const card = document.createElement('div');
    card.className = 'post';
    card.innerHTML = `
      <div><strong>${escapeHTML(row.memberId)}</strong>：${escapeHTML(row.content)}</div>
      ${row.editedBy ? `<div class="edit-note">御筆：${escapeHTML(row.editedBy)} 勾掉「${escapeHTML(row.editedDiff || '')}」</div>` : ''}
      <button class="strike">御筆勾字</button>
    `;

    card.querySelector('.strike').addEventListener('click', async () => {
      const start = Number(prompt('開始位置（0為第一個字）'));
      const end = Number(prompt('結束位置（不含該位置）'));
      if (isNaN(start) || isNaN(end)) return;

      const r = await apiPost({
        action: 'strikeText',
        postId: row.postId,
        editorId: getCurrentMemberId(),
        removeIndices: [start, end]
      });

      if (r.ok) {
        document.dispatchEvent(new CustomEvent('feed:reload'));
      } else {
        alert('御筆勾字失敗：' + r.error);
      }
    });

    feedEl.appendChild(card);
  });

  // 更新跑馬燈內容
  if (marqueeEl) {
    marqueeEl.innerHTML = res.rows.map(r => `<span class="marquee-item">${escapeHTML(r.content)}</span>`).join('');
  }
});