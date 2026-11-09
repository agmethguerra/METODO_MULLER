/* MÜLLER CHALLENGE · Etapa 2 · Danilo
 * Navegación SPA (sin recarga), pestañas, HUD y preguntas de comprensión de los módulos.
 * API pública: window.MullerNav  ·  Evento: document 'muller:section' (detail: {id, title})
 */
(function (global) {
  "use strict";
  const SECTIONS = { inicio: "Inicio", aprende: "Aprende Müller", laboratorio: "Laboratorio matemático",
    juegos: "Zona de juegos", desafios: "Desafíos", evaluacion: "Evaluación final", creditos: "Créditos del equipo" };
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  let current = null;

  function icons() { if (global.lucide) global.lucide.createIcons(); }
  function typeset(root) { if (global.MathJax && global.MathJax.typesetPromise) global.MathJax.typesetPromise(root ? [root] : undefined).catch(() => {}); }

  function goTo(id, opts) {
    if (!SECTIONS[id]) id = "inicio";
    $$(".seccion").forEach(s => s.classList.toggle("active", s.id === id));
    $$(".nav-item").forEach(a => a.classList.toggle("active", a.dataset.section === id));
    $("#currentSection").textContent = SECTIONS[id];
    $("#sidebar").classList.remove("open");
    if (!(opts && opts.silent) && location.hash !== "#" + id) history.pushState(null, "", "#" + id);
    window.scrollTo({ top: 0 });
    const changed = current !== id; current = id;
    typeset($("#" + id));
    if (changed) document.dispatchEvent(new CustomEvent("muller:section", { detail: { id, title: SECTIONS[id] } }));
  }

  function showTab(group, target) {
    $$(`[data-tab-group="${group}"]`).forEach(b => b.classList.toggle("active", b.dataset.tabTarget === target));
    $$(`[data-pane-group="${group}"]`).forEach(p => p.classList.toggle("active", "#" + p.id === target));
    typeset($(target));
    document.dispatchEvent(new CustomEvent("muller:tab", { detail: { group, target } }));
  }

  /* HUD: Said (Etapa 4) llama a MullerNav.updateHud({score, max, progress}) desde scoring.js */
  function updateHud(d) {
    d = d || {};
    const max = d.max || 800, score = Math.max(0, Math.min(max, +d.score || 0));
    const prog = d.progress != null ? Math.max(0, Math.min(100, +d.progress)) : Math.round(score / max * 100);
    $("#hudScore").textContent = score + " / " + max;
    $("#hudProgressText").textContent = prog + "%";
    $("#hudProgressBar").style.width = prog + "%";
    const s = $("#sideScore"); if (s) s.textContent = score + " pts";
  }

  function initComprehension() {
    $$(".comprension").forEach(box => {
      $$(".opciones li", box).forEach(li => li.addEventListener("click", () => {
        const ok = li.dataset.opcion === box.dataset.correcta;
        $$(".opciones li", box).forEach(o => o.classList.remove("sel-ok", "sel-bad"));
        li.classList.add(ok ? "sel-ok" : "sel-bad");
        box.classList.toggle("ok", ok); box.classList.toggle("bad", !ok);
        typeset(box);
      }));
    });
  }

  function init() {
    document.addEventListener("click", e => {
      const g = e.target.closest("[data-goto]");
      if (g) { e.preventDefault(); goTo(g.dataset.goto); return; }
      const t = e.target.closest("[data-tab-target]");
      if (t) { showTab(t.dataset.tabGroup, t.dataset.tabTarget); return; }
      const tg = e.target.closest("[data-toggle]");
      if (tg) { const el = $(tg.dataset.toggle); el.hidden = !el.hidden; if (!el.hidden) el.scrollIntoView({ behavior: "smooth", block: "nearest" }); return; }
      if (e.target.closest("#menuBtn")) $("#sidebar").classList.toggle("open");
    });
    window.addEventListener("hashchange", () => goTo(location.hash.slice(1), { silent: true }));
    initComprehension(); icons(); updateHud({ score: 0 });
    goTo(location.hash.slice(1) || "inicio", { silent: true });
  }

  global.MullerNav = { goTo, showTab, updateHud, current: () => current, sections: () => Object.assign({}, SECTIONS), typeset, refreshIcons: icons };
  document.addEventListener("DOMContentLoaded", init);
})(window);
