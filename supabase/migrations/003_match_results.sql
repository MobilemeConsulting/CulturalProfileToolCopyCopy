-- ============================================================================
-- AHHA Cultural Matching Tool - Match results
-- Migratie: 003_match_results
-- ============================================================================
--
-- Bewaart (admin-)matchresultaten tussen een cultureel en een profit profiel.
-- De per-dimensie scores gaan in een jsonb-kolom; match_score is de totale
-- match (0-100). cultural_id/profit_id verwijzen naar OrganisationProfile.id.
-- ============================================================================

create table if not exists public.match_results (
  id                uuid primary key default gen_random_uuid(),
  cultural_id       text,                               -- OrganisationProfile.id (cultureel)
  profit_id         text,                               -- OrganisationProfile.id (profit)
  match_score       numeric not null,                   -- totale match 0-100
  dimension_scores  jsonb,                              -- per-CSROI-dimensie matchscores
  created_at        timestamptz not null default now()
);

create index if not exists idx_match_results_created_at on public.match_results (created_at desc);
create index if not exists idx_match_results_cultural   on public.match_results (cultural_id);
create index if not exists idx_match_results_profit     on public.match_results (profit_id);

-- RLS + permissieve anon-policy (zelfde stijl als 002_rls_policies.sql).
alter table public.match_results enable row level security;

drop policy if exists "anon full access match_results" on public.match_results;
create policy "anon full access match_results"
  on public.match_results
  for all
  to anon, authenticated
  using (true)
  with check (true);
