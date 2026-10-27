# Paquete de Reanudación (Handoff)

## Estado confirmado

- **Proyecto:** Cherotrip, Next.js 16, React 19, TypeScript, Tailwind y Supabase.
- **Rama/commit base:** `main`, `94dcb7b`; los cambios de CMS y documentación de esta tarea aún no están en commit.
- **Supabase MVP:** proyecto `xrnffirpxbnslwnvudpu`. El propietario ya aplicó migraciones hasta `20261026220000_add_listing_covers_bucket.sql`, creó su usuario Auth, lo autorizó en `public.admin_users` y confirmó acceso a `/admin`.
- **Datos:** conservar fixtures y aportes QA existentes. No hay limpieza ni seed destructivo en este trabajo.

## CMS implementado localmente

- Acceso admin (`#41`) y biblioteca de portadas (`#42`) ya fueron aplicados y confirmados por el propietario.
- Dashboard con conteos de lugares, eventos, publicados, borradores y aportes pendientes.
- Secciones y formularios separados para lugares y eventos; ambos guardan en `listings` fijando `type` del lado servidor. El formulario de evento gestiona agenda; ambos incluyen categorías, logística y selección de portada.
- Categorías del directorio con alcance lugar/evento/ambos en `category_listing_types`; las categorías actuales se inicializan para ambos tipos. También se gestionan categorías de actividad de `sub_events`.
- Contenido de Home para colecciones y servicios en `home_quick_links`, ya consumido por la pantalla pública.
- Moderación de aportes pendientes, visualización temporal de foto privada, rechazo y conversión transaccional a borrador de lugar. El aporte queda aprobado cuando se completa la conversión.
- La nueva migración es `supabase/migrations/20261027045830_admin_cms_content.sql`. **No está aplicada al proyecto remoto.**

## Próximo paso

1. Revisar el diff y hacer commit/subir la rama cuando el propietario lo solicite.
2. El propietario aplica la migración al proyecto MVP con `pnpm db:push`.
3. Completar QA manual: crear y editar lugar/evento; validar agenda y categorías; publicar/despublicar; comprobar Home; convertir/rechazar un aporte; confirmar que los fixtures QA existentes siguen presentes y que lo publicado aparece en la web.
4. Revisar el estado actual de GitHub para #43, #44 y #40. No marcar #40 como resuelta sin la validación del propietario y los demás revisores.

No se aplicaron migraciones remotas, no se tocaron datos existentes y no se ejecutaron tests de base de datos. Este entorno no inició Supabase local ni Docker/Podman.

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
- Si `category_listing_types` aún no existe, el panel ahora registra el error de Supabase en el servidor y explica que se debe aplicar la migración CMS. Es probable que este fuera el origen de «No se pudieron cargar las categorías» si `20261027045830_admin_cms_content.sql` sigue pendiente.
- El aviso de descarga de Plus Jakarta Sans indica que el entorno no pudo alcanzar Google Fonts; Next presenta la fuente de respaldo. El mensaje `Could not open auth.ts in the editor` corresponde a que el editor configurado en `REACT_EDITOR` no está instalado/disponible; no es un fallo de autenticación ni de la app.
- ESLint dirigido, `tsc --noEmit` y `git diff --check` pasaron después de los ajustes.

## Aplicación remota de la migración CMS

- El usuario intentó `pnpm db:push` y `pnpm exec supabase db push --linked`; ambos fallaron en la conexión con el pooler de Supabase antes de aplicar SQL (`Initialising login role` / `Connection terminated unexpectedly`). Por tanto, la migración CMS sigue pendiente y no se debe asumir aplicada.
- La documentación oficial de Supabase describe fallos del login sin contraseña con el rol interno `cli_login_postgres` en Supavisor y recomienda usar `SUPABASE_DB_PASSWORD`; también recomienda revisar IPs bloqueadas en Database Settings tras reintentos fallidos.
- Al 2026-10-27 la página de estado de Supabase reporta servicios operativos. Próximo intento recomendado: usar temporalmente la contraseña de PostgreSQL (distinta de `SUPABASE_ACCESS_TOKEN`) para un `--dry-run`, verificar que enumere solo `20261027045830_admin_cms_content.sql`, y luego hacer el push. No repetir intentos passwordless si vuelve a fallar; revisar antes los bloqueos de red/IP.
