// Auth Service
// Dunne wrapper rond Supabase Auth voor de admin-omgeving (RBAC).
// Valt veilig terug wanneer Supabase niet geconfigureerd is.

import { supabase } from './supabaseClient';

// Rollen in het systeem.
//   admin       - volledige toegang incl. gebruikers-/rollenbeheer
//   bestuurder  - mag inloggen en met de data werken, geen gebruikersbeheer
//   lid / user  - geen /admin-toegang
export type Role = 'admin' | 'bestuurder' | 'lid' | 'user';

// Rollen die mogen inloggen op /admin en de data mogen zien (staff).
export const STAFF_ROLES: Role[] = ['admin', 'bestuurder'];

export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is niet geconfigureerd.' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error ? error.message : null };
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

// Haalt de rol van de ingelogde gebruiker op uit user_roles (null = geen rol).
export async function getRole(): Promise<Role | null> {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('getRole check failed:', error.message);
    return null;
  }
  return (data?.role as Role) ?? null;
}

// Controleert of de ingelogde gebruiker de rol 'admin' heeft in user_roles.
export async function isAdmin(): Promise<boolean> {
  return (await getRole()) === 'admin';
}

// Staff = admin OF bestuurder (mag inloggen en met de data werken).
export async function isStaff(): Promise<boolean> {
  const role = await getRole();
  return role != null && STAFF_ROLES.includes(role);
}

// Abonneert op auth-wijzigingen (login/logout). Geeft de subscription terug
// zodat de caller kan opruimen.
export function onAuthChange(callback: () => void) {
  if (!supabase) return null;
  const { data } = supabase.auth.onAuthStateChange(() => callback());
  return data.subscription;
}

// ---------------------------------------------------------------------------
// Gebruikersbeheer (admin)
// ---------------------------------------------------------------------------

export interface AdminUser {
  id: string;
  email: string;
  role: Role;
  created_at: string;
  last_sign_in_at: string | null;
}

// Alle gebruikers + rollen ophalen via de security-definer RPC (admin-only).
export async function listUsers(): Promise<AdminUser[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('get_admin_users');
  if (error) {
    console.error('listUsers failed:', error.message);
    return [];
  }
  return (data ?? []) as AdminUser[];
}

// Nieuwe gebruiker uitnodigen via de Edge Function.
// Geeft { error, inviteLink } terug — de link kan getoond worden als SMTP niet werkt.
export async function inviteUser(
  email: string,
  role: Role
): Promise<{ error: string | null; inviteLink?: string }> {
  if (!supabase) return { error: 'Supabase is niet geconfigureerd.' };
  const redirectTo = `${window.location.origin}/admin/accept`;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

    const res = await fetch(`${supabaseUrl}/functions/v1/invite-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token ?? anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({ email, role, redirectTo }),
    });

    const rawText = await res.text();
    let body: any = {};
    try { body = JSON.parse(rawText); } catch { /* niet-JSON response */ }

    if (!res.ok) {
      const msg = body?.error || body?.message || rawText || `Fout ${res.status}: ${res.statusText}`;
      return { error: msg };
    }
    if (body?.error) return { error: body.error };
    return { error: null, inviteLink: body?.inviteLink || undefined };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Onbekende fout bij uitnodigen.' };
  }
}

// Rol van een bestaande gebruiker wijzigen (admin RLS staat dit toe).
export async function setUserRole(
  userId: string,
  role: Role
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is niet geconfigureerd.' };
  const { error } = await supabase.from('user_roles').upsert({ user_id: userId, role });
  return { error: error ? error.message : null };
}

// Gebruiker verwijderen (admin-only, via edge function).
export async function deleteUser(userId: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is niet geconfigureerd.' };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

    const res = await fetch(`${supabaseUrl}/functions/v1/invite-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token ?? anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({ action: 'delete', userId }),
    });

    const rawText = await res.text();
    let body: any = {};
    try { body = JSON.parse(rawText); } catch { /* niet-JSON response */ }

    if (!res.ok) {
      return { error: body?.error || rawText || `Fout ${res.status}` };
    }
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Onbekende fout bij verwijderen.' };
  }
}

// Nieuwe invite-link genereren voor een bestaande gebruiker (resend).
export async function resendInvite(
  email: string,
  role: Role
): Promise<{ error: string | null; inviteLink?: string }> {
  // Hergebruik inviteUser — generateLink genereert een nieuwe token.
  return inviteUser(email, role);
}

// Wachtwoord van een andere gebruiker resetten (admin-only, via edge function).
export async function resetUserPassword(
  userId: string,
  newPassword: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is niet geconfigureerd.' };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

    const res = await fetch(`${supabaseUrl}/functions/v1/invite-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token ?? anonKey}`,
        'apikey': anonKey,
      },
      body: JSON.stringify({ action: 'reset-password', userId, newPassword }),
    });

    const rawText = await res.text();
    let body: any = {};
    try { body = JSON.parse(rawText); } catch { /* niet-JSON response */ }

    if (!res.ok) {
      return { error: body?.error || rawText || `Fout ${res.status}` };
    }
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Onbekende fout bij wachtwoord resetten.' };
  }
}

// Eigen wachtwoord instellen (gebruikt bij het accepteren van een uitnodiging).
export async function setPassword(password: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is niet geconfigureerd.' };
  const { error } = await supabase.auth.updateUser({ password });
  return { error: error ? error.message : null };
}
