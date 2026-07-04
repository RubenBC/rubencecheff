# Changelog — RubenceChef (Hotel Kitchen Pro)

Todas las versiones notables de la app, de más reciente a más antigua.

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
