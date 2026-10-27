# Especificaciones Funcionales — Índice

Listado de especificaciones funcionales por módulo y fase de Cherotrip.

## Módulos y Estado

| Especificación | Estado | Bloque / Fase | Documento |
|---|---|---|---|
| **Directorio Core** | ✅ Implementado (Prod) | Fase 1 | [`directorio-core.md`](./directorio-core.md) |
| **Expansión Logística** | 🟡 En Desarrollo (Issue #36) | Bloque 2 (v3) | [`expansion-logistica.md`](./expansion-logistica.md) |
| **Social Light** | 🟡 Planificado (Issues #37–#39) | Bloque 3 (v3) | [`social-light.md`](./social-light.md) |
| **Panel Administrativo (CMS)** | 🟡 CRUD, catálogos, Home y moderación implementados localmente; falta migración remota y QA (#43–#44) | Bloque 4 (v3) | [`admin-cms.md`](./admin-cms.md) |

## Criterios de Aceptación Globales

- La app pública se mantiene Mobile-First, PWA y libre de autenticación.
- El panel `/admin` es Desktop-First, Data-Dense y estrictamente protegido por Supabase Auth.
- Cero regresiones en tiempos de carga en la aplicación pública.
