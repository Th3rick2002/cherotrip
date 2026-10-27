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
- `/admin/eventos`: Tabla densa y formulario CRUD de eventos y agenda `sub_events`.
- `/admin/moderacion`: Bandeja de entrada para revisar y aprobar `community_submissions`.

## 3. Módulos y Requerimientos

### Módulo A: Autenticación y Seguridad (Issue #41)
- **Proveedor:** Supabase Auth (Email y Contraseña).
- **Sin registro público:** No existe auto-registro; las cuentas son creadas manualmente desde el dashboard de Supabase y asignadas al personal autorizado. `enable_signup = false` en Auth.
- **Rol admin explícito:** estar autenticado no da acceso. Un usuario es admin solo si su `id` está en `public.admin_users`; se consulta con `public.is_admin()`. Las políticas RLS de #42–#44 deben usar `public.is_admin()`, nunca solo `to authenticated`. Así, activar más adelante el login público para visitantes no les da permisos de admin.
- **Proxy:** `proxy.ts` (Next.js 16 renombró `middleware.ts`) intercepta `/admin/*` y redirige a `/admin/login` si no hay sesión de admin. Es la primera barrera; cada página y Server Action vuelve a verificar con `requireAdmin()` (`lib/admin/auth.ts`).
- **Sesión persistente:** Manejo de cookies seguro mediante `@supabase/ssr`. El sitio público no lee cookies de sesión.

### Módulo B: Gestión de Contenido y Multimedia (Issues #42 y #43)
- **Bucket Storage (Issue #42):** `listing-covers` en Supabase Storage. Lectura pública por URL; listar, subir, reemplazar y borrar solo con `public.is_admin()`. JPG, PNG o WebP, máximo 5 MB (lo aplica el bucket). Rutas `<slug|general>/<uuid>.<ext>`, también exigidas por la política.
  - **Subida:** la Server Action `createCoverUpload` (`lib/admin/cover-actions.ts`) valida con zod y devuelve un token firmado; el navegador sube el archivo directo a Storage con `uploadToSignedUrl`. Así la imagen no pasa por la función de Vercel (límite de ~4.5 MB por petición).
  - **UI:** `components/admin/cover-picker.tsx` (arrastrar y soltar, vista previa, `name` para usarlo dentro de un `<form>`). `/admin/portadas` lista las imágenes, copia su URL y las borra; los formularios de #43 reutilizarán el selector.
  - El bucket `covers` original (portadas del seed) se conserva sin cambios.
- **Formularios React Hook Form + Zod:**
  - Datos generales: título, slug, tipo (`lugar` o `evento`), departamento, categoría, descripción.
  - Logística y costos: precios, horarios, cómo llegar (buses/vehículos), nivel de accesibilidad.
  - Campos v3: redes oficiales (`instagram_url`, `facebook_url`, `tiktok_url`), taquilla (`ticket_url`, `ticket_provider`), hospedaje (`accommodation_url`, `accommodation_search_query`).
  - Agenda multi-día: creador dinámico de filas para `sub_events`, usando `activity_categories`.
- **UI Data-Dense:** Tablas de `shadcn/ui` con filtros rápidos, búsqueda en tiempo real y paginación.
- **Feedback:** Notificaciones tipo Toast (`Sonner`) ante acciones de guardado o error.

### Módulo C: Moderación Comunitaria (Issue #44)
- **Bandeja de Aportes:** Lista de registros de `community_submissions` en estado `pending`.
- **Acción "Aprobar":** Abre el formulario de listing prellenado con la información sugerida por el usuario y actualiza el estado a `aprobado`.
- **Acción "Rechazar":** Cambia el estado a `rechazado` o elimina la fila si es contenido basura/spam.
