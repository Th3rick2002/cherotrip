# Cherotrip — Mapa de Documentación

Directorio turístico y agenda cultural de El Salvador. Enfocado en conversión rápida (WhatsApp/Taquilla), experiencia móvil PWA y logística transparente.

## Estructura

- [`rules/`](./rules/): Convenciones de código y reglas de negocio del dominio.
  - [`coding.md`](./rules/coding.md) · Estándares de TypeScript, Next.js 15 y Tailwind.
  - [`domain.md`](./rules/domain.md) · Modelo turístico, departamentos, tipos de listing y logística.
- [`ui-ux/`](./ui-ux/): Sistema de diseño y especificación de interfaces.
  - [`design-system.md`](./ui-ux/design-system.md) · Paleta Océano/Arena, tokens y componentes.
  - [`screens.md`](./ui-ux/screens.md) · P1 Home, P2 Explorar, P3 Detalle y navegación.
- [`specs/`](./specs/): Especificaciones funcionales por módulo.
  - [`directorio-core.md`](./specs/directorio-core.md) · Buscador, directorio y ficha base.
  - [`expansion-logistica.md`](./specs/expansion-logistica.md) · Redes, alojamiento, taquilla y agenda.
  - [`social-light.md`](./specs/social-light.md) · Favoritos offline y aportes ciudadanos.
  - [`admin-cms.md`](./specs/admin-cms.md) · Panel administrativo privado y moderación.
- [`decisions/`](./decisions/): Architectural Decision Records (ADRs) vigentes.
- [`changes/`](./changes/): Bitácora narrativa de versiones y evoluciones.
- [`state/`](./state/): Estado operativo y paquete de reanudación.
  - [`HANDOFF.md`](./state/HANDOFF.md) · Onboarding rápido para agentes y desarrolladores.
  - [`DONE.md`](./state/DONE.md) · Funcionalidades desplegadas.
  - [`TODO.md`](./state/TODO.md) · Backlog activo priorizado.
  - [`WONTDO.md`](./state/WONTDO.md) · Exclusiones intencionales del MVP.
