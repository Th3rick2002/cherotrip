# Especificación Funcional: Expansión Logística (Bloque 2 — v3)

Ampliación de la ficha de detalle para eventos y lugares con información de taquilla, redes oficiales, alojamiento y agenda.

## 1. Motivación

Resolver dudas críticas del viajero antes de trasladarse: cómo comprar entradas oficiales, dónde ver fotos recientes/redes, dónde dormir cerca y cuál es el itinerario detallado de un evento.

## 2. Componentes y Módulos

### A. Redes Oficiales (`SocialLinks`) — Issue #33
- **Campos DB:** `link_instagram`, `link_facebook`, `link_tiktok` en `listings`.
- **Comportamiento:** Renderiza iconos enlazados directamente a los perfiles oficiales. Si todos son nulos, el contenedor no ocupa espacio.
- **Ubicación:** Inmediatamente debajo de la descripción general, antes de la cuadrícula logística.

### B. Banner de Alojamiento (`AccommodationBanner`) — Issue #34
- **Campos DB:** `link_alojamiento` (URL directa hotel/Airbnb) y/o `municipio_busqueda` (ej. `San-Miguel--El-Salvador`).
- **Comportamiento:** Si existe link directo, redirige a la estancia sugerida; si existe `municipio_busqueda`, genera enlace dinámico de búsqueda en Airbnb/plataforma.
- **Ubicación:** Bajo la sección de transporte y accesibilidad.

### C. CTA Dinámico Taquilla vs WhatsApp (`DetailCta`) — Issue #35
- **Campos DB:** `link_taquilla`, `proveedor_taquilla` en `listings`.
- **Regla:**
  - Si `link_taquilla` está definido: botón primario azul "Comprar entradas" (`target="_blank"` a la ticketera).
  - Si no existe: botón primario verde oficial de WhatsApp (`wa.me`).
- **Restricción:** No mostrar ambos como botón primario sticky simultáneo para evitar parálisis de decisión en el usuario.

### D. Agenda Compleja / Sub-eventos (`EventAgenda`) — Issue #36
- **Tabla DB:** `sub_eventos` (`listing_id`, `fecha_dia`, `hora_inicio`, `hora_fin`, `titulo_actividad`, `descripcion_breve`, `lugar_especifico`, `tipo_actividad`, `sort_order`).
- **Comportamiento:**
  - Si el listing tiene sub-eventos: renderiza pestañas horizontales por fecha (`fecha_dia`).
  - Al seleccionar un día, despliega la línea de tiempo vertical con horas, título, badge de lugar específico y descripción.
  - Si no tiene sub-eventos registrados: no se renderiza el bloque.
