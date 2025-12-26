/* auth.js */
document.addEventListener('DOMContentLoaded', () => {
  console.log("auth.js 已載入，DOM Ready");

  const btnLineLogin = document.getElementById('btnLineLogin');
  if (!btnLineLogin) {
    console.error("找不到 LINE 登入按鈕 (#btnLineLogin)");
    return;
  }

  console.log("找到 LINE 登入按鈕");

  btnLineLogin.addEventListener('click', () => {
    console.log("LINE 登入按鈕被點擊");

    // 從 index.html 的全域設定取出 Channel ID
    const channelId = window.CONFIG.LINE_CHANNEL_ID; 
    console.log("使用的 Channel ID:", channelId);

    // Callback URL 必須和 LINE Developers 後台完全一致
    const redirectUriRaw = 'https://yaklon828.github.io/callback.html';
    const redirectUri = encodeURIComponent(redirectUriRaw);
    console.log("使用的 Callback URL:", redirectUriRaw);

    // state 用來防止 CSRF
    const state = 'jiubird-' + Date.now();

    // 組合 LINE Login 授權網址
    const lineLoginUrl =
      `https://access.line.me/oauth2/v2.1/authorize?response_type=code` +
      `&client_id=${channelId}` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}` +
      `&scope=profile%20openid`;

    console.log("跳轉至 LINE 授權頁:", lineLoginUrl);

    // 跳轉
    window.location.href = lineLoginUrl;
  });
});
