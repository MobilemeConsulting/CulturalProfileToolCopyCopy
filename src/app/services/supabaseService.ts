// Supabase Service
// Vervangt de Google Sheets backend. Biedt exact dezelfde publieke functies en
// signatures aan als googleSheets.ts (onder neutrale namen), zodat App.tsx en
// GoogleSheetsConfig.tsx slechts hun imports hoeven aan te passen.
//
// Fallback-gedrag (identiek aan de oude Google Sheets service):
//   - Niet geconfigureerd  -> getAllProfiles() => [], saveProfile() => false, etc.
//   - De applicatie crasht nooit; de frontend gebruikt localStorage als opslag.

import { OrganisationProfile } from '../data/types';
import { supabase, hasSupabaseConfig } from './supabaseClient';

// De tabel die het volledige (gecombineerde) profiel bewaart. Het complete
// OrganisationProfile-object staat in de `profile` jsonb-kolom; daarnaast zijn er
// genormaliseerde kolommen voor id, name, type, created_at en updated_at.
const PROFILES_TABLE = 'aggregated_profiles';

// Vorm van één rij in aggregated_profiles.
interface ProfileRow {
  id: string;
  name: string;
  type: OrganisationProfile['organisationType'];
  profile: OrganisationProfile;
  created_at: string;
  updated_at: string;
}

// Zet een OrganisationProfile om naar een databasetabel-rij.
function toRow(profile: OrganisationProfile): ProfileRow {
  return {
    id: profile.id,
    name: profile.meta?.orgName ?? '',
    type: profile.organisationType,
    profile,
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
  };
}

// Haalt het volledige OrganisationProfile uit een databaserij. De jsonb-kolom
// bewaart de structuur 1:1, dus die geven we onverkort terug.
function fromRow(row: { profile: OrganisationProfile }): OrganisationProfile {
  return row.profile;
}

// Check of Supabase geconfigureerd is (env-vars aanwezig).
export function isConfigured(): boolean {
  return hasSupabaseConfig();
}

// Alle profielen ophalen van Supabase.
export async function getAllProfiles(): Promise<OrganisationProfile[]> {
  if (!supabase || !isConfigured()) {
    console.warn('Supabase not configured, using localStorage');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select('profile')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch profiles:', error.message);
      return [];
    }

    return (data ?? []).map(fromRow);
  } catch (error) {
    console.error('Error fetching profiles from Supabase:', error);
    return [];
  }
}

// Enkel profiel ophalen op basis van id.
export async function getProfile(id: string): Promise<OrganisationProfile | null> {
  if (!supabase || !isConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(PROFILES_TABLE)
      .select('profile')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile from Supabase:', error.message);
      return null;
    }

    return data ? fromRow(data) : null;
  } catch (error) {
    console.error('Error fetching profile from Supabase:', error);
    return null;
  }
}

// Profiel opslaan naar Supabase (insert of update op id).
export async function saveProfile(profile: OrganisationProfile): Promise<boolean> {
  if (!supabase || !isConfigured()) {
    console.warn('Supabase not configured, using localStorage');
    return false;
  }

  try {
    const { error } = await supabase
      .from(PROFILES_TABLE)
      .upsert(toRow(profile), { onConflict: 'id' });

    if (error) {
      console.error('Failed to save profile:', error.message);
      return false;
    }

    console.log('Profile saved successfully to Supabase');
    return true;
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    // Niet throwen: de frontend valt terug op localStorage.
    return false;
  }
}

