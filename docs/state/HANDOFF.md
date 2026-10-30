# Paquete de Reanudación (Handoff)

## Estado confirmado

- **Proyecto:** Cherotrip, Next.js 16, React 19, TypeScript, Tailwind y Supabase.
- **Rama/commit base:** `main`, con PRs #52 (`feat: implement form in admin panel`) y #53 (`fix: fixed images cover`) fusionados y desplegados en Vercel.
- **Supabase MVP:** proyecto `xrnffirpxbnslwnvudpu`. En la comprobación del 2026-10-29, CLI confirmó migraciones locales/remotas alineadas hasta `20261030034738_expand_community_submissions_and_add_listing_partners.sql`. Usuario admin existente en `public.admin_users`.
- **Datos:** la limpieza remota del 2026-10-28 se completó y después se empezó a cargar contenido real. Consulta de solo lectura del 2026-10-29: 18 listings (17 publicados, 1 borrador) y 1 aporte comunitario. No se tocaron usuarios.

## CMS y Código Fusionados en Producción

- Acceso admin (`#41`) y biblioteca de portadas (`#42`): completados y cerrados.
- Formularios CRUD de lugares y eventos (`#43`) y moderación (`#44`): completados, migración remota aplicada y cerrados.
- Expansión v3 pública (`#36`, `#37`, `#38`, `#39`): completados y cerrados.
- Fix de URLs de portadas de Storage (`CoverImage`): corregido en PR #53.
- Fix de URL canónica en WhatsApp (`SITE_ORIGIN`): corregido en PR #48.

## Estado de GitHub (5 issues abiertas — Bloque 0 Soft Launch)

Quedan abiertas únicamente las 5 tareas de lanzamiento y verificación final:
1. `#30` (Confirmar `NEXT_PUBLIC_SITE_URL` en Vercel prod).
2. `#27` (Cargar contenido y teléfonos reales de turismo mediante el CMS `/admin`).
3. `#26` (Checklist de exclusiones firmado en prod).
4. `#28` (Smoke test móvil formal de 5 flujos + PWA).
5. `#29` (Ajustes de Lighthouse para LCP < 2.5s).

## Próximos pasos inmediatos

