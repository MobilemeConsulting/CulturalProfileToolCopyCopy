-- ============================================================================
-- AHHA Cultural Matching Tool - RLS-hardening (review Kurt/AHHA, nov 2026)
-- Migratie: 011_security_hardening
-- ============================================================================
--
-- Dicht de gaten uit de externe review:
--   1) organizations / respondents / responses waren leesbaar/bewerkbaar voor
--      anon (`using true`). respondents bevat naam + e-mail -> PII-lek met de
--      publieke anon-sleutel. De app gebruikt deze tabellen NIET (enkel
--      aggregated_profiles + match_results), dus ze gaan volledig staff-only.
--   2) aggregated_profiles had "authenticated full access (using true)": elke
--      ingelogde gebruiker (ook rol `lid`/`user`) kon alles lezen/wijzigen/
--      verwijderen. Nu staff-only (is_staff()).
--
-- BEWUST NIET hier: anon mag aggregated_profiles nog `update`-en. De publieke
-- wizard bewaart via upsert (insert + update van hetzelfde profiel in dezelfde
-- sessie). Dit netjes afschermen vraagt een geheime bewerklink per profiel —
-- aparte wijziging (zie overdrachtsmail). anon behoudt hier dus read/insert/update.
-- ============================================================================

-- ---- organizations (niet door de app gebruikt) ----------------------------
drop policy if exists "anon read organizations" on public.organizations;
drop policy if exists "authenticated full access organizations" on public.organizations;
drop policy if exists "anon full access organizations" on public.organizations;
drop policy if exists "staff organizations" on public.organizations;
create policy "staff organizations"
  on public.organizations for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- ---- respondents (bevat naam + e-mail -> GEEN anon) -----------------------
drop policy if exists "anon read respondents" on public.respondents;
drop policy if exists "authenticated full access respondents" on public.respondents;
drop policy if exists "anon full access respondents" on public.respondents;
drop policy if exists "staff respondents" on public.respondents;
create policy "staff respondents"
  on public.respondents for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- ---- responses ------------------------------------------------------------
drop policy if exists "anon read responses" on public.responses;
drop policy if exists "authenticated full access responses" on public.responses;
drop policy if exists "anon full access responses" on public.responses;
drop policy if exists "staff responses" on public.responses;
create policy "staff responses"
  on public.responses for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- ---- aggregated_profiles: ingelogde niet-staff mag niets meer -------------
-- Anon-policies uit 008 (read / insert / update) blijven ongemoeid, zodat de
-- publieke tool blijft werken.
drop policy if exists "authenticated full access aggregated_profiles" on public.aggregated_profiles;
create policy "staff manage aggregated_profiles"
  on public.aggregated_profiles for all to authenticated
  using (public.is_staff()) with check (public.is_staff());
