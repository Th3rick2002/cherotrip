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

- **Rama activa:** `feat/detail-contact-cta-redesign`, creada desde `feat/MigrationDB` después del commit `8340ef2`.
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

👉 **Validar visualmente `/aportar` y continuar con la Issue [#40](https://github.com/Th3rick2002/cherotrip/issues/40): QA integral del MVP v3.**
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
