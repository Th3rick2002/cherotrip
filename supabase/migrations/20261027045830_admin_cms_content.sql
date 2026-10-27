-- Admin CMS content management. Existing listings and QA data are preserved.

-- Categories can be shared by places/events or scoped to one listing type.
create table public.category_listing_types (
  category_id bigint not null references public.categories (id) on delete cascade,
  listing_type public.listing_type not null,
  created_at timestamptz not null default now(),
  primary key (category_id, listing_type)
);

create index category_listing_types_type_idx
  on public.category_listing_types (listing_type, category_id);

-- Preserve the current shared-category behavior for categories already in use.
insert into public.category_listing_types (category_id, listing_type)
select c.id, t.listing_type
from public.categories c
cross join (values ('place'::public.listing_type), ('event'::public.listing_type)) t(listing_type)
on conflict do nothing;

alter table public.category_listing_types enable row level security;
revoke all on table public.category_listing_types from public, anon, authenticated;
grant select on table public.category_listing_types to anon, authenticated;
grant select, insert, update, delete on table public.category_listing_types to authenticated;

create policy "Public can read category listing types"
  on public.category_listing_types for select to anon, authenticated
  using (true);
create policy "Admins can insert category listing types"
  on public.category_listing_types for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update category listing types"
  on public.category_listing_types for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete category listing types"
  on public.category_listing_types for delete to authenticated
  using ((select public.is_admin()));

-- Editable Home links replace the static collection/service arrays in code.
create table public.home_quick_links (
  id bigint generated always as identity primary key,
  slug text not null unique,
  section text not null,
  label text not null,
  icon_key text not null,
  target_kind text not null,
  target_value text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint home_quick_links_section_check check (section in ('collection', 'service')),
  constraint home_quick_links_target_kind_check check (target_kind in ('search', 'tag', 'category')),
  constraint home_quick_links_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint home_quick_links_label_not_empty check (length(btrim(label)) > 0),
  constraint home_quick_links_icon_not_empty check (length(btrim(icon_key)) > 0),
  constraint home_quick_links_target_not_empty check (length(btrim(target_value)) > 0)
);

create index home_quick_links_active_section_order_idx
  on public.home_quick_links (section, sort_order, id)
  where is_active = true;

create trigger home_quick_links_set_updated_at
  before update on public.home_quick_links
  for each row execute function public.set_updated_at();

insert into public.home_quick_links
  (slug, section, label, icon_key, target_kind, target_value, sort_order)
values
  ('mochilero', 'collection', 'Mochilero', 'backpack', 'tag', 'Mochilero', 10),
  ('familiar', 'collection', 'Familiar', 'users', 'tag', 'Familiar', 20),
  ('aventura-4x4', 'collection', 'Aventura 4x4', 'mountain', 'search', '4x4', 30),
  ('buses', 'service', 'Rutas de buses', 'bus', 'search', 'bus', 10),
  ('lancheros', 'service', 'Lancheros', 'ship', 'search', 'lancha', 20),
  ('camping', 'service', 'Zonas de camping', 'tent', 'tag', 'Camping', 30)
on conflict (slug) do nothing;

alter table public.home_quick_links enable row level security;
revoke all on table public.home_quick_links from public, anon, authenticated;
grant select on table public.home_quick_links to anon, authenticated;
grant select, insert, update, delete on table public.home_quick_links to authenticated;
grant usage, select on sequence public.home_quick_links_id_seq to authenticated;

create policy "Public can read active Home quick links"
  on public.home_quick_links for select to anon, authenticated
  using (is_active = true);
create policy "Admins can read all Home quick links"
  on public.home_quick_links for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert Home quick links"
  on public.home_quick_links for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update Home quick links"
  on public.home_quick_links for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete Home quick links"
  on public.home_quick_links for delete to authenticated
  using ((select public.is_admin()));

-- Keep a trace from an approved community suggestion to the draft it created.
alter table public.community_submissions
  add column converted_listing_id bigint references public.listings (id) on delete set null;
create index community_submissions_converted_listing_id_idx
  on public.community_submissions (converted_listing_id)
  where converted_listing_id is not null;

