(function () {
  function start() {
    // ================= CONFIG =================
    const ANGPAO_ICON = "https://bebekemas66.github.io/angpao/angpao.png";
    const COIN_ICON   = "https://bebekemas66.github.io/angpao/coin.png";

    const AUDIO_URL   = "https://bebekemas66.github.io/angpao/angpao.mp3";
    const AUDIO_VOLUME = 0.35;

    const EFFECT_DURATION_MS = 35000; // durasi efek jatuh
    const SPAWN_EVERY_MS = 240;       // lebih besar = lebih ringan

    // ================= MUSIC =================
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = AUDIO_VOLUME;

    let userPaused = false;

    // Mobile: play saat tap pertama
    document.addEventListener("touchstart", () => {
      if (audio.paused && !userPaused) audio.play().catch(() => {});
    }, { once: true });

    // Autoplay attempt + fallback interaksi pertama
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

    // Pause saat tab hidden, resume saat balik (kecuali user mute)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (!audio.paused) audio.pause();
      } else {
        if (!userPaused) audio.play().catch(() => {});
      }
    });

    // ================= BUTTON (mute/unmute) =================
    if (!document.getElementById("gm-audio-btn")) {
      const btn = document.createElement("button");
      btn.id = "gm-audio-btn";
      btn.textContent = "🔊";
      btn.setAttribute("aria-label", "Toggle music");
      btn.style.cssText =
        "position:fixed;right:14px;top:50%;transform:translateY(-50%);" +
        "z-index:2147483647;" +
        "padding:8px 10px;font-size:14px;line-height:1;" +
        "border-radius:999px;border:none;cursor:pointer;" +
        "background:rgba(255,193,7,0.92);color:#1a1a1a;" +
        "outline:2px solid rgba(255,255,255,0.55);" +
        "box-shadow:0 6px 14px rgba(0,0,0,.35)";
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
    }

    // ================= RAIN EFFECT (angpao + coin) =================
    const layerId = "gm-rain-layer";
    let layer = document.getElementById(layerId);
    if (!layer) {
      layer = document.createElement("div");
      layer.id = layerId;
      layer.style.cssText =
        "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:2147483646";
      document.body.appendChild(layer);
    }

    if (!document.getElementById("gm-rain-style")) {
      const style = document.createElement("style");
      style.id = "gm-rain-style";
      style.textContent = `
        @keyframes fallTop {
          from { top:-80px; opacity:.95; }
          to   { top:110vh; opacity:.9; }
        }
        @keyframes sway {
          0% { transform:translateX(0) rotate(0deg); }
          50% { transform:translateX(var(--dx)) rotate(var(--rot)); }
          100% { transform:translateX(0) rotate(calc(var(--rot)*-1)); }
        }
        #${layerId} .fx{
          position:absolute;
          left:var(--x);
          top:-80px;
          width:var(--size);
          animation:
            fallTop var(--dur) linear forwards,
            sway var(--sway) ease-in-out infinite;
          will-change:top,transform;
          pointer-events:none;
        }
      `;
      document.head.appendChild(style);
    }

    function spawn() {
      const img = document.createElement("img");
      img.className = "fx";
      img.src = Math.random() < 0.6 ? ANGPAO_ICON : COIN_ICON;

      img.style.setProperty("--size", (Math.random() * 22 + 24).toFixed(0) + "px"); // 24-46
      img.style.setProperty("--x", (Math.random() * 100).toFixed(2) + "vw");
      img.style.setProperty("--dur", (Math.random() * 2.8 + 4.2).toFixed(2) + "s");  // 4.2-7.0
      img.style.setProperty("--sway", (Math.random() * 1.4 + 2.0).toFixed(2) + "s"); // 2.0-3.4
      img.style.setProperty("--dx", (Math.random() < 0.5 ? "-" : "") + (Math.random() * 40 + 18).toFixed(0) + "px");
      img.style.setProperty("--rot", (Math.random() < 0.5 ? "-" : "") + (Math.random() * 26 + 10).toFixed(0) + "deg");

      img.onerror = () => img.remove();
      layer.appendChild(img);

      setTimeout(() => img.remove(), 8000);
    }

    const rainTimer = setInterval(spawn, SPAWN_EVERY_MS);
    setTimeout(() => clearInterval(rainTimer), EFFECT_DURATION_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
