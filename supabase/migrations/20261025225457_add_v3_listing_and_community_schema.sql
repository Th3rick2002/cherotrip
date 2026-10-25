-- v3 listing expansion, event activities, and moderated community submissions.

alter table public.listings
  add column instagram_url text,
  add column facebook_url text,
  add column tiktok_url text,
  add column ticket_url text,
  add column ticket_provider text,
  add column accommodation_url text,
  add column accommodation_search_query text;

create table public.activity_categories (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint activity_categories_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint activity_categories_name_not_empty check (length(btrim(name)) > 0)
);

insert into public.activity_categories (slug, name, sort_order)
values
  ('music-concert', 'Música / concierto', 10),
  ('dance-parade', 'Danza / desfile', 20),
  ('theater', 'Teatro', 30),
  ('sports', 'Deportes', 40),
  ('fair-exhibition', 'Feria / exhibición', 50),
  ('food-gastronomy', 'Gastronomía', 60),
  ('ceremony-tradition', 'Ceremonia / tradición', 70),
  ('workshop-kids', 'Taller / actividad infantil', 80),
  ('other', 'Otro', 90);

create table public.sub_events (
  id bigint generated always as identity primary key,
  listing_id bigint not null references public.listings (id) on delete cascade,
  event_date date not null,
  start_time time not null,
  end_time time,
  title text not null,
  description text,
  venue text,
  activity_category_id bigint not null references public.activity_categories (id) on delete restrict,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint sub_events_title_not_empty check (length(btrim(title)) > 0)
);

create index sub_events_listing_date_time_idx
  on public.sub_events (listing_id, event_date, start_time);

create index sub_events_activity_category_id_idx
  on public.sub_events (activity_category_id);

create table public.community_submissions (
  id bigint generated always as identity primary key,
  place_name text not null,
  department text not null,
  comment text not null,
  photo_path text,
  contact_optional text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  constraint community_submissions_status_check
    check (status in ('pending', 'approved', 'rejected')),
  constraint community_submissions_required_text_check
    check (
      length(btrim(place_name)) > 0
      and length(btrim(department)) > 0
      and length(btrim(comment)) > 0
    ),
  constraint community_submissions_photo_path_check
    check (
      photo_path is null
      or photo_path ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|avif)$'
    )
);

create index community_submissions_status_created_at_idx
  on public.community_submissions (status, created_at desc);

alter table public.activity_categories enable row level security;
alter table public.sub_events enable row level security;
alter table public.community_submissions enable row level security;

-- Existing projects may grant broad default privileges to client roles.
revoke all on table public.activity_categories, public.sub_events, public.community_submissions
  from public, anon, authenticated;

create policy "Public can read active activity categories"
  on public.activity_categories
  for select
  to anon, authenticated
  using (is_active = true);

create policy "Public can read sub-events of published listings"
  on public.sub_events
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.listings l
      where l.id = sub_events.listing_id
        and l.is_published = true
    )
  );

create policy "Anonymous visitors can submit pending suggestions"
  on public.community_submissions
  for insert
  to anon
  with check (status = 'pending');

grant select on table public.activity_categories, public.sub_events to anon, authenticated;
grant insert (place_name, department, comment, photo_path, contact_optional)
  on table public.community_submissions to anon;

-- Private bucket: anonymous visitors may upload one new image object, but cannot
-- read, replace, list, or delete submitted images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-submission-photos',
  'community-submission-photos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

create policy "Anonymous visitors can upload community submission photos"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'community-submission-photos'
    and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|jpeg|png|webp|avif)$'
  );
