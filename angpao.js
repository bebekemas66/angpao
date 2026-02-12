(function () {
  function start() {
    // ====== CONFIG ======
    const ANGPAO_ICON = "https://bebekemas66.github.io/angpao/angpao.png";
    const COIN_ICON   = "https://bebekemas66.github.io/angpao/coin.png";

    const AUDIO_URL = "https://bebekemas66.github.io/angpao/angpao.mp3";
    const AUDIO_VOLUME = 0.35;

    // efek jatuh 35 detik
    const EFFECT_DURATION_MS = 35000;
    const SPAWN_EVERY_MS = 220; // lebih besar = lebih ringan (contoh 260/300)

    // ====== MUSIC (tetap seperti kemarin) ======
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
        if (audio.paused && !userPaused) audio.play().catch(() => {});
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
      "z-index:1000000;padding:14px 16px;font-size:18px;line-height:1;" +
      "border-radius:999px;border:none;cursor:pointer;" +
      "background:rgba(255,193,7,0.9);color:#1a1a1a;" +
      "outline:2px solid rgba(255,255,255,0.55);" +
      "box-shadow:0 8px 18px rgba(0,0,0,.35);" +
      "transition:transform .15s ease, box-shadow .15s ease;";

    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        btn.textContent = "🔊";
        btn.style.background = "rgba(255,193,7,0.9)";
        userPaused = false;
      } else {
        audio.pause();
        btn.textContent = "🔇";
        btn.style.background = "rgba(120,120,120,0.85)";
        userPaused = true;
      }
    });

    // ====== EFFECT LAYER ======
    const layer = document.createElement("div");
    layer.id = "angpao-rain";
    layer.style.cssText =
      "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:999999";
    document.body.appendChild(layer);

    // ====== CSS (ringan: drift pakai CSS) ======
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fall { to { transform: translateY(110vh); opacity: .9; } }
      @keyframes sway {
        0%   { transform: translateX(0px) rotate(0deg); }
        50%  { transform: translateX(var(--dx)) rotate(var(--rot)); }
        100% { transform: translateX(0px) rotate(calc(var(--rot) * -1)); }
      }
      #angpao-rain .fx{
        position:absolute;
        top:-80px;
        left:var(--x);
        width:var(--size);
        opacity:.95;
        animation:
          fall var(--dur) linear forwards,
          sway var(--sway) ease-in-out infinite;
        will-change: transform;
        pointer-events:none;
      }
    `;
    document.head.appendChild(style);

    function spawn() {
      const img = document.createElement("img");
      img.src = Math.random() < 0.6 ? ANGPAO_ICON : COIN_ICON;
      img.className = "fx";

      const size = (Math.random() * 24 + 26).toFixed(0) + "px";  // 26-50
      const x    = (Math.random() * 100).toFixed(2) + "vw";
      const dur  = (Math.random() * 3 + 4).toFixed(2) + "s";     // 4-7
      const sway = (Math.random() * 1.6 + 1.8).toFixed(2) + "s"; // 1.8-3.4
      const dx   = (Math.random() * 50 + 20).toFixed(0) + "px";  // 20-70
      const rot  = (Math.random() * 30 + 10).toFixed(0) + "deg"; // 10-40

      img.style.setProperty("--size", size);
      img.style.setProperty("--x", x);
      img.style.setProperty("--dur", dur);
      img.style.setProperty("--sway", sway);
      img.style.setProperty("--dx", (Math.random() < 0.5 ? "-" : "") + dx);
      img.style.setProperty("--rot", (Math.random() < 0.5 ? "-" : "") + rot);

      img.onerror = () => img.remove();

      layer.appendChild(img);
      const ms = Math.ceil(parseFloat(dur) * 1000) + 500;
      setTimeout(() => img.remove(), ms);
    }

    const timer = setInterval(spawn, SPAWN_EVERY_MS);
    setTimeout(() => clearInterval(timer), EFFECT_DURATION_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
