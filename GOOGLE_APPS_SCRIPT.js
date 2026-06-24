/**
 * AHHA Cultural Profile Tool - Google Apps Script Backend
 * 
 * INSTALLATIE INSTRUCTIES:
 * 1. Open Google Sheets en maak een nieuw spreadsheet
 * 2. Ga naar Extensions > Apps Script
 * 3. Vervang alle code met deze code
 * 4. Klik op "Deploy" > "New deployment"
 * 5. Type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone" (belangrijk voor CORS!)
 * 8. Klik "Deploy"
 * 9. Kopieer de Web App URL (eindigt op /exec)
 */

// Sheet naam waar profielen worden opgeslagen
const SHEET_NAME = 'Profiles';

// Optionele API Key voor extra beveiliging
const API_KEY = ''; // Laat leeg om API key authenticatie uit te schakelen

/**
 * doOptions handler - Voor CORS preflight requests
 * DIT IS CRUCIAAL voor cross-origin requests!
 */
function doOptions(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ success: true }));
  return output;
}

/**
 * doGet handler - Voor GET requests
 */
function doGet(e) {
  // CORS headers toevoegen
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const action = e.parameter.action;
    
    if (!action) {
      return createResponse(false, 'Invalid GET request', {}, output);
    }
    
    // Alleen getAll en get acties via GET
    if (action === 'getAll') {
      const profiles = getAllProfiles();
      return createResponse(true, 'Profiles retrieved successfully', { profiles }, output);
    }
    
    if (action === 'get' && e.parameter.id) {
      const profile = getProfile(e.parameter.id);
      if (profile) {
        return createResponse(true, 'Profile retrieved successfully', { profile }, output);
      } else {
        return createResponse(false, 'Profile not found', {}, output);
      }
    }
    
    return createResponse(false, 'Invalid action for GET request', {}, output);
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createResponse(false, 'Server error: ' + error.toString(), {}, output);
  }
}

/**
 * doPost handler - Voor POST requests
 */
function doPost(e) {
  // CORS headers toevoegen
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    // Parse JSON body
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createResponse(false, 'Invalid JSON in request body', {}, output);
    }
    
    const action = data.action;
    
    // API Key check (als ingesteld)
    if (API_KEY && data.apiKey !== API_KEY) {
      return createResponse(false, 'Invalid API key', {}, output);
    }
    
    // Route naar juiste actie
    switch (action) {
      case 'getAll':
        const profiles = getAllProfiles();
        return createResponse(true, 'Profiles retrieved successfully', { profiles }, output);
        
      case 'get':
        if (!data.id) {
          return createResponse(false, 'Missing profile ID', {}, output);
        }
        const profile = getProfile(data.id);
        if (profile) {
          return createResponse(true, 'Profile retrieved successfully', { profile }, output);
        } else {
          return createResponse(false, 'Profile not found', {}, output);
        }
        
      case 'save':
        if (!data.profile) {
          return createResponse(false, 'Missing profile data', {}, output);
        }
        const saved = saveProfile(data.profile);
        return createResponse(saved, saved ? 'Profile saved successfully' : 'Failed to save profile', {}, output);
        
      case 'delete':
        if (!data.id) {
          return createResponse(false, 'Missing profile ID', {}, output);
        }
        const deleted = deleteProfile(data.id);
        return createResponse(deleted, deleted ? 'Profile deleted successfully' : 'Profile not found', {}, output);
        
      default:
        return createResponse(false, 'Unknown action: ' + action, {}, output);
    }
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(false, 'Server error: ' + error.toString(), {}, output);
  }
}

/**
 * Create JSON response met CORS headers
 */
function createResponse(success, message, data, output) {
  const response = {
    success: success,
    message: message,
    data: data || {},
    timestamp: new Date().toISOString()
  };
  
  output.setContent(JSON.stringify(response));
  return output;
}

/**
 * Get or create sheet
 */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Header row
    sheet.getRange(1, 1, 1, 4).setValues([['ID', 'Data', 'Created', 'Updated']]);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  
  return sheet;
}

/**
 * Get alle profielen
 */
function getAllProfiles() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return [];
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  const profiles = [];
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0]) { // Check if ID exists
      try {
        const profile = JSON.parse(data[i][1]);
        profiles.push(profile);
      } catch (e) {
        Logger.log('Error parsing profile at row ' + (i + 2) + ': ' + e.toString());
      }
    }
  }
  
  return profiles;
}

/**
 * Get enkel profiel
 */
function getProfile(id) {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return null;
  }
  
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  
  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) {
      const jsonData = sheet.getRange(i + 2, 2).getValue();
      try {
        return JSON.parse(jsonData);
      } catch (e) {
        Logger.log('Error parsing profile: ' + e.toString());
        return null;
      }
    }
  }
  
  return null;
}

/**
 * Save profiel (insert or update)
 */
function saveProfile(profile) {
  try {
    const sheet = getSheet();
    const id = profile.id;
    const jsonData = JSON.stringify(profile);
    const now = new Date().toISOString();
    
    // Check if profile already exists
    const lastRow = sheet.getLastRow();
    
    if (lastRow > 1) {
      const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      
      for (let i = 0; i < ids.length; i++) {
        if (ids[i][0] === id) {
          // Update existing
          sheet.getRange(i + 2, 2).setValue(jsonData);
          sheet.getRange(i + 2, 4).setValue(now);
          return true;
        }
      }
    }
    
    // Insert new
    const newRow = lastRow + 1;
    sheet.getRange(newRow, 1, 1, 4).setValues([[
      id,
      jsonData,
      profile.createdAt || now,
      now
    ]]);
    
    return true;
    
  } catch (error) {
    Logger.log('Error saving profile: ' + error.toString());
    return false;
  }
}

/**
 * Delete profiel
 */
function deleteProfile(id) {
  try {
    const sheet = getSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return false;
    }
    
    const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    
    for (let i = 0; i < ids.length; i++) {
      if (ids[i][0] === id) {
        sheet.deleteRow(i + 2);
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    Logger.log('Error deleting profile: ' + error.toString());
    return false;
  }
}

/**
 * Test functie - Run dit om te testen of alles werkt
 */
function testScript() {
  // Test save
  const testProfile = {
    id: 'test-123',
    organisationType: 'cultural',
    meta: {
      orgName: 'Test Organisatie',
      orgType: 'Museum',
      year: 2026
    },
    dimensions: [],
    identitySummary: {
      toneOfVoice: [],
      visualKeywords: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  Logger.log('Testing save...');
  const saved = saveProfile(testProfile);
  Logger.log('Save result: ' + saved);
  
  Logger.log('Testing getAll...');
  const profiles = getAllProfiles();
  Logger.log('Found profiles: ' + profiles.length);
  
  Logger.log('Testing get...');
  const profile = getProfile('test-123');
  Logger.log('Found profile: ' + (profile ? profile.meta.orgName : 'null'));
  
  Logger.log('Testing delete...');
  const deleted = deleteProfile('test-123');
  Logger.log('Delete result: ' + deleted);
}