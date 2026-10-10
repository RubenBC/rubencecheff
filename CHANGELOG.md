# Changelog — RubenceChef (Hotel Kitchen Pro)

Todas las versiones notables de la app, de más reciente a más antigua.

---

## v99 — Auditoría completa

Revisión de toda la app tras los cambios recientes (etiquetas, retirada de Navidad/Halloween, menú siempre visible, botón de actualizar). Sin cambios de diseño; solo dos fallos reales encontrados y corregidos.

### Corregido
- **Las etiquetas de un plato no se veían en ningún sitio** salvo volviendo a abrir "Editar": ya se ven en la ficha del plato, en su tarjeta de la lista, y el buscador también encuentra por etiqueta (antes solo buscaba por nombre y categoría).
- **El icono resaltado del menú de abajo se quedaba mal** al entrar a un plato o producción desde una pestaña distinta a la suya (por ejemplo, buscando un plato estando en Utilidades o en el Timer): se quedaba marcado el icono de donde venías. Ahora siempre marca el que corresponde a lo que se está viendo. Este fallo venía de cuando se hizo el menú siempre visible; antes no se notaba porque el menú estaba oculto dentro de un detalle.

### Comprobado, sin cambios necesarios
Sintaxis de los 4 archivos JS, funciones y botones sin referencias rotas, restos de las dos retiradas (Navidad/Halloween y categorías de producción) — ninguno encontrado —, y revisión visual completa de todas las pantallas principales en claro/cocina y oscuro/admin.

---

## v98 — Sistema de etiquetas (sustituye a las categorías de producción)

### Añadido
- **Etiquetas**: las creas tú desde **Admin → Etiquetas** (antes era "Producción"), y tanto un plato como una producción pueden llevar varias a la vez.
- Se asignan desde el propio editor de cada plato o producción, tocando las que quieras (como la selección de alérgenos).
- Aparecen en las tarjetas de las listas, en el detalle, en el buscador y en la exportación a PDF.
- **Filtro por etiqueta** en las listas de Platos y Producción: tócala para ver solo lo que la lleva, tócala otra vez para quitar el filtro.
- Borrar una etiqueta avisa de a cuántos platos y producciones afecta, y se la quita a todos a la vez.

### Quitado
- **Las categorías de producción han desaparecido**: ya no hay un único valor por producción, sino varias etiquetas. Los platos mantienen su categoría de siempre (Carnes, Ensaladas...), sin cambios ahí.

### Nota sobre la base de datos
Al ejecutar `etiquetas.sql`, tus categorías de producción actuales se convierten automáticamente en etiquetas con el mismo nombre, y cada producción que tuviera puesta una categoría se queda con esa etiqueta ya asignada — no se pierde la organización que ya tenías. La tabla antigua de categorías se deja tal cual, sin usar.

---

## v97 — Quitados los modos Navidad y Halloween

### Quitado
- **Los modos Navidad y Halloween, por completo**: los dos interruptores de Admin, la nevada, los murciélagos, los fantasmas, las telarañas, las calabazas, el gorro navideño, los copos de nieve, la ilustración de la cabecera y el cambio de color de la barra de arriba. También las dos columnas de `app_settings` que ya no se usan (`christmas_mode` y `halloween_mode`): puedes borrarlas a mano desde Supabase si quieres, pero no hace falta, no molestan si se quedan ahí sin usarse.
- La **biblioteca de melodías del timer y la alarma se queda exactamente igual que estaba**: no dependía de estos modos (lo separamos en una versión anterior) y no se ha tocado nada de eso.

---

## v96 — Modo Halloween a fondo

### Cambiado
- **Colores de verdad.** El degradado de la cabecera era un pastel muy discreto (casi no se notaba); ahora son naranjas cálidos, cohesionados entre sí, tanto en claro como en oscuro.
- **La cabecera crece un poco** para dejar sitio a una escena nueva en su borde de abajo: luna, un árbol pelado, un par de murciélagos y **tres calabazas** con cara, en vez de la única calabaza suelta de antes.
- **Murciélagos más grandes y más numerosos** (el doble, aproximadamente), volando por toda la pantalla.
- **Dos telarañas más**, en las esquinas de abajo, además de las dos que ya había arriba.

### Añadido
- **Fantasmas sueltos**: aparecen de cuando en cuando en un sitio al azar de la pantalla, flotan un momento y se desvanecen solos, en vez de estar siempre ahí.

---

## v95

### Cambiado
- **El menú de abajo (Platos, Producción, Utilidades, Timer, Radio) ya no se oculta al abrir un plato o una producción.** Se queda visible también dentro del detalle, para poder saltar directamente a otra pestaña sin tener que pulsar antes "Volver". El icono resaltado sigue mostrando la sección en la que estás (Platos o Producción), y "Volver" sigue funcionando igual para ir a la lista general. El editor (al pulsar "Editar") sigue ocultándolo, para evitar perder cambios sin guardar sin querer.

### Corregido
- De paso, un fallo que había quedado de la versión anterior: al volver a un plato o producción tras pasar por otra pestaña, el icono resaltado del menú se quedaba en el de esa otra pestaña en vez de pasar al que corresponde. No se notaba porque el menú estaba oculto en el detalle; ahora que se ve, ya marca el icono correcto.

---

## v94

### Añadido
- **Botón "Actualizar"** en la cabecera (icono ↻): recarga la app forzando que se descargue todo de nuevo, sin tener que cerrarla.
- **Aviso automático de versión nueva**: la app comprueba cada 20 minutos, y también cada vez que vuelves a ella, si hay una versión distinta publicada. Si la hay, aparece un mensaje con su propio botón para actualizar, sin que haga falta acordarse de nada.

### Corregido
- **Si tenías abierto un plato o una producción y cambiabas a Radio** (por ejemplo para cambiar de emisora o el volumen), al volver a Platos o Producción la app mostraba la lista general en vez de seguir en el mismo sitio. Ahora el detalle se queda ahí, pase lo que pase por Radio, Timer o cualquier otra pestaña de por medio; solo se olvida al pulsar "Volver" (eso sí cuenta como pedir la vista general).
- De paso, encontrado al añadir el botón de actualizar: en un móvil estrecho, con avisos de comentarios pendientes y de próximos eventos a la vez, el botón Admin de la cabecera podía quedar parcialmente fuera de la pantalla. Ahora esos botones pasan a una segunda línea si hace falta, en vez de salirse.

---

## v93

### Cambiado
- **La hora de la alarma ya siempre se ve en formato 24 horas**, sin depender de si el teléfono está puesto en AM/PM. Antes se usaba el selector de hora del propio sistema, que sigue el idioma/región del teléfono y no se puede controlar desde la web; ahora es un selector propio (horas y minutos), con una etiqueta "24 h" para que quede claro. Se escribe igual: dos cifras de hora y salta solo a los minutos.

---

## v92 — Revisión de usabilidad (continuación)

### Corregido
- El cuadro de **"Importar eventos" (CSV) seguía mencionando a Gemini** por su nombre, de cuando había un robot automático que ya quitaste. Ahora el texto no asume ninguna herramienta en concreto: solo explica el formato (fecha;hora;titulo;categoria;nota), venga de donde venga.
- En **Pesos de ración y Salmueras**, el botón para avisar de un error se leía solo "Error", como si algo estuviera roto en ese momento, en vez de invitar a avisar de algo. Ahora dice "Avisar".

---

## v91 — Revisión de usabilidad

### Corregido
- **El desplegable de melodía del timer cortaba el texto** en móviles estrechos (se veía "Tono clási" en vez de "Tono clásico"). Ahora aprovecha todo el espacio libre de esa fila y, si el nombre es muy largo, corta con "…" en vez de a lo bruto.
- **El interruptor "Modo Navidad" seguía diciendo "y timer con villancico"**, un texto que quedó desfasado al separar la melodía de los modos festivos en la versión anterior.
- **La fila de pestañas de Admin no avisaba de que se podía deslizar.** Con 6 pestañas ya no caben todas en un móvil estrecho (la de Melodía quedaba fuera de la vista, sin pista de que existía). Ahora el borde derecho se difumina para indicar que hay más hacia ese lado.

