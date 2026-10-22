-- Enriquece tags para colecciones rápidas del Home

update public.listings
set tags = array(
  select distinct unnest(tags || array['Mochilero'])
)
where slug in (
  'senderismo-cerro-cacahuatique',
  'amanecer-en-conchagua',
  'ruta-del-cafe-morazan'
);

update public.listings
set tags = array(
  select distinct unnest(tags || array['Familiar'])
)
where slug in (
  'playa-el-espino',
  'playa-el-cuco',
  'festival-gastronomico-la-union'
)
and not ('Familiar' = any (tags));

update public.listings
set
  transport_info = coalesce(transport_info, '') ||
    case
      when transport_info is null or transport_info = '' then 'Buses frecuentes'
      when transport_info ilike '%bus%' then ''
      else ' · Acceso en bus'
    end,
  description = description ||
    case
      when description ilike '%bus%' then ''
      else E'\n\nHay rutas de bus cercanas según temporada.'
    end
where slug in ('playa-el-cuco', 'playa-el-espino');

update public.listings
set tags = array(
  select distinct unnest(tags || array['Camping'])
)
where slug = 'senderismo-cerro-cacahuatique'
and not ('Camping' = any (tags));
