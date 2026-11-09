# MÜLLER CHALLENGE
*Descubre, calcula y conquista las raíces.* Plataforma web educativa sobre el método numérico de Müller.

## Ejecutar
1. Abre esta carpeta en Visual Studio Code. 2. Clic derecho en `index.html` → **Open with Live Server**. Requiere internet (Bootstrap, Lucide, Chart.js, MathJax e Inter por CDN). No usa backend.

## Estructura
`index.html` · `css/` (styles, animations, responsive) · `js/` (navigation, math-parser, muller, graph, storage, scoring, games, challenges, quiz, app) · `assets/icons/` · `docs/` (documentos de transferencia) · `tests/`.

## Puntuación (máx. 800)
Juego 1: 100 · Juego 2: 100 · Juego 3: 300 · Desafíos: 200 · Evaluación: 100. Se guarda la **mejor** puntuación de cada actividad en `localStorage`; visitar secciones no da puntos. El progreso se reinicia desde Inicio → *Reiniciar progreso* (pide confirmación).

## Pruebas
- Motor matemático (navegador): `tests/tests.html` con Live Server → *Ejecutar pruebas*.
- Integración completa (Node): `npm i jsdom` y luego `node tests/integration-tests.js`.
