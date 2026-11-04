-- ============================================================================
-- AHHA Cultural Matching Tool - Ledenregister
-- Migratie: 010_members
-- ============================================================================
--
-- Register van leden en bestuurders. Dit zijn CONTACTEN die beheerd worden
-- door staff; zij loggen NIET zelf in (dat loopt via auth.users + user_roles).
-- Toegang: staff (admin + bestuurder) mag lezen en beheren.
-- ============================================================================

create table if not exists public.members (
  id          uuid primary key default gen_random_uuid(),
  naam        text not null,
  type        text not null default 'lid' check (type in ('lid', 'bestuurder')),
  functie     text,
  email       text,
  telefoon    text,
  organisatie text,
  notities    text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.members enable row level security;

drop policy if exists "staff manage members" on public.members;
create policy "staff manage members"
  on public.members
  for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- updated_at automatisch bijwerken bij elke wijziging.
create or replace function public.members_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists members_updated_at on public.members;
create trigger members_updated_at
  before update on public.members
  for each row
  execute function public.members_set_updated_at();
