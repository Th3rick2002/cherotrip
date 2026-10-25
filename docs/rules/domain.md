# Reglas de Dominio y Negocio

Reglas del modelo conceptual y turístico de Cherotrip para El Salvador.

## 1. Misión del Producto

Cherotrip es una plataforma móvil y web para descubrir lugares turísticos y eventos en El Salvador, resolviendo de forma transparente la **logística previa a la visita** (cómo llegar, costos, horarios reales, contacto directo y compra de entradas).

## 2. Entidades Principales

### A. Listings (`listings`)
Unidad atómica del directorio. Puede ser de dos subtipos:
1. **Lugar (`tipo = 'lugar'`):**
   - Destino permanente (playa, parque arqueológico, cascada, mirador, restaurante icónico).
   - Horarios habituales semanales (`horarios`).
   - Requiere información de transporte público y privado.
2. **Evento (`tipo = 'evento'`):**
   - Actividad con rango de fechas (`fecha_inicio`, `fecha_fin`).
   - Puede ser de un solo día o multi-día (festivales, fiestas patronales).
   - Puede asociar una agenda detallada mediante `sub_eventos`.

### B. Sub-eventos (`sub_eventos`)
- Actividades específicas dentro de un evento paraguas (ej. desfile, concierto de cierre, feria gastronómica).
- Relacionado a un `listing_id` con `fecha_dia`, `hora_inicio`, `hora_fin`, `lugar_especifico` y `sort_order`.

### C. Aportes de la Comunidad (`aportes_comunidad`)
- Formulario ciudadano anónimo para recomendar sitios o reportar datos.
- Estados de moderación: `pendiente` (default), `aprobado`, `rechazado`.
- Nunca se publica directamente en el directorio sin revisión editorial.

## 3. Geografía y Clasificación (El Salvador)

- **14 Departamentos:**
  - **Zona Occidental:** Ahuachapán, Santa Ana, Sonsonate.
  - **Zona Central:** La Libertad, Chalatenango, Cuscatlán, San Salvador.
  - **Zona Paracentral:** La Paz, Cabañas, San Vicente.
  - **Zona Oriental:** Usulután, San Miguel, Morazán, La Unión.
- **Categorías transversales:**
  - Playas / Surf, Montaña / Volcanes, Pueblos Vivos, Gastronomía, Cultura / Historia, Vida Nocturna.
- **Regla de filtrado:** Categoría y Departamento son ejes ortogonales e independientes.

## 4. Reglas de Conversión y Enlaces

1. **Prioridad de CTA en Detalle:**
   - Si el listing cuenta con `link_taquilla` activo: el botón primario sticky es **"Comprar entradas"** (azul taquilla, con badge de proveedor si aplica).
   - Si no hay taquilla: el botón primario sticky es **WhatsApp directo** (verde oficial con mensaje pre-rellenado amigable).
   - Nunca mostrar dos botones primarios compitiendo en el sticky móvil.
2. **Alojamiento contextual:**
   - Si cuenta con `link_alojamiento` o `municipio_busqueda`: mostrar banner de Airbnb/Booking en la sección de logística sin opacar la llamada a la acción principal.
3. **Cero fricción de autenticación:**
   - Todo visitante puede explorar, filtrar, ver logística, guardar en favoritos (`localStorage`) y enviar aportes sin necesidad de crear cuenta o iniciar sesión.
