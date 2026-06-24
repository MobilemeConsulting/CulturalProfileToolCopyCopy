// Google Sheets API Service
// Verbindt de frontend met Google Apps Script backend

import { OrganisationProfile, ProfitProfileData, IndividualResponse } from '../data/types';

// CONFIGURATIE: Kan via localStorage of environment variables
function getGoogleSheetsUrl(): string {
  return localStorage.getItem('googleSheetsUrl') || import.meta.env.VITE_GOOGLE_SHEETS_URL || '';
}

function getApiKey(): string {
  return localStorage.getItem('googleSheetsApiKey') || import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

// Check of Google Sheets geconnecteerd is
export function isGoogleSheetsConfigured(): boolean {
  return getGoogleSheetsUrl().length > 0;
}

// Alle profielen ophalen van Google Sheets
export async function getAllProfilesFromSheets(): Promise<OrganisationProfile[]> {
  if (!isGoogleSheetsConfigured()) {
    console.warn('Google Sheets not configured, using localStorage');
    return [];
  }

  try {
    const apiKey = getApiKey();
    const payload = {
      action: 'getAll',
      ...(apiKey && { apiKey }),
    };

    console.log('Fetching profiles with POST request'); // Debug log
    
    // Probeer eerst met 'cors' mode
    let response;
    try {
      response = await fetch(getGoogleSheetsUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Gebruik text/plain om CORS preflight te vermijden
        },
        body: JSON.stringify(payload),
        mode: 'cors',
        cache: 'no-cache',
      });
    } catch (corsError) {
      console.log('CORS mode failed, trying no-cors mode');
      // Als CORS faalt, probeer met no-cors mode
      response = await fetch(getGoogleSheetsUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors',
        cache: 'no-cache',
      });
    }

    console.log('Response status:', response.status); // Debug log
    console.log('Response ok:', response.ok); // Debug log
    console.log('Response type:', response.type); // Debug log

    // no-cors returns opaque response
    if (response.type === 'opaque') {
      // We kunnen de response niet lezen in no-cors mode
      // Maar de request is wel verstuurd
      console.warn('Opaque response received - no-cors mode active');
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result: ApiResponse<{ profiles: OrganisationProfile[] }> = await response.json();
    
    if (result.success && result.data?.profiles) {
      return result.data.profiles;
    } else {
      console.error('Failed to fetch profiles:', result.message);
      return [];
    }
  } catch (error) {
    console.error('Detailed error:', error); // More detailed error log
    
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('❌ CORS Error\n\nJe Google Apps Script blokkeert externe requests.\n\n📋 Oplossing:\n1. Open je Apps Script\n2. Voeg deze functie toe bovenaan je code:\n\nfunction doOptions(e) {\n  return ContentService\n    .createTextOutput()\n    .setMimeType(ContentService.MimeType.JSON)\n    .setContent(JSON.stringify({success: true}));\n}\n\n3. Deploy opnieuw\n4. Test opnieuw');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Onbekende fout bij ophalen van profielen');
  }
}

// Enkel profiel ophalen
export async function getProfileFromSheets(id: string): Promise<OrganisationProfile | null> {
  if (!isGoogleSheetsConfigured()) {
    return null;
  }

  try {
    const url = `${getGoogleSheetsUrl()}?action=get&id=${encodeURIComponent(id)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<{ profile: OrganisationProfile }> = await response.json();
    
    if (result.success && result.data?.profile) {
      return result.data.profile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching profile from Google Sheets:', error);
    throw error;
  }
}

// Profiel opslaan naar Google Sheets
export async function saveProfileToSheets(profile: OrganisationProfile): Promise<boolean> {
  if (!isGoogleSheetsConfigured()) {
    console.warn('Google Sheets not configured, using localStorage');
    return false;
  }

  try {
    const apiKey = getApiKey();
    const payload = {
      action: 'save',
      profile,
      ...(apiKey && { apiKey }),
    };

    console.log('Saving profile to Google Sheets...'); // Debug log

    const response = await fetch(getGoogleSheetsUrl(), {
      method: 'POST',
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    // Check response type
    console.log('Response type:', response.type);
    console.log('Response status:', response.status);

    // Als we een opaque response krijgen (no-cors), kunnen we niet controleren
    if (response.type === 'opaque') {
      console.log('Opaque response - data is saved but we cannot verify');
      // Assume success in opaque mode
      return true;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<unknown> = await response.json();
    
    if (result.success) {
      console.log('Profile saved successfully to Google Sheets');
      return true;
    } else {
      console.error('Failed to save profile:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    
    // Don't throw error, just return false so localStorage can be used
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn('CORS error - using localStorage as fallback');
      return false;
    }
    
    return false;
  }
}

// Profiel verwijderen
export async function deleteProfileFromSheets(id: string): Promise<boolean> {
  if (!isGoogleSheetsConfigured()) {
    return false;
  }

  try {
    const apiKey = getApiKey();
    const payload = {
      action: 'delete',
      id: id,
      ...(apiKey && { apiKey }),
    };

    const response = await fetch(getGoogleSheetsUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting profile from Google Sheets:', error);
    throw error;
  }
}

// Bulk save - meerdere profielen tegelijk opslaan
export async function saveBulkProfilesToSheets(profiles: OrganisationProfile[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const profile of profiles) {
    try {
      const saved = await saveProfileToSheets(profile);
      if (saved) {
        success++;
      } else {
        failed++;
      }
    } catch (error) {
      failed++;
    }
  }

  return { success, failed };
}

// Synchronisatie: merge lokale data met Google Sheets
export async function syncWithGoogleSheets(localProfiles: OrganisationProfile[]): Promise<OrganisationProfile[]> {
  if (!isGoogleSheetsConfigured()) {
    console.log('Google Sheets not configured, skipping sync');
    return localProfiles;
  }

  try {
    // Haal remote profielen op
    const remoteProfiles = await getAllProfilesFromSheets();
    
    // Maak map van remote profielen
    const remoteMap = new Map<string, OrganisationProfile>();
    remoteProfiles.forEach(p => remoteMap.set(p.id, p));
    
    // Merge logic: nieuwste versie wint (gebaseerd op updatedAt)
    const merged = new Map<string, OrganisationProfile>();
    
    // Voeg alle lokale profielen toe
    localProfiles.forEach(local => {
      merged.set(local.id, local);
    });
    
    // Check remote profielen
    remoteProfiles.forEach(remote => {
      const local = merged.get(remote.id);
      
      if (!local) {
        // Alleen in remote, toevoegen
        merged.set(remote.id, remote);
      } else {
        // Beide aanwezig, kies nieuwste
        const localDate = new Date(local.updatedAt || local.createdAt);
        const remoteDate = new Date(remote.updatedAt || remote.createdAt);
        
        if (remoteDate > localDate) {
          merged.set(remote.id, remote);
        }
      }
    });
    
    // Sync lokale profielen die nieuwer zijn naar remote
    for (const profile of merged.values()) {
      const remote = remoteMap.get(profile.id);
      if (!remote || new Date(profile.updatedAt || profile.createdAt) > new Date(remote.updatedAt || remote.createdAt)) {
        try {
          await saveProfileToSheets(profile);
        } catch (error) {
          // Silently fail individual saves during sync
          console.error(`Failed to sync profile ${profile.id}:`, error);
        }
      }
    }
    
    return Array.from(merged.values());
  } catch (error) {
    console.error('Error syncing with Google Sheets:', error);
    // Always return local profiles as fallback
    return localProfiles;
  }
}