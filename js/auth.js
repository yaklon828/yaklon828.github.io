/* auth.js */
document.addEventListener('DOMContentLoaded', () => {
  console.log("auth.js 已載入，DOM Ready");

  const btnLineLogin = document.getElementById('btnLineLogin');
  if (btnLineLogin) {
    console.log("找到 LINE 登入按鈕");

    btnLineLogin.addEventListener('click', () => {
      console.log("LINE 登入按鈕被點擊");

      // 使用你在 index.html 裡設定的 Channel ID
      const channelId = window.CONFIG.LINE_CHANNEL_ID; // 2008785557
      const redirectUri = encodeURIComponent('https://yaklon828.github.io/callback.html');
      const state = 'jiubird-' + Date.now(); // 防止 CSRF 或追蹤來源

      // LINE Login 授權網址
      const lineLoginUrl = 
        `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${channelId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`;

      console.log("跳轉至 LINE 授權頁:", lineLoginUrl);
      window.location.href = lineLoginUrl;
    });
  } else {
    console.warn("找不到 LINE 登入按鈕 (#btnLineLogin)");
  }
});

