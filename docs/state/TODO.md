# Pendientes Priorizados (TODO)

Backlog activo sincronizado con el repositorio GitHub y el estado de producción en Vercel.

---

## Bloque 0 — Cierre de Soft Launch Operativo (En paralelo / Pre-lanzamiento MVP)

- [ ] **[#30](https://github.com/Th3rick2002/cherotrip/issues/30)** `Confirmar NEXT_PUBLIC_SITE_URL en Vercel producción` (`P1`, `phase-5`)
  - Verificar en Vercel Project Settings > Environment Variables que apunte al dominio canónico final.
- [ ] **[#27](https://github.com/Th3rick2002/cherotrip/issues/27)** `Contenido producción + teléfonos reales en listings` (`P0`, `phase-5`)
  - Reemplazar datos demo por contenido oficial de Turismo/Marketing cargado a través del nuevo Panel Admin (`/admin`).
- [ ] **[#26](https://github.com/Th3rick2002/cherotrip/issues/26)** `Checklist exclusiones MVP (verificar en prod)` (`P0`, `phase-4`)
  - Comprobar en producción: sin cuentas de visitantes, sin comentarios libres, sin mapas nativos pesados; favoritos locales y `/aportar` moderado operativos.
- [ ] **[#28](https://github.com/Th3rick2002/cherotrip/issues/28)** `Smoke test móvil formal (5 flujos críticos en prod)` (`P0`, `phase-5`)
  - Validar los 5 flujos en móvil y comprobar instalación PWA en Vercel.
- [ ] **[#29](https://github.com/Th3rick2002/cherotrip/issues/29)** `Audit Lighthouse en producción (LCP < 2.5s en móvil)` (`P1`, `phase-4`)
  - Medición actual: FCP 1.4s, Speed Index 2.4s, LCP 2.7s. Ajustar fuente variable y preconnect para bajar LCP a < 2.5s.

---

## Bloque 1 — Schema y Datos v3 (Base)

- [x] **[#31](https://github.com/Th3rick2002/cherotrip/issues/31)** `[v3] Migración DB: columnas listing + sub_eventos + aportes_comunidad` (`P0`) ✅ *Cerrada*
- [x] ~~**[#32](https://github.com/Th3rick2002/cherotrip/issues/32)** `[v3] Ampliar plantilla Excel turismo`~~ ⛔ *Cerrada wontfix — Reemplazada por CMS*

---

## Bloque 2 — Expansión Ficha de Detalle P3 (Público)

- [x] **[#33](https://github.com/Th3rick2002/cherotrip/issues/33)** `[v3][UI] SocialLinks — redes oficiales en ficha de detalle` (`P0`) ✅ *Cerrada*
- [x] **[#34](https://github.com/Th3rick2002/cherotrip/issues/34)** `[v3][UI] AccommodationBanner — banner de alojamiento (Airbnb/hotel)` (`P1`) ✅ *Cerrada*
- [x] **[#35](https://github.com/Th3rick2002/cherotrip/issues/35)** `[v3][UI] DetailCta — CTA dinámico WhatsApp vs Taquilla` (`P0`) ✅ *Cerrada*
- [x] **[#36](https://github.com/Th3rick2002/cherotrip/issues/36)** `[v3][UI] EventAgenda — agenda multi-día con tabs y timeline` (`P0`) ✅ *Cerrada*

---

## Bloque 3 — Fase 2 Social Light (Público)

- [x] **[#37](https://github.com/Th3rick2002/cherotrip/issues/37)** `[v3][Feature] Favoritos (corazón en cards) con localStorage` (`P0`) ✅ *Cerrada*
- [x] **[#38](https://github.com/Th3rick2002/cherotrip/issues/38)** `[v3][UI] Mis Guardados — ruta /guardados y navegación` (`P0`) ✅ *Cerrada*
- [x] **[#39](https://github.com/Th3rick2002/cherotrip/issues/39)** `[v3][Feature] Aportes comunitarios en /aportar con foto privada` (`P1`) ✅ *Cerrada*

---

## Bloque 4 — Panel Administrativo Interno CMS (Desktop-First)

- [x] **[#41](https://github.com/Th3rick2002/cherotrip/issues/41)** `[CMS][Auth] Shell base /admin, Supabase Auth y Middleware` (`P0`) ✅ *Cerrada*
- [x] **[#42](https://github.com/Th3rick2002/cherotrip/issues/42)** `[CMS][Storage] Bucket de portadas y biblioteca` (`P1`) ✅ *Cerrada*
- [x] **[#43](https://github.com/Th3rick2002/cherotrip/issues/43)** `[CMS][CRUD] Gestión de Lugares y Eventos (Data-tables y Formularios)` (`P0`) ✅ *Cerrada*
- [x] **[#44](https://github.com/Th3rick2002/cherotrip/issues/44)** `[CMS][Moderación] Bandeja de revisión de aportes_comunidad` (`P1`) ✅ *Cerrada*

---

## Bloque 5 — QA y Verificación Integral

- [x] **[#40](https://github.com/Th3rick2002/cherotrip/issues/40)** `[v3][QA] QA de la expansión v3` (`P1`) ✅ *Cerrada*
- [x] **[#47](https://github.com/Th3rick2002/cherotrip/issues/47)** `[Bug] Mensaje de WhatsApp incluía localhost en prod` (`P1`) ✅ *Cerrada (PR #48)*
