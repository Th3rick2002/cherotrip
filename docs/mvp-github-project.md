# Cherotrip MVP — Backlog para GitHub Project

**Versión:** 2.0  
**Fuente de diseño:** `CherpTrip.fig` → página **«02 · Nuevo diseño (MVP RF)»** (no usar «01 · Original»).  
**Referencia P3 conversión:** `Gemini_Generated_Image_3xp4x43xp4x43xp4.png` (completar frame `P3/Detalle` del `.fig` para que coincida).  
**Stack:** Next.js (PWA) · Tailwind · Supabase · Vercel  
**Exclusiones MVP:** sin Auth/Login, sin perfiles/comentarios/UGC, sin mapas Google/Mapbox.

---

## Cómo importar a GitHub Project

1. Crear un Project (Board) con columnas sugeridas: `Backlog` · `Ready` · `In Progress` · `Review` · `Done`.
2. Crear cada issue con el título y el cuerpo de las secciones siguientes (copiar/pegar).
3. Etiquetas sugeridas (crearlas antes):

| Label | Uso |
|---|---|
| `phase-0` `phase-1` `phase-2` `phase-3` `phase-4` `phase-5` | Fase |
| `type:foundation` `type:data` `type:ui` `type:feature` `type:seo` `type:pwa` `type:qa` `type:design` | Tipo |
| `priority:P0` `priority:P1` `priority:P2` | Prioridad |
| `screen:home` `screen:explorar` `screen:detalle` `screen:menu` | Pantalla |
| `blocked` | Dependencia abierta |

4. Campos custom opcionales: **Assignee role** (`A` datos · `B` UI kit · `C` listados · `D` detalle/PWA), **Estimate** (días).

---

## Epic overview

| Epic | Objetivo | Issues |
|---|---|---|
| E0 Alineación | Congelar diseño/alcance | #1–#3 |
| E1 Fundaciones | Tokens, shell, schema | #4–#9 |
| E2 Directorio | Home + Explorar + queries | #10–#15 |
| E3 Conversión | Detalle + WhatsApp + páginas estáticas | #16–#21 |
| E4 PWA / Perf / SEO | Instalable, LCP, OG | #22–#25 |
| E5 Soft launch | Contenido + smoke | #26–#28 |

---

## E0 — Alineación

### Issue #1 — Congelar P3: alinear Figma página 02 con referencia Gemini

**Labels:** `phase-0` `type:design` `priority:P0` `screen:detalle`

**Body:**

```md
## Contexto
La fuente de verdad de UI es `CherpTrip.fig` → **02 · Nuevo diseño (MVP RF)**.
El frame `P3/Detalle` está incompleto vs la imagen Gemini (grid logística 2×2, alerta, CTA WhatsApp).

## Objetivo
Actualizar `P3/Detalle` en la página 02 para que coincida con `Gemini_Generated_Image_3xp4x43xp4x43xp4.png`.

## Alcance
- [ ] Hero full-bleed + Atrás + Compartir
- [ ] Título + badge verificado + ubicación + tags
- [ ] Grid 2×2: Logística / Precio / Transporte / Extras
- [ ] Descripción
- [ ] Caja de restricciones/alerta (si aplica)
- [ ] CTA fijo «Contactar por WhatsApp» + subtítulo lead
- [ ] Confirmar que **no** se usa nada de la página 01 (Mapa, Perfil, Crear, Splash)

## Criterio de aceptación
- Un solo frame P3 en página 02 sirve como spec de implementación.
- Página 01 marcada como “legacy / no MVP” en el archivo o en docs.

## Fuera de alcance
Implementación en código.
```

---

### Issue #2 — Definir taxonomía MVP (categorías, departamentos, slug)

**Labels:** `phase-0` `type:foundation` `priority:P0`

**Body:**

```md
## Objetivo
Cerrar vocabulario de filtrado y URLs antes del schema.

## Decisiones a documentar
- [ ] Categorías v1 (mínimo: Aventura, Playa, Gastronomía; ¿Montaña/Senderismo como tag o categoría?)
- [ ] Departamentos del oriente (San Miguel, Morazán, Usulután, La Unión, …)
- [ ] Convención de slug (`senderismo-cerro-cacahuatique`)
- [ ] Rutas: `/evento/[slug]` y `/lugar/[slug]` vs `/listing/[slug]`

## Entregable
Tabla corta en este issue o en `docs/` con valores oficiales.

## Criterio de aceptación
Equipo usa los mismos nombres en Figma chips, seed SQL y UI.
```

---

