/* auth.js */
document.addEventListener('DOMContentLoaded', () => {
  console.log("auth.js 已載入，DOM Ready");

  // ===== 首頁登入按鈕 =====
  const btnLineLogin = document.getElementById('btnLineLogin');
  if (btnLineLogin) {
    btnLineLogin.addEventListener('click', () => {
      const channelId = window.CONFIG.LINE_CHANNEL_ID;
      const redirectUriRaw = 'https://yaklon828.github.io/callback.html';
      const redirectUri = encodeURIComponent(redirectUriRaw);
      const state = 'jiubird-' + Date.now();

      const lineLoginUrl =
        `https://access.line.me/oauth2/v2.1/authorize?response_type=code` +
        `&client_id=${channelId}` +
        `&redirect_uri=${redirectUri}` +
        `&state=${state}` +
        `&scope=profile%20openid`;

      console.log("跳轉至 LINE 授權頁:", lineLoginUrl);
      window.location.href = lineLoginUrl;
    });
  }

  // ===== Callback 頁面處理 =====
  if (window.location.pathname.endsWith("callback.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      console.error("未收到 LINE 授權 code");
      return;
    }

    console.log("收到授權 code:", code);

    fetch(window.CONFIG.API_BASE, {
      method: "POST",
      body: JSON.stringify({ code })
    })
    .then(res => res.json())
    .then(data => {
      console.log("LINE profile 回傳：", data);

      if (data.ok) {
        // 暫存使用者資訊
        window.USER = { id: data.userId, name: data.name, picture: data.picture };

        // 顯示登入成功訊息 + 頭像
        const profileBox = document.createElement("div");
        profileBox.innerHTML = `
          <div style="text-align:center; margin:20px;">
            <img src="${data.picture || ''}" alt="頭像" style="width:80px; border-radius:50%;">
            <p>歡迎 ${data.name} (${data.userId})</p>
          </div>
        `;
        document.body.insertBefore(profileBox, document.getElementById("chatter"));

        // 顯示碎碎念區
        document.getElementById("chatter").style.display = "block";
      } else {
        alert("登入失敗：" + (data.error || "未知錯誤"));
      }
    })
    .catch(err => {
      console.error("交換失敗：", err);
      alert("交換 LINE profile 失敗：" + String(err));
    });
  }

  // ===== 碎碎念送出 =====
  const postBtn = document.getElementById("post");
  if (postBtn) {
    postBtn.addEventListener("click", () => {
      const content = document.getElementById("content").value.trim();
      if (!content) {
        alert("請輸入碎碎念內容");
        return;
      }

      const lines = content.split("\n").map(l => l.trim()).filter(l => l);

      lines.forEach(line => {
        fetch(window.CONFIG.API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lineId: window.USER?.id || "匿名",
            name: window.USER?.name || "未命名",
            gender: "其他",
            amount: 0,
            chatter: line
          })
        })
        .then(res => res.json())
        .then(data => {
          console.log("碎碎念回傳：", data);
        })
        .catch(err => {
          console.error("碎碎念送出失敗：", err);
        });
      });

      alert("碎碎念已送出！");
      document.getElementById("content").value = "";
    });
  }
});
