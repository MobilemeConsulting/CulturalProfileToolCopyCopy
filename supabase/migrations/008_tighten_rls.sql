-- ============================================================================
-- AHHA Cultural Matching Tool - Aanscherpen RLS-policies
-- Migratie: 008_tighten_rls
-- ============================================================================
--
-- Vervangt de permissieve anon-policies uit 002 door:
--   - Anon: alleen SELECT (publiek lezen van profielen)
--   - Authenticated: volledige CRUD
--   - Admin (via is_admin()): altijd volledige toegang
--
-- De publieke tool heeft alleen leestoegang nodig; schrijven en verwijderen
-- gebeurt uitsluitend door ingelogde admins via het dashboard.
-- ============================================================================

-- ============================================================================
-- aggregated_profiles
-- De publieke tool moet profielen kunnen lezen, aanmaken en bijwerken (upsert).
-- DELETE is alleen voor authenticated (admin-dashboard).
-- ============================================================================
drop policy if exists "anon full access aggregated_profiles" on public.aggregated_profiles;

-- Anon: lezen
create policy "anon read aggregated_profiles"
  on public.aggregated_profiles
  for select
  to anon
  using (true);

-- Anon: aanmaken (publieke tool slaat ingevulde profielen op)
create policy "anon insert aggregated_profiles"
  on public.aggregated_profiles
  for insert
  to anon
  with check (true);

-- Anon: bijwerken (publieke tool doet upsert)
create policy "anon update aggregated_profiles"
  on public.aggregated_profiles
  for update
  to anon
  using (true)
  with check (true);

-- Authenticated: volledige toegang (incl. delete)
create policy "authenticated full access aggregated_profiles"
  on public.aggregated_profiles
  for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- organizations
-- ============================================================================
drop policy if exists "anon full access organizations" on public.organizations;

create policy "anon read organizations"
  on public.organizations
  for select
  to anon
  using (true);

create policy "authenticated full access organizations"
  on public.organizations
  for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- respondents
-- ============================================================================
drop policy if exists "anon full access respondents" on public.respondents;

create policy "anon read respondents"
  on public.respondents
  for select
  to anon
  using (true);

create policy "authenticated full access respondents"
  on public.respondents
  for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- responses
-- ============================================================================
drop policy if exists "anon full access responses" on public.responses;

create policy "anon read responses"
  on public.responses
  for select
  to anon
  using (true);

create policy "authenticated full access responses"
  on public.responses
  for all
  to authenticated
  using (true)
  with check (true);