---

## v90 — Biblioteca de melodías

### Cambiado
- **Se acabó la melodía atada al Modo Navidad y al Modo Halloween.** Ahora, en el propio panel del timer/alarma, arriba a la derecha, hay un desplegable para elegir qué melodía suena. De serie hay 3: Tono clásico, Villancico (Jingle Bells) y Dies Irae, disponibles todo el año, sin depender de ningún modo.
- **Admin → Melodía es ahora una biblioteca**, no una sola melodía: se pueden subir varias (archivos MIDI ya recortados, igual que antes), cada una con su nombre. Se marca con ⭐ cuál es la predeterminada; los timers nuevos empiezan con esa, pero se puede elegir otra distinta cada vez. Se puede escuchar cada una y borrar las que ya no se quieran.
- Si dos timers con melodías distintas suenan a la vez, manda el más antiguo; al pararlo, pasa a sonar el del siguiente con su propia melodía (no se mezclan dos sonando a la vez).
- Si ya tenías guardada la melodía de Halloween de antes, **se traslada sola** a la lista nueva la primera vez que se ejecuta el SQL, quedando como predeterminada; no hace falta volver a subirla.

### Corregido (encontrado al construir esto)
- Al arrancar la app, si `js/timer.js` tardaba un pelín más en cargar que `js/app.js`, el desplegable de melodías podía quedarse vacío para siempre. Ahora arranca ya con las 3 de serie, y si la app tarda en avisar de cuál es la predeterminada, se reintenta solo.

---

## v89 — Auditoría tras la pantalla de acceso

### Corregido
- Si se perdía la sesión estando en el detalle de un plato o producción y habías bajado la página, la flecha "Volver" flotante se quedaba flotando por encima de la pantalla de acceso. Ahora se oculta al perder la sesión y reaparece sola si sigues bajado en ese mismo sitio al volver a entrar.

### Comprobado sin fallos
- Los 4 scripts de seguridad (`cerrar-escritura`, `cerrar-fotos`, `seguridad`, `melodia-timer`), aplicados en el orden real, dos veces cada uno: 65 comprobaciones sobre quién puede leer y escribir cada cosa.
- La pantalla de acceso junto con el modo Navidad, el modo Halloween, la radio, el timer y la flecha flotante a la vez, incluida la pérdida de sesión en mitad de cada uno.
- Que una sesión de cocina (no admin) no pueda entrar en Admin por ningún camino, ni ver los botones de añadir/editar.
- Las 20 pantallas de la app, en claro y oscuro, con sesión de cocina y de admin: sin desbordes ni errores.
- El lector de MIDI incrustado en la herramienta aparte `recortar-midi.html` sigue siendo idéntico al de la app.

---

## v88

### Corregido
- **La melodía MIDI del timer podía quedarse en silencio total** en un timer con una duración normal (probado con uno de 20 segundos), aunque "Escuchar la guardada" en Admin sonara bien. La causa: se preparaba con el mismo sistema "por adelantado" que usan las melodías fijas (pensado para sonar exactamente a la hora, incluso con la pestaña dormida), pero ese sistema depende de tener el archivo listo con minutos de margen. Para un archivo que puede cambiar en cualquier momento, eso podía dejarla sin programar a tiempo. Ahora la melodía MIDI se toca en el momento, con el mismo método que ya usa "Escuchar" (probado y fiable), en vez de prepararse por adelantado. Las demás melodías (tono normal, Jingle Bells, Dies Irae) no cambian: siguen sonando exactas incluso con la pantalla apagada.

---

## v87

### Corregido
- **La melodía de Halloween no llegaba a los dispositivos que ya estaban abiertos.** Si se guardaba o cambiaba desde otro móvil, un monitor que llevaba un rato abierto seguía sonando con la melodía anterior hasta que alguien recargaba la página. El aviso de "Modo Halloween activado o no" sí se actualizaba solo, pero la melodía en sí no. Ahora se comprueba junto con lo demás, sin recargar nada.

---

## v86

### Cambiado
- **La melodía de Halloween se prepara fuera de la app.** El recorte ya no se hace dentro de la app de cocina: se usa la herramienta aparte `recortar-midi.html` (no forma parte de la app, no usa internet y no lleva ninguna canción), que descarga el trozo como un `.mid` nuevo. En Admin → Melodía solo se sube ese archivo ya recortado, se escucha y se guarda. La app queda más sencilla: sin lista de pistas ni deslizadores.
- Si el archivo dura más de 20 segundos o solo tiene percusión, se rechaza con un aviso claro que remite a la herramienta.

### Añadido
- **Melodía propia para el timer en Halloween a partir de un MIDI del admin** (nueva pestaña **Melodía** en Admin). Con el Modo Halloween activado, el timer suena con ese trozo; si no hay nada guardado o no se puede cargar, suena el Dies Irae de siempre. Con el Modo Navidad a la vez sigue mandando Jingle Bells.
- El archivo se guarda en un almacén **privado** de Supabase (`timer-sounds`, sin enlace público: solo lo lee quien haya iniciado sesión y solo lo cambia el admin). Se crea con `sql/melodia-timer.sql`.
- Lector de archivos MIDI propio (`js/midi.js`), sin librerías externas. Suena con el mismo sintetizador sencillo de las otras melodías: sin instrumentos reales ni batería; los graves se suben de octava para que se oigan en el móvil, y se limita a 6 notas a la vez y 200 por vuelta.

---

## v84

### Añadido
- **Pantalla de acceso para el equipo de cocina.** Al abrir la app sin sesión se pide una contraseña común y no se carga ningún dato hasta entrar. La sesión queda guardada en ese dispositivo, así que en el monitor fijo se escribe una sola vez. Cuenta compartida: `cocina@rubencechef.app` (se crea en Supabase → Authentication → Users).
- **El admin puede entrar de dos formas**: con el botón Admin de arriba (como siempre) o escribiendo su contraseña directamente en la pantalla de acceso. Al cerrar la sesión de admin la app vuelve sola a la sesión de cocina, sin pedir la contraseña otra vez.
- Si la sesión se pierde mientras se usa la app (contraseña cambiada, cuenta borrada, sesión revocada), vuelve a aparecer la pantalla de acceso y no se queda ningún dato a la vista detrás.
- **"Avisos vistos" con una función de la base de datos** (`mark_events_seen`): el personal ya no necesita permiso para editar la tabla de avisos. Si la función aún no existe, se usa el método anterior, así no se rompe durante la transición.
- Carpeta `sql/` con los scripts de seguridad y sus salvavidas.

### Corregido
- Una sesión iniciada ya no se toma automáticamente por administrador: ahora solo lo es la de la cuenta de admin.
- El refresco en segundo plano ya no borra los datos de pantalla si la base de datos deniega los permisos (devuelve listas vacías sin error), y pide la contraseña si no hay sesión.
- Un error de permisos con la sesión de cocina avisa, pero ya no cierra su sesión.

---

## v82

### Cambiado
- **Los modos Navidad y Halloween se notan mucho más:**
  - **Franja de color en la cabecera**: se ve nada más abrir la app, sin tocar los colores de los botones ni del resto de la interfaz (helado-verdoso en Navidad, naranja-lila en Halloween; con los dos modos a la vez, una mezcla de ambos). Se adapta también al modo oscuro.
  - **Iconos de cabecera más grandes** (el gorro y la calabaza crecen) **y ahora hay varios**, no uno solo: en Navidad, un par de copos de nieve sueltos junto al gorro; en Halloween, un par de murciélagos sueltos junto a la calabaza.
  - **El título de la pestaña del navegador** lleva ahora 🎄 y/o 🎃 delante de "RubenceChef" mientras esos modos estén activos, así se nota el modo aunque tengas otra pestaña delante. Sigue combinándose bien con el aviso "⏰ ¡Tiempo!" cuando suena un timer.

