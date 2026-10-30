# Reglas de Dominio y Negocio

Reglas del modelo conceptual y turístico de Cherotrip para El Salvador.

## 1. Misión del Producto

Cherotrip es una plataforma móvil y web para descubrir lugares turísticos y eventos en El Salvador, resolviendo de forma transparente la **logística previa a la visita** (cómo llegar, costos, horarios reales, contacto directo y compra de entradas).

## 2. Entidades Principales

### A. Listings (`listings`)
Unidad atómica del directorio. Puede ser de dos subtipos:
1. **Lugar (`type = 'place'`):**
   - Destino permanente (playa, parque arqueológico, cascada, mirador, restaurante icónico).
   - Horarios habituales (`schedule_text`).
   - Requiere información de transporte público y privado.
2. **Evento (`type = 'event'`):**
   - Actividad con rango de fechas (`starts_at`, `ends_at`).
   - Puede ser de un solo día o multi-día (festivales, fiestas patronales).
   - Puede asociar una agenda detallada mediante `sub_events`.

### B. Sub-eventos (`sub_events`)
- Actividades específicas dentro de un evento paraguas (ej. desfile, concierto de cierre, feria gastronómica).
- Relacionados a un `listing_id` con `event_date`, `start_time`, `end_time`, `venue`, `activity_category_id` y `sort_order`.

### C. Aportes de la Comunidad (`community_submissions`)
- Formulario ciudadano anónimo para recomendar sitios o reportar datos.
- Acepta `listing_type = 'place'` o `'event'`, `title`, `department_id`, descripción, detalles logísticos según el tipo, `photo_path` y `contact_optional` privado.
- Estados de moderación: `pending` (default), `approved`, `rejected`.
- Nunca se publica directamente en el directorio sin revisión editorial.

### D. Aliados y patrocinios (`partners`, `listing_partners`)
- Cada negocio puede asociarse a uno o más lugares.
- `relationship_type = 'editorial'` se muestra como «Aliado local»; `paid_marketing` y `sponsor` se identifican como «Patrocinado».
- Descuentos, atribución de compras referidas, contratos e ingresos quedan fuera hasta acordar sus reglas.

Los listings de lugar y evento comparten `public.listings` y se separan por `type`. Las categorías editoriales viven en `categories` y se relacionan por `listing_categories`; `category_listing_types` define si cada categoría aplica a lugares, eventos o ambos. La agenda usa su catálogo aparte `activity_categories`.

## 3. Geografía y Clasificación (El Salvador)

- **Departamentos activos iniciales del MVP:** San Miguel, Usulután, La Unión y Morazán.
- Los departamentos se gestionan en `public.departments`; listings y aportes guardan `department_id` como clave foránea. Los formularios y filtros consultan las filas activas del catálogo.
- Se pueden agregar departamentos insertando filas al catálogo. Para dejar de ofrecer uno sin perder su historial, se marca `is_active = false`.
- **Categorías transversales:**
  - Playas / Surf, Montaña / Volcanes, Pueblos Vivos, Gastronomía, Cultura / Historia, Vida Nocturna.
- **Regla de filtrado:** Categoría y Departamento son ejes ortogonales e independientes.

## 4. Reglas de Conversión y Enlaces

1. **Prioridad de CTA en Detalle:**
   - Si el listing cuenta con `ticket_url` válida: el botón primario sticky es **"Comprar entradas"** (azul taquilla, con badge `ticket_provider` si aplica).
   - Si no hay taquilla: el botón primario sticky es **WhatsApp directo** (verde oficial con mensaje pre-rellenado amigable).
   - Nunca mostrar dos botones primarios compitiendo en el sticky móvil.
2. **Alojamiento contextual:**
   - Si cuenta con `accommodation_url` o `accommodation_search_query`: mostrar banner de alojamiento en la sección de logística sin opacar la llamada a la acción principal. El link directo tiene prioridad; la búsqueda usa Airbnb por defecto.
3. **Cero fricción de autenticación:**
   - Todo visitante puede explorar, filtrar, ver logística, guardar en favoritos (`localStorage`) y enviar aportes sin necesidad de crear cuenta o iniciar sesión.
