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

## Cuentas del panel admin (`/admin`)

El registro público está desactivado. Para dar acceso a alguien:

1. **Crear la cuenta:** Dashboard → Authentication → Users → *Add user* (correo y contraseña,
   marcando *Auto Confirm User*), o *Invite user*.
2. **Hacerla admin:** en el SQL Editor, con el correo de la cuenta:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'persona@ejemplo.com';
   ```

Para quitar el acceso, borra su fila de `public.admin_users`. Una cuenta que existe pero no está
en esa tabla puede iniciar sesión en Supabase, pero el panel la rechaza.

En producción, confirma en Dashboard → Authentication → Sign In / Providers que *Allow new users
to sign up* esté desactivado. `supabase/config.toml` solo aplica a la base local.

## Portadas (`listing-covers`)

La migración `20261026220000_add_listing_covers_bucket.sql` crea el bucket público
`listing-covers`. Cualquiera puede ver una portada por su URL, pero solo los admins de
`public.admin_users` pueden subir, reemplazar, listar o borrar archivos. Se administran desde
`/admin/portadas`.

## Seed de prueba

`supabase/seed.sql` agrega cuatro listings identificados como `[QA]` para revisar las funciones v3
de detalle y social-light. `ON CONFLICT (slug) DO NOTHING` evita modificar listings existentes;
los sub-eventos también se insertan solo si aún no existen. Los fixtures están publicados para
abrirse desde las rutas públicas y no son datos turísticos reales. Consérvalos durante la revisión
visual/manual y elimínalos solo cuando el usuario confirme que terminó.

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
- `/evento/qa-v3-event-agenda`: evento de dos días con actividades en dos fechas, horas, categorías y sedes.
- `/lugar/qa-v3-airbnb-search-whatsapp`: búsqueda Airbnb, una red y CTA de WhatsApp.
- `/lugar/qa-v3-no-optional-links`: secciones opcionales ocultas y CTA de WhatsApp.

## Agregar categorías después

En Table Editor → `categories`, inserta filas con `slug`, `name`, `icon`, `sort_order`.
La UI las lee dinámicamente; no hace falta redeploy para listarlas en chips.
