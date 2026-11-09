/* MÜLLER CHALLENGE · Etapa 4 · Said — evaluación final (10 preguntas, 10 puntos cada acierto). Contenido: Valery. */
(function (g) {
  "use strict";
  const DATA = {"preguntas":[{"id":1,"categoria":"conceptual","pregunta":"¿Qué problema resuelve el método de Müller?","opciones":["Calcular la integral definida de una función.","Aproximar raíces de ecuaciones no lineales f(x) = 0.","Resolver sistemas lineales de ecuaciones.","Calcular la derivada numérica de una función."],"correcta":1,"explicacion":"Müller es un método iterativo de búsqueda de raíces: encuentra valores de x tales que f(x) = 0."},{"id":2,"categoria":"conceptual","pregunta":"¿Con qué tipo de curva aproxima Müller la función en cada iteración?","opciones":["Una recta tangente.","Una parábola que pasa por tres puntos.","Una recta secante por dos puntos.","Una función exponencial."],"correcta":1,"explicacion":"Usa un polinomio interpolador cuadrático (parábola) que pasa por (x₀,f(x₀)), (x₁,f(x₁)) y (x₂,f(x₂))."},{"id":3,"categoria":"caracteristicas","pregunta":"¿Cuántas aproximaciones iniciales necesita el método de Müller?","opciones":["Una.","Dos.","Tres.","Cuatro."],"correcta":2,"explicacion":"Se necesitan tres, porque una parábola tiene tres coeficientes que deben determinarse."},{"id":4,"categoria":"caracteristicas","pregunta":"¿Cuál es el orden de convergencia aproximado del método de Müller?","opciones":["1 (lineal).","Aproximadamente 1.84 (superlineal).","2 (cuadrática exacta).","3 (cúbica)."],"correcta":1,"explicacion":"Su orden es ≈ 1.84: mayor que el de la secante (≈ 1.618) y menor que el de Newton-Raphson (2)."},{"id":5,"categoria":"formulas","pregunta":"¿Cómo se calcula el coeficiente c de la parábola de Müller?","opciones":["c = f(x₀)","c = f(x₂)","c = δ₁ + h₁·d","c = b² − 4ac"],"correcta":1,"explicacion":"La parábola está centrada en x₂, por eso c = p(x₂) = f(x₂)."},{"id":6,"categoria":"formulas","pregunta":"En x₃ = x₂ − 2c / (b ± √D), ¿qué denominador se debe elegir y por qué?","opciones":["El de menor magnitud, para dar un paso más grande.","Siempre b + √D, porque es positivo.","El de mayor magnitud absoluta, para evitar la cancelación numérica.","Siempre b − √D, porque aparece en la fórmula cuadrática."],"correcta":2,"explicacion":"Elegir el denominador de mayor módulo evita restar cantidades casi iguales y selecciona la raíz de la parábola más cercana a x₂."},{"id":7,"categoria":"procedimiento","pregunta":"Después de calcular x₃ sin haber alcanzado la tolerancia, ¿cómo se actualizan los puntos?","opciones":["x₀ ← x₀, x₁ ← x₁, x₂ ← x₃","x₀ ← x₁, x₁ ← x₂, x₂ ← x₃","x₀ ← x₃, x₁ ← x₀, x₂ ← x₁","x₀ ← x₂, x₁ ← x₃, x₂ ← x₃"],"correcta":1,"explicacion":"Se descarta el punto más antiguo y se desplazan los demás: x₀ ← x₁, x₁ ← x₂, x₂ ← x₃."},{"id":8,"categoria":"interpretacion","pregunta":"Si el discriminante D = b² − 4ac es negativo, ¿qué se interpreta?","opciones":["La función no tiene raíces.","Las raíces de la parábola son complejas y x₃ será complejo.","El método converge inmediatamente.","Hay una división por cero."],"correcta":1,"explicacion":"D < 0 significa que la parábola no corta el eje x; √D es imaginario y la nueva aproximación es un número complejo."},{"id":9,"categoria":"interpretacion","pregunta":"Si |x₃ − x₂| es menor que la tolerancia, ¿qué se concluye?","opciones":["Que el método diverge.","Que se debe aumentar el número de iteraciones.","Que el método converge y x₃ se acepta como raíz aproximada.","Que la función no tiene raíz real."],"correcta":2,"explicacion":"Un error menor que la tolerancia es el criterio de convergencia: x₃ se acepta como aproximación de la raíz."},{"id":10,"categoria":"aplicaciones","pregunta":"¿En cuál de estas situaciones destaca especialmente el método de Müller frente a Newton-Raphson o la bisección?","opciones":["Cuando se necesita una convergencia garantizada con un intervalo que cambia de signo.","Cuando la función es lineal.","Cuando se buscan raíces complejas de un polinomio sin calcular derivadas.","Cuando solo se dispone de una aproximación inicial."],"correcta":2,"explicacion":"Müller no necesita derivadas y puede generar raíces complejas partiendo de datos reales, lo que lo hace ideal para polinomios con raíces complejas."}],"clasificacion":[{"min":90,"max":100,"etiqueta":"Experto en Müller"},{"min":70,"max":89,"etiqueta":"Dominio avanzado"},{"min":50,"max":69,"etiqueta":"Aprendiz en progreso"},{"min":0,"max":49,"etiqueta":"Necesitas reforzar los fundamentos"}]};
  const $ = id => document.getElementById(id), U = () => g.MullerUI, S = () => g.MullerScoring;
  const DEFAULT_RES = "El resultado final (puntaje, porcentaje, aciertos, errores y clasificación) se mostrará aquí.";
  function init() {
    const box = $("quiz-container"), start = $("quizStart"), prog = $("quizProgress"), sc = $("quizScore"), res = $("quiz-results"), P = DATA.preguntas, N = P.length;
    let i = 0, pts = 0, hits = 0;
    function idle() {
      prog.textContent = "PREGUNTA 0 DE " + N; sc.textContent = "0 / 100"; start.disabled = false;
      start.textContent = S().isDone("quiz") ? "Repetir evaluación" : "Comenzar evaluación";
      box.innerHTML = `<div class="placeholder-msg"><b>${N} preguntas · una a la vez · 10 puntos por acierto.</b><br>Mejor puntuación: <b>${S().best("quiz")} / 100</b></div>`;
      res.className = "placeholder-msg"; res.textContent = DEFAULT_RES;
    }
    function ask() {
      const q = P[i]; prog.textContent = `PREGUNTA ${i + 1} DE ${N}`;
      box.innerHTML = `<div class="g-wrap"><h4>${U().esc(q.pregunta)}</h4><div class="choices"></div><div class="qfb"></div></div>`;
      const fb = box.querySelector(".qfb");
      U().mcq(box.querySelector(".choices"), q, ok => {
        if (ok) { pts += 10; hits++; } sc.textContent = pts + " / 100";
        U().feedback(fb, ok, `${ok ? "¡Correcto! +10 puntos. " : "Incorrecto. "}${U().esc(q.explicacion)}<div><button type="button" class="btn-x" data-next>${i < N - 1 ? "Siguiente pregunta" : "Ver resultado"}</button></div>`);
      });
    }
    function finish() {
      S().record("quiz", pts);
      const cl = DATA.clasificacion.find(c => pts >= c.min && pts <= c.max);
      prog.textContent = "EVALUACIÓN FINALIZADA"; start.disabled = false; start.textContent = "Repetir evaluación";
      box.innerHTML = `<div class="placeholder-msg"><b>Has completado la evaluación.</b><br>Mejor puntuación guardada: <b>${S().best("quiz")} / 100</b></div>`;
      res.className = ""; res.innerHTML = `<div class="res-card"><div class="res-big">${pts} / 100</div><div><b>${U().esc(cl ? cl.etiqueta : "")}</b></div></div><ul class="points-list"><li>Porcentaje de aciertos<b>${Math.round(hits / N * 100)}%</b></li><li>Respuestas correctas<b>${hits}</b></li><li>Respuestas incorrectas<b>${N - hits}</b></li></ul>`;
    }
    box.onclick = e => { if (e.target.closest("[data-next]")) { i++; i < N ? ask() : finish(); } };
    start.onclick = () => { i = 0; pts = 0; hits = 0; sc.textContent = "0 / 100"; res.className = "placeholder-msg"; res.textContent = DEFAULT_RES; start.disabled = true; ask(); };
    idle();
  }
  g.MullerQuiz = { init };
})(window);