1. **Completar contenido verificado (#27):**
   - Continuar revisando los listings y sus teléfonos oficiales desde el panel `/admin/lugares` y `/admin/eventos`.
2. **Confirmar variable de entorno (#30):**
   - Verificar en Vercel que `NEXT_PUBLIC_SITE_URL` tenga el dominio oficial configurado.
3. **Completar QA de soft launch (#28 y #26):**
   - Correr los 5 flujos en móvil y firmar la lista de exclusiones para cerrar el MVP formalmente.

Las migraciones remotas se verificaron con `supabase migration list --linked`. Las consultas de este turno fueron de solo lectura; no se aplicaron migraciones ni se modificaron datos remotos.

## Convenciones

- Nombres de tablas y columnas en inglés; UI en español.
- Supabase con RLS; autorización admin mediante `public.is_admin()`, nunca solo por rol `authenticated`.
- Server Actions usan Zod y los clientes de `lib/supabase/`.
- Revisar [`docs/rules/`](../rules/) y la [especificación CMS](../specs/admin-cms.md) antes de cambios relacionados.
- No modificar `docs/changes/` ni `docs/decisions/` salvo solicitud.

## Verificación local

- `pnpm exec next typegen`: correcto.
- ESLint dirigido a las rutas/componentes/librerías cambiados en esta corrección: correcto.
- `git diff --check`: correcto.
- El chequeo de tipos pasa al usar el manifiesto actual de rutas y excluir el manifiesto de desarrollo obsoleto. El `tsconfig` normal sigue leyendo `.next/dev/types/validator.ts` viejo, que aún apunta a `/contacto`.
- `pnpm exec next build` no completó: primero no pudo descargar Plus Jakarta Sans de Google Fonts; al reintentar, Turbopack falló al crear un proceso por una restricción del entorno. `--webpack` también falló al leer la salida de `tsc --showConfig`.
- `pnpm lint` global todavía falla por una regla `no-this-alias` en el archivo generado `public/sw.js`; sus otros avisos también provienen del archivo generado. No se cambió dicho artefacto.

## Incidencias reportadas al probar el panel

- Se agregó un límite `Suspense` alrededor del contenido de `/admin`, para que Next pueda diferir a la petición real las lecturas de sesión y datos no cacheados del panel.
- El formulario de categorías registra el error real de Supabase en el servidor y muestra un mensaje específico si falta la migración CMS.
- El usuario confirmó el 2026-10-28 que todas las migraciones, incluida `20261027045830_admin_cms_content.sql`, ya están aplicadas al proyecto MVP. Los problemas previos de conexión del CLI están resueltos.
- El aviso de descarga de Plus Jakarta Sans indica que el entorno no pudo alcanzar Google Fonts; Next presenta la fuente de respaldo. El mensaje `Could not open auth.ts in the editor` corresponde a que el editor configurado en `REACT_EDITOR` no está instalado/disponible; no es un fallo de autenticación ni de la app.
- ESLint dirigido, `tsc --noEmit` y `git diff --check` pasaron después de los ajustes.

## Incidencia de portada pública

- QA reportó que una portada subida desde el CMS no aparecía y el navegador pedía `/covers/{slug}.jpg`, ruta local inexistente para ese listing.
- `CoverImage` recibía la URL guardada en `cover_image_url`, pero `resolveCoverSrc` priorizaba siempre el fallback local si también había `slug`. Se corrigió para usar primero la URL configurada y recurrir a `/covers/{slug}.jpg` únicamente cuando no hay URL guardada.
- Falta que el propietario vuelva a cargar el detalle del lugar probado y confirme visualmente que la portada de Storage aparece.

## Limpieza de datos y cobertura del MVP (2026-10-28)

- Se eliminaron los 15 listings, 13 relaciones `listing_categories`, 3 agendas `sub_events` y 3 aportes `community_submissions`.
- Se vaciaron 1 objeto de `listing-covers` y 2 objetos de `community-submission-photos` usando `supabase storage rm` (Storage API).
- Se conservaron los 3 usuarios de `auth.users` y los 3 registros de `public.admin_users`; no se reiniciaron identidades.
- Catálogos verificados: 3 categorías editoriales, 6 alcances de categoría, 9 categorías de actividad y 6 accesos rápidos canónicos de Home.
- La UI y la base de datos aceptan únicamente San Miguel, Usulután, La Unión y Morazán. `20261028120000_restrict_departments_to_eastern_region.sql` está aplicada y registrada en el historial remoto.
- SQL de la operación puntual: `supabase/ops/one_time_reset_mvp_content_20261028.sql`. No volver a ejecutarlo tras empezar la carga de datos reales.

## Video promocional (2026-10-29)

- La persona usuaria eligió OpenFilm para un video de pitch de 20 segundos y pidió guardar el flujo antes de producir.
- Plan y storyboard en [`docs/marketing/video-promo-20s.md`](../marketing/video-promo-20s.md).
- **No iniciar la producción todavía:** primero la persona usuaria indicará las correcciones de código; después se cargará/revisará contenido real en Supabase y se grabará la interfaz.
- La DB ya contiene contenido real cargado después de la limpieza. No introducir fixtures falsos en producción para el video.

## Correcciones previas al video (2026-10-29)

- Home ahora mezcla lugares publicados con eventos próximos por departamento. La verificación remota mostró que San Miguel y Usulután tienen eventos publicados, pero ningún lugar; por eso la agrupación anterior, limitada a lugares, dejaba esas pestañas vacías.
- Aportes comunitarios: ahora aceptan lugares y eventos con detalles propios, datos logísticos y foto privada. Moderación abre el formulario del tipo correcto, precarga los datos y permite copiar la foto privada al bucket de portadas.
- Relaciones comerciales: nuevas tablas `partners` y `listing_partners`, gestión básica en `/admin/aliados` y tarjetas debajo de la logística de lugares. `editorial` se muestra como «Aliado local», `paid_marketing` como «Anuncio pagado» y `sponsor` como «Patrocinador». No se guardan contratos, descuentos ni compras referidas.
- Se eliminó `/contacto` de rutas, navegación y sitemap. Se conservaron los campos de contacto directo de los negocios/listings, necesarios para sus canales oficiales.
- Las portadas de detalle tienen ancho máximo menor en desktop; `/admin` cuenta con 404 propio y vuelve al panel/listas en vez de Explorar.
- La migración `20261030034738_expand_community_submissions_and_add_listing_partners.sql` está aplicada y registrada en remoto (confirmado por CLI); amplía aportes, renombra `place_name` a `title`, crea las tablas de aliados y admite AVIF en portadas.
- Se corrigieron las rutas de edición: los directorios dinámicos estaban nombrados literalmente `'[id]'` con comillas y Next no los reconocía. Ahora están en `[id]`, de modo que `/admin/eventos/{id}` y `/admin/lugares/{id}` alcanzan sus páginas y el `notFound()` del segmento usa la vista 404 de admin.
- El propietario aprobó normalizar departamentos. La migración local `20261030145125_normalize_departments_catalog.sql` crea `public.departments`, carga los cuatro nombres iniciales, convierte `listings.department` y `community_submissions.department` a `department_id` con backfill y claves foráneas, actualiza RLS y el RPC del CMS. No elimina listings, aportes ni usuarios.
- Home, Explorar, aportes comunitarios, formularios del CMS y selector de aliados leen el catálogo activo. Los formularios envían IDs; el modelo de lectura resuelve el nombre para mostrar. `supabase/seed.sql` también usa los IDs del catálogo.
- El esquema documentado está en [`docs/specs/database-schema.md`](../specs/database-schema.md). La migración está creada localmente y **no se ha aplicado al proyecto remoto**; debe aplicarse antes de desplegar el código que la requiere.
- Pendiente QA manual y carga de listings reales. Después se validará el contenido y se grabará la UI para OpenFilm, según [`docs/marketing/video-promo-20s.md`](../marketing/video-promo-20s.md).
