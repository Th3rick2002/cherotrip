# Paquete de Reanudación (Handoff)

Guía rápida de incorporación para agentes y desarrolladores que retoman el proyecto.

## 1. El Proyecto en 3 Frases

Cherotrip es la guía turística y cultural móvil de El Salvador. Resuelve la logística previa al viaje (costos, horarios, transporte) y la conversión directa (WhatsApp y Taquilla de eventos). La arquitectura es una PWA ultraligera en Next.js 15 y Supabase sin sistema de login para evitar fricciones.

## 2. Entorno y Comandos Clave

### Dependencias y Ejecución
```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm dev

# Build de producción (Next.js + Serwist PWA)
pnpm build
```

### Base de Datos (Supabase)
- **ID de proyecto remoto:** `xrnffirpxbnslwnvudpu`
```bash
# Login en Supabase CLI
pnpm db:login

# Vincular con proyecto remoto
pnpm db:link

# Aplicar migraciones al proyecto remoto
pnpm db:push

# Regenerar tipos TypeScript
pnpm db:types
```

`supabase/seed.sql` contiene tres listings `[QA]` para las variantes v3 de detalle. Ya se cargaron
publicados en el proyecto Supabase del MVP; se pueden abrir desde las rutas documentadas en
[docs/supabase-setup.md](../supabase-setup.md). Ese archivo también explica cómo ejecutarlo solo
en el remoto o en la base local.

### Variables de Entorno (`.env.local` y Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xrnffirpxbnslwnvudpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://cherotrip.vercel.app
```

## 3. Estado Actual del Repositorio

- Consulta de GitHub (2026-10-26): las 14 issues abiertas (#26–#30 y #36–#44) no tienen asignados. Consulta solo de lectura; no se modificaron issues.
- Revisión de issues (2026-10-26): ninguna usa label o proyecto de "en progreso". #36–#39 tienen comentario de implementación (rama `feat/detail-contact-cta-redesign`, ya fusionada en `main` vía PR #46) y siguen abiertas para revisión. El resto (#26–#30, #40–#44) no muestra actividad de desarrollo.
- Autoría: todo el trabajo de #36–#39 es de Erick Martínez (`Th3rick2002`), commits `8340ef2`, `149e5ac` y `0fb0f72`.
- Issues sin desarrollo (#26–#30, #40–#44) revisadas contra el código: no existe `/admin`, el helper `lib/supabase/middleware.ts` no está conectado a ningún `middleware.ts`/`proxy.ts`, el bucket existente se llama `covers` (la spec dice `listing-covers`) y faltan `zod`, `react-hook-form` y `sonner`. #26 está desactualizada (favoritos y aportes ya están dentro del alcance) y #27 aún describe la importación por Excel, que el CMS reemplazó.
- Orden propuesto: #30 → #40 → #41 → #42 → #43 → #44 → #27 → #28 → #29 → #26. Cuellos de botella: #41 (bloquea el CMS), #43 (la más grande; bloquea #44 y #27) y #27 (depende del equipo de Turismo). Propuesta de bloque para el usuario (80%): todas menos #27 y #26.
- Asignadas a `androso` (2026-10-26): #40, #41, #42, #43, #44, #28 y #29. Sin asignar: #26, #27, #30 (desasignada: `androso` no tiene acceso a Vercel) y #36–#39.
- #30: producción ya sirve `https://cherotrip.vercel.app` en `robots.txt` y `sitemap.xml`, pero `lib/site.ts` usa `VERCEL_PROJECT_PRODUCTION_URL` como respaldo, así que desde fuera no se puede saber si `NEXT_PUBLIC_SITE_URL` está definida. Confirmarlo requiere acceso al proyecto en Vercel; falta decidir si habrá dominio final propio.
- QA #40 en producción (2026-10-26, navegador headless, móvil 390px y escritorio): los 6 flujos pasan. Se envió un aporte `[QA] Issue 40 prueba` (San Miguel, contacto `qa-issue-40`, con foto `b4dac688-fd4b-4cbb-9fbf-95617fc39f44.jpg`); consérvalo para la revisión de #44. Hallazgos: (1) `lib/whatsapp.ts:19` usa `https://cherotrip.com` como origen por defecto en el mensaje de WhatsApp en vez de `getSiteUrl()`; (2) `ticket_provider` no se muestra en ninguna parte; (3) listings sin portada muestran imagen rota (`/covers/<slug>.jpg` inexistente, p. ej. fixtures QA); (4) la ficha muestra "Oriente SV" para cualquier departamento (`listing-detail.tsx:81`), incorrecto para Sonsonate/La Libertad; (5) el selector de `/aportar` solo ofrece 4 departamentos orientales. Resultados publicados como comentario en #40. Flujo 3 verificado también haciendo clic: el enlace directo abre `example.com/qa/accommodation` y la búsqueda abre Airbnb "Homes near Ruta de las Flores", ambos en pestaña nueva con `window.opener = null`. Flujo 4 verificado haciendo clic: "Comprar entradas" (azul, 324×48 px a 390 px de ancho) abre `example.com/qa/tickets` en pestaña nueva con `window.opener = null`; WhatsApp queda como icono de 40×40 px y no hay botón verde grande. Flujo 5 verificado en móvil (390 px) y escritorio (1280 px): Sáb 7 Nov muestra 2 actividades, Dom 8 Nov muestra 1, el cambio de pestaña va y vuelve sin errores y las flechas del teclado funcionan. Comentario de #40 actualizado con estas verificaciones; marca #26 como hecha y el flujo 6 quedó marcado ✅ asumiendo que producción tiene las políticas de la migración v3 (el `201` implica `pending`; no se leyó el registro). #40 cerrada como completada (2026-10-26). Pendiente: abrir un issue aparte con los 5 hallazgos, una vez verificados. #36–#39 se dejan como están (abiertas, sin aviso a Erick) por decisión del usuario; la QA de #40 cubrió sus funciones. #26 actualizada (favoritos locales y aportes moderados dentro; login de visitantes, perfiles/comentarios/notificaciones y mapas fuera; Auth de `/admin` aclarada como interna).
- Hallazgo 1 (WhatsApp → `cherotrip.com`): issue #47 y PR #48 (rama `fix/whatsapp-site-origin`, commit `8fef28c`). `buildWhatsAppUrl` usa `getSiteUrl()` como origen por defecto. `tsc` (tras `next typegen`) y ESLint pasan. El preview de Vercel de #48 se construyó bien pero está protegido (redirige al login de Vercel), así que no se pudo probar ahí; probar en producción tras el merge o con un enlace compartido de Erick. Erick (`Th3rick2002`) etiquetado en #48 y agregado como revisor; se le pidió un enlace compartido del preview. Pendiente: revisión y merge de #48. Quedan 4 hallazgos para el issue aparte. Nota: `pnpm install` deja sin aprobar los scripts de build de `esbuild` y `unrs-resolver` (`pnpm approve-builds`).
- Issue #41 (2026-10-26): implementada en rama `feat/admin-auth` (commit `5f40a85`), PR #49 abierto con Erick como revisor. Incluye la tabla `admin_users` y la función `is_admin()` (migración `20261026175530`), `proxy.ts` que protege `/admin/*`, `/admin/login`, el layout del panel con sidebar y el dashboard placeholder. Usa `zod`. Probado con Supabase local y `next build && next start`: reglas de la base, redirecciones, rechazo de usuarios no admin, `next` seguro, revocación con sesión abierta y cierre de sesión. `getAdmin()` llama `connection()` porque Cache Components rechaza `Date.now()` de Supabase durante el prerender. Pendiente en producción (Erick): `db push` de la migración, desactivar el registro público en el dashboard de Auth y dar de alta a los admins. Para #42–#44: las políticas RLS deben usar `public.is_admin()`. La base local tiene usuarios de prueba `admin@`/`visitor@`/`stranger@cherotrip.test`. Supabase local sigue corriendo (`pnpm exec supabase stop` para detenerlo).

