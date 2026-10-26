# Supabase CLI — setup local

Proyecto ref: `xrnffirpxbnslwnvudpu`

```bash
# 1) Login (abre browser o pega token)
pnpm db:login

# 2) Vincular proyecto remoto
pnpm db:link
# Si pide DB password: Dashboard → Project Settings → Database

# 3) Aplicar migraciones al proyecto remoto
pnpm db:push

# 4) (Opcional) regenerar tipos
pnpm db:types
```

## Seed de prueba

`supabase/seed.sql` agrega tres listings identificados como `[QA]` para revisar las funciones v3
de detalle. `ON CONFLICT (slug) DO NOTHING` evita modificar listings existentes. Los tres están
publicados para que se puedan abrir desde las rutas públicas; no son datos turísticos reales.

Para cargarla en el proyecto remoto ya vinculado, ejecuta solo el SQL de la seed:

```bash
pnpm exec supabase db query --linked --file supabase/seed.sql
```

Este comando no aplica migraciones. Confirma el proyecto vinculado antes de ejecutarlo; estos
fixtures son visibles en el sitio conectado al proyecto.

Para cargarla localmente, Supabase la ejecuta tras las migraciones con `pnpm exec supabase start`
en el primer arranque, o con `pnpm exec supabase db reset`. `db reset` reconstruye y borra la base
local antes de recrearla. `pnpm db:push` aplica migraciones remotas y no ejecuta esta seed.

Rutas para revisar los fixtures:

- `/evento/qa-v3-ticket-social-accommodation`: taquilla, tres redes y URL directa de alojamiento
  (la URL directa debe tener prioridad frente a la consulta).
- `/lugar/qa-v3-airbnb-search-whatsapp`: búsqueda Airbnb, una red y CTA de WhatsApp.
- `/lugar/qa-v3-no-optional-links`: secciones opcionales ocultas y CTA de WhatsApp.

## Agregar categorías después

En Table Editor → `categories`, inserta filas con `slug`, `name`, `icon`, `sort_order`.
La UI las lee dinámicamente; no hace falta redeploy para listarlas en chips.
