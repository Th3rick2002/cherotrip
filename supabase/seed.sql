-- QA fixtures for listing detail and social-light issues #33–#40.
-- Loaded locally by `supabase start` / `supabase db reset`; inserts never update existing fixtures.

insert into public.listings (
  slug,
  type,
  title,
  description,
  department_id,
  meeting_point,
  instagram_url,
  facebook_url,
  tiktok_url,
  ticket_url,
  ticket_provider,
  accommodation_url,
  accommodation_search_query,
  whatsapp_phone,
  verified,
  featured,
  is_published,
  published_at
)
values (
  'qa-v3-ticket-social-accommodation',
  'event',
  '[QA] Evento con taquilla, redes y alojamiento directo',
  'Fixture de QA para comprobar los enlaces sociales, la prioridad de taquilla y el enlace directo de alojamiento.',
  (select id from public.departments where slug = 'san-miguel'),
  'Centro de San Miguel',
  'https://example.com/qa/instagram',
  'https://example.com/qa/facebook',
  'https://example.com/qa/tiktok',
  'https://example.com/qa/tickets',
  'Demo tickets',
  'https://example.com/qa/accommodation',
  'San-Miguel--El-Salvador',
  '50370000000',
  false,
  false,
  true,
  now()
)
on conflict (slug) do nothing;

insert into public.listings (
  slug,
  type,
  title,
  description,
  department_id,
  meeting_point,
  starts_at,
  ends_at,
  whatsapp_phone,
  verified,
  featured,
  is_published,
  published_at
)
values (
  'qa-v3-event-agenda',
  'event',
  '[QA] Festival de dos días con agenda',
  'Fixture de QA para alternar días y revisar horarios, categorías y sedes de una agenda multi-día.',
  (select id from public.departments where slug = 'san-miguel'),
  'Parque central de San Miguel',
  '2026-11-07 10:00:00-06',
  '2026-11-08 23:00:00-06',
  '50370000000',
  false,
  false,
  true,
  now()
)
on conflict (slug) do nothing;

insert into public.sub_events (
  listing_id,
  event_date,
  start_time,
  end_time,
  title,
  description,
  venue,
  activity_category_id,
  sort_order
)
select
  l.id,
  fixture.event_date,
  fixture.start_time,
  fixture.end_time,
  fixture.title,
  fixture.description,
  fixture.venue,
  c.id,
  fixture.sort_order
from public.listings l
cross join (values
  ('2026-11-07'::date, '10:00'::time, '11:00'::time, 'Bienvenida e inauguración', 'Inicio del festival y presentación de actividades.', 'Escenario principal', 'ceremony-tradition', 10),
  ('2026-11-07'::date, '12:30'::time, '14:00'::time, 'Muestra gastronómica', 'Sabores y platillos de la zona oriental.', 'Plaza de comidas', 'food-gastronomy', 20),
  ('2026-11-08'::date, '18:00'::time, '20:00'::time, 'Concierto de cierre', 'Presentación musical para cerrar el festival.', 'Escenario principal', 'music-concert', 10)
) as fixture(event_date, start_time, end_time, title, description, venue, category_slug, sort_order)
join public.activity_categories c on c.slug = fixture.category_slug
where l.slug = 'qa-v3-event-agenda'
  and not exists (
    select 1
    from public.sub_events existing
    where existing.listing_id = l.id
      and existing.event_date = fixture.event_date
      and existing.title = fixture.title
  );

insert into public.listings (
  slug,
  type,
  title,
  description,
  department_id,
  meeting_point,
  facebook_url,
  accommodation_search_query,
  whatsapp_phone,
  verified,
  featured,
  is_published,
  published_at
)
values (
  'qa-v3-airbnb-search-whatsapp',
  'place',
  '[QA] Alojamiento por búsqueda y WhatsApp',
  'Fixture de QA para comprobar la búsqueda de alojamiento y el CTA de WhatsApp cuando no hay taquilla.',
  (select id from public.departments where slug = 'usulutan'),
  'Usulután',
  'https://example.com/qa/facebook',
  'Ruta-de-las-Flores--El-Salvador',
  '50370000000',
  false,
  false,
  true,
  now()
)
on conflict (slug) do nothing;

insert into public.listings (
  slug,
  type,
  title,
  description,
  department_id,
  meeting_point,
  whatsapp_phone,
  verified,
  featured,
  is_published,
  published_at
)
values (
  'qa-v3-no-optional-links',
  'place',
  '[QA] Sin enlaces opcionales',
  'Fixture de QA para comprobar que las secciones opcionales se ocultan cuando no hay datos.',
  (select id from public.departments where slug = 'la-union'),
  'Puerto de La Unión',
  '50370000000',
  false,
  false,
  true,
  now()
)
on conflict (slug) do nothing;
