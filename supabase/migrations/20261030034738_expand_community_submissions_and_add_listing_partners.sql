-- Community submissions can recommend either a place or an event. Sponsors are
-- modeled separately from editorial partners so public labeling is explicit.

alter table public.community_submissions
  rename column place_name to title;

alter table public.community_submissions
  add column listing_type public.listing_type not null default 'place',
  add column description text,
  add column meeting_point text,
  add column schedule_text text,
  add column price_from numeric(10, 2),
  add column payment_methods text[] not null default '{}',
  add column transport_info text,
  add column accessibility_notes text,
  add column tags text[] not null default '{}',
  add column starts_at timestamptz,
  add column ends_at timestamptz;

update public.community_submissions
set description = comment;

alter table public.community_submissions
  add constraint community_submissions_title_length_check
    check (length(btrim(title)) between 2 and 160),
  add constraint community_submissions_description_length_check
    check (description is null or length(btrim(description)) between 10 and 10000),
  add constraint community_submissions_event_dates_check
    check (
      listing_type = 'place'
      or (starts_at is not null and (ends_at is null or ends_at >= starts_at))
    ),
  add constraint community_submissions_price_check
    check (price_from is null or price_from >= 0);

-- Existing column-level INSERT grants are replaced with the expanded allow-list.
revoke insert on table public.community_submissions from anon;
grant insert (
  title, department, comment, photo_path, contact_optional, listing_type,
  description, meeting_point, schedule_text, price_from, payment_methods,
  transport_info, accessibility_notes, tags, starts_at, ends_at
) on table public.community_submissions to anon;

-- Allow an admin to copy any community-upload image format into the public cover bucket.
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
where id = 'listing-covers';
drop policy "Admins can upload listing covers" on storage.objects;
create policy "Admins can upload listing covers"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'listing-covers'
    and (select public.is_admin())
    and name ~* '^[a-z0-9]+(-[a-z0-9]+)*/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp|avif)$'
  );

create table public.partners (
  id bigint generated always as identity primary key,
  name text not null,
  description text not null default '',
  category text not null,
  logo_url text,
  website_url text,
  whatsapp_phone text,
  instagram_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partners_name_not_empty check (length(btrim(name)) > 0),
  constraint partners_category_check check (category in ('food', 'accommodation', 'transport', 'activities', 'other'))
);

create table public.listing_partners (
  id bigint generated always as identity primary key,
  listing_id bigint not null references public.listings (id) on delete cascade,
  partner_id bigint not null references public.partners (id) on delete restrict,
  relationship_type text not null,
  display_text text not null default '',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listing_partners_relationship_type_check
    check (relationship_type in ('editorial', 'paid_marketing', 'sponsor')),
  constraint listing_partners_unique_pair unique (listing_id, partner_id)
);

create index listing_partners_listing_order_idx
  on public.listing_partners (listing_id, sort_order, id)
  where is_active = true;
create index listing_partners_partner_id_idx on public.listing_partners (partner_id);

create trigger partners_set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();
create trigger listing_partners_set_updated_at
  before update on public.listing_partners
  for each row execute function public.set_updated_at();

alter table public.partners enable row level security;
alter table public.listing_partners enable row level security;
revoke all on table public.partners, public.listing_partners from public, anon, authenticated;
grant select on table public.partners, public.listing_partners to anon, authenticated;
grant select, insert, update, delete on table public.partners, public.listing_partners to authenticated;
grant usage, select on sequence public.partners_id_seq, public.listing_partners_id_seq to authenticated;

create policy "Public can read active partners"
  on public.partners for select to anon, authenticated
  using (is_active = true);
create policy "Admins can read all partners"
  on public.partners for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert partners"
  on public.partners for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update partners"
  on public.partners for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete partners"
  on public.partners for delete to authenticated
  using ((select public.is_admin()));

create policy "Public can read active listing partners"
  on public.listing_partners for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.listings l
      where l.id = listing_partners.listing_id and l.is_published
    )
    and exists (
      select 1 from public.partners p
      where p.id = listing_partners.partner_id and p.is_active
    )
  );
create policy "Admins can read all listing partners"
  on public.listing_partners for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert listing partners"
  on public.listing_partners for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update listing partners"
  on public.listing_partners for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete listing partners"
  on public.listing_partners for delete to authenticated
  using ((select public.is_admin()));
