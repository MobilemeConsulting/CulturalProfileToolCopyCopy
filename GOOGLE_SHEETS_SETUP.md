# Google Sheets Integratie Setup

## Stap 1: Google Sheets Aanmaken

1. Maak een nieuwe Google Sheet aan met de naam "AHHA Profiling Tool Data"
2. Maak de volgende tabs (sheets):
   - `Profiles` - voor alle organisatieprofielen
   - `Metadata` - voor tracking en logging
   - `Config` - voor configuratie

## Stap 2: Google Apps Script Installeren

1. Open je Google Sheet
2. Ga naar **Extensions > Apps Script**
3. Verwijder de standaard code
4. Kopieer en plak de volgende code:

```javascript
// =======================
// AHHA PROFILING TOOL - GOOGLE APPS SCRIPT BACKEND
// =======================

const SHEET_NAME = 'Profiles';
const METADATA_SHEET = 'Metadata';

// Hoofdfunctie die alle HTTP requests afhandelt
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'save':
        return saveProfile(data.profile);
      case 'getAll':
        return getAllProfiles();
      case 'delete':
        return deleteProfile(data.id);
      case 'update':
        return updateProfile(data.profile);
      default:
        return createResponse(false, 'Unknown action');
    }
  } catch (error) {
    return createResponse(false, error.toString());
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getAll') {
      return getAllProfiles();
    } else if (action === 'get' && e.parameter.id) {
      return getProfile(e.parameter.id);
    }
    
    return createResponse(false, 'Invalid GET request');
  } catch (error) {
    return createResponse(false, error.toString());
  }
}

// Profiel opslaan
function saveProfile(profile) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Maak sheet aan als die niet bestaat
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['ID', 'Organisation Name', 'Type', 'Created At', 'Updated At', 'JSON Data']);
  }
  
  // Check of profiel al bestaat
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === profile.id) {
      rowIndex = i + 1;
      break;
    }
  }
  
  const row = [
    profile.id,
    profile.meta?.orgName || 'Unknown',
    profile.organisationType,
    profile.createdAt || new Date().toISOString(),
    new Date().toISOString(),
    JSON.stringify(profile)
  ];
  
  if (rowIndex > 0) {
    // Update bestaand profiel
    sheet.getRange(rowIndex, 1, 1, 6).setValues([row]);
  } else {
    // Nieuw profiel toevoegen
    sheet.appendRow(row);
  }
  
  logAction('SAVE', profile.id, profile.meta?.orgName);
  
  return createResponse(true, 'Profile saved successfully', { id: profile.id });
}

// Alle profielen ophalen
function getAllProfiles() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return createResponse(true, 'No profiles yet', { profiles: [] });
  }
  
  const data = sheet.getDataRange().getValues();
  const profiles = [];
  
  // Skip header row
  for (let i = 1; i < data.length; i++) {
    if (data[i][5]) { // JSON Data kolom
      try {
        profiles.push(JSON.parse(data[i][5]));
      } catch (e) {
        // Skip invalid JSON
      }
    }
  }
  
  logAction('GET_ALL', null, `${profiles.length} profiles`);
  
  return createResponse(true, 'Profiles retrieved', { profiles: profiles });
}

// Enkel profiel ophalen
function getProfile(id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return createResponse(false, 'Profile not found');
  }
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      try {
        const profile = JSON.parse(data[i][5]);
        return createResponse(true, 'Profile retrieved', { profile: profile });
      } catch (e) {
        return createResponse(false, 'Invalid profile data');
      }
    }
  }
  
  return createResponse(false, 'Profile not found');
}

// Profiel verwijderen
function deleteProfile(id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return createResponse(false, 'Sheet not found');
  }
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      logAction('DELETE', id, data[i][1]);
      return createResponse(true, 'Profile deleted');
    }
  }
  
  return createResponse(false, 'Profile not found');
}

// Update profiel (alias voor save)
function updateProfile(profile) {
  return saveProfile(profile);
}

// Log acties in Metadata sheet
function logAction(action, profileId, details) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(METADATA_SHEET);
  
  if (!sheet) {
    sheet = ss.insertSheet(METADATA_SHEET);
    sheet.appendRow(['Timestamp', 'Action', 'Profile ID', 'Details']);
  }
  
  sheet.appendRow([
    new Date().toISOString(),
    action,
    profileId || 'N/A',
    details || ''
  ]);
}

// Response helper
function createResponse(success, message, data = {}) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Stap 3: Apps Script Deployen

**BELANGRIJK - DEPLOYMENT INSTELLINGEN:**

1. Klik op **Deploy > New deployment**
2. Kies **Web app** als type
3. Configuratie:
   - **Description**: "AHHA Profiling Tool API v1"
   - **Execute as**: **Me** (jouw account)
   - **Who has access**: **Anyone** ⚠️ DIT IS CRUCIAAL!
4. Klik **Deploy**
5. Kopieer de **Web app URL** die je krijgt (eindigt op `.../exec`)
6. Deze URL gebruik je in de frontend configuratie

⚠️ **LET OP:** Als je "Who has access" niet op "Anyone" zet, krijg je CORS errors!

## Stap 4: Permissions Goedkeuren

Bij de eerste deployment moet je permissions goedkeuren:
1. Klik op **Authorize access**
2. Kies je Google account
3. Klik **Advanced** > **Go to [Project name] (unsafe)**
4. Klik **Allow**

## Stap 5: Frontend Configureren

Gebruik de Web app URL in de frontend (zie volgende stappen).

## Test je API

Test met deze cURL command (vervang URL):

```bash
curl -L -X GET 'YOUR_WEB_APP_URL?action=getAll'
```

Je zou een JSON response moeten krijgen met succes status.

## Beveiliging (Optioneel)

Voor extra beveiliging kun je een API key systeem toevoegen:

```javascript
const API_KEY = 'jouw-geheime-key-hier';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.apiKey !== API_KEY) {
    return createResponse(false, 'Unauthorized');
  }
  // ... rest van de code
}
```