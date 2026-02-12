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

    document.addEventListener("touchstart", () => {
      if (audio.paused && !userPaused) audio.play().catch(()=>{});
    }, { once:true });

    audio.play().catch(() => {
      const resume = () => {
        if (!userPaused) audio.play().catch(()=>{});
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
        if (!userPaused) audio.play().catch(()=>{});
      }
    });

    // ================= BUTTON =================
    const btn = document.createElement("button");
    btn.textContent = "🔊";
    btn.style.cssText =
      "position:fixed;right:14px;top:50%;transform:translateY(-50%);" +
      "z-index:2147483647;padding:8px 10px;font-size:14px;" +
      "border-radius:999px;border:none;cursor:pointer;" +
      "background:rgba(255,193,7,0.92);color:#1a1a1a;" +
      "outline:2px solid rgba(255,255,255,0.55);" +
      "box-shadow:0 6px 14px rgba(0,0,0,.35)";
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(()=>{});
        btn.textContent="🔊";
        btn.style.background="rgba(255,193,7,0.92)";
        userPaused=false;
      } else {
        audio.pause();
        btn.textContent="🔇";
        btn.style.background="rgba(120,120,120,0.85)";
        userPaused=true;
      }
    });

    // ================= RAIN EFFECT =================
    const layer = document.createElement("div");
    layer.style.cssText =
      "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:2147483646";
    document.body.appendChild(layer);

    const style = document.createElement("style");
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
      .fx{
        position:absolute;
        left:var(--x);
        top:-80px;
        width:var(--size);
        animation:
          fallTop var(--dur) linear forwards,
          sway var(--sway) ease-in-out infinite;
        will-change:top,transform;
      }
    `;
    document.head.appendChild(style);

    function spawn() {
      const img = document.createElement("img");
      img.className="fx";
      img.src = Math.random()<0.6 ? ANGPAO_ICON : COIN_ICON;

      img.style.setProperty("--size",(Math.random()*22+24)+"px");
      img.style.setProperty("--x",(Math.random()*100)+"vw");
      img.style.setProperty("--dur",(Math.random()*2.8+4.2)+"s");
      img.style.setProperty("--sway",(Math.random()*1.4+2)+"s");
      img.style.setProperty("--dx",(Math.random()<0.5?"-":"")+(Math.random()*40+18)+"px");
      img.style.setProperty("--rot",(Math.random()<0.5?"-":"")+(Math.random()*26+10)+"deg");

      layer.appendChild(img);
      setTimeout(()=>img.remove(),7000);
    }

    const rainTimer = setInterval(spawn, SPAWN_EVERY_MS);
    setTimeout(()=>clearInterval(rainTimer), EFFECT_DURATION_MS);

    // ================= DRAGON TRAIL =================
    (function(){
      const dragon = document.createElement("img");
      dragon.src = DRAGON_IMG;
      dragon.style.cssText =
        "position:fixed;left:-40vw;width:60vw;max-width:900px;" +
        "z-index:2147483640;pointer-events:none;opacity:0;" +
        "mix-blend-mode:screen;filter:drop-shadow(0 0 10px rgba(255,180,0,.2))";
      document.body.appendChild(dragon);

      const dragonStyle = document.createElement("style");
      dragonStyle.textContent=`
        @keyframes gmDragonPass{
          0%{opacity:0;transform:translateX(0) rotate(-5deg)}
          10%{opacity:.4}
          50%{opacity:.25}
          90%{opacity:.4}
          100%{opacity:0;transform:translateX(140vw) rotate(-5deg)}
        }`;
      document.head.appendChild(dragonStyle);

      function run(){
        dragon.style.top=(Math.random()*30+5)+"%";
        dragon.style.animation="none";
        void dragon.offsetHeight;
        dragon.style.animation="gmDragonPass 3s ease-in-out forwards";
      }

      setTimeout(run,6000);
      setInterval(()=>{if(Math.random()<0.85)run();},22000);
    })();

    // ================= LUCKY AURA =================
    (function(){
      const aura=document.createElement("div");
      aura.style.cssText=
        "position:fixed;inset:0;pointer-events:none;" +
        "z-index:2147483635;" +
        "background:" +
        "radial-gradient(circle at 50% 0%, rgba(255,0,0,.18), transparent 55%)," +
        "radial-gradient(circle at 50% 40%, rgba(255,190,0,.12), transparent 65%);" +
        "animation:gmAuraPulse 10s ease-in-out infinite alternate";
      document.body.appendChild(aura);

      const auraStyle=document.createElement("style");
      auraStyle.textContent=`
        @keyframes gmAuraPulse{
          0%{opacity:.8}
          100%{opacity:1}
        }`;
      document.head.appendChild(auraStyle);
    })();

  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",start);
  }else{
    start();
  }
})();
