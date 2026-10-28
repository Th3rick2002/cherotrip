-- The MVP currently accepts listings and community contributions only for
-- the four eastern departments that the team is preparing to populate.
alter table public.listings
  add constraint listings_department_allowed_check
  check (department in ('San Miguel', 'Usulután', 'La Unión', 'Morazán'));

alter table public.community_submissions
  add constraint community_submissions_department_allowed_check
  check (department in ('San Miguel', 'Usulután', 'La Unión', 'Morazán'));
