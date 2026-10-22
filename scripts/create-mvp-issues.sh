#!/usr/bin/env bash
# Crea los 28 issues del MVP en el repo actual (gh).
set -euo pipefail

create_issue() {
  local title="$1"
  local labels="$2"
  local body="$3"
  echo "→ $title"
  gh issue create --title "$title" --label "$labels" --body "$body" >/dev/null
}

create_issue \
  "Congelar P3: alinear Figma página 02 con referencia Gemini" \
  "phase-0,type:design,priority:P0,screen:detalle" \
  "$(cat <<'EOF'
## Contexto
La fuente de verdad de UI es `CherpTrip.fig` → **02 · Nuevo diseño (MVP RF)**.
El frame `P3/Detalle` está incompleto vs la imagen Gemini (grid logística 2×2, alerta, CTA WhatsApp).

## Objetivo
Actualizar `P3/Detalle` en la página 02 para que coincida con `docs/design` / referencia Gemini.

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
- Página 01 marcada como “legacy / no MVP”.

## Fuera de alcance
Implementación en código.

**Backlog:** `docs/mvp-github-project.md` · Issue #1
EOF
)"

create_issue \
  "Definir taxonomía MVP (categorías, departamentos, slug)" \
  "phase-0,type:foundation,priority:P0" \
  "$(cat <<'EOF'
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

**Backlog:** `docs/mvp-github-project.md` · Issue #2
EOF
)"

create_issue \
  "Seed de contenido verificado (8–12 listings)" \
  "phase-0,type:data,priority:P1" \
  "$(cat <<'EOF'
## Objetivo
Tener datos reales/realistas para demos y LCP (imágenes reales).

## Depends on
Taxonomía MVP (#2)

## Alcance
- [ ] 4–6 eventos con `starts_at` próximos
- [ ] 4–6 lugares destacados
- [ ] Teléfono WhatsApp de prueba por listing
- [ ] Cover images en Storage (o URLs temporales acordadas)
- [ ] Campos de logística, transporte, precio, tags, `verified=true`

## Criterio de aceptación
Home y Explorar se pueden poblar sin inventar datos en el frontend.

**Backlog:** `docs/mvp-github-project.md` · Issue #3
EOF
)"

create_issue \
  "Tokens de diseño «Océano y Arena» + tipografía" \
  "phase-1,type:ui,priority:P0" \
  "$(cat <<'EOF'
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

**Backlog:** `docs/mvp-github-project.md` · Issue #4
EOF
)"

create_issue \
  "Kit de componentes UI (map Figma página 02)" \
  "phase-1,type:ui,priority:P0" \
  "$(cat <<'EOF'
## Depends on
Tokens Océano y Arena (#4)

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

**Backlog:** `docs/mvp-github-project.md` · Issue #5
EOF
)"

create_issue \
  "Shell de app: layout, TopBar y SideDrawer (P4)" \
  "phase-1,type:feature,priority:P0,screen:menu" \
  "$(cat <<'EOF'
## Pantalla
P4 · Menú lateral (página 02).

## Depends on
Kit de componentes (#5)

## Alcance
- [ ] Layout mobile-first compartido
- [ ] TopBar con hamburguesa + wordmark «Cherotrip»
- [ ] Drawer: Inicio, Explorar, Sobre Cherotrip, Contacto/Soporte
- [ ] Estado activo del ítem
- [ ] Cerrar con X / overlay
- [ ] **No** incluir Perfil, Guardados, Notificaciones

## Criterio de aceptación
Navegación entre rutas stub funciona en móvil.

**Backlog:** `docs/mvp-github-project.md` · Issue #6
EOF
)"

create_issue \
  "Schema Supabase: listings (+ categorías)" \
  "phase-1,type:data,priority:P0" \
  "$(cat <<'EOF'
## Depends on
Taxonomía MVP (#2)

## Modelo propuesto (unificado)
Tabla `listings`:
- identidad: `id`, `slug`, `type` (`event`|`place`), `title`, `description`
- ubicación: `department`, `meeting_point`
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
- [ ] Índices: `starts_at`, `department`, GIN en categorías/tags, unique `slug`
- [ ] RLS: SELECT público solo `is_published = true`; sin write desde anon
- [ ] Tipos TypeScript generados o manuales

## Criterio de aceptación
Query de listado publicado funciona desde cliente server de Supabase.

**Backlog:** `docs/mvp-github-project.md` · Issue #7
EOF
)"

