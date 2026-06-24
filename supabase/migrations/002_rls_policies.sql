-- ============================================================================
-- AHHA Cultural Matching Tool - RLS policies
-- Migratie: 002_rls_policies
-- ============================================================================
--
-- De applicatie heeft (nog) GEEN authenticatie en werkt rechtstreeks met de
-- Supabase anon-key, net zoals de vorige publieke Google Sheets-opzet. Met RLS
-- ingeschakeld maar zonder policies wordt alle toegang geweigerd; de frontend
-- valt dan stil terug op localStorage en Supabase doet niets.
--
-- Deze migratie zet RLS expliciet aan (idempotent) en voegt PERMISSIEVE policies
-- toe die de anon-rol volledige lees/schrijf-toegang geven. Dit is bewust de
-- minimale parity met de oude publieke backend.
--
-- ⚠️ BEVEILIGING: hiermee kan iedereen met de anon-key alle profielen lezen en
--    wijzigen. Dit is acceptabel voor de demo-/intern-gebruik fase. Zodra er
--    authenticatie komt, vervang je deze policies door restrictievere regels
--    (bv. gekoppeld aan auth.uid() of org-lidmaatschap).
-- ============================================================================

-- RLS aanzetten (no-op als al ingeschakeld via het dashboard).
alter table public.organizations       enable row level security;
alter table public.respondents         enable row level security;
alter table public.responses           enable row level security;
alter table public.aggregated_profiles enable row level security;

-- ----------------------------------------------------------------------------
-- aggregated_profiles : de tabel die de frontend leest/schrijft.
-- ----------------------------------------------------------------------------
drop policy if exists "anon full access aggregated_profiles" on public.aggregated_profiles;
create policy "anon full access aggregated_profiles"
  on public.aggregated_profiles
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- ----------------------------------------------------------------------------
-- organizations / respondents / responses : voorbereid voor toekomstig gebruik.
-- ----------------------------------------------------------------------------
drop policy if exists "anon full access organizations" on public.organizations;
create policy "anon full access organizations"
  on public.organizations
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "anon full access respondents" on public.respondents;
create policy "anon full access respondents"
  on public.respondents
  for all
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "anon full access responses" on public.responses;
create policy "anon full access responses"
  on public.responses
  for all
  to anon, authenticated
  using (true)
  with check (true);
