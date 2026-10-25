# Especificación Funcional: Panel Administrativo Interno (CMS)

Módulo privado para la gestión editorial, subida de multimedia y moderación de contenidos de Cherotrip por parte de Turismo y Mercadotecnia.

## 1. Objetivos

- Proveer al equipo no técnico una interfaz gráfica web para crear, editar y moderar listings sin tocar SQL ni depender de archivos Excel manuales.
- Garantizar la integridad de los datos mediante validaciones de esquema estrictas (`zod`).
- Centralizar la carga de imágenes a través de almacenamiento en la nube (Supabase Storage).

## 2. Arquitectura de Rutas (`/admin/*`)

Rutas privadas agrupadas bajo el layout `/admin`:

- `/admin/login`: Pantalla de acceso mediante correo y contraseña.
- `/admin/dashboard`: Métricas resumidas (total listings activos, eventos vigentes, aportes pendientes).
- `/admin/lugares`: Tabla densa y formulario CRUD de lugares turísticos.
- `/admin/eventos`: Tabla densa y formulario CRUD de eventos y agenda `sub_eventos`.
- `/admin/moderacion`: Bandeja de entrada para revisar y aprobar `aportes_comunidad`.

## 3. Módulos y Requerimientos

### Módulo A: Autenticación y Seguridad (Issue #41)
- **Proveedor:** Supabase Auth (Email y Contraseña).
- **Sin registro público:** No existe auto-registro; las cuentas son creadas manualmente desde el dashboard de Supabase y asignadas al personal autorizado.
- **Middleware:** `middleware.ts` intercepta toda ruta `/admin/*` y redirige a `/admin/login` si la sesión no es válida.
- **Sesión persistente:** Manejo de cookies seguro mediante `@supabase/ssr`.

### Módulo B: Gestión de Contenido y Multimedia (Issues #42 y #43)
- **Bucket Storage:** `listing-covers` en Supabase Storage (lectura pública, escritura solo para administradores autenticados).
- **Formularios React Hook Form + Zod:**
  - Datos generales: título, slug, tipo (`lugar` o `evento`), departamento, categoría, descripción.
  - Logística y costos: precios, horarios, cómo llegar (buses/vehículos), nivel de accesibilidad.
  - Campos v3: redes oficiales (`link_instagram`, `link_facebook`, `link_tiktok`), taquilla (`link_taquilla`, `proveedor_taquilla`), hospedaje (`link_alojamiento`, `municipio_busqueda`).
  - Agenda multi-día: creador dinámico de filas para `sub_eventos`.
- **UI Data-Dense:** Tablas de `shadcn/ui` con filtros rápidos, búsqueda en tiempo real y paginación.
- **Feedback:** Notificaciones tipo Toast (`Sonner`) ante acciones de guardado o error.

### Módulo C: Moderación Comunitaria (Issue #44)
- **Bandeja de Aportes:** Lista de registros de `aportes_comunidad` en estado `pendiente`.
- **Acción "Aprobar":** Abre el formulario de listing prellenado con la información sugerida por el usuario y actualiza el estado a `aprobado`.
- **Acción "Rechazar":** Cambia el estado a `rechazado` o elimina la fila si es contenido basura/spam.
