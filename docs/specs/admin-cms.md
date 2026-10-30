# Especificación Funcional: Panel Administrativo (CMS)

> Estado local al 2026-10-26: flujos CMS implementados en código y migración pendiente de aplicar por el propietario en Supabase. El inventario operativo está en [HANDOFF.md](../state/HANDOFF.md).

## 1. Objetivo

Permitir que el equipo gestione desde `/admin` el contenido real que se publica en Cherotrip: lugares, eventos y sus agendas, categorías, aportes comunitarios y módulos editoriales de Home. El panel debe guardar en Supabase y controlar explícitamente cuándo un registro es borrador, publicado o retirado.

## 2. Estado implementado

- **Autenticación (#41):** login email/contraseña, allow-list `public.admin_users`, verificación mediante `public.is_admin()` en `proxy.ts`, páginas y acciones.
- **Portadas (#42):** bucket público `listing-covers`; solo admins pueden listar, subir y borrar. La UI permite arrastrar/seleccionar JPG, PNG o WebP de hasta 5 MiB, revisar la biblioteca y copiar URLs.
- **Dashboard:** muestra métricas de lugares, eventos, publicaciones, borradores y aportes pendientes.
- **Gestión editorial (#43):** CRUD separado de lugares/eventos; formularios escriben en `listings` fijando el tipo. Eventos incluyen agenda, y ambos formularios admiten logística, categorías y portada. Publicar o despublicar es explícito.
- **Catálogos:** las categorías del directorio se asignan a lugares, eventos o ambos por `category_listing_types`; también se gestionan las categorías de actividad de agenda. Se pueden desactivar sin perder relaciones existentes.
- **Home:** colecciones y servicios rápidos se administran en `/admin/contenido`; la vista pública las carga de `home_quick_links`.
- **Moderación (#44):** bandeja de pendientes, fotos privadas por URL firmada y conversión transaccional a borrador del tipo de contenido recomendado (lugar o evento). Los campos se precargan y el admin puede copiar la foto al bucket público de portadas. El aporte pasa a aprobado al completar la conversión o puede rechazarse.
- **Aliados y patrocinios:** catálogo de negocios y asociaciones por lugar. Las relaciones editoriales se muestran como «Aliado local», marketing como «Anuncio pagado» y el patrocinio como «Patrocinador». Esta fase no registra contratos, descuentos ni compras referidas.

## 3. Rutas objetivo

- `/admin/dashboard`: conteos de lugares, eventos, borradores, publicaciones y aportes pendientes.
- `/admin/lugares` y `/admin/lugares/nuevo`, `/admin/lugares/[id]`: tabla y formulario exclusivos para listings `type = 'place'`.
- `/admin/eventos` y `/admin/eventos/nuevo`, `/admin/eventos/[id]`: tabla y formulario exclusivos para listings `type = 'event'`, incluida la agenda.
- `/admin/categorias`: administración de categorías del directorio y del catálogo de categorías de agenda. Las categorías del directorio se pueden asignar a lugar, evento o ambos.
- `/admin/moderacion`: aportes `pending`, vista segura de su foto y acciones de moderación.
- `/admin/aliados`: catálogo de negocios y asociación a lugares con clasificación editorial o pagada.
- `/admin/portadas`: biblioteca ya disponible e integrada en ambos formularios.
- Configuración de Home para administrar las colecciones y servicios rápidos que actualmente están hard-coded.

> Se excluye de este alcance convertir textos estructurales de páginas institucionales (Sobre y navegación) en contenido editable, salvo nueva decisión.

## 4. Modelo de edición

Lugares y eventos comparten `public.listings`, diferenciados por `type`, pero el panel debe tener vistas, rutas y formularios distintos. Cada action fija su propio tipo y nunca confía en un `type` libre enviado por el navegador. Los campos compartidos se reutilizan como secciones/componentes, mientras que los campos específicos se muestran según el tipo.

### Campos comunes de `listings`

- Identidad: `title`, `slug`, `description`, `department_id` (catálogo `departments`), `meeting_point`, categorías de directorio y `cover_image_url`.
- Publicación: `is_published`, `published_at`, `featured`, `verified`.
- Información al visitante: `price_from`, `payment_methods`, `transport_info`, `accessibility_notes`, `extras`, `restrictions`, `tags`, `whatsapp_phone`.
- Enlaces opcionales: `instagram_url`, `facebook_url`, `tiktok_url`, `accommodation_url`, `accommodation_search_query`.

### Formulario de lugar (`type = 'place'`)

Incluye datos comunes y `schedule_text` para horarios habituales. Oculta fechas de evento, taquilla y agenda, salvo que se acuerde permitir alguno de esos campos en lugares.

### Formulario de evento (`type = 'event'`)

Incluye datos comunes, `starts_at`, `ends_at`, `ticket_url`, `ticket_provider` y una lista editable de `sub_events`. Cada actividad usa `event_date`, `start_time`, `end_time`, `title`, `description`, `venue`, `activity_category_id` y `sort_order`.

### Catálogos

- `categories` clasifica listings mediante `listing_categories`; `category_listing_types` mantiene los tipos compatibles. La migración inicial asigna cada categoría actual a ambos tipos para conservar el comportamiento anterior.
- `activity_categories` clasifica cada actividad de agenda.
- Ambas listas necesitan gestión admin: crear/editar, ordenar, activar/desactivar. No borrar una categoría que esté en uso; las referencias se deben conservar.
- Un listing solo puede asociarse a categorías cuyo alcance incluya su tipo. Categorías inactivas existentes se conservan en edición, pero no se ofrecen para nuevas asignaciones.

## 5. Reglas editoriales y comunidad

- Los registros nuevos empiezan como borrador (`is_published = false`); publicar es una acción explícita.
- Un evento puede guardarse sin agenda; solo se muestra la agenda pública si hay actividades.
- Los aportes comunitarios no se publican directamente. Moderación muestra su foto privada únicamente a admins.
- «Convertir en lugar/evento» abre el formulario correspondiente prellenado y guarda un borrador. El aporte solo pasa a `approved` cuando el admin termina la conversión; luego puede publicar por separado. Para spam se permite `rejected` o eliminación explícita.
- No eliminar listings que deban conservar historial o favoritos; ofrecer retirar/despublicar (`is_published = false`).
- No borrar portadas referenciadas por listings. La limpieza de objetos huérfanos se mantiene manual hasta definir su proceso.

## 6. Seguridad, persistencia y sincronización

- Toda página y Server Action privada usa `requireAdmin()`/`getAdmin()`; validación Zod en servidor.
- RLS protege listings, relaciones, sub-eventos, catálogos y aportes. `authenticated` por sí solo no autoriza: las políticas admin usan `public.is_admin()`.
- Dar a los admins lectura de todos los listings (incluidos borradores) y permisos de escritura necesarios; público conserva lectura de listings publicados y categorías activas.
- Aportes: admins pueden leer, actualizar estado y rechazar/eliminar; anónimos conservan solo `INSERT` de aportes pendientes, para lugares y eventos.
- El bucket `community-submission-photos` permanece privado. Admins obtienen acceso temporal/controlado a la foto; nunca URL pública.
- `partners` y `listing_partners` tienen RLS. Público solo lee relaciones activas de lugares publicados; administración usa `public.is_admin()`.
- Tras mutaciones se revalidan rutas o tags utilizados por Home, Explorar, listados y detalle para que la publicación se refleje inmediatamente.
- Migraciones incrementales, nombres de tablas/columnas en inglés y preservación de los registros QA existentes. No limpiar datos de Supabase como parte de las migraciones.

## 7. Interfaz

Desktop-first con tablas compactas, búsqueda/filtros, paginación, estados visibles (`Borrador`, `Publicado`, `Pendiente`, `Aprobado`, `Rechazado`) y formularios agrupados por secciones. Formularios responsivos y carga de portada reutilizando `CoverPicker`. Confirmación antes de acciones destructivas y mensajes de éxito/error.

## 8. Trabajo pendiente

- **#43 y #44:** implementación local completa; revisar issues remotas y cerrar solo después de QA aceptada.
- Aplicar `20261027045830_admin_cms_content.sql` al proyecto MVP enlazado; no se ejecutó desde este entorno.
- QA manual: alta/edición por tipo, agenda, publicación/despublicación, catálogos, contenido Home y moderación con foto privada; comprobar aparición pública y preservación de fixtures existentes.
