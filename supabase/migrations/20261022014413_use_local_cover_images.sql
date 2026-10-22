-- Covers locales servidas desde /public/covers (evita timeouts de Unsplash)

update public.listings
set cover_image_url = '/covers/' || slug || '.jpg'
where slug in (
  'senderismo-cerro-cacahuatique',
  'kayak-bahia-de-jiquilisco',
  'festival-gastronomico-la-union',
  'amanecer-en-conchagua',
  'playa-el-espino',
  'laguna-de-alegria',
  'golfo-de-fonseca',
  'ruta-del-cafe-morazan',
  'comida-tipica-san-miguel',
  'playa-el-cuco'
);
