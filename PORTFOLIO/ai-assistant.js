/*
 * Portfolio AI assistant: self-contained chat widget, themed to match
 * the portfolio (navy background, amber accent, Bricolage Grotesque + Figtree).
 * Usage: <script src="ai-assistant.js" defer></script>  (after script.js)
 */
(() => {
  const cfg = Object.assign(
    {
      endpoint: "/.netlify/functions/chat",
      ownerName: "Mohamed",
      email: "mohamedazzul16@gmail.com",
      greeting:
        "Hi! I can tell you about Mohamed's projects, skills and experience. What would you like to know?",
      chips: ["What are his skills?", "Show his projects", "Work experience", "How can I contact him?"],
    },
    window.PORTFOLIO_AI || {}
  );

  // Colours and fonts copied from style.css so the widget looks native.
  const theme = Object.assign(
    {
      accent: "#f5b841",
      onAccent: "#0c1822",
      bg: "#14283a",
      ink: "#e9eff4",
      muted: "#93a8b9",
      line: "#26425a",
      bot: "#0c1822",
      body: '"Figtree", system-ui, -apple-system, "Segoe UI", sans-serif',
      display: '"Bricolage Grotesque", system-ui, sans-serif',
    },
    cfg.theme || {}
  );

  /* ---------- Offline fallback (used only if the AI server can't be reached) ---------- */
  const FALLBACK = [
    {
      keys: ["skill", "tech", "stack", "react", "python", "mysql", "tamil", "english", "speak"],
      a: "Frontend: HTML5, CSS3, JavaScript, React.js, jQuery, Bootstrap.\nBackend and database: Python, MySQL, REST API integration.\nAlso WordPress, Git, GitHub and VS Code. He speaks English and Tamil.",
    },
    {
      keys: ["project", "built", "portfolio", "techmart", "inventory", "guess", "demo", "xplore", "microsoft", "real estate", "realestate", "travel"],
      a: "Projects:\n• TechMart: e-commerce storefront with login, 24 products and a working cart. Live demo: https://techmart-project.netlify.app and code: https://github.com/Md-azzul/Techmart_project\n• XploreEase: a travel booking website for flights, hotels and tour packages, with login, OTP and payment flow. Demo: https://xploreease.netlify.app and code: https://github.com/Md-azzul/XploreEase\n• Inventory Management System: React.js, Redux and MySQL, with a real-time dashboard, charts and low-stock alerts.\n• Guess: a responsive e-commerce website with client-side validation.\n• Microsoft Clone: a front-end clone of the Microsoft website. Demo: https://inquisitive-peony-327bf1.netlify.app and code: https://github.com/Md-azzul/microsoft-clone\n• Real Estate: a property listing website. Demo: https://realestate-webpage.netlify.app and code: https://github.com/Md-azzul/realestate",
    },
    {
      keys: ["experience", "job", "company", "visionquest", "intern", "career", "role", "employ"],
      a: "Mohamed has about 2 years of experience. He was a Full Stack Developer at VisionQuest Solutions, Bengaluru (Sep 2024 to Aug 2026) and a Full Stack Developer Intern at Techienutpam, Chennai (Feb to Aug 2024).",
    },
    {
      keys: ["education", "study", "degree", "mca", "bca", "college", "university", "srm", "certif"],
      a: "He is doing an MCA in Generative AI at SRM Institute of Science & Technology (Jun 2026 to May 2028) and finished a BCA at Mohamed Sathak College of Arts and Science (2020 to 2023). Certificates: Full Stack Developer (School of Techies), Python (MagicBus, NIIT Foundation), and an Inventory Management System workshop.",
    },
    {
      keys: ["contact", "email", "mail", "hire", "reach", "phone", "whatsapp", "linkedin", "github", "location", "where", "available"],
      a:
        "Email: " + cfg.email +
        "\nWhatsApp / phone: http://wa.me/+971545365236\nGitHub: github.com/Md-azzul\nLinkedIn: https://www.linkedin.com/in/mdazzul\nHe is currently in Dubai, UAE.",
    },
  ];

  function localAnswer(text) {
    const t = text.toLowerCase();
    const hit = FALLBACK.find((f) => f.keys.some((k) => t.includes(k)));
    return hit
      ? hit.a
      : "I can answer questions about Mohamed's skills, projects, experience, education or how to contact him.";
  }

  /* ---------- Styles ---------- */
  const css = `
  .azai { --a:${theme.accent}; --on-a:${theme.onAccent}; --bg:${theme.bg}; --ink:${theme.ink};
    --muted:${theme.muted}; --line:${theme.line}; --bot:${theme.bot}; font-family:${theme.body}; }
  .azai *, .azai *::before, .azai *::after { box-sizing:border-box; }
  .azai-launch { position:fixed; right:20px; bottom:20px; z-index:9998; display:flex; align-items:center; gap:8px;
    padding:.8rem 1.3rem; border:1px solid var(--a); border-radius:999px; background:var(--a); color:var(--on-a);
    font:600 .95rem/1 ${theme.body}; cursor:pointer; box-shadow:0 12px 30px rgba(0,0,0,.45);
    transition:transform .2s, filter .2s; }
  .azai-launch:hover { transform:translateY(-2px); filter:brightness(1.08); }
  .azai-panel { position:fixed; right:20px; bottom:20px; z-index:9999; width:380px; max-width:calc(100vw - 24px);
    height:560px; max-height:calc(100vh - 40px); display:none; flex-direction:column; overflow:hidden;
    background:var(--bg); color:var(--ink); border:1px solid var(--line); border-radius:14px;
    box-shadow:0 30px 60px rgba(0,0,0,.55); }
  .azai-panel.open { display:flex; animation:azai-in .2s ease-out; }
  @keyframes azai-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
  .azai-head { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:1rem 1.1rem;
    border-bottom:1px solid var(--line); }
  .azai-title { font-family:${theme.display}; font-weight:700; font-size:1.1rem; line-height:1.2; margin:0; }
  .azai-sub { font-size:.8rem; color:var(--muted); margin:.2rem 0 0; line-height:1.3; }
  .azai-close { background:none; border:1px solid var(--line); color:var(--ink); width:34px; height:34px;
    border-radius:8px; font-size:1.2rem; line-height:1; cursor:pointer; flex:none; }
  .azai-close:hover { border-color:var(--a); }
  .azai-log { flex:1; overflow-y:auto; padding:1rem; display:flex; flex-direction:column; gap:.7rem; }
  .azai-msg { max-width:88%; padding:.65rem .9rem; border-radius:12px; font-size:.95rem; line-height:1.55;
    white-space:pre-wrap; overflow-wrap:anywhere; margin:0; }
  .azai-msg.bot { align-self:flex-start; background:var(--bot); border:1px solid var(--line); border-bottom-left-radius:4px; }
  .azai-msg.user { align-self:flex-end; background:var(--a); color:var(--on-a); font-weight:500; border-bottom-right-radius:4px; }
  .azai-msg a { color:var(--a); text-decoration:underline; text-underline-offset:2px; }
  .azai-typing { align-self:flex-start; color:var(--muted); font-size:.85rem; padding:.2rem .1rem; }
  .azai-chips { display:flex; flex-wrap:wrap; gap:.5rem; padding:0 1rem .8rem; }
  .azai-chip { border:1px solid var(--line); background:transparent; color:var(--ink); border-radius:999px;
    padding:.4rem .85rem; font:500 .85rem ${theme.body}; cursor:pointer; transition:border-color .2s, color .2s; }
  .azai-chip:hover { border-color:var(--a); color:var(--a); }
  .azai-form { display:flex; gap:.5rem; padding:.8rem; border-top:1px solid var(--line); }
  .azai-input { flex:1; min-width:0; padding:.65rem .9rem; border:1px solid var(--line); border-radius:999px;
    background:var(--bot); color:var(--ink); font:400 .95rem ${theme.body}; }
  .azai-input::placeholder { color:var(--muted); }
  .azai-send { border:1px solid var(--a); border-radius:999px; padding:0 1.2rem; background:var(--a); color:var(--on-a);
    font:600 .95rem ${theme.body}; cursor:pointer; }
  .azai-send:disabled { opacity:.5; cursor:not-allowed; }
  .azai :focus-visible { outline:2px solid var(--a); outline-offset:3px; }
  @media (max-width:480px) {
    .azai-panel { right:0; bottom:0; width:100vw; max-width:100vw; height:100dvh; max-height:100dvh; border-radius:0; border:0; }
    .azai-launch { right:14px; bottom:14px; }
  }`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- DOM ---------- */
  const root = document.createElement("div");
  root.className = "azai";
  root.innerHTML = `
    <button class="azai-launch" type="button" aria-haspopup="dialog" aria-expanded="false">
      <span aria-hidden="true">✦</span> Ask about ${cfg.ownerName}
    </button>
    <section class="azai-panel" role="dialog" aria-label="AI assistant">
      <header class="azai-head">
        <div>
          <p class="azai-title">Ask about ${cfg.ownerName}'s work</p>
          <p class="azai-sub">AI assistant. Answers can contain mistakes.</p>
        </div>
        <button class="azai-close" type="button" aria-label="Close chat">×</button>
      </header>
      <div class="azai-log" role="log" aria-live="polite"></div>
      <div class="azai-chips"></div>
      <form class="azai-form">
        <input class="azai-input" type="text" maxlength="500" placeholder="Type your question" aria-label="Your question" autocomplete="off" />
        <button class="azai-send" type="submit">Send</button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const $ = (s) => root.querySelector(s);
  const launch = $(".azai-launch"), panel = $(".azai-panel"), log = $(".azai-log"),
    chips = $(".azai-chips"), form = $(".azai-form"), input = $(".azai-input"), send = $(".azai-send");

  const history = [];
  let busy = false;

  // Turns URLs and emails in a reply into links, without ever using innerHTML.
  const LINK = /((?:https?:\/\/|www\.)[^\s]+|(?:github\.com|linkedin\.com\/in)\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;
  function fillText(el, text) {
    el.textContent = "";
    text.split(LINK).forEach((part, i) => {
      if (i % 2 === 0) { if (part) el.append(part); return; }
      const m = part.match(/[.,;:!?)]+$/);
      const trail = m ? m[0] : "";
      const url = trail ? part.slice(0, -trail.length) : part;
      const a = document.createElement("a");
      a.textContent = url;
      a.href = /^https?:\/\//.test(url) ? url : url.includes("@") ? "mailto:" + url : "https://" + url;
      if (!url.includes("@") || /^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      el.append(a, trail);
    });
  }

  function addMsg(role, text) {
    const el = document.createElement("div");
    el.className = "azai-msg " + role;
    if (role === "bot") fillText(el, text); else el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function setOpen(open) {
    panel.classList.toggle("open", open);
    launch.style.display = open ? "none" : "flex";
    launch.setAttribute("aria-expanded", String(open));
    if (open) {
      if (!log.children.length) addMsg("bot", cfg.greeting);
      input.focus();
    } else {
      launch.focus();
    }
  }

  async function ask(text) {
    if (busy || !text.trim()) return;
    busy = true;
    send.disabled = true;
    chips.style.display = "none";
    history.push({ role: "user", content: text });
    addMsg("user", text);
    const typing = document.createElement("div");
    typing.className = "azai-typing";
    typing.textContent = "Thinking…";
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;

    let reply;
    try {
      const r = await fetch(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-9) }),
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      reply = (await r.json()).reply;
      if (!reply) throw new Error("empty reply");
    } catch (e) {
      reply = localAnswer(text); // AI server unavailable: answer from built-in facts
    }
    typing.remove();
    history.push({ role: "assistant", content: reply });
    addMsg("bot", reply);
    busy = false;
    send.disabled = false;
    input.focus();
  }

  cfg.chips.forEach((label) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "azai-chip";
    b.textContent = label;
    b.addEventListener("click", () => ask(label));
    chips.appendChild(b);
  });

  launch.addEventListener("click", () => setOpen(true));
  $(".azai-close").addEventListener("click", () => setOpen(false));
  panel.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = input.value;
    input.value = "";
    ask(t);
  });
})();
