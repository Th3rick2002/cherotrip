-- QA fixtures for listing detail issues #33–#35.
-- Loaded locally by `supabase start` / `supabase db reset`; inserts never update an existing listing.

insert into public.listings (
  slug,
  type,
  title,
  description,
  department,
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
  'San Miguel',
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
  department,
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
  'Sonsonate',
  'Ruta de las Flores',
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
  department,
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
  'La Libertad',
  'Puerto de La Libertad',
  '50370000000',
  false,
  false,
  true,
  now()
)
on conflict (slug) do nothing;