// Profiel verwijderen op basis van id.
export async function deleteProfile(id: string): Promise<boolean> {
  if (!supabase || !isConfigured()) {
    return false;
  }

  try {
    const { error } = await supabase.from(PROFILES_TABLE).delete().eq('id', id);

    if (error) {
      console.error('Error deleting profile from Supabase:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting profile from Supabase:', error);
    return false;
  }
}

// Bulk save - meerdere profielen tegelijk opslaan.
export async function saveBulkProfiles(
  profiles: OrganisationProfile[]
): Promise<{ success: number; failed: number }> {
  if (!supabase || !isConfigured()) {
    return { success: 0, failed: profiles.length };
  }

  try {
    const { error } = await supabase
      .from(PROFILES_TABLE)
      .upsert(profiles.map(toRow), { onConflict: 'id' });

    if (error) {
      console.error('Bulk save failed:', error.message);
      return { success: 0, failed: profiles.length };
    }

    return { success: profiles.length, failed: 0 };
  } catch (error) {
    console.error('Error bulk saving to Supabase:', error);
    return { success: 0, failed: profiles.length };
  }
}

// Synchronisatie: merge lokale data met Supabase.
// Nieuwste versie wint (gebaseerd op updatedAt). Lokale profielen die nieuwer
// zijn worden naar Supabase gepusht. Bij elke fout vallen we terug op de
// lokale profielen, zodat de gebruiker nooit data verliest.
export async function syncProfiles(
  localProfiles: OrganisationProfile[]
): Promise<OrganisationProfile[]> {
  if (!supabase || !isConfigured()) {
    console.log('Supabase not configured, skipping sync');
    return localProfiles;
  }

  try {
    const remoteProfiles = await getAllProfiles();

    const remoteMap = new Map<string, OrganisationProfile>();
    remoteProfiles.forEach((p) => remoteMap.set(p.id, p));

    // Merge: start met alle lokale profielen, vul aan/overschrijf met nieuwere remote.
    const merged = new Map<string, OrganisationProfile>();
    localProfiles.forEach((local) => merged.set(local.id, local));

    remoteProfiles.forEach((remote) => {
      const local = merged.get(remote.id);
      if (!local) {
        merged.set(remote.id, remote);
      } else {
        const localDate = new Date(local.updatedAt || local.createdAt);
        const remoteDate = new Date(remote.updatedAt || remote.createdAt);
        if (remoteDate > localDate) {
          merged.set(remote.id, remote);
        }
      }
    });

    // Push lokale profielen die nieuwer (of nieuw) zijn naar Supabase.
    for (const profile of merged.values()) {
      const remote = remoteMap.get(profile.id);
      if (
        !remote ||
        new Date(profile.updatedAt || profile.createdAt) >
          new Date(remote.updatedAt || remote.createdAt)
      ) {
        try {
          await saveProfile(profile);
        } catch (error) {
          // Individuele save-fouten tijdens sync stil negeren.
          console.error(`Failed to sync profile ${profile.id}:`, error);
        }
      }
    }

    return Array.from(merged.values());
  } catch (error) {
    console.error('Error syncing with Supabase:', error);
    // Altijd lokale profielen teruggeven als fallback.
    return localProfiles;
  }
}

// ---------------------------------------------------------------------------
// Match results (admin matching / ranking)
// ---------------------------------------------------------------------------

const MATCH_RESULTS_TABLE = 'match_results';

export interface MatchResult {
  id?: string;
  cultural_id: string;
  profit_id: string;
  match_score: number;
  dimension_scores: unknown;
  created_at?: string;
}

// Eén matchresultaat opslaan. Zelfde fallback-stijl: geen config -> false.
export async function saveMatchResult(result: MatchResult): Promise<boolean> {
  if (!supabase || !isConfigured()) {
    console.warn('Supabase not configured, match result not saved');
    return false;
  }

  try {
    const { error } = await supabase.from(MATCH_RESULTS_TABLE).insert({
      cultural_id: result.cultural_id,
      profit_id: result.profit_id,
      match_score: result.match_score,
      dimension_scores: result.dimension_scores,
    });

    if (error) {
      console.error('Failed to save match result:', error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving match result to Supabase:', error);
    return false;
  }
}

// Alle opgeslagen matchresultaten ophalen (nieuwste eerst).
export async function getMatchResults(): Promise<MatchResult[]> {
  if (!supabase || !isConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(MATCH_RESULTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch match results:', error.message);
      return [];
    }

    return (data ?? []) as MatchResult[];
  } catch (error) {
    console.error('Error fetching match results from Supabase:', error);
    return [];
  }
}
