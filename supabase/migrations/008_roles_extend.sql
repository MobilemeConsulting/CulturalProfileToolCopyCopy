-- ============================================================================
-- AHHA Cultural Matching Tool - Rollen uitbreiden + is_staff()
-- Migratie: 008_roles_extend
-- ============================================================================
--
-- Breidt het rollensysteem uit van (admin | user) naar:
--   admin       - volledige toegang, incl. gebruikers- en rollenbeheer
--   bestuurder  - mag inloggen en met de data werken, GEEN gebruikersbeheer
--   lid         - login-rol zonder /admin-toegang (gereserveerd)
--   user        - standaard, geen /admin-toegang
--
-- is_staff() = admin OF bestuurder. Dit is de toegangsgrens voor de
-- inhoudelijke secties (match_results, ledenregister).
-- is_admin() (uit 004) blijft de grens voor gebruikers- en rollenbeheer.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Check-constraint op user_roles.role verruimen.
-- ----------------------------------------------------------------------------
alter table public.user_roles
  drop constraint if exists user_roles_role_check;

alter table public.user_roles
  add constraint user_roles_role_check
  check (role in ('admin', 'bestuurder', 'lid', 'user'));

-- ----------------------------------------------------------------------------
-- is_staff(): security definer (geen RLS-recursie op user_roles).
-- ----------------------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role in ('admin', 'bestuurder')
  );
$$;

-- ----------------------------------------------------------------------------
-- match_results: data toegankelijk voor staff (admin + bestuurder) i.p.v.
-- enkel admin. Vervangt de admin-only policy uit 004.
-- ----------------------------------------------------------------------------
drop policy if exists "admin match_results" on public.match_results;
drop policy if exists "staff match_results" on public.match_results;
create policy "staff match_results"
  on public.match_results
  for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());
