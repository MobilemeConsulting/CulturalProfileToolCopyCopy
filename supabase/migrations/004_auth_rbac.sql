-- ============================================================================
-- AHHA Cultural Matching Tool - Authenticatie & RBAC
-- Migratie: 004_auth_rbac
-- ============================================================================
--
-- Voegt rolgebaseerde toegang (RBAC) toe bovenop Supabase Auth:
--   user_roles  : koppelt een auth-gebruiker aan een rol ('admin' / 'user')
--   is_admin()  : helper die controleert of de huidige gebruiker admin is
--
-- De /admin omgeving en match_results worden hierna admin-only. De publieke
-- app (aggregated_profiles) blijft ongewijzigd toegankelijk via de anon-key,
-- zodat de klant-flow blijft werken.
--
-- BOOTSTRAP (eenmalig, zie onderaan): de eerste admin moet handmatig worden
-- aangemaakt, want alleen admins mogen rollen toekennen.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- user_roles
-- ----------------------------------------------------------------------------
create table if not exists public.user_roles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  role        text not null default 'user' check (role in ('admin', 'user')),
  created_at  timestamptz not null default now()
);

alter table public.user_roles enable row level security;

-- ----------------------------------------------------------------------------
-- is_admin(): security definer zodat het de RLS op user_roles niet hertriggert
-- (voorkomt oneindige recursie in policies).
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------------
-- RLS policies user_roles:
--   - iedere ingelogde gebruiker mag zijn eigen rol lezen
--   - admins mogen alles (rollen toekennen/wijzigen/verwijderen)
-- ----------------------------------------------------------------------------
drop policy if exists "read own role" on public.user_roles;
create policy "read own role"
  on public.user_roles
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admin manage roles" on public.user_roles;
create policy "admin manage roles"
  on public.user_roles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- match_results: vervang de open anon-policy (uit 003) door admin-only.
-- ----------------------------------------------------------------------------
drop policy if exists "anon full access match_results" on public.match_results;
drop policy if exists "admin match_results" on public.match_results;
create policy "admin match_results"
  on public.match_results
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- BOOTSTRAP - eenmalig uitvoeren NADAT je je eerste admin-gebruiker hebt
-- aangemaakt (Supabase Dashboard > Authentication > Add user). Vervang het
-- e-mailadres en run deze query los:
--
--   insert into public.user_roles (user_id, role)
--   select id, 'admin' from auth.users where email = 'jouw@email.be'
--   on conflict (user_id) do update set role = 'admin';
-- ============================================================================