---

## v81

### Añadido
- **Melodía de Halloween para el timer**: con el Modo Halloween activado, suena el inicio del "Dies Irae" (canto gregoriano medieval, de dominio público), la frase que el cine lleva un siglo usando como "la melodía del mal". Es más grave y más lenta que las demás. Si tienes los dos modos activados a la vez, suena la de Navidad.

---

## v80

### Cambiado
- **Más murciélagos** en el Modo Halloween (antes 3-6, ahora 7-14 según el ancho de pantalla), repartidos por más altura y ahora también sobre las recetas, no solo por la zona de arriba.
- **Telarañas de las esquinas mucho más visibles**: más grandes, con trazo más grueso y más oscuras, tanto en claro como en oscuro.

---

## v79

### Añadido
- **Modo Halloween**, con su propio interruptor en Admin junto al de Navidad (🎃 Modo Halloween). Se guarda en Supabase, así que se activa o desactiva en todos los dispositivos a la vez. Se puede tener activado junto al modo Navidad si se quiere. Mientras está activo:
  - Una calabaza junto al nombre RubenceChef, en la cabecera.
  - Telarañas discretas y muy tenues en las dos esquinas superiores, por encima de la barra de arriba.
  - Un par de calaveras pequeñas y apagadas, casi invisibles, en las esquinas inferiores.
  - Unos pocos murciélagos volando despacio de un lado a otro de la pantalla, con las alas aleteando. No se pueden tocar ni molestan al usar la app.

---

## v78

### Cambiado
- **Los copos de nieve ahora tienen forma de copo de verdad** (seis puntas con sus ramitas), en vez de puntos redondos, y giran despacio al caer.

---

## v77

### Corregido
- **La nieve no se movía en algunos PC (p. ej. Edge en Windows)**: si Windows tiene desactivados los efectos de animación, el navegador pide "reducir movimiento" y la nevada se quedaba quieta. Ahora en ese caso sigue cayendo, con menos copos y más despacio.

---

## v76

### Añadido
- **Modo Navidad**, con un interruptor en Admin (debajo de los contadores). Se guarda en Supabase, así que se activa o desactiva en todos los dispositivos a la vez. Mientras está activo:
  - Nevada discreta en pantalla: pocos copos, pequeños y lentos, que no se pueden tocar ni tapan botones. Se para con la app en segundo plano y casi desaparece si el móvil tiene activado "reducir movimiento".
  - El nombre RubenceChef se ve más grande y con un gorro de Papá Noel.
  - El timer suena con el estribillo de "Jingle Bells" (dominio público).

### Corregido
- En móviles estrechos (375 px o menos), con la sesión de admin iniciada y avisos activos, el botón Admin de la cabecera se salía por la derecha. Ahora en pantallas pequeñas se queda solo con el icono.

---

## v75 — Cuarta auditoría

### Corregido
- **Desplazamiento de las páginas**: una regla de estilo hacía que la página se desplazara dentro del `<body>` en vez de en la ventana. Por eso la app no podía controlar la posición: al abrir un plato o una producción desde abajo de la lista, el detalle se abría a media página (o al final) en vez de arriba, y al volver atrás con el botón del móvil perdías el punto de la lista donde estabas. Ahora el detalle siempre se abre arriba y al volver recuperas tu posición en la lista.
- De paso, con el desplazamiento en la ventana el navegador del móvil puede volver a esconder la barra de direcciones al bajar (más espacio útil).

---

## v74

### Añadido
- **Flecha "Volver" siempre a mano** en el detalle de un plato o de una producción: al bajar por la página, cuando la flecha de arriba deja de verse, aparece una pequeña flecha redonda bajo la barra superior que hace lo mismo. Al volver arriba desaparece. El resto de la página no cambia.

---

## v73

### Añadido
- **Control de volumen propio de la radio**, en la pestaña Radio, debajo de los botones. Sube o baja solo el sonido de la radio dentro de la app: no toca el volumen general del móvil ni el de otras aplicaciones (técnicamente no podría aunque quisiera; el navegador solo deja controlar el volumen de su propio sonido, nunca el del sistema). El icono cambia según el nivel y se puede tocar para silenciar y volver a poner el volumen de antes. Se recuerda entre sesiones.

---

## v72

### Cambiado
- **El Timer se comporta como una pestaña más**: su panel se abre por encima de la página pero ya no tapa el menú inferior, que sigue visible y se puede tocar. El icono Timer queda marcado mientras está abierto. Tocar otra pestaña cierra el panel y te lleva a ella (salvo si está sonando: entonces sigue a la vista hasta pulsar Detener). El botón atrás lo cierra como antes.

---

## v71

### Añadido
- **Recetario completo en PDF** (Admin → Fotos → "Recetario en PDF"): portada, índice con número de página y cada plato y producción en su propia página con foto, categoría, raciones, alérgenos, ingredientes con cantidades, producciones vinculadas, elaboración y montaje. Las fotos se reducen al vuelo para que el archivo no pese demasiado. Al terminar, el botón "Guardar / compartir" lo descarga o lo manda por WhatsApp, correo, Drive…

### Mejorado
- Orden natural en las listas: "Plato 2" va antes que "Plato 10" (antes salía detrás).

---

## v70

### Cambiado
- **La Radio es una pestaña más**, como Platos o Producción: al tocarla ya no sube una ventana, sino que se abre como las demás, con el menú inferior siempre visible para cambiar rápido de pestaña. Arriba el reproductor (vinilo, emisora y controles) y debajo la lista, que se desplaza como cualquier página.
- **Burbuja**: si sales de la pestaña Radio mientras suena, la burbuja aparece en las demás pestañas con sus controles; al tocarla vuelves a la Radio. En la propia pestaña Radio no aparece.
- El botón atrás funciona con la Radio igual que con el resto de pestañas.

---

## v69 — Tercera auditoría

### Corregido
- **Pedidos**: un artículo con apóstrofo en el nombre ("Aceite d'oliva") no se podía marcar, renombrar, mover de grupo ni borrar (el botón no hacía nada).
- **Recetas y producciones** guardaban las filas vacías del editor (ingrediente sin nombre, paso sin texto), que luego salían como huecos. Ahora se descartan al guardar.
- **Diálogos de confirmación**: un nombre con "<" o "&" (p. ej. "M&M") se mostraba roto. Ahora se muestra tal cual.
- **Pesos y salmueras**: lo que añadías se quedaba al final de la lista; ahora se mantienen en orden alfabético.
- **Días de antelación** (Avisos): se podía escribir 50 y se guardaba 30 sin que se viera; ahora la casilla muestra el valor real y confirma el guardado.
- **Modo oscuro**: al abrir la app se veía un destello blanco antes de ponerse oscura.

### Mejorado
- **Importar CSV**: acepta campos entre comillas, fechas DD/MM/AAAA y categorías escritas de otra forma ("Fútbol", "CONCIERTO", "partido"); descarta y avisa de las filas con fecha ya pasada.
- **Pedidos**: añadir un artículo que ya está en la lista avisa en vez de duplicarlo en silencio.
- **Botones de editar/borrar más grandes** (de ~26 a 38 px) y más separados, para tocarlos bien con las manos mojadas o con guantes.

---

## v68 — Segunda auditoría