create_issue \
  "Storage covers + next/image remotePatterns" \
  "phase-1,type:data,priority:P1" \
  "$(cat <<'EOF'
## Depends on
Schema listings (#7)

## Alcance
- [ ] Bucket `covers` (público read)
- [ ] Política: upload solo service role / dashboard (no UGC frontend)
- [ ] Configurar `images.remotePatterns` para Supabase Storage
- [ ] Convención de path: `covers/{slug}.webp` (o similar)

## Criterio de aceptación
`<Image>` renderiza una cover de seed sin error.

**Backlog:** `docs/mvp-github-project.md` · Issue #8
EOF
)"

create_issue \
  "Rutas stub del MVP" \
  "phase-1,type:foundation,priority:P1" \
  "$(cat <<'EOF'
## Depends on
Shell TopBar/Drawer (#6)

## Rutas
- [ ] `/` Home
- [ ] `/explorar`
- [ ] `/evento/[slug]` y/o `/lugar/[slug]`
- [ ] `/sobre`
- [ ] `/contacto`

## Criterio de aceptación
Links del drawer resuelven sin 404. Páginas pueden ser placeholder.

**Backlog:** `docs/mvp-github-project.md` · Issue #9
EOF
)"

create_issue \
  "Queries: próximos, destacados, filtrado" \
  "phase-2,type:data,priority:P0" \
  "$(cat <<'EOF'
## Depends on
Schema (#7), Seed (#3)

## API de datos (server)
- [ ] `getUpcomingEvents(limit)` — orden `starts_at ASC` (proximidad)
- [ ] `getFeaturedPlaces(limit)`
- [ ] `searchListings({ q, category, department, page })`
- [ ] Contador de resultados

## Criterio de aceptación
Filtros combinables; sin N+1; tipado seguro.

**Backlog:** `docs/mvp-github-project.md` · Issue #10
EOF
)"

create_issue \
  "P1 Home / Bienvenida" \
  "phase-2,type:feature,priority:P0,screen:home" \
  "$(cat <<'EOF'
## Spec UI
Frame `P1/Home` en página 02 · Nuevo diseño (MVP RF).

## Depends on
Kit UI (#5), Queries (#10), Rutas stub (#9)

## Alcance
- [ ] Headline «Descubre el oriente» + subtítulo verificado
- [ ] SearchField → navega a `/explorar?q=`
- [ ] Sección «Eventos próximos» + link «Ver todos»
- [ ] Carrusel horizontal `EventCard`
- [ ] Sección «Lugares destacados» + link «Explorar»
- [ ] Carrusel `PlaceCard`
- [ ] (Opcional) chips de categoría rápida → `/explorar?categoria=`

## Criterio de aceptación
Paridad visual razonable con P1 página 02; datos desde Supabase.

**Backlog:** `docs/mvp-github-project.md` · Issue #11
EOF
)"

create_issue \
  "P2 Explorar / Directorio" \
  "phase-2,type:feature,priority:P0,screen:explorar" \
  "$(cat <<'EOF'
## Spec UI
Frame `P2/Explorar` en página 02.

## Depends on
Queries (#10), Kit UI (#5)

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

**Backlog:** `docs/mvp-github-project.md` · Issue #12
EOF
)"

create_issue \
  "DirectoryCard: precio + accesibilidad en lista" \
  "phase-2,type:ui,priority:P1,screen:explorar" \
  "$(cat <<'EOF'
## Contexto
RF prioriza precio y transporte ya en el directorio (no solo en detalle).

## Depends on
Kit UI (#5), Schema (#7)

## Alcance
- [ ] Línea meta: «Desde $X · Acceso…» como en `MVP/Card/Directory`
- [ ] Fallback si no hay precio («Entrada libre» / «Consultar»)

## Criterio de aceptación
Cards de Explorar muestran logística mínima sin abrir detalle.

**Backlog:** `docs/mvp-github-project.md` · Issue #13
EOF
)"

create_issue \
  "Empty / loading / error states listados" \
  "phase-2,type:ui,priority:P2" \
  "$(cat <<'EOF'
## Depends on
Home (#11), Explorar (#12)

## Alcance
- [ ] Skeleton o placeholder de cards
- [ ] Vacío: «No hay resultados» + limpiar filtros
- [ ] Error de red amigable

## Criterio de aceptación
Ninguna pantalla se queda en blanco silencioso.

**Backlog:** `docs/mvp-github-project.md` · Issue #14
EOF
)"

