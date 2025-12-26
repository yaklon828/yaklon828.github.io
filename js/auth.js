/* auth.js */
document.addEventListener('DOMContentLoaded', () => {
  const btnLineLogin = document.getElementById('btnLineLogin');

  if (btnLineLogin) {
    btnLineLogin.addEventListener('click', () => {
      const channelId = window.CONFIG.LINE_CHANNEL_ID;
      const redirectUri = encodeURIComponent('https://yaklon828.github.io/callback.html');
      const state = 'jiubird-' + Date.now(); // 可用來防止 CSRF 或追蹤來源

      const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`;

      window.location.href = lineLoginUrl;
    });
  }
});
