// ═══ §5 · Matriz de cuartiles SJR 2015–2025 ═══
// Solo lo que el paper afirma; las celdas sin dato se dibujan como hueco.
(() => {
  const host = document.getElementById("quartile-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: "Una década en cuartiles: quién se sostiene, quién asciende, quién no sale de Q4",
    sub: "CATEGORÍA LIBRARY AND INFORMATION SCIENCES DEL SJR · TRAMA ROJA = SIN DATO EN EL ESTUDIO · CLIC EN CADA FILA",
    src: "Estudio, Tabla 4 (K11) · SCImago Journal & Country Rank sobre Scopus, 2015–2025",
  });

  const st = document.createElement("style");
  st.textContent = `
    .qmx { border-collapse: collapse; width: 100%; }
    .qmx th { font-family: Menlo, Consolas, monospace; font-size: 8.5px; color: #8595a6;
      letter-spacing: .04em; padding: 4px 2px; border-bottom: 1.5px solid #051c2c; text-align: center; }
    .qmx th.j { text-align: left; }
    .qmx td { padding: 3px 2px; border-bottom: 1px solid #eef1f6; }
    .qmx td.j { font-family: "et-book", Palatino, Georgia, serif; font-size: 12.5px; font-weight: 700;
      color: #051c2c; padding-right: 10px; white-space: nowrap; cursor: pointer; }
    .qmx td.j small { display: block; font-family: Menlo, Consolas, monospace; font-size: 8px;
      color: #8595a6; font-weight: 400; }
    .qc { height: 26px; text-align: center; font-family: Menlo, Consolas, monospace; font-size: 8.5px;
      font-weight: 700; cursor: pointer; min-width: 30px; }
    .qc.q1 { background: #2251ff; color: #fff; }
    .qc.q2 { background: #7d9bff; color: #fff; }
    .qc.q4 { background: #42566a; color: #fff; }
    .qc.na { background: repeating-linear-gradient(45deg, rgba(194,47,78,.14) 0 4px, transparent 4px 8px);
      color: #c22f4e; }
    .qmx tr:hover .qc { filter: brightness(1.08); }
    .qleg { font-family: Menlo, Consolas, monospace; font-size: 9px; color: #42566a; margin-top: 10px; }
    .qleg b { display: inline-block; width: 10px; height: 10px; margin: 0 5px -1px 12px; }
  `;
  document.head.appendChild(st);

  const tbl = document.createElement("table");
  tbl.className = "qmx";
  const years = RPT.years;
  tbl.innerHTML = `<tr><th class="j">REVISTA / TRAYECTORIA</th>${years.map(y => `<th>’${String(y).slice(2)}</th>`).join("")}</tr>`;

  const COL = { Q1: "q1", Q2: "q2", Q3: "q3", Q4: "q4" };
  RPT.quartiles.forEach(row => {
    const tr = document.createElement("tr");
    const tdJ = document.createElement("td");
    tdJ.className = "j";
    tdJ.innerHTML = `${row.j}<small>${row.note.length > 72 ? row.note.slice(0, 70) + "…" : row.note}</small>`;
    tdJ.setAttribute("data-drill-keep", "");
    tdJ.addEventListener("click", e => U.showDrill({
      title: row.j.toUpperCase(), value: row.traj.filter(Boolean).slice(-1)[0] || "s/d",
      sub: row.note, source: "K11 · Estudio, Tabla 4 · SCImago/Scopus, 2015–2025", x: e.clientX, y: e.clientY }));
    tr.appendChild(tdJ);
    row.traj.forEach(q => {
      const td = document.createElement("td");
      const cell = document.createElement("div");
      cell.className = "qc " + (q ? COL[q] : "na");
      cell.textContent = q || "s/d";
      cell.setAttribute("data-drill-keep", "");
      cell.addEventListener("click", e => U.showDrill({
        title: row.j.toUpperCase(),
        value: q || "sin dato",
        sub: q ? `Cuartil ${q} en la categoría Library and Information Sciences del SJR.` :
          "El estudio no publica el cuartil de esta revista para este año; aquí no se interpola.",
        source: "K11 · Estudio, Tabla 4 · SCImago/Scopus, 2015–2025", x: e.clientX, y: e.clientY }));
      td.appendChild(cell); tr.appendChild(td);
    });
    tbl.appendChild(tr);
  });
  body.appendChild(tbl);

  const leg = document.createElement("p");
  leg.className = "qleg";
  leg.innerHTML = `LEYENDA <b style="background:#2251ff"></b>Q1 <b style="background:#7d9bff"></b>Q2
    <b style="background:#42566a"></b>Q4 <b style="background:repeating-linear-gradient(45deg,rgba(194,47,78,.3) 0 3px,transparent 3px 6px)"></b>SIN DATO EN EL ESTUDIO
    &nbsp;·&nbsp; «13 REVISTAS» ES EL CONTEO AGREGADO QUE REPORTA LA TABLA 4`;
  body.appendChild(leg);
})();
