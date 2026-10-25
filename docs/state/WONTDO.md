# Exclusiones de Alcance (WONT DO)

Listado explícito de funcionalidades que quedan fuera del alcance del MVP y v3.0, con su respectiva justificación técnica y de producto.

---

### 1. Autenticación, Login y Perfiles de Usuario
- **Motivo:** Obligar a iniciar sesión reduce drásticamente la tasa de conversión en usuarios móviles ocasionales. Para el MVP, la experiencia es 100% abierta y los favoritos se resuelven en el cliente con `localStorage`.
- **Estatus:** Fuera de alcance (reevaluar en Fase 4 o post-MVP).

### 2. Comentarios Públicos Abiertos sin Moderación
- **Motivo:** Riesgo severo de spam, lenguaje inapropiado y recomendaciones obsoletas que dañarían la confianza del turista.
- **Estatus:** Reemplazado por **UGC controlado** (`aportes_comunidad`), donde todo envío pasa por moderación editorial interna antes de publicarse.

### 3. Mapas Nativos Embebidos (Google Maps SDK / Mapbox GL)
- **Motivo:** Los SDKs de mapas pesados degradan de forma crítica el First Contentful Paint (FCP) y el Largest Contentful Paint (LCP) en redes móviles 3G/4G, además de implicar costos recurrentes de API.
- **Estatus:** Fuera de alcance. Se proveen indicaciones de transporte claras y enlaces salientes directos a Google Maps o Waze cuando el usuario lo solicita.

### 4. Panel de Administración Custom (Backoffice UI)
- **Motivo:** Construir un panel administrativo a la medida demanda semanas de esfuerzo que no aportan valor directo al usuario final en la etapa de validación.
- **Estatus:** Toda la administración editorial se realiza mediante el **Dashboard de Supabase** y la importación de plantillas Excel estructuradas.

### 5. Alerta Logística Dinámica Personalizada en Home
- **Motivo:** Sin cuentas de usuario ni geolocalización continua en segundo plano, una alerta "inteligente" no aporta valor real y puede inducir a error.
- **Estatus:** Se mantienen tips editoriales globales o servicios rápidos fijos; no se implementará motor de alertas personalizadas.

### 6. Notificaciones Push Nativas del Navegador
- **Motivo:** Solicitar permisos de notificación inmediatamente al entrar suele ahuyentar al visitante y requiere infraestructura de servidor push dedicada.
- **Estatus:** Fuera de alcance en esta fase.
