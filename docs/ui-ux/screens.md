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
  - **CTA Comunitario:** Banner o botón sutil hacia el modal "Aporta a la Comunidad".

## 2. P2: Explorador y Búsqueda (Explorar)

- **Ruta:** `app/(main)/explorar/page.tsx`
- **Comportamiento:**
  - **Barra de Búsqueda:** Campo de texto predictivo con debounce.
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

## 4. Navegación Global

- **TopBar (`components/layout/top-bar.tsx`):** Logo de Cherotrip, enlace rápido a Explorar y disparador del Drawer lateral.
- **Side Drawer (`components/layout/side-drawer.tsx`):** Menú lateral móvil con accesos a:
  - Inicio / Explorar
  - Mis Guardados (con contador de favoritos)
  - Sobre Cherotrip / Misión
  - Contacto / FAQ
  - Botón "Aportar a la comunidad"

## 5. Próximas Pantallas (Fase 2)

- **Mis Guardados (`app/(main)/guardados/page.tsx`):**
  - Muestra la lista de tarjetas favoritas recuperadas de `localStorage`.
  - Si está vacío: Ilustración amigable y botón hacia el explorador.
- **Modal Aportes de la Comunidad (`CommunityContributionModal`):**
  - Diálogo accesible para enviar recomendaciones de sitios o corregir datos sin salir de la vista actual.

## 6. Panel Administrativo Interno (`/admin/*`) — Desktop-First

- **Enfoque:** Diseñado para pantallas de escritorio (computadoras de oficina), priorizando densidad de información, rapidez de captura y claridad tabular.
- **Rutas clave:**
  - `/admin/login`: Formulario centrado y minimalista para ingreso por correo y contraseña.
  - `/admin/dashboard`: Vista general con tarjetas de resumen métrico y accesos rápidos.
  - `/admin/lugares` & `/admin/eventos`: Data-tables con paginación, filtros multicriterio, acciones rápidas (editar, eliminar, alternar publicado) y modales o pantallas completas de edición con `react-hook-form` + `zod`.
  - `/admin/moderacion`: Bandeja de correo estilo split-view o tabla de aportes ciudadanos con botones de acción directa ("Aprobar como listing" o "Descartar").
- **Layout:**
  - Sidebar izquierdo oscuro/neutro (`w-64`) fijo con logo, menú de secciones y perfil/logout.
  - Área de contenido central amplia (`bg-slate-50` o `bg-white`) con barra superior de acciones contextuales.
