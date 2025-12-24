/* profile.js */
import { setText, setSrc, show } from './utils.js';
import { getCurrentMemberId } from './auth.js';

function iconByCode(code, rank) {
  const map = { emperor: '👑', queen: '👑', duke: '🛡️', minister: '📜', consort: '💎', noble: '🌸', maid: '🪷' };
  if (map[code]) return map[code];
  if (rank === '皇帝' || rank === '皇后') return '👑';
  return '⭐';
}

function enterEffect(text) {
  const el = document.createElement('div');
  el.textContent = text;
  Object.assign(el.style, {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    background: '#000', color: '#ffd700', padding: '12px 16px',
    borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: '9999'
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

document.addEventListener('auth:logged', async (ev) => {
  const { name, rank, spend, avatarURL, iconCode } = ev.detail;
  show('profile');
  setText('name', name || getCurrentMemberId());
  setText('rank', rank);
  setText('spend', spend || 0);
  setSrc('avatar', avatarURL || '');
  document.getElementById('icon').textContent = iconByCode(iconCode, rank);

  if (rank === '皇帝') enterEffect('皇上駕到！');
  if (rank === '皇后') enterEffect('皇后娘娘登場！');

  show('chatter');
  document.dispatchEvent(new CustomEvent('feed:reload'));
});