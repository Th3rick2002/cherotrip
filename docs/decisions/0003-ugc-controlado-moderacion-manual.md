# 0003. UGC Controlado con Moderación Manual

- **Fecha:** 24 Octubre 2026
- **Estado:** Aceptado

## Contexto
El alcance inicial establecía "Cero UGC" (sin reseñas públicas, sin comentarios abiertos, sin subida directa de contenido) para proteger la reputación turística de la plataforma y evitar spam o información desactualizada. No obstante, se requiere un mecanismo para que la comunidad sugiera nuevos destinos y eventos.

## Decisión
Habilitar un canal de UGC controlado mediante la tabla `aportes_comunidad`:
- Los envíos desde el modal de la app se guardan con `estado = 'pendiente'`.
- La política RLS para el rol `anon` permite únicamente operaciones `INSERT`. Las lecturas públicas están bloqueadas.
- El equipo editorial/turismo revisa los aportes desde el Dashboard de Supabase y decide si los traslada formalmente al directorio `listings`.

## Consecuencias
- **Positivas:** Se fomenta la participación comunitaria sin riesgo de spam público o degradación de la calidad del contenido.
- **Negativas:** Requiere tiempo operativo de moderación humana periódica.