- **Rama activa:** `feat/admin-auth` (PR #49, #41). PR #48 (`fix/whatsapp-site-origin`) sigue pendiente de revisión.
- **Fase 1 Core:** 100% implementada y visible en producción.
- **Fase 2 / v3:**
  - Issue #31 completada y cerrada (migración DB v3 en remoto).
  - Issue #32 descartada y cerrada (reemplazada por CMS).
  - Issues #33–#35 implementadas y cerradas en GitHub en el commit `4a06da8`; la rama está sincronizada con `origin`.
  - Issues #36–#39 implementadas localmente: agenda multi-día, favoritos locales, Mis Guardados y aportes anónimos con fotos privadas.
  - Fixtures QA de detalle y nuevos aportes de prueba deben conservarse en Supabase para la revisión visual/manual del usuario; limpiar solo cuando lo confirme.
  - Rediseño de contacto: WhatsApp junto a redes; compra de entradas en tarjeta al final de la ficha del evento, sin barra fija.
  - Los aportes comunitarios se presentan en `/aportar`, desde la navegación global y el drawer móvil; Home ya no muestra el banner y se conserva el flujo anónimo con Storage privado.

## 4. Próxima Tarea a Ejecutar

👉 **Tras la revisión de PR #49, seguir con la Issue [#42](https://github.com/Th3rick2002/cherotrip/issues/42): CRUD de lugares en el panel admin (rama desde `feat/admin-auth` o desde `main` tras el merge).** #40 ya está cerrada.
- Las issues #36–#39 tienen implementación local pendiente de revisión visual/manual y cierre en GitHub tras la validación.
- La limpieza de fotos huérfanas de Storage queda manual hasta que el panel admin defina el flujo.
- Consulta de detalle incluye los campos v3; enlaces externos limitados a HTTP(S), con pestaña segura.
- TypeScript y ESLint verificados; seed QA aplicada y comprobada en Supabase MVP.

## 5. Dónde leer más

- [docs/INDEX.md](../INDEX.md) · Mapa general.
- [docs/specs/expansion-logistica.md](../specs/expansion-logistica.md) · Especificación de Bloque 2 (P3).
- [docs/specs/admin-cms.md](../specs/admin-cms.md) · Especificación del Panel Admin CMS (Bloque 4).
- [docs/ui-ux/screens.md](../ui-ux/screens.md) · Detalles visuales de pantallas públicas y CMS.
- [docs/specs/expansion-logistica.md](../specs/expansion-logistica.md) · Especificación de Bloque 2.
- [docs/ui-ux/screens.md](../ui-ux/screens.md) · Detalles visuales de pantallas.
