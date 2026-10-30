-- Normalize the department catalog while preserving all existing content.

create table public.departments (
  id smallint generated always as identity primary key,
  name text not null,
  slug text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint departments_name_unique unique (name),
  constraint departments_slug_unique unique (slug),
  constraint departments_name_not_empty check (length(btrim(name)) > 0),
  constraint departments_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

insert into public.departments (name, slug, sort_order)
values
  ('San Miguel', 'san-miguel', 10),
  ('Usulután', 'usulutan', 20),
  ('La Unión', 'la-union', 30),
  ('Morazán', 'morazan', 40);

alter table public.departments enable row level security;
revoke all on table public.departments from public, anon, authenticated;
grant select on table public.departments to anon, authenticated;
grant insert, update, delete on table public.departments to authenticated;
grant usage, select on sequence public.departments_id_seq to authenticated;

create policy "Admins can read all departments"
  on public.departments for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can insert departments"
  on public.departments for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update departments"
  on public.departments for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
alter table public.listings add column department_id smallint;
alter table public.community_submissions add column department_id smallint;

update public.listings l
set department_id = d.id
from public.departments d
where d.name = l.department;

update public.community_submissions s
set department_id = d.id
from public.departments d
where d.name = s.department;

do $$
begin
  if exists (select 1 from public.listings where department_id is null)
    or exists (select 1 from public.community_submissions where department_id is null) then
    raise exception 'Department backfill failed; existing rows contain an unknown department';
  end if;
end;
$$;

alter table public.listings
  alter column department_id set not null,
  add constraint listings_department_id_fkey
    foreign key (department_id) references public.departments (id) on delete restrict;
alter table public.community_submissions
  alter column department_id set not null,
  add constraint community_submissions_department_id_fkey
    foreign key (department_id) references public.departments (id) on delete restrict;

create policy "Public can read active departments"
  on public.departments for select to anon, authenticated
  using (
    is_active = true
    or exists (
      select 1 from public.listings l
      where l.department_id = departments.id and l.is_published = true
    )
  );

create policy "Admins can delete unused departments"
  on public.departments for delete to authenticated
  using (
    (select public.is_admin())
    and not exists (select 1 from public.listings l where l.department_id = departments.id)
    and not exists (select 1 from public.community_submissions s where s.department_id = departments.id)
  );

create index listings_published_department_id_idx
  on public.listings (department_id)
  where is_published = true;
create index community_submissions_department_id_idx
  on public.community_submissions (department_id);

drop index if exists public.listings_published_department_idx;
alter table public.listings drop constraint if exists listings_department_allowed_check;
alter table public.community_submissions drop constraint if exists community_submissions_department_allowed_check;
alter table public.listings drop column department;
alter table public.community_submissions drop column department;

drop policy "Anonymous visitors can submit pending suggestions"
  on public.community_submissions;
create policy "Anonymous visitors can submit pending suggestions"
  on public.community_submissions for insert to anon
  with check (
    status = 'pending'
    and exists (
      select 1 from public.departments d
      where d.id = community_submissions.department_id and d.is_active
    )
  );

revoke insert (
  title, department_id, comment, photo_path, contact_optional, listing_type,
  description, meeting_point, schedule_text, price_from, payment_methods,
  transport_info, accessibility_notes, tags, starts_at, ends_at
) on table public.community_submissions from anon;
grant insert (
  title, department_id, comment, photo_path, contact_optional, listing_type,
  description, meeting_point, schedule_text, price_from, payment_methods,
  transport_info, accessibility_notes, tags, starts_at, ends_at
) on table public.community_submissions to anon;

-- Keep the existing admin write API, but persist the selected catalog ID.
create or replace function public.save_admin_listing(
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
  v_department_id smallint := nullif(p_listing->>'department_id', '')::smallint;
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
  if not exists (
    select 1
    from public.departments d
    where d.id = v_department_id
      and (
        d.is_active
        or (p_listing_id is not null and exists (
          select 1 from public.listings l
          where l.id = p_listing_id and l.department_id = d.id
        ))
        or (p_submission_id is not null and exists (
          select 1 from public.community_submissions s
          where s.id = p_submission_id and s.status = 'pending' and s.department_id = d.id
        ))
      )
  ) then
    raise exception 'Department is not active or does not exist' using errcode = '23514';
  end if;
  if p_listing_type = 'place'::public.listing_type and jsonb_array_length(v_sub_events) > 0 then
    raise exception 'Places cannot have agenda items' using errcode = '22023';
  end if;

  if exists (
    select 1 from unnest(v_category_ids) selected(category_id)
    where not exists (
      select 1 from public.category_listing_types scope
      join public.categories c on c.id = scope.category_id
      where scope.category_id = selected.category_id and scope.listing_type = p_listing_type
        and (c.is_active = true or (p_listing_id is not null and exists (
          select 1 from public.listing_categories existing
          where existing.listing_id = p_listing_id and existing.category_id = selected.category_id
        )))
    )
  ) then
    raise exception 'A selected category is not active for this listing type' using errcode = '23514';
  end if;

  if exists (
    select 1 from jsonb_to_recordset(v_sub_events) as activity(activity_category_id bigint)
    left join public.activity_categories c on c.id = activity.activity_category_id
    where c.id is null or c.is_active = false
  ) then
    raise exception 'An agenda category is not active' using errcode = '23514';
  end if;

  if p_submission_id is not null then
    if p_listing_id is not null then
      raise exception 'Community suggestions must create a new draft' using errcode = '22023';
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
      slug, type, title, description, department_id, meeting_point, cover_image_url,
      starts_at, ends_at, schedule_text, price_from, payment_methods,
      transport_info, accessibility_notes, extras, restrictions, tags,
      whatsapp_phone, instagram_url, facebook_url, tiktok_url, ticket_url,
      ticket_provider, accommodation_url, accommodation_search_query,
      verified, featured, is_published, published_at
    ) values (
      p_listing->>'slug', p_listing_type, p_listing->>'title', coalesce(p_listing->>'description', ''),
      v_department_id, nullif(p_listing->>'meeting_point', ''), nullif(p_listing->>'cover_image_url', ''),
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
      coalesce((p_listing->>'verified')::boolean, false), coalesce((p_listing->>'featured')::boolean, false),
      v_is_published, case when v_is_published then now() else null end
    ) returning id into v_listing_id;
  else
    update public.listings set
      slug = p_listing->>'slug', title = p_listing->>'title',
      description = coalesce(p_listing->>'description', ''), department_id = v_department_id,
      meeting_point = nullif(p_listing->>'meeting_point', ''),
      cover_image_url = nullif(p_listing->>'cover_image_url', ''),
      starts_at = case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'starts_at', '')::timestamptz else null end,
      ends_at = case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'ends_at', '')::timestamptz else null end,
      schedule_text = case when p_listing_type = 'place'::public.listing_type then nullif(p_listing->>'schedule_text', '') else null end,
      price_from = nullif(p_listing->>'price_from', '')::numeric,
      payment_methods = array(select jsonb_array_elements_text(coalesce(p_listing->'payment_methods', '[]'::jsonb))),
      transport_info = nullif(p_listing->>'transport_info', ''), accessibility_notes = nullif(p_listing->>'accessibility_notes', ''),
      extras = coalesce(p_listing->'extras', '{}'::jsonb), restrictions = nullif(p_listing->>'restrictions', ''),
      tags = array(select jsonb_array_elements_text(coalesce(p_listing->'tags', '[]'::jsonb))),
      whatsapp_phone = coalesce(p_listing->>'whatsapp_phone', ''), instagram_url = nullif(p_listing->>'instagram_url', ''),
      facebook_url = nullif(p_listing->>'facebook_url', ''), tiktok_url = nullif(p_listing->>'tiktok_url', ''),
      ticket_url = case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'ticket_url', '') else null end,
      ticket_provider = case when p_listing_type = 'event'::public.listing_type then nullif(p_listing->>'ticket_provider', '') else null end,
      accommodation_url = nullif(p_listing->>'accommodation_url', ''),
      accommodation_search_query = nullif(p_listing->>'accommodation_search_query', ''),
      verified = coalesce((p_listing->>'verified')::boolean, false), featured = coalesce((p_listing->>'featured')::boolean, false),
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
      listing_id, event_date, start_time, end_time, title, description, venue, activity_category_id, sort_order
    )
    select v_listing_id, activity.event_date, activity.start_time, activity.end_time,
      activity.title, activity.description, activity.venue, activity.activity_category_id, activity.sort_order
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
