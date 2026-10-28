# Paquete de Reanudación (Handoff)

## Estado confirmado

- **Proyecto:** Cherotrip, Next.js 16, React 19, TypeScript, Tailwind y Supabase.
- **Rama/commit base:** `main`, con PRs #52 (`feat: implement form in admin panel`) y #53 (`fix: fixed images cover`) fusionados y desplegados en Vercel.
- **Supabase MVP:** proyecto `xrnffirpxbnslwnvudpu`. Migraciones aplicadas al 100%, incluyendo `20261027045830_admin_cms_content.sql`. Usuario admin creado y autenticado en `public.admin_users`.
- **Datos:** limpieza remota completada el 2026-10-28. Se eliminaron listings, aportes, agendas relacionadas y archivos de ambos buckets. Se conservaron `auth.users` y `public.admin_users`.

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

1. **Cargar contenido verificado (#27):**
   - Entrar al panel administrativo en `https://cherotrip.vercel.app/admin/lugares` y `/admin/eventos`, y alimentar los listings reales de El Salvador con sus teléfonos oficiales.
2. **Confirmar variable de entorno (#30):**
   - Verificar en Vercel que `NEXT_PUBLIC_SITE_URL` tenga el dominio oficial configurado.
3. **Completar QA de soft launch (#28 y #26):**
   - Correr los 5 flujos en móvil y firmar la lista de exclusiones para cerrar el MVP formalmente.

Las migraciones remotas ya fueron aplicadas por el usuario. En esta planificación no se tocaron datos; tampoco se ejecutaron tests de base de datos ni se inició Supabase local/Docker/Podman.

## Convenciones

- Nombres de tablas y columnas en inglés; UI en español.
- Supabase con RLS; autorización admin mediante `public.is_admin()`, nunca solo por rol `authenticated`.
- Server Actions usan Zod y los clientes de `lib/supabase/`.
- Revisar [`docs/rules/`](../rules/) y la [especificación CMS](../specs/admin-cms.md) antes de cambios relacionados.
- No modificar `docs/changes/` ni `docs/decisions/` salvo solicitud.

## Verificación local

- `pnpm exec next typegen`: correcto.
- `pnpm exec tsc --noEmit`: correcto.
- ESLint dirigido a las rutas/componentes/librerías cambiados: correcto.
- `pnpm lint` global todavía falla por una regla `no-this-alias` en el archivo generado `public/sw.js`; sus otros avisos también provienen del archivo generado. No se cambió dicho artefacto.
- `git diff --check`: correcto.

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
