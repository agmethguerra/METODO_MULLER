/* MÜLLER CHALLENGE · Etapa 4 · Said — persistencia con localStorage (con respaldo en memoria). */
(function (g) {
  "use strict";
  const KEY = "muller-challenge:v1";
  let mem = null;
  const blank = () => ({ scores: {}, done: {} });
  function load() {
    if (mem) return mem;
    try { const raw = g.localStorage.getItem(KEY); mem = raw ? JSON.parse(raw) : blank(); } catch (e) { mem = blank(); }
    if (!mem || typeof mem.scores !== "object" || typeof mem.done !== "object") mem = blank();
    return mem;
  }
  function save() { try { g.localStorage.setItem(KEY, JSON.stringify(mem || blank())); return true; } catch (e) { return false; } }
  function reset() { mem = blank(); try { g.localStorage.removeItem(KEY); } catch (e) {} return mem; }
  g.MullerStorage = { KEY, load, save, reset };
})(window);
