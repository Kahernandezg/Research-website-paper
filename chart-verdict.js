// ═══ §7 · Balanza de veredicto (P18): OA contra APC ═══
// Triple codificación: evidencia por lado (topología), inclinación (peso),
// pesos punteados (condición ausente) + franja de falsación compartida.
(() => {
  const host = document.getElementById("verdict-chart");
  if (!host) return;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = U.frame(host, {
    title: "El veredicto se pesa: evidencia APC a la izquierda, evidencia OA a la derecha",
    sub: "PONDERACIÓN CUALITATIVA — NO ES UN PUNTAJE · PESOS PUNTEADOS = CONDICIONES AÚN NO CUMPLIDAS · CLIC EN CADA PESO",
    src: "Estudio, Discusión y Figuras 2–4 (K4, K5, K10, K15–K19) · compilado 2026",
  });

  const NS = "http://www.w3.org/2000/svg";
  const W = 880, H = 600, PX = 440, PY = 132, TILT = 3.0;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.cssText = "width:100%;height:auto;display:block";
  body.appendChild(svg);
  const el = (t, a, p = svg) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; };
  const txt = (x, y, s, o = {}, p = svg) => {
    const t = el("text", { x, y, "font-family": "Menlo, Consolas, monospace", "font-size": o.fs || 9,
      fill: o.fill || "#42566a", "text-anchor": o.anchor || "middle", "font-weight": o.bold ? 700 : 400,
      "font-style": o.it ? "italic" : "normal" }, p);
    t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke", "#ffffff"); t.setAttribute("stroke-width", 4);
    t.textContent = s; return t;
  };

  const V = RPT.verdict;
  const SHORT_APC = ["48.8% APC", "17/20 APC", "OLIGOPOLIO", "PRESTIGIO"];
  const SHORT_OA = ["42.1% OA", "58–58", "ASIA 21/28", "OPENALEX"];
  const K_APC = ["K4", "K10", "K17", "K17"], K_OA = ["K4", "K5", "K5", "K19"];

  // ── pilar y base ──
  el("path", { d: `M ${PX - 10} 470 L ${PX - 4} ${PY} L ${PX + 4} ${PY} L ${PX + 10} 470 Z`, fill: "#051c2c" });
  el("rect", { x: PX - 90, y: 470, width: 180, height: 8, fill: "#051c2c" });

  // ── viga (rota con retardo tras caer los pesos) ──
  const beamG = el("g", {});
  beamG.style.transformBox = "view-box";
  beamG.style.transformOrigin = `${PX}px ${PY}px`;
  if (!REDUCE) beamG.style.transition = "transform 1.3s cubic-bezier(.3,.7,.3,1) 1.5s";
  el("rect", { x: PX - 225, y: PY - 4, width: 450, height: 7, rx: 3, fill: "#051c2c" }, beamG);
  el("circle", { cx: PX, cy: PY, r: 7, fill: "#ffffff", stroke: "#051c2c", "stroke-width": 2.5 }, beamG);
  const endY = dx => PY + (dx < 0 ? 1 : -1) * Math.sin(TILT * Math.PI / 180) * 225;
  [[-225, "#1233b8"], [225, "#2251ff"]].forEach(([dx, col]) => {
    el("circle", { cx: PX + dx, cy: PY, r: 4, fill: col }, beamG);
  });

  // ── platillos + cadenas + pesos (traslación con la viga, no rotación) ──
  function pan(side, col, items, shorts, ks) {
    const dir = side === "L" ? -1 : 1;
    const ex = PX + dir * 225, ey = endY(dir * 225);
    const g = el("g", {});
    if (!REDUCE) g.style.transition = "transform 1.3s cubic-bezier(.3,.7,.3,1) 1.5s";
    g.dataset.dy = (ey - PY).toFixed(1);
    // cadenas
    for (let c = -1; c <= 1; c++) {
      el("line", { x1: ex, y1: ey, x2: ex + c * 34, y2: ey + 74, stroke: "#42566a", "stroke-width": 1.2 }, g);
    }
    // platillo
    el("path", { d: `M ${ex - 52} ${ey + 74} A 52 26 0 0 0 ${ex + 52} ${ey + 74} L ${ex + 46} ${ey + 74} A 46 20 0 0 1 ${ex - 46} ${ey + 74} Z`,
      fill: "#eef1f6", stroke: "#051c2c", "stroke-width": 1.4 }, g);
    // pesos apilados hacia arriba desde el platillo
    items.forEach((full, i) => {
      const wpx = 74 - i * 6, hh = 20;
      const wy = ey + 74 - (i + 1) * (hh + 3);
      const wg = el("g", { cursor: "pointer", "data-drill-keep": "" }, g);
      if (!REDUCE) { wg.style.opacity = 0; wg.style.transition = `opacity .4s ease ${200 + i * 220}ms, transform .5s cubic-bezier(.2,1.4,.4,1) ${200 + i * 220}ms`; wg.style.transform = "translateY(-26px)"; }
      el("path", { d: `M ${ex - wpx * 0.3} ${wy} L ${ex + wpx * 0.3} ${wy} L ${ex + wpx / 2} ${wy + hh} L ${ex - wpx / 2} ${wy + hh} Z`,
        fill: col, stroke: "#051c2c", "stroke-width": 1 }, wg);
      el("circle", { cx: ex, cy: wy - 4, r: 3.2, fill: col, stroke: "#051c2c", "stroke-width": 1 }, wg);
      const lx = side === "L" ? ex - wpx / 2 - 10 : ex + wpx / 2 + 10;
      txt(lx, wy + hh / 2 + 3, shorts[i], { fs: 8.6, fill: col, anchor: side === "L" ? "end" : "start", bold: true }, wg);
      wg.addEventListener("click", e => U.showDrill({
        title: (side === "L" ? "EVIDENCIA APC" : "EVIDENCIA OA"), value: shorts[i],
        sub: full, source: ks[i] + " · Estudio, Discusión · compilado 2026", x: e.clientX, y: e.clientY }));
    });
    // rótulo del platillo
    txt(ex, ey + 112, side === "L" ? "DOMINIO APC" : "IMPULSO OA", { fs: 10, fill: col, bold: true }, g);
    return g;
  }
  const panL = pan("L", "#1233b8", V.apc, SHORT_APC, K_APC);
  const panR = pan("R", "#2251ff", V.oa, SHORT_OA, K_OA);

  // ── pesos punteados: disparadores que aún no aterrizan (flotan junto al fulcro) ──
  [[PX - 150, "L"], [PX + 150, "R"]].forEach(([hx, side], hi) => {
    V.triggers.slice(hi === 0 ? 0 : 1, hi === 0 ? 2 : 3).forEach((tr, i) => {
      const y = 56 + i * 34, wpx = 58;
      const g = el("g", { cursor: "pointer", "data-drill-keep": "" });
      el("path", { d: `M ${hx - wpx * 0.3} ${y} L ${hx + wpx * 0.3} ${y} L ${hx + wpx / 2} ${y + 16} L ${hx - wpx / 2} ${y + 16} Z`,
        fill: "rgba(255,255,255,.6)", stroke: "#8595a6", "stroke-width": 1.2, "stroke-dasharray": "4 3" }, g);
      el("line", { x1: hx + (side === "L" ? -wpx / 2 : wpx / 2), y1: y + 8,
        x2: side === "L" ? PX - 205 : PX + 205, y2: side === "L" ? endY(-225) + 34 : endY(225) + 34,
        stroke: "#8595a6", "stroke-width": 0.8, "stroke-dasharray": "2 4" }, g);
      txt(hx, y - 7, "DISPARADOR", { fs: 7, fill: "#8595a6", bold: true }, g);
      g.addEventListener("click", e => U.showDrill({
        title: "CONDICIÓN AÚN NO CUMPLIDA", value: "peso en suspenso",
        sub: tr + ". La lectura solo se actualiza cuando la condición aterriza en el platillo.",
        source: "Estudio, Discusión y limitaciones · 2026", x: e.clientX, y: e.clientY }));
    });
  });

  // ── dial del fulcro: aguja detenida en la zona APC ──
  const dial = el("g", {});
  el("path", { d: `M ${PX - 34} ${PY + 34} A 40 40 0 0 1 ${PX + 34} ${PY + 34}`, fill: "none", stroke: "#dbe2ea", "stroke-width": 5 }, dial);
  [["OA", -30], ["EQUILIBRIO", 0], ["APC", 30]].forEach(([z, a]) => {
    const rad = (a - 90) * Math.PI / 180;
    txt(PX + Math.cos(rad) * 52, PY + 34 + Math.sin(rad) * 52 + 3, z, { fs: 6.8, fill: "#8595a6" }, dial);
  });
  const needle = el("line", { x1: PX, y1: PY + 34, x2: PX, y2: PY + 4, stroke: "#1233b8", "stroke-width": 2.4 }, dial);
  needle.style.transformBox = "view-box";
  needle.style.transformOrigin = `${PX}px ${PY + 34}px`;
  if (!REDUCE) needle.style.transition = "transform 1.3s cubic-bezier(.3,.7,.3,1) 1.5s";

  // ── placa de lectura sobre el pilar ──
  const plq = el("g", {});
  el("rect", { x: PX - 96, y: 238, width: 192, height: 74, fill: "#ffffff", stroke: "#051c2c", "stroke-width": 1.4 }, plq);
  txt(PX, 256, "LECTURA ACTUAL", { fs: 7.5, fill: "#8595a6", bold: true }, plq);
  ["COEXISTENCIA EQUILIBRADA", "CON NÚCLEO APC"].forEach((s, i) =>
    txt(PX, 272 + i * 13, s, { fs: 9.5, fill: "#051c2c", bold: true }, plq));
  txt(PX, 302, "el OA avanza; aún no lidera el centro", { fs: 7.6, fill: "#42566a", it: true }, plq);

  // ── franja de falsación compartida ──
  const fy = 520;
  const defs = el("defs", {});
  const pat = el("pattern", { id: "hatchR", width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
  el("rect", { width: 8, height: 8, fill: "rgba(194,47,78,.12)" }, pat);
  el("line", { x1: 0, y1: 0, x2: 0, y2: 8, stroke: "rgba(194,47,78,.5)", "stroke-width": 1.6 }, pat);
  el("rect", { x: 30, y: fy, width: W - 60, height: 46, fill: "url(#hatchR)", stroke: "#c22f4e", "stroke-width": 1.2 });
  txt(44, fy - 8, "FALSACIÓN COMPARTIDA · EL VEREDICTO SE REVISA SI OCURRE:", { fs: 8, fill: "#c22f4e", anchor: "start", bold: true });
  V.falsificacion.forEach((f, i) => {
    const fx = 52 + i * ((W - 110) / 3), fw = (W - 110) / 3 - 16;
    const g = el("g", { cursor: "pointer", "data-drill-keep": "" });
    el("rect", { x: fx, y: fy + 9, width: fw, height: 28, fill: "#ffffff", stroke: "#c22f4e", "stroke-width": 1 }, g);
    const short = f.length > 44 ? f.slice(0, 42) + "…" : f;
    txt(fx + fw / 2, fy + 26, short, { fs: 7.4, fill: "#c22f4e" }, g);
    g.addEventListener("click", e => U.showDrill({
      title: "FRANJA DE FALSACIÓN", value: "condición de revisión",
      sub: f, source: "Estudio, Discusión · 2026", x: e.clientX, y: e.clientY }));
  });

  // ── animación: pesos caen → viga inclina → aguja ──
  const fire = () => {
    svg.querySelectorAll("[data-dy]").forEach(g => g.style.transform = `translateY(${g.dataset.dy}px)`);
    beamG.style.transform = `rotate(${-TILT}deg)`;   // sentido antihorario: el lado APC (izq.) baja
    needle.style.transform = "rotate(11deg)";
    svg.querySelectorAll("g[style*='translateY(-26px)']").forEach(g => { g.style.opacity = 1; g.style.transform = "translateY(0)"; });
  };
  if (REDUCE) fire();
  else new IntersectionObserver((es, io) => es.forEach(e => { if (e.isIntersecting) { fire(); io.disconnect(); } }),
    { threshold: 0.25 }).observe(svg);
})();
