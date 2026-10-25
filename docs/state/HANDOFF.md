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

- **Rama activa:** `main` (desplegada automáticamente en Vercel).
- **Fase 1 Core:** 100% implementada y visible en producción.
- **Issues en GitHub:** 15 issues abiertas (5 de soft launch #26–#30, y 10 de expansión v3 #31–#40).

## 4. Próxima Tarea a Ejecutar

👉 **Tomar la Issue [#31](https://github.com/Th3rick2002/cherotrip/issues/31): `[v3] Migración DB: columnas listing + sub_eventos + aportes_comunidad`**
- Crear archivo de migración en `supabase/migrations/` con:
  - Columnas opcionales en `listings`: `link_instagram`, `link_facebook`, `link_tiktok`, `link_taquilla`, `proveedor_taquilla`, `link_alojamiento`, `municipio_busqueda`.
  - Nueva tabla `sub_eventos` con índice en `(listing_id, fecha_dia, hora_inicio)` y RLS de lectura si el listing está publicado.
  - Nueva tabla `aportes_comunidad` con RLS solo `INSERT` para `anon`.
- Actualizar `lib/types/listing.ts`.
- Aplicar vía `pnpm db:push`.

## 5. Dónde leer más

- [docs/INDEX.md](../INDEX.md) · Mapa general.
- [docs/specs/expansion-logistica.md](../specs/expansion-logistica.md) · Especificación de Bloque 2.
- [docs/ui-ux/screens.md](../ui-ux/screens.md) · Detalles visuales de pantallas.
