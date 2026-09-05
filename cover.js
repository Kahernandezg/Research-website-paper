// ═══ Portada A · "La estantería infinita" ═══
// Recursión autosimilar del átomo temático: la revista académica.
// Lo que recursa ES el objeto: cada revista se encoge hasta ser una casilla
// de una estantería mayor de revistas — 338 títulos, todo el campo.
(() => {
  const cv = document.getElementById("cover-canvas");
  if (!cv) return;
  const B = U.bindCanvas(cv);
  const G = 5;                    // casillas por lado por capa (impar)
  const LAYER_SEC = 12;           // 12 s por nivel de zoom (referencia)
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let active = false, raf = 0, t0 = 0, last = 0, phase = 0.42;
  let born = new Map();           // flash de nacimiento BFS por casilla
  const mouse = () => (window.__coverMouse || { x: 0, y: 0 });

  // ── Tesela interior: portada de revista (cabecera, titular, motivo de red) ──
  function drawJournal(ctx, s, rng, simple) {
    // s = lado de la casilla en px; dibuja centrado en el origen
    const h = s * 1.34;           // proporción de revista (alto > ancho)
    const w = s * 0.94;
    ctx.save();
    // cuerpo
    ctx.fillStyle = "#fbfaf5";
    ctx.strokeStyle = "rgba(5,28,44,.55)";
    ctx.lineWidth = Math.max(0.6, s * 0.012);
    ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.fill(); ctx.stroke();
    if (simple) { ctx.restore(); return; }
    const lw = Math.max(0.5, s * 0.009);
    // cabecera (masthead): banda azul en algunas, líneas de tinta en otras
    const blue = rng() < 0.16;
    if (blue) {
      ctx.fillStyle = "rgba(34,81,255,.85)";
      ctx.fillRect(-w / 2, -h / 2, w, h * 0.16);
    } else {
      ctx.strokeStyle = "rgba(5,28,44,.8)"; ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2 + h * 0.16); ctx.lineTo(w / 2, -h / 2 + h * 0.16);
      ctx.stroke();
      ctx.strokeStyle = "rgba(5,28,44,.75)";
      ctx.lineWidth = Math.max(0.6, s * 0.02);
      ctx.beginPath(); ctx.moveTo(-w * 0.34, -h / 2 + h * 0.08); ctx.lineTo(w * 0.30, -h / 2 + h * 0.08); ctx.stroke();
    }
    // líneas de titular
    ctx.strokeStyle = "rgba(66,86,106,.85)"; ctx.lineWidth = lw * 1.4;
    const y0 = -h / 2 + h * 0.24;
    [[0.62, 0], [0.44, 0.055]].forEach(([wf, dy]) => {
      ctx.beginPath(); ctx.moveTo(-w * wf / 2, y0 + h * dy); ctx.lineTo(w * wf / 2, y0 + h * dy); ctx.stroke();
    });
    // motivo de red (co-citación) en el centro de la portada
    const nDots = 4 + Math.floor(rng() * 3), pts = [];
    for (let i = 0; i < nDots; i++) pts.push({ x: (rng() - 0.5) * w * 0.6, y: (rng() - 0.5) * h * 0.30 + h * 0.02 });
    ctx.strokeStyle = "rgba(133,149,166,.8)"; ctx.lineWidth = lw * 0.8;
    for (let i = 0; i < nDots - 1; i++) {
      const j = Math.floor(rng() * nDots);
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
    }
    pts.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? "rgba(34,81,255,.9)" : "rgba(5,28,44,.7)";
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.7, s * (i === 0 ? 0.022 : 0.014)), 0, U.TAU); ctx.fill();
    });
    // columnas de texto abajo
    ctx.strokeStyle = "rgba(133,149,166,.65)"; ctx.lineWidth = lw * 0.7;
    for (let r = 0; r < 4; r++) {
      const yy = h * 0.18 + r * h * 0.055;
      ctx.beginPath(); ctx.moveTo(-w * 0.38, yy); ctx.lineTo(-w * 0.05 - (r % 2) * w * 0.06, yy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.05, yy); ctx.lineTo(w * 0.38 - ((r + 1) % 2) * w * 0.06, yy); ctx.stroke();
    }
    // franja inferior (índice / cuartil)
    ctx.strokeStyle = "rgba(18,51,184,.55)"; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(-w * 0.38, h * 0.42); ctx.lineTo(w * (rng() * 0.5 - 0.1), h * 0.42); ctx.stroke();
    ctx.restore();
  }

  function draw(now) {
    if (!active) return;
    const { w, h } = B.fit();
    const ctx = B.ctx;
    const minDim = Math.min(w, h);
    const cellBase = minDim * 0.34;
    const t = now / 1000;
    if (!last) { last = now; t0 = now; }
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!REDUCE) {
      phase += dt / LAYER_SEC;
      if (phase >= 1) { phase -= 1; born.clear(); }
    }
    const zoom = Math.pow(G, -phase);              // la cámara se aleja: 1 → 1/G
    const m = mouse();
    const camX = w / 2 + m.x * minDim * 0.02, camY = h / 2 + m.y * minDim * 0.02;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);

    // capas: 0 = la estantería actual … D = estanterías mayores que la contienen
    const D = Math.ceil(Math.log(Math.max(w, h) / (cellBase * zoom)) / Math.log(G)) + 1;
    for (let L = D; L >= 0; L--) {
      const cellPx = cellBase * zoom * Math.pow(G, L);
      if (cellPx < 5) continue;
      if (L === 0 && cellPx < 7) continue;
      const range = Math.ceil(Math.max(w, h) / cellPx) + 2;
      const depthA = U.clamp((cellPx - 5) / 22, 0, 1);        // fundido de la capa más externa
      for (let gx = -range; gx <= range; gx++) for (let gy = -range; gy <= range; gy++) {
        if (L > 0 && gx === 0 && gy === 0) continue;          // casilla central: contiene la capa anterior
        const sx = camX + gx * cellPx, sy = camY + gy * cellPx * 1.34;
        const s = cellPx;
        if (sx < -s || sx > w + s || sy < -s * 1.4 || sy > h + s * 1.4) continue;
        const key = L + ":" + gx + ":" + gy;
        if (!born.has(key)) born.set(key, t);
        const flash = Math.exp(-(t - born.get(key)) * 2.2);
        const rng = U.makeRng((L + 7) * 1000003 + (gx + 400) * 7919 + (gy + 400) * 104729);
        ctx.save();
        ctx.translate(sx, sy);
        ctx.globalAlpha = depthA * (L === 0 ? 1 : U.clamp(0.55 + 0.45 * depthA, 0, 1));
        drawJournal(ctx, s, rng, s < 26);
        // destello azul de nacimiento (orden BFS natural: del centro a los bordes)
        if (!REDUCE && flash > 0.03) {
          ctx.globalAlpha = flash * 0.55;
          ctx.fillStyle = "#2251ff";
          ctx.fillRect(-s * 0.47, -s * 1.34 / 2, s * 0.94, s * 1.34);
        }
        ctx.restore();
      }
      // velo blanco entre capas para separar planos
      if (L > 0 && depthA < 0.98) {
        ctx.fillStyle = `rgba(255,255,255,${(1 - depthA) * 0.5})`;
        ctx.fillRect(0, 0, w, h);
      }
    }

    // visor azul: encuadra la estantería actual encogiéndose hacia UNA casilla de la mayor
    const vf = cellBase * zoom * G;              // la capa 0 completa = una casilla de la capa 1
    if (vf < minDim * 1.4) {
      const va = 0.25 + 0.55 * Math.abs(Math.sin(phase * Math.PI)); // solo con la fase, nunca parpadeo
      ctx.strokeStyle = `rgba(34,81,255,${va})`;
      ctx.lineWidth = 2;
      const vw = vf * 0.94 * 0.5, vh = vf * 1.34 * 0.5, cl = Math.min(26, vw * 0.4);
      ctx.beginPath();
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => {
        ctx.moveTo(camX + sx * vw, camY + sy * (vh - cl));
        ctx.lineTo(camX + sx * vw, camY + sy * vh);
        ctx.lineTo(camX + sx * (vw - cl), camY + sy * vh);
      });
      ctx.stroke();
    }

    // lavado izquierdo para legibilidad del titular
    const grad = ctx.createLinearGradient(0, 0, w * 0.62, 0);
    grad.addColorStop(0, "rgba(255,255,255,.92)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w * 0.62, h);

    // rótulo inferior derecho
    ctx.font = '10.5px Menlo, Consolas, monospace';
    ctx.fillStyle = "rgba(66,86,106,.9)";
    ctx.textAlign = "right";
    ctx.fillText("Cada revista es una casilla de una estantería mayor — 338 títulos, todo el campo", w - 18, h - 16);
    ctx.textAlign = "left";

    raf = requestAnimationFrame(draw);
  }

  window.COVER_A = {
    setActive(on) {
      active = on;
      cancelAnimationFrame(raf);
      if (on) {
        last = 0;
        if (REDUCE) {           // marco estático completado
          requestAnimationFrame(() => { const p = phase; phase = 0.42; this.__frame(); phase = p; });
        } else raf = requestAnimationFrame(draw);
      }
    },
    __frame() { const a = active; active = true; draw(performance.now()); cancelAnimationFrame(raf); active = a; },
  };
})();