### Issue #3 — Seed de contenido verificado (8–12 listings)

**Labels:** `phase-0` `type:data` `priority:P1`

**Depends on:** #2

**Body:**

```md
## Objetivo
Tener datos reales/realistas para demos y LCP (imágenes reales).

## Alcance
- [ ] 4–6 eventos con `starts_at` próximos
- [ ] 4–6 lugares destacados
- [ ] Teléfono WhatsApp de prueba por listing
- [ ] Cover images en Storage (o URLs temporales acordadas)
- [ ] Campos de logística, transporte, precio, tags, `verified=true`

## Criterio de aceptación
Home y Explorar se pueden poblar sin inventar datos en el frontend.
```

---

## E1 — Fundaciones

### Issue #4 — Tokens de diseño «Océano y Arena» + tipografía

**Labels:** `phase-1` `type:ui` `priority:P0`

**Body:**

```md
## Fuente
Página 02 · frame `MVP/00 Paleta` + variables `MVP/Color *`.

## Tokens
- Fondo `#F8F9FA` · Superficie `#FFFFFF`
- Marca `#023E8A` · Primario `#0077B6`
- Acento `#F4A261` · Acento fuerte `#E76F51`
- WhatsApp CTA `#25D366` (solo CTA)
- Texto `#333333` · secundario/muted según variables MVP
- Radius / spacing según colecciones MVP
- Font: **Plus Jakarta Sans**

## Alcance
- [ ] Mapear a CSS variables / `@theme` en `globals.css`
- [ ] Cargar fuente (next/font)
- [ ] Quitar look default del template Next

## Criterio de aceptación
Colores y tipo coinciden visualmente con página 02 (no con página 01).
```

---

### Issue #5 — Kit de componentes UI (map Figma página 02)

**Labels:** `phase-1` `type:ui` `priority:P0`

**Depends on:** #4

**Body:**

```md
## Componentes (nombres Figma → React)
- [ ] `TopBar` (`MVP/TopBar`)
- [ ] `SearchField` (`MVP/SearchField`)
- [ ] `CategoryChip` / `FilterChip`
- [ ] `EventCard` (`MVP/Card/Event`)
- [ ] `PlaceCard` (`MVP/Card/Place`)
- [ ] `DirectoryCard` (`MVP/Card/Directory`)
- [ ] `InfoBlock` (`MVP/InfoBlock`)
- [ ] `WhatsAppButton` (`MVP/Button/WhatsApp`)
- [ ] Iconos equivalentes (Lucide ≈ set MVP/Icon)

## Criterio de aceptación
Story/uso aislado o página sandbox muestra cada pieza alineada a página 02.
Sin cards decorativas fuera del patrón Figma.
```

---

### Issue #6 — Shell de app: layout, TopBar y SideDrawer (P4)

**Labels:** `phase-1` `type:feature` `priority:P0` `screen:menu`

**Depends on:** #5

**Body:**

```md
## Pantalla
P4 · Menú lateral (página 02).

## Alcance
- [ ] Layout mobile-first compartido
- [ ] TopBar con hamburguesa + wordmark «Cherotrip»
- [ ] Drawer: Inicio, Explorar, Sobre Cherotrip, Contacto/Soporte
- [ ] Estado activo del ítem
- [ ] Cerrar con X / overlay
- [ ] **No** incluir Perfil, Guardados, Notificaciones

## Criterio de aceptación
Navegación entre rutas stub funciona en móvil.
```

---

### Issue #7 — Schema Supabase: `listings` (+ categorías)

**Labels:** `phase-1` `type:data` `priority:P0`

**Depends on:** #2

**Body:**

```md
## Modelo propuesto (unificado)
Tabla `listings`:
- identidad: `id`, `slug`, `type` (`event`|`place`), `title`, `description`
- ubicación: `department_id` → catálogo `departments`, `meeting_point`
- clasificación: `categories[]` / FK, `tags[]`
- media: `cover_image_url`
- logística: `starts_at`, `ends_at`, `schedule_text`
- dinero: `price_from`, `payment_methods[]`
- acceso: `transport_info`, `accessibility_notes`, `extras` jsonb, `restrictions`
- lead: `whatsapp_phone`
- confianza: `verified` bool
- discovery: `featured` bool, `published_at`, `is_published`

## Alcance
- [ ] Migración SQL
- [ ] Índices: `starts_at`, `department_id`, GIN en categorías/tags, unique `slug`
- [ ] RLS: SELECT público solo `is_published = true`; sin write desde anon
- [ ] Tipos TypeScript generados o manuales

