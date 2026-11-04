// Members Service
// CRUD voor het ledenregister (leden & bestuurders als contacten, geen login).
// Valt terug op localStorage wanneer Supabase niet geconfigureerd is, zodat de
// UI nooit crasht (zelfde patroon als supabaseService).

import { supabase } from './supabaseClient';

export type MemberType = 'lid' | 'bestuurder';

export interface Member {
  id: string;
  naam: string;
  type: MemberType;
  functie: string | null;
  email: string | null;
  telefoon: string | null;
  organisatie: string | null;
  notities: string | null;
  created_at: string;
  updated_at: string;
}

// Velden die bij aanmaken/bewerken ingevuld worden (id/timestamps beheert de DB).
export type MemberInput = Pick<
  Member,
  'naam' | 'type' | 'functie' | 'email' | 'telefoon' | 'organisatie' | 'notities'
>;

const STORAGE_KEY = 'ahha-members';

export function isConfigured(): boolean {
  return supabase != null;
}

// --- localStorage-fallback --------------------------------------------------
function readLocal(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Member[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(members: Member[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch {
    /* quota / private mode — stilletjes negeren */
  }
}

// --- API --------------------------------------------------------------------
export async function getMembers(): Promise<Member[]> {
  if (!supabase) {
    return readLocal().sort((a, b) => a.naam.localeCompare(b.naam, 'nl-BE'));
  }
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('naam', { ascending: true });
  if (error) {
    console.error('getMembers failed:', error.message);
    return [];
  }
  return (data ?? []) as Member[];
}

// Aanmaken (geen id) of bijwerken (met id). Geeft het bewaarde record terug.
export async function saveMember(
  input: MemberInput,
  id?: string
): Promise<{ error: string | null; member?: Member }> {
  if (!supabase) {
    const now = new Date().toISOString();
    const members = readLocal();
    if (id) {
      const idx = members.findIndex((m) => m.id === id);
      if (idx === -1) return { error: 'Lid niet gevonden.' };
      members[idx] = { ...members[idx], ...input, updated_at: now };
      writeLocal(members);
      return { error: null, member: members[idx] };
    }
    const member: Member = {
      id: crypto.randomUUID(),
      ...input,
      created_at: now,
      updated_at: now,
    };
    members.push(member);
    writeLocal(members);
    return { error: null, member };
  }

  if (id) {
    const { data, error } = await supabase
      .from('members')
      .update(input)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) return { error: error.message };
    return { error: null, member: (data ?? undefined) as Member | undefined };
  }

  const { data, error } = await supabase
    .from('members')
    .insert(input)
    .select()
    .maybeSingle();
  if (error) return { error: error.message };
  return { error: null, member: (data ?? undefined) as Member | undefined };
}

export async function deleteMember(id: string): Promise<{ error: string | null }> {
  if (!supabase) {
    writeLocal(readLocal().filter((m) => m.id !== id));
    return { error: null };
  }
  const { error } = await supabase.from('members').delete().eq('id', id);
  return { error: error ? error.message : null };
}
