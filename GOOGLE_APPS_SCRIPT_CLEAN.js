// AHHA Cultural Profile Tool - Google Apps Script Backend
// 
// INSTALLATIE INSTRUCTIES:
// 1. Open Google Sheets en maak een nieuw spreadsheet
// 2. Ga naar Extensions > Apps Script
// 3. Vervang alle code met deze code
// 4. Klik op "Deploy" > "New deployment"
// 5. Type: "Web app"
// 6. Execute as: "Me"
// 7. Who has access: "Anyone" (belangrijk voor CORS!)
// 8. Klik "Deploy"
// 9. Kopieer de Web App URL (eindigt op /exec)

// Sheet naam waar profielen worden opgeslagen
var SHEET_NAME = 'Profiles';

// Optionele API Key voor extra beveiliging
var API_KEY = ''; // Laat leeg om API key authenticatie uit te schakelen

// doOptions handler - Voor CORS preflight requests
// DIT IS CRUCIAAL voor cross-origin requests!
function doOptions(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ success: true }));
  return output;
}

// doGet handler - Voor GET requests
function doGet(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    var action = e.parameter.action;
    
    if (!action) {
      return createResponse(false, 'Invalid GET request', {}, output);
    }
    
    if (action === 'getAll') {
      var profiles = getAllProfiles();
      return createResponse(true, 'Profiles retrieved successfully', { profiles: profiles }, output);
    }
    
    if (action === 'get' && e.parameter.id) {
      var profile = getProfile(e.parameter.id);
      if (profile) {
        return createResponse(true, 'Profile retrieved successfully', { profile: profile }, output);
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

// doPost handler - Voor POST requests
function doPost(e) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return createResponse(false, 'Invalid JSON in request body', {}, output);
    }
    
    var action = data.action;
    
    if (API_KEY && data.apiKey !== API_KEY) {
      return createResponse(false, 'Invalid API key', {}, output);
    }
    
    if (action === 'getAll') {
      var profiles = getAllProfiles();
      return createResponse(true, 'Profiles retrieved successfully', { profiles: profiles }, output);
    }
    
    if (action === 'get') {
      if (!data.id) {
        return createResponse(false, 'Missing profile ID', {}, output);
      }
      var profile = getProfile(data.id);
      if (profile) {
        return createResponse(true, 'Profile retrieved successfully', { profile: profile }, output);
      } else {
        return createResponse(false, 'Profile not found', {}, output);
      }
    }
    
    if (action === 'save') {
      if (!data.profile) {
        return createResponse(false, 'Missing profile data', {}, output);
      }
      var saved = saveProfile(data.profile);
      return createResponse(saved, saved ? 'Profile saved successfully' : 'Failed to save profile', {}, output);
    }
    
    if (action === 'delete') {
      if (!data.id) {
        return createResponse(false, 'Missing profile ID', {}, output);
      }
      var deleted = deleteProfile(data.id);
      return createResponse(deleted, deleted ? 'Profile deleted successfully' : 'Profile not found', {}, output);
    }
    
    return createResponse(false, 'Unknown action: ' + action, {}, output);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse(false, 'Server error: ' + error.toString(), {}, output);
  }
}

// Create JSON response
function createResponse(success, message, data, output) {
  var response = {
    success: success,
    message: message,
    data: data || {},
    timestamp: new Date().toISOString()
  };
  
  output.setContent(JSON.stringify(response));
  return output;
}

// Get or create sheet
function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 4).setValues([['ID', 'Data', 'Created', 'Updated']]);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  
  return sheet;
}

// Get alle profielen
function getAllProfiles() {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return [];
  }
  
  var data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  var profiles = [];
  
  for (var i = 0; i < data.length; i++) {
    if (data[i][0]) {
      try {
        var profile = JSON.parse(data[i][1]);
        profiles.push(profile);
      } catch (e) {
        Logger.log('Error parsing profile at row ' + (i + 2) + ': ' + e.toString());
      }
    }
  }
  
  return profiles;
}

// Get enkel profiel
function getProfile(id) {
  var sheet = getSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    return null;
  }
  
  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === id) {
      var jsonData = sheet.getRange(i + 2, 2).getValue();
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

// Save profiel (insert or update)
function saveProfile(profile) {
  try {
    var sheet = getSheet();
    var id = profile.id;
    var jsonData = JSON.stringify(profile);
    var now = new Date().toISOString();
    
    var lastRow = sheet.getLastRow();
    
    if (lastRow > 1) {
      var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] === id) {
          sheet.getRange(i + 2, 2).setValue(jsonData);
          sheet.getRange(i + 2, 4).setValue(now);
          return true;
        }
      }
    }
    
    var newRow = lastRow + 1;
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

// Delete profiel
function deleteProfile(id) {
  try {
    var sheet = getSheet();
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return false;
    }
    
    var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    
    for (var i = 0; i < ids.length; i++) {
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

// Test functie - Run dit om te testen of alles werkt
function testScript() {
  var testProfile = {
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
  var saved = saveProfile(testProfile);
  Logger.log('Save result: ' + saved);
  
  Logger.log('Testing getAll...');
  var profiles = getAllProfiles();
  Logger.log('Found profiles: ' + profiles.length);
  
  Logger.log('Testing get...');
  var profile = getProfile('test-123');
  Logger.log('Found profile: ' + (profile ? profile.meta.orgName : 'null'));
  
  Logger.log('Testing delete...');
  var deleted = deleteProfile('test-123');
  Logger.log('Delete result: ' + deleted);
}
