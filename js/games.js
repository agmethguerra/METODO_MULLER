/* MÜLLER CHALLENGE · Etapa 4 · Said — Zona de juegos.
 * Contenido académico: Valery (embebido abajo). Juego 3 usa MullerMethod (Peralta): no duplica el algoritmo. */
(function (g) {
  "use strict";
  const DATA = {"j1":{"titulo":"Ordena el algoritmo","instrucciones":"Ordena los diez pasos del método de Müller usando los botones de subir y bajar.","orden_correcto":[1,2,3,4,5,6,7,8,9,10],"pasos":[{"id":1,"texto":"Seleccionar tres aproximaciones iniciales distintas, la tolerancia y el máximo de iteraciones.","explicacion":"Todo el método parte de tres puntos distintos: son los que determinarán la primera parábola. También se fijan los criterios de parada."},{"id":2,"texto":"Evaluar la función en x₀, x₁ y x₂.","explicacion":"Se necesitan f(x₀), f(x₁) y f(x₂) para conocer los tres puntos de la gráfica por los que pasará la parábola."},{"id":3,"texto":"Calcular h₀ = x₁ − x₀ y h₁ = x₂ − x₁.","explicacion":"Son las distancias entre puntos consecutivos; aparecen en los denominadores de las diferencias divididas."},{"id":4,"texto":"Calcular las diferencias divididas δ₀ y δ₁.","explicacion":"δ₀ y δ₁ son las pendientes de las dos rectas secantes. Su diferencia indicará la curvatura de la parábola."},{"id":5,"texto":"Obtener los coeficientes cuadráticos a, b y c.","explicacion":"Con d = (δ₁ − δ₀)/(h₁ + h₀) se calcula a = d, b = δ₁ + h₁·d y c = f(x₂): quedan definidos los tres coeficientes de la parábola."},{"id":6,"texto":"Calcular el discriminante D = b² − 4ac.","explicacion":"D indica si la parábola corta el eje x (D ≥ 0) o si sus raíces son complejas (D < 0)."},{"id":7,"texto":"Seleccionar el denominador estable (el de mayor magnitud entre b + √D y b − √D).","explicacion":"Elegir el denominador de mayor módulo evita la cancelación numérica y escoge la raíz de la parábola más cercana a x₂."},{"id":8,"texto":"Calcular la nueva aproximación x₃ = x₂ − 2c / denominador.","explicacion":"Es la raíz de la parábola elegida; se obtiene con la fórmula racionalizada de Müller."},{"id":9,"texto":"Evaluar el error |x₃ − x₂| y compararlo con la tolerancia.","explicacion":"Si el error es menor que la tolerancia, el método converge y se detiene; si no, continúa."},{"id":10,"texto":"Actualizar los puntos (x₀←x₁, x₁←x₂, x₂←x₃) y repetir.","explicacion":"Se descarta el punto más antiguo y se vuelve al paso 2 con la nueva terna de puntos."}]},"j2":{"titulo":"Detective matemático","instrucciones":"Cada ronda muestra un procedimiento de Müller con una sola línea errónea. Selecciona la línea que contiene el error.","contexto_comun":"Todas las rondas usan f(x) = x³ − x − 1 con x₀ = 1, x₁ = 1.5, x₂ = 2 (iteración 1), con f(1) = −1, f(1.5) = 0.875 y f(2) = 5.","rondas":[{"id":1,"tema":"Diferencias divididas","enunciado":"Se calculan h₀, h₁, δ₀, δ₁ y d. ¿En qué línea está el error?","opciones":["h₀ = x₁ − x₀ = 0.5  y  h₁ = x₂ − x₁ = 0.5","δ₀ = (f(x₁) − f(x₀)) / h₀ = (0.875 − (−1)) / 0.5 = 3.75","δ₁ = (f(x₁) − f(x₂)) / h₁ = (0.875 − 5) / 0.5 = −8.25","d = (δ₁ − δ₀) / (h₁ + h₀) = (−8.25 − 3.75) / 1 = −12"],"correcta":2,"explicacion":"δ₁ debe ser (f(x₂) − f(x₁)) / h₁ = (5 − 0.875) / 0.5 = 8.25. La diferencia dividida siempre resta el valor del punto de la izquierda al del punto de la derecha; invertir el orden cambia el signo de la pendiente."},{"id":2,"tema":"Coeficientes","enunciado":"Se calculan los coeficientes de la parábola y el discriminante. ¿En qué línea está el error?","opciones":["a = d = 4.5","b = δ₁ + h₁·d = 8.25 + 0.5·4.5 = 10.5","c = f(x₀) = −1","D = b² − 4ac = 10.5² − 4·4.5·(−1) = 128.25"],"correcta":2,"explicacion":"El término independiente es c = f(x₂) = 5, porque la parábola está centrada en x₂ (el punto más reciente). Usar f(x₀) cambia todos los resultados posteriores."},{"id":3,"tema":"Discriminante","enunciado":"Con a = 4.5, b = 10.5 y c = 5 se calcula el discriminante. ¿En qué línea está el error?","opciones":["Coeficientes: a = 4.5, b = 10.5, c = 5","D = b² + 4ac = 110.25 + 90 = 200.25","√D = √200.25 ≈ 14.151","b + √D ≈ 24.651"],"correcta":1,"explicacion":"El discriminante es D = b² − 4ac = 110.25 − 90 = 20.25 (con raíz exacta √D = 4.5). Sumar 4ac en lugar de restarlo es el error clásico de signo."},{"id":4,"tema":"Selección del denominador","enunciado":"Con b = 10.5 y √D = 4.5 se calcula x₃. ¿En qué línea está el error?","opciones":["√D = √20.25 = 4.5","Denominadores posibles: b + √D = 15  y  b − √D = 6","Se elige b − √D = 6 por ser el de menor magnitud, para obtener un paso mayor","x₃ = x₂ − 2c / 6 = 2 − 10/6 ≈ 0.3333"],"correcta":2,"explicacion":"Debe elegirse el denominador de MAYOR magnitud absoluta (15), para evitar la cancelación numérica y quedarse con la raíz de la parábola más cercana a x₂. Con 15 se obtiene x₃ = 2 − 10/15 ≈ 1.3333, ya muy cerca de la raíz 1.3247."},{"id":5,"tema":"Actualización de aproximaciones","enunciado":"Se termina la iteración 1 y se prepara la siguiente. ¿En qué línea está el error?","opciones":["x₃ = x₂ − 2c / 15 = 2 − 10/15 = 1.3333","Error = |x₃ − x₂| = |1.3333 − 2| = 0.6667, mayor que la tolerancia 0.0001","f(x₃) = 1.3333³ − 1.3333 − 1 ≈ 0.0370","Nueva terna: x₀ ← x₀ = 1, x₁ ← x₂ = 2, x₂ ← x₃ = 1.3333 (se conserva x₀)"],"correcta":3,"explicacion":"Se descarta el punto más antiguo, no se conserva: x₀ ← x₁ = 1.5, x₁ ← x₂ = 2, x₂ ← x₃ = 1.3333. La nueva terna debe ser (1.5, 2, 1.3333)."}]},"j3":{"titulo":"Cazadores de raíces","instrucciones":"Calcula la siguiente aproximación x₃ (primera iteración) del método de Müller. El sistema la compara con el resultado real del algoritmo (tolerancia de comparación 0.001).","niveles":[{"nivel":1,"funcion":"x^3 - x - 1","funcion_mathjax":"f(x)=x^3-x-1","x0":1,"x1":1.5,"x2":2,"valores_intermedios":{"f0":-1,"f1":0.875,"f2":5,"h0":0.5,"h1":0.5,"delta0":3.75,"delta1":8.25,"a":4.5,"b":10.5,"c":5,"D":20.25,"denominador":15},"x3_referencia":1.333333,"pista":"Calcula primero δ₀ y δ₁; luego a, b y c; después D = b² − 4ac.","retroalimentacion_correcta":"¡Correcto! x₃ = 2 − 10/15 ≈ 1.3333. La raíz real de la ecuación es 1.3247.","errores_frecuentes":["Usar b − √D = 6 en lugar de b + √D = 15 daría 0.3333: se debe elegir el denominador de mayor magnitud."]},{"nivel":2,"funcion":"x^2 - 2","funcion_mathjax":"f(x)=x^2-2","x0":0,"x1":1,"x2":2,"valores_intermedios":{"f0":-2,"f1":-1,"f2":2,"h0":1,"h1":1,"delta0":1,"delta1":3,"a":1,"b":4,"c":2,"D":8,"denominador":6.828427},"x3_referencia":1.414214,"pista":"La función ya es una parábola: ¿qué crees que ocurre cuando la parábola de Müller coincide con f?","retroalimentacion_correcta":"¡Correcto! x₃ = 2 − 4/6.8284 ≈ 1.4142 = √2. Como f es un polinomio de grado 2, la parábola interpoladora coincide con f y el método encuentra la raíz exacta en un solo paso.","errores_frecuentes":["Con b − √D = 1.1716 se obtendría x₃ ≈ −1.4142 (la otra raíz de la parábola, más lejana de x₂)."]},{"nivel":3,"funcion":"x^3 + 1","funcion_mathjax":"f(x)=x^3+1","x0":-2,"x1":-1.5,"x2":-0.5,"valores_intermedios":{"f0":-7,"f1":-2.375,"f2":0.875,"h0":0.5,"h1":1,"delta0":9.25,"delta1":3.25,"a":-4,"b":-0.75,"c":0.875,"D":14.5625,"denominador":-4.566084},"x3_referencia":-0.116739,"pista":"Aquí b es negativo: compara los módulos de b + √D y b − √D antes de elegir.","retroalimentacion_correcta":"¡Correcto! Como b < 0, el denominador de mayor magnitud es b − √D = −4.5661 y x₃ = −0.5 − 1.75/(−4.5661) ≈ −0.1167.","errores_frecuentes":["Elegir b + √D = 3.0661 da x₃ ≈ −1.0707 (cercano a la raíz −1 por casualidad, pero no es lo que prescribe el método estable)."],"dato_didactico":"Este nivel muestra que el método estable no siempre da el paso 'más cercano a la raíz verdadera': da la raíz de la parábola más cercana a x₂. Con estos puntos el método tarda 9 iteraciones en converger a −1."}]}};
  const $ = id => document.getElementById(id), UI = () => g.MullerUI, S = () => g.MullerScoring, esc = s => g.MullerUI.esc(s);
  const bestTxt = (id, max) => `Mejor puntuación: <b>${S().best(id)} / ${max}</b>`;

  /* ---------- Juego 1 · Ordena el algoritmo (90 s, 10 puntos por posición) ---------- */
  function game1() {
    const c = $("game1-container"), start = $("game1-start"), retry = $("game1-retry"), tm = $("game1-timer"), D = DATA.j1, byId = {};
    D.pasos.forEach(p => { byId[p.id] = p; });
    let order = [], tmr = null;
    const stop = () => { if (tmr) { tmr.stop(); tmr = null; } };
    function intro() {
      stop(); tm.textContent = "90 s"; start.disabled = false; retry.disabled = true;
      c.innerHTML = `<div class="placeholder-msg"><b>Ordena los 10 pasos del método de Müller.</b><br>Usa ▲ y ▼. Tienes 90 segundos y cada posición correcta vale 10 puntos.<br>${bestTxt("game1", 100)}</div>`;
    }
    function render() {
      c.innerHTML = `<div class="g-wrap"><ol class="order-list">${order.map((id, i) => `<li class="order-item"><span class="order-n">${i + 1}</span><span class="order-t">${esc(byId[id].texto)}</span><span class="order-btns"><button type="button" class="mini" data-mv="${i}" data-d="-1" ${i === 0 ? "disabled" : ""} aria-label="Subir">▲</button><button type="button" class="mini" data-mv="${i}" data-d="1" ${i === order.length - 1 ? "disabled" : ""} aria-label="Bajar">▼</button></span></li>`).join("")}</ol><button type="button" class="btn-x" data-check>Terminar y comprobar</button></div>`;
    }
    function finish(timeout) {
      stop();
      const ok = order.map((id, i) => id === D.orden_correcto[i]), n = ok.filter(Boolean).length;
      S().record("game1", n * 10);
      c.innerHTML = `<div class="g-wrap"><div class="res-card"><div class="res-big">${n * 10} / 100</div><div>${timeout ? "¡Se acabó el tiempo! " : ""}${n} de 10 posiciones correctas.<br>${bestTxt("game1", 100)}</div></div><p class="muted">Orden correcto y explicación de cada paso (✓ = tu posición era correcta):</p><ol class="order-list">${D.orden_correcto.map((id, i) => `<li class="order-item ${ok[i] ? "is-ok" : "is-bad"}"><span class="order-n">${i + 1}</span><span class="order-t"><b>${esc(byId[id].texto)}</b><br><small>${esc(byId[id].explicacion)}</small></span><span>${ok[i] ? "✓" : "✗"}</span></li>`).join("")}</ol></div>`;
      UI().typeset(c); start.disabled = true; retry.disabled = false; tm.textContent = "Fin";
    }
    function begin() {
      stop(); order = UI().shuffle(D.orden_correcto, a => a.every((v, i) => v === D.orden_correcto[i]));
      start.disabled = true; retry.disabled = true; render();
      tmr = UI().timer(90, l => { tm.textContent = l + " s"; }, () => finish(true));
    }
    c.onclick = e => {
      const mv = e.target.closest("[data-mv]");
      if (mv && tmr) { const i = +mv.dataset.mv, j = i + +mv.dataset.d; [order[i], order[j]] = [order[j], order[i]]; render(); }
      else if (e.target.closest("[data-check]") && tmr) finish(false);
    };
    start.onclick = begin; retry.onclick = begin; intro();
  }

  /* ---------- Juego 2 · Detective matemático (5 rondas, 20 s, 20 puntos) ---------- */
  function game2() {
    const c = $("game2-container"), start = $("game2-start"), retry = $("game2-retry"), tm = $("game2-timer"), D = DATA.j2, R = D.rondas;
    let i = 0, score = 0, tmr = null;
    const stop = () => { if (tmr) { tmr.stop(); tmr = null; } };
    function intro() {
      stop(); tm.textContent = "20 s"; start.disabled = false; retry.disabled = true;
      c.innerHTML = `<div class="placeholder-msg"><b>5 rondas · 20 segundos por pregunta · 20 puntos por acierto.</b><br>Encuentra la línea con el error matemático.<br>${bestTxt("game2", 100)}</div>`;
    }
    function round() {
      stop(); const q = R[i];
      c.innerHTML = `<div class="g-wrap"><p class="muted" style="font-size:13px;margin:0">${esc(D.contexto_comun)}</p><span class="tag">RONDA ${i + 1} DE ${R.length} · ${esc(q.tema)}</span><h4>${esc(q.enunciado)}</h4><div class="choices" id="g2-opts"></div><div id="g2-fb"></div></div>`;
      const opts = $("g2-opts"), fb = $("g2-fb");
      const settle = (ok, pre) => {
        stop(); if (ok) score += 20; tm.textContent = "—";
        UI().feedback(fb, ok, `${pre}${ok ? "¡Correcto! +20 puntos. " : "Incorrecto. "}${esc(q.explicacion)}<div><button type="button" class="btn-x" data-next>${i < R.length - 1 ? "Siguiente ronda" : "Ver resultado"}</button></div>`);
      };
      UI().mcq(opts, q, ok => settle(ok, ""));
      tmr = UI().timer(20, l => { tm.textContent = l + " s"; }, () => { UI().lockChoices(opts, q.correcta, -1); settle(false, "¡Tiempo agotado! "); });
    }
    function end() {
      S().record("game2", score); tm.textContent = "Fin"; retry.disabled = false;
      c.innerHTML = `<div class="g-wrap"><div class="res-card"><div class="res-big">${score} / 100</div><div>${score / 20} de ${R.length} errores detectados.<br>${bestTxt("game2", 100)}</div></div></div>`;
    }
    const begin = () => { i = 0; score = 0; start.disabled = true; retry.disabled = true; round(); };
    c.onclick = e => { if (e.target.closest("[data-next]")) { i++; i < R.length ? round() : end(); } };
    start.onclick = begin; retry.onclick = begin; intro();
  }

  /* ---------- Juego 3 · Cazadores de raíces (3 niveles, 100 puntos, tolerancia 0.001) ---------- */
  function game3() {
    const c = $("game3-container"), start = $("game3-start"), retry = $("game3-retry"), L = DATA.j3.niveles, TOL = 0.001, MAX_TRIES = 3;
    let lv = 0, tries = 0, run = [];
    const expected = l => g.MullerMethod.createSession({ expression: l.funcion, x0: l.x0, x1: l.x1, x2: l.x2, tolerance: 1e-4, maxIterations: 50 }).calculateNext().x3.re;
    function intro() {
      start.disabled = false; retry.disabled = true;
      c.innerHTML = `<div class="placeholder-msg"><b>3 niveles · 100 puntos cada uno · ${MAX_TRIES} intentos por nivel.</b><br>Calcula x₃ con el método de Müller (tolerancia de comparación ${TOL}).<br>${bestTxt("game3.1", 100)} · ${bestTxt("game3.2", 100)} · ${bestTxt("game3.3", 100)}</div>`;
    }
    function level() {
      const l = L[lv]; tries = 0;
      c.innerHTML = `<div class="g-wrap"><span class="tag">NIVEL ${l.nivel} DE ${L.length}</span><h4>\\(${l.funcion_mathjax}\\)</h4><p>Con \\(x_0=${l.x0}\\), \\(x_1=${l.x1}\\), \\(x_2=${l.x2}\\), calcula la siguiente aproximación \\(x_3\\).</p><div class="g3-row"><input id="g3-in" class="form-control" type="text" inputmode="decimal" placeholder="x₃ ≈ …" autocomplete="off"><button type="button" class="btn-x" data-check>Verificar</button><button type="button" class="btn-x alt" data-hint>Ver pista</button></div><div id="g3-fb"></div></div>`;
      UI().typeset(c); $("g3-in").focus();
    }
    function resolve(ok, msg) {
      const l = L[lv], pts = ok ? 100 : 0; run.push(pts); S().record("game3." + l.nivel, pts);
      $("g3-in").disabled = true; c.querySelector("[data-check]").disabled = true;
      UI().feedback($("g3-fb"), ok, `${msg}<div class="g3-row"><button type="button" class="btn-x alt" data-lab>Verificar en el laboratorio</button><button type="button" class="btn-x" data-next>${lv < L.length - 1 ? "Siguiente nivel" : "Ver resultado"}</button></div>`);
    }
    function check() {
      const l = L[lv], v = parseFloat($("g3-in").value.replace(",", "."));
      if (!Number.isFinite(v)) return UI().feedback($("g3-fb"), false, "Escribe un número válido (por ejemplo 1.3333).");
      const exp = expected(l);
      if (Math.abs(v - exp) < TOL) return resolve(true, `${esc(l.retroalimentacion_correcta)}`);
      tries++;
      if (tries >= MAX_TRIES) return resolve(false, `Sin intentos. La respuesta era x₃ ≈ ${exp.toFixed(6)}. ${esc(l.errores_frecuentes[0] || "")}`);
      UI().feedback($("g3-fb"), false, `Todavía no. Te quedan ${MAX_TRIES - tries} intento(s). Revisa δ₀, δ₁, a, b, c y el denominador.`);
    }
    function end() {
      const t = run.reduce((a, b) => a + b, 0); retry.disabled = false;
      c.innerHTML = `<div class="g-wrap"><div class="res-card"><div class="res-big">${t} / 300</div><div>${run.filter(p => p > 0).length} de ${L.length} niveles resueltos en esta partida.<br>Mejor total guardado: <b>${S().best("game3.1") + S().best("game3.2") + S().best("game3.3")} / 300</b></div></div></div>`;
    }
    c.onclick = e => {
      if (e.target.closest("[data-check]")) check();
      else if (e.target.closest("[data-hint]")) UI().feedback($("g3-fb"), true, esc(L[lv].pista));
      else if (e.target.closest("[data-lab]")) { const l = L[lv]; g.MullerLab.load({ expression: l.funcion, x0: l.x0, x1: l.x1, x2: l.x2, tolerance: 0.0001, maxIterations: 50 }); g.MullerNav.goTo("laboratorio"); }
      else if (e.target.closest("[data-next]")) { lv++; lv < L.length ? level() : end(); }
    };
    c.onkeydown = e => { if (e.key === "Enter" && e.target.id === "g3-in" && !e.target.disabled) check(); };
    const begin = () => { lv = 0; run = []; start.disabled = true; retry.disabled = true; level(); };
    start.onclick = begin; retry.onclick = begin; intro();
  }
  g.MullerGames = { init() { game1(); game2(); game3(); } };
})(window);
