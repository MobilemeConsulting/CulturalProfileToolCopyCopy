-- ============================================================================
-- AHHA Cultural Matching Tool - Initieel Supabase schema
-- Migratie: 001_initial_schema
-- ============================================================================
--
-- Dit schema vervangt de Google Sheets backend. Het bestaat uit vier tabellen:
--
--   organizations        : registry van organisaties (cultureel of profit)
--   respondents          : personen die een vragenlijst invullen (toekomstige
--                          multi-respondent flow: leadership / staff)
--   responses            : individuele score-antwoorden per dimensie/as
--   aggregated_profiles  : het VOLLEDIGE, gecombineerde OrganisationProfile
--
-- De huidige frontend werkt met complete OrganisationProfile-objecten. Die
-- worden 1:1 bewaard in aggregated_profiles.profile (jsonb), naast
-- genormaliseerde kolommen (id, name, type, created_at, updated_at) voor
-- filteren/sorteren. De tabellen organizations/respondents/responses zijn
-- voorbereid voor de toekomstige multi-respondent uitbreiding.
--
-- LET OP: Row Level Security (RLS) wordt hier BEWUST nog NIET ingeschakeld.
--         Dat gebeurt in een aparte migratie.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- organizations
-- Velden gebaseerd op OrganisationProfile.meta + organisationType.
-- ----------------------------------------------------------------------------
create table if not exists public.organizations (
  id          text primary key,                       -- = OrganisationProfile.id
  name        text not null default '',               -- meta.orgName
  type        text not null check (type in ('cultural', 'profit')), -- organisationType
  org_type    text,                                   -- meta.orgType (vrije omschrijving)
  industry    text,                                   -- meta.industry
  status      text not null default 'active',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- respondents
-- Eén rij per persoon die invult. Sluit aan op IndividualResponse uit types.ts.
-- ----------------------------------------------------------------------------
create table if not exists public.respondents (
  id              uuid primary key default gen_random_uuid(),
  org_id          text not null references public.organizations (id) on delete cascade,
  respondent_name text,                               -- IndividualResponse.respondentName
  role            text not null check (role in ('leadership', 'staff')), -- respondentRole
  email           text,
  completed       boolean not null default false,
  invited_at      timestamptz not null default now(),
  completed_at    timestamptz                          -- IndividualResponse.completedAt
);

-- ----------------------------------------------------------------------------
-- responses
-- Eén rij per beantwoorde as (Axis) binnen een dimensie.
-- ----------------------------------------------------------------------------
create table if not exists public.responses (
  id            uuid primary key default gen_random_uuid(),
  respondent_id uuid not null references public.respondents (id) on delete cascade,
  dimension_id  text not null,                         -- Dimension.id
  axis_id       text not null,                         -- Axis.id
  score         numeric not null check (score >= 0 and score <= 100), -- Axis.score (0-100)
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- aggregated_profiles
-- Het volledige, gecombineerde profiel. De frontend leest/schrijft hier.
-- Het complete OrganisationProfile staat in de `profile` jsonb-kolom, zodat de
-- bestaande structuur 1:1 bewaard blijft (dimensions, identitySummary,
-- profitData, ...). De aparte *_avg-kolommen zijn voorbereid voor de toekomstige
-- aggregatie van leadership/staff responses.
-- ----------------------------------------------------------------------------
create table if not exists public.aggregated_profiles (
  id                 text primary key,                 -- = OrganisationProfile.id
  org_id             text references public.organizations (id) on delete set null,
  name               text not null default '',         -- meta.orgName
  type               text not null check (type in ('cultural', 'profit')), -- organisationType
  profile            jsonb not null,                   -- volledig OrganisationProfile (1:1)
  leadership_avg     jsonb,                             -- gemiddelde leadership dimensions (toekomst)
  staff_avg          jsonb,                             -- gemiddelde staff dimensions (toekomst)
  combined_weighted  jsonb,                             -- gewogen 60/40 dimensions (toekomst)
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Indexen voor veelgebruikte query's
-- ----------------------------------------------------------------------------
create index if not exists idx_aggregated_profiles_type       on public.aggregated_profiles (type);
create index if not exists idx_aggregated_profiles_updated_at on public.aggregated_profiles (updated_at desc);
create index if not exists idx_aggregated_profiles_org_id     on public.aggregated_profiles (org_id);
create index if not exists idx_respondents_org_id             on public.respondents (org_id);
create index if not exists idx_responses_respondent_id        on public.responses (respondent_id);

-- ----------------------------------------------------------------------------
-- RLS: bewust NIET ingeschakeld in deze migratie. Volgt in een aparte stap.
-- ----------------------------------------------------------------------------
