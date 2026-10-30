# Especificación Funcional: Social Light (Bloque 3 — v3)

Capacidades comunitarias y de personalización local sin fricción de cuentas ni contraseñas.

## 1. Motivación

Permitir al usuario armar su propio itinerario o lista de deseos durante su viaje y abrir un canal para que la comunidad recomiende nuevos rincones turísticos, manteniendo la arquitectura ligera y sin costes de gestión de usuarios/auth en el MVP.

## 2. Componentes y Módulos

### A. Favoritos en Cards (`useFavorites`) — Issue #37
- **Almacenamiento:** 100% cliente mediante `localStorage` (clave ej. `cherotrip_favorites_v1`).
- **UI:** Icono de corazón interactivo en la esquina superior derecha de las tarjetas de listing y en la cabecera de la ficha detalle.
- **Microinteracción:** Alternancia de estado instantánea (optimista) con relleno rosa/rojo.
- **Prevención de eventos:** `e.stopPropagation()` para evitar que tocar el corazón navegue hacia la ficha de detalle.

### B. Ruta y Sección "Mis Guardados" — Issue #38
- **Ruta:** `app/(main)/guardados/page.tsx`.
- **Navegación:** Enlace directo con icono de marcador en la barra superior (`TopBar`) y en el menú lateral (`SideDrawer`), con badge opcional del número de guardados.
- **Contenido:**
  - Recupera los IDs del almacenamiento local y consulta los listings correspondientes.
  - Estado vacío: cuando no hay guardados, muestra mensaje motivacional y botón directo hacia el explorador.

### C. Página "Aporta a la Comunidad" — Issue #39
- **Tabla DB:** `community_submissions` (`title`, `listing_type`, `department_id` → `departments.id`, `description`, datos logísticos según tipo, `photo_path`, `contact_optional`, `status = 'pending'`).
- **Seguridad RLS:** Rol `anon` cuenta únicamente con permisos limitados de `INSERT`. No hay permisos de lectura pública ni edición para proteger la privacidad de los contactos.
- **UI:** Página independiente `/aportar`, accesible desde la navegación de escritorio y el menú lateral móvil. Permite recomendar lugares o eventos, con campos específicos por tipo, detalles logísticos, contacto opcional y foto opcional. Home no muestra un banner de aportes.
- **Fotos:** Carga al bucket privado `community-submission-photos`, solo JPG/PNG/WebP/AVIF hasta 5 MiB. La fila guarda el nombre del objeto en `photo_path`; no se expone una URL pública.
- **Flujo:** Al enviar, muestra confirmación de agradecimiento sin refrescar la página. La fila usa el estado `pending` por defecto. Moderación muestra los datos y la foto con URL firmada, y ofrece convertir el aporte en un borrador del mismo tipo con los campos precargados. Para usar la foto en la ficha, el admin la copia al bucket público de portadas.
