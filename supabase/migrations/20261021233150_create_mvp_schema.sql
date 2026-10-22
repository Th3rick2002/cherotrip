-- Cherotrip MVP schema
-- Categories are a table so new ones can be added from Supabase without code changes.

create extension if not exists pg_trgm;

create type public.listing_type as enum ('event', 'place');

create table public.categories (
  id bigint generated always as identity primary key,
  slug text not null,
  name text not null,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint categories_slug_key unique (slug)
);

create table public.listings (
  id bigint generated always as identity primary key,
  slug text not null,
  type public.listing_type not null,
  title text not null,
  description text not null default '',
  department text not null,
  meeting_point text,
  cover_image_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  schedule_text text,
  price_from numeric(10, 2),
  payment_methods text[] not null default '{}'::text[],
  transport_info text,
  accessibility_notes text,
  extras jsonb not null default '{}'::jsonb,
  restrictions text,
  tags text[] not null default '{}'::text[],
  whatsapp_phone text not null default '50370000000',
  verified boolean not null default true,
  featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_slug_key unique (slug),
  constraint listings_price_non_negative check (price_from is null or price_from >= 0)
);

create table public.listing_categories (
  listing_id bigint not null references public.listings (id) on delete cascade,
  category_id bigint not null references public.categories (id) on delete restrict,
  primary key (listing_id, category_id)
);

create index listings_published_starts_at_idx
  on public.listings (starts_at asc nulls last)
  where is_published = true;

create index listings_published_department_idx
  on public.listings (department)
  where is_published = true;

create index listings_published_featured_idx
  on public.listings (featured)
  where is_published = true and featured = true;

create index listings_type_idx on public.listings (type);

create index listings_tags_gin_idx on public.listings using gin (tags);

create index listings_title_trgm_idx on public.listings using gin (title gin_trgm_ops);

create index listing_categories_category_id_idx
  on public.listing_categories (category_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_set_updated_at
  before update on public.listings
  for each row
  execute function public.set_updated_at();

-- RLS: public read of published content only; no anon writes
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.listing_categories enable row level security;

create policy "Public can read active categories"
  on public.categories
  for select
  to anon, authenticated
  using (is_active = true);

create policy "Public can read published listings"
  on public.listings
  for select
  to anon, authenticated
  using (is_published = true);

create policy "Public can read categories of published listings"
  on public.listing_categories
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.listings l
      where l.id = listing_id
        and l.is_published = true
    )
  );

-- Explicit grants (safe if project revoked default privileges)
grant usage on schema public to anon, authenticated;
grant select on table public.categories to anon, authenticated;
grant select on table public.listings to anon, authenticated;
grant select on table public.listing_categories to anon, authenticated;

-- Storage: cover images (public read; upload via Dashboard/service role only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'covers',
  'covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read cover images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'covers');
