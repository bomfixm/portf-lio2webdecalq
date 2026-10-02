/**
 * Decalq Web Dev — botão flutuante "Voltar ao portfólio".
 *
 * Widget autocontido para ser instalado nos sites que desenvolvemos. Sem
 * dependências, isolado em Shadow DOM (o CSS do site anfitrião não o afeta e
 * ele não afeta o site).
 *
 * Instalação (uma linha, antes de </body>):
 *   <script defer src="https://SEU-PORTFOLIO/embed/back-to-portfolio.js"></script>
 *
 * Opções via data-attributes no próprio <script>:
 *   data-portfolio="https://seu-portfolio.com"  URL do portfólio (fallback)
 *   data-position="left|right"                  canto (padrão: left)
 *   data-label="Voltar ao portfólio"            texto
 *   data-always="true"                          mostra mesmo sem vir do portfólio
 *
 * Comportamento de retorno:
 *   veio do portfólio  -> history.back() (volta à posição exata do scroll)
 *   entrou direto      -> navega para <portfolio>/projetos/
 */
(function () {
  "use strict";

  // Dentro de um iframe (ex.: preview embutido no próprio portfólio) não faz sentido.
  if (window.top !== window.self) return;

  var script =
    document.currentScript ||
    document.querySelector('script[src*="back-to-portfolio"]');
  var data = (script && script.dataset) || {};

  var PORTFOLIO = (
    data.portfolio || "https://portf-lio-decalqwebdev.vercel.app"
  ).replace(/\/$/, "");
  var TARGET = PORTFOLIO + "/projetos/";
  var LABEL = data.label || "Voltar ao portfólio";
  var SIDE = data.position === "right" ? "right" : "left";
  var KEY = "decalq:from-portfolio";

  /* --------------------------------------------------------------------
     De onde o visitante veio
     -------------------------------------------------------------------- */
  var params = new URLSearchParams(window.location.search);
  var cameByParam = params.get("from") === "decalq";
  var cameByReferrer = false;
  try {
    cameByReferrer =
      !!document.referrer &&
      new URL(document.referrer).host === new URL(PORTFOLIO).host;
  } catch (e) {
    cameByReferrer = false;
  }

  var stored = false;
  try {
    stored = sessionStorage.getItem(KEY) === "1";
  } catch (e) {
    /* sessionStorage indisponível (modo privado): seguimos sem persistir */
  }

  var fromPortfolio = cameByParam || cameByReferrer || stored;

  // Persiste para o botão sobreviver à navegação interna do site visitado.
  if (fromPortfolio && !stored) {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch (e) {}
  }

  // Limpa o ?from=decalq da barra de endereços sem recarregar nem criar histórico.
  if (cameByParam && window.history.replaceState) {
    params.delete("from");
    var q = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + (q ? "?" + q : "") + window.location.hash,
    );
  }

  if (!fromPortfolio && data.always !== "true") return;

  /* --------------------------------------------------------------------
     Marcação + estilo (Shadow DOM)
     -------------------------------------------------------------------- */
  var host = document.createElement("div");
  host.id = "decalq-back";
  host.setAttribute("data-decalq", "back-to-portfolio");
  var root = host.attachShadow({ mode: "open" });

  root.innerHTML = [
    "<style>",
    ":host{all:initial}",
    ".wrap{position:fixed;bottom:20px;" +
      SIDE +
      ":20px;z-index:2147483000;font-family:ui-monospace,SFMono-Regular,'JetBrains Mono',Menlo,monospace}",
    /* pill: vidro escuro neutro — legível sobre sites claros, escuros ou coloridos */
    ".btn{position:relative;display:inline-flex;align-items:center;gap:9px;" +
      "padding:10px 16px 10px 13px;border-radius:999px;cursor:pointer;" +
      "border:1px solid rgba(255,255,255,.16);" +
      "background:linear-gradient(180deg,rgba(17,28,50,.82),rgba(10,18,35,.86));" +
      "-webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%);" +
      "box-shadow:0 6px 24px -8px rgba(0,0,0,.55),0 0 0 1px rgba(110,168,255,.10),inset 0 1px 0 rgba(255,255,255,.07);" +
      "color:#f3f6fc;font-size:11px;font-weight:600;letter-spacing:.11em;text-transform:uppercase;" +
      "text-decoration:none;line-height:1;isolation:isolate;-webkit-tap-highlight-color:transparent;" +
      "opacity:0;transform:translateY(10px);" +
      "transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1)," +
      "border-color .25s ease,box-shadow .35s ease}",
    ".wrap.in .btn{opacity:1;transform:translateY(0)}",
    /* luz local seguindo o ponteiro */
    ".btn::after{content:'';position:absolute;inset:0;border-radius:inherit;z-index:-1;pointer-events:none;" +
      "background:radial-gradient(90px circle at var(--mx,50%) var(--my,50%),rgba(110,168,255,.22),transparent 70%);" +
      "opacity:0;transition:opacity .25s ease}",
    ".mark{width:18px;height:18px;flex:0 0 auto;display:block;" +
      "filter:drop-shadow(0 0 6px rgba(110,168,255,.45))}",
    ".arrow{width:14px;height:14px;flex:0 0 auto;color:#6ea8ff;" +
      "transition:transform .3s cubic-bezier(.16,1,.3,1)}",
    ".label{white-space:nowrap}",
    ".short{display:none}",
    /* interações só com mouse */
    "@media (hover:hover) and (pointer:fine){",
    ".btn:hover{border-color:rgba(110,168,255,.45);" +
      "box-shadow:0 10px 30px -10px rgba(0,0,0,.6),0 0 24px -8px rgba(110,168,255,.45),inset 0 1px 0 rgba(255,255,255,.1)}",
    ".btn:hover::after{opacity:1}",
    ".btn:hover .arrow{transform:translateX(-3px)}",
    "}",
    /* toque: só feedback de pressão */
    ".btn:active{transform:translateY(0) scale(.97);transition-duration:.08s}",
    ".btn:focus-visible{outline:2px solid #6ea8ff;outline-offset:3px}",
    "@media (max-width:420px){",
    ".wrap{bottom:14px;" + SIDE + ":14px}",
    ".btn{padding:9px 13px 9px 11px;font-size:10px;gap:7px}",
    ".full{display:none}.short{display:inline}",
    "}",
    "@media (prefers-reduced-motion:reduce){",
    ".btn{transition:none;opacity:1;transform:none}",
    ".btn .arrow{transition:none}",
    "}",
    "</style>",
    '<div class="wrap"><a class="btn" href="' +
      TARGET +
      '" aria-label="' +
      LABEL +
      '">',
    /* seta */
    '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
    /* marca (mesma silhueta da logo: janela + cursor), em gradiente azul */
    '<svg class="mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">',
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
    '<stop offset="0" stop-color="#a3c8ff"/><stop offset="1" stop-color="#3d86f0"/>',
    "</linearGradient></defs>",
    '<rect x="2.5" y="4" width="15" height="12.5" rx="2.6" stroke="url(#g)" stroke-width="2"/>',
    '<path d="M2.5 8h15" stroke="url(#g)" stroke-width="1.6"/>',
    '<path d="m14 12 7.2 3.4-3 .9 2.2 3-2 1.4-2-3.1-2.4 2z" fill="url(#g)"/>',
    "</svg>",
    '<span class="label"><span class="full">' +
      LABEL +
      '</span><span class="short">Portfólio</span></span>',
    "</a></div>",
  ].join("");

  var wrap = root.querySelector(".wrap");
  var btn = root.querySelector(".btn");

  /* --------------------------------------------------------------------
     Voltar: histórico real quando possível
     -------------------------------------------------------------------- */
  btn.addEventListener("click", function (event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return; // deixa "abrir em nova aba" funcionar
    var canGoBack = (cameByParam || cameByReferrer) && window.history.length > 1;
    if (!canGoBack) return; // segue o href (fallback para /projetos/)
    event.preventDefault();
    window.history.back();
    // Se o back não acontecer (histórico substituído), usa o fallback.
    var t = setTimeout(function () {
      window.location.href = TARGET;
    }, 600);
    window.addEventListener(
      "pagehide",
      function () {
        clearTimeout(t);
      },
      { once: true },
    );
  });

  /* --------------------------------------------------------------------
     Magnetic + luz: só em dispositivos com mouse e sem reduced motion
     -------------------------------------------------------------------- */
  var fine =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var calm =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (fine && !calm) {
    var raf = 0;
    var cur = { x: 0, y: 0 };
    var goal = { x: 0, y: 0 };
    var MAX = 5; // deslocamento máximo, em px

    var tick = function () {
      cur.x += (goal.x - cur.x) * 0.16;
      cur.y += (goal.y - cur.y) * 0.16;
      btn.style.transform =
        "translate3d(" + cur.x + "px," + (cur.y - 1) + "px,0)";
      if (Math.abs(goal.x - cur.x) > 0.1 || Math.abs(goal.y - cur.y) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        if (!goal.x && !goal.y) btn.style.transform = "";
      }
    };
    var start = function () {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    btn.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = btn.getBoundingClientRect();
      btn.style.setProperty("--mx", e.clientX - r.left + "px");
      btn.style.setProperty("--my", e.clientY - r.top + "px");
      goal.x = Math.max(-MAX, Math.min(MAX, (e.clientX - (r.left + r.width / 2)) * 0.22));
      goal.y = Math.max(-MAX, Math.min(MAX, (e.clientY - (r.top + r.height / 2)) * 0.22));
      start();
    });
    btn.addEventListener("pointerleave", function () {
      goal.x = 0;
      goal.y = 0;
      start();
    });
  }

  /* --------------------------------------------------------------------
     Entrada discreta
     -------------------------------------------------------------------- */
  function mount() {
    document.body.appendChild(host);
    requestAnimationFrame(function () {
      setTimeout(function () {
        wrap.classList.add("in");
      }, calm ? 0 : 500);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
