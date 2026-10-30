# Feedback visual e interacciones

Guía de los estados visuales de carga y acción en Cherotrip. Se aplica junto con [`design-system.md`](./design-system.md) y [`screens.md`](./screens.md).

## Principios

- Toda acción que pueda tardar debe confirmar que comenzó, bloquear envíos repetidos y comunicar el resultado disponible.
- Usar skeleton cuando se espera contenido de una ruta o bloque. Para mutaciones puntuales, mantener el contenido visible y cambiar el botón a estado pendiente con spinner y texto.
- Los controles interactivos muestran cursor de acción y una respuesta breve al pulsar.
- Respetar `prefers-reduced-motion`: las animaciones de pulsación se desactivan y las transiciones se reducen.
- Mantener el contenido legible mientras carga; el feedback no debe reemplazar toda la pantalla por un indicador genérico.

## Implementación actual

### Cargas

- `/admin/*` muestra placeholders skeleton para la página, la navegación y la sección de cuenta del sidebar. La navegación tiene un límite `Suspense` porque `AdminNav` lee la ruta actual con `usePathname()`.
- Home, Explorar y las fichas públicas ya usan skeletons en sus límites `Suspense`.
- Los formularios del panel mantienen sus campos visibles. Sus acciones muestran spinner, texto pendiente y botón deshabilitado hasta completar la operación.
- El estado de carga se aplica a los formularios de lugares/eventos, categorías, contenido rápido de Home, aliados, moderación de aportes y cierre de sesión.
- Subir portada muestra `Subiendo…`. Al copiar una foto privada de un aporte se bloquea la acción durante la preparación y la subida.
- El buscador de Explorar muestra `Buscando…` y deshabilita su botón durante la navegación.

### Respuesta de controles

- Enlaces, botones y controles con `role="button"` usan cursor de acción.
- Al pulsar, los controles aplican una escala breve (`0.98`) con transición de 150 ms.
- Se mantiene una transición corta de color, fondo, borde, opacidad, sombra y transformación para hover/press.
- Los controles deshabilitados no muestran cursor de acción; las acciones pendientes usan cursor de espera.
- La animación de pulsación se elimina si el sistema solicita movimiento reducido.

Estas son microinteracciones de controles. Las transiciones entre rutas o la entrada animada de secciones no están implementadas; pueden agregarse después sin rehacer los formularios ni el sistema de carga. Conviene introducirlas de manera acotada y conservar los skeletons como feedback de espera.

### Explorador

- El campo de búsqueda incluye un botón explícito **Buscar**.
- Al enviar, navega a Explorar con el término `q`; durante la navegación, el botón pasa a **Buscando…**.
- Los resultados conservan su skeleton existente mientras se actualizan.

### Ficha de lugar o evento

- La sección informativa se titula **Información importante para tu visita** porque puede incluir restricciones, horarios, recomendaciones de edad y condiciones generales.
- Su contenido se presenta como lista formal. En el CMS, se recomienda registrar cada elemento en una línea; las líneas, viñetas y puntos y coma se separan al mostrarlo.
- En lugares, **Servicios en la zona** aparece después del resto del contenido de la ficha.
- Cada aliado, anuncio o patrocinador tiene un color propio y una etiqueta separada del nombre del negocio para evitar colisiones con nombres largos.

## QA manual pendiente

- En escritorio y móvil, comprobar skeletons durante navegación y cargas lentas.
- En cada formulario del CMS, hacer doble clic al enviar y confirmar que solo se inicia una acción y que el botón se recupera al terminar.
- Comprobar moderación y carga/copia de portadas con errores de red.
- Revisar títulos largos de aliados, listas de información y búsqueda con teclado y botón.
- Verificar la respuesta de pulsación con movimiento reducido habilitado.
