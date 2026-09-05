// ═══ §1 · Red SNA del corpus: 338 revistas, cinco corrientes ═══
// Tamaño de nodo = citación real (Tabla 2). La topología se DERIVA de las
// cinco corrientes descritas por el estudio (el paper no publica la lista de enlaces).
(() => {
  const host = document.getElementById("network-chart");
  if (!host) return;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = U.frame(host, {
    title: "El campo entero de una vez: núcleo bibliométrico y periferia de sistemas",
    sub: "338 REVISTAS · TAMAÑO = CITACIÓN (TABLA 2) · TOPOLOGÍA DERIVADA DE LAS 5 CORRIENTES DEL ESTUDIO · CLIC EN UN NODO NÚCLEO",
    src: "Estudio, Figura 1 y Tabla 2 (K1, K6) · OpenAlex, compilado 2026 · estructura de enlaces derivada del texto",
  });

  const wrap = document.createElement("div");
  wrap.style.cssText = "position:relative";
  body.appendChild(wrap);
  const cv = document.createElement("canvas");
  cv.style.cssText = "width:100%;height:560px;display:block;cursor:crosshair";
  wrap.appendChild(cv);
  const B = U.bindCanvas(cv);

  // ── asignación de las 20 núcleo a corrientes (según el texto del estudio) ──
  const CLUSTER_OF = {
    "IEEE Transactions on Information Theory": 0, "Scientometrics": 0, "Journal of Informetrics": 0,
    "International Journal of Information Management": 1, "Information Systems Research": 1,
    "Journal of Information Systems Management": 1, "Information Processing and Management": 1,
    "Scientific Data": 2, "Information Communication and Society": 2,
    "Education and Information Technologies": 2, "Government Information Quarterly": 2, "Telecommunications Policy": 2,
    "Journal of Documentation": 3, "Journal of Academic Librarianship": 3, "Journal of Information Science": 3, "Notes": 3,
    "Lecture Notes in Control and Information Sciences": 4, "European Journal of Information Systems": 4,
    "Personal and Ubiquitous Computing": 4, "Notes and Queries": 4,
  };
  const CLAB = ["BIBLIOMETRÍA Y CIENCIA DE LA CIENCIA", "GESTIÓN DE INF. Y SISTEMAS",
    "TECNOLOGÍA, SOCIEDAD E IMPACTO DIGITAL", "BIBLIOTECOLOGÍA CLÁSICA", "INFORMÁTICA APLICADA"];
  // centros en disposición pentagonal (el núcleo bibliométrico al centro-inferior, como describe el estudio)
  const CENTERS = [[0.50, 0.62], [0.72, 0.34], [0.30, 0.30], [0.24, 0.66], [0.72, 0.68]];

  const rng = U.makeRng(99);
  const nodes = [], links = [];
  RPT.cited_top20.forEach(j => nodes.push({
    name: j.j, cites: j.cites, reg: j.reg, c: j.c, cluster: CLUSTER_OF[j.j] ?? 1, core: true,
    r: 3.2 + Math.sqrt(j.cites) / 38,
  }));
  for (let i = 0; i < 318; i++) nodes.push({ cluster: Math.floor(rng() * 5), core: false, r: 1.4 + rng() * 1.6 });

  // enlaces: intra-corriente densos (alta co-citación interna) + puentes selectivos
  const cores = nodes.filter(n => n.core);
  const byCl = [[], [], [], [], []];
  nodes.forEach(n => byCl[n.cluster].push(n));
  byCl.forEach(g => {
    for (let i = 0; i < g.length; i++) {
      const n = g[i];
      const deg = n.core ? 3 : 1;
      for (let d = 0; d < deg; d++) {
        const m = g[Math.floor(rng() * g.length)];
        if (m !== n) links.push([n, m, 0.35]);
      }
    }
  });
  const bridge = (a, b, nL) => {
    for (let i = 0; i < nL; i++) {
      const x = cores.filter(n => n.cluster === a), y = cores.filter(n => n.cluster === b);
      links.push([x[Math.floor(rng() * x.length)], y[Math.floor(rng() * y.length)], 0.8]);
    }
  };
  bridge(0, 3, 3); bridge(0, 1, 2); bridge(1, 2, 3); bridge(2, 4, 2); bridge(1, 4, 2);

  // ── simulación de fuerzas (determinista, precalculada al cargar) ──
  function simulate(W, H) {
    nodes.forEach(n => {
      const [cx, cy] = CENTERS[n.cluster];
      n.x = (cx + (rng() - 0.5) * 0.30) * W;
      n.y = (cy + (rng() - 0.5) * 0.30) * H;
      n.vx = 0; n.vy = 0;
    });
    for (let it = 0; it < 220; it++) {
      const cool = 1 - it / 220;
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        let d2 = dx * dx + dy * dy + 0.01;
        if (d2 > 12000) continue;
        const f = 34 * cool / d2;
        dx *= f; dy *= f;
        a.vx += dx; a.vy += dy; b.vx -= dx; b.vy -= dy;
      }
      links.forEach(([a, b, wgt]) => {
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = (d - 46) * 0.012 * wgt * cool;
        a.vx += dx / d * f; a.vy += dy / d * f;
        b.vx -= dx / d * f; b.vy -= dy / d * f;
      });
      nodes.forEach(n => {
        const [cx, cy] = CENTERS[n.cluster];
        n.vx += (cx * W - n.x) * 0.006 * cool;
        n.vy += (cy * H - n.y) * 0.006 * cool;
        n.x = U.clamp(n.x + n.vx * 0.6, 14, W - 14);
        n.y = U.clamp(n.y + n.vy * 0.6, 26, H - 14);
        n.vx *= 0.82; n.vy *= 0.82;
      });
    }
  }

  let born = 0, hover = null;
  function draw(now) {
    const { w, h } = B.fit();
    const ctx = B.ctx;
    if (!nodes[0].x) simulate(w, h);
    ctx.clearRect(0, 0, w, h);
    const prog = REDUCE ? 1 : U.clamp((now - born) / 1600, 0, 1);

    // rótulos de corriente (kickers mono)
    ctx.font = '700 8.5px Menlo, Consolas, monospace';
    CENTERS.forEach(([cx, cy], i) => {
      ctx.fillStyle = "rgba(133,149,166,.95)";
      ctx.textAlign = "center";
      ctx.fillText(CLAB[i], cx * w, cy * h - 84);
    });
    ctx.textAlign = "left";

    // enlaces
    ctx.globalAlpha = prog;
    links.forEach(([a, b]) => {
      ctx.strokeStyle = "rgba(133,149,166,.30)";
      ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    // nodos relleno (318 del corpus)
    nodes.forEach(n => {
      if (n.core) return;
      ctx.fillStyle = "rgba(125,155,255,.55)";
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, U.TAU); ctx.fill();
    });
    // nodos núcleo (20)
    cores.forEach((n, i) => {
      const ap = REDUCE ? 1 : U.clamp(prog * 1.6 - i * 0.03, 0, 1);
      ctx.globalAlpha = ap;
      const isH = hover === n;
      ctx.fillStyle = n.reg === "América" ? "#2251ff" : "#051c2c";
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (isH ? 1.25 : 1), 0, U.TAU); ctx.fill();
      if (isH) {
        ctx.strokeStyle = "#2251ff"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 1.25 + 4, 0, U.TAU); ctx.stroke();
      }
      ctx.globalAlpha = prog;
    });
    // etiquetas de las 8 más citadas: lado según borde + deconflicto vertical
    const lab = [...cores].sort((a, b) => b.cites - a.cites).slice(0, 8);
    ctx.font = '8.5px Menlo, Consolas, monospace';
    const placed = [];
    lab.forEach(n => {
      const s = n.name.length > 34 ? n.name.slice(0, 32) + "…" : n.name;
      const tw = ctx.measureText(s).width;
      let lx = n.x + n.r + 4;
      if (lx + tw > w - 6) lx = n.x - n.r - 4 - tw; // se va a la izquierda del nodo
      if (lx < 6) lx = 6;
      let ly = n.y + 3;
      for (let it = 0; it < 10; it++) {
        const hit = placed.find(p => !(lx > p.x + p.w + 4 || lx + tw < p.x - 4 || ly > p.y + 9 || ly < p.y - 9));
        if (!hit) break;
        ly = ly < hit.y ? hit.y - 11 : hit.y + 11;
        if (ly < 12) ly = hit.y + 11;
        if (ly > h - 8) ly = hit.y - 11;
      }
      placed.push({ x: lx, y: ly, w: tw });
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4; ctx.lineJoin = "round";
      ctx.strokeText(s, lx, ly);
      ctx.fillStyle = "#051c2c";
      ctx.fillText(s, lx, ly);
    });
    ctx.globalAlpha = 1;
  }

  // leyenda
  const leg = document.createElement("p");
  leg.className = "chart-sub";
  leg.style.borderBottom = "0";
  leg.innerHTML = "● AMÉRICA (AZUL) · ● EUROPA (TINTA) · ● RESTO DEL CORPUS, 318 TÍTULOS (AZUL CLARO) · ENLACES: LECTURA DE LAS CORRIENTES DESCRITAS, NO LA RED WEBGL ORIGINAL";
  body.appendChild(leg);

  cv.addEventListener("mousemove", e => {
    const r = cv.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    hover = null;
    for (const n of cores) if (Math.hypot(n.x - mx, n.y - my) < n.r + 6) { hover = n; break; }
    if (hover) U.showTip(`${hover.name} · ${U.fmt.n(hover.cites)} citas · ${hover.c}`, e.clientX, e.clientY);
    else U.hideTip();
    draw(performance.now() + 2000);
  });
  cv.addEventListener("mouseleave", () => { hover = null; U.hideTip(); draw(performance.now() + 2000); });
  cv.addEventListener("click", e => {
    if (!hover) return;
    const row = RPT.cited_top20.find(j => j.j === hover.name);
    U.showDrill({ title: hover.name.toUpperCase(), value: U.fmt.n(hover.cites) + " citas",
      sub: `${hover.c} · ${hover.reg === "América" ? "América" : "Europa"} · puesto ${row ? row.r : "—"} del Top 20 · corriente: ${CLAB[hover.cluster].toLowerCase()}`,
      source: "K6 · Estudio, Tabla 2 · OpenAlex, compilado 2026", x: e.clientX, y: e.clientY });
  });

  let animating = false;
  function play() {
    if (animating) return; animating = true;
    const step = now => {
      draw(now);
      if (REDUCE || now - born < 1900) requestAnimationFrame(step);
      else animating = false;
    };
    requestAnimationFrame(step);
  }
  new IntersectionObserver((es, io) => es.forEach(en => {
    if (en.isIntersecting) { born = performance.now(); play(); io.disconnect(); }
  }), { threshold: 0.15 }).observe(cv);
  if (REDUCE) { born = performance.now(); draw(born + 2000); }
})();
