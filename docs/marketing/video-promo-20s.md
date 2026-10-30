# Video promocional de Cherotrip — 20 segundos

## Estado

Plan de producción guardado el 2026-10-29. La persona usuaria eligió OpenFilm, pero pidió corregir primero el código y preparar contenido real para que el video muestre el producto en un estado representativo. **No iniciar la producción hasta terminar esas correcciones y revisar el contenido real.**

## Objetivo y mensaje

Crear un video horizontal de 20 segundos para acompañar el pitch de Cherotrip. Debe comunicar que la plataforma ayuda a descubrir y planear lugares y eventos del Oriente de El Salvador, con información útil antes de salir y contacto directo.

Mensaje central propuesto: **“Descubre, planea y vive el Oriente.”**

El video debe sentirse tecnológico y contemporáneo, pero anclado en el turismo y la identidad local. El fondo tech será sutil (mapa, relieve topográfico y rutas), acompañado por imágenes autorizadas de la región y capturas reales de Cherotrip. No se recreará la interfaz con video generativo.

## Storyboard propuesto

| Tiempo | Escena | Texto / acción |
|---|---|---|
| 0–3 s | Paisaje del Oriente y una ruta luminosa sobre un mapa discreto. | “El Oriente tiene mucho por descubrir.” |
| 3–7 s | Interfaz real de Explorar; acercamiento a los filtros de departamentos. | “Encuentra lugares y eventos cerca de ti.” |
| 7–12 s | Ficha real de un lugar; zoom pausado en horario, precio y transporte. | “Conoce los detalles antes de salir.” |
| 12–16 s | Agenda de un evento y acercamiento a la acción de compra o contacto disponible. | “Planea tu visita y contacta directamente.” |
| 16–20 s | El dispositivo se aleja; cierre con logo y una ruta sobre el mapa. | “Cherotrip — Descubre, planea y vive el Oriente.” |

Se limitarán los movimientos de cámara a tres o cuatro acercamientos/paneos suaves, con tiempo suficiente para leer. La propuesta prioriza el ciclo descubrir → decidir → actuar; no intentará listar todas las funciones en veinte segundos.

## Voz y audio

Voz en off propuesta, pendiente de aprobación:

> El Oriente de El Salvador está lleno de lugares por descubrir. Con Cherotrip encuentras qué hacer, consultas detalles y planeas cómo llegar. Explora eventos y contacta directamente. Cherotrip: descubre, planea y vive el Oriente.

Incluir subtítulos para que el mensaje se entienda sin audio. Usar música con licencia o proporcionada por la persona usuaria. No conectar ni usar servicios pagos de generación de voz, música, imagen o video sin autorización expresa; la opción inicial evita costes de generación.

## Flujo de producción

1. **Resolver las correcciones previas de código.** La persona usuaria indicará qué cambios necesita; no asumir ni implementar correcciones por adelantado.
2. **Cargar contenido real y verificado.** Preparar listings y, si corresponde, eventos en los cuatro departamentos habilitados. No insertar datos ficticios en Supabase de producción para hacer la grabación.
3. **Revisar la experiencia resultante.** Confirmar que las páginas y los datos reales se muestran correctamente en móvil antes de grabar.
4. **Preparar assets autorizados.** Logo, capturas o grabación de la UI con datos reales, fotografías/videos de destinos y música si la persona usuaria desea aportarlos. Confirmar derechos de uso del material externo.
5. **Preparar OpenFilm.** En el espacio aislado del video, ejecutar `npx -y openfilm@latest` y seguir el manual que imprime. Mantener el proyecto fuera del código de la aplicación; ubicación propuesta: `media/cherotrip-promo-20s/`.
6. **Componer y revisar en Studio.** Montar las escenas con UI real, fondo animado sutil, títulos, transiciones suaves, voz opcional y subtítulos. Revisar un primer render/preview antes del render final.
7. **Aprobar y exportar.** Exportar el master horizontal 16:9, 1920×1080, 20 segundos. Evaluar un corte 9:16 por separado solo después de aprobar el master, no como un recorte automático.

OpenFilm se usará para controlar la composición, el movimiento y la edición. La UI se obtendrá de capturas/grabación real para conservar textos, botones y contenido fieles. Las escenas de mapa y las líneas de ruta pueden dibujarse como gráficos; no necesitan un generador externo.

## Material pendiente antes de iniciar

- Lista de correcciones de código que la persona usuaria quiere realizar antes del video.
- Listings reales publicados y revisados, incluyendo al menos un lugar y un evento si se quiere mostrar ambas fichas.
- Logo en buena resolución y, si existen, versiones SVG/PNG transparentes.
- Fotografías o clips de lugares que se puedan usar y permiso para utilizarlos; alternativamente, decisión sobre usar solo gráficos y capturas.
- Preferencia final de voz en off o música/texto solamente.

La base de datos MVP se limpió el 2026-10-28 y quedó sin listings, aportes ni archivos de Storage. Por eso no se debe grabar la navegación real hasta que haya contenido publicado y las correcciones previas estén completas.

## Entregables previstos

- Carpeta editable de OpenFilm con composición y assets necesarios.
- Preview para revisión y master MP4 horizontal de 20 segundos.
- Subtítulos en español integrados y legibles sin audio.
- Posible versión vertical 9:16, sujeta a aprobación independiente.

No se incluirán renders o footage pesados en Git sin decidir antes cómo almacenar esos archivos; conservar la composición editable y versionable no implica subir videos de gran tamaño al repositorio.

## Alternativas evaluadas

| Flujo | Ventaja | Consideración |
|---|---|---|
| **OpenFilm** (seleccionado) | Composición a medida, animación de fondo, transiciones y control de zoom sobre la UI real. | Requiere preparar y ajustar la composición. [Sitio oficial](https://openfilm.dev/) |
| **Focra + DaVinci Resolve** | Grabación de pantalla con zooms automáticos editables; Focra ofrece distribuciones para Linux, Windows y macOS. | El estilo de marca y el fondo se añadirían en postproducción. [Focra](https://github.com/focra-app/Focra) |
| **Screen Studio** | Captura de producto con auto-zoom y acabado rápido. | Su sitio lo presenta como herramienta para macOS. [Sitio oficial](https://screenstudio.dev/) |
| **Remotion** | Permite construir videos repetibles y controlar animaciones con código. | Puede ser más preparación de la necesaria para un único video. [Sitio oficial](https://www.remotion.dev/) |
| **Video de destinos + editor tradicional** | Da prioridad a los paisajes y la emoción turística. | Debe conservar algunas tomas reales de Cherotrip para explicar el producto. |

## Criterios creativos

- Respetar la identidad visual existente “Océano y Arena”; el fondo tech no debe convertirse en estética de ciencia ficción.
- Usar una mezcla de imágenes locales y producto real.
- Mantener textos grandes, breves y en zonas seguras para móvil.
- Priorizar legibilidad de horarios, costos, transporte y acciones; evitar zooms veloces o transiciones que tapen datos.
- No incluir etiquetas de “demo” ni inventar que un proveedor, evento o lugar tiene información verificada si no la tiene.
