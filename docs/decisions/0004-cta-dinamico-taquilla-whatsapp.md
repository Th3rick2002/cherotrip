# 0004. Prioridad de CTA: Taquilla sobre WhatsApp

- **Fecha:** 24 Octubre 2026
- **Estado:** Aceptado

## Contexto
En la Fase 1, la ficha de detalle contaba con un único botón fijo en móvil dirigido a WhatsApp. En la expansión logística (v3), surgen eventos con venta formal de boletos digitales (Ticketshow, Todoticket, etc.) donde el canal primario de conversión debe ser la ticketera.

## Decisión
Convertir el CTA fijo en un componente condicional (`DetailCta`):
- Si el evento posee `link_taquilla`: el botón principal es "Comprar entradas" (azul, hacia la boletería).
- Si no posee taquilla: el botón principal es WhatsApp directo (verde oficial).
- Se prohíbe presentar dos botones primarios compitiendo en el sticky bar móvil para asegurar una jerarquía visual limpia.

## Consecuencias
- **Positivas:** Mayor tasa de conversión en eventos comerciales sin saturar la atención por chat cuando la compra es autoservicio.
- **Negativas:** Menos consultas por WhatsApp en eventos que dispongan de taquilla online.
