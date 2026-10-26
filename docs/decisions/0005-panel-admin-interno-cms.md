# 0005. Panel Administrativo Interno (CMS) vs Flujo de Excel

- **Fecha:** 25 Octubre 2026
- **Estado:** Aceptado

## Contexto
Originalmente se planificó que el equipo de Turismo y Mercadotecnia gestionara los datos de listings y eventos a través de una plantilla Excel compartida (`docs/templates/cherotrip-plantilla-listings.xlsx`) que requería procesos periódicos de importación a Supabase (Issue #32).
Este enfoque presentaba fricciones operativas: errores de formato humano en hojas de cálculo, falta de validación inmediata de URLs/imágenes, necesidad de scripts manuales de sincronización y riesgo de sobrescritura de datos en producción.

## Decisión
1. **Cancelar la Issue #32 (plantilla Excel)** y descartar el flujo de carga por hojas de cálculo.
2. Desarrollar un **Panel Administrativo Interno (CMS)** integrado en Next.js bajo la ruta protegida `/admin/*`:
   - Autenticación con **Supabase Auth** (Email y Contraseña) con creación manual de cuentas internas (sin registro público).
   - Middleware de protección estricto en `/admin/*`.
   - Data-Tables de `shadcn/ui` y formularios validados con `zod` y `react-hook-form`.
   - Subida y almacenamiento de imágenes en **Supabase Storage** (bucket `listing-covers`).
   - Bandeja visual para moderar y aprobar los aportes comunitarios (`aportes_comunidad`).

## Consecuencias
- **Positivas:** Autonomía total para Turismo y Mercadotecnia; validación instantánea de campos; eliminación de scripts de carga; flujo de moderación de UGC natural.
- **Negativas:** Demanda la creación de las interfaces administrativas en Next.js (Issues #41 a #44).