## Criterio de aceptación
Query de listado publicado funciona desde cliente server de Supabase.
```

---

### Issue #8 — Storage covers + `next/image` remotePatterns

**Labels:** `phase-1` `type:data` `priority:P1`

**Depends on:** #7

**Body:**

```md
## Alcance
- [ ] Bucket `covers` (público read)
- [ ] Política: upload solo service role / dashboard (no UGC frontend)
- [ ] Configurar `images.remotePatterns` para Supabase Storage
- [ ] Convención de path: `covers/{slug}.webp` (o similar)

## Criterio de aceptación
`<Image>` renderiza una cover de seed sin error.
```

---

### Issue #9 — Rutas stub del MVP

**Labels:** `phase-1` `type:foundation` `priority:P1`

**Depends on:** #6

**Body:**

```md
## Rutas
- [ ] `/` Home
- [ ] `/explorar`
- [ ] `/evento/[slug]` y/o `/lugar/[slug]`
- [ ] `/sobre`
- [ ] `/contacto`

## Criterio de aceptación
Links del drawer resuelven sin 404. Páginas pueden ser placeholder.
```

---

## E2 — Motor de directorio

### Issue #10 — Queries: próximos, destacados, filtrado

**Labels:** `phase-2` `type:data` `priority:P0`

**Depends on:** #7 `#3`

**Body:**

```md
## API de datos (server)
- [ ] `getUpcomingEvents(limit)` — orden `starts_at ASC` (proximidad)
- [ ] `getFeaturedPlaces(limit)`
- [ ] `searchListings({ q, category, department, page })`
- [ ] Contador de resultados

## Criterio de aceptación
Filtros combinables; sin N+1; tipado seguro.
```

---

### Issue #11 — P1 Home / Bienvenida

**Labels:** `phase-2` `type:feature` `priority:P0` `screen:home`

**Depends on:** #5 `#10` `#9`

**Body:**

```md
## Spec UI
Frame `P1/Home` en página 02.

## Alcance
- [ ] Headline «Descubre el oriente» + subtítulo verificado
- [ ] SearchField → navega a `/explorar?q=`
- [ ] Sección «Eventos próximos» + link «Ver todos»
- [ ] Carrusel horizontal `EventCard`
- [ ] Sección «Lugares destacados» + link «Explorar»
- [ ] Carrusel `PlaceCard`
- [ ] (Opcional acordado) chips de categoría rápida → `/explorar?categoria=`

## Criterio de aceptación
Paridad visual razonable con P1 página 02; datos desde Supabase.
```

---

### Issue #12 — P2 Explorar / Directorio

**Labels:** `phase-2` `type:feature` `priority:P0` `screen:explorar`

**Depends on:** #10 `#5`

**Body:**

```md
## Spec UI
Frame `P2/Explorar` en página 02.

## Alcance
- [ ] Título + subtítulo directorio verificado
- [ ] SearchField
- [ ] Chips horizontales (categoría / departamento)
- [ ] Contador «N resultados»
- [ ] Lista vertical `DirectoryCard` (precio + transporte en meta)
- [ ] Estado vacío
- [ ] Sync filtros ↔ query string (`?categoria=&departamento=&q=`)

## Criterio de aceptación
Filtrar/refrescar mantiene URL compartible; click card → detalle.
```

---

### Issue #13 — DirectoryCard: precio + accesibilidad en lista

**Labels:** `phase-2` `type:ui` `priority:P1` `screen:explorar`

**Depends on:** #5 `#7`

**Body:**

```md
## Contexto
RF prioriza precio y transporte ya en el directorio (no solo en detalle).

## Alcance
- [ ] Línea meta: «Desde $X · Acceso…» como en `MVP/Card/Directory`
- [ ] Fallback si no hay precio («Entrada libre» / «Consultar»)

## Criterio de aceptación
Cards de Explorar muestran logística mínima sin abrir detalle.
```

---

### Issue #14 — Empty / loading / error states listados

**Labels:** `phase-2` `type:ui` `priority:P2`

**Depends on:** #11 `#12`

**Body:**

```md
## Alcance
- [ ] Skeleton o placeholder de cards
- [ ] Vacío: «No hay resultados» + limpiar filtros
- [ ] Error de red amigable

## Criterio de aceptación
Ninguna pantalla se queda en blanco silencioso.
```

---

### Issue #15 — Click-through Home/Explorar → Detalle

**Labels:** `phase-2` `type:feature` `priority:P0`

**Depends on:** #11 `#12` `#9`

