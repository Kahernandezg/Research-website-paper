// ═══ Portadas B y C · motor compartido de explosión axonométrica ═══
// El átomo temático: un ejemplar de revista académica despiezado en cinco
// capas físicas, cada una = un pilar de la tesis del estudio.
//   B ('mat')  · materiales realistas (papel, tinta, banda azul)
//   C ('wire') · plano de ingeniería del mismo modelo (lo instancia cover-wire.js)
(() => {
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Capas de abajo (i=0) a arriba (i=4) · th = grosor en unidades
  const LAYERS = [
    { id: "lomo",   th: 2.4, col: "#3a2f28", edge: "#241d18", thesis: "APC Y ACCESO · EL SOPORTE ECONÓMICO",
      sub: "OA 42.1% · APC 48.8% · 31 híbridas", labCol: "#c22f4e" },
    { id: "sjr",    th: 1.3, col: "#dbe4ff", edge: "#7d9bff", thesis: "CUARTIL SJR · 2015–2025",
      sub: "13 revistas estables en Q1 una década", labCol: "#1233b8" },
    { id: "refs",   th: 1.7, col: "#f6f4ee", edge: "#c9c4b6", thesis: "RED DE CO-CITACIÓN",
      sub: "20 revistas núcleo · sistema dual", labCol: "#42566a" },
    { id: "paginas",th: 3.2, col: "#fbfaf5", edge: "#d8d4c8", thesis: "PRODUCTIVIDAD",
      sub: "341,800 documentos · la más prolífica", labCol: "#051c2c" },
    { id: "portada",th: 1.5, col: "#ffffff", edge: "#b9c2cc", thesis: "CITACIÓN E IMPACTO",
      sub: "1,367,000 citas · la revista más citada", labCol: "#2251ff" },
  ];
  const WIRE_COLS = { lomo: "#c22f4e", sjr: "#7d9bff", refs: "#42566a", paginas: "#051c2c", portada: "#2251ff" };
  const WU = 30, DU = 21, GAP = 4.4;

  function mkExploded(canvasId, style) {
    const cv = document.getElementById(canvasId);
    if (!cv) return null;
    const B = U.bindCanvas(cv);
    let active = false, raf = 0, last = 0, t = 0;
    let k = 1, kt = 1;                 // explosión: 1 despiezado · 0 armado
    const mouse = () => (window.__coverMouse || { x: 0, y: 0 });

    // proyección axonométrica
    function mkCam(w, h) {
      const leftBound = 0.585 * w;
      let right = w - 332, labels = true;
      let u = Math.min((right - leftBound) / 44, h * 0.0132);
      if (u < 5.6) { labels = false; right = w - 40; u = Math.min((right - leftBound) / 44, h * 0.0132); }
      const cx = (leftBound + right) / 2, cy = 0.60 * h;
      const yaw = REDUCE ? Math.PI / 4 : Math.PI / 4 + 0.3 * Math.sin(t * 0.11) + mouse().x * 0.11;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw);
      const pt = (x, y, z) => {
        const rx = x * cyw - y * syw, ry = x * syw + y * cyw;
        return { x: cx + rx * u, y: cy + ry * u * 0.5 - z * u };
      };
      return { pt, u, cx, cy, labels, right, cyw, syw, w, h };
    }

    // z base de cada capa según explosión k (escalonada con rebote back-out)
    function layerZs() {
      const backOut = x => { const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
      let z = 0; const out = [];
      const DROP = 6.0 * k; // sesgo a la baja: la explosión crece hacia abajo y despeja el subtítulo
      LAYERS.forEach((L, i) => {
        const lay = U.clamp(k * 1.55 - i * 0.17, 0, 1);
        const breath = REDUCE ? 0 : Math.sin(t * 1.1 + i * 1.3) * 0.16 * k;
        out.push({ z0: z + GAP * i * backOut(lay) - DROP + breath, th: L.th, lay });
        z += L.th;
      });
      return out;
    }

    function quad(ctx, pts) { ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y); ctx.closePath(); }

    // motivo de red de co-citación sobre la cara superior (espacio de capa)
    function networkMotif(ctx, cam, z, seed, scale = 1) {
      const rng = U.makeRng(seed);
      const pts = [];
      for (let i = 0; i < 7; i++) pts.push({ x: (rng() - 0.5) * WU * 0.62, y: (rng() - 0.5) * DU * 0.55 });
      const P = pts.map(p => cam.pt(p.x, p.y, z));
      ctx.strokeStyle = "rgba(66,86,106,.55)"; ctx.lineWidth = 0.8;
      for (let i = 0; i < 9; i++) {
        const a = Math.floor(rng() * 7), b = Math.floor(rng() * 7);
        ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[b].x, P[b].y); ctx.stroke();
      }
      P.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? "#2251ff" : "rgba(5,28,44,.75)";
        ctx.beginPath(); ctx.arc(p.x, p.y, (i === 0 ? 2.6 : 1.7) * scale, 0, U.TAU); ctx.fill();
      });
    }

    function drawLayerMat(ctx, cam, L, zs, i) {
      const { z0, th } = zs; const z1 = z0 + th;
      const hw = WU / 2, hd = DU / 2;
      const T = [cam.pt(-hw, -hd, z1), cam.pt(hw, -hd, z1), cam.pt(hw, hd, z1), cam.pt(-hw, hd, z1)];
      const Bt = [cam.pt(-hw, -hd, z0), cam.pt(hw, -hd, z0), cam.pt(hw, hd, z0), cam.pt(-hw, hd, z0)];

      // sombra de placa (levitación)
      if (k > 0.03) {
        const c = cam.pt(0, 0, z0 - 0.25);
        const a = U.clamp(0.20 - (zs.z0 - i * 0) * 0.004, 0.04, 0.2) * k;
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#051c2c";
        ctx.beginPath(); ctx.ellipse(c.x, c.y, cam.u * 16, cam.u * 6.4, 0, 0, U.TAU); ctx.fill(); ctx.restore();
      }

      // caras laterales visibles (normal con componente y de pantalla > 0)
      const faces = [
        { e: [1, 2], n: [cam.cyw, cam.syw] },   // +y tras rotación
        { e: [2, 3], n: [-cam.syw, cam.cyw] },
        { e: [3, 0], n: [-cam.cyw, -cam.syw] },
        { e: [0, 1], n: [cam.syw, -cam.cyw] },
      ];
      const vis = faces.map((f, fi) => ({ fi, sy: (f.n[0] * 0 + f.n[1]) * 0.5, shade: f.n[1] }))
        .filter(f => f.sy > 0.02).sort((a, b) => a.sy - b.sy);
      vis.forEach((f, ord) => {
        const [a, b] = faces[f.fi].e;
        const poly = [T[a], T[b], Bt[b], Bt[a]];
        quad(ctx, poly);
        const g = ctx.createLinearGradient(T[a].x, T[a].y, Bt[a].x, Bt[a].y);
        g.addColorStop(0, L.col);
        g.addColorStop(0.55, L.col);
        g.addColorStop(1, L.edge);
        ctx.fillStyle = g; ctx.fill();
        ctx.strokeStyle = "rgba(5,28,44,.35)"; ctx.lineWidth = 0.7; ctx.stroke();
        // detalle de identidad: líneas de páginas en los laterales del bloque de artículos
        if (L.id === "paginas") {
          ctx.strokeStyle = "rgba(5,28,44,.28)"; ctx.lineWidth = 0.5;
          for (let r = 1; r <= 8; r++) {
            const zz = z0 + (th * r) / 9;
            const p1 = cam.pt(a === 0 ? -hw : a === 1 ? hw : a === 2 ? hw : -hw, a === 0 ? -hd : a === 1 ? -hd : a === 2 ? hd : hd, zz);
            const p2 = cam.pt(b === 0 ? -hw : b === 1 ? hw : b === 2 ? hw : -hw, b === 0 ? -hd : b === 1 ? -hd : b === 2 ? hd : hd, zz);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
        // costuras del lomo
        if (L.id === "lomo") {
          ctx.strokeStyle = "rgba(251,250,245,.5)"; ctx.lineWidth = 0.9; ctx.setLineDash([3, 4]);
          for (let r = 1; r <= 5; r++) {
            const xx = -hw + (WU * r) / 6;
            const p1 = cam.pt(xx, hd, z0 + 0.15), p2 = cam.pt(xx, hd, z1 - 0.15);
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
          ctx.setLineDash([]);
        }
      });

      // cara superior
      quad(ctx, T);
      ctx.fillStyle = L.col; ctx.fill();
      // brillo angular + bisel
      const gloss = ctx.createLinearGradient(T[3].x, T[3].y, T[1].x, T[1].y);
      gloss.addColorStop(0, "rgba(255,255,255,.55)"); gloss.addColorStop(0.5, "rgba(255,255,255,0)");
      gloss.addColorStop(1, "rgba(5,28,44,.06)");
      quad(ctx, T); ctx.fillStyle = gloss; ctx.fill();
      // banda de brillo móvil (metal/papel satinado)
      if (!REDUCE) {
        ctx.save(); quad(ctx, T); ctx.clip();
        const sx = ((t * 30) % (cam.w + 260)) - 130;
        const sg = ctx.createLinearGradient(sx - 60, 0, sx + 60, 0);
        sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(0.5, "rgba(255,255,255,.16)"); sg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sg; ctx.fillRect(sx - 60, 0, 120, cam.h);
        ctx.restore();
      }
      ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1; quad(ctx, T); ctx.stroke();
      ctx.strokeStyle = "rgba(5,28,44,.4)"; ctx.lineWidth = 0.6; quad(ctx, T); ctx.stroke();

      // detalles de identidad por capa
      if (L.id === "portada") {
        // cabecera: banda + titular + motivo de red
        const m = [cam.pt(-hw + 1.4, -hd + 1.4, z1 + 0.01), cam.pt(hw - 1.4, -hd + 1.4, z1 + 0.01),
                   cam.pt(hw - 1.4, -hd + 4.6, z1 + 0.01), cam.pt(-hw + 1.4, -hd + 4.6, z1 + 0.01)];
        quad(ctx, m); ctx.fillStyle = "rgba(34,81,255,.92)"; ctx.fill();
        ctx.strokeStyle = "rgba(5,28,44,.5)"; ctx.lineWidth = 0.6; ctx.stroke();
        ctx.strokeStyle = "rgba(5,28,44,.8)"; ctx.lineWidth = 1.6;
        [[-9, -3.2, 5.5], [-9, -1.6, 8]].forEach(([x0, y0, len]) => {
          const p1 = cam.pt(x0, y0, z1 + 0.01), p2 = cam.pt(x0 + len, y0, z1 + 0.01);
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        });
        networkMotif(ctx, cam, z1 + 0.01, 42, 1);
      }
      if (L.id === "refs") networkMotif(ctx, cam, z1 + 0.01, 7, 0.9);
      if (L.id === "sjr") {
        for (let q = 0; q < 4; q++) {
          const p = cam.pt(-hw + 4 + q * 4.4, 0, z1 + 0.01);
          ctx.fillStyle = q === 0 ? "#1233b8" : "rgba(18,51,184,.18)";
          ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
          ctx.strokeStyle = "rgba(18,51,184,.7)"; ctx.lineWidth = 0.7; ctx.strokeRect(p.x - 3, p.y - 3, 6, 6);
        }
      }
      if (L.id === "lomo" && style === "mat") {
        // etiquetas colgantes: el acto de poner precio (APC) y el candado abierto (OA)
        const anchor = cam.pt(2, hd, z0 + th / 2);
        [["APC 48.8%", "#c22f4e", 0], ["OA 42.1%", "#2251ff", 74]].forEach(([txt, col, dx]) => {
          const tx = anchor.x + dx - 30, ty = anchor.y + 30;
          ctx.strokeStyle = "rgba(5,28,44,.5)"; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(anchor.x + dx - 30 + 2, anchor.y); ctx.lineTo(tx + 32, ty); ctx.stroke();
          ctx.fillStyle = "#fbfaf5"; ctx.strokeStyle = col; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.rect(tx, ty, 64, 19); ctx.fill(); ctx.stroke();
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(tx + 32, ty + 3, 1.6, 0, U.TAU); ctx.fill();
          ctx.font = '700 9.5px Menlo, Consolas, monospace'; ctx.fillStyle = col; ctx.textAlign = "center";
          ctx.fillText(txt, tx + 32, ty + 13); ctx.textAlign = "left";
        });
      }
      return T;
    }

    function drawLayerWire(ctx, cam, L, zs, i) {
      const { z0, th } = zs; const z1 = z0 + th;
      const hw = WU / 2, hd = DU / 2;
      const T = [cam.pt(-hw, -hd, z1), cam.pt(hw, -hd, z1), cam.pt(hw, hd, z1), cam.pt(-hw, hd, z1)];
      const Bt = [cam.pt(-hw, -hd, z0), cam.pt(hw, -hd, z0), cam.pt(hw, hd, z0), cam.pt(-hw, hd, z0)];
      const col = WIRE_COLS[L.id];
      // velo blanco de la cara superior (separación delantera/trasera)
      quad(ctx, T); ctx.fillStyle = "rgba(255,255,255,.62)"; ctx.fill();
      const edge = (p, q, a, lw) => { ctx.strokeStyle = col; ctx.globalAlpha = a; ctx.lineWidth = lw;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.globalAlpha = 1; };
      const my = p => p.y;
      // aristas verticales y de base: lejanas tenues, cercanas sólidas
      const baseC = (cam.cy - cam.pt(0, 0, 99).y); // referencia de profundidad por y de pantalla
      for (let c = 0; c < 4; c++) {
        const far = my(T[c]) < cam.cy;
        edge(T[c], Bt[c], far ? 0.22 : 0.55, 0.8);
        edge(Bt[c], Bt[(c + 1) % 4], far ? 0.22 : 0.5, 0.8);
      }
      for (let c = 0; c < 4; c++) edge(T[c], T[(c + 1) % 4], 0.85, 1.4);
      // líneas finas de detalle: páginas y rejilla
      if (L.id === "paginas") for (let r = 1; r <= 6; r++) {
        const zz = z0 + (th * r) / 7;
        edge(cam.pt(-hw, hd, zz), cam.pt(hw, hd, zz), 0.3, 0.6);
      }
      return T;
    }

    // rótulos de tesis a la derecha con líneas guía
    function drawLabels(ctx, cam, tops, zs) {
      if (!cam.labels) return;
      const la = U.clamp((k - 0.45) * 2.4, 0, 1);
      if (la <= 0) return;
      ctx.save(); ctx.globalAlpha = la;
      const colX = cam.w - 312;
      let rowY = Math.max(96, cam.h * 0.16);
      const rows = [];
      LAYERS.map((L, i) => {
        const T = tops[i];
        const anchor = T.reduce((a, b) => (b.x > a.x ? b : a), T[0]);
        return { L, anchor, i };
      }).sort((a, b) => a.anchor.y - b.anchor.y).forEach(({ L, anchor }) => {
        const y = Math.max(rowY, anchor.y - 8);
        ctx.strokeStyle = "rgba(5,28,44,.45)"; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(anchor.x + 4, anchor.y); ctx.lineTo(colX - 10, y + 4); ctx.stroke();
        if (style === "wire") { ctx.beginPath(); ctx.arc(anchor.x, anchor.y, 3, 0, U.TAU); ctx.stroke(); }
        ctx.fillStyle = L.labCol; ctx.font = '700 10px Menlo, Consolas, monospace';
        ctx.fillText(L.thesis, colX, y + 4);
        ctx.fillStyle = "rgba(66,86,106,.95)"; ctx.font = '9.5px Menlo, Consolas, monospace';
        let sub = L.sub;
        while (ctx.measureText(sub).width > 286 && sub.length > 8) sub = sub.slice(0, -2);
        if (sub !== L.sub) sub = sub.replace(/[, ]+$/, "") + " …";
        ctx.fillText(sub, colX, y + 18);
        rows.push(y); rowY = y + 36;
      });
      ctx.restore();
    }

    function draw(now) {
      if (!active) return;
      const { w, h } = B.fit();
      const ctx = B.ctx;
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t = now / 1000;
      if (!REDUCE) k += (kt - k) * (1 - Math.exp(-dt * 4));
      const cam = mkCam(w, h);
      const zs = layerZs();

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h);

      if (style === "wire") {
        // retícula de dibujo técnico 52px + marcas de registro
        ctx.strokeStyle = "rgba(5,28,44,.05)"; ctx.lineWidth = 0.5;
        for (let x = 26; x < w; x += 52) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 26; y < h; y += 52) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        ctx.strokeStyle = "rgba(34,81,255,.8)"; ctx.lineWidth = 1.4;
        [[16, 16, 1, 1], [w - 16, 16, -1, 1], [16, h - 16, 1, -1], [w - 16, h - 16, -1, -1]].forEach(([x, y, sx, sy]) => {
          ctx.beginPath(); ctx.moveTo(x + sx * 18, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy * 18); ctx.stroke();
        });
      }

      // sombra de suelo
      const gs = cam.pt(0, 0, -0.4);
      const g2 = ctx.createRadialGradient(gs.x, gs.y, 4, gs.x, gs.y, cam.u * 24);
      g2.addColorStop(0, "rgba(5,28,44,.14)"); g2.addColorStop(1, "rgba(5,28,44,0)");
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.ellipse(gs.x, gs.y, cam.u * 24, cam.u * 9, 0, 0, U.TAU); ctx.fill();

      const tops = [];
      zs.forEach((zsi, i) => {
        const T = style === "wire" ? drawLayerWire(ctx, cam, LAYERS[i], zsi, i)
                                   : drawLayerMat(ctx, cam, LAYERS[i], zsi, i);
        tops[i] = T;
      });
      drawLabels(ctx, cam, tops, zs);

      // lavado izquierdo + rótulo de estado
      const grad = ctx.createLinearGradient(0, 0, w * 0.5, 0);
      grad.addColorStop(0, "rgba(255,255,255,.88)"); grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w * 0.5, h);
      ctx.font = '10.5px Menlo, Consolas, monospace'; ctx.fillStyle = "rgba(66,86,106,.9)"; ctx.textAlign = "right";
      ctx.fillText(style === "wire"
        ? "FIG. 1 · LA REVISTA LIS, DESPIEZADA · SCALE NTS · CLIC PARA " + (kt > 0.5 ? "ARMAR" : "DESPIEZAR")
        : (kt > 0.5 ? "Un ejemplar, cinco capas de evidencia — clic para armar" : "Ejemplar armado — clic para despiezar"),
        w - 18, h - 16);
      ctx.textAlign = "left";

      raf = requestAnimationFrame(draw);
    }

    // clic en zona vacía de la portada: armar/despiezar
    const cover = document.getElementById("cover");
    cover.addEventListener("click", e => {
      if (!active) return;
      if (e.target.closest("button, a, .chip, .cover-mode")) return;
      kt = kt > 0.5 ? 0 : 1;
    });

    return {
      setActive(on) {
        active = on; cancelAnimationFrame(raf);
        if (on) {
          last = 0;
          if (REDUCE) { k = kt = 1; requestAnimationFrame(() => { const a = active; active = true; draw(performance.now()); cancelAnimationFrame(raf); active = a; }); }
          else raf = requestAnimationFrame(draw);
        }
      },
    };
  }

  window.__mkExploded = mkExploded;
  window.COVER_X = mkExploded("cover-canvas-x", "mat");
})();
