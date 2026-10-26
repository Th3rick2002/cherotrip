-- Admin access for the internal CMS (/admin).
--
-- Being signed in is not enough to be an admin: authorization is an explicit
-- allow-list. Public sign-up can be enabled later for visitors without any of
-- them gaining admin rights, as long as admin-only policies use
-- public.is_admin() instead of `to authenticated` alone.

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Allow-list of auth users with access to the internal CMS. Managed from the Supabase dashboard or SQL; never writable from clients.';

alter table public.admin_users enable row level security;

-- No policies and no grants: clients cannot read or write the allow-list.
-- Membership is only exposed through public.is_admin() for the current user.
revoke all on table public.admin_users from public, anon, authenticated;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Security definer so the check can read admin_users without exposing the
-- table. It lives in a non-exposed schema and only ever reports on the
-- caller (auth.uid()), never on an arbitrary user id.
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

-- Thin public wrapper so the app can call it through the Data API (RPC).
-- Security invoker: it runs as the caller and can only learn the caller's
-- own admin status.
create function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_admin();
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
