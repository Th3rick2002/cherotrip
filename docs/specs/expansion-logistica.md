# Especificación Funcional: Expansión Logística (Bloque 2 — v3)

Ampliación de la ficha de detalle para eventos y lugares con información de taquilla, redes oficiales, alojamiento y agenda.

## 1. Motivación

Resolver dudas críticas del viajero antes de trasladarse: cómo comprar entradas oficiales, dónde ver fotos recientes/redes, dónde dormir cerca y cuál es el itinerario detallado de un evento.

## 2. Componentes y Módulos

### A. Redes Oficiales (`SocialLinks`) — Issue #33
- **Campos DB:** `instagram_url`, `facebook_url`, `tiktok_url`, `whatsapp_phone` en `listings`.
- **Formato:** Iconos monocromos discretos en controles circulares de 40 px, con nombres accesibles para lectores de pantalla.
- **Comportamiento:** Renderiza solo los enlaces sociales con URL HTTP(S) válida y añade WhatsApp si hay teléfono válido, construyendo un enlace `wa.me` con mensaje prearmado.
- **Ubicación:** Inmediatamente debajo de la descripción general, antes de la cuadrícula logística.
- **Enlaces:** Abrir en pestaña nueva con `rel="noopener noreferrer"`.

### B. Banner de Alojamiento (`AccommodationBanner`) — Issue #34
- **Campos DB:** `accommodation_url` (URL directa de hospedaje) y/o `accommodation_search_query` (ej. `San-Miguel--El-Salvador`).
- **Precedencia:** `accommodation_url` válida gana; si falta, usar búsqueda Airbnb con el municipio codificado en `/s/{query}/homes`.
- **Comportamiento:** La tarjeta se oculta si no hay URL directa ni consulta de búsqueda válida.
- **Formato:** Tarjeta blanca con icono neutro de hospedaje y botón azul, consistente con la tarjeta de entradas. Menciona Airbnb solo para búsquedas de Airbnb o URLs directas alojadas en ese dominio.
- **Ubicación:** Debajo de la cuadrícula logística, que incluye transporte y accesibilidad.
- **Enlaces:** Abrir en pestaña nueva con `rel="noopener noreferrer"`.

### C. Compra de entradas contextual (`TicketPurchaseCta`) — rediseño
- **Campos DB:** `ticket_url`, `ticket_provider` en `listings`.
- **Regla:** Solo eventos con `ticket_url` HTTP(S) válida muestran la tarjeta blanca "Comprar entradas" con botón azul. No se muestra `ticket_provider` en la interfaz.
- **Ubicación:** Al final del contenido de la ficha, debajo de agenda y detalles; no es sticky.
- **Contacto:** WhatsApp aparece junto a las redes oficiales como icono circular independiente de la acción de compra.
- **Enlaces externos:** Abrir en pestaña nueva con `rel="noopener noreferrer"`.

### D. Agenda Compleja / Sub-eventos (`EventAgenda`) — Issue #36
- **Tablas DB:** `sub_events` (`listing_id`, `event_date`, `start_time`, `end_time`, `title`, `description`, `venue`, `activity_category_id`, `sort_order`) y catálogo normalizado `activity_categories`.
- **Comportamiento:**
  - Si el listing tiene sub-eventos: renderiza pestañas horizontales por fecha (`fecha_dia`).
  - Al seleccionar un día, despliega la línea de tiempo vertical con horas, título, badge de lugar específico y descripción.
  - Si no tiene sub-eventos registrados: no se renderiza el bloque.