### Corregido
- **Renombrar una categoría de producción** solo cambiaba el nombre en pantalla: las producciones seguían guardadas con el nombre antiguo y al recargar quedaban en una categoría que ya no existía. Ahora se guarda también en ellas.
- **Borrar una producción** dejaba sus vínculos con platos: la tarjeta del plato seguía diciendo "1 producción" y al volver a vincular fallaba el guardado. Ahora se borran también los vínculos (y lo mismo al borrar un plato).
- **Borrar una categoría** que usan producciones ahora avisa de cuántas se quedarán sin categoría.
- **Avisos (Admin)**: "hoy" se calculaba en hora UTC; entre las 00:00 y las 02:00 aparecían como activos los eventos del día anterior.
- **Modo oscuro**: los números rojos (comentarios, pestañas) tenían texto blanco sobre rosa claro y casi no se leían.
- **Conversión**: el cuarto tipo de conversión quedaba cortado a la derecha en móviles estrechos; ahora los tipos bajan de línea.
- El cierre automático de un comentario enviado podía cerrar otro comentario abierto justo después.

### Mejorado
- **Cantidades con coma decimal** ("1,8 kg" en vez de "1.8 kg"), como se escriben en España.
- **Platos sin foto**: en la lista el hueco vacío pasa de 200 a 96 px (caben más platos en pantalla) y en el detalle ya no se muestra.
- **Ventana de eventos** sin eventos: muestra "No hay días con más trabajo previstos" en vez de quedarse en blanco.
- **Comentario vacío**: avisa en vez de no hacer nada.
- **El número rojo de comentarios de arriba** solo lo ve el admin (al resto no le servía de nada).
- **Pedidos**: el botón "Enviar pedido" se ve apagado mientras no hay nada marcado.

---

## v67

### Añadido
- **Probar una emisora antes de guardarla**, en Admin → Radio: botón "Probar" debajo del enlace que la reproduce ahí mismo, con su propio reproductor (no interfiere si ya está sonando la radio real, ni si está abierta). Dice "Suena aquí ✓" o "No se pudo reproducir aquí" en unos segundos, antes de que la des de alta. Si el enlace es http://, la prueba usa la versión https:// (la que se guardaría). Si pones un enlace .pls/.m3u avisa de que es una lista, no un flujo directo.

---

## v66 (revisión)

### Añadido
- La pantalla de error de carga ahora dice si es un fallo de conexión o de la propia app, y muestra el detalle del error.
- Aviso si `index.html` y `js/app.js` son de versiones distintas (p. ej. se subió uno a GitHub y el otro no): con esa mezcla la app mostraba "Error al conectar con la base de datos" aunque la base de datos estuviera bien.

---

## v66

### Cambiado
- **Panel de administración propio**: el botón "Admin" de arriba ya no cierra la sesión. Sin sesión pide la contraseña y, al entrar, abre el panel; con sesión lo abre directamente (el botón se ve resaltado).
- **Organizado por pestañas**: Comentarios · Avisos · Producción · Radio · Fotos, cada una con lo suyo en vez de todo mezclado en una página. Las pestañas muestran en rojo lo pendiente (comentarios, avisos por aprobar, fotos sin optimizar). Los contadores de recetas, producciones y pendientes quedan arriba, visibles en todas.
- **Botón "Cerrar sesión" dentro del panel** (pide confirmación y vuelve a Platos).
- Utilidades pierde la pestaña Admin (Pesos · Conversión · Pedidos). El globo rojo de comentarios pendientes pasa al número rojo de arriba, que al tocarlo abre el panel en Comentarios.
- Si la sesión caduca, se vuelve a pedir la contraseña sin sacarte de lo que estabas haciendo.

---

## v65

### Cambiado
- **Radio: solo las emisoras españolas de serie** (LOS40, LOS40 Classic, LOS40 Urban, LOS40 Dance, KISS FM, Cadena Dial, Cadena 100, Rock FM, Radiolé). Se quitan las de Radio France y Radio Paradise.
- **Sin etiquetas de estilo** arriba de la lista: quedan las secciones Favoritas, España y Otras emisoras.

### Añadido
- **Al añadir o editar una emisora en Admin se puede poner su estilo y un comentario breve**, que se ven debajo del nombre como en las españolas ("Jazz · Jazz clásico y swing"). Necesita las columnas `style` y `comment` en la tabla `radio_stations`; sin ellas la emisora se guarda igual, sin esos datos, y Admin avisa.

---

## v64

### Cambiado
- **Emisoras de SomaFM quitadas**: SomaFM bloquea la reproducción dentro de otras webs (por eso sonaban al pegar el enlace en el navegador pero no en la app).
- **Nuevas emisoras que sí permiten escucharse desde otras apps**, agrupadas por estilo:
  - Radio France (radio pública francesa, sin anuncios): FIP, FIP Nouveautés, FIP Pop, FIP Sacré français, FIP Rock, FIP Metal, FIP Electro, FIP Hip-Hop, FIP Groove, FIP Jazz, FIP Monde, FIP Reggae, France Musique Piano Zen, La Baroque y Classique Love.
  - Radio Paradise (sin anuncios): Main Mix, Rock y Mellow.
- Estilos: España, Variada, Pop, Rock / Metal, Electrónica / Hip-hop, Soul / Funk, Jazz, Mundo / Reggae, Tranquila y Clásica.
- Si tenías marcadas como favoritas emisoras de SomaFM, desaparecen de Favoritas.

---

## v63

### Cambiado
- **Radio renovada**: la ventana ocupa el 95 % de la pantalla. Arriba, el reproductor en una tarjeta (vinilo, emisora con su descripción y "En directo", y los controles), con el texto bien separado de los botones. Debajo, la lista de emisoras.
- **Nuevas emisoras de serie (37)**: las 9 españolas (LOS40, LOS40 Classic, LOS40 Urban, LOS40 Dance, KISS FM, Cadena Dial, Cadena 100, Rock FM, Radiolé) y 28 canales de SomaFM agrupados por estilo. Se quitan las anteriores. Cadena 100 y Rock FM venían con http:// y van con https:// (http no suena en la app).
- **Filtros por estilo** (chips deslizables: Todas, Favoritas, España, Ambient, House / Dance, Rock / Metal…) y la lista separada en secciones con su número de emisoras.
- **Controles nuevos**: botón grande de reproducir/pausa y dos botones redondos a los lados (favorita y parar), a juego con la app.
- La emisora que suena se marca con unas barras de ecualizador animadas.
- En horizontal ancho (monitor, tablet), reproductor a la izquierda y lista a la derecha; en móviles bajos, el vinilo se reduce para dejar sitio a la lista.

### Añadido
- **Favoritas**: estrella en cada emisora (y en el reproductor para la que suena). Las favoritas se marcan con estrella amarilla y salen al principio de la lista. Se guardan en este dispositivo.
- En Admin, las emisoras de serie muestran su estilo.

---

## v62

### Añadido
- **Fotos de platos reducidas en el móvil antes de subirlas**: una foto de cámara de 4-8 MB se queda en unos 400 KB (1600 px, JPEG), respetando la orientación de la cámara. Si no se puede reducir, se sube la original para no bloquear.
- **Miniaturas para la lista de platos** (~480 px, unos 15-50 KB): las tarjetas cargan mucho más rápido. Necesita la columna `photo_thumb` en la tabla `recipes`; sin ella la app funciona igual, solo que sin miniaturas.
- **Admin → "Optimizar fotos"**: reduce de una vez las fotos subidas antes de esta versión, crea sus miniaturas y borra las originales pesadas.
- **Limpieza de fotos**: al cambiar la foto de un plato, al borrarlo o al salir del editor sin guardar, se borran del almacenamiento las fotos que ya no usa ninguna receta (nunca una que siga en uso).
- **La radio se pausa sola cuando suena un timer o alarma** ("En pausa · está sonando una alarma") y se reanuda al pulsar Detener, volviendo al directo. Si la radio ya estaba en pausa o parada, no se toca.

---

## v61 — Auditoría

