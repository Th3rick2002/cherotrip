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

### Backlog y Planificación v3 (Octubre 2026)

- [x] **Alineación v3.0:** Redacción de requerimientos de expansión logística y social light.
- [x] **Issues creadas en GitHub:** Apertura de las 10 issues oficiales (#31 a #40) con etiquetas de fases, pantallas y prioridades.
- [x] **Reestructuración de Documentación:** Creación de la estructura normalizada en `/docs/` (rules, ui-ux, specs, decisions, changes, state).
- [x] **Saneamiento de Entorno:** Remoción del hook huérfano de Coucou en la configuración CLI.
