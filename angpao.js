(function () {
  function start() {
    const layer = document.createElement("div");
    layer.style.cssText =
      "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:999999";
    document.body.appendChild(layer);

    const style = document.createElement("style");
    style.textContent =
      "@keyframes fall{to{transform:translateY(110vh) rotate(360deg);opacity:.9}}";
    document.head.appendChild(style);

    const ANGPAO_ICON = "https://i.imgur.com/8PJuI5p.png";

    function spawn() {
      const img = document.createElement("img");
      img.src = ANGPAO_ICON;
      img.style.cssText =
        "position:absolute;top:-80px;opacity:.95;" +
        "width:" + (Math.random() * 30 + 30) + "px;" +
        "left:" + (Math.random() * 100) + "vw;" +
        "animation:fall " + (Math.random() * 3 + 4) + "s linear forwards;";
      layer.appendChild(img);
      setTimeout(() => img.remove(), 8000);
    }

    let i = 0;
    const t = setInterval(() => {
      spawn();
      if (++i > 40) clearInterval(t);
    }, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
