# Supabase CLI — setup local

Proyecto ref: `xrnffirpxbnslwnvudpu`

```bash
# 1) Login (abre browser o pega token)
pnpm db:login

# 2) Vincular proyecto remoto
pnpm db:link
# Si pide DB password: Dashboard → Project Settings → Database

# 3) Aplicar migraciones + seed
pnpm db:push

# 4) (Opcional) regenerar tipos
pnpm db:types
```

## Agregar categorías después

En Table Editor → `categories`, inserta filas con `slug`, `name`, `icon`, `sort_order`.
La UI las lee dinámicamente; no hace falta redeploy para listarlas en chips.
