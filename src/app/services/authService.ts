// Auth Service
// Dunne wrapper rond Supabase Auth voor de admin-omgeving (RBAC).
// Valt veilig terug wanneer Supabase niet geconfigureerd is.

import { supabase } from './supabaseClient';

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

// Controleert of de ingelogde gebruiker de rol 'admin' heeft in user_roles.
export async function isAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('isAdmin check failed:', error.message);
    return false;
  }
  return data?.role === 'admin';
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
  role: 'admin' | 'user';
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

// Nieuwe gebruiker uitnodigen via de Edge Function (mail loopt via Brevo-SMTP).
export async function inviteUser(
  email: string,
  role: 'admin' | 'user'
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is niet geconfigureerd.' };
  const redirectTo = `${window.location.origin}/admin/accept`;
  try {
    const { data, error } = await supabase.functions.invoke('invite-user', {
      body: { email, role, redirectTo },
    });
    if (error) {
      // FunctionsHttpError bevat de response body in error.context
      let detail = error.message;
      try {
        const ctx = (error as any).context;
        if (ctx && typeof ctx.json === 'function') {
          const body = await ctx.json();
          if (body?.error) detail = body.error;
        } else if (data?.error) {
          detail = data.error;
        }
      } catch {
        // ctx.json() kan falen — gebruik dan data of error.message
        if (data?.error) detail = data.error;
      }
      return { error: detail };
    }
    if (data?.error) return { error: data.error };
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Onbekende fout bij uitnodigen.' };
  }
}

// Rol van een bestaande gebruiker wijzigen (admin RLS staat dit toe).
export async function setUserRole(
  userId: string,
  role: 'admin' | 'user'
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is niet geconfigureerd.' };
  const { error } = await supabase.from('user_roles').upsert({ user_id: userId, role });
  return { error: error ? error.message : null };
}

// Eigen wachtwoord instellen (gebruikt bij het accepteren van een uitnodiging).
export async function setPassword(password: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase is niet geconfigureerd.' };
  const { error } = await supabase.auth.updateUser({ password });
  return { error: error ? error.message : null };
}
