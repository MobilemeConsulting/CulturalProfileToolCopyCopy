// Supabase Client
// Initialiseert één gedeelde Supabase client op basis van environment variables.
// Vervangt de Google Sheets backend; de frontend behoudt localStorage als fallback.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Duidelijke waarschuwing wanneer de env-vars ontbreken. De applicatie crasht
// niet: de service-laag valt in dat geval terug op localStorage.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase niet geconfigureerd: VITE_SUPABASE_URL en/of VITE_SUPABASE_ANON_KEY ontbreken. ' +
      'De applicatie blijft werken met localStorage als opslag. ' +
      'Maak een .env bestand aan met deze variabelen om Supabase te activeren.'
  );
}

// Geeft true terug wanneer beide env-vars aanwezig zijn.
export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// De gedeelde client. Is null wanneer de configuratie ontbreekt, zodat
// callers expliciet kunnen terugvallen op localStorage.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
