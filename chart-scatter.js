// ═══ §4 · Dispersión output × impacto (log-log) + tabla de productividad ═══
// Dos variables reales por revista (Tablas 2 y 3): la tesis "output ≠ impacto"
// se dibuja como geometría, no como frase.
(() => {
  const host = document.getElementById("scatter-chart");
  if (!host) return;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = U.frame(host, {
    title: "Publicar mucho no es citar mucho: la nube no sigue la diagonal",
    sub: "X = DOCUMENTOS ACUMULADOS (TABLA 3) · Y = CITAS (TABLA 2) · AMBOS EJES LOG · CLIC EN CADA PUNTO",
    src: "Estudio, Tablas 2–3 (K6, K9) · OpenAlex, compilado 2026 · solo revistas presentes en ambas tablas",
  });

  const NS = "http://www.w3.org/2000/svg";
  const W = 880, H = 520, ML = 116, MR = 34, MT = 30, MB = 56;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.cssText = "width:100%;height:auto;display:block";
  body.appendChild(svg);
  const el = (t, a, p = svg) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; };
  const txt = (x, y, s, o = {}) => {
    const t = el("text", { x, y, "font-family": "Menlo, Consolas, monospace", "font-size": o.fs || 10,
      fill: o.fill || "#42566a", "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 400,
      "font-style": o.it ? "italic" : "normal" });
    t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke", "#ffffff"); t.setAttribute("stroke-width", 4);
    t.textContent = s; return t;
  };

  const D = RPT.output_vs_impact;
  const xL = [Math.log10(2500), Math.log10(500000)], yL = [Math.log10(50000), Math.log10(2000000)];
  const sx = v => ML + (Math.log10(v) - xL[0]) / (xL[1] - xL[0]) * (W - ML - MR);
  const sy = v => H - MB - (Math.log10(v) - yL[0]) / (yL[1] - yL[0]) * (H - MT - MB);

  // retícula y ejes
  [5000, 10000, 50000, 100000, 500000].forEach(v => {
    if (v < 2500 || v > 500000) return;
    el("line", { x1: sx(v), y1: MT, x2: sx(v), y2: H - MB, stroke: "#eef1f6", "stroke-width": 1 });
    txt(sx(v), H - MB + 18, v >= 1000 ? (v / 1000) + "K" : v, { fs: 8.5, fill: "#8595a6", anchor: "middle" });
  });
  [100000, 300000, 1000000].forEach(v => {
    el("line", { x1: ML, y1: sy(v), x2: W - MR, y2: sy(v), stroke: "#eef1f6", "stroke-width": 1 });
    txt(ML - 8, sy(v) + 3, v >= 1000000 ? "1M" : (v / 1000) + "K", { fs: 8.5, fill: "#8595a6", anchor: "end" });
  });
  el("line", { x1: ML, y1: H - MB, x2: W - MR, y2: H - MB, stroke: "#051c2c", "stroke-width": 1.4 });
  el("line", { x1: ML, y1: MT, x2: ML, y2: H - MB, stroke: "#051c2c", "stroke-width": 1.4 });
  txt(W / 2, H - 12, "DOCUMENTOS ACUMULADOS (LOG)", { fs: 9, fill: "#42566a", anchor: "middle", bold: true });
  const yl = txt(16, H / 2, "CITAS ACUMULADAS (LOG)", { fs: 9, fill: "#42566a", anchor: "middle", bold: true });
  yl.setAttribute("transform", `rotate(-90 16 ${H / 2})`);

  // diagonales de iso-ratio (citas por documento)
  [[10, "10 citas/doc"], [100, "100 citas/doc"]].forEach(([r, lab]) => {
    const xa = 5000, ya = xa * r, xb = 200000, yb = xb * r;
    const cl = (x, y) => ({ x: U.clamp(sx(x), ML, W - MR), y: U.clamp(sy(y), MT, H - MB) });
    const p1 = cl(xa, ya), p2 = cl(xb, yb);
    el("line", { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: "#7d9bff", "stroke-width": 1, "stroke-dasharray": "4 4" });
    // rótulo sobre el borde superior o derecho, siempre dentro del marco
    const lx = Math.min(p2.x, W - MR - 4), ly = Math.max(p2.y, MT + 4);
    txt(lx, ly + 12, lab, { fs: 8, fill: "#7d9bff", anchor: "end", it: true });
  });

  // etiquetas con anclas manuales (anti-colisión)
  const LABELS = {
    "Notes and Queries": { dx: -8, dy: -10, anchor: "end" },
    "IEEE Trans. on Information Theory": { dx: 10, dy: -8, anchor: "start" },
    "Notes": { dx: 8, dy: 14, anchor: "start" },
    "Lecture Notes in Control and Inf. Sciences": { dx: 10, dy: -8, anchor: "start" },
    "Scientometrics": { dx: 10, dy: 4, anchor: "start" },
    "Scientific Data": { dx: -8, dy: 12, anchor: "end" },
    "Information Processing & Management": { dx: 10, dy: 14, anchor: "start" },
    "Journal of Academic Librarianship": { dx: 10, dy: -8, anchor: "start" },
    "Education and Information Technologies": { dx: 10, dy: -6, anchor: "start" },
    "Telecommunications Policy": { dx: 10, dy: 12, anchor: "start" },
  };

  D.forEach((d, i) => {
    const x = sx(d.docs), y = sy(d.cites);
    const g = el("g", { cursor: "pointer", "data-drill-keep": "" });
    const isNQ = d.j === "Notes and Queries";
    const c = el("circle", { cx: x, cy: y, r: isNQ ? 9 : 6.5, fill: isNQ ? "#c22f4e" : "#2251ff",
      opacity: 0, "fill-opacity": isNQ ? 0.95 : 0.85, stroke: "#ffffff", "stroke-width": 1.5 }, g);
    if (REDUCE) c.setAttribute("opacity", 1);
    else { c.style.transition = `opacity .4s ease ${150 + i * 70}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => c.setAttribute("opacity", 1))); }
    const L = LABELS[d.j];
    const t = txt(x + L.dx, y + L.dy, d.j.length > 32 ? d.j.slice(0, 30) + "…" : d.j,
      { fs: 8.8, fill: isNQ ? "#c22f4e" : "#051c2c", anchor: L.anchor, bold: isNQ });
    g.appendChild(t);
    g.addEventListener("click", e => U.showDrill({
      title: d.j.toUpperCase(), value: `${U.fmt.n(d.docs)} docs · ${U.fmt.n(d.cites)} citas`,
      sub: `${(d.cites / d.docs).toFixed(1)} citas por documento` + (d.q ? ` · ${d.q} en SJR` : "") + (isNQ ? " — la prueba del estudio: máximo output, una década en Q4." : ""),
      source: "K6, K9 · Estudio, Tablas 2–3 · OpenAlex, compilado 2026", x: e.clientX, y: e.clientY }));
  });

  // anotación de la tesis
  txt(sx(341800), sy(126200) - 22, "MÁXIMO OUTPUT · Q4 UNA DÉCADA", { fs: 8.5, fill: "#c22f4e", anchor: "end", bold: true });
})();
