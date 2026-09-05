// ═══ Motor de scroll · chips · tabla de productividad · IO de secciones ═══
(() => {
  // chips de portada → secciones
  document.querySelectorAll("[data-goto]").forEach(b =>
    b.addEventListener("click", () => {
      const t = document.querySelector(b.dataset.goto);
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    }));

  // Tabla 3 · productividad (render desde la capa de datos)
  const pt = document.getElementById("prod-table");
  if (pt) {
    const tbl = document.createElement("table");
    tbl.className = "dt";
    tbl.innerHTML = `<tr><th>#</th><th>Revista</th><th>Editorial</th><th style="text-align:right">Documentos</th><th>Acceso</th></tr>`;
    RPT.productive_top20.forEach(r => {
      const tr = document.createElement("tr");
      if (r.r <= 3) tr.className = "hl";
      tr.innerHTML = `<td class="num">${r.r}</td>
        <td>${r.j}</td><td style="color:#42566a">${r.pub}</td>
        <td class="num" style="text-align:right">${U.fmt.n(r.docs)}</td>
        <td><span class="src-cat ${r.access === "OA" ? "company" : "industry"}">${r.access === "OA" ? "🟢 OA" : "🔘 APC"}</span></td>`;
      tr.style.cursor = "pointer";
      tr.setAttribute("data-drill-keep", "");
      tr.addEventListener("click", e => U.showDrill({
        title: `#${r.r} PRODUCTIVIDAD · ${r.j.toUpperCase()}`,
        value: U.fmt.n(r.docs) + " docs",
        sub: `Editorial: ${r.pub}. Modelo: ${r.access === "OA" ? "acceso abierto sin costo para autores" : "Article Processing Charges (APC)"}.`,
        source: "K9, K10 · Estudio, Tabla 3 · OpenAlex, compilado 2026", x: e.clientX, y: e.clientY }));
      tbl.appendChild(tr);
    });
    pt.appendChild(tbl);
  }

  // IO de secciones → rail de contexto
  const secs = document.querySelectorAll("[data-win]");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && window.__railSet) window.__railSet(e.target.dataset.win);
  }), { rootMargin: "-38% 0px -52% 0px", threshold: 0 });
  secs.forEach(s => io.observe(s));

  // Escape cierra la ficha
  addEventListener("keydown", e => { if (e.key === "Escape") U.hideDrill(); });
})();
