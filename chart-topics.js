// ═══ §6 · Mapa de co-ocurrencia temática (Figura 4 del estudio) ═══
// Burbujas = topics de OpenAlex; tamaño = frecuencia temática; posición y
// enlaces derivados de la descripción del paper (núcleo denso, Library Science a la izquierda).
(() => {
  const host = document.getElementById("topics-chart");
  if (!host) return;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = U.frame(host, {
    title: "El núcleo temático habla de tecnología y gestión; Library Science queda al margen",
    sub: "TAMAÑO = FRECUENCIA TEMÁTICA · ENLACES = CO-OCURRENCIA DESCRITA · ROMBO PUNTEADO = SIN CIFRA EN EL ESTUDIO · CLIC EN CADA NODO",
    src: "Estudio, Figura 4 (K12–K14) · OpenAlex topics, umbral ≥2 co-ocurrencias, relevancia ≥0.5 · compilado 2026",
  });

  const NS = "http://www.w3.org/2000/svg";
  const W = 880, H = 560;
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.style.cssText = "width:100%;height:auto;display:block";
  body.appendChild(svg);
  const el = (t, a, p = svg) => { const n = document.createElementNS(NS, t); for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; };
  const txt = (x, y, s, o = {}) => {
    const t = el("text", { x, y, "font-family": "Menlo, Consolas, monospace", "font-size": o.fs || 9,
      fill: o.fill || "#42566a", "text-anchor": o.anchor || "middle", "font-weight": o.bold ? 700 : 400 });
    t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke", "#ffffff"); t.setAttribute("stroke-width", 4);
    t.textContent = s; return t;
  };

  // posiciones según la descripción del paper: scien­tometrics centro-inferior;
  // tecnología/gestión centro; sociedad digital cuadrante superior-central; LS extremo izquierdo
  const POS = {
    "Technology Adoption and User Behaviour": [440, 268],
    "Scientometrics and Bibliometrics Research": [430, 400],
    "Digital Marketing and Social Media": [560, 170],
    "Social Media and Politics": [430, 120],
    "E-Government and Public Services": [660, 260],
    "Knowledge Management and Sharing": [610, 390],
    "Customer Service Quality and Loyalty": [730, 450],
    "Innovative Human-Technology Interaction": [270, 190],
    "Online Learning and Analytics": [300, 330],
    "Library Science and Information Literacy": [92, 250],
    "Library Science and Administration": [80, 390],
  };
  const DCOL = {
    "Information Science": "#2251ff", "Other": "#051c2c", "Management": "#42566a",
    "Computer Science": "#7d9bff", "Library Science": "#1233b8", "Data Science": "#7d9bff",
    "Knowledge Management": "#42566a",
  };
  const N = {};
  RPT.topics.forEach(t => {
    N[t.name] = { ...t, xy: POS[t.name], r: t.freq ? 7 + Math.sqrt(t.freq) * 3.1 : 12 };
  });

  // enlaces derivados de las relaciones descritas en el texto
  const LINKS = [
    ["Scientometrics and Bibliometrics Research", "Technology Adoption and User Behaviour", 1],
    ["Scientometrics and Bibliometrics Research", "Online Learning and Analytics", 0.6],
    ["Scientometrics and Bibliometrics Research", "Knowledge Management and Sharing", 0.6],
    ["Technology Adoption and User Behaviour", "Digital Marketing and Social Media", 1],
    ["Technology Adoption and User Behaviour", "Social Media and Politics", 0.8],
    ["Technology Adoption and User Behaviour", "E-Government and Public Services", 0.8],
    ["Technology Adoption and User Behaviour", "Innovative Human-Technology Interaction", 0.7],
    ["Technology Adoption and User Behaviour", "Online Learning and Analytics", 0.7],
    ["Digital Marketing and Social Media", "Social Media and Politics", 0.8],
    ["Digital Marketing and Social Media", "E-Government and Public Services", 0.6],
    ["Knowledge Management and Sharing", "Customer Service Quality and Loyalty", 0.9],
    ["Knowledge Management and Sharing", "Technology Adoption and User Behaviour", 0.8],
    ["Innovative Human-Technology Interaction", "Online Learning and Analytics", 0.7],
    ["Library Science and Information Literacy", "Library Science and Administration", 0.5],
    ["Library Science and Information Literacy", "Scientometrics and Bibliometrics Research", 0.25],
  ];
  LINKS.forEach(([a, b, wgt]) => {
    const A = N[a], B2 = N[b];
    el("line", { x1: A.xy[0], y1: A.xy[1], x2: B2.xy[0], y2: B2.xy[1],
      stroke: "#8595a6", "stroke-width": wgt * 1.6, opacity: 0.45,
      "stroke-dasharray": wgt < 0.4 ? "3 5" : "none" });
  });

  // rótulo de la zona periférica
  txt(100, 470, "PERIFERIA TEMÁTICA", { fs: 8, fill: "#c22f4e", bold: true });
  txt(100, 482, "baja co-ocurrencia con el núcleo", { fs: 7.5, fill: "#8595a6" });
  el("line", { x1: 150, y1: 250, x2: 380, y2: 380, stroke: "#c22f4e", "stroke-width": 0.8,
    "stroke-dasharray": "2 5", opacity: 0.4 });

  const LNAME = {
    "Technology Adoption and User Behaviour": ["Technology Adoption", "& User Behaviour"],
    "Scientometrics and Bibliometrics Research": ["Scientometrics &", "Bibliometrics Research"],
    "Digital Marketing and Social Media": ["Digital Marketing", "& Social Media"],
    "Social Media and Politics": ["Social Media", "& Politics"],
    "E-Government and Public Services": ["E-Government &", "Public Services"],
    "Knowledge Management and Sharing": ["Knowledge Mgmt", "& Sharing"],
    "Customer Service Quality and Loyalty": ["Customer Service", "Quality & Loyalty"],
    "Innovative Human-Technology Interaction": ["Innovative Human-", "Technology Interaction"],
    "Online Learning and Analytics": ["Online Learning", "& Analytics"],
    "Library Science and Information Literacy": ["Library Science &", "Information Literacy"],
    "Library Science and Administration": ["Library Science", "& Administration"],
  };

  Object.values(N).forEach((n, i) => {
    const g = el("g", { cursor: "pointer", "data-drill-keep": "" });
    const [x, y] = n.xy;
    const hollow = n.domain === "Library Science";
    const c = el("circle", { cx: x, cy: y, r: n.r,
      fill: n.freq == null ? "none" : (hollow ? "rgba(18,51,184,.10)" : DCOL[n.domain]),
      "fill-opacity": hollow ? 1 : 0.88,
      stroke: n.freq == null ? "#c22f4e" : DCOL[n.domain], "stroke-width": hollow || n.freq == null ? 1.8 : 1,
      "stroke-dasharray": n.freq == null ? "4 4" : "none", opacity: 0 }, g);
    if (REDUCE) c.setAttribute("opacity", 1);
    else { c.style.transition = `opacity .45s ease ${140 + i * 65}ms`;
      requestAnimationFrame(() => requestAnimationFrame(() => c.setAttribute("opacity", 1))); }
    const [l1, l2] = LNAME[n.name];
    const ly = y + n.r + 14;
    txt(x, ly, l1, { fs: 8.6, fill: "#051c2c", bold: true });
    txt(x, ly + 11, l2, { fs: 8.6, fill: "#051c2c", bold: true });
    txt(x, ly + 23, n.freq != null ? `freq ${n.freq} · rel ${n.rel}% · ${n.journals} rev.` : "sin cifra en el estudio",
      { fs: 7.6, fill: n.freq != null ? "#8595a6" : "#c22f4e" });
    g.addEventListener("click", e => U.showDrill({
      title: n.name.toUpperCase(),
      value: n.freq != null ? `frecuencia ${n.freq}` : "s/d",
      sub: `Dominio ${n.domain}.` + (n.freq != null ? ` Relevancia promedio ${n.rel}%; vinculado a ${n.journals} revistas del núcleo.` : " El estudio lo nombra entre los nodos prominentes del dominio «Other» pero no publica su frecuencia.") +
        (hollow ? " Posición periférica: marginalización temática respecto a los tópicos dominantes." : ""),
      source: "K12, K13 · Estudio, Figura 4 · OpenAlex topics, compilado 2026", x: e.clientX, y: e.clientY }));
  });

  // leyenda de dominios con conteos reales
  const ly0 = H - 26;
  let lx = 12;
  txt(lx, ly0, "DOMINIOS (N TÓPICOS):", { fs: 8, fill: "#8595a6", anchor: "start", bold: true });
  lx += 128;
  const SHORT_D = { "Other": "Other", "Computer Science": "CompSci", "Information Science": "InfoSci",
    "Management": "Mgmt", "Data Science": "DataSci", "Library Science": "LibSci", "Knowledge Management": "KM" };
  RPT.topic_domains.forEach(d => {
    el("circle", { cx: lx + 5, cy: ly0 - 3.5, r: 4.5, fill: DCOL[d.d] });
    const t = txt(lx + 14, ly0, `${SHORT_D[d.d]} ${d.n}`, { fs: 8, fill: "#42566a", anchor: "start" });
    lx += 14 + t.getComputedTextLength() + 14;
  });
})();