**Body:**

```md
## Alcance
- [ ] `EventCard` / `PlaceCard` / `DirectoryCard` navegan al slug correcto
- [ ] Prefetch opcional en viewport

## Criterio de aceptación
Flujo descubrimiento → ficha funciona end-to-end (aunque P3 aún sea stub).
```

---

## E3 — Conversión (core)

### Issue #16 — P3 Ficha de detalle (UI completa)

**Labels:** `phase-3` `type:feature` `priority:P0` `screen:detalle`

**Depends on:** #1 `#5` `#7`

**Body:**

```md
## Spec
Página 02 `P3/Detalle` **alineado a Gemini** (issue #1).

## Bloques
- [ ] Hero Image full-bleed (`next/image` priority)
- [ ] Atrás + Compartir
- [ ] Título + VerifiedBadge + ubicación
- [ ] Tags/categorías
- [ ] Grid logística 2×2 (fecha, precio/pagos, transporte, extras)
- [ ] Descripción
- [ ] Alerta/restricciones si hay dato
- [ ] CTA sticky WhatsApp (issue #17)

## Variantes
- Evento: fechas/horarios concretos
- Lugar: «Todo el año» / `schedule_text`

## Criterio de aceptación
Paridad con spec congelada; mobile 390-width usable; sin mapa.
```

---

### Issue #17 — Generación de lead WhatsApp (`wa.me`)

**Labels:** `phase-3` `type:feature` `priority:P0` `screen:detalle`

**Depends on:** #7

**Body:**

