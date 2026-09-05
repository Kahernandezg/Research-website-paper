// ═══ §3 · Ranking de citación (escala log) + la periferia en su propia escala ═══
(() => {
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NS = "http://www.w3.org/2000/svg";
  const mk = (host, W, H) => {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.style.cssText = "width:100%;height:auto;display:block";
    host.appendChild(svg); return svg;
  };
  const el = (t, a, p) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; };
  const txt = (svg, x, y, s, o = {}) => {
    const t = el("text", { x, y, "font-family": "Menlo, Consolas, monospace", "font-size": o.fs || 10,
      fill: o.fill || "#42566a", "text-anchor": o.anchor || "start", "font-weight": o.bold ? 700 : 400,
      "font-style": o.it ? "italic" : "normal" }, svg);
    t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke", "#ffffff"); t.setAttribute("stroke-width", 4);
    t.textContent = s; return t;
  };

  // ── A · Top 20 (log) ──
  (() => {
    const host = document.getElementById("cited-chart");
    if (!host) return;
    const body = U.frame(host, {
      title: "Veinte revistas, un orden jerárquico: el líder cuadruplica al segundo",
      sub: "ESCALA LOGARÍTMICA · AZUL = AMÉRICA · TINTA = EUROPA · CLIC EN CADA BARRA PARA VER SU BASE",
      src: "Estudio, Tabla 2 (K6, K7) · OpenAlex, compilado 2026",
    });
    const W = 880, RH = 26.5, TOP = 30, H = TOP + 20 * RH + 44;
    const svg = mk(body, W, H);
    const X0 = 252, X1 = 760;
    const lo = Math.log10(60000), hi = Math.log10(1500000);
    const sx = v => X0 + (Math.log10(v) - lo) / (hi - lo) * (X1 - X0);

    // guías de década
    [100000, 300000, 1000000].forEach(v => {
      el("line", { x1: sx(v), y1: TOP - 8, x2: sx(v), y2: TOP + 20 * RH + 6, stroke: "#eef1f6", "stroke-width": 1 }, svg);
      txt(svg, sx(v), TOP - 12, v >= 1000000 ? "1M" : (v / 1000) + "K", { fs: 8.5, fill: "#8595a6", anchor: "middle" });
    });

    RPT.cited_top20.forEach((j, i) => {
      const y = TOP + i * RH;
      const g = el("g", { cursor: "pointer", "data-drill-keep": "" }, svg);
      // nombre
      const nm = el("text", { x: X0 - 10, y: y + RH / 2 + 3.5, "text-anchor": "end",
        "font-family": '"et-book", Palatino, Georgia, serif', "font-size": i === 0 ? 12.5 : 11,
        "font-weight": i === 0 ? 700 : 400, fill: "#051c2c" }, g);
      nm.textContent = j.j.length > 30 ? j.j.slice(0, 28) + "…" : j.j;
      const col = j.reg === "América" ? "#2251ff" : "#051c2c";
      const bar = el("rect", { x: X0, y: y + 4, width: sx(j.cites) - X0, height: RH - 9, fill: col,
        opacity: i === 0 ? 1 : 0.88 }, g);
      if (!REDUCE) {
        const wT = sx(j.cites) - X0;
        bar.setAttribute("width", 0);
        bar.style.transition = `width .7s cubic-bezier(.2,.7,.3,1) ${i * 55}ms`;
        setTimeout(() => bar.setAttribute("width", wT), 60);
      }
      txt(svg, sx(j.cites) + 7, y + RH / 2 + 3.5, U.fmt.n(j.cites), { fs: 9.5, fill: col, bold: i < 3 });
      txt(svg, sx(j.cites) + 7 + ctxW(U.fmt.n(j.cites)) + 10, y + RH / 2 + 3.5, j.c, { fs: 8, fill: "#8595a6" });
      if (i === 0) txt(svg, X0 + 8, y + RH / 2 + 3.5, "4.4× EL SEGUNDO · EFECTO MATEO", { fs: 8.5, fill: "#ffffff", bold: true })
        .setAttribute("stroke", "none");
      g.addEventListener("click", e => U.showDrill({
        title: `#${j.r} · ${j.j.toUpperCase()}`, value: U.fmt.n(j.cites) + " citas",
        sub: `${j.c} · ${j.reg}. ${j.r === 1 ? "Caso limítrofe disciplinariamente: evidencia la permeabilidad entre la teoría matemática de la información y los estudios métricos." : "Ranking de las 20 revistas más citadas del corpus LIS."}`,
        source: "K6 · Estudio, Tabla 2 · OpenAlex, compilado 2026", x: e.clientX, y: e.clientY }));
    });
    function ctxW(s) { return s.length * 6.1; }

    // nota de concentración por país
    txt(svg, X0, H - 14, "REINO UNIDO 13 (65%) · EE.UU. 4 (20%) · ALEMANIA 1 · HUNGRÍA 1 · PAÍSES BAJOS 1 — CONCENTRACIÓN ANGLOSAJONA PRONUNCIADA",
      { fs: 8.8, fill: "#8595a6" });
  })();

  // ── B · La periferia: otra escala ──
  (() => {
    const host = document.getElementById("periphery-chart");
    if (!host) return;
    const body = U.frame(host, {
      title: "La periferia cita en otra escala: la mejor iberoamericana vale 0.5% del líder",
      sub: "ESCALA LINEAL LOCAL · LA MARCA PUNTEADA INDICA DÓNDE QUEDARÍA EL LÍDER (190× FUERA DEL MARCO) · CLIC EN CADA BARRA",
      src: "Estudio, Resultados (K8) · OpenAlex, compilado 2026",
    });
    const W = 880, RH = 40, TOP = 26, H = TOP + RPT.periphery.length * RH + 46;
    const svg = mk(body, W, H);
    const X0 = 300, X1 = 780, vmax = 7600;
    const sx = v => X0 + v / vmax * (X1 - X0);

    RPT.periphery.forEach((j, i) => {
      const y = TOP + i * RH;
      const g = el("g", { cursor: "pointer", "data-drill-keep": "" }, svg);
      const nm = el("text", { x: X0 - 10, y: y + RH / 2 - 1, "text-anchor": "end",
        "font-family": '"et-book", Palatino, Georgia, serif', "font-size": 11.5, fill: "#051c2c" }, g);
      nm.textContent = j.j.length > 42 ? j.j.slice(0, 40) + "…" : j.j;
      txt(svg, X0 - 10, y + RH / 2 + 12, j.c, { fs: 8.5, fill: "#8595a6", anchor: "end" });
      const bar = el("rect", { x: X0, y: y + 8, width: sx(j.cites) - X0, height: RH - 20, fill: "#1233b8", opacity: 0.9 }, g);
      if (!REDUCE) {
        const wT = sx(j.cites) - X0; bar.setAttribute("width", 0);
        bar.style.transition = `width .6s cubic-bezier(.2,.7,.3,1) ${i * 70}ms`;
        setTimeout(() => bar.setAttribute("width", wT), 60);
      }
      txt(svg, sx(j.cites) + 7, y + RH / 2 + 2, U.fmt.n(j.cites), { fs: 10, fill: "#1233b8", bold: true });
      const ratio = (1367000 / j.cites).toFixed(0);
      if (sx(j.cites) < 620)
        txt(svg, sx(j.cites) + 7 + U.fmt.n(j.cites).length * 6.1 + 10, y + RH / 2 + 2, `el líder cita ${U.fmt.n(+ratio)}× más`, { fs: 8, fill: "#8595a6", it: true });
      g.addEventListener("click", e => U.showDrill({
        title: j.j.toUpperCase(), value: U.fmt.n(j.cites) + " citas",
        sub: `${j.c}. Juntas, las revistas periféricas concentran solo el 37.58% de los títulos del corpus — desventaja estructural en redes dominadas por el inglés, no menor calidad (Canagarajah, 2002; Alperin et al., 2021).`,
        source: "K8, K16 · Estudio, Resultados · OpenAlex, compilado 2026", x: e.clientX, y: e.clientY }));
    });

    // marca fantasma del líder: fuera de escala
    const gy = TOP + RPT.periphery.length * RH + 12;
    el("line", { x1: X0, y1: gy, x2: X1 + 30, y2: gy, stroke: "#c22f4e", "stroke-width": 1.4, "stroke-dasharray": "5 5" }, svg);
    el("path", { d: `M ${X1 + 30} ${gy - 5} l 12 5 l -12 5 z`, fill: "#c22f4e" }, svg);
    txt(svg, X0, gy + 16, "IEEE TRANS. ON INFORMATION THEORY · 1,367,000 CITAS → 190× FUERA DE ESTA ESCALA", { fs: 8.5, fill: "#c22f4e", bold: true });
  })();
})();