create_issue \
  "Click-through Home/Explorar → Detalle" \
  "phase-2,type:feature,priority:P0" \
  "$(cat <<'EOF'
## Depends on
Home (#11), Explorar (#12), Rutas stub (#9)

## Alcance
- [ ] `EventCard` / `PlaceCard` / `DirectoryCard` navegan al slug correcto
- [ ] Prefetch opcional en viewport

## Criterio de aceptación
Flujo descubrimiento → ficha funciona end-to-end (aunque P3 aún sea stub).

**Backlog:** `docs/mvp-github-project.md` · Issue #15
EOF
)"

create_issue \
  "P3 Ficha de detalle (UI completa)" \
  "phase-3,type:feature,priority:P0,screen:detalle" \
  "$(cat <<'EOF'
## Spec
Página 02 `P3/Detalle` **alineado a Gemini** (issue congelar P3).

## Depends on
Congelar P3 (#1), Kit UI (#5), Schema (#7)

## Bloques
- [ ] Hero Image full-bleed (`next/image` priority)
- [ ] Atrás + Compartir
- [ ] Título + VerifiedBadge + ubicación
- [ ] Tags/categorías
- [ ] Grid logística 2×2 (fecha, precio/pagos, transporte, extras)
- [ ] Descripción
- [ ] Alerta/restricciones si hay dato
- [ ] CTA sticky WhatsApp

## Variantes
- Evento: fechas/horarios concretos
- Lugar: «Todo el año» / `schedule_text`

## Criterio de aceptación
Paridad con spec congelada; mobile usable; sin mapa.

**Backlog:** `docs/mvp-github-project.md` · Issue #16
EOF
)"

create_issue \
  "Generación de lead WhatsApp (wa.me)" \
  "phase-3,type:feature,priority:P0,screen:detalle" \
  "$(cat <<'EOF'
## Objetivo
Único mecanismo de monetización/lead del MVP.

## Depends on
Schema (#7)

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

**Backlog:** `docs/mvp-github-project.md` · Issue #17
EOF
)"

create_issue \
  "Compartir enlace (Web Share + fallback)" \
  "phase-3,type:feature,priority:P1,screen:detalle" \
  "$(cat <<'EOF'
## Depends on
P3 UI (#16)

## Alcance
- [ ] Botón Compartir en hero
- [ ] `navigator.share` cuando exista
- [ ] Fallback: copiar URL + toast/feedback

## Criterio de aceptación
Usuario puede compartir URL canónica del detalle.

**Backlog:** `docs/mvp-github-project.md` · Issue #18
EOF
)"

create_issue \
  "fetch listing por slug + 404" \
  "phase-3,type:data,priority:P0,screen:detalle" \
  "$(cat <<'EOF'
## Depends on
Schema (#7)

## Alcance
- [ ] `getListingBySlug(slug)`
- [ ] Solo publicados
- [ ] `notFound()` si no existe
- [ ] Server Component para el contenido estático del detalle

## Criterio de aceptación
Slug inválido → 404; slug válido → datos completos para P3.

**Backlog:** `docs/mvp-github-project.md` · Issue #19
EOF
)"

create_issue \
  "Página Sobre Cherotrip" \
  "phase-3,type:feature,priority:P2" \
  "$(cat <<'EOF'
## Depends on
Shell (#6)

## Alcance
- [ ] Copy corto: misión + “información verificada por el equipo”
- [ ] Link desde drawer
- [ ] Estilo tokens página 02 (sin inventar nueva marca)

## Criterio de aceptación
Ruta `/sobre` accesible desde P4.

**Backlog:** `docs/mvp-github-project.md` · Issue #20
EOF
)"

create_issue \
  "Página Contacto / Soporte" \
  "phase-3,type:feature,priority:P2" \
  "$(cat <<'EOF'
## Depends on
WhatsApp lead helper (#17)

## Alcance
- [ ] Canal de soporte (WhatsApp Cherotrip u otro acordado)
- [ ] Reusar patrón CTA verde si aplica
- [ ] Link desde drawer

## Criterio de aceptación
Usuario llega a soporte sin auth.

**Backlog:** `docs/mvp-github-project.md` · Issue #21
EOF
)"

