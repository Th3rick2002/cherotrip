# Variables de entorno en Vercel

Además de las de Supabase, define:

```
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
```

Sirve para:
- `metadataBase` / Open Graph absolutos
- `sitemap.xml` y `robots.txt`
- URLs canónicas al compartir

El build de Vercel usa `pnpm build` → `next build && serwist build` (PWA).
