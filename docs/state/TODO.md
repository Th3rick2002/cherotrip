# Pendientes Priorizados (TODO)

Backlog activo ordenado por bloques de ejecución recomendados.

> Estado del código y de Supabase conocido localmente; el estado remoto de GitHub no se pudo consultar en la última revisión. No usar este archivo como confirmación del estado remoto de las issues.

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

- [x] **[#33](https://github.com/Th3rick2002/cherotrip/issues/33)** `[v3][UI] SocialLinks — redes oficiales en ficha de detalle` (`P0`)
  - Componente de iconos minimalistas Instagram / Facebook / TikTok.
- [x] **[#34](https://github.com/Th3rick2002/cherotrip/issues/34)** `[v3][UI] AccommodationBanner — banner de alojamiento (Airbnb/hotel)` (`P1`)
  - Enlace contextual de hospedaje bajo sección de transporte.
- [x] **[#35](https://github.com/Th3rick2002/cherotrip/issues/35)** `[v3][UI] DetailCta — CTA dinámico WhatsApp vs Taquilla` (`P0`)
  - Extender `WhatsAppCta` para priorizar compra de entradas en eventos con ticketera.
- [x] **[#36](https://github.com/Th3rick2002/cherotrip/issues/36)** Agenda multi-día implementada y fusionada en PR #46; sigue abierta para revisión colaborativa según el último handoff.

---

## Bloque 3 — Fase 2 Social Light (Público)

- [x] **[#37](https://github.com/Th3rick2002/cherotrip/issues/37)** Favoritos locales implementados y fusionados en PR #46; sigue abierta para revisión colaborativa según el último handoff.
- [x] **[#38](https://github.com/Th3rick2002/cherotrip/issues/38)** `/guardados` y navegación implementados y fusionados en PR #46; sigue abierta para revisión colaborativa según el último handoff.
- [x] **[#39](https://github.com/Th3rick2002/cherotrip/issues/39)** `/aportar` implementado y fusionado en PR #46; sigue abierta para revisión colaborativa según el último handoff.

---

## Bloque 4 — Panel Administrativo Interno CMS (Desktop-First)

- [x] **[#41](https://github.com/Th3rick2002/cherotrip/issues/41)** Acceso admin implementado; migración aplicada y acceso del propietario confirmado.
- [x] **[#42](https://github.com/Th3rick2002/cherotrip/issues/42)** Biblioteca y carga de portadas implementadas; migración aplicada.
- [x] **[#43](https://github.com/Th3rick2002/cherotrip/issues/43)** Implementación local: formularios CRUD separados por tipo, agenda, catálogos por tipo, portadas y contenido de Home. Pendiente migración remota y QA.
- [x] **[#44](https://github.com/Th3rick2002/cherotrip/issues/44)** Implementación local: bandeja, fotos privadas firmadas, conversión transaccional a borrador y rechazo. Pendiente migración remota y QA.

---

## Bloque 5 — QA y Verificación Integral

- [x] **[#40](https://github.com/Th3rick2002/cherotrip/issues/40)** QA v3 validada y issue cerrada según el último handoff. Repetir QA para CMS tras aplicar su migración.
