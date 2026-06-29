# Changelog — RubenceChef (Hotel Kitchen Pro)

Todas las versiones notables de la app, de más reciente a más antigua.

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
