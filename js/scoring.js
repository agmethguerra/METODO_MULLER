/* MÜLLER CHALLENGE · Etapa 4 · Said — sistema global de puntuación (máximo 800).
 * Se conserva la MEJOR puntuación de cada actividad; visitar una sección no otorga puntos. */
(function (g) {
  "use strict";
  const UNITS = { game1: 100, game2: 100, "game3.1": 100, "game3.2": 100, "game3.3": 100, "ch.1": 50, "ch.2": 50, "ch.3": 50, "ch.4": 50, quiz: 100 };
  const GROUPS = [
    { id: "game1", label: "Juego 1 · Ordena el algoritmo", keys: ["game1"] },
    { id: "game2", label: "Juego 2 · Detective matemático", keys: ["game2"] },
    { id: "game3", label: "Juego 3 · Cazadores de raíces", keys: ["game3.1", "game3.2", "game3.3"] },
    { id: "challenges", label: "Desafíos", keys: ["ch.1", "ch.2", "ch.3", "ch.4"] },
    { id: "quiz", label: "Evaluación final", keys: ["quiz"] }
  ];
  const MAX = 800, keys = Object.keys(UNITS), st = () => g.MullerStorage.load();
  const best = id => st().scores[id] || 0, isDone = id => !!st().done[id];
  const sum = ks => ks.reduce((a, k) => a + best(k), 0);
  const total = () => sum(keys);
  const completed = () => keys.filter(isDone).length;
  const progress = () => Math.round(completed() / keys.length * 100);
  const breakdown = () => GROUPS.map(gr => ({ id: gr.id, label: gr.label, score: sum(gr.keys), max: gr.keys.reduce((a, k) => a + UNITS[k], 0), done: gr.keys.filter(isDone).length, units: gr.keys.length }));
  function refresh() {
    if (g.MullerNav) g.MullerNav.updateHud({ score: total(), max: MAX, progress: progress() });
    const a = document.getElementById("sideActivities"); if (a) a.textContent = completed() + " de " + keys.length + " actividades";
    document.dispatchEvent(new CustomEvent("muller:score", { detail: { total: total(), progress: progress(), completed: completed() } }));
  }
  function record(id, points, finished) {
    if (!(id in UNITS)) throw new Error("Actividad desconocida: " + id);
    const p = Math.max(0, Math.min(UNITS[id], Math.round(Number(points) || 0))), s = st();
    s.scores[id] = Math.max(s.scores[id] || 0, p);
    if (finished !== false) s.done[id] = true;
    g.MullerStorage.save(); refresh(); return s.scores[id];
  }
  function reset() { g.MullerStorage.reset(); refresh(); }
  g.MullerScoring = { MAX, UNITS, record, best, isDone, total, completed, progress, breakdown, refresh, reset };
})(window);
