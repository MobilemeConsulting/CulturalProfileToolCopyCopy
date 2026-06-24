-- ============================================================================
-- AHHA Cultural Matching Tool - Admin gebruikerslijst (RPC)
-- Migratie: 005_admin_users_rpc
-- ============================================================================
--
-- get_admin_users(): geeft de gebruikers + rollen terug voor het admin
-- gebruikersbeheer. auth.users is niet rechtstreeks leesbaar vanuit de client,
-- dus dit gebeurt via een security-definer functie die enkel voor admins werkt.
-- ============================================================================

create or replace function public.get_admin_users()
returns table (
  id              uuid,
  email           text,
  role            text,
  created_at      timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden: admin role required';
  end if;

  return query
    select
      u.id,
      u.email::text,
      coalesce(r.role, 'user') as role,
      u.created_at,
      u.last_sign_in_at
    from auth.users u
    left join public.user_roles r on r.user_id = u.id
    order by u.created_at desc;
end;
$$;
