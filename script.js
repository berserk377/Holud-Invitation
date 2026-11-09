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

  // ---- Envelope ----
  const screen = document.getElementById("envelope-screen");
  const invite = document.getElementById("invite");
  const openBtn = document.getElementById("open-btn");
  document.body.style.overflow = "hidden";
  openBtn.addEventListener("click", () => {
    if (screen.classList.contains("opening")) return;
    openBtn.disabled = true;
    screen.classList.add("opening");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      screen.classList.add("gone");
      invite.classList.add("show");
      invite.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "";
      setTimeout(() => screen.remove(), 1200);
    }, reduce ? 50 : 2700);
  });

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
