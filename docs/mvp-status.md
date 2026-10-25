# Estado MVP Cherotrip — actualizado 24 Oct 2026

> Plan detallado gap/v3: **[`docs/mvp-v3-plan.md`](./mvp-v3-plan.md)**

## Resumen ejecutivo

| Capa | Estado |
|---|---|
| **Fase 1 — Core logístico** (directorio, filtros, detalle, WhatsApp, PWA, SEO) | ✅ Hecho y en Vercel |
| **Soft launch operativo** (contenido real, smoke prod, env) | ⏳ Issues #26–#30 |
| **Fase 2 — Social light** (favoritos localStorage, UGC moderado) | 📋 Planificado (nuevo en v3) |
| **Expansión ficha** (Airbnb, redes, taquilla, agenda `sub_eventos`) | 📋 Planificado (nuevo en v3) |

## Issues GitHub abiertas (operación)

| # | Tema | Prioridad |
|---|---|---|
| [#27](https://github.com/Th3rick2002/cherotrip/issues/27) | Contenido producción + Excel | P0 |
| [#28](https://github.com/Th3rick2002/cherotrip/issues/28) | Smoke test prod + PWA | P0 |
| [#26](https://github.com/Th3rick2002/cherotrip/issues/26) | Checklist exclusiones (actualizar: UGC controlado ahora sí) | P0 |
| [#29](https://github.com/Th3rick2002/cherotrip/issues/29) | Lighthouse prod | P1 |
| [#30](https://github.com/Th3rick2002/cherotrip/issues/30) | `NEXT_PUBLIC_SITE_URL` | P1 |

## Issues GitHub abiertas (v3: Expansión logística + Fase 2)

| # | Tema | Prioridad | Bloque |
|---|---|---|---|
| [#31](https://github.com/Th3rick2002/cherotrip/issues/31) | [v3] Migración DB: columnas listing + sub_eventos + aportes_comunidad | P0 | Bloque 1 |
| [#32](https://github.com/Th3rick2002/cherotrip/issues/32) | [v3] Ampliar plantilla Excel turismo (columnas nuevas + sub_eventos) | P1 | Bloque 1 |
| [#33](https://github.com/Th3rick2002/cherotrip/issues/33) | [v3][UI] SocialLinks — redes oficiales en ficha de detalle | P0 | Bloque 2.1 |
| [#34](https://github.com/Th3rick2002/cherotrip/issues/34) | [v3][UI] AccommodationBanner — banner de alojamiento (Airbnb/hotel) en detalle | P1 | Bloque 2.2 |
| [#35](https://github.com/Th3rick2002/cherotrip/issues/35) | [v3][UI] DetailCta — CTA dinámico WhatsApp vs Taquilla en ficha de detalle | P0 | Bloque 2.3 |
| [#36](https://github.com/Th3rick2002/cherotrip/issues/36) | [v3][UI] EventAgenda — agenda multi-día con tabs y timeline para sub_eventos | P0 | Bloque 2.4 |
| [#37](https://github.com/Th3rick2002/cherotrip/issues/37) | [v3][Feature] Favoritos (corazón en cards) con hook useFavorites y localStorage | P0 | Bloque 3.1 |
| [#38](https://github.com/Th3rick2002/cherotrip/issues/38) | [v3][UI] Mis Guardados — ruta y navegación (móvil y header) | P0 | Bloque 3.2 |
| [#39](https://github.com/Th3rick2002/cherotrip/issues/39) | [v3][Feature] Modal 'Aporta a la Comunidad' + envío a aportes_comunidad | P1 | Bloque 3.3 |
| [#40](https://github.com/Th3rick2002/cherotrip/issues/40) | [v3][QA] QA de la expansión v3 (smoke test ampliado y actualización de exclusiones) | P1 | Bloque 4 |

## Qué ya cubre el código vs Doc v3 Fase 1

- Home: hero, colecciones, eventos, servicios, tabs departamento, destacados  
- Explorar: categoría ≠ departamento  
- Detalle: hero, verificado, logística, CTA WhatsApp, share, back historial  
- PWA (Serwist), sitemap/robots/OG, covers + `next/image`  
- **No** vuelve la alerta logística personalizada (decisión previa; ver plan §3)

## Próximos pasos (cuando se ejecute)

1. Cerrar soft launch mínimo (#30 → #27 → smoke)  
2. Schema: columnas listing + `sub_eventos` + `aportes_comunidad` + Excel  
3. UI detalle: redes → alojamiento → CTA taquilla → agenda  
4. Social light: favoritos → Mis Guardados → modal aportes  

Detalle y estimaciones: **`docs/mvp-v3-plan.md`**.
