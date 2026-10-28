-- ONE-TIME DATA CLEANUP for the dedicated MVP Supabase project.
-- Run only after reviewing the target project. This deletes all content rows
-- and restores only the canonical catalogs. It deliberately does not touch
-- auth.users or public.admin_users.
-- Storage objects must be removed separately through Supabase Storage API or
-- Dashboard; never delete storage.objects rows directly.

begin;

delete from public.community_submissions;
delete from public.listings;

-- Restore the three editorial categories while retaining their existing IDs.
insert into public.categories (slug, name, icon, sort_order)
values
  ('aventura', 'Aventura', 'hiking', 10),
  ('playa', 'Playa', 'waves', 20),
  ('gastronomia', 'Gastronomía', 'utensils', 30)
on conflict (slug) do update
set name = excluded.name,
    icon = excluded.icon,
    sort_order = excluded.sort_order,
    is_active = true;

delete from public.category_listing_types;
delete from public.categories
where slug not in ('aventura', 'playa', 'gastronomia');

insert into public.category_listing_types (category_id, listing_type)
select c.id, t.listing_type::public.listing_type
from public.categories c
cross join (values ('place'), ('event')) as t(listing_type)
where c.slug in ('aventura', 'playa', 'gastronomia');

-- Preserve the canonical activity categories used by event agendas.
insert into public.activity_categories (slug, name, sort_order, is_active)
values
  ('music-concert', 'Música / concierto', 10, true),
  ('dance-parade', 'Danza / desfile', 20, true),
  ('theater', 'Teatro', 30, true),
  ('sports', 'Deportes', 40, true),
  ('fair-exhibition', 'Feria / exhibición', 50, true),
  ('food-gastronomy', 'Gastronomía', 60, true),
  ('ceremony-tradition', 'Ceremonia / tradición', 70, true),
  ('workshop-kids', 'Taller / actividad infantil', 80, true),
  ('other', 'Otro', 90, true)
on conflict (slug) do update
set name = excluded.name,
    sort_order = excluded.sort_order,
    is_active = true;

delete from public.activity_categories
where slug not in (
  'music-concert', 'dance-parade', 'theater', 'sports',
  'fair-exhibition', 'food-gastronomy', 'ceremony-tradition',
  'workshop-kids', 'other'
);

-- Restore the editable Home shortcuts used by the MVP.
insert into public.home_quick_links
  (slug, section, label, icon_key, target_kind, target_value, sort_order, is_active)
values
  ('mochilero', 'collection', 'Mochilero', 'backpack', 'tag', 'Mochilero', 10, true),
  ('familiar', 'collection', 'Familiar', 'users', 'tag', 'Familiar', 20, true),
  ('aventura-4x4', 'collection', 'Aventura 4x4', 'mountain', 'search', '4x4', 30, true),
  ('buses', 'service', 'Rutas de buses', 'bus', 'search', 'bus', 10, true),
  ('lancheros', 'service', 'Lancheros', 'ship', 'search', 'lancha', 20, true),
  ('camping', 'service', 'Zonas de camping', 'tent', 'tag', 'Camping', 30, true)
on conflict (slug) do update
set section = excluded.section,
    label = excluded.label,
    icon_key = excluded.icon_key,
    target_kind = excluded.target_kind,
    target_value = excluded.target_value,
    sort_order = excluded.sort_order,
    is_active = true,
    updated_at = now();

delete from public.home_quick_links
where slug not in ('mochilero', 'familiar', 'aventura-4x4', 'buses', 'lancheros', 'camping');

commit;
