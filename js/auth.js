/* auth.js */
import { apiGet, apiPost } from './utils.js';

let currentMemberId = null;
export function getCurrentMemberId() { return currentMemberId; }
export function setCurrentMemberId(id) { currentMemberId = id; }

document.addEventListener('DOMContentLoaded', () => {
  const btnLogin = document.getElementById('btnLogin');
  const btnGoogleRegister = document.getElementById('btnGoogleRegister');
  const btnEmailRegister = document.getElementById('btnEmailRegister');

  if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
      const memberId = document.getElementById('memberId')?.value.trim();
      if (!memberId) { alert('請輸入會員ID'); return; }
      const res = await apiGet({ action: 'profile', memberId });
      if (!res.found) { alert('查無會員'); return; }
      setCurrentMemberId(memberId);
      document.dispatchEvent(new CustomEvent('auth:logged', { detail: res }));
    });
  }

  if (btnGoogleRegister) {
    btnGoogleRegister.addEventListener('click', () => {
      google.accounts.id.initialize({
        client_id: window.CONFIG.GOOGLE_CLIENT_ID,
        callback: async (response) => {
          const data = jwt_decode(response.credential);
          const memberId = data.sub;
          const name = data.name;
          const avatarURL = data.picture;
          const result = await apiPost({
            action: 'registerMember',
            memberId, name, gender: '男', avatarURL, provider: 'google'
          });
          if (result.ok) alert('Google 註冊成功，請登入');
          else alert('註冊失敗：' + result.error);
        }
      });
      google.accounts.id.prompt();
    });
  }

  if (btnEmailRegister) {
    btnEmailRegister.addEventListener('click', async () => {
      const email = document.getElementById('regEmail')?.value.trim();
      const password = document.getElementById('regPassword')?.value.trim();
      if (!email || (password?.length || 0) < 7) { alert('請輸入有效 Email，密碼至少7字'); return; }
      const result = await apiPost({
        action: 'registerMember',
        memberId: email,
        name: email.split('@')[0],
        gender: '男',
        avatarURL: '',
        provider: 'email',
        password
      });
      if (result.ok) alert('Email 註冊成功，請登入');
      else alert('註冊失敗：' + result.error);
    });
  }
});