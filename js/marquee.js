/* marquee.js */
import { apiGet, apiPost } from './utils.js';
import { getCurrentMemberId } from './auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  const marqueeStrip = document.getElementById('marquee-strip');
  const chatterBox = document.getElementById('chatter');
  const contentInput = document.getElementById('content');
  const postButton = document.getElementById('post');

  // 顯示所有碎碎念（訪客可看）
  async function loadMarquee() {
    const res = await apiGet({ action: 'getChatter' });
    const messages = res.items || [];
    marqueeStrip.innerText = messages.map(m => m.text).join(' ｜ ');
  }

  // 監聽登入事件 → 顯示留言框
  document.addEventListener('auth:logged', (e) => {
    chatterBox.style.display = 'block'; // 登入後顯示留言輸入區
  });

  // 發布碎碎念（只有登入後才可用）
  if (postButton && contentInput) {
    postButton.addEventListener('click', async () => {
      const memberId = getCurrentMemberId();
      if (!memberId) {
        alert('請先用 LINE 登入才能留言');
        return;
      }

      const lines = contentInput.value.trim().split('\n').filter(l => l);
      const validLines = lines.map(l => l.slice(0, 40)).slice(0, 3); // 最多三則，每則最多40字

      for (const line of validLines) {
        await apiPost({ action: 'postChatter', memberId, text: line });
      }

      contentInput.value = '';
      await loadMarquee();
    });
  }

  // 初始載入跑馬燈
  await loadMarquee();
});
