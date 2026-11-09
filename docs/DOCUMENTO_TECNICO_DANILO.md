# MÜLLER CHALLENGE · Etapa 2 · Danilo (reconstruida) — Paquete de transferencia

**Entrega:** Danilo (versión corregida) · **Etapa completada:** 2, Diseño y estructura visual · **Siguiente:** Peralta (Etapa 3), luego Said (Etapa 4).

## 1. Archivos
`index.html`, `css/styles.css`, `css/animations.css`, `css/responsive.css`, `js/navigation.js`, `assets/icons/` (vacía), `docs/DOCUMENTO_TECNICO_DANILO.md`.
Se descarta `muller_challenge.html` (archivo único, otra tipografía, calculadora cúbica con `a` incorrecta, XP propio). No se reutiliza código de él.

## 2. Cómo ejecutar
Abrir la carpeta en VS Code → clic derecho en `index.html` → *Open with Live Server*. Requiere internet (Bootstrap 5.3.3, Lucide, Chart.js 4.4.7, MathJax 3, Inter vía CDN).

## 3. Organización del HTML
Barra lateral `#sidebar` → barra superior `.topbar` → `<main class="content">` con 7 `<section class="seccion">`. Solo una tiene la clase `active`.

| Sección | id | Estado |
|---|---|---|
| 1 Inicio | `#inicio` | Terminada |
| 2 Aprende Müller | `#aprende` | Terminada (5 módulos de Valery) |
| 3 Laboratorio | `#laboratorio` | Interfaz lista; **motor pendiente (Etapa 3)** |
| 4 Zona de juegos | `#juegos` | Espacios listos; **lógica pendiente (Etapa 4)** |
| 5 Desafíos | `#desafios` | Espacios listos; **lógica pendiente (Etapa 4)** |
| 6 Evaluación final | `#evaluacion` | Espacio listo; **lógica pendiente (Etapa 4)** |
| 7 Créditos | `#creditos` | Terminada |

Acceso: enlaces `href="#id"` o atributo `data-goto="id"` en cualquier elemento. La URL cambia el hash, sin recarga.

## 4. Contenido de Valery
Los 5 módulos están en `#aprende` como `#modulo-1` … `#modulo-5` (panes con pestañas `data-tab-group="modulos"`). Se conservó su texto y sus fórmulas MathJax (`\( \)` y `\[ \]`). Se sustituyeron las 4 descripciones de ilustración por SVG propios (módulos 1, 3, 4, 5); el SVG del módulo 2 es el de Valery. Cada módulo tiene su pregunta de comprensión con retroalimentación (sin puntos).

## 5. IDs del laboratorio (los mismos que usa `app.js` de Peralta)
Entradas: `expression`, `x0`, `x1`, `x2`, `tolerance`, `maxIterations`. Botones (deshabilitados hasta conectar): `calculateBtn`, `nextBtn`, `resetBtn`, `loadExampleBtn`. Mensajes: `message`. Métricas: `metricStatus`, `metricIterations`, `metricRoot`, `metricError`.
**Gráfica:** `<canvas id="functionChart">` dentro de `#chartContainer`; ocultar o eliminar `#chartPlaceholder` al dibujar.
**Detalle de iteración:** `#iterationDetails`. **Tabla:** `<tbody id="resultsBody">` con 7 columnas (Iteración, x₀, x₁, x₂, x₃, f(x₃), Error); contador `#rowCount`.
Al conectar el motor: quitar `disabled` de los botones y la etiqueta `.pending` del encabezado del laboratorio.

## 6. Contenedores para Etapa 4
Juegos: `#game1-container`, `#game2-container`, `#game3-container`; botones `game{1,2,3}-start` y `game{1,2,3}-retry`; temporizadores `#game1-timer`, `#game2-timer`. Desafíos: `#challenges-container` con `#mission1` … `#mission4`. Evaluación: `#quiz-container`, `#quizProgress`, `#quizScore`, `#quizStart`, `#quiz-results`.
Los reglamentos y puntos máximos de cada juego ya están escritos en las tarjetas. Los marcados `NO IMPLEMENTADO` / `PENDIENTE` deben retirarse al implementar cada función.

## 7. API pública de `js/navigation.js` (`window.MullerNav`)
- `goTo(id, {silent})` · `current()` · `sections()`.
- `showTab(grupo, "#idPane")` (grupos: `modulos`, `juegos`).
- `updateHud({score, max=800, progress})` actualiza barra superior y lateral (puntos y porcentaje). **No guarda ni calcula puntuación**; eso es de `scoring.js`.
- `typeset(elemento)` vuelve a procesar MathJax; `refreshIcons()` vuelve a pintar Lucide tras insertar HTML nuevo.
- Eventos en `document`: `muller:section` (`detail.id`, `detail.title`) y `muller:tab` (`detail.group`, `detail.target`). Útil para redibujar la gráfica de Chart.js al entrar a `#laboratorio`.

## 8. Qué NO se hizo (límites de la etapa)
Algoritmo de Müller, parser, cálculos, juegos, cuestionario y puntuación. El HUD muestra 0 / 800 hasta que Etapa 4 llame a `updateHud`.

## 9. Pruebas realizadas
Sintaxis de `navigation.js` (`node --check`), IDs únicos y etiquetas HTML balanceadas en `index.html`. **No** se abrió en un navegador real en esta conversación: comprobar con Live Server la navegación, las pestañas, el menú móvil y el renderizado de MathJax.

## 10. Errores conocidos y notas
- Las fuentes, Lucide, Chart.js y MathJax dependen de CDN (sin internet no cargan).
- Valery documenta 4 iteraciones para `x³−x−1` con error |x₃−x₂|; el motor de Peralta reporta 3 por su criterio de residuo. Resolver en la integración.
- `tab-btn` y la pregunta de comprensión usan delegación de eventos: funcionan con contenido insertado después.

## 11. Instrucciones para Peralta
Conservar este HTML/CSS. Cargar `math-parser.js`, `muller.js`, `graph.js`, `app.js` después de `navigation.js` (hay un comentario en `index.html`), adaptar `app.js` a los IDs de la sección 5 y escuchar `muller:section` para redimensionar la gráfica.