### Corregido
- **Botón atrás**: con la Radio abierta la escondía sin dejar la burbuja (seguía sonando sin controles); ahora la minimiza a burbuja. Con el timer sonando lo cerraba sin pulsar Detener; ahora no se puede. Tras cerrar ventanas con la X o ver una foto ampliada hacía falta pulsar atrás varias veces; ahora basta una. La foto ampliada se cerraba mal con atrás.
- **Pedidos**: si fallaba el guardado (sin cobertura), el código daba error, no avisaba y el artículo se quedaba marcado como si se hubiera guardado. Ahora avisa y deshace el cambio. "Reiniciar lista" comprueba que de verdad se guardó.
- **Sin conexión al abrir la app** se veía "Aún no hay platos creados", como si se hubiera borrado todo. Ahora sale el aviso de error con botón Reintentar.
- **Foto de receta**: si la subida fallaba, decía "Foto subida ✓" y guardaba un enlace roto.
- **Vincular producciones / platos**: los errores se ignoraban y parecía guardado. Ahora se comprueba, y el orden de guardado ya no puede borrar vínculos existentes si algo falla a mitad.
- **Radio**: "En pausa" falso al cambiar de emisora; arrastrar la burbuja agarrándola por un botón pausaba o paraba la radio; tras una pausa larga sonaba audio atrasado (ahora reconecta al directo); la burbuja podía saltar mientras se arrastraba; la burbuja tapaba los diálogos (confirmar, pesos…). Nombres de emisora escapados. Enlaces http:// de emisoras nuevas se pasan a https:// solos, y se rechazan las listas .pls/.m3u.
- **Timer**: un timer guardado con el antiguo "Tono 2" no sonaba (error en la melodía).
- **Globo rojo de comentarios** aparecía debajo de "Utilidades" en vez de en la esquina del icono.
- **Duplicados de conciertos**: el robot diario de GitHub no reconocía el cambio WiZink → Movistar Arena, no quitaba repetidos dentro de la misma respuesta, y una hora "null" o "21:00h" hacía fallar el guardado de todos los eventos del día. Sus instrucciones ahora usan "Movistar Arena". La importación de CSV también valida la hora y ya no distingue la categoría al buscar duplicados.
- **Buscador**: ahora encuentra sin tildes ("cesar" → "César") y escapa el texto escrito.
- Texto de platos, producciones, pesos y salmueras escapado en editores y listas (un "<" en una descripción podía romper el editor).

### Añadido
- **Refresco de datos en segundo plano** cada 15 min y al volver a la app: sustituye a la recarga automática que se quitó en v56 (desde entonces los datos, p. ej. los pedidos compartidos, no se actualizaban nunca). No recarga la página, así que no corta la radio ni los timers, y no actúa si estás editando o escribiendo.
- Iconos de la app que faltaban (`icon.png`, `icon-192.png`); `icon-maskable.png` reducido de 1 MB a 180 KB.

### Otros
- La carga inicial pide las tablas opcionales a la vez en vez de una tras otra (la primera pantalla aparece antes).
- README sin la contraseña de admin que estaba publicada.

---

## v60

### Corregido
- **El detector de duplicados de partidos y conciertos ya reconoce los recintos que han cambiado de nombre por patrocinio.** Antes, "Leiva en WiZink" y "Leiva en Movistar Arena" se colaban como dos avisos distintos porque el nombre del recinto va dentro del propio título. Ahora, antes de comparar, sustituye los nombres antiguos (WiZink Center, Barclaycard Center, Palacio de los Deportes) por el actual (Movistar Arena), así que un CSV nuevo con el nombre antiguo ya no duplica un aviso que use el nuevo, y viceversa. Si algún otro recinto cambia de nombre en el futuro, se añade a esa misma lista.

---

## v59

### Corregido
- **La burbuja ya no puede quedar fuera de la pantalla** (y por tanto "desaparecer"). Pasaba sobre todo al girar el móvil o cambiar de tamaño de pantalla: la posición guardada podía quedar fuera del nuevo tamaño. Ahora se reajusta sola siempre que haga falta, y si guardaba una posición corrupta, ya no rompe nada.

### Cambiado
- **Burbuja más grande** y con más espacio entre el vinilo, el nombre y los botones, para que no se vea tan apretada.

---

## v58

### Cambiado
- **Emisoras renovadas**: se sustituyeron las 9 emisoras de serie por LOS40, LOS40 Classic, LOS40 Dance, Europa FM, Cadena Dial, Cadena 100, Rock FM, Radiolé y Radio 3, cada una con su descripción (acortada cuando era muy larga). De los enlaces que llegaban por `http://`, se pasó a `https://` en Cadena Dial, Cadena 100, Rock FM y LOS40 Dance: es el mismo servidor y la misma emisora, pero `http://` no suena en una app servida por `https://` como esta (GitHub Pages).
- La ventana de Radio pasa del 60 % al **80 % de la pantalla**.

### Añadido
- **Controles de reproducción bajo el vinilo**: botón de pausa/reproducir y de parar. Pausar detiene el sonido sin desconectar de la emisora (reanuda al momento); Parar corta la conexión del todo.
- **Burbuja más completa**: ahora muestra el nombre de la emisora y tiene sus propios botones de pausa/reproducir y parar, sin dejar de ser pequeña.

---

## v57

### Cambiado
- La ventana de Radio ya no pasa del **60 % de la pantalla** (antes llegaba a más).
- **Se adapta a monitor apaisado o móvil vertical**: en horizontal ancho (monitor, tablet apaisado) el vinilo y la lista de emisoras se ponen en columnas, uno al lado del otro; en vertical (móvil) siguen apilados como antes.
- **Aguja del vinilo corregida**: ahora sí baja y se apoya sobre el disco al reproducir, y se levanta y se aparta claramente cuando no suena nada.

---

## v56

### Añadido
- **Reproductor de radio con vinilo**: la Radio ahora se abre como ventana emergente (como el Timer) con un vinilo que gira y una aguja que baja al reproducir. Se muestra el nombre de la emisora y "En directo" (el nombre de canción/grupo no lo dan casi ninguna emisora al navegador, así que de momento no se intenta).
- **Minimizar a burbuja**: botón para minimizar la ventana a una burbuja con el vinilo en miniatura, que se puede arrastrar por toda la pantalla y se ve en cualquier pestaña de la app mientras suena. Un toque la vuelve a abrir; la X de la burbuja para la radio. Al cambiar de pestaña (Platos, Producción, Utilidades, Timer) la ventana se minimiza sola para dejar ver la burbuja.
- **Admin puede borrar también las emisoras de serie** (las que puse yo), no solo las suyas. Quedan ocultas pero se pueden volver a añadir a mano si se cambia de opinión. Nueva tabla en Supabase: `radio_hidden_builtin`.

### Quitado
- **Recarga automática cada 15 min**: cortaba la radio en marcha, así que se ha eliminado. Los datos se refrescan al reabrir la app.

---

## v55

### Añadido
- **LOS40 Urban** en la lista de emisoras de Radio.
- **Admin ahora puede añadir sus propias emisoras**: en Utilidades → Admin, nueva sección "Emisoras de radio" con nombre + enlace directo (.mp3, .aac o .m3u8 — el tipo se detecta solo). Se pueden editar y eliminar. Se guardan en Supabase (tabla `radio_stations`, nueva) y aparecen en la pestaña Radio junto a las de serie.

---

## v54

### Añadido
- **Nueva pestaña "Radio"** en el menú inferior, a la derecha de Timer. Lista de 10 emisoras españolas populares (Cadena SER, LOS40, COPE, Onda Cero, RNE, Cadena Dial, Kiss FM, Cadena 100, Rock FM, Radio Marca) con reproducción por streaming: toca una para escucharla, tócala de nuevo para pararla. Solo suena una a la vez, con una barra inferior para pararla desde cualquier pestaña. Si una emisora no conecta, lo avisa y deja reintentar o elegir otra sin romper nada.
- Las URLs de las emisoras son las oficiales de cada cadena, tomadas de un directorio de streaming español de código abierto mantenido activamente (TDTChannels). Algunas emiten en formato HLS (Onda Cero, RNE, Cadena 100, Rock FM) y para esas se usa la librería hls.js desde cdnjs.

