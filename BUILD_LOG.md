# BUILD_LOG · Las 338 revistas que miden la ciencia de la información

Sitio interactivo del paper «Análisis bibliométrico de revistas en Bibliotecología y Ciencias
de la Información indexadas en OpenAlex y SJR: análisis de redes de impacto» (manuscrito 2026).

## Ronda 1 · Esqueleto y capa de datos
- **Meta**: pasar el paper a un sitio editorial interactivo (español).
- **Decisiones**: átomo temático = la revista física (número impreso). Portada A = recursión
  infinita de la revista (cada revista, una casilla de una estantería mayor); B = vista
  explosionada axonométrica con 5 capas-tesis (lomo APC/OA, cuartil SJR, red de co-citación,
  páginas/productividad, portada/citación); C = plano alámbrico de la misma geometría.
  `js/data.js` (window.RPT) + `js/sources.js` (registro K1–K20, 4 clases de fuente fechadas).
- **Archivos**: index.html, css/{style,fonts}.css (invariantes copiados verbatim),
  js/{data,sources,utils}.js.
- **Validación**: node --check OK.

## Ronda 2 · Gráficos firma (8 módulos)
- **Decisiones por forma de dato**: cifras duras del estudio → objeto-evidencia P17 (revista
  central con placas colgantes); red SNA → canvas 338 nodos, 5 corrientes, simulación de
  fuerzas propia (topología marcada «DERIVADA»); geografía → estanterías regionales
  (1 lomo = 2 revistas, azul = >50% OA); citación → barras log Top-20 + periferia fuera de
  escala; productividad vs impacto → dispersión log-log con diagonales iso-ratio; cuartiles
  → matriz térmica con celdas «s/d» (hueco rojo rayado, sin interpolar); topics → mapa de
  burbujas con nodo E-Government punteado (sin cifra en el estudio); veredicto APC/OA →
  balanza P18 con pesos-disparador punteados y sello de falsación.
- **Disciplina de datos**: todo valor no reportado se dibuja como huevo/hueco («s/d», rojo
  semántico); nada de interpolación; cada cifra abre ficha con base y fuente fechada.
- **Validación**: screenshots por módulo, bucle crítica→arreglo.

## Ronda 3 · QA dual-width y correcciones (9 arreglos)
- Portada A: celdas gigantes → cellBase 0.78→0.34·minDim, zoom invertido a G^-phase,
  salto de casilla central corregido (L>0), visor solo cuando la capa-1 cabe en pantalla.
- Red: gráfico en blanco → bucle rAF de entrada (prog 0→1, 1.9 s).
- Citación Top-20: nombre de la 1.ª fila cortado a la izquierda → truncado 28+«…».
- Periferia: anotación «190×» fuera del marco → condicional a sx < 620.
- Dispersión: etiquetas cortadas → ML 84→116, dominio x a 2500, anclas y clamps.
- Balanza: haz inclinado al revés → rotate(-TILT); pesos-disparador recolocados (PX±150).
- Topics: leyenda de dominios cortada → abreviaturas (CompSci/InfoSci/Mgmt/DataSci/LibSci/KM).
- Portada B: pila solapaba el subtítulo → cy 0.60h + sesgo de explosión a la baja (DROP=6·k).
- **Validación**: 1680px → 0 pageerrors, 0 overflow, et-book OK.

## Ronda 4 · Regresión final
- Red: etiquetas sin clamp → lado según borde + deconflicto vertical (11 px).
- Dispersión: «Lecture Notes…» colisionaba con «Journal of Academic Librarianship» →
  etiqueta a la derecha-arriba del punto (dx 10, dy -8), medido con getBBox real.
- prefers-reduced-motion: portada A quedaba teñida de azul (flash de nacimiento aplicado en
  el marco estático) → flash desactivado bajo REDUCE; B/C muestran marco completado (k=1).
- **Gates finales**: node --check 16/16 OK · playwright 1680+1280 slow-scroll: 0 pageerrors,
  0 errores de consola (salvo favicon), scrollWidth == clientWidth, fonts et-book OK ·
  reduced-motion OK · dist-single.html (349 KB) abre con file:// sin errores.

## Riesgos residuales
- La topología de la red es una lectura derivada de las 5 corrientes descritas en el texto
  (declarado en el subtítulo y la leyenda del gráfico), no la red WebGL original del paper.
- La posición exacta de nodos en la red varía levemente entre cargas (simulación con semilla
  fija pero layout dependiente del viewport).
