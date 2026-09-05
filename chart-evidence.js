// ═══ §0 · Objeto de evidencia (P17): el ejemplar con las seis cifras ═══
// Cada número cuelga del lugar del objeto que en la realidad ya mide eso:
// cabecera = impacto · lomo = volumen · etiquetas = precio · cinta = índice · estantería = corpus
(() => {
  const host = document.getElementById("evidence-chart");
  if (!host) return;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = U.frame(host, {
    title: "Seis cifras del estudio, colgadas de un solo ejemplar",
    sub: "CADA NÚMERO EN EL LUGAR FÍSICO QUE LO MIDE · CLIC EN CUALQUIER PLACA PARA VER SU BASE",
    src: "Estudio, Figuras 1–2 y Tablas 2–4 (K1–K11) · OpenAlex y SCImago, compilado 2026",
  });

  const NS = "http://www.w3.org/2000/svg";
  const W = 880, H = 540;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.cssText = "width:100%;height:auto;display:block";
  body.appendChild(svg);
  const el = (tag, attrs, parent = svg) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n); return n;
  };
  const txt = (x, y, s, o = {}) => {
    const t = el("text", { x, y, "font-family": "Menlo, Consolas, monospace", "font-size": o.fs || 10,
      fill: o.fill || "#42566a", "text-anchor": o.anchor || "start",
      "font-weight": o.bold ? 700 : 400, "letter-spacing": o.ls || 0, "font-style": o.it ? "italic" : "normal" });
    t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke", "#ffffff"); t.setAttribute("stroke-width", 4);
    t.textContent = s; return t;
  };

  // ── estantería de fondo: 338 lomos = el corpus ──
  const shelfG = el("g", { opacity: 0.5 });
  const rng = U.makeRng(11);
  let spineCount = 0;
  const rowsY = [86, 208, 330, 452];
  rowsY.forEach((ry, ri) => {
    el("line", { x1: 16, y1: ry + 58, x2: 864, y2: ry + 58, stroke: "#8595a6", "stroke-width": 2 }, shelfG);
    let x = 22;
    while (x < 856 && spineCount < 338) {
      const wSp = 5 + rng() * 4, hSp = 38 + rng() * 18;
      const blue = rng() < 0.42;                     // 42.1% OA en el corpus
      el("rect", { x, y: ry + 58 - hSp, width: wSp, height: hSp, rx: 1,
        fill: blue ? "#2251ff" : "#42566a", opacity: blue ? 0.5 : 0.38 }, shelfG);
      x += wSp + 2.1; spineCount++;
    }
  });

  // ── el ejemplar central ──
  const JX = 440, JY = 292, CW = 178, CH = 262, SP = 30;   // portada + lomo
  const item = (g, d) => { g.style.opacity = 0; g.style.transition = `opacity .5s ease ${d}ms, transform .5s cubic-bezier(.2,.7,.3,1) ${d}ms`; g.style.transform = "translateY(12px)"; return g; };

  const shadow = el("ellipse", { cx: JX, cy: JY + CH / 2 + 16, rx: 130, ry: 12, fill: "rgba(5,28,44,.10)" });
  const jG = item(el("g", {}), 100);
  // lomo (grueso: la revista más productiva)
  el("rect", { x: JX - CW / 2 - SP, y: JY - CH / 2, width: SP, height: CH, rx: 3, fill: "#e9e6dc", stroke: "#051c2c", "stroke-width": 1.4 }, jG);
  for (let i = 0; i < 9; i++) el("line", { x1: JX - CW / 2 - SP + 5, y1: JY - CH / 2 + 18 + i * 26, x2: JX - CW / 2 - 5, y2: JY - CH / 2 + 18 + i * 26, stroke: "#8595a6", "stroke-width": 1 }, jG);
  // portada
  el("rect", { x: JX - CW / 2, y: JY - CH / 2, width: CW, height: CH, rx: 3, fill: "#ffffff", stroke: "#051c2c", "stroke-width": 1.6 }, jG);
  // cabecera azul
  el("rect", { x: JX - CW / 2 + 8, y: JY - CH / 2 + 8, width: CW - 16, height: 34, fill: "#2251ff" }, jG);
  txt(JX, JY - CH / 2 + 30, "REVISTA LIS", { fs: 13, fill: "#ffffff", anchor: "middle", bold: true, ls: 3 }).setAttribute("stroke", "none");
  // titulares
  el("line", { x1: JX - 62, y1: JY - CH / 2 + 62, x2: JX + 62, y2: JY - CH / 2 + 62, stroke: "#051c2c", "stroke-width": 3 }, jG);
  el("line", { x1: JX - 48, y1: JY - CH / 2 + 74, x2: JX + 48, y2: JY - CH / 2 + 74, stroke: "#42566a", "stroke-width": 2 }, jG);
  // motivo de red en portada
  const nR = U.makeRng(5), pts = [];
  for (let i = 0; i < 7; i++) pts.push({ x: JX + (nR() - 0.5) * 120, y: JY + 12 + (nR() - 0.5) * 70 });
  for (let i = 0; i < 8; i++) {
    const a = Math.floor(nR() * 7), b = Math.floor(nR() * 7);
    el("line", { x1: pts[a].x, y1: pts[a].y, x2: pts[b].x, y2: pts[b].y, stroke: "#8595a6", "stroke-width": 1 }, jG);
  }
  pts.forEach((p, i) => el("circle", { cx: p.x, cy: p.y, r: i === 0 ? 5 : 3, fill: i === 0 ? "#2251ff" : "#051c2c" }, jG));
  // columnas de texto
  for (let r = 0; r < 4; r++) {
    el("line", { x1: JX - 70, y1: JY + 74 + r * 11, x2: JX - 8, y2: JY + 74 + r * 11, stroke: "#c6cdd6", "stroke-width": 1.4 }, jG);
    el("line", { x1: JX + 8, y1: JY + 74 + r * 11, x2: JX + 70, y2: JY + 74 + r * 11, stroke: "#c6cdd6", "stroke-width": 1.4 }, jG);
  }
  // cinta de índice (marcador Q1)
  const rb = item(el("g", {}), 500);
  el("path", { d: `M ${JX + 40} ${JY - CH / 2} l 0 74 l 11 -12 l 11 12 z`, fill: "#1233b8", stroke: "#051c2c", "stroke-width": 1 }, rb);
  // etiqueta de precio (APC) — el acto de poner precio
  const tagAPC = item(el("g", {}), 650);
  el("line", { x1: JX + CW / 2 - 6, y1: JY + 52, x2: JX + CW / 2 + 42, y2: JY + 76, stroke: "#42566a", "stroke-width": 1 }, tagAPC);
  el("path", { d: `M ${JX + CW / 2 + 40} ${JY + 66} l 64 10 l -8 26 l -64 -10 z`, fill: "#fbfaf5", stroke: "#1233b8", "stroke-width": 1.6 }, tagAPC);
  el("circle", { cx: JX + CW / 2 + 46, cy: JY + 72, r: 2.4, fill: "#1233b8" }, tagAPC);
  txt(JX + CW / 2 + 74, JY + 92, "APC", { fs: 10, fill: "#1233b8", anchor: "middle", bold: true });
  // etiqueta de candado abierto (OA)
  const tagOA = item(el("g", {}), 800);
  el("line", { x1: JX + CW / 2 - 6, y1: JY + 96, x2: JX + CW / 2 + 30, y2: JY + 122, stroke: "#42566a", "stroke-width": 1 }, tagOA);
  el("path", { d: `M ${JX + CW / 2 + 28} ${JY + 112} l 58 9 l -7 24 l -58 -9 z`, fill: "#fbfaf5", stroke: "#2251ff", "stroke-width": 1.6 }, tagOA);
  txt(JX + CW / 2 + 60, JY + 136, "OA", { fs: 10, fill: "#2251ff", anchor: "middle", bold: true });

  // ── placas de número con líneas guía ──
  const plaques = [
    { x: 30, y: 40, val: "1,367,000 citas", lab: "LA MÁS CITADA · IEEE TRANS. ON INFORMATION THEORY",
      ax: JX + 40, ay: JY - CH / 2 + 25, k: "K6", d: 250,
      sub: "Tabla 2 del estudio: lidera el ranking con 4.4× las citas del segundo (Scientometrics, 309,400)." },
    { x: 30, y: 250, val: "341,800 docs", lab: "LA MÁS PRODUCTIVA · NOTES AND QUERIES (LOMO GRUESO)",
      ax: JX - CW / 2 - SP / 2, ay: JY + 30, k: "K9", d: 400,
      sub: "Tabla 3 del estudio: el mayor volumen acumulado del corpus — y sin embargo permanece en Q4 (Tabla 4)." },
    { x: 30, y: 428, val: "13 revistas", lab: "ESTABLES EN Q1 TODA LA DÉCADA (CINTA SJR)",
      ax: JX + 50, ay: JY - CH / 2 + 70, k: "K11", d: 550,
      sub: "Tabla 4 del estudio: núcleo duro de alta visibilidad, SJR 2015–2025. Barreras de entrada para emergentes." },
    { x: 620, y: 40, val: "338 revistas", lab: "EL CORPUS CURADO · 52.1% EN EUROPA (ESTANTERÍA)",
      ax: 830, ay: 100, k: "K1", d: 150,
      sub: "Figuras 1–2: 338 títulos LIS en OpenAlex tras auditoría manual de Aims & Scope; 176 en Europa, 126 en América." },
    { x: 640, y: 400, val: "48.8% APC", lab: "165 REVISTAS CON CARGOS POR ARTÍCULO <20%",
      ax: JX + CW / 2 + 74, ay: JY + 80, k: "K4", d: 700,
      sub: "Figura 2: esquema dominante del corpus; entre las 20 más productivas, 17 de 20 cobran APC (85%)." },
    { x: 640, y: 476, val: "42.1% OA", lab: "142 REVISTAS >50% EN ACCESO ABIERTO",
      ax: JX + CW / 2 + 58, ay: JY + 126, k: "K4", d: 850,
      sub: "Figura 2: coexistencia equilibrada con el APC; América y Europa empatan 58–58 en títulos >50% OA." },
  ];
  plaques.forEach(p => {
    const g = item(el("g", { cursor: "pointer", "data-drill-keep": "" }), p.d);
    el("line", { x1: p.ax, y1: p.ay, x2: p.x + (p.x < 400 ? 236 : 4), y2: p.y + 22, stroke: "#8595a6", "stroke-width": 1, "stroke-dasharray": "3 3" }, g);
    el("circle", { cx: p.ax, cy: p.ay, r: 3, fill: "none", stroke: "#42566a", "stroke-width": 1.2 }, g);
    const wd = 240, ht = 44;
    el("rect", { x: p.x, y: p.y, width: wd, height: ht, fill: "#ffffff", stroke: "#051c2c", "stroke-width": 1.3 }, g);
    txt(p.x + 10, p.y + 19, p.val, { fs: 14, fill: "#2251ff", bold: true });
    txt(p.x + 10, p.y + 34, p.lab, { fs: 7.6, fill: "#42566a" });
    g.addEventListener("click", e => {
      e.stopPropagation();
      const s = window.SRC[p.k];
      U.showDrill({ title: p.lab, value: p.val, sub: p.sub,
        source: `${p.k} · ${s ? s.cite : "Estudio 2026"}`, x: e.clientX, y: e.clientY });
    });
  });

  // entrada escalonada
  const items = svg.querySelectorAll("g[style]");
  const show = () => items.forEach(g => { g.style.opacity = 1; g.style.transform = "none"; });
  if (REDUCE) show();
  else new IntersectionObserver((es, io) => es.forEach(e => {
    if (e.isIntersecting) { show(); io.disconnect(); }
  }), { threshold: 0.2 }).observe(svg);
})();