---

## v53

### Cambiado
- **El atajo de 7 min ahora es específico de patatas**: el botón "PATATAS · 7 min" sustituye al de 7 genérico. Al pulsarlo arranca un timer de 7 minutos con el nombre "Patatas", así que al terminar el tiempo sale PATATAS en grande. Los atajos 5, 9 y 12 y el tiempo manual siguen igual (cualquier otro tiempo de 7 min se puede poner a mano con el nombre que quieras).

---

## v52

### Cambiado
- **Fuera el botón "Tono"**: de momento solo hay un tono (los 4 tonos con pausa de 3 s).
- **Al terminar el tiempo, el nombre es el protagonista**: ocupa todo el panel en letra enorme (se ajusta solo a su largo) y "¡Tiempo!" queda pequeño arriba. Si el timer no tiene nombre, se ve "¡TIEMPO!" grande como antes.
- **Los nombres siempre se muestran en MAYÚSCULAS**, aunque los escribas en minúscula (casilla, filas, pantalla al sonar, pestaña y aviso del Reloj).

---

## v51

### Cambiado
- El panel del timer ocupa ahora el **50 %** de la pantalla.
- **El nombre del timer se ve mucho más grande**: centrado sobre el tiempo cuando hay uno solo, más grande en cada fila cuando hay varios, y enorme cuando suena.

---

## v50

### Añadido
- **Elegir tono al crear un timer o alarma**: botón discreto "♪ Tono 1 / Tono 2" junto al nombre. Al cambiarlo se oye una muestra. Cada timer recuerda su tono, y el último elegido se guarda para los siguientes. Tono 1 es el original (4 tonos + pausa de 3 s). Tono 2 es provisional.

---

## v49

### Cambiado
- **Melodía del timer**: ahora suenan 4 tonos seguidos y después una pausa de 3 segundos antes de repetir, hasta pulsar Detener.

---

## v48

### Cambiado
- El panel del timer ocupa ahora el **42 %** de la pantalla y el tiempo se ve mucho más grande (con un solo timer en marcha, el tiempo ocupa todo el ancho y los botones Pausar / Cancelar quedan debajo).
- **Aviso en los últimos 10 segundos**: la ventana parpadea en rojo hasta que termina el tiempo; al sonar queda en rojo fijo, como antes.

---

## v47

### Corregido
- **Ahora puedes tener varios timers y alarmas a la vez** (antes, al poner una alarma no podías poner un timer, y viceversa). Nueva pestaña **"Activos"** en el panel con todos los que están en marcha, cada uno con su tiempo, su barra, y sus botones Pausar / Cancelar. Para añadir otro, vuelve a la pestaña Timer o Alarma.
- Cuando suenan a la vez, se muestra uno cada vez ("+1 más") y la melodía sigue hasta detener todos.

---

## v46

### Añadido
- **Nombre opcional en el timer y la alarma**: casilla "Nombre (opcional)" en el panel. Si la rellenas, el nombre sale arriba mientras corre y en grande cuando suena (y en el título de la pestaña y en el aviso del Reloj de Android). Si no escribes nada, funciona igual que antes.

---

## v45

### Cambiado
- **El panel Admin ahora está dentro de Utilidades** (cuarta pestaña junto a Pesos, Conversión y Pedidos) y desaparece del menú inferior, que queda más limpio: Platos · Producción · Utilidades · Timer.
- El globo rojo de comentarios pendientes ahora aparece sobre **Utilidades** y sobre la pestaña Admin.
- Si al recargar la app estabas en el panel Admin, vuelve a él (ahora dentro de Utilidades).

---

## v44

### Mejorado
- **Timer y alarma más puntuales con la pestaña en segundo plano (PC)**: el conteo lo lleva un Web Worker y la melodía se programa por adelantado en el reloj de audio del navegador, así que suena a su hora aunque estés en otra pestaña o ventana. Además, la pestaña muestra "⏰ ¡Tiempo!" en el título mientras suena.

### Añadido
- **Opción "⏰ Reloj" (solo en Android)**: si está activada, al iniciar un timer o alarma se envía también a la app Reloj del móvil para que suene aunque la pantalla esté apagada. Si está activada no se puede pausar (el del Reloj seguiría corriendo), y al cancelar hay que cancelarlo también en el Reloj. En PC el botón no aparece.

---

## v43

### Añadido
- **Timer / Alarma** en el menú inferior (campana, entre Utilidades y Admin). Se abre como panel desde abajo (~30 % de la pantalla):
  - **Timer**: cuenta atrás con atajos de 5 · 7 · 9 · 12 min (un toque y arranca) o tiempo manual (`3,5` = 3 min 30 s, o `1:30`). Con pausa/continuar y cancelar.
  - **Alarma**: a una hora concreta (si ya pasó hoy, suena mañana).
  - Al terminar suena una melodía fuerte en bucle, con vibración, hasta pulsar **Detener** (no se cierra con el botón atrás ni con la X mientras suena).
  - Usa la hora real del móvil, se guarda si recargas la app y mantiene la pantalla encendida mientras corre.
  - El icono muestra un punto naranja si hay algo en marcha y la campana tiembla cuando suena.
  - La recarga automática de 15 min se salta si hay algo sonando o a punto de sonar.

---

## v42

### Añadido
- **Recarga automática cada 15 minutos**, para que una pantalla dejada abierta horas (el monitor del curro, por ejemplo) no se quede con datos desactualizados. No interrumpe si hay una edición sin guardar (se salta ese ciclo).
- **Al recargar, vuelve exactamente a donde estabas**: si estabas viendo la ficha de un plato o de una producción, sigue ahí después de la recarga en vez de saltar a la pantalla principal; el botón atrás se sigue comportando con normalidad.

---

## v41 — Revisión general (2ª pasada)

### Corregido
- **El mismo bug silencioso de v37, pero en "actualizar" en vez de "borrar".** Aprobar, descartar, marcar alto riesgo, resolver comentarios, renombrar categorías de producción y editar pesos/salmueras tenían el mismo fallo: si la sesión de admin había caducado, Supabase bloqueaba el cambio sin dar error, y la app decía "Guardado" aunque no se hubiera guardado nada. Arreglado en los 8 sitios donde se actualiza una fila por su id: ahora se comprueba que de verdad cambió algo, y si no, salta el aviso de sesión caducada en vez de mentir.

### Pendiente (menor, no urgente)
- Dos actualizaciones en bloque (reordenar producciones vinculadas, limpiar la lista de pedidos) se quedan fuera de este arreglo a propósito: ahí "0 filas afectadas" puede ser un resultado normal (lista vacía), no un fallo, así que habría que diseñarlo con más cuidado para no dar falsos avisos.

---

## v40 — Revisión general

### Corregido
- **`manifest.json` bloqueaba la orientación en "portrait".** Esto podía impedir que el modo pantalla ancha (v33-v39) llegara a mostrarse en el monitor táctil del curro si el sistema respeta ese bloqueo al instalar la PWA. Cambiado a `"any"`.
- **CSV import: dedupe también dentro del mismo pegado.** Si el CSV pegado repetía sin querer la misma fila dos veces, antes se colaban ambas (solo se comparaba contra lo ya guardado, no entre las propias líneas del pegado). Ahora también se comparan entre sí.

---

## v39

### Corregido
- **La hora del evento no aparecía en la lista general** (solo se veía en Admin). Ahora sale en ambos sitios, con el mismo formato: "Hoy, viernes 12 sept · 21:00 — Real Madrid - Barcelona".

