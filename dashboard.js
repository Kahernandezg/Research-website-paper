// ═══ Rail persistente de contexto (P14) ═══
// Canvas fijo a la derecha: dónde estás en el estudio, la cifra madre de la
// sección y cuatro lecturas rápidas. Todo clicable hacia su ficha.
(() => {
  const rail = document.getElementById("dash-rail");
  const cv = document.getElementById("dash-canvas");
  if (!rail || !cv) return;
  const B = U.bindCanvas(cv);

  const WINS = {
    resumen:      { no: "§0", t: "Resumen",      big: "338",     lab: "REVISTAS LIS CURADAS",
      st: [["20", "núcleo Top citación"], ["5", "corrientes disciplinares"], ["52.1%", "títulos en Europa"], ["42.1%", ">50% acceso abierto"]], k: "K1" },
    corpus:       { no: "§1", t: "El corpus",    big: "338",     lab: "REVISTAS EN LA RED",
      st: [["176", "Europa"], ["126", "América"], ["28", "Asia"], ["2", "África + Oceanía"]], k: "K3" },
    geografia:    { no: "§2", t: "Geografía",    big: "52.07%",  lab: "DEL CORPUS ES EUROPEO",
      st: [["142", "revistas >50% OA"], ["165", "revistas con APC"], ["58–58", "paridad OA América–Europa"], ["21/28", "Asia en OA"]], k: "K3" },
    citacion:     { no: "§3", t: "Citación",     big: "1.37M",   lab: "CITAS DEL LÍDER",
      st: [["4.4×", "sobre la 2ª (efecto Mateo)"], ["13", "revistas del Reino Unido"], ["4", "de EE.UU."], ["0", "iberoamericanas en Top 20"]], k: "K6" },
    productividad:{ no: "§4", t: "Productividad",big: "341,800", lab: "DOCS DE LA MÁS PROLÍFICA",
      st: [["85%", "del Top 20 cobra APC"], ["15%", "acceso abierto pleno"], ["20,160", "docs IEEE Trans."], ["Q4", "N&Q una década"]], k: "K9" },
    cuartiles:    { no: "§5", t: "Cuartiles",    big: "13",      lab: "REVISTAS Q1 ESTABLES",
      st: [["2017", "J. Information Science → Q1"], ["2021", "Telecom. Policy → Q1"], ["2021", "Personal & Ubiq. → Q1"], ["10 años", "N&Q sin salir de Q4"]], k: "K11" },
    temas:        { no: "§6", t: "Temas",        big: "111",     lab: "FREQ. MÁXIMA (TECH ADOPTION)",
      st: [["31", "tópicos «Other»"], ["18", "Computer Science"], ["15", "Information Science"], ["2", "Library Science"]], k: "K12" },
    veredicto:    { no: "§7", t: "Veredicto",    big: "48.8%",   lab: "DEL CORPUS OPERA CON APC",
      st: [["42.1%", ">50% acceso abierto"], ["31", "revistas híbridas"], ["58–58", "paridad OA EU–AM"], ["s/d", "costos reales de APC"]], k: "K4" },
  };
  const ORDER = ["resumen", "corpus", "geografia", "citacion", "productividad", "cuartiles", "temas", "veredicto"];
  let win = "resumen", fade = 1;

  function draw() {
    const { w, h } = B.fit();
    const ctx = B.ctx;
    const W = WINS[win];
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = fade;
    const X = 34;

    // insignia de ventana
    ctx.strokeStyle = "#051c2c"; ctx.lineWidth = 1.6;
    ctx.strokeRect(X, 40, 108, 30);
    ctx.font = '700 12px Menlo, Consolas, monospace'; ctx.fillStyle = "#051c2c";
    ctx.fillText(W.no + " / 7", X + 10, 59);
    ctx.font = '700 21px "et-book", Palatino, Georgia, serif';
    ctx.fillText(W.t, X, 104);
    ctx.font = '10px Menlo, Consolas, monospace'; ctx.fillStyle = "#8595a6";
    ctx.fillText("CONCLUSIÓN PRIMERO · CIFRA MADRE DE LA SECCIÓN", X, 124);

    // barra de fases (8 secciones)
    ORDER.forEach((o, i) => {
      const segW = (w - X * 2) / ORDER.length;
      ctx.fillStyle = o === win ? "#2251ff" : "#dbe2ea";
      ctx.fillRect(X + i * segW, 140, segW - 5, o === win ? 5 : 2.5);
    });

    // cifra madre
    ctx.font = '700 46px Menlo, Consolas, monospace'; ctx.fillStyle = "#2251ff";
    ctx.fillText(W.big, X, 216);
    ctx.font = '9.5px Menlo, Consolas, monospace'; ctx.fillStyle = "#42566a";
    ctx.fillText(W.lab, X, 238);

    // cuatro bloques de lectura
    W.st.forEach(([v, l], i) => {
      const y = 278 + i * 62;
      ctx.strokeStyle = "#eef1f6"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X, y - 20); ctx.lineTo(w - X, y - 20); ctx.stroke();
      ctx.font = '700 17px Menlo, Consolas, monospace'; ctx.fillStyle = i === 0 ? "#1233b8" : "#051c2c";
      ctx.fillText(v, X, y + 6);
      ctx.font = '9px Menlo, Consolas, monospace'; ctx.fillStyle = "#8595a6";
      ctx.fillText(l.toUpperCase(), X, y + 24);
    });

    // mini-estantería regional (constante)
    const by = Math.min(h - 150, 560);
    ctx.font = '9px Menlo, Consolas, monospace'; ctx.fillStyle = "#8595a6";
    ctx.fillText("DISTRIBUCIÓN DEL CORPUS POR REGIÓN (N = 338)", X, by - 10);
    const tot = 338, bw = w - X * 2;
    let bx = X;
    const cols = { "Europa": "#051c2c", "América": "#2251ff", "Asia": "#7d9bff", "Otros": "#c6cdd6", "África": "#c6cdd6", "Oceanía": "#c6cdd6" };
    RPT.regions.forEach(r => {
      const rw = Math.max(2, bw * r.n / tot);
      ctx.fillStyle = cols[r.name];
      ctx.fillRect(bx, by, rw - 1.5, 14);
      bx += rw;
    });
    ctx.font = '8.5px Menlo, Consolas, monospace'; ctx.fillStyle = "#42566a";
    ctx.fillText("EU 176 · AM 126 · AS 28 · OTROS 8", X, by + 32);
    ctx.strokeStyle = "#eef1f6";
    ctx.beginPath(); ctx.moveTo(X, by + 46); ctx.lineTo(w - X, by + 46); ctx.stroke();

    // pie del rail
    ctx.font = '8.5px Menlo, Consolas, monospace'; ctx.fillStyle = "#8595a6";
    ctx.fillText("CLIC EN EL PANEL PARA LA FICHA DE LA CIFRA MADRE", X, h - 34);
    ctx.fillText("FUENTE · ESTUDIO 2026 · REGISTRO " + W.k, X, h - 18);
    ctx.globalAlpha = 1;
  }

  cv.addEventListener("click", e => {
    const W = WINS[win];
    const s = window.SRC[W.k];
    U.showDrill({ title: `${W.no} · ${W.t.toUpperCase()} · CIFRA MADRE`, value: W.big,
      sub: W.lab.charAt(0) + W.lab.slice(1).toLowerCase() + ". " + W.st.map(([v, l]) => `${v} ${l}`).join(" · "),
      source: `${W.k} · ${s ? s.cite : "Estudio 2026"}`, x: e.clientX, y: e.clientY });
  });

  window.__railSet = w2 => {
    if (!WINS[w2] || w2 === win) return;
    win = w2;
    fade = 0.25; draw();
    let t0 = null;
    const step = ts => { if (t0 == null) t0 = ts;
      fade = U.clamp((ts - t0) / 260, 0.25, 1); draw();
      if (fade < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  // visibilidad: oculto en portada, entra al entrar a los capítulos
  addEventListener("scroll", () => {
    rail.classList.toggle("on", scrollY > innerHeight * 0.75);
  }, { passive: true });
  new ResizeObserver(draw).observe(rail);
  draw();
})();
