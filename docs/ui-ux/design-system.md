# Design System — Tokens, Paleta y Componentes

Especificación visual y tokens de interfaz implementados en Tailwind CSS.

## 1. Paleta Cromática: "Océano y Arena"

Inspirada en la costa y volcanes de El Salvador:

| Nombre | Rol | Token / Clase | Hex Aprox | Uso |
|---|---|---|---|---|
| **Océano Profundo** | Primario de Marca | `bg-primary`, `text-primary` | `#0f172a` / `#1e3a8a` | Header, títulos principales, fondos de héroes, acentos institucionales. |
| **Azul Taquilla** | Acción Comercial | `bg-blue-600`, `hover:bg-blue-700` | `#2563eb` | Botón "Comprar entradas" en eventos con taquilla online. |
| **Arena / Dorado** | Secundario / Acento | `bg-amber-100`, `text-amber-800` | `#fef3c7` / `#d97706` | Badges de destacados, chips de filtro activo, estrellas/ratings. |
| **Verde WhatsApp** | Contacto por WhatsApp | `text-whatsapp`, `bg-whatsapp` | `#25d366` | Reservado para el icono/enlace directo a WhatsApp (`wa.me`); no usar en controles genéricos. |
| **Gris Fondo** | Canvas / Neutro | `bg-slate-50`, `bg-zinc-100` | `#f8fafc` | Fondo general de la aplicación. |
| **Superficie** | Cards / Modales | `bg-white`, `border-slate-200` | `#ffffff` | Tarjetas de lugares, drawers, sheets y modales. |

## 2. Tipografía y Jerarquía

- **Fuente principal:** `sans-serif` (Inter o Geist Sans optimizada vía `next/font`).
- **H1 (Hero / Títulos de Ficha):** `text-2xl` a `text-3xl font-bold tracking-tight text-slate-900`.
- **H2 (Secciones de Bloques):** `text-lg` a `text-xl font-semibold text-slate-800`.
- **Body:** `text-sm` o `text-base text-slate-600 leading-relaxed`.
- **Metadatos y Etiquetas:** `text-xs font-medium text-slate-500 uppercase tracking-wide`.

## 3. Componentes Base y Patrones

### A. Contacto y compra en la ficha
- WhatsApp se agrupa con Instagram, Facebook y TikTok debajo de la descripción como icono circular accesible.
- Todos los iconos tienen el mismo tamaño y control circular; cada marca conserva su color reconocible.
- Eventos con `ticket_url` válida muestran una tarjeta de compra azul al final del contenido, después de la agenda y los detalles.
- La tarjeta usa superficie blanca, conserva el botón azul y no presenta `ticket_provider` como badge.
- El alojamiento recomendado usa la misma tarjeta blanca y botón azul, con iconografía neutra de hospedaje y una referencia textual a Airbnb solo cuando corresponde.
- La compra no queda fija sobre el viewport ni comparte el espacio con el contacto por WhatsApp.

### B. Chips de Categoría (`CategoryChip`)
- Píldoras redondeadas (`rounded-full px-3.5 py-1.5 text-xs font-medium`).
- Estado inactivo: borde tenue (`border border-slate-200 bg-white text-slate-700`).
- Estado activo: fondo primario o acento con texto contrastante (`bg-slate-900 text-white`).

### C. Cuadrícula Logística 2×2 (Ficha P3)
- 4 bloques de información esencial con iconos Lucide:
  1. Horarios y días hábiles.
  2. Costo / Entrada promedio.
  3. Transporte público (rutas de buses) y privado (tipo de calle/vehículo).
  4. Nivel de accesibilidad física o dificultad.

### D. Badges y Estados
- `Verificado`: Píldora verde/azul con icono de check (`VerifiedIcon`).
- `Favorito`: Icono de corazón (`LucideHeart`) con microinteracción de relleno rojo/rosa (`fill-rose-500 text-rose-500`).

## 4. Pautas para el Panel Administrativo (Desktop-First & Data-Dense)

- **Sidebar Admin:** Fondo neutro oscuro (`bg-slate-900 text-slate-100`) con acentos de selección sutiles (`bg-slate-800 text-white`).
- **Data-Tables:** Componentes `Table` de shadcn/ui con filas compactas (`py-2.5`), cabeceras fijas ordenables y badges de estado (`Publicado`, `Borrador`, `Pendiente`, `Rechazado`).
- **Formularios de Captura:** Distribución a dos o tres columnas en pantallas anchas para evitar scrolling innecesario.
- **Feedback Operativo:** Toasts mediante `sonner` ubicados en `top-right` o `bottom-right` para confirmación inmediata de mutaciones.