---

## v38

### Añadido
- **Marcar eventos de "alto riesgo"** (mucho trabajo seguro). Nuevo icono de aviso (⚠️) en cada fila, tanto en Admin como en el modal general de eventos — solo tocable con sesión de admin. Al marcarlo, la fila se resalta en rojo en **toda la app**, incluida la lista que ve el personal sin login, para que salte a la vista de un vistazo.

---

## v37

### Corregido
- **Bug real: "Eliminar" podía no borrar nada, sin avisar.** Si la sesión de admin había caducado, Supabase bloqueaba el borrado por seguridad (RLS) pero no devolvía ningún error — la app decía "Eliminado" y lo quitaba de la pantalla, aunque la fila seguía intacta en la base de datos. Corregido en los 8 sitios donde se borra algo con confirmación (platos, producciones, avisos de eventos, comentarios, categorías de producción, pedidos, pesos y salmueras): ahora se comprueba que de verdad se borró una fila: si no, salta el aviso de "sesión caducada" y se reabre el login, en vez de mentir sobre si funcionó.

---

## v36

### Añadido
- **Días de antelación configurables por el admin.** Nuevo control dentro de Admin → Partidos y conciertos: elige cuántos días hacia delante se muestran en el aviso de eventos (antes fijo en 5). El ajuste es compartido para todo el equipo (guardado en Supabase, tabla nueva `app_settings`), no por dispositivo.
- **Etiqueta "Próximos eventos"** junto al icono del aviso, visible solo en pantallas anchas (monitor del curro); en móvil sigue siendo solo el icono, sin texto, para no ocupar espacio.

---

## v35

### Cambiado
- **Las etiquetas de categoría ya no ocupan una línea propia.** Quitada la fila de chips debajo del buscador; ahora escribir una categoría en el buscador (p. ej. "carne") filtra directamente todos los platos y producciones con esa categoría, igual que buscar por nombre. Gana una línea entera de pantalla en Platos y Producción.

---

## v34

### Cambiado
- **"Días con más trabajo previstos" ya no ocupa espacio en la pantalla.** Sustituido el banner desplegable por un icono discreto en la cabecera (junto al tema/Admin), con un contador y el mismo parpadeo naranja cuando hay algo nuevo sin ver. Al tocarlo se abre como ventana emergente, sin robar altura a la lista de recetas.
- **Más espacio vertical en pantallas anchas (monitor del curro).** Cabecera más compacta (nombre y subtítulo en una línea, menos relleno), menú inferior más ajustado — pensado para las pantallas panorámicas y no muy altas, donde antes quedaba poco hueco para ver las recetas cómodamente. En móvil vertical no cambia nada.

---

## v33

### Añadido
- **Diseño adaptable a pantallas anchas** (monitor táctil del curro, tablets), sin crear una app aparte — la misma app se reorganiza sola a partir de 900px de ancho:
  - Platos y Producción pasan de lista en columna única a una **rejilla de varias columnas**, aprovechando el espacio.
  - Fichas de detalle, editores, Utilidades y Admin mantienen un **ancho de lectura cómodo** (no se estiran de borde a borde).
  - Cabecera y menú inferior se centran y quedan compactos en vez de separarse a los extremos de una pantalla muy ancha.
  - En móvil (menos de 900px) todo sigue exactamente igual que hasta ahora.

---

## v32

### Cambiado
- **Ventana del banner ampliada a 5 días** de antelación (antes 3).
- **Detección de duplicados al importar CSV más robusta.** Ahora reconoce el mismo evento aunque Gemini lo redacte distinto entre una consulta y otra (equipos en otro orden, "vs" en vez de guion, etc.), comparando por contenido en vez de por texto exacto.
- **El banner del personal muestra siempre el día y la fecha**, incluso cuando es "Hoy" o "Mañana" (antes esas dos palabras sustituían al día; ahora van delante, ej. "Hoy, viernes 12 sept").

---

## v31

### Cambiado
- **"Visto" del banner de eventos ahora es compartido**, no por dispositivo: en cuanto alguien lo despliega en cualquier móvil, se marca como visto en la base de datos y deja de parpadear para todo el equipo, no solo para quien lo abrió.
- **Borrar un evento desde el banner del personal ahora requiere sesión de admin** (se revierte lo de v30): el icono de papelera solo aparece si has iniciado sesión como Chef. La lectura del banner y el "marcar como visto" siguen sin necesitar login.
- **Criterio de fútbol restringido a primera división masculina.** Excluidos explícitamente el fútbol femenino (Liga F, competiciones femeninas de cualquier tipo) y las categorías inferiores o filiales (Segunda División, Castilla, juveniles). Actualizado en `prompt_gemini_eventos.txt`.

---

## v30

### Añadido
- **El banner de eventos del personal ahora es plegable, llamativo y editable.**
  - Empieza plegado (solo el título), para no ocupar espacio.
  - Cuando hay un evento nuevo que ese dispositivo aún no ha visto, se pone en **naranja y parpadea** hasta que alguien lo despliega; en ese momento se marca como visto (guardado por dispositivo, ya que el personal no inicia sesión) y vuelve a su color normal.
  - Cada evento tiene ahora un botón de **borrar**, utilizable por cualquiera **sin necesidad de login**, para poder limpiar la lista manualmente (eventos ya pasados, o simplemente para ordenar).
- Nueva política de seguridad en Supabase (`important_dates_borrado_publico.sql`): permite borrar sin login, pero **solo** eventos ya aprobados — nunca sugerencias pendientes ni el resto de la base de datos.

---

## v29

### Cambiado
- **"Partidos y conciertos" ahora es desplegable en Admin.** Empieza plegado (mostrando solo el título y el número de pendientes, si hay) para no ocupar toda la pantalla; se toca para abrir y ver el botón de importar y las listas.

---

## v28

### Añadido
- **Importar eventos por CSV (sustituye al robot automático).** Nuevo botón "Importar CSV" en Admin → Partidos y conciertos: se pega ahí el CSV que genera Gemini (chat, no API) siguiendo un prompt fijo, separado por punto y coma. La app valida el formato, **descarta automáticamente los eventos que ya existan** (comparando fecha + categoría + título, sin distinguir mayúsculas ni tildes) y guarda el resto como sugerencias pendientes, dentro del mismo flujo de aprobación que ya existía.
- Se abandona el robot de GitHub Actions + API de Gemini (problemas recurrentes de cuota/facturación); el flujo manual con el chat de Gemini es más simple y fiable.

---

## v27

### Añadido
- **Avisos de partidos y conciertos importantes (Paso 1).** Nueva tabla `important_dates` en Supabase con estados pendiente/aprobado/descartado.
  - **Banner en la pantalla principal**, visible para todo el personal sin necesidad de login, que muestra los eventos aprobados dentro de los próximos 3 días (⚽ partido / 🎤 concierto / 📅 evento).
  - **Panel nuevo en Admin** ("Partidos y conciertos") para aprobar o descartar sugerencias, y para retirar avisos ya activos si un evento se aplaza o cancela.
  - Pendiente el **Paso 2**: el robot de GitHub Actions que llama a la IA a diario para generar esas sugerencias automáticamente.

---

## v26

### Añadido
- **Conversor "Tazas → g" por ingrediente.** Nueva pestaña en Utilidades → Conversión que convierte tazas, cucharadas (tbsp) y cucharaditas (tsp) a gramos —y al revés— según el ingrediente elegido, porque una taza de harina (120 g) no pesa lo mismo que una de azúcar (200 g) o de miel (340 g). Incluye 16 ingredientes habituales (harina, azúcares, mantequilla, arroz, sal, miel, cacao, líquidos, aceite, almendra molida, pan rallado...).

---

## v25

### Añadido
- **Eliminar avisos desde el panel Admin.** Además de "Resolver", ahora cada aviso (pendiente o resuelto) tiene un botón de papelera para borrarlo definitivamente, con confirmación previa.

