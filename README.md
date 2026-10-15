# RubenceChef 🍽️
### Hotel Kitchen Pro

App de cocina profesional de hotel: platos, producciones, utilidades (pesos, conversiones, pedidos), temporizadores, radio y resumen del día.

## Estructura
```
index.html                      → estructura de la app
manifest.json                   → datos para instalarla como app (icono, colores)
css/styles.css                  → estilos
js/app.js                       → lógica principal y datos (Supabase)
js/timer.js                     → temporizadores y alarmas
js/radio.js                     → radio en directo
js/midi.js                      → lector de melodías MIDI para los timers
herramientas/recortar-midi.html → herramienta aparte para recortar melodías
sql/                            → scripts de Supabase (seguridad, tablas nuevas y sus "deshacer")
icon*.png                       → iconos de la app
CHANGELOG.md                    → historial de versiones
```

## Versiones
Cada versión cambia a la vez `APP_VERSION` en `js/app.js` y el `?v=` de los
`<script>`/`<link>` de `index.html`. Hay que subir siempre los dos juntos.

## Tecnologías
- HTML + CSS + JavaScript puro (sin compilación)
- Base de datos, fotos, acceso y avisos en tiempo real: Supabase
- Tiempo de Madrid: Open-Meteo (sin clave)
- Alojamiento: GitHub Pages
