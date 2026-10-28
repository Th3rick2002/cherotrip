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
  - Contacto social junto a redes; compra de entradas en tarjeta al final de la ficha del evento, sin barra fija.
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
- [x] **[#35](https://github.com/Th3rick2002/cherotrip/issues/35) DetailCta:** compra de entradas en tarjeta al final de la ficha del evento; WhatsApp junto a las redes sociales.
- [x] **[#36](https://github.com/Th3rick2002/cherotrip/issues/36) Agenda multi-día:** agenda con pestañas por día y actividades ordenadas; fusionada en PR #46.
- [x] **[#37–#38](https://github.com/Th3rick2002/cherotrip/issues/37) Favoritos y Mis Guardados:** favoritos locales y página `/guardados`; fusionados en PR #46.
- [x] **[#39](https://github.com/Th3rick2002/cherotrip/issues/39) Aportes comunitarios:** formulario independiente `/aportar` con foto privada; fusionado en PR #46.
- [x] **[#40](https://github.com/Th3rick2002/cherotrip/issues/40) QA v3:** validación de flujos registrada y issue cerrada según el último handoff. La QA de CMS se hará tras implementar #43–#44.
- [x] **Fixtures QA v3:** Tres listings publicados en el proyecto Supabase del MVP para comprobar las variantes de detalle.
- [x] **Cancelación y Reemplazo de [#32](https://github.com/Th3rick2002/cherotrip/issues/32):** Descartado flujo manual de Excel en favor del Panel Administrativo CMS.
- [x] **Especificación e Issues del Panel Admin (CMS):** Creadas en GitHub las issues #41 (Auth), #42 (Storage), #43 (CRUDs) y #44 (Moderación).
- [x] **Reestructuración Integral de `/docs/`:** Normalización con `rules/`, `ui-ux/`, `specs/`, `decisions/`, `changes/` y `state/`.
- [x] **Saneamiento de Entorno:** Remoción del hook huérfano de Coucou en la configuración CLI.

### Panel Administrativo (CMS) y Expansión Finalizados

- [x] **[#41] Acceso admin:** Auth por correo/contraseña, allow-list `admin_users` y protección con `is_admin()`. Migración aplicada y confirmada en producción.
- [x] **[#42] Portadas:** bucket `listing-covers`, políticas admin y biblioteca de subida/gestión en Storage implementados y en producción.
- [x] **[#43] Gestión editorial (CRUDs):** CRUD separado para lugares/eventos, categorías con alcance por tipo, agenda, publicación explícita, selección de portadas y módulos Home administrables. Migración remota aplicada y PRs #52/#53 fusionados en `main`.
- [x] **[#44] Moderación comunitaria:** bandeja en `/admin/moderacion`, foto privada con URL firmada, conversión transaccional a borrador y rechazo. Migración remota aplicada y PR #52 fusionado en `main`.
- [x] **[#36] EventAgenda:** agenda multi-día con pestañas por día y actividades ordenadas; validada y cerrada.
- [x] **[#37–#38] Favoritos y Mis Guardados:** favoritos locales sin cuenta y ruta `/guardados`; validados y cerrados.
- [x] **[#39] Aportes comunitarios:** formulario `/aportar` con foto privada y RLS; validado y cerrado.
- [x] **[#47] Fix de WhatsApp URL:** uso estricto del dominio canónico en producción; resuelto en PR #48.
- [x] **Migración CMS remota:** `20261027045830_admin_cms_content.sql` aplicada al 100% en el proyecto Supabase de producción.
