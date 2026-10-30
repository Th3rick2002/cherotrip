# Plan MVP v3.0 — Gap analysis y siguientes pasos

**Fecha:** 24 Oct 2026  
**Fuentes:** Requerimientos MVP v3.0 + Expansión logística (Airbnb/redes/taquilla/agenda)  
**Código base:** lo ya desplegado en Vercel (Fase 1 core casi completa)

---

## 1. Panorama en una frase

La **Fase 1 (core logístico + conversión WhatsApp + PWA/SEO)** ya está hecha en código.  
Los docs v3.0 añaden una **Fase 2 social “light”** (favoritos locales, UGC moderado) y una **expansión de ficha de detalle** (alojamiento, redes, taquilla, agenda multi-día).  
Eso implica: schema nuevo, UI en P3, y ajustar exclusiones (antes “cero UGC”; ahora UGC **controlado**).

---

## 2. Matriz: requerimiento vs estado actual

### A. Lineamientos UI / Home / Detalle (Doc 1 §2)

| Requerimiento v3 | Estado hoy | Acción |
|---|---|---|
| Paleta Océano y Arena + WhatsApp solo en CTA | ✅ Hecho | Mantener |
| P1 Hero + buscador | ✅ | Mantener |
| P1 Alerta logística dinámica | ❌ Quitada a propósito (sin cuentas no aporta) | **No reabrir** salvo tip editorial estático/CMS; no personalizado |
| P1 Colecciones rápidas | ✅ | Mantener |
| P1 Eventos próximos | ✅ | Mantener |
| P1 Servicios rápidos | ✅ (3 ítems; doc pide ~4) | Opcional: 4º ícono si turismo define el servicio |
| P1 Tabs por departamento | ✅ | Mantener |
| P3 Hero + Atrás + Compartir | ✅ | Mantener |
| P3 Check verificado | ✅ | Mantener |
| P3 Bloques logística / accesibilidad / economía | ✅ (grid 2×2) | Refinar copy/estructura si hace falta al meter agenda/taquilla |
| P3 CTA WhatsApp fijo | ✅ | Extender a CTA condicional (taquilla) |

### B. Fase 1 — Core logístico (Doc 1 §3)

