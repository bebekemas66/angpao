(function () {
  function start() {
    // ================= CONFIG =================
    const ANGPAO_ICON = "https://bebekemas66.github.io/angpao/angpao.png";
    const COIN_ICON   = "https://bebekemas66.github.io/angpao/coin.png";
    const DRAGON_IMG  = "https://bebekemas66.github.io/angpao/dragon.png";
    const AUDIO_URL   = "https://bebekemas66.github.io/angpao/angpao.mp3";

    const AUDIO_VOLUME = 0.35;
    const EFFECT_DURATION_MS = 35000;
    const SPAWN_EVERY_MS = 240;

    // ================= MUSIC =================
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = AUDIO_VOLUME;

    let userPaused = false;

    // Mobile hard-fix: play saat tap pertama
    document.addEventListener(
      "touchstart",
      () => {
        if (audio.paused && !userPaused) audio.play().catch(() => {});
      },
      { once: true }
    );

    // Autoplay attempt + fallback to first interaction
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

    // Pause when tab hidden, resume when back (unless user muted)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (!audio.paused) audio.pause();
      } else {
        if (!userPaused) audio.play().catch(() => {});
      }
    });

    // ================= BUTTON (mute/unmute - tengah kanan) =================
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

      const ms = 8000;
      setTimeout(() => img.remove(), ms);
    }

    const rainTimer = setInterval(spawn, SPAWN_EVERY_MS);
    setTimeout(() => clearInterval(rainTimer), EFFECT_DURATION_MS);

    // ================= DRAGON TRAIL (PNG) =================
    (function dragonTrail() {
      if (document.getElementById("gm-dragon-trail")) return;

      const dragonStyle = document.createElement("style");
      dragonStyle.textContent = `
        #gm-dragon-trail{
          position:fixed;
          left:-40vw;
          width:60vw;
          max-width:900px;
          pointer-events:none;
          z-index:2147483640;
          opacity:0;
          will-change:transform,opacity;
          mix-blend-mode:screen;
          filter: drop-shadow(0 0 10px rgba(255,180,0,.18));
        }
        @keyframes gmDragonPass {
          0%   { opacity:0;   transform:translateX(0) rotate(-5deg); }
          10%  { opacity:0.40; }
          50%  { opacity:0.25; }
          90%  { opacity:0.40; }
          100% { opacity:0;   transform:translateX(140vw) rotate(-5deg); }
        }
      `;
      document.head.appendChild(dragonStyle);

      const img = document.createElement("img");
      img.id = "gm-dragon-trail";
      img.src = DRAGON_IMG;
      img.alt = "";
      document.body.appendChild(img);

      function runOnce() {
        img.style.top = (Math.floor(Math.random() * 30) + 5) + "%"; // 5-35%
        const dur = (Math.random() * 1.2 + 2.2).toFixed(2); // 2.2-3.4s
        img.style.animation = "none";
        void img.offsetHeight;
        img.style.animation = `gmDragonPass ${dur}s ease-in-out forwards`;
      }

      setTimeout(runOnce, 6000);
      setInterval(() => { if (Math.random() < 0.85) runOnce(); }, 22000);
    })();

    // ================= FIREWORKS on LOGIN SUCCESS (AJAX, no redirect) =================
    (function loginFireworks() {
      const ONCE_KEY = "gm_login_fireworks_done_v1";
      if (sessionStorage.getItem(ONCE_KEY) === "1") return;

      function loadConfetti(cb) {
        if (window.confetti) return cb();
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
        s.async = true;
        s.onload = cb;
        document.head.appendChild(s);
      }

      function boom() {
        if (!window.confetti) return;
        sessionStorage.setItem(ONCE_KEY, "1");

        const duration = 2200;
        const end = Date.now() + duration;

        (function frame() {
          window.confetti({
            particleCount: 10,
            startVelocity: 34,
            spread: 70,
            ticks: 190,
            origin: { x: Math.random() * 0.6 + 0.2, y: 0.7 },
          });
          window.confetti({
            particleCount: 8,
            startVelocity: 28,
            spread: 60,
            ticks: 170,
            origin: { x: Math.random() * 0.6 + 0.2, y: 0.45 },
          });

          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      }

      // Heuristic: ada "logout/keluar" dan tidak ada "masuk/login"
      // Kalau UI kamu beda, edit keyword ini
      const LOGOUT_KEYWORDS = ["logout", "keluar", "log out", "sign out"];
      const LOGIN_KEYWORDS  = ["masuk", "login", "sign in"];

      function pageText() {
        return (document.body?.innerText || "").toLowerCase();
      }
      function isLoggedInHeuristic() {
        const t = pageText();
        const hasLogout = LOGOUT_KEYWORDS.some(k => t.includes(k));
        const hasLogin  = LOGIN_KEYWORDS.some(k => t.includes(k));
        return hasLogout && !hasLogin;
      }

      let fired = false;
      const obs = new MutationObserver(() => {
        if (fired) return;
        if (isLoggedInHeuristic()) {
          fired = true;
          obs.disconnect();
          loadConfetti(boom);
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

      // fallback polling 10 detik pertama
      const startAt = Date.now();
      const poll = setInterval(() => {
        if (fired) return clearInterval(poll);
        if (Date.now() - startAt > 10000) return clearInterval(poll);
        if (isLoggedInHeuristic()) {
          fired = true;
          obs.disconnect();
          clearInterval(poll);
          loadConfetti(boom);
        }
      }, 500);
    })();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