-- Explicit grants and admin-only policies. Existing public policies remain in place.
grant select, insert, update, delete on table
  public.listings,
  public.listing_categories,
  public.categories,
  public.activity_categories,
  public.sub_events,
  public.community_submissions
to authenticated;
grant usage, select on sequence
  public.listings_id_seq,
  public.categories_id_seq,
  public.activity_categories_id_seq,
  public.sub_events_id_seq
to authenticated;

create policy "Admins can read all listings"
  on public.listings for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert listings"
  on public.listings for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update listings"
  on public.listings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete listings"
  on public.listings for delete to authenticated
  using ((select public.is_admin()));

create policy "Admins can read all listing category links"
  on public.listing_categories for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert listing category links"
  on public.listing_categories for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update listing category links"
  on public.listing_categories for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete listing category links"
  on public.listing_categories for delete to authenticated
  using ((select public.is_admin()));

create policy "Admins can read all categories"
  on public.categories for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert categories"
  on public.categories for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update categories"
  on public.categories for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete unused categories"
  on public.categories for delete to authenticated
  using (
    (select public.is_admin())
    and not exists (
      select 1 from public.listing_categories lc where lc.category_id = categories.id
    )
  );

create policy "Admins can read all activity categories"
  on public.activity_categories for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert activity categories"
  on public.activity_categories for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update activity categories"
  on public.activity_categories for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete unused activity categories"
  on public.activity_categories for delete to authenticated
  using (
    (select public.is_admin())
    and not exists (
      select 1 from public.sub_events se where se.activity_category_id = activity_categories.id
    )
  );

create policy "Admins can read all sub-events"
  on public.sub_events for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert sub-events"
  on public.sub_events for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update sub-events"
  on public.sub_events for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete sub-events"
  on public.sub_events for delete to authenticated
  using ((select public.is_admin()));

create policy "Admins can read community submissions"
  on public.community_submissions for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can update community submissions"
  on public.community_submissions for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
create policy "Admins can delete community submissions"
  on public.community_submissions for delete to authenticated
  using ((select public.is_admin()));

grant select on storage.objects to authenticated;
create policy "Admins can read community submission photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'community-submission-photos'
    and (select public.is_admin())
  );

