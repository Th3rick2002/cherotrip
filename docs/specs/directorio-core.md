# Especificación Funcional: Directorio Core (Fase 1)

Documentación del núcleo de descubrimiento, filtrado y detalle de Cherotrip.

## 1. Alcance y Funcionalidades

### A. Buscador Predictivo
- Permite buscar listings por texto en nombre, descripción y departamento.
- Redirige desde el Home a la pantalla de Explorar conservando el parámetro de búsqueda (`?q=...`).

### B. Directorio y Filtros Ortogonales
- **Filtro por Departamento:** 14 departamentos de El Salvador.
- **Filtro por Categoría:** Chips dinámicos cargados desde la tabla `categories`.
- Posibilidad de filtrar simultáneamente por ambos criterios o de manera aislada.

### C. Ficha de Detalle (Slug-Based)
- URLs amigables SEO: `/lugar/[slug]` y `/evento/[slug]`.
- Generación de metadatos estáticos y dinámicos Open Graph para compartir en redes sociales y WhatsApp.
- Botón de retroceso inteligente (`BackButton`): utiliza `router.back()` si hay historial, o redirige a `/explorar`.
- Botón nativo de compartir (`ShareButton`): utiliza `navigator.share()` en móviles o copia el enlace al portapapeles en desktop.

### D. Lead a WhatsApp
- Generación de enlace `https://wa.me/{telefono}?text={mensaje}` codificado.
- Mensaje pre-llenado con el nombre del listing para que el negocio sepa de inmediato de dónde proviene la consulta.

### E. PWA e Instalación
- Service Worker generado por Serwist (`@serwist/next`).
- Manifest web válido (`app/manifest.ts`) con iconos adaptables, splash screen y colores de tema.
- Pantalla fallback offline (`app/~offline`) ante pérdida total de conectividad.
