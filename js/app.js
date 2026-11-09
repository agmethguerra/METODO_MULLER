/* MÜLLER CHALLENGE · Etapa 4 · Said — integración final.
 * Contiene: utilidades compartidas (MullerUI), el laboratorio (conexión del motor de Peralta con la interfaz
 * de Danilo, sin duplicar el algoritmo) y la inicialización global. */
(function (g) {
  "use strict";
  const $ = id => document.getElementById(id);
  /* ---------- utilidades compartidas ---------- */
  const UI = {
    $,
    esc: s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
    shuffle(arr, rejectIf) {
      const a = arr.slice();
      for (let t = 0; t < 30; t++) {
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
        if (!rejectIf || !rejectIf(a)) break;
      }
      return a;
    },
    typeset(el) { if (g.MullerNav) g.MullerNav.typeset(el); },
    /* Cuenta regresiva: devuelve {stop()}. */
    timer(secs, onTick, onEnd) {
      let left = secs; onTick(left);
      const id = setInterval(() => { left--; onTick(left); if (left <= 0) { clearInterval(id); onEnd(); } }, 1000);
      return { stop: () => clearInterval(id) };
    },
    /* Opción múltiple con barajado. q = {opciones:[...], correcta:índice}. onAnswer(ok, índiceOriginal). */
    mcq(container, q, onAnswer) {
      const order = UI.shuffle(q.opciones.map((_, i) => i)), L = "ABCD";
      container.innerHTML = order.map((oi, k) => `<button type="button" class="choice" data-oi="${oi}"><b>${L[k]}</b><span>${UI.esc(q.opciones[oi])}</span></button>`).join("");
      UI.typeset(container);
      const btns = [...container.querySelectorAll(".choice")];
      btns.forEach(b => b.addEventListener("click", () => {
        const oi = +b.dataset.oi; UI.lockChoices(container, q.correcta, oi); onAnswer(oi === q.correcta, oi);
      }));
    },
    lockChoices(container, correct, picked) {
      container.querySelectorAll(".choice").forEach(b => {
        const oi = +b.dataset.oi; b.disabled = true;
        if (oi === correct) b.classList.add("correct"); else if (oi === picked) b.classList.add("wrong");
      });
    },
    feedback(el, ok, html) { el.className = "fb " + (ok ? "fb-ok" : "fb-bad"); el.innerHTML = html; UI.typeset(el); }
  };
  g.MullerUI = UI;

  /* ---------- laboratorio (usa MullerMethod y MullerGraph; no reimplementa el algoritmo) ---------- */
  const EXAMPLES = {
    one: { expression: "x^3-x-1", x0: 1, x1: 1.5, x2: 2, tolerance: 0.0001, maxIterations: 50 },
    two: { expression: "x^2-2", x0: 0, x1: 1, x2: 2, tolerance: 0.0001, maxIterations: 50 },
    three: { expression: "x^3+1", x0: -2, x1: -1.5, x2: -0.5, tolerance: 0.0001, maxIterations: 50 }
  };
  const FIELDS = ["expression", "x0", "x1", "x2", "tolerance", "maxIterations"];
  let session = null, snap = null;
  const fmt = z => g.MullerMethod.formatComplex(z), sci = n => Number(n).toExponential(4);
  function readConfig() {
    const c = { expression: $("expression").value.trim() };
    ["x0", "x1", "x2", "tolerance", "maxIterations"].forEach(k => { c[k] = Number($(k).value); });
    if (!c.expression) throw new Error("Escribe una función matemática.");
    ["x0", "x1", "x2", "tolerance", "maxIterations"].forEach(k => { if (!Number.isFinite(c[k])) throw new Error("Revisa el valor de " + k + "."); });
    if (!(c.tolerance > 0)) throw new Error("La tolerancia debe ser mayor que cero.");
    if (!Number.isInteger(c.maxIterations) || c.maxIterations < 1 || c.maxIterations > 500) throw new Error("El máximo de iteraciones debe ser un entero entre 1 y 500.");
    return c;
  }
  function msg(text, type) { const el = $("message"); el.textContent = text; el.className = "nota msg-" + (type || "info"); }
  function renderLab(s) {
    snap = s;
    const labels = { ready: "Pendiente", running: "En proceso", converged: "Convergió", "max-iterations": "Límite alcanzado", error: "Error" };
    const last = s.rows[s.rows.length - 1];
    $("metricStatus").textContent = labels[s.status] || s.status;
    $("metricIterations").textContent = s.iterations;
    $("metricRoot").textContent = last ? fmt(last.x3) : "—";
    $("metricError").textContent = last ? sci(last.error) : "—";
    $("rowCount").textContent = s.rows.length + " REGISTROS";
    $("resultsBody").innerHTML = s.rows.length ? s.rows.map(r => `<tr><td>${r.iteration}</td><td>${fmt(r.x0)}</td><td>${fmt(r.x1)}</td><td>${fmt(r.x2)}</td><td>${fmt(r.x3)}</td><td>${fmt(r.fx3)}</td><td>${sci(r.error)}</td></tr>`).join("")
      : '<tr><td colspan="7" class="text-center muted">Sin resultados todavía.</td></tr>';
    const det = $("iterationDetails");
    if (last) {
      const f = [["h₀", last.h0], ["h₁", last.h1], ["δ₀", last.delta0], ["δ₁", last.delta1], ["d = a", last.a], ["b", last.b], ["c", last.c], ["D = b² − 4ac", last.discriminant], ["Denominador elegido", last.denominator], ["x₃", last.x3], ["f(x₃)", last.fx3], ["Error |x₃ − x₂|", last.error]];
      det.className = ""; det.style.display = "block";
      det.innerHTML = '<div class="detail-list">' + f.map(([l, v]) => `<div class="detail-item"><span>${l}</span><b>${l.startsWith("Error") ? sci(v) : fmt(v)}</b></div>`).join("") + '</div><p class="muted" style="font-size:12px;margin:10px 0 0">Se eligió el denominador de mayor módulo entre b + √D y b − √D. Luego: x₀ ← x₁, x₁ ← x₂, x₂ ← x₃.</p>';
    } else { det.className = "placeholder-msg"; det.style.display = ""; det.textContent = "Los cálculos intermedios (h₀, h₁, δ₀, δ₁, a, b, c, D) aparecerán aquí."; }
    drawChart(s);
  }
  function drawChart(s) {
    if (!g.Chart || !g.MullerGraph) return;
    try {
      const real = [...s.points.map(p => p.re), ...(s.rows.length ? [s.rows[s.rows.length - 1].x3.re] : [])].filter(Number.isFinite);
      g.MullerGraph.draw("functionChart", $("expression").value, s, { min: Math.min(-5, ...real) - 1, max: Math.max(5, ...real) + 1 });
      $("chartPlaceholder").hidden = true;
    } catch (e) { $("chartPlaceholder").hidden = false; $("chartPlaceholder").textContent = e.message; }
  }
  const idle = (pts, text) => ({ status: "ready", message: text, iterations: 0, rows: [], points: pts, converged: false, root: null });
  function create() { session = g.MullerMethod.createSession(readConfig()); return session; }
  function lab() {
    $("calculateBtn").addEventListener("click", () => {
      try { create(); const r = session.run(); renderLab(r);
        msg(r.message + (r.rootText ? " Aproximación final: " + r.rootText : ""), r.converged ? "ok" : r.status === "error" ? "err" : "info");
      } catch (e) { session = null; msg(e.message, "err"); }
    });
    $("nextBtn").addEventListener("click", () => {
      try { if (!session) create(); const r = session.next(); renderLab(r);
        msg(r.status === "running" ? "Iteración " + r.iterations + " calculada. Puedes continuar." : r.message + (r.rootText ? " " + r.rootText : ""), r.converged ? "ok" : r.status === "running" ? "info" : "err");
      } catch (e) { session = null; msg(e.message, "err"); }
    });
    $("resetBtn").addEventListener("click", () => {
      try { const c = readConfig(); session = null; renderLab(idle([c.x0, c.x1, c.x2].map(re => ({ re, im: 0 })), "")); msg("Cálculo reiniciado.", "info"); }
      catch (e) { msg(e.message, "err"); }
    });
    $("loadExampleBtn").addEventListener("click", () => load(EXAMPLES[$("exampleSelect").value]));
    renderLab(idle([{ re: 1, im: 0 }, { re: 1.5, im: 0 }, { re: 2, im: 0 }], ""));
    document.addEventListener("muller:section", e => { if (e.detail.id === "laboratorio" && snap) drawChart(snap); });
  }
  /* API pública: carga una configuración en el laboratorio (la usan los juegos). */
  function load(cfg) {
    FIELDS.forEach(k => { $(k).value = cfg[k]; });
    session = null; renderLab(idle([cfg.x0, cfg.x1, cfg.x2].map(re => ({ re, im: 0 })), ""));
    msg("Configuración cargada. Pulsa Calcular o avanza paso a paso.", "info");
  }
  g.MullerLab = { load, examples: EXAMPLES, snapshot: () => snap };

  /* ---------- panel de progreso en Inicio ---------- */
  function renderProgress() {
    const S = g.MullerScoring, box = $("progress-rows"); if (!box) return;
    box.innerHTML = S.breakdown().map(r => `<li><span>${r.label}<small class="muted"> · ${r.done}/${r.units} completadas</small></span><b>${r.score} / ${r.max}</b></li>`).join("");
    $("progress-total").textContent = S.total() + " / " + S.MAX + " puntos · " + S.progress() + "% de progreso · " + S.completed() + " de " + Object.keys(S.UNITS).length + " actividades";
  }

  function init() {
    if (!g.MullerNav || !g.MullerStorage || !g.MullerScoring) { console.error("Faltan módulos base."); return; }
    lab();
    ["MullerGames", "MullerChallenges", "MullerQuiz"].forEach(n => { if (g[n]) g[n].init(); else console.error("Falta " + n); });
    document.addEventListener("muller:score", renderProgress);
    $("resetProgressBtn").addEventListener("click", () => {
      if (!g.confirm("¿Reiniciar todo el progreso y las puntuaciones? Esta acción no se puede deshacer.")) return;
      g.MullerScoring.reset();
      ["MullerGames", "MullerChallenges", "MullerQuiz"].forEach(n => g[n].init());
      renderProgress(); g.MullerNav.goTo("inicio");
    });
    g.MullerScoring.refresh();
  }
  document.addEventListener("DOMContentLoaded", init);
})(window);