-- Atomically save the listing, its categories, its agenda and (when supplied)
-- the community submission converted to that listing. This is SECURITY INVOKER:
-- grants and the RLS policies above remain in force for every write.
create function public.save_admin_listing(
  p_listing_type public.listing_type,
  p_listing_id bigint,
  p_listing jsonb,
  p_category_ids bigint[],
  p_sub_events jsonb,
  p_submission_id bigint default null
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_listing_id bigint;
  v_category_ids bigint[] := coalesce(p_category_ids, '{}'::bigint[]);
  v_sub_events jsonb := coalesce(p_sub_events, '[]'::jsonb);
  v_is_published boolean := coalesce((p_listing->>'is_published')::boolean, false);
  v_submission public.community_submissions%rowtype;
begin
  if not coalesce((select public.is_admin()), false) then
    raise exception 'Admin access required' using errcode = '42501';
  end if;

  if p_listing_type not in ('place'::public.listing_type, 'event'::public.listing_type) then
    raise exception 'Invalid listing type' using errcode = '22023';
  end if;

  if p_listing_type = 'place'::public.listing_type and jsonb_array_length(v_sub_events) > 0 then
    raise exception 'Places cannot have agenda items' using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(v_category_ids) selected(category_id)
    where not exists (
      select 1
      from public.category_listing_types scope
      join public.categories c on c.id = scope.category_id
      where scope.category_id = selected.category_id
        and scope.listing_type = p_listing_type
        and (
          c.is_active = true
          or (
            p_listing_id is not null
            and exists (
              select 1 from public.listing_categories existing
              where existing.listing_id = p_listing_id
                and existing.category_id = selected.category_id
            )
          )
        )
    )
  ) then
    raise exception 'A selected category is not active for this listing type' using errcode = '23514';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(v_sub_events) as activity(activity_category_id bigint)
    left join public.activity_categories c on c.id = activity.activity_category_id
    where c.id is null or c.is_active = false
  ) then
    raise exception 'An agenda category is not active' using errcode = '23514';
  end if;

  if p_submission_id is not null then
    if p_listing_type <> 'place'::public.listing_type or p_listing_id is not null then
      raise exception 'Community suggestions must create a new place draft' using errcode = '22023';
    end if;
    select * into v_submission
    from public.community_submissions
    where id = p_submission_id and status = 'pending' and converted_listing_id is null
    for update;
    if not found then
      raise exception 'Community submission is no longer pending' using errcode = '23505';
    end if;
    v_is_published := false;
  end if;

  if p_listing_id is null then
    insert into public.listings (
      slug, type, title, description, department, meeting_point, cover_image_url,
      starts_at, ends_at, schedule_text, price_from, payment_methods,
      transport_info, accessibility_notes, extras, restrictions, tags,
      whatsapp_phone, instagram_url, facebook_url, tiktok_url, ticket_url,
      ticket_provider, accommodation_url, accommodation_search_query,
      verified, featured, is_published, published_at
    ) values (
      p_listing->>'slug', p_listing_type, p_listing->>'title', coalesce(p_listing->>'description', ''),
      p_listing->>'department', nullif(p_listing->>'meeting_point', ''),
      nullif(p_listing->>'cover_image_url', ''),
      case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'starts_at', '')::timestamptz else null end,
      case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'ends_at', '')::timestamptz else null end,
      case when p_listing_type = 'place'::public.listing_type then nullif(p_listing->>'schedule_text', '') else null end,
      nullif(p_listing->>'price_from', '')::numeric,
      array(select jsonb_array_elements_text(coalesce(p_listing->'payment_methods', '[]'::jsonb))),
      nullif(p_listing->>'transport_info', ''), nullif(p_listing->>'accessibility_notes', ''),
      coalesce(p_listing->'extras', '{}'::jsonb), nullif(p_listing->>'restrictions', ''),
      array(select jsonb_array_elements_text(coalesce(p_listing->'tags', '[]'::jsonb))),
      coalesce(p_listing->>'whatsapp_phone', ''), nullif(p_listing->>'instagram_url', ''),
      nullif(p_listing->>'facebook_url', ''), nullif(p_listing->>'tiktok_url', ''),
      case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'ticket_url', '') else null end,
      case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'ticket_provider', '') else null end,
      nullif(p_listing->>'accommodation_url', ''), nullif(p_listing->>'accommodation_search_query', ''),
      coalesce((p_listing->>'verified')::boolean, false),
      coalesce((p_listing->>'featured')::boolean, false), v_is_published,
      case when v_is_published then now() else null end
    ) returning id into v_listing_id;
  else
    update public.listings set
      slug = p_listing->>'slug',
      title = p_listing->>'title',
      description = coalesce(p_listing->>'description', ''),
      department = p_listing->>'department',
      meeting_point = nullif(p_listing->>'meeting_point', ''),
      cover_image_url = nullif(p_listing->>'cover_image_url', ''),
      starts_at = case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'starts_at', '')::timestamptz else null end,
      ends_at = case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'ends_at', '')::timestamptz else null end,
      schedule_text = case when p_listing_type = 'place'::public.listing_type then nullif(p_listing->>'schedule_text', '') else null end,
      price_from = nullif(p_listing->>'price_from', '')::numeric,
      payment_methods = array(select jsonb_array_elements_text(coalesce(p_listing->'payment_methods', '[]'::jsonb))),
      transport_info = nullif(p_listing->>'transport_info', ''),
      accessibility_notes = nullif(p_listing->>'accessibility_notes', ''),
      extras = coalesce(p_listing->'extras', '{}'::jsonb),
      restrictions = nullif(p_listing->>'restrictions', ''),
      tags = array(select jsonb_array_elements_text(coalesce(p_listing->'tags', '[]'::jsonb))),
      whatsapp_phone = coalesce(p_listing->>'whatsapp_phone', ''),
      instagram_url = nullif(p_listing->>'instagram_url', ''),
      facebook_url = nullif(p_listing->>'facebook_url', ''),
      tiktok_url = nullif(p_listing->>'tiktok_url', ''),
      ticket_url = case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'ticket_url', '') else null end,
      ticket_provider = case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'ticket_provider', '') else null end,
      accommodation_url = nullif(p_listing->>'accommodation_url', ''),
      accommodation_search_query = nullif(p_listing->>'accommodation_search_query', ''),
      verified = coalesce((p_listing->>'verified')::boolean, false),
      featured = coalesce((p_listing->>'featured')::boolean, false),
      is_published = v_is_published,
      published_at = case when v_is_published then coalesce(published_at, now()) else null end
    where id = p_listing_id and type = p_listing_type
    returning id into v_listing_id;

    if v_listing_id is null then
      raise exception 'Listing not found for this type' using errcode = 'P0002';
    end if;
  end if;

  delete from public.listing_categories where listing_id = v_listing_id;
  insert into public.listing_categories (listing_id, category_id)
  select v_listing_id, selected.category_id
  from (select distinct unnest(v_category_ids) as category_id) selected;

  if p_listing_type = 'event'::public.listing_type then
    delete from public.sub_events where listing_id = v_listing_id;
    insert into public.sub_events (
      listing_id, event_date, start_time, end_time, title, description, venue,
      activity_category_id, sort_order
    )
    select v_listing_id, activity.event_date, activity.start_time, activity.end_time,
      activity.title, activity.description, activity.venue,
      activity.activity_category_id, activity.sort_order
    from jsonb_to_recordset(v_sub_events) as activity(
      event_date date, start_time time, end_time time, title text,
      description text, venue text, activity_category_id bigint, sort_order integer
    );
  end if;

  if p_submission_id is not null then
    update public.community_submissions
    set status = 'approved', converted_listing_id = v_listing_id
    where id = p_submission_id and status = 'pending' and converted_listing_id is null;
    if not found then
      raise exception 'Community submission could not be converted' using errcode = '23505';
    end if;
  end if;

  return v_listing_id;
