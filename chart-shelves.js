// ═══ §2 · Estanterías regionales: 1 lomo = 2 revistas ═══
// El objeto es la unidad de medida: cada lomo vale por 2 revistas; el color
// marca el modelo de acceso donde el estudio lo reporta (OA >50%).
(() => {
  const host = document.getElementById("shelf-chart");
  if (!host) return;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = U.frame(host, {
    title: "Europa llena tres estantes y medio; África y Oceanía, un solo lomo",
    sub: "1 LOMO = 2 REVISTAS · AZUL = TÍTULOS >50% OA (DONDE EL ESTUDIO LO REPORTA) · CLIC EN CADA ESTANTE",
    src: "Estudio, Figura 2 (K3–K5) · OpenAlex, compilado 2026",
  });

  const NS = "http://www.w3.org/2000/svg";
  const W = 880, ROWH = 74, TOP = 34;
  const rows = RPT.regions;
  const H = TOP + rows.length * ROWH + 118;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.cssText = "width:100%;height:auto;display:block";
  body.appendChild(svg);
  const el = (t, a, p = svg) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; };
  const txt = (x, y, s, o = {}) => {
    const t = el("text", { x, y, "font-family": "Menlo, Consolas, monospace", "font-size": o.fs || 10,
      fill: o.fill || "#42566a", "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 400 });
    t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke", "#ffffff"); t.setAttribute("stroke-width", 4);
    t.textContent = s; return t;
  };

  const X0 = 148, X1 = 792;                      // zona de lomos
  const rng = U.makeRng(31);
  const maxSpines = Math.ceil(176 / 2);
  const slot = (X1 - X0) / maxSpines;            // paso constante: escala común

  rows.forEach((r, i) => {
    const y = TOP + i * ROWH;
    const g = el("g", { cursor: "pointer", "data-drill-keep": "" });
    // rótulo regional
    const nm = el("text", { x: 8, y: y + 30, "font-family": '"et-book", Palatino, Georgia, serif',
      "font-size": 15, "font-weight": 700, fill: "#051c2c" });
    nm.textContent = r.name; g.appendChild(nm);
    txt(8, y + 46, `${r.n} · ${r.pct.toFixed(2)}%`, { fs: 9.5 });
    // tabla del estante
    el("line", { x1: X0 - 8, y1: y + 56, x2: X1 + 8, y2: y + 56, stroke: "#051c2c", "stroke-width": 2.5 }, g);
    el("line", { x1: X0 - 8, y1: y + 56, x2: X0 - 8, y2: y + 62, stroke: "#051c2c", "stroke-width": 2.5 }, g);
    el("line", { x1: X1 + 8, y1: y + 56, x2: X1 + 8, y2: y + 62, stroke: "#051c2c", "stroke-width": 2.5 }, g);
    // lomos: primero los OA (azul), después el resto (tinta)
    const nSp = Math.round(r.n / 2);
    const oaSp = r.oa_known ? Math.round(r.oa / 2) : 0;
    for (let s = 0; s < nSp; s++) {
      const hSp = 26 + rng() * 16;
      const rect = el("rect", { x: X0 + s * slot, y: y + 56 - hSp, width: Math.max(1.6, slot - 2.4), height: hSp,
        rx: 1, fill: s < oaSp ? "#2251ff" : (r.oa_known ? "#42566a" : "#8595a6") }, g);
      if (!REDUCE) {
        rect.style.opacity = 0; rect.style.transition = `opacity .3s ease ${120 + s * 14}ms`;
      }
    }
    if (!r.oa_known) txt(X0 + nSp * slot + 8, y + 40, "desglose OA s/d", { fs: 8, fill: "#c22f4e" });
    // lectura a la derecha
    txt(X1 + 14, y + 34, `${r.n}`, { fs: 15, fill: "#051c2c", bold: true });
    if (r.oa_known) txt(X1 + 14, y + 50, `${r.oa} OA`, { fs: 9, fill: "#2251ff", bold: true });

    g.addEventListener("click", e => {
      const s = window.SRC[r.oa_known ? "K5" : "K3"];
      U.showDrill({ title: "REVISTAS · " + r.name.toUpperCase(), value: `${r.n} revistas`,
        sub: `${r.pct.toFixed(2)}% del corpus de 338.` + (r.oa_known ? ` De ellas, ${r.oa} operan >50% en acceso abierto.` : " El estudio no desglosa su modelo de acceso."),
        source: `${r.oa_known ? "K3, K5" : "K3"} · ${s ? s.cite : "Estudio, Figura 2"}`, x: e.clientX, y: e.clientY });
    });
    svg.appendChild(g);
    if (!REDUCE) requestAnimationFrame(() => requestAnimationFrame(() =>
      g.querySelectorAll("rect").forEach(rc => rc.style.opacity = 1)));
  });

  // ── franja agregada de modelos de acceso (142 / 165 / 31) ──
  const ay = TOP + rows.length * ROWH + 30;
  txt(8, ay - 8, "MODELO DE ACCESO DEL CORPUS COMPLETO", { fs: 9, fill: "#8595a6", bold: true });
  const tot = 338, ax0 = 8, ax1 = 872;
  let acc = ax0;
  const parts = [
    { k: "oa", n: 142, col: "#2251ff", lab: "142 · >50% OA (42.1%)" },
    { k: "apc", n: 165, col: "#051c2c", lab: "165 · APC <20% (48.8%)" },
    { k: "hybrid", n: 31, col: "#7d9bff", lab: "31 · híbridas" },
  ];
  parts.forEach(p => {
    const wpx = (ax1 - ax0) * p.n / tot;
    const g = el("g", { cursor: "pointer", "data-drill-keep": "" });
    const rect = el("rect", { x: acc, y: ay, width: wpx - 2, height: 26, fill: p.col }, g);
    if (!REDUCE) { rect.style.opacity = 0; rect.style.transition = "opacity .5s ease .4s";
      requestAnimationFrame(() => requestAnimationFrame(() => rect.style.opacity = 1)); }
    txt(acc + 6, ay + 44, p.lab, { fs: 9.5, fill: p.col === "#7d9bff" ? "#42566a" : p.col, bold: true });
    g.addEventListener("click", e => U.showDrill({
      title: "MODELO DE ACCESO · " + p.lab.split("·")[1].trim().toUpperCase(), value: `${p.n} revistas`,
      sub: "Coexistencia equilibrada entre suscripción/APC y acceso abierto; el estudio pregunta qué tan costoso o lucrativo es sostener una revista de alto impacto para las grandes editoriales.",
      source: "K4 · Estudio, Figura 2 · OpenAlex, compilado 2026", x: e.clientX, y: e.clientY }));
    acc += wpx;
  });
  txt(8, ay + 66, "América y Europa empatan 58–58 en títulos >50% OA · Asia: 21 de 28 en acceso abierto", { fs: 9, fill: "#8595a6", it: true });
})();
