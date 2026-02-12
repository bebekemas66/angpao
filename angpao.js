(function () {
  function start() {
    // ====== CONFIG ======
    const ANGPAO_ICON = "https://bebekemas66.github.io/angpao/angpao.png";
    const COIN_ICON   = "https://bebekemas66.github.io/angpao/coin.png";

    const AUDIO_URL = "https://bebekemas66.github.io/angpao/angpao.mp3";
    const AUDIO_VOLUME = 0.35;

    const EFFECT_DURATION_MS = 35000;
    const SPAWN_EVERY_MS = 240; // lebih besar = lebih ringan

    // ====== MUSIC ======
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = AUDIO_VOLUME;

    let userPaused = false;

    document.addEventListener("touchstart", () => {
      if (audio.paused && !userPaused) audio.play().catch(() => {});
    }, { once: true });

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

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (!audio.paused) audio.pause();
      } else {
        if (!userPaused) audio.play().catch(() => {});
      }
    });

    // ====== BUTTON (lebih kecil) ======
    const btn = document.createElement("button");
    btn.textContent = "🔊";
    btn.setAttribute("aria-label", "Toggle music");
    btn.style.cssText =
      "position:fixed;right:14px;top:50%;transform:translateY(-50%);" +
      "z-index:2147483647;" +
      "padding:10px 12px;font-size:16px;line-height:1;" +
      "border-radius:999px;border:none;cursor:pointer;" +
      "background:rgba(255,193,7,0.92);color:#1a1a1a;" +
      "outline:2px solid rgba(255,255,255,0.55);" +
      "box-shadow:0 8px 18px rgba(0,0,0,.35)";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        btn.textContent = "🔊";
        btn.style.background = "rgba(255,193,7,0.92)";
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
      "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:2147483646";
    document.body.appendChild(layer);

    // ====== CSS (anti-conflict: fall pakai TOP, drift pakai TRANSFORM) ======
    const fxStyle = document.createElement("style");
    fxStyle.textContent = `
      @keyframes fallTop {
        from { top:-80px; opacity:.95; }
        to   { top:110vh; opacity:.9; }
      }
      @keyframes sway {
        0%   { transform: translateX(0px) rotate(0deg); }
        50%  { transform: translateX(var(--dx)) rotate(var(--rot)); }
        100% { transform: translateX(0px) rotate(calc(var(--rot) * -1)); }
      }
      #angpao-rain .fx {
        position:absolute;
        left: var(--x);
        top: -80px;
        width: var(--size);
        animation:
          fallTop var(--dur) linear forwards,
          sway var(--sway) ease-in-out infinite;
        will-change: top, transform;
        pointer-events:none;
      }
    `;
    document.head.appendChild(fxStyle);

    function spawn() {
      const img = document.createElement("img");
      img.className = "fx";
      img.src = Math.random() < 0.6 ? ANGPAO_ICON : COIN_ICON;

      const size = (Math.random() * 22 + 24).toFixed(0) + "px";
      const x    = (Math.random() * 100).toFixed(2) + "vw";
      const dur  = (Math.random() * 2.8 + 4.2).toFixed(2) + "s";
      const sway = (Math.random() * 1.4 + 2.0).toFixed(2) + "s";
      const dx   = (Math.random() * 40 + 18).toFixed(0) + "px";
      const rot  = (Math.random() * 26 + 10).toFixed(0) + "deg";

      img.style.setProperty("--size", size);
      img.style.setProperty("--x", x);
      img.style.setProperty("--dur", dur);
      img.style.setProperty("--sway", sway);
      img.style.setProperty("--dx", (Math.random() < 0.5 ? "-" : "") + dx);
      img.style.setProperty("--rot", (Math.random() < 0.5 ? "-" : "") + rot);

      img.onerror = () => img.remove();

      layer.appendChild(img);

      const ms = Math.ceil(parseFloat(dur) * 1000) + 700;
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
