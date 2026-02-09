(function () {
  function start() {
    // ====== CONFIG ======
    const ANGPAO_ICON = "https://bebekemas66.github.io/angpao/angpao.png";
    const AUDIO_URL   = "https://bebekemas66.github.io/angpao/angpao.mp3";

    const AUDIO_VOLUME = 0.25; // 0.0 - 1.0
    const PER_SECOND   = 6;    // jumlah angpao per detik (naikkan kalau mau lebih rame)
    const DURATION_MS  = 0;    // 0 = terus. contoh 12000 = berhenti setelah 12 detik

    // ====== LAYER ANGPAO ======
    const layer = document.createElement("div");
    layer.id = "angpao-rain";
    layer.style.cssText =
      "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:999999";
    document.body.appendChild(layer);

    // ====== CSS KEYFRAMES ======
    const style = document.createElement("style");
    style.textContent =
      "@keyframes fall{to{transform:translateY(110vh) rotate(360deg);opacity:.9}}";
    document.head.appendChild(style);

    // ====== MUSIC (autoplay-safe) ======
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = AUDIO_VOLUME;

    // coba autoplay, kalau diblok -> play saat interaksi pertama user
    audio.play().catch(() => {
      const resume = () => {
        audio.play().catch(() => {});
        window.removeEventListener("click", resume, true);
        window.removeEventListener("touchstart", resume, true);
        window.removeEventListener("keydown", resume, true);
      };
      window.addEventListener("click", resume, true);
      window.addEventListener("touchstart", resume, true);
      window.addEventListener("keydown", resume, true);
    });

    // ====== Tombol Mute/Unmute ======
    const btn = document.createElement("button");
    btn.textContent = "🔊";
    btn.setAttribute("aria-label", "Toggle music");
    btn.style.cssText =
      "position:fixed;right:16px;bottom:16px;z-index:1000000;" +
      "padding:10px 12px;border-radius:999px;border:none;cursor:pointer;" +
      "background:rgba(0,0,0,.5);color:#fff;backdrop-filter:blur(6px)";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        btn.textContent = "🔊";
      } else {
        audio.pause();
        btn.textContent = "🔇";
      }
    });

    // ====== SPAWN ANGPAO ======
    function spawn() {
      const img = document.createElement("img");
      img.src = ANGPAO_ICON;

      // kalau gagal load icon, jangan tampilkan kotak rusak
      img.onerror = () => img.remove();

      img.style.cssText =
        "position:absolute;top:-80px;opacity:.95;" +
        "width:" + (Math.random() * 30 + 30) + "px;" +
        "left:" + (Math.random() * 100) + "vw;" +
        "animation:fall " + (Math.random() * 3 + 4) + "s linear forwards;";

      layer.appendChild(img);
      setTimeout(() => img.remove(), 8000);
    }

    // ====== RUN ======
    const gap = Math.max(60, Math.floor(1000 / PER_SECOND));
    const timer = setInterval(spawn, gap);

    if (DURATION_MS > 0) {
      setTimeout(() => {
        clearInterval(timer);
        // kalau mau musik ikut stop saat efek berhenti, buka komentar ini:
        // audio.pause();
      }, DURATION_MS);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