| Requerimiento | Estado | Acción |
|---|---|---|
| Motor directorio Supabase | ✅ | Soft launch con contenido real (#27) |
| Filtros categoría / departamento | ✅ | Mantener |
| Ficha detalle desde DB | ✅ | Expandir con Fase logística |
| Lead WhatsApp `wa.me` | ✅ | Ajustar copy del mensaje si marketing lo pide |
| PWA + LCP + OG | ✅ base | Cerrar #28–#30 y audit #29 |

### C. Fase 2 — Social light (Doc 1 §4) — **NUEVO**

| Requerimiento | Estado | Acción |
|---|---|---|
| Web Share API | ✅ Ya existe | Nada (o pulir UX) |
| Favoritos (corazón) + `localStorage` + “Mis Guardados” | ❌ | **Nuevo:** icono en cards + página/sección menú |
| UGC “Aporta a la Comunidad” → tabla `aportes_comunidad` pendiente | ❌ | **Nuevo:** modal Home + tabla + RLS solo insert anon + review manual |
| Auth / perfiles / comentarios públicos | Excluido | Sigue excluido |

### D. Expansión logística en detalle (Docs 2–3) — **NUEVO**

| Módulo | Datos | UI | Estado |
|---|---|---|---|
| Alojamiento | `link_alojamiento` y/o `municipio_busqueda` | Banner bajo transporte | ❌ |
| Redes oficiales | `link_instagram`, `link_facebook`, `link_tiktok` | Fila iconos bajo descripción | ❌ |
| Taquilla | `link_taquilla`, `proveedor_taquilla` | CTA azul vs WhatsApp verde | ❌ |
| Agenda compleja | tabla `sub_eventos` (día, horas, título, lugar_especifico, tipo) | Tabs por día + timeline | ❌ |

### E. Soft launch operativo (issues abiertas)

| Issue | Rol en v3 |
|---|---|
| #27 Contenido + Excel | Sigue P0; **ampliar plantilla Excel** con columnas nuevas |
| #28 Smoke prod | Sigue; ampliar flujos (favoritos, taquilla, agenda) cuando existan |
| #26 Exclusiones | Actualizar: UGC controlado **sí**; auth/mapas/comentarios libres **no** |
| #29 Lighthouse | Sigue P1 |
| #30 `NEXT_PUBLIC_SITE_URL` | Sigue P1 |

---

## 3. Decisiones de producto (para no re-discutir en código)

1. **Alerta logística Home:** no vuelve como “recomendación personalizada”. Si se quiere, solo tip editorial global (tabla `tips` o config), no bloqueante.
2. **Favoritos:** 100% cliente (`localStorage`); menú gana “Mis Guardados” (antes excluido a propósito — ahora habilitado **sin Auth**).
3. **UGC:** permitido solo vía `aportes_comunidad` con `estado = pendiente|aprobado|rechazado`; nunca publica directo al directorio.
4. **Mapas:** siguen excluidos como nativos; OK links salientes a Google/Waze/Airbnb si se agregan después.
5. **Agenda:** modelo Doc 3 (tabs por día + timeline + `lugar_especifico`) gana sobre Doc 2 (solo timeline sin tabs).
6. **CTA:** si hay `link_taquilla` → botón azul “Comprar entradas”; si no → WhatsApp verde. No mostrar ambos como primario a la vez (WhatsApp puede quedar como secundario/texto si se necesita después).

---

## 4. Cambios de datos (schema) — propuesta

### Ampliar `listings` (columnas opcionales)

```text
instagram_url text
facebook_url text
tiktok_url text
ticket_url text
ticket_provider text
accommodation_url text        -- URL directa de alojamiento
accommodation_search_query text
```

### Tabla `sub_events`

```text
id, listing_id, event_date, start_time, end_time, title,
description, venue, activity_category_id, sort_order
```

### Tabla `community_submissions`

```text
id, title, listing_type, department_id, comment, description,
meeting_point, schedule_text, price_from, payment_methods,
transport_info, accessibility_notes, tags, starts_at, ends_at,
photo_path, contact_optional, status, converted_listing_id, created_at
```

`department_id` referencia `departments.id`; ver el [esquema vigente de departamentos](./specs/database-schema.md). La tabla `activity_categories` contiene el catálogo de agenda asociado a `sub_events`.

### Excel turismo

La plantilla de listings se mantiene separada del esquema SQL; sus columnas deben usar nombres en inglés.

---

## 5. Plan de ejecución (orden recomendado)

### Bloque 0 — Cerrar soft launch mínimo (en paralelo / 1–2 días)

No bloquea desarrollo de Fase 2, pero desbloquea operación:

1. #30 `NEXT_PUBLIC_SITE_URL`
2. #27 importar contenido real (aunque sea parcial)
3. #26 / #28 checklist + smoke en prod
4. #29 Lighthouse si hay tiempo

### Bloque 1 — Schema + Excel (base de todo lo nuevo)

**Issue:** Migración Supabase columnas listing + `sub_eventos` + `aportes_comunidad`  
**Issue:** Ampliar plantilla Excel + README de mapeo  

*Por qué primero:* UI sin datos no se puede validar con turismo.

### Bloque 2 — Expansión ficha P3 (alto valor conversión)

Orden interno (de más simple a más complejo):

| Orden | Entrega | Componentes sugeridos |
|---|---|---|
| 2.1 | Redes oficiales | `SocialLinks.tsx` |
| 2.2 | Banner alojamiento | `AccommodationBanner.tsx` |
| 2.3 | WhatsApp junto a redes + compra de tickets al final del evento | `SocialLinks.tsx` + `TicketPurchaseCta.tsx` |
| 2.4 | Agenda tabs + timeline | `EventAgenda.tsx` + query `sub_eventos` |

Todo se inyecta en `listing-detail.tsx`; WhatsApp no usa barra fija y la compra solo aparece como tarjeta contextual si hay taquilla válida.

### Bloque 3 — Fase 2 social light

| Orden | Entrega |
|---|---|
| 3.1 | Corazón en cards + hook `useFavorites` (`localStorage`) |
| 3.2 | Ruta/sección **Mis Guardados** + link en menú (móvil y header) |
| 3.3 | Modal “Aporta a la Comunidad” en Home + insert a `aportes_comunidad` |

### Bloque 4 — QA de la expansión

- Ampliar smoke: favorito → Mis Guardados; detalle con taquilla; detalle con agenda multi-día; aporte pendiente en Dashboard.
- Actualizar exclusiones (#26): Auth/mapas/comentarios libres siguen fuera; UGC controlado y favoritos locales **dentro**.

---

## 6. Impacto en archivos actuales (sin implementar aún)

| Área | Archivos / zonas a tocar |
|---|---|
| DB | Nueva migración en `supabase/migrations/` |
| Types | `lib/types/listing.ts` |
| Queries | `lib/listings/queries.ts` (+ `getSubEvents`, insert aporte) |
| Detalle | `components/listings/listing-detail.tsx`, nuevos componentes en `components/listings/` |
| CTA | `whatsapp-cta.tsx` → lógica condicional |
| Home | `app/(main)/page.tsx` + modal aporte |
| Cards | `listing-cards.tsx` (corazón) |
| Nav | `lib/nav.ts`, `top-bar.tsx`, `side-drawer.tsx` (+ Mis Guardados) |
| Excel | `docs/templates/` |

---

## 7. Estimación orientativa (equipo pequeño)

| Bloque | Esfuerzo relativo |
|---|---|
| Bloque 1 Schema + Excel | 0.5–1 día |
| Bloque 2.1–2.3 Redes / Airbnb / CTA | 1–1.5 días |
| Bloque 2.4 Agenda compleja | 1.5–2 días |
| Bloque 3 Favoritos + UGC | 1–1.5 días |
| QA / smoke ampliación | 0.5 día |

**Total expansión v3 sobre el MVP actual:** ~5–7 días de trabajo enfocado.

---

## 8. Qué NO entra todavía

- Auth / login / perfiles
- Comentarios públicos sin moderación
- Mapas embebidos Google/Mapbox
- Panel admin custom (sigue Supabase Dashboard + Excel)
- Personalización por usuario logueado (alerta logística “inteligente”)

---

## 9. Criterio de “listo” para presentar v3

1. Ficha detalle muestra (si hay datos): redes, banner alojamiento, CTA taquilla o WhatsApp, agenda multi-día/multisede.  
2. Usuario puede guardar favoritos y verlos offline-ish vía localStorage.  
3. Visitante puede enviar un aporte; turismo lo ve en `aportes_comunidad` como pendiente.  
4. Contenido real en prod + smoke PWA OK.

---

## 10. Siguiente acción recomendada

Cuando digas “adelante”, el orden de implementación será:

1. Migración DB + tipos + Excel  
2. SocialLinks + AccommodationBanner + TicketPurchaseCta
3. EventAgenda  
4. Favoritos + Mis Guardados  
5. Modal aportes_comunidad  

Hasta entonces este documento es la fuente de verdad del plan v3.
