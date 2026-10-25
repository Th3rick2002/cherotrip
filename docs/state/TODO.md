# Pendientes Priorizados (TODO)

Backlog activo ordenado por bloques de ejecución recomendados.

---

## Bloque 0 — Cierre de Soft Launch Operativo (En paralelo)

- [ ] **[#30](https://github.com/Th3rick2002/cherotrip/issues/30)** `Confirmar NEXT_PUBLIC_SITE_URL en Vercel producción` (`P1`)
- [ ] **[#27](https://github.com/Th3rick2002/cherotrip/issues/27)** `Contenido producción + teléfonos reales en listings` (`P0`)
- [ ] **[#26](https://github.com/Th3rick2002/cherotrip/issues/26)** `Checklist exclusiones MVP (actualizar: UGC moderado sí)` (`P0`)
- [ ] **[#28](https://github.com/Th3rick2002/cherotrip/issues/28)** `Smoke test móvil formal (5 flujos críticos en prod)` (`P0`)
- [ ] **[#29](https://github.com/Th3rick2002/cherotrip/issues/29)** `Audit Lighthouse en producción (LCP < 2.5s en móvil)` (`P1`)

---

## Bloque 1 — Schema y Datos v3 (Base)

- [x] **[#31](https://github.com/Th3rick2002/cherotrip/issues/31)** `[v3] Migración DB: columnas listing + sub_eventos + aportes_comunidad` (`P0`) ✅ *Completado*
- [x] ~~**[#32](https://github.com/Th3rick2002/cherotrip/issues/32)** `[v3] Ampliar plantilla Excel turismo`~~ ⛔ *Descartado — Reemplazado por CMS (#41–#44)*

---

## Bloque 2 — Expansión Ficha de Detalle P3 (Público)

- [ ] **[#33](https://github.com/Th3rick2002/cherotrip/issues/33)** `[v3][UI] SocialLinks — redes oficiales en ficha de detalle` (`P0`)
  - Componente de iconos minimalistas Instagram / Facebook / TikTok.
- [ ] **[#34](https://github.com/Th3rick2002/cherotrip/issues/34)** `[v3][UI] AccommodationBanner — banner de alojamiento (Airbnb/hotel)` (`P1`)
  - Enlace contextual de hospedaje bajo sección de transporte.
- [ ] **[#35](https://github.com/Th3rick2002/cherotrip/issues/35)** `[v3][UI] DetailCta — CTA dinámico WhatsApp vs Taquilla` (`P0`)
  - Extender `WhatsAppCta` para priorizar compra de entradas en eventos con ticketera.
- [ ] **[#36](https://github.com/Th3rick2002/cherotrip/issues/36)** `[v3][UI] EventAgenda — agenda multi-día con tabs y timeline para sub_eventos` (`P0`)
  - Selector de días y lista cronológica de actividades por sede.

---

## Bloque 3 — Fase 2 Social Light (Público)

- [ ] **[#37](https://github.com/Th3rick2002/cherotrip/issues/37)** `[v3][Feature] Favoritos (corazón en cards) con hook useFavorites y localStorage` (`P0`)
  - Toggle de guardado sin requerir sesión de usuario.
- [ ] **[#38](https://github.com/Th3rick2002/cherotrip/issues/38)** `[v3][UI] Mis Guardados — ruta y navegación (móvil y header)` (`P0`)
  - Vista `/guardados` y enlaces en TopBar / SideDrawer.
- [ ] **[#39](https://github.com/Th3rick2002/cherotrip/issues/39)** `[v3][Feature] Modal 'Aporta a la Comunidad' + envío a aportes_comunidad` (`P1`)
  - Formulario modal ciudadano con inserción directa a cola de moderación.

---

## Bloque 4 — Panel Administrativo Interno CMS (Desktop-First)

- [ ] **[#41](https://github.com/Th3rick2002/cherotrip/issues/41)** `[CMS][Auth] Shell base /admin, Supabase Auth y Middleware de protección` (`P0`)
  - Login `/admin/login`, Middleware de redirección y Sidebar de navegación interna.
- [ ] **[#42](https://github.com/Th3rick2002/cherotrip/issues/42)** `[CMS][Storage] Bucket de Supabase Storage para portadas y carga multimedia` (`P1`)
  - Bucket `listing-covers`, políticas RLS de admin y componente selector de fotos.
- [ ] **[#43](https://github.com/Th3rick2002/cherotrip/issues/43)** `[CMS][CRUD] Gestión de Lugares y Eventos (Data-tables y Formularios)` (`P0`)
  - Data-tables de shadcn/ui y formularios con React Hook Form + Zod (lugares, eventos, agenda).
- [ ] **[#44](https://github.com/Th3rick2002/cherotrip/issues/44)** `[CMS][Moderación] Bandeja de revisión de aportes_comunidad` (`P1`)
  - Vista `/admin/moderacion` para revisar, aprobar o descartar aportes comunitarios.

---

## Bloque 5 — QA y Verificación Integral

- [ ] **[#40](https://github.com/Th3rick2002/cherotrip/issues/40)** `[v3][QA] QA de la expansión v3 (smoke test ampliado, CMS y exclusiones)` (`P1`)
  - Validar los flujos de favoritos, taquilla, agenda, aportes y CMS en producción.
