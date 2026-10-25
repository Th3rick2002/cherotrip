# Exclusiones de Alcance (WONT DO)

Listado explícito de funcionalidades que quedan fuera del alcance del MVP y v3.0, con su respectiva justificación técnica y de producto.

---

### 1. Autenticación y Cuentas para Usuarios Finales (Público)
- **Motivo:** Obligar a los visitantes a registrarse reduce drásticamente la tasa de conversión en usuarios móviles. La experiencia pública es 100% abierta y los favoritos se resuelven en el cliente con `localStorage`.
- **Estatus:** Fuera de alcance para usuarios finales (el acceso autenticado existe únicamente para administradores internos en `/admin/login`).

### 2. Flujo Manual de Carga vía Plantillas Excel (Issue #32)
- **Motivo:** Propensión a errores de formato humano, falta de validación de URLs y multimedia en tiempo real, y riesgo de inconsistencias en Supabase.
- **Estatus:** Descartado formalmente (superseded) en favor del **Panel Administrativo Interno (CMS)** en `/admin`.

### 3. Comentarios Públicos Abiertos sin Moderación
- **Motivo:** Riesgo severo de spam, lenguaje inapropiado y recomendaciones obsoletas que dañarían la confianza del turista.
- **Estatus:** Reemplazado por **UGC controlado** (`aportes_comunidad`), donde todo envío pasa por moderación editorial interna en el CMS antes de publicarse.

### 4. Mapas Nativos Embebidos (Google Maps SDK / Mapbox GL)
- **Motivo:** Los SDKs de mapas pesados degradan de forma crítica el First Contentful Paint (FCP) y el Largest Contentful Paint (LCP) en redes móviles 3G/4G, además de implicar costos recurrentes de API.
- **Estatus:** Fuera de alcance. Se proveen indicaciones de transporte claras y enlaces salientes directos a Google Maps o Waze cuando el usuario lo solicita.

### 5. Alerta Logística Dinámica Personalizada en Home
- **Motivo:** Sin cuentas de usuario ni geolocalización continua en segundo plano, una alerta "inteligente" no aporta valor real y puede inducir a error.
- **Estatus:** Se mantienen tips editoriales globales o servicios rápidos fijos; no se implementará motor de alertas personalizadas.

### 6. Notificaciones Push Nativas del Navegador
- **Motivo:** Solicitar permisos de notificación inmediatamente al entrar suele ahuyentar al visitante y requiere infraestructura de servidor push dedicada.
- **Estatus:** Fuera de alcance en esta fase.
