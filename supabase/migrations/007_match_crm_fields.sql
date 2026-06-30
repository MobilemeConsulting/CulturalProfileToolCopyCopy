-- ============================================================================
-- AHHA Cultural Matching Tool - CRM-uitbreiding op match_results
-- Migratie: 007_match_crm_fields
-- ============================================================================
--
-- Voegt notities, contactpersoon, en opvolgdata toe aan match_results.
-- Geen RLS-wijzigingen nodig: de bestaande admin-policy dekt de tabel.
-- ============================================================================

alter table public.match_results
  add column if not exists notes text default '',
  add column if not exists contact_name text default '',
  add column if not exists contact_email text default '',
  add column if not exists contact_phone text default '',
  add column if not exists last_contact_at timestamptz,
  add column if not exists next_contact_at timestamptz;
