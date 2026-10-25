# 0002. Favoritos 100% en Cliente (localStorage) sin Autenticación

- **Fecha:** 24 Octubre 2026
- **Estado:** Aceptado

## Contexto
El plan original de MVP excluía completamente la funcionalidad de "Mis Guardados" para evitar construir un sistema de usuarios (login, contraseñas, recuperación, tablas de perfiles, cookies de sesión). Sin embargo, los usuarios en campo necesitan guardar lugares para armar sus rutas de viaje.

## Decisión
Implementar favoritos guardados exclusivamente en el navegador del usuario utilizando `localStorage` y un hook React `useFavorites`:
- No se requiere crear cuenta ni registrar correo.
- La pantalla "Mis Guardados" lee los IDs locales y consulta los datos en Supabase.
- No se persisten favoritos en base de datos centralizada.

## Consecuencias
- **Positivas:** Cero fricción de conversión; cero costos y complejidad de autenticación en el MVP; privacidad total para el viajero.
- **Negativas:** Los favoritos no se sincronizan entre diferentes dispositivos del usuario y se pierden si borra los datos del navegador.
