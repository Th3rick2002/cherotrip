# Esquema de departamentos

## Propósito

Los departamentos son un catálogo geográfico compartido. Sus nombres, slugs y orden se mantienen en PostgreSQL para que filtros, formularios y validaciones usen las mismas opciones y se puedan agregar departamentos sin modificar código.

## Tabla `public.departments`

| Columna | Tipo | Reglas | Uso |
|---|---|---|---|
| `id` | `smallint` | PK, identity | Identificador estable del departamento. |
| `name` | `text` | `NOT NULL`, único, no vacío | Nombre visible, por ejemplo `San Miguel`. |
| `slug` | `text` | `NOT NULL`, único, formato `lowercase-kebab-case` | Valor estable para filtros y URL, por ejemplo `san-miguel`. |
| `is_active` | `boolean` | `NOT NULL`, default `true` | Controla si se ofrece en filtros y nuevos formularios. |
| `sort_order` | `integer` | `NOT NULL`, default `0` | Orden en selectores y pestañas. |
| `created_at` | `timestamptz` | `NOT NULL`, default `now()` | Auditoría básica de creación. |

Catálogo inicial:

| Orden | Nombre | Slug |
|---:|---|---|
| 10 | San Miguel | `san-miguel` |
| 20 | Usulután | `usulutan` |
| 30 | La Unión | `la-union` |
| 40 | Morazán | `morazan` |

## Relaciones

- `public.listings.department_id` es `smallint NOT NULL` y referencia `departments.id` con `ON DELETE RESTRICT`.
- `public.community_submissions.department_id` es `smallint NOT NULL` y referencia `departments.id` con `ON DELETE RESTRICT`.
- Los valores anteriores de texto se migran al ID correspondiente antes de retirar las columnas antiguas. La migración aborta si alguna fila no coincide con el catálogo.
- Los nombres para mostrar se consultan mediante la relación; la aplicación conserva `department` como nombre visible en su modelo de lectura y `department_id` como clave persistente.

```text
departments 1 ─── * listings
departments 1 ─── * community_submissions
```

## Acceso y seguridad

- RLS está habilitado en `public.departments`.
- `anon` y `authenticated` pueden leer filas activas; también pueden resolver el nombre de un departamento inactivo que aún tenga listings publicados.
- Los administradores pueden leer el catálogo completo y mantenerlo; las políticas de escritura requieren `public.is_admin()`.
- Un departamento solo se puede borrar si no tiene listings ni aportes asociados. Para retirar una opción sin perder historial, usa `is_active = false`.
- El formulario comunitario recibe únicamente `department_id`; el permiso anónimo de inserción sigue limitado a las columnas explícitamente enumeradas y la política exige que el departamento esté activo.
- `save_admin_listing` comprueba que el departamento exista y esté activo antes de guardar.

## Consultas de la aplicación

- Home y Explorar obtienen departamentos activos del catálogo y filtran listings por `department_id`.
- Formularios públicos y administrativos obtienen las opciones desde Supabase.
- Los filtros usan `slug` en la URL; los nombres anteriores continúan resolviéndose durante la transición para no romper enlaces guardados.

## Migración

La migración `20261030145125_normalize_departments_catalog.sql` crea el catálogo, carga los cuatro registros iniciales, rellena ambas claves foráneas, aplica restricciones y actualiza la función de escritura del CMS. No elimina listings, aportes, cuentas ni registros administrativos. Debe aplicarse primero en el proyecto de Supabase correspondiente antes de desplegar el código que la usa.

Para añadir un departamento, inserta una fila con un `name`, `slug` único, `is_active = true` y `sort_order`; la aplicación lo incluirá automáticamente en las opciones. Para ocultarlo sin borrar su historial, márcalo inactivo.

```sql
insert into public.departments (name, slug, sort_order)
values ('Ahuachapán', 'ahuachapan', 50);
```
