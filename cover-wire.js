// ═══ Portada C · plano + conmutador de las tres variantes ═══
(() => {
  const COVER_W = window.__mkExploded("cover-canvas-w", "wire");

  const MODES = {
    rec: { cv: "cover-canvas",   eng: () => window.COVER_A },
    x:   { cv: "cover-canvas-x", eng: () => window.COVER_X },
    w:   { cv: "cover-canvas-w", eng: () => COVER_W },
  };
  let current = null;

  function setMode(m, save = true) {
    if (!MODES[m] || m === current) return;
    Object.entries(MODES).forEach(([key, M]) => {
      const el = document.getElementById(M.cv);
      const eng = M.eng();
      if (key === m) {
        el.style.display = "";
        // el canvas oculto mide 0×0: el motor re-ajusta al activarse (fit por frame)
        eng && eng.setActive(true);
      } else {
        el.style.display = "none";
        eng && eng.setActive(false);
      }
    });
    document.querySelectorAll("#cover-mode button").forEach(b =>
      b.classList.toggle("on", b.dataset.mode === m));
    current = m;
    if (save) try { localStorage.setItem("lis-cover", m); } catch (e) {}
  }

  // ratón global para el plato giratorio / paralaje
  addEventListener("mousemove", e => {
    window.__coverMouse = { x: (e.clientX / innerWidth - 0.5) * 2, y: (e.clientY / innerHeight - 0.5) * 2 };
  }, { passive: true });

  document.querySelectorAll("#cover-mode button").forEach(b =>
    b.addEventListener("click", () => setMode(b.dataset.mode)));

  const url = new URLSearchParams(location.search).get("cover");
  const alias = { a: "rec", b: "x", c: "w", rec: "rec", x: "x", w: "w" };
  let initial = alias[url] || null;
  if (!initial) { try { initial = localStorage.getItem("lis-cover"); } catch (e) {} }
  setMode(MODES[initial] ? initial : "rec", false);
})();
