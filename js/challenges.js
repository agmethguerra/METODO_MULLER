/* MÜLLER CHALLENGE · Etapa 4 · Said — cuatro misiones (50 puntos cada una, máximo 200). Contenido: Valery. */
(function (g) {
  "use strict";
  const DATA = {"misiones":[{"id":1,"nombre":"Reconocimiento","tema":"Müller, bisección y Newton-Raphson","pregunta":"¿Cuál de las siguientes afirmaciones distingue correctamente a los tres métodos?","opciones":["Müller aproxima la función con una parábola por tres puntos y no necesita derivada; Newton-Raphson usa f′(x); la bisección necesita un intervalo con cambio de signo.","Newton-Raphson no necesita derivada, mientras que Müller sí la necesita para construir la parábola.","La bisección converge más rápido que Müller porque siempre divide el intervalo a la mitad.","Los tres métodos parten exactamente de dos aproximaciones iniciales."],"correcta":0,"explicacion":"Müller: 3 puntos, parábola, sin derivada, orden ≈ 1.84. Newton-Raphson: 1 punto, recta tangente, requiere f′, orden 2. Bisección: intervalo con cambio de signo, convergencia lineal (orden 1) pero garantizada."},{"id":2,"nombre":"Fundamento","tema":"Importancia de las tres aproximaciones iniciales","pregunta":"¿Por qué son necesarias tres aproximaciones iniciales distintas en el método de Müller?","opciones":["Porque la ecuación a resolver debe ser de tercer grado.","Porque una parábola tiene tres coeficientes (a, b, c) y tres puntos distintos la determinan de forma única.","Porque con tres puntos el método garantiza la convergencia.","Porque así se calcula el promedio de los tres valores y se reduce el error."],"correcta":1,"explicacion":"El polinomio cuadrático tiene tres incógnitas y se necesitan tres condiciones independientes. Si dos puntos coinciden (h₀ = 0 o h₁ = 0), el sistema no tiene solución única y el método falla."},{"id":3,"nombre":"Interpretación","tema":"Significado del discriminante","pregunta":"En una iteración con función real y puntos reales se obtiene D = b² − 4ac < 0. ¿Qué significa?","opciones":["El método ha fallado y debe detenerse inmediatamente.","La función no tiene ninguna raíz.","La parábola no corta el eje x: sus raíces son complejas conjugadas y la nueva aproximación x₃ será un número complejo.","El coeficiente a es igual a cero."],"correcta":2,"explicacion":"D < 0 indica que la parábola interpoladora no corta el eje x. Müller no se detiene: calcula √D como imaginario y obtiene x₃ complejo. Esto permite hallar raíces complejas, algo que bisección y Newton (con datos reales) no pueden."},{"id":4,"nombre":"Aplicación","tema":"Interpretación de raíces complejas","pregunta":"Al aplicar Müller a f(x) = x² + 1 con x₀ = 0, x₁ = 1, x₂ = 2 se obtiene D = −4 y x₃ = i. ¿Cómo se interpreta este resultado?","opciones":["La función x² + 1 no tiene raíces, por lo que i no tiene significado.","El método dio un resultado erróneo, porque con datos reales debería obtenerse un número real.","x₃ = i es una raíz compleja exacta: f(i) = i² + 1 = 0; la otra raíz es −i (conjugada).","x₃ = i indica que el método divergió."],"correcta":2,"explicacion":"Como f es cuadrática, la parábola de Müller coincide con f. Con a = 1, b = 4, c = 5 → D = −4, √D = 2i, denominador 4 + 2i y x₃ = 2 − 10/(4 + 2i) = i. La función real x² + 1 no corta el eje x, pero tiene raíces complejas conjugadas ±i."}]};
  function mission(m) {
    const card = document.getElementById("mission" + m.id), U = g.MullerUI, S = g.MullerScoring, key = "ch." + m.id;
    if (!card) return;
    let body = card.querySelector(".mbody");
    if (!body) { body = document.createElement("div"); body.className = "mbody"; card.appendChild(body); }
    function play() {
      body.innerHTML = `${S.isDone(key) ? `<span class="badge-done">Completada · mejor: ${S.best(key)} / 50</span>` : ""}<p class="mq">${U.esc(m.pregunta)}</p><div class="choices"></div><div class="mfb"></div>`;
      const fb = body.querySelector(".mfb");
      U.typeset(body);
      U.mcq(body.querySelector(".choices"), m, ok => {
        S.record(key, ok ? 50 : 0);
        U.feedback(fb, ok, `${ok ? "¡Correcto! +50 puntos. " : "Incorrecto. "}${U.esc(m.explicacion)}<div><button type="button" class="btn-x alt" data-retry>Reintentar</button></div>`);
        fb.querySelector("[data-retry]").onclick = play;
      });
    }
    play();
  }
  g.MullerChallenges = { init() { DATA.misiones.forEach(mission); } };
})(window);