end;
$$;

revoke all on function public.save_admin_listing(
  public.listing_type, bigint, jsonb, bigint[], jsonb, bigint
) from public, anon;
grant execute on function public.save_admin_listing(
  public.listing_type, bigint, jsonb, bigint[], jsonb, bigint
) to authenticated;

create function public.save_admin_category(
  p_category_id bigint,
  p_slug text,
  p_name text,
  p_icon text,
  p_sort_order integer,
  p_is_active boolean,
  p_listing_types public.listing_type[]
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_category_id bigint;
  v_listing_types public.listing_type[] := coalesce(p_listing_types, '{}'::public.listing_type[]);
begin
  if not coalesce((select public.is_admin()), false) then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if cardinality(v_listing_types) = 0 then
    raise exception 'Select at least one listing type' using errcode = '22023';
  end if;

  if p_category_id is not null and exists (
    select 1
    from public.listing_categories lc
    join public.listings l on l.id = lc.listing_id
    where lc.category_id = p_category_id
      and not (l.type = any(v_listing_types))
  ) then
    raise exception 'Category is in use by a listing outside the selected scope' using errcode = '23514';
  end if;

  if p_category_id is null then
    insert into public.categories (slug, name, icon, sort_order, is_active)
    values (p_slug, p_name, nullif(p_icon, ''), p_sort_order, p_is_active)
    returning id into v_category_id;
  else
    update public.categories
    set slug = p_slug, name = p_name, icon = nullif(p_icon, ''),
        sort_order = p_sort_order, is_active = p_is_active
    where id = p_category_id
    returning id into v_category_id;
    if v_category_id is null then
      raise exception 'Category not found' using errcode = 'P0002';
    end if;
  end if;

  delete from public.category_listing_types where category_id = v_category_id;
  insert into public.category_listing_types (category_id, listing_type)
  select v_category_id, selected.listing_type
  from (select distinct unnest(v_listing_types) as listing_type) selected;
  return v_category_id;
end;
$$;

revoke all on function public.save_admin_category(
  bigint, text, text, text, integer, boolean, public.listing_type[]
) from public, anon;
grant execute on function public.save_admin_category(
  bigint, text, text, text, integer, boolean, public.listing_type[]
) to authenticated;