### Usabilidad
- **El botón "Error" de las fichas ahora se llama "Reportar un error".** El texto anterior se confundía con un fallo de la app; el nuevo deja claro que sirve para avisar de un problema en la receta.

---

## v24 — Auditoría exhaustiva (2ª pasada)

### Corregido
- **Modales no sincronizados con el botón atrás.** Los modales de Comentar, Peso, Salmuera y Vincular se abrían sin registrar estado en el historial. Al pulsar atrás se cerraban, pero consumían el paso de la pantalla de detalle de debajo, descuadrando la navegación posterior. Ahora todos usan un sistema unificado (`openModalNav`) que registra su propio estado; el botón atrás cierra solo el modal y deja la navegación de fondo intacta.
- **Crash al abrir recetas/producciones con campos vacíos.** Si un registro tenía `ingredients`, `steps` o `allergens` en `null` (posible al insertar por SQL), abrir su detalle rompía la app entera. Ahora esos campos se normalizan a lista vacía al cargar los datos.
- **El multiplicador de cantidades aceptaba valores negativos**, mostrando todas las cantidades en negativo. Ahora se limita a un mínimo de 0,1.
- **El desplegable de búsqueda no se cerraba** al tocar fuera de él ni al cambiar de pestaña: quedaba flotando encima de la página nueva. Ahora se cierra en ambos casos (el texto buscado se conserva).
- **`goToRecipeFromProd`** (ir de una producción al plato que la usa) no guardaba la posición de scroll ni ocultaba la barra de navegación de forma consistente. Corregido.
- **`formatAmount`** ahora es robusto ante valores no numéricos (devuelve 0 en vez de "NaN").

### Usabilidad
- **Aviso claro cuando la sesión caduca.** Antes, si la sesión de admin expiraba, guardar o borrar fallaba con un genérico "Error al guardar" sin explicación, y podías reintentar sin fin creyendo que la app estaba rota. Ahora se detecta el fallo de permisos, se avisa "Tu sesión ha caducado" y se reabre el login automáticamente.
- **Foco automático al añadir ingredientes o pasos** en los editores: al pulsar "Añadir", el cursor va directo al campo nuevo, sin necesidad de un toque extra.

### Seguridad / robustez
- **Escapado HTML en todos los campos editables.** Nombres, descripciones, ingredientes, pasos y montaje de platos y producciones ahora se escapan al pintarse (antes solo se hacía en los comentarios). Evita que un carácter `<` en cualquier texto rompa el render o permita inyección.

### Limpieza
- Eliminada variable de estado muerta (`_pedidosIndex`).

---

## v23 — Auditoría completa (1ª pasada)

### Corregido
- **B1 · Lightbox no cerraba con el botón atrás de Android.** La foto de un plato quedaba encima mientras la app navegaba por debajo. Ahora `openLightbox` registra estado en el historial y el atrás lo cierra correctamente.
- **B2 · Selector de grupo de pedidos** tenía el mismo problema; añadido al manejador `popstate`.
- **B3 · XSS en el mensaje "Sin resultados"** del buscador (query sin escapar). Corregido.
- **B4 · Nombres con comilla simple** rompían el botón "Comentar". Corregido usando `data-name`.

---

## v22

### Eliminado
- **Sección "Mis Recetas" eliminada completamente** (pestaña del menú, páginas de lista/detalle/editor, todas las funciones JS y las variables de estado). La tabla `my_recipes` de Supabase se limpia con el archivo `borrar_my_recipes.sql`.

---

## v21

### Seguridad
- **Comentarios del personal escapados antes de mostrarse.** El formulario de comentarios es público (sin login), así que era texto no confiable; si alguien metía código HTML/script en un comentario, se ejecutaba al verlo el admin. Corregido: ahora se escapa siempre antes de pintarlo.

### Corregido
- **Botón "Reintentar" en el error de conexión.** Antes, si fallaba la carga inicial, el mensaje de error era un callejón sin salida — había que cerrar y reabrir la app. Ahora tiene un botón para reintentar sin recargar.
- **Parpadeo de tema al recargar en modo oscuro.** Con el modo oscuro activado, al abrir la app se veía un golpe de blanco durante una fracción de segundo antes de aplicar el tema oscuro. Corregido aplicándolo antes de pintar nada.

### Accesibilidad
- Añadido `aria-label` a los botones de solo icono (cambiar tema, borrar búsqueda, cerrar modales) para lectores de pantalla.

---

## v20

### Corregido
- **Botón atrás ahora funciona como un historial real.** Cambiar de pestaña (Platos / Producción / Utilidades / Mis Recetas / Admin) se guarda como un paso navegable; el botón atrás deshace cada paso uno a uno en vez de saltar siempre a la pantalla principal.
- **Aviso de cambios sin guardar siempre activo.** Antes, si abrías el editor desde dentro de una ficha de detalle (no desde la lista), el botón atrás cerraba el editor en silencio sin preguntar. Ahora el aviso de "cambios sin guardar" salta siempre, sin importar desde dónde se abrió el editor.
- **Cancelar una edición vuelve a la ficha correcta.** Editar un plato/producción desde su ficha de detalle y cancelar ahora te devuelve a esa misma ficha, en vez de mandarte al listado completo.
- **Scroll recordado al cambiar de pestaña.** Antes solo se recordaba la posición de scroll al entrar/salir de una ficha; ahora también se recuerda al moverse entre pestañas del menú inferior.

---

## v19

### Añadido
- Nueva categoría **"Sopas y salsas"** exclusiva de Mis Recetas (no afecta a las categorías de Platos), para clasificar salsas, aliños y cremas que no encajaban en Carnes/Pescados/Ensaladas/Postres.

---

## v18

### Añadido
- **Sección "Mis Recetas"**: pestaña privada en el menú inferior, oculta hasta iniciar sesión. Tabla propia en Supabase (`my_recipes`) con seguridad a nivel de fila: sin sesión, las recetas son invisibles incluso con la clave de la API en la mano.
- CRUD completo (crear, ver, editar, borrar) con el mismo estilo que Producción: ingredientes, pasos, alérgenos, multiplicador de cantidades.
- No aparece en la búsqueda global ni se mezcla con Platos o Producciones.

---

## v17

### Cambiado
- **Login de administrador real.** Sustituida la contraseña fija escrita en el código por un inicio de sesión auténtico contra Supabase Auth (`signInWithPassword`). La sesión persiste al recargar la app.

### Seguridad
- Activado **Row Level Security (RLS)** en todas las tablas de Supabase: lectura pública de fichas, envío de comentarios abierto, pero crear/editar/borrar restringido a usuarios autenticados. Antes, cualquiera con la clave anon (visible en el código) podía modificar o borrar toda la base de datos.

---

## v16

### Corregido
- **Parpadeo al cambiar de pantalla.** Las transiciones entre páginas mostraban un destello de un fotograma a opacidad completa antes de empezar a desvanecerse. Solucionado con `animation-fill-mode: both` y `backface-visibility: hidden`.

---

## v15

### Añadido
- Desactivado el gesto de **"pull-to-refresh"** (deslizar de arriba a abajo para recargar), típico del navegador y poco deseable en una PWA instalada (`overscroll-behavior-y: contain`).

---

## v14

### Añadido
- **Skeletons de carga**: tarjetas fantasma con efecto shimmer mientras llegan los datos de Supabase, en vez de pantalla vacía.
- **Imágenes con fundido de carga**: shimmer mientras cargan las fotos de los platos; degradado sutil en las fichas sin foto.
- **Números tabulares** en cantidades de ingredientes, conversor y multiplicador, para que no "bailen" al escalar raciones.

---

## v13

Versión de partida de esta sesión de trabajo (subida por el usuario). Punto base sobre el que se aplican los cambios anteriores.
