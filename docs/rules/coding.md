# Reglas de Código y Arquitectura

Guía de desarrollo para el stack técnico de Cherotrip.

## 1. Stack Tecnológico

- **Framework:** Next.js 15+ (App Router con React Server Components).
- **Lenguaje:** TypeScript estricto (no usar `any`).
- **Estilos:** Tailwind CSS con variables CSS nativas y utilidades de `@tailwindcss/postcss`.
- **UI Primitives:** Radix UI / shadcn/ui minimalista (`components/ui`).
- **Base de Datos:** Supabase (PostgreSQL con RLS habilitado).
- **PWA:** Serwist (`@serwist/next`).
- **Paquetes / Runtime:** Node.js 20+ con `pnpm`.

## 2. Server vs Client Components

- **Server Components por defecto:** Todas las páginas en `app/` y componentes que lean datos son Server Components (`async/await` directo).
- **Directiva `'use client'` restringida:** Usar solo cuando se requiera interactividad del navegador (estado local `useState`, efectos `useEffect`, eventos DOM, hooks de `localStorage`, modal/sheet abiertos).
- **Aislamiento de interactividad:** Mantener los componentes cliente pequeños en las hojas del árbol (`ShareButton`, `BackButton`, `SearchField`, `FavoriteHeart`). No convertir vistas completas a cliente.

## 3. Acceso a Datos (Supabase)

- **Clientes tipados:** Utilizar siempre los clientes de `lib/supabase/`:
  - `server.ts`: Para Server Components y Server Actions (usa `cookies()`).
  - `client.ts`: Para Client Components si es estrictamente necesario.
  - `public.ts`: Para lecturas anónimas sin sesión o SSR estático ligero.
- **Tipos de DB:** Los tipos generados residen en `lib/types/` (ej. `lib/types/listing.ts`). Mantener sincronizados tras cualquier migración.
- **Seguridad RLS:** Nunca deshabilitar Row Level Security en producción. Las tablas públicas solo permiten `SELECT` a filas publicadas y `INSERT` controlado a `anon` en formularios comunitarios.

## 4. Convenciones de Código y Nomenclatura

- **Archivos:**
  - Componentes React: `kebab-case.tsx` o `PascalCase.tsx` según carpeta existente (mantener coherencia con `listing-detail.tsx`, `whatsapp-cta.tsx`).
  - Módulos / Helpers: `kebab-case.ts` (ej. `lib/format.ts`, `lib/whatsapp.ts`).
- **Imports:** Usar alias `@/*` mapeado a la raíz del repositorio (`@/components/...`, `@/lib/...`).
- **Imports no utilizados:** Limpiar imports huérfanos antes de abrir PRs.
- **Documentación de código:** Mantener docstrings en funciones complejas (`formatSchedule`, `buildWhatsAppUrl`). No borrar comentarios funcionales existentes.

## 5. Performance y Mobile-First

- **Imágenes:** Usar siempre `next/image` con dimensiones explícitas o `fill` con `sizes` responsivos adecuados y optimización WebP/AVIF.
- **Enlaces externos:** Todo enlace saliente debe incluir `target="_blank"` y `rel="noopener noreferrer"`.
- **LCP Optimization:** Las imágenes prioritarias del Hero (`CoverImage`) deben marcarse con `priority`.
- **PWA Caching:** La configuración de Service Worker (`app/sw.ts`) cachea activos estáticos y páginas offline (`app/~offline`).
