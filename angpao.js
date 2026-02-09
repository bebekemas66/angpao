(function () {
  function start() {
    // ====== CONFIG ======
    const ANGPAO_ICON = "https://bebekemas66.github.io/angpao/angpao.png";
    const AUDIO_URL = "https://bebekemas66.github.io/angpao/angpao.mp3";

    const AUDIO_VOLUME = 0.35; // saran: 0.25 - 0.4
    const PER_SECOND = 3;      // intensitas angpao jatuh
    const DURATION_MS = 35000;     // 0 = terus. contoh 12000 = 12 detik

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

    // ====== MUSIC ======
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = AUDIO_VOLUME;

    // state: kalau user mute manual, jangan auto resume saat balik tab
    let userPaused = false;

    // Mobile hard-fix: play saat tap pertama
    document.addEventListener(
      "touchstart",
      () => {
        if (audio.paused && !userPaused) {
          audio.play().catch(() => {});
        }
      },
      { once: true }
    );

    // Desktop autoplay + fallback interaksi pertama
    audio.play().catch(() => {
      const resume = () => {
        if (!userPaused) audio.play().catch(() => {});
        window.removeEventListener("click", resume, true);
        window.removeEventListener("touchstart", resume, true);
        window.removeEventListener("keydown", resume, true);
      };
      window.addEventListener("click", resume, true);
      window.addEventListener("touchstart", resume, true);
      window.addEventListener("keydown", resume, true);
    });

    // Pause saat pindah tab, resume saat balik (kalau user tidak mute)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (!audio.paused) audio.pause();
      } else {
        if (!userPaused) audio.play().catch(() => {});
      }
    });

    // ====== Tombol Audio (tengah kanan) ======
    const btn = document.createElement("button");
    btn.textContent = "🔊";
    btn.setAttribute("aria-label", "Toggle music");
    btn.style.cssText =
      "position:fixed;right:16px;top:50%;transform:translateY(-50%);" +
      "z-index:1000000;padding:10px 12px;border-radius:999px;border:none;cursor:pointer;" +
      "background:rgba(0,0,0,.5);color:#fff;backdrop-filter:blur(6px)";

    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        btn.textContent = "🔊";
        userPaused = false;
      } else {
        audio.pause();
        btn.textContent = "🔇";
        userPaused = true;
      }
    });

    // ====== SPAWN ANGPAO ======
    function spawn() {
      const img = document.createElement("img");
      img.src = ANGPAO_ICON;

      // kalau gagal load icon, jangan tampilkan placeholder aneh
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
        // kalau mau musik juga stop saat efek berhenti, uncomment:
        // audio.pause(); btn.textContent = "🔇"; userPaused = true;
      }, DURATION_MS);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
