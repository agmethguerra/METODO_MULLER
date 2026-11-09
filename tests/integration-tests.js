/* Pruebas generales (Etapa 4 · Said). Ejecutar:  npm i jsdom  &&  node tests/integration-tests.js
 * Carga index.html real en jsdom, ejecuta los scripts del proyecto (Chart.js/Lucide/MathJax simulados)
 * y "juega" cada actividad comprobando resultados y puntuación. */
const fs = require("fs"), path = require("path"), { JSDOM } = require("jsdom");
const root = path.join(__dirname, ".."), read = f => fs.readFileSync(path.join(root, f), "utf8");
const D = JSON.parse(fs.readFileSync(process.env.MULLER_JSON || path.join(root, "tests", "contenido.json"), "utf8"));
let pass = 0, fail = 0;
const ok = (n, c, d) => { c ? pass++ : fail++; console.log((c ? "  ✔ " : "  ✘ ") + n + (c ? "" : "  → " + (d || ""))); };
(async () => {
  const dom = new JSDOM(read("index.html").replace(/<script src="https?:[^>]*><\/script>/g, ""), { runScripts: "outside-only", url: "http://localhost/", pretendToBeVisual: true });
  const w = dom.window, doc = w.document;
  await new Promise(r => w.addEventListener("load", r));
  w.lucide = { createIcons() {} }; w.Chart = class { constructor() { w.__charts = (w.__charts || 0) + 1; } destroy() {} };
  w.HTMLCanvasElement.prototype.getContext = () => ({ createLinearGradient: () => ({ addColorStop() {} }) }); w.confirm = () => true; w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = () => {};
  const errs = []; w.addEventListener("error", e => errs.push(e.message));
  ["navigation", "math-parser", "muller", "graph", "storage", "scoring", "games", "challenges", "quiz", "app"].forEach(f => w.eval(read("js/" + f + ".js")));
  doc.dispatchEvent(new w.Event("DOMContentLoaded"));
  const $ = id => doc.getElementById(id), click = el => el.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  const txt = id => $(id).textContent.trim(), hud = () => txt("hudScore");
  const choiceByText = (box, t) => [...box.querySelectorAll(".choice")].find(b => b.querySelector("span").textContent === t);

  console.log("Navegación y estructura");
  ok("Inicio activo al cargar", doc.querySelector(".seccion.active").id === "inicio");
  ["aprende", "laboratorio", "juegos", "desafios", "evaluacion", "creditos", "inicio"].forEach(s => { w.MullerNav.goTo(s); ok("goTo " + s, doc.querySelector(".seccion.active").id === s && txt("currentSection").length > 0); });
  const b = doc.querySelector('[data-tab-target="#modulo-3"]'); click(b); ok("Pestaña módulo 3", $("modulo-3").classList.contains("active") && !$("modulo-1").classList.contains("active"));
  const comp = doc.querySelector("#modulo-1 .comprension"); click(comp.querySelector(`[data-opcion="${comp.dataset.correcta}"]`)); ok("Pregunta de comprensión correcta", comp.classList.contains("ok"));
  click(comp.querySelector('[data-opcion="a"]')); ok("Pregunta de comprensión incorrecta", comp.classList.contains("bad"));
  ok("HUD inicial 0 / 800", hud() === "0 / 800");

  console.log("Laboratorio (motor de Peralta)");
  click($("calculateBtn")); ok("Ejemplo 1: converge en 4 iteraciones", txt("metricStatus") === "Convergió" && txt("metricIterations") === "4", txt("metricStatus") + txt("metricIterations"));
  ok("Raíz ≈ 1.3247", txt("metricRoot").startsWith("1.32471"), txt("metricRoot")); ok("Tabla con 4 filas", doc.querySelectorAll("#resultsBody tr").length === 4 && txt("rowCount") === "4 REGISTROS");
  ok("Gráfica creada", w.__charts >= 1);
  click($("resetBtn")); ok("Reiniciar limpia la tabla", txt("metricIterations") === "0");
  click($("nextBtn")); click($("nextBtn")); ok("Paso a paso: 2 iteraciones", txt("metricIterations") === "2");
  $("expression").value = "x^^3"; click($("calculateBtn")); ok("Expresión inválida muestra error", $("message").classList.contains("msg-err"), $("message").textContent);
  $("expression").value = "window.alert(1)"; click($("calculateBtn")); ok("Código JS rechazado (sin eval)", $("message").classList.contains("msg-err"));
  $("x1").value = "1"; $("expression").value = "x^2-2"; $("x0").value = "1"; click($("calculateBtn")); ok("Valores repetidos detectados", $("message").classList.contains("msg-err"), $("message").textContent);
  $("exampleSelect").value = "three"; click($("loadExampleBtn")); click($("calculateBtn")); ok("Ejemplo 3: x³+1 → −1 en 9 iteraciones", txt("metricIterations") === "9" && /^-1/.test(txt("metricRoot")), txt("metricIterations") + " " + txt("metricRoot"));
  $("expression").value = "x^2+1"; $("x0").value = "0"; $("x1").value = "1"; $("x2").value = "2"; click($("calculateBtn")); ok("Raíz compleja (x²+1)", /i/.test(txt("metricRoot")), txt("metricRoot"));
  $("exampleSelect").value = "one"; click($("loadExampleBtn"));

  console.log("Juego 1 · Ordena el algoritmo");
  w.MullerNav.goTo("juegos"); click($("game1-start")); ok("10 pasos mostrados", doc.querySelectorAll("#game1-container .order-item").length === 10);
  const byText = {}; D.juego1_ordena_algoritmo.pasos.forEach(p => { byText[p.texto] = p.id; });
  const cur = () => [...doc.querySelectorAll("#game1-container .order-t")].map(e => byText[e.textContent]);
  const target = D.juego1_ordena_algoritmo.orden_correcto;
  for (let i = 0; i < 10; i++) { let pos = cur().indexOf(target[i]); while (pos > i) { click(doc.querySelectorAll("#game1-container [data-d='-1']")[pos]); pos--; } }
  click(doc.querySelector("#game1-container [data-check]")); ok("Orden perfecto = 100 puntos", /100 \/ 100/.test($("game1-container").textContent) && hud() === "100 / 800", hud());
  ok("Muestra explicaciones", $("game1-container").textContent.includes(D.juego1_ordena_algoritmo.pasos[0].explicacion.slice(0, 20)));
  click($("game1-retry")); click(doc.querySelector("#game1-container [data-check]")); ok("Repetir no baja la mejor puntuación", hud() === "100 / 800", hud());

  console.log("Juego 2 · Detective matemático");
  w.MullerNav.goTo("juegos"); click($("game2-start"));
  D.juego2_detective.rondas.forEach((q, k) => { const o = choiceByText($("g2-opts"), q.opciones[q.correcta]); ok("Ronda " + (k + 1) + " correcta +20", !!o && (click(o), o.classList.contains("correct")) && /\+20/.test($("g2-fb").textContent)); click(doc.querySelector("#game2-container [data-next]")); });
  ok("Juego 2 = 100 puntos", /100 \/ 100/.test($("game2-container").textContent) && hud() === "200 / 800", hud());

  console.log("Juego 3 · Cazadores de raíces (usa el motor real)");
  click($("game3-start"));
  D.juego3_cazadores_de_raices.niveles.forEach((l, k) => {
    if (k === 0) { $("g3-in").value = "9"; click(doc.querySelector("#game3-container [data-check]")); ok("Respuesta incorrecta: quedan 2 intentos", /2 intento/.test($("g3-fb").textContent)); }
    $("g3-in").value = String(l.x3_referencia); click(doc.querySelector("#game3-container [data-check]"));
    ok("Nivel " + l.nivel + " acepta x₃ de referencia (" + l.x3_referencia + ")", $("g3-fb").classList.contains("fb-ok"), $("g3-fb").textContent);
    if (k === 0) { click(doc.querySelector("#game3-container [data-lab]")); ok("Ver en laboratorio carga la función", $("expression").value === l.funcion && doc.querySelector(".seccion.active").id === "laboratorio"); w.MullerNav.goTo("juegos"); }
    click(doc.querySelector("#game3-container [data-next]"));
  });
  ok("Juego 3 = 300 puntos", /300 \/ 300/.test($("game3-container").textContent) && hud() === "500 / 800", hud());
  click($("game3-retry")); $("g3-in").value = "1.3333"; click(doc.querySelector("#game3-container [data-check]")); ok("Tolerancia 0.001 acepta 1.3333", $("g3-fb").classList.contains("fb-ok"));
  $("g3-in").value = "1.34"; click(doc.querySelector("#game3-container [data-check]"));

  console.log("Desafíos");
  D.desafios.misiones.forEach(m => { const card = $("mission" + m.id), o = choiceByText(card.querySelector(".choices"), m.opciones[m.correcta]); click(o); ok("Misión " + m.id + " +50", /\+50/.test(card.textContent)); });
  ok("Desafíos = 200 → total 700", hud() === "700 / 800", hud());
  click($("mission1").querySelector("[data-retry]")); click($("mission1").querySelector(".choice:not([data-x])")); ok("Reintentar no resta puntos", hud() === "700 / 800", hud());

  console.log("Evaluación final");
  click($("quizStart"));
  D.evaluacion_final.preguntas.forEach((q, k) => { ok("Pregunta " + (k + 1) + " de 10", txt("quizProgress") === `PREGUNTA ${k + 1} DE 10`); click(choiceByText(doc.querySelector("#quiz-container .choices"), q.opciones[q.correcta])); click(doc.querySelector("#quiz-container [data-next]")); });
  ok("Resultado: 100/100, Experto en Müller, 100%", /100 \/ 100/.test($("quiz-results").textContent) && /Experto en Müller/.test($("quiz-results").textContent) && /100%/.test($("quiz-results").textContent));
  ok("Puntuación global 800 / 800 y 100% de progreso", hud() === "800 / 800" && txt("hudProgressText") === "100%", hud() + " " + txt("hudProgressText"));
  ok("Panel de progreso en Inicio", /800 \/ 800 puntos/.test(txt("progress-total")) && txt("sideActivities") === "10 de 10 actividades", txt("progress-total"));

  console.log("Temporizadores (reloj simulado)");
  { let cb = null; w.setInterval = f => { cb = f; return 1; }; w.clearInterval = () => { cb = null; };
    click($("game1-start")); ok("Juego 1 inicia con 90 s", txt("game1-timer") === "90 s");
    for (let i = 0; i < 90 && cb; i++) cb(); ok("Juego 1: termina solo al llegar a 0 s", /Se acabó el tiempo/.test($("game1-container").textContent) && txt("game1-timer") === "Fin");
    click($("game2-start")); for (let i = 0; i < 20 && cb; i++) cb(); ok("Juego 2: ronda sin respuesta cuenta como error", /Tiempo agotado/.test($("g2-fb").textContent) && $("g2-opts").querySelectorAll(".choice.correct").length === 1);
  }
  console.log("Persistencia y reinicio");
  const saved = JSON.parse(w.localStorage.getItem("muller-challenge:v1")); ok("localStorage guarda 800 puntos", Object.values(saved.scores).reduce((a, c) => a + c, 0) === 800);
  w.MullerScoring.refresh(); ok("Recalcula desde almacenamiento", w.MullerScoring.total() === 800);
  click($("resetProgressBtn")); ok("Reinicio con confirmación: 0 / 800", hud() === "0 / 800" && w.MullerScoring.completed() === 0 && !w.localStorage.getItem("muller-challenge:v1") || JSON.parse(w.localStorage.getItem("muller-challenge:v1")).scores && Object.keys(JSON.parse(w.localStorage.getItem("muller-challenge:v1")).scores).length === 0, hud());
  ok("Juegos reinician a su pantalla inicial", /Mejor puntuación: <b>0 \/ 100/.test($("game1-container").innerHTML));
  w.confirm = () => false; w.MullerScoring.record("quiz", 50); click($("resetProgressBtn")); ok("Cancelar la confirmación conserva el progreso", w.MullerScoring.total() === 50);
  ok("Sin errores de ejecución", errs.length === 0, errs.join(" | "));
  console.log(`\n${pass} aprobadas · ${fail} fallidas`); w.close(); process.exit(fail ? 1 : 0);
})();
