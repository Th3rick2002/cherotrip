# Trabajo Completado (DONE)

Registro de hitos y tareas finalizadas recientemente en el proyecto.

---

### Fase 1 — Core Logístico y Despliegue (En Producción)

- [x] **Setup de Infraestructura:** Configuración de Next.js 15 App Router, Tailwind CSS, TypeScript y Supabase.
- [x] **Schema de Base de Datos Base:** Migración inicial de `listings` (lugares/eventos), `categories` y tags de búsqueda.
- [x] **PWA e Instalabilidad:** Service worker configurado con Serwist, manifest web dinámico y soporte de vista offline.
- [x] **Pantalla Home (P1):**
  - Hero con buscador predictivo y redirección fluida a exploración.
  - Carrusel horizontal de colecciones temáticas.
  - Sección de próximos eventos destacados.
  - Bloque de servicios rápidos para turistas.
  - Navegación por tabs de departamentos con filtrado instantáneo.
- [x] **Pantalla de Exploración (P2):**
  - Barra de búsqueda conectada con debounce.
  - Filtros independientes por chip de categoría y selector de departamento.
  - Grid responsivo de tarjetas de listings (`ListingCard`) con imágenes optimizadas (`next/image`).
- [x] **Ficha de Detalle (P3):**
  - Rutas dinámicas por slug (`/lugar/[slug]` y `/evento/[slug]`).
  - Hero inmersivo con botones de compartir nativo (`ShareButton`) y regreso inteligente (`BackButton`).
  - Cuadrícula de información logística 2×2: horarios, costo, transporte y accesibilidad.
  - Botón flotante inferior (sticky CTA) con enlace directo a WhatsApp (`wa.me`) con mensaje personalizado.
- [x] **Navegación Global:**
  - Barra superior (`TopBar`) con logo y acceso rápido.
  - Menú lateral deslizante (`SideDrawer`) con enlaces a secciones informativas.
- [x] **SEO y Open Graph:**
  - Generación de `robots.txt` y `sitemap.xml` dinámicos.
  - Metadatos de Open Graph dinámicos por listing para vista previa enriquecida en redes sociales.

---

### Backlog v3 y Migraciones (Octubre 2026)

- [x] **[#31](https://github.com/Th3rick2002/cherotrip/issues/31) Migración DB v3:** Ampliadas columnas en `listings` (redes, taquilla, alojamiento), creadas tablas `activity_categories`, `sub_events` y `community_submissions` con índices y políticas RLS; creado bucket privado `community-submission-photos`.
- [x] **[#33](https://github.com/Th3rick2002/cherotrip/issues/33) SocialLinks:** Enlaces oficiales seguros de Instagram, Facebook y TikTok en la ficha.
- [x] **[#34](https://github.com/Th3rick2002/cherotrip/issues/34) AccommodationBanner:** Banner de alojamiento con prioridad a URL directa y búsqueda Airbnb de respaldo.
- [x] **[#35](https://github.com/Th3rick2002/cherotrip/issues/35) DetailCta:** CTA sticky de taquilla que reemplaza WhatsApp cuando la URL es válida.
- [x] **Fixtures QA v3:** Tres listings publicados en el proyecto Supabase del MVP para comprobar las variantes de detalle.
- [x] **Cancelación y Reemplazo de [#32](https://github.com/Th3rick2002/cherotrip/issues/32):** Descartado flujo manual de Excel en favor del Panel Administrativo CMS.
- [x] **Especificación e Issues del Panel Admin (CMS):** Creadas en GitHub las issues #41 (Auth), #42 (Storage), #43 (CRUDs) y #44 (Moderación).
- [x] **Reestructuración Integral de `/docs/`:** Normalización con `rules/`, `ui-ux/`, `specs/`, `decisions/`, `changes/` y `state/`.
- [x] **Saneamiento de Entorno:** Remoción del hook huérfano de Coucou en la configuración CLI.