```md
## Objetivo
Único mecanismo de monetización/lead del MVP.

## Alcance
- [ ] Helper `buildWhatsAppUrl({ phone, title, slug })`
- [ ] Mensaje prearmado que identifique origen Cherotrip
- [ ] Botón verde solo con token WhatsApp
- [ ] Subcopy: «Te conectamos por WhatsApp · Mensaje prearmado Cherotrip»
- [ ] `target="_blank"` + `rel="noopener noreferrer"`

## Ejemplo de mensaje
`Hola, vengo de Cherotrip. Me interesa "{title}" (https://…/{tipo}/{slug}). ¿Me dan más info?`

## Criterio de aceptación
En móvil abre WhatsApp con texto precargado al número del listing.
```

---

### Issue #18 — Compartir enlace (Web Share + fallback)

**Labels:** `phase-3` `type:feature` `priority:P1` `screen:detalle`

**Depends on:** #16

**Body:**

```md
## Alcance
- [ ] Botón Compartir en hero
- [ ] `navigator.share` cuando exista
- [ ] Fallback: copiar URL + toast/feedback

## Criterio de aceptación
Usuario puede compartir URL canónica del detalle.
```

---

### Issue #19 — fetch listing por slug + 404

**Labels:** `phase-3` `type:data` `priority:P0` `screen:detalle`

**Depends on:** #7

**Body:**

```md
## Alcance
- [ ] `getListingBySlug(slug)`
- [ ] Solo publicados
- [ ] `notFound()` si no existe
- [ ] Server Component para el contenido estático del detalle

## Criterio de aceptación
Slug inválido → 404; slug válido → datos completos para P3.
```

---

### Issue #20 — Página Sobre Cherotrip

**Labels:** `phase-3` `type:feature` `priority:P2`

**Depends on:** #6

**Body:**

```md
## Alcance
- [ ] Copy corto: misión + “información verificada por el equipo”
- [ ] Link desde drawer
- [ ] Estilo tokens página 02 (sin inventar nueva marca)

## Criterio de aceptación
Ruta `/sobre` accesible desde P4.
```

---

### Issue #21 — Página Contacto / Soporte

**Labels:** `phase-3` `type:feature` `priority:P2`

**Depends on:** #17

**Body:**

```md
## Alcance
- [ ] Canal de soporte (WhatsApp Cherotrip u otro acordado)
- [ ] Reusar patrón CTA verde si aplica
- [ ] Link desde drawer

## Criterio de aceptación
Usuario llega a soporte sin auth.
```

---

## E4 — PWA, SEO, rendimiento

### Issue #22 — SEO programático + Open Graph en detalle

**Labels:** `phase-4` `type:seo` `priority:P0` `screen:detalle`

**Depends on:** #16 `#19`

**Body:**

```md
## Alcance
- [ ] `generateMetadata` en rutas de detalle
- [ ] `title`, `description`, `openGraph.images` = cover
- [ ] Twitter card básica
- [ ] URL canónica

## Criterio de aceptación
Preview al pegar link en WhatsApp/Redes muestra título + portada.
```

---

### Issue #23 — PWA instalable

**Labels:** `phase-4` `type:pwa` `priority:P0`

**Depends on:** #11 `#12` `#16`

**Body:**

```md
## Alcance
- [ ] `manifest.webmanifest` (nombre Cherotrip, colores marca)
- [ ] Iconos 192/512
- [ ] Service worker (Serwist o next-pwa compatible con Next 16)
- [ ] Estrategia cache razonable (app shell + network-first datos)

## Criterio de aceptación
Chrome Android: «Instalar app». No requiere login.
```

---

### Issue #24 — Performance mobile (LCP &lt; 2.5s)

**Labels:** `phase-4` `type:qa` `priority:P0`

**Depends on:** #8 `#11` `#16`

**Body:**

```md
## Alcance
- [ ] Hero detalle con `priority`
- [ ] Covers optimizadas (WebP/AVIF vía Next Image)
- [ ] Evitar JS innecesario en Home/Explorar (Server Components)
- [ ] Medir Lighthouse móvil en Home y Detalle

## Criterio de aceptación
LCP &lt; 2.5s en perfil móvil de Lighthouse (conexión/lab acordada) en páginas clave.
```

---

### Issue #25 — Checklist exclusiones MVP

**Labels:** `phase-4` `type:qa` `priority:P0`

**Body:**

```md
## Verificar que NO existe
- [ ] Login / Registro / sesión de usuario
- [ ] Perfil social, comentarios, guardados, notificaciones
- [ ] Upload de imágenes desde el frontend
- [ ] Mapa interactivo Google/Mapbox

## Criterio de aceptación
Issue cerrado con evidencia (rutas + UI) de que no están presentes.
```

---

## E5 — Soft launch

### Issue #26 — Contenido producción + teléfonos reales

**Labels:** `phase-5` `type:data` `priority:P0`

**Depends on:** #3 `#17`

**Body:**

```md
## Alcance
- [ ] Publicar listings verificados en prod
- [ ] WhatsApp reales de comercios/aliados
- [ ] Revisar ortografía, precios, transporte

## Criterio de aceptación
Cada listing publicado tiene lead funcional.
```

---

### Issue #27 — Smoke test móvil (5 flujos)

**Labels:** `phase-5` `type:qa` `priority:P0`

**Depends on:** #11 `#12` `#16` `#17` `#23`

**Body:**

```md
## Flujos
1. Home → evento próximo → WhatsApp
2. Explorar → filtrar categoría → abrir lugar → compartir
3. Search por texto → resultado → detalle
4. Drawer → Sobre / Contacto
5. Instalar PWA → abrir detalle offline/online según estrategia

## Criterio de aceptación
Checklist pasado en Android real (y iOS Safari en lo aplicable).
```

---

### Issue #28 — Deploy Vercel + env Supabase

**Labels:** `phase-5` `type:foundation` `priority:P0`

**Body:**

```md
## Alcance
- [ ] Proyecto Vercel conectado
- [ ] Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Dominio / preview
- [ ] Verificar OG images en URL pública

## Criterio de aceptación
URL producción sirve Home, Explorar y Detalle con datos reales.
```

---

## Orden sugerido en el board

```text
Ready ahora:
  #1 #2 #4 #7

Luego:
  #3 #5 #8 #9 #6

Directorio:
  #10 → #11 #12 #13 #14 #15

Conversión:
  #19 #16 #17 #18 #20 #21

Cierre:
  #22 #23 #24 #25 → #26 #27 #28
```

## Dependencias (diagrama corto)

```text
#2 ─┬─► #3 ─► #10 ─┬─► #11 ─┐
    │              └─► #12 ─┼─► #15 ─► #16 ─► #17/#18/#22
    └─► #7 ─► #8/#19 ───────┘
#4 ─► #5 ─► #6/#9
#1 ─► #16
#23 + #24 + #25 ─► #27 ─► #28
```

---

## Notas para el Project

- **Diseño:** solo página **02 · Nuevo diseño (MVP RF)**. Página 01 es legacy (mapa, perfil, crear publicación, splash) y no genera issues de implementación.
- **P3:** hasta cerrar #1, los devs usan Gemini + este backlog como spec de conversión.
- **Roles orientativos:** A=#7/#8/#10/#19/#26 · B=#4/#5/#13/#14 · C=#11/#12/#15/#20 · D=#16/#17/#18/#22/#23/#24.
- Estimación total orientativa: **~2–2.5 semanas** con 4 personas en paralelo.
