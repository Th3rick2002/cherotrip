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

- **Rama activa:** `feat/MigrationDB` (o `main`).
- **Fase 1 Core:** 100% implementada y visible en producción.
- **Fase 2 / v3:**
  - Issue #31 completada y cerrada (migración DB v3 en remoto).
  - Issue #32 descartada y cerrada (reemplazada por CMS).
  - Issues #33–#35 implementadas y listas para cierre en GitHub; sus fixtures QA están publicados en Supabase MVP.

## 4. Próxima Tarea a Ejecutar

👉 **Continuar con la Issue [#36](https://github.com/Th3rick2002/cherotrip/issues/36): `[v3][UI] EventAgenda — agenda multi-día con tabs y timeline para sub_events`**
- Issues #33–#35 implementadas localmente: redes oficiales, banner de alojamiento y CTA dinámico.
- Consulta de detalle incluye los campos v3; enlaces externos limitados a HTTP(S), con pestaña segura.
- TypeScript y ESLint verificados; seed QA aplicada y comprobada en Supabase MVP.

## 5. Dónde leer más

- [docs/INDEX.md](../INDEX.md) · Mapa general.
- [docs/specs/expansion-logistica.md](../specs/expansion-logistica.md) · Especificación de Bloque 2 (P3).
- [docs/specs/admin-cms.md](../specs/admin-cms.md) · Especificación del Panel Admin CMS (Bloque 4).
- [docs/ui-ux/screens.md](../ui-ux/screens.md) · Detalles visuales de pantallas públicas y CMS.
- [docs/specs/expansion-logistica.md](../specs/expansion-logistica.md) · Especificación de Bloque 2.
- [docs/ui-ux/screens.md](../ui-ux/screens.md) · Detalles visuales de pantallas.
