// Match Status Service
// Beheert de opvolg-status (mini-CRM) van een match in match_results.
// Valt netjes terug met een foutmelding wanneer Supabase niet geconfigureerd is.

import { supabase } from './supabaseClient';

// De toegestane opvolg-statussen, in logische volgorde.
export const MATCH_STATUSES = ['nieuw', 'gecontacteerd', 'samenwerking', 'afgewezen'] as const;

// Type afgeleid van de toegestane statussen.
export type MatchStatus = typeof MATCH_STATUSES[number];

// Gebruiksvriendelijke Nederlandse labels per status.
export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  nieuw: 'Nieuw',
  gecontacteerd: 'Gecontacteerd',
  samenwerking: 'Samenwerking',
  afgewezen: 'Afgewezen',
};

// Werkt de opvolg-status van een match bij. Geeft {error: null} bij succes,
// of {error: <boodschap>} wanneer Supabase ontbreekt of de update faalt.
export async function updateMatchStatus(
  id: string,
  status: MatchStatus
): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: 'Supabase is niet geconfigureerd.' };
  }

  const { error } = await supabase.from('match_results').update({ status }).eq('id', id);

  return { error: error ? error.message : null };
}
