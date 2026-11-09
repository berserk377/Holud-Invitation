(function () {
  const C = window.INVITE;
  const bnDigits = "০১২৩৪৫৬৭৮৯";
  const bn = (v) => String(v).replace(/\d/g, (d) => bnDigits[d]);

  // ---- Alpana motif (generated SVG) ----
  const NS = "http://www.w3.org/2000/svg";
  function drawAlpana(svg) {
    const g = document.createElementNS(NS, "g");
    const layers = [
      { n: 16, d: "M0,-92 C10,-78 10,-66 0,-56 C-10,-66 -10,-78 0,-92Z", cls: "a1" },
      { n: 12, d: "M0,-62 C16,-50 14,-34 0,-26 C-14,-34 -16,-50 0,-62Z", cls: "a2" },
      { n: 8, d: "M0,-30 C8,-24 8,-14 0,-8 C-8,-14 -8,-24 0,-30Z", cls: "a3" }
    ];
    layers.forEach((l) => {
      for (let i = 0; i < l.n; i++) {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("d", l.d);
        p.setAttribute("class", l.cls);
        p.setAttribute("transform", `rotate(${(360 / l.n) * i})`);
        g.appendChild(p);
      }
    });
    for (let i = 0; i < 24; i++) {
      const c = document.createElementNS(NS, "circle");
      const a = (Math.PI * 2 * i) / 24;
      c.setAttribute("cx", Math.sin(a) * 72);
      c.setAttribute("cy", -Math.cos(a) * 72);
      c.setAttribute("r", 2.2);
      c.setAttribute("class", "a4");
      g.appendChild(c);
    }
    const ring = document.createElementNS(NS, "circle");
    ring.setAttribute("r", 96);
    ring.setAttribute("class", "ring");
    g.appendChild(ring);
    const core = document.createElementNS(NS, "circle");
    core.setAttribute("r", 6);
    core.setAttribute("class", "a2");
    g.appendChild(core);
    svg.appendChild(g);
  }
  document.querySelectorAll("svg.alpana").forEach(drawAlpana);

  // ---- Marigold garland ----
  const garland = document.querySelector(".garland");
  for (let i = 0; i < 9; i++) {
    const s = document.createElement("span");
    s.style.setProperty("--len", 40 + (i % 2 ? 30 : 60) + (i % 3) * 10 + "px");
    garland.appendChild(s);
  }

  // ---- Firework intro ----
  const intro = document.getElementById("intro");
  const invite = document.getElementById("invite");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.style.overflow = "hidden";

  // stars
  const starsEl = document.getElementById("stars");
  for (let i = 0; i < 90; i++) {
    const s = document.createElement("i");
    const size = Math.random() < 0.15 ? 2.2 : Math.random() * 1.4 + 0.6;
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 78}%;width:${size}px;height:${size}px;opacity:${0.35 + Math.random() * 0.6};--d:${2 + Math.random() * 4}s;--dl:-${Math.random() * 5}s`;
    starsEl.appendChild(s);
  }

  // canvas
  const cv = document.getElementById("fx");
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = intro.clientWidth; H = intro.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    placeTarget();
  }

  const svg = document.getElementById("anar");
  const fuse = document.getElementById("fuse");
  const spark = document.getElementById("fuse-spark");
  const fuseLen = fuse.getTotalLength();
  fuse.style.strokeDasharray = `${fuseLen} ${fuseLen}`;
  const toScreen = (x, y) => {
    const p = new DOMPoint(x, y).matrixTransform(svg.getScreenCTM());
    const r = intro.getBoundingClientRect();
    return { x: p.x - r.left, y: p.y - r.top };
  };
  const fuseTip = () => { const p = fuse.getPointAtLength(fuseLen); return toScreen(p.x, p.y); };
  const nozzle = () => toScreen(60, 60);

  const fuseBtn = document.getElementById("fuse-btn");
  function placeTarget() {
    const t = fuseTip();
    fuseBtn.style.left = t.x + "px";
    fuseBtn.style.top = t.y + "px";
  }
  window.addEventListener("resize", resize);
  resize();
  // anar fades in with a transform; re-place once it settles
  setTimeout(placeTarget, 1500);

  // particles
  const GOLD = ["#fff1c1", "#ffd27a", "#ffcf5c", "#ffb347", "#ff9f43", "#ffe6a6"];
  const pick = (a) => a[(Math.random() * a.length) | 0];
  let parts = [];
  let shells = [];
  const MAX = 1800;
  function add(p) { if (parts.length < MAX) parts.push(p); }

  function emitFuse(x, y) {
    for (let i = 0; i < 3; i++) {
      const a = Math.random() * Math.PI * 2, v = Math.random() * 1.6 + 0.4;
      add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.6, g: 0.06, f: 0.96, life: 18 + Math.random() * 14, max: 32, r: 1.2, c: pick(GOLD) });
    }
  }
  function emitFountain(power) {
    const n = nozzle();
    const sc = Math.min(1.25, Math.max(0.8, H / 800));
    for (let i = 0; i < 9; i++) {
      const spread = (Math.random() - 0.5) * 3.2;
      add({ x: n.x + (Math.random() - 0.5) * 4, y: n.y, vx: spread * sc, vy: -(7 + Math.random() * 6) * sc * power,
        g: 0.16 * sc, f: 0.99, life: 50 + Math.random() * 40, max: 90, r: Math.random() * 1.3 + 0.7, c: pick(GOLD), tw: Math.random() < 0.3 });
    }
  }
  function launchShell() {
    const n = nozzle();
    const tx = W * (0.15 + Math.random() * 0.7);
    const ty = H * (0.08 + Math.random() * 0.2);
    shells.push({ x: n.x, y: n.y, sx: n.x, sy: n.y, tx, ty, t: 0, dur: 30 + Math.random() * 12 });
  }
  function burst(x, y) {
    const count = 110 + ((Math.random() * 50) | 0);
    const col = pick(GOLD);
    const sp = (3.2 + Math.random() * 2.4) * Math.min(1.3, Math.max(0.85, W / 420));
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.1;
      const v = sp * (0.6 + Math.random() * 0.5);
      add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.03, f: 0.972, life: 70 + Math.random() * 45, max: 110,
        r: Math.random() * 1.4 + 1.1, c: Math.random() < 0.7 ? col : pick(GOLD), tw: Math.random() < 0.4 });
    }
    // flash
    add({ x, y, vx: 0, vy: 0, g: 0, f: 1, life: 10, max: 10, r: 40, c: "#fff3d6", flash: true });
  }

  let running = false;
  function frame() {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    for (let i = shells.length - 1; i >= 0; i--) {
      const s = shells[i];
      s.t++;
      const k = Math.min(1, s.t / s.dur), e = 1 - Math.pow(1 - k, 2.2);
      s.x = s.sx + (s.tx - s.sx) * e;
      s.y = s.sy + (s.ty - s.sy) * e;
      add({ x: s.x, y: s.y, vx: (Math.random() - 0.5) * 0.4, vy: 0.4, g: 0.02, f: 0.95, life: 16, max: 16, r: 1.1, c: "#ffd27a" });
      if (s.t >= s.dur) { burst(s.x, s.y); shells.splice(i, 1); }
    }

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vx *= p.f; p.vy = p.vy * p.f + p.g;
      p.x += p.vx; p.y += p.vy;
      p.life--;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      let a = Math.min(1, p.life / p.max * 1.4);
      if (p.tw) a *= 0.5 + Math.random() * 0.5;
      if (p.flash) {
        const R = p.r * (1 + (10 - p.life) * 0.2);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
        g.addColorStop(0, "rgba(255,243,214,0.5)");
        g.addColorStop(1, "rgba(255,200,120,0)");
        ctx.globalAlpha = a * 0.6;
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, Math.PI * 2); ctx.fill();
        continue;
      }
      ctx.globalAlpha = a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (running || parts.length || shells.length) requestAnimationFrame(frame);
  }

  // match dragging
  const match = document.getElementById("match");
  const flame = match.querySelector(".flame");
  let drag = null, mx = 0, my = 0, lit = false;
  const setMatch = () => { match.style.transform = `translate(${mx}px, ${my}px) rotate(${drag ? -8 : -18}deg)`; };
  setMatch();
  match.addEventListener("pointerdown", (e) => {
    if (lit) return;
    drag = { x: e.clientX - mx, y: e.clientY - my };
    match.setPointerCapture(e.pointerId);
    match.classList.add("dragging");
    match.style.animation = "none";
    setMatch();
  });
  match.addEventListener("pointermove", (e) => {
    if (!drag) return;
    mx = e.clientX - drag.x; my = e.clientY - drag.y;
    setMatch();
    const f = flame.getBoundingClientRect();
    const r = intro.getBoundingClientRect();
    const fx = f.left + f.width / 2 - r.left, fy = f.top + f.height * 0.8 - r.top;
    const t = fuseTip();
    if (Math.hypot(fx - t.x, fy - t.y) < 34) ignite();
  });
  const endDrag = () => { drag = null; match.classList.remove("dragging"); if (!lit) setMatch(); };
  match.addEventListener("pointerup", endDrag);
  match.addEventListener("pointercancel", endDrag);
  fuseBtn.addEventListener("click", ignite);

  function finish() {
    intro.classList.add("gone");
    invite.classList.add("show");
    invite.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "";
    setTimeout(() => { running = false; intro.remove(); }, 1800);
  }

  function ignite() {
    if (lit) return;
    lit = true; drag = null;
    intro.classList.add("lit");
    const names = document.getElementById("sky-names");
    if (reduce) {
      names.classList.add("show");
      setTimeout(finish, 1800);
      return;
    }
    running = true;
    requestAnimationFrame(frame);

    // 1) fuse burns down
    const burnMs = 1100;
    const t0 = performance.now();
    spark.setAttribute("opacity", "1");
    (function burn(now) {
      const k = Math.min(1, (now - t0) / burnMs);
      const left = fuseLen * (1 - k);
      fuse.style.strokeDashoffset = String(fuseLen - left);
      const p = fuse.getPointAtLength(left);
      spark.setAttribute("cx", p.x); spark.setAttribute("cy", p.y);
      const sp = toScreen(p.x, p.y);
      emitFuse(sp.x, sp.y);
      if (k < 1) requestAnimationFrame(burn);
      else { spark.setAttribute("opacity", "0"); fountain(); }
    })(t0);
  }

  // 2) fountain + sky bursts (~4s), names glow, then fade to main page
  function fountain() {
    const start = performance.now();
    const total = 4200;
    (function spray(now) {
      const k = (now - start) / total;
      if (k < 1) {
        const power = k < 0.12 ? 0.55 + k * 3.75 : k > 0.82 ? Math.max(0.35, 1 - (k - 0.82) * 3.6) : 1;
        emitFountain(power);
        requestAnimationFrame(spray);
      }
    })(start);
    const times = [250, 700, 1050, 1400, 1700, 2050, 2350, 2700, 3000, 3300];
    times.forEach((t) => setTimeout(launchShell, t));
    setTimeout(() => document.getElementById("sky-names").classList.add("show"), 1300);
    setTimeout(finish, total + 300);
  }

  // ---- Map & calendar ----
  document.getElementById("map-btn").href = C.mapUrl;
  const toUTC = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const title = "গায়ে হলুদ — তাহিয়াদ ও আদিবা";

  document.getElementById("ics-btn").addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Holud Invitation//BN",
      "BEGIN:VEVENT",
      "UID:holud-tahiad-adiba-20270101@invite",
      `DTSTAMP:${toUTC(new Date().toISOString())}`,
      `DTSTART:${toUTC(C.start)}`, `DTEND:${toUTC(C.end)}`,
      `SUMMARY:${title}`,
      `LOCATION:${C.venue.replace(/,/g, "\\,")}`,
      "DESCRIPTION:পোশাক: প্যাস্টেল থিম",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "gaye-holud.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  // ---- Countdown ----
  const target = new Date(C.start).getTime();
  const el = (id) => document.getElementById(id);
  function tick() {
    let diff = Math.max(0, target - Date.now());
    if (diff === 0) {
      el("countdown").hidden = true;
      el("countdown-done").hidden = false;
      return;
    }
    const d = Math.floor(diff / 864e5); diff %= 864e5;
    const h = Math.floor(diff / 36e5); diff %= 36e5;
    const m = Math.floor(diff / 6e4); diff %= 6e4;
    const s = Math.floor(diff / 1e3);
    el("cd-days").textContent = bn(d);
    el("cd-hours").textContent = bn(h);
    el("cd-mins").textContent = bn(m);
    el("cd-secs").textContent = bn(s);
    setTimeout(tick, 1000);
  }
  tick();

  // ---- Contacts ----
  const list = el("contact-list");
  C.contacts.forEach((c) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.className = "c-name";
    name.textContent = c.name;
    li.appendChild(name);
    if (c.phone) {
      const a = document.createElement("a");
      a.href = "tel:" + c.phone.replace(/\s/g, "");
      a.className = "btn btn-small";
      a.textContent = "📞 " + bn(c.phone);
      li.appendChild(a);
    } else {
      const s = document.createElement("span");
      s.className = "muted";
      s.textContent = "শীঘ্রই যুক্ত হবে";
      li.appendChild(s);
    }
    list.appendChild(li);
  });

  // ---- Photos ----
  if (C.photos && C.photos.length) {
    const gal = el("gallery");
    C.photos.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "তাহিয়াদ ও আদিবা";
      img.loading = "lazy";
      img.onerror = () => img.remove();
      gal.appendChild(img);
    });
    el("gallery-card").hidden = false;
  }
})();
