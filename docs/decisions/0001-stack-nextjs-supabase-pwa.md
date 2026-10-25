# 0001. Stack: Next.js App Router, Supabase y Serwist PWA

- **Fecha:** Octubre 2026
- **Estado:** Aceptado

## Contexto
Cherotrip necesita máxima velocidad de carga en condiciones de conectividad móvil variable en carreteras y playas de El Salvador, indexación SEO de alta calidad para captar turistas por Google, y una experiencia instalable como aplicación nativa sin obligar al usuario a pasar por App Store / Play Store.

## Decisión
1. Adoptar **Next.js 15+ (App Router)** para renderizado en servidor (RSC) y optimización nativa de imágenes y OpenGraph.
2. Utilizar **Supabase (PostgreSQL)** como backend administrado, aprovechando Row Level Security (RLS) para proteger los datos y facilitar la carga mediante migraciones SQL y scripts/Excel.
3. Configurar **Serwist PWA** para service worker, precache de páginas clave y modo offline.
4. Desplegar en **Vercel** para integración continua y distribución edge.

## Consecuencias
- **Positivas:** Cero fricción de descarga en tiendas; SEO excelente; desarrollo rápido en TypeScript unificado frontend/backend.
- **Negativas:** Cuidado requerido con hydration mismatch al interactuar con APIs de navegador (`localStorage`, `navigator.share`).
