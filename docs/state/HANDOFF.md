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

# Aplicar migraciones y seed
pnpm db:push

# Regenerar tipos TypeScript
pnpm db:types
```

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
  - Issues activas en GitHub: 17 abiertas (5 soft launch, 8 v3 público, 4 CMS admin).

## 4. Próxima Tarea a Ejecutar

👉 **Tomar la Issue [#33](https://github.com/Th3rick2002/cherotrip/issues/33): `[v3][UI] SocialLinks — redes oficiales en ficha de detalle` (Bloque 2.1)**
- Crear el componente `SocialLinks.tsx` en `components/listings/`.
- Renderizar condicionalmente iconos minimalistas para Instagram, Facebook y TikTok oficiales (usando los nuevos campos de la migración #31).
- Integrar en `listing-detail.tsx` debajo de la descripción general, sin romper la cuadrícula logística ni el CTA sticky.

## 5. Dónde leer más

- [docs/INDEX.md](../INDEX.md) · Mapa general.
- [docs/specs/expansion-logistica.md](../specs/expansion-logistica.md) · Especificación de Bloque 2 (P3).
- [docs/specs/admin-cms.md](../specs/admin-cms.md) · Especificación del Panel Admin CMS (Bloque 4).
- [docs/ui-ux/screens.md](../ui-ux/screens.md) · Detalles visuales de pantallas públicas y CMS.
- [docs/specs/expansion-logistica.md](../specs/expansion-logistica.md) · Especificación de Bloque 2.
- [docs/ui-ux/screens.md](../ui-ux/screens.md) · Detalles visuales de pantallas.
