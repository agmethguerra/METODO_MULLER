# MÜLLER CHALLENGE · Etapa 4 · Saith — Paquete de transferencia final

**Entrega:** Sath · **Etapa:** 4, Gamificación, evaluación e integración · **Estado:** versión final para exposición, pendiente de revisión visual en navegador.

## 1. Revisión de las etapas anteriores (hallazgos y correcciones)
| # | Hallazgo | Acción |
|---|---|---|
| 1 | La Etapa 2 recibida (`muller_challenge.html`) no cumplía la especificación (archivo único, otra tipografía, calculadora solo cúbica, fórmula `a` distinta, XP propio, sin Créditos ni los 5 módulos). | Se reconstruyó la etapa de Danilo con la arquitectura obligatoria (ver `DOCUMENTO_TECNICO_DANILO.md`). |
| 2 | El laboratorio de Peralta no estaba conectado a la interfaz. | Conectado en `js/app.js` reutilizando `MullerMethod` y `MullerGraph` **sin duplicar el algoritmo**. Se añadió un selector de ejemplos. |
| 3 | **Criterio de convergencia de `muller.js`**: aceptaba `error ≤ tol·(1+|x₃|)` **o** residuo ≤ tol. Declaraba “convergió” con error 2.5×10⁻⁴ > tol 10⁻⁴ y, en `x²−2`, tras 1 iteración con error 0.586. No coincidía con el módulo 5 de Valery. | Cambio de **una línea** en `muller.js`: `converged = error < tolerance` (|x₃−x₂| < tol). Resultado: 4, 2 y 9 iteraciones, iguales a las de Valery. El resto del algoritmo no se tocó. |
| 4 | Fórmulas, coeficientes (`a = d`), selección del denominador de mayor módulo y raíz compleja de Peralta. | Verificadas por pruebas; sin cambios. |

## 2. Archivos de esta etapa
Nuevos: `js/storage.js`, `js/scoring.js`, `js/games.js`, `js/challenges.js`, `js/quiz.js`, `tests/integration-tests.js`, `tests/contenido.json`, `README.md`, este documento.
Modificados: `js/app.js` (lab + utilidades + inicialización), `js/muller.js` (1 línea), `index.html` (scripts, selector de ejemplo, botones activos, panel de progreso, retiro de etiquetas “pendiente”), `css/styles.css` (bloque “Etapa 4” al final).
Copiados sin cambios: `js/math-parser.js`, `js/graph.js`, `tests/tests.html`, `tests/muller-tests.js`.

## 3. Funcionalidades
- **Juego 1:** 10 pasos barajados (nunca ya ordenados), ▲/▼, 90 s, 10 pts por posición, muestra orden correcto con explicación, repetir.
- **Juego 2:** 5 rondas, opciones barajadas, 20 s, 20 pts; sin respuesta = error.
- **Juego 3:** 3 niveles, 100 pts c/u, tolerancia 0.001, **3 intentos** por nivel (decisión de Saith; el documento no fija intentos). La respuesta esperada sale de `MullerMethod.createSession(...).calculateNext()`. Tras cada nivel, botón *Verificar en el laboratorio* (carga la función en el laboratorio con `MullerLab.load`).
- **Desafíos:** 4 misiones, 50 pts, explicación, reintentar.
- **Evaluación:** 10 preguntas una a la vez con retroalimentación; resultado con puntaje /100, % de aciertos, correctas, incorrectas y clasificación.
- **Puntuación/persistencia:** mejor puntuación por actividad en `localStorage` (clave `muller-challenge:v1`, con respaldo en memoria si el navegador lo bloquea). HUD, barra lateral y panel *Tu progreso* en Inicio (puntos, % y actividades completadas, 10 en total). Reinicio con confirmación.

## 4. API pública añadida
`MullerStorage.{load,save,reset}` · `MullerScoring.{record(id,pts),best,total,progress,completed,breakdown,reset,refresh}` (ids: `game1`, `game2`, `game3.1-3`, `ch.1-4`, `quiz`) · `MullerLab.{load(cfg),examples,snapshot}` · `MullerUI.{esc,shuffle,timer,mcq,feedback,typeset}` · `MullerGames/MullerChallenges/MullerQuiz.init()`. Eventos: `muller:score`.
El contenido académico de Valery está embebido en `games.js`, `challenges.js` y `quiz.js` (copia de `tests/contenido.json`).

## 5. Pruebas realizadas
`node tests/integration-tests.js` (jsdom, con Chart.js/Lucide/MathJax simulados): navegación, pestañas, comprensión, laboratorio (4/2/9 iteraciones, paso a paso, expresión inválida, código JS rechazado, valores repetidos, raíz compleja), los 3 juegos jugados al máximo, temporizadores con reloj simulado, desafíos, evaluación, persistencia en `localStorage`, reinicio con/sin confirmación y ausencia de errores de ejecución.

## 6. Limitaciones conocidas (leer antes de exponer)
1. **No se probó en un navegador real.** jsdom no dibuja: **la apariencia, el responsive, la gráfica de Chart.js y el renderizado de MathJax deben revisarse con Live Server** en 1440×900 y en móvil.
2. Requiere internet para los CDN.
3. La gráfica solo representa la parte real (limitación de Peralta); con raíces complejas la tabla sí muestra el valor complejo.
4. Las referencias de Valery (Müller 1956, p. 208–215) están citadas de memoria: verificar antes de proyectarlas.
5. El Juego 3 acepta cualquier valor dentro de 0.001 del resultado del motor; en el nivel 3 la primera aproximación es x₃ ≈ −0.1167 (no −1): la raíz −1 se alcanza tras 9 iteraciones.
