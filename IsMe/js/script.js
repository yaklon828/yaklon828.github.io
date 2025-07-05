
// 分類切換
const categoryButtons = document.querySelectorAll(".category");
const projectCards = document.querySelectorAll(".project-card");

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-type");

    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    projectCards.forEach(card => {
      const cardType = card.getAttribute("data-type");
      if (type === "all" || cardType === type) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// 粒子背景 (簡版)
const canvas = document.getElementById("bg-particles");
const ctx = canvas.getContext("2d");
canvas.style.position = "fixed";
canvas.style.zIndex = "0";
canvas.style.top = 0;
canvas.style.left = 0;

let w, h, particles;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

function initParticles() {
  particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      dx: Math.random() - 0.5,
      dy: Math.random() - 0.5,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "gold";
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > w) p.dx *= -1;
    if (p.y < 0 || p.y > h) p.dy *= -1;
  });
}

initParticles();
setInterval(drawParticles, 30);