create_issue \
  "SEO programático + Open Graph en detalle" \
  "phase-4,type:seo,priority:P0,screen:detalle" \
  "$(cat <<'EOF'
## Depends on
P3 UI (#16), fetch por slug (#19)

## Alcance
- [ ] `generateMetadata` en rutas de detalle
- [ ] `title`, `description`, `openGraph.images` = cover
- [ ] Twitter card básica
- [ ] URL canónica

## Criterio de aceptación
Preview al pegar link en WhatsApp/Redes muestra título + portada.

**Backlog:** `docs/mvp-github-project.md` · Issue #22
EOF
)"

create_issue \
  "PWA instalable" \
  "phase-4,type:pwa,priority:P0" \
  "$(cat <<'EOF'
## Depends on
Home (#11), Explorar (#12), Detalle (#16)

## Alcance
- [ ] `manifest.webmanifest` (nombre Cherotrip, colores marca)
- [ ] Iconos 192/512
- [ ] Service worker (Serwist o next-pwa compatible con Next 16)
- [ ] Estrategia cache razonable (app shell + network-first datos)

## Criterio de aceptación
Chrome Android: «Instalar app». No requiere login.

**Backlog:** `docs/mvp-github-project.md` · Issue #23
EOF
)"

create_issue \
  "Performance mobile (LCP < 2.5s)" \
  "phase-4,type:qa,priority:P0" \
  "$(cat <<'EOF'
## Depends on
Storage/Image (#8), Home (#11), Detalle (#16)

## Alcance
- [ ] Hero detalle con `priority`
- [ ] Covers optimizadas (WebP/AVIF vía Next Image)
- [ ] Evitar JS innecesario en Home/Explorar (Server Components)
- [ ] Medir Lighthouse móvil en Home y Detalle

## Criterio de aceptación
LCP < 2.5s en perfil móvil de Lighthouse (conexión/lab acordada) en páginas clave.

**Backlog:** `docs/mvp-github-project.md` · Issue #24
EOF
)"

create_issue \
  "Checklist exclusiones MVP" \
  "phase-4,type:qa,priority:P0" \
  "$(cat <<'EOF'
## Verificar que NO existe
- [ ] Login / Registro / sesión de usuario
- [ ] Perfil social, comentarios, guardados, notificaciones
- [ ] Upload de imágenes desde el frontend
- [ ] Mapa interactivo Google/Mapbox

## Criterio de aceptación
Issue cerrado con evidencia (rutas + UI) de que no están presentes.

**Backlog:** `docs/mvp-github-project.md` · Issue #25
EOF
)"

create_issue \
  "Contenido producción + teléfonos reales" \
  "phase-5,type:data,priority:P0" \
  "$(cat <<'EOF'
## Depends on
Seed (#3), WhatsApp lead (#17)

## Alcance
- [ ] Publicar listings verificados en prod
- [ ] WhatsApp reales de comercios/aliados
- [ ] Revisar ortografía, precios, transporte

## Criterio de aceptación
Cada listing publicado tiene lead funcional.

**Backlog:** `docs/mvp-github-project.md` · Issue #26
EOF
)"

create_issue \
  "Smoke test móvil (5 flujos)" \
  "phase-5,type:qa,priority:P0" \
  "$(cat <<'EOF'
## Depends on
Home, Explorar, Detalle, WhatsApp, PWA

## Flujos
1. Home → evento próximo → WhatsApp
2. Explorar → filtrar categoría → abrir lugar → compartir
3. Search por texto → resultado → detalle
4. Drawer → Sobre / Contacto
5. Instalar PWA → abrir detalle offline/online según estrategia

## Criterio de aceptación
Checklist pasado en Android real (y iOS Safari en lo aplicable).

**Backlog:** `docs/mvp-github-project.md` · Issue #27
EOF
)"

create_issue \
  "Deploy Vercel + env Supabase" \
  "phase-5,type:foundation,priority:P0" \
  "$(cat <<'EOF'
## Alcance
- [ ] Proyecto Vercel conectado
- [ ] Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Dominio / preview
- [ ] Verificar OG images en URL pública

## Criterio de aceptación
URL producción sirve Home, Explorar y Detalle con datos reales.

**Backlog:** `docs/mvp-github-project.md` · Issue #28
EOF
)"

echo "DONE — issues creados"
gh issue list --limit 50
