-- ============================================================================
-- AHHA Cultural Matching Tool - Opvolg-status (mini-CRM)
-- Migratie: 006_match_status
-- ============================================================================
--
-- Voegt een opvolg-statuskolom toe aan match_results zodat een match als een
-- mini-CRM kan worden opgevolgd: van 'nieuw' (zojuist gematcht), via
-- 'gecontacteerd' en 'samenwerking', tot 'afgewezen'.
-- Geen RLS-wijzigingen nodig: de bestaande admin-policy dekt de tabel.
-- ============================================================================

alter table public.match_results
  add column if not exists status text not null default 'nieuw'
  check (status in ('nieuw','gecontacteerd','samenwerking','afgewezen'));
