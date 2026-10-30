# Especificación de Pantallas (UI / UX)

Flujo y comportamiento visual de las pantallas de Cherotrip.

## 1. P1: Pantalla Principal (Home)

- **Ruta:** `app/(main)/page.tsx`
- **Componentes clave:**
  - **Hero de Bienvenida:** Título inspirador, buscador interactivo rápido con redirección a Explorar.
  - **Colecciones Rápidas:** Carrusel horizontal de accesos temáticos (Ruta de las Flores, Surf City, Volcanes, Pueblos Mágicos).
  - **Próximos Eventos:** Lista o carrusel de eventos con fechas destacadas.
  - **Servicios Rápidos:** Atajos a información esencial (cómo moverse, seguridad, tips de viaje).
  - **Tabs por Departamento:** Selector ágil de departamentos para descubrir lugares por zona geográfica sin salir del Home.
  - La invitación a recomendar lugares vive en la página `/aportar`, accesible desde la navegación global.

## 2. P2: Explorador y Búsqueda (Explorar)

- **Ruta:** `app/(main)/explorar/page.tsx`
- **Comportamiento:**
  - **Barra de Búsqueda:** Campo de texto y botón **Buscar**; al enviar muestra el estado **Buscando…** y carga los resultados con skeleton.
  - **Filtros Independientes:** Fila de chips de Categorías y dropdown o selector de Departamento (mutuamente combinables).
  - **Grid de Resultados:** Lista responsiva (1 col en móvil, 2 en tablet, 3-4 en desktop) con componentes `ListingCard`.
  - **Card de Listing:** Imagen de portada (`CoverImage`), badge de categoría/departamento, título, precio referencial y botón de corazón para favoritos.
  - **Estado Vacío:** Mensaje claro cuando no hay coincidencias con sugerencia de limpiar filtros.

## 3. P3: Ficha de Detalle (Detalle)

- **Rutas:** `app/(detail)/lugar/[slug]/page.tsx` y `app/(detail)/evento/[slug]/page.tsx`
- **Estructura visual:**
  - **Hero Multimedia:** Imagen de alta calidad con botones flotantes superiores: "Atrás" (`BackButton`) y "Compartir" (`ShareButton`).
  - **Cabecera:** Nombre, departamento, tipo de lugar/evento, badge de verificado y botón de favorito.
  - **Descripción:** Texto explicativo enriquecido.
  - **Redes y Contacto (`SocialLinks`):** Fila de iconos discretos (Instagram, Facebook, TikTok y WhatsApp) debajo de la descripción.
  - **Cuadrícula Logística 2×2:** Horarios, costo, transporte y accesibilidad.
  - **Alojamiento (`AccommodationBanner`):** Tarjeta blanca con botón azul e icono de hospedaje; referencia Airbnb para búsquedas y destinos alojados allí.
  - **Agenda de Eventos (`EventAgenda`):** (Solo eventos) Selector de días por tabs y timeline cronológico de actividades.
  - **Compra de entradas (`TicketPurchaseCta`):** Tarjeta azul al final del contenido de eventos con URL de taquilla válida. WhatsApp queda junto a las redes y no hay barra fija inferior.
  - **Información importante para tu visita:** Lista formal que puede incluir restricciones, horarios, público recomendado y condiciones generales.
  - **Servicios en la zona:** Para lugares, se ubica al final de la ficha. Distingue aliados locales, anuncios y patrocinios mediante etiquetas compactas y colores diferentes.

## 4. Navegación Global

- **TopBar (`components/layout/top-bar.tsx`):** Logo de Cherotrip, enlace rápido a Explorar y disparador del Drawer lateral.
- **Side Drawer (`components/layout/side-drawer.tsx`):** Menú lateral móvil con accesos a:
  - Inicio / Explorar
  - Mis Guardados (con contador de favoritos)
  - Sobre Cherotrip / Misión
  - Contacto / FAQ
  - Enlace "Aporta a la comunidad" hacia `/aportar`.

## 5. Pantallas Comunitarias

- **Mis Guardados (`app/(main)/guardados/page.tsx`):**
  - Muestra la lista de tarjetas favoritas recuperadas de `localStorage`.
  - Si está vacío: Ilustración amigable y botón hacia el explorador.
- **Aportes de la Comunidad (`/aportar`):**
  - Página independiente para recomendar lugares o eventos y recibir confirmación del envío.

## 6. Panel Administrativo Interno (`/admin/*`) — Desktop-First

### Estado actual

- `/admin/login` y el shell con navegación están implementados y el propietario confirmó acceso.
- `/admin/dashboard` muestra métricas de lugares, eventos, publicaciones, borradores y aportes pendientes.
- `/admin/portadas` permite subir/listar/copiar/borrar imágenes de `listing-covers`.
- Lugares, eventos, categorías, Home y moderación ya tienen rutas de gestión. Los formularios están conectados a la base de datos mediante la nueva migración CMS.
- Las acciones administrativas muestran estado pendiente y se bloquean durante el envío; el panel usa skeletons al cargar. Los controles indican interacción con cursor y microanimación.

- **Enfoque:** Diseñado para pantallas de escritorio (computadoras de oficina), priorizando densidad de información, rapidez de captura y claridad tabular.
- **Rutas objetivo:**
  - `/admin/login`: Formulario centrado y minimalista para ingreso por correo y contraseña.
  - `/admin/dashboard`: Resumen con métricas de listings publicados/borradores y aportes pendientes.
  - `/admin/lugares` y `/admin/eventos`: secciones y formularios separados que escriben en `listings` fijando `type = 'place'` o `type = 'event'`. Comparten campos comunes; cada formulario presenta campos específicos y la agenda corresponde solo a eventos.
  - `/admin/categorias`: gestión de categorías de directorio por tipo de listing y categorías de actividad.
  - `/admin/moderacion`: aportes ciudadanos con visualización privada de foto y flujo para convertir una sugerencia en borrador editable.
  - `/admin/portadas`: biblioteca integrada en formularios para asignar la URL de la imagen al listing.
  - Configuración editorial de Home para colecciones y servicios rápidos.
- **Layout:**
  - Sidebar izquierdo oscuro/neutro (`w-64`) fijo con logo, menú de secciones y perfil/logout.
  - Área de contenido central amplia (`bg-slate-50` o `bg-white`) con barra superior de acciones contextuales.
