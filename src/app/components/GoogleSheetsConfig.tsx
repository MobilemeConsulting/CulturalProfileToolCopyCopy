import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Check, ExternalLink, Settings, Loader2, Upload, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { isGoogleSheetsConfigured, getAllProfilesFromSheets, saveBulkProfilesToSheets } from '../services/googleSheets';
import { OrganisationProfile } from '../data/types';

interface GoogleSheetsConfigProps {
  onConfigured?: () => void;
  profiles?: OrganisationProfile[];
}

export function GoogleSheetsConfig({ onConfigured, profiles }: GoogleSheetsConfigProps) {
  const [url, setUrl] = useState(localStorage.getItem('googleSheetsUrl') || '');
  const [apiKey, setApiKey] = useState(localStorage.getItem('googleSheetsApiKey') || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);
  const [isConfigured, setIsConfigured] = useState(isGoogleSheetsConfigured());

  const handleSave = () => {
    localStorage.setItem('googleSheetsUrl', url);
    localStorage.setItem('googleSheetsApiKey', apiKey);
    setIsConfigured(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    
    if (onConfigured) {
      onConfigured();
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    // Valideer URL format
    if (!url.includes('/exec')) {
      setTestResult({
        success: false,
        message: '❌ De URL moet eindigen op /exec. Gebruik de "Active" deployment URL, NIET de test/dev URL.'
      });
      setTesting(false);
      return;
    }

    // Bewaar originele waarden VOOR we ze wijzigen
    const oldUrl = localStorage.getItem('googleSheetsUrl');
    const oldKey = localStorage.getItem('googleSheetsApiKey');

    try {
      // Tijdelijk nieuwe waarden instellen voor test
      localStorage.setItem('googleSheetsUrl', url);
      localStorage.setItem('googleSheetsApiKey', apiKey);

      const profiles = await getAllProfilesFromSheets();
      
      setTestResult({
        success: true,
        message: `Verbinding succesvol! ${profiles.length} profielen gevonden.`
      });

    } catch (error) {
      setTestResult({
        success: false,
        message: `Verbinding mislukt: ${error instanceof Error ? error.message : 'Onbekende fout'}`
      });
    } finally {
      // Herstel ALTIJD oude waarden na test (gebruiker moet expliciet opslaan)
      if (oldUrl) {
        localStorage.setItem('googleSheetsUrl', oldUrl);
      } else {
        localStorage.removeItem('googleSheetsUrl');
      }
      
      if (oldKey) {
        localStorage.setItem('googleSheetsApiKey', oldKey);
      } else {
        localStorage.removeItem('googleSheetsApiKey');
      }
      
      setTesting(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('googleSheetsUrl');
    localStorage.removeItem('googleSheetsApiKey');
    setUrl('');
    setApiKey('');
    setTestResult(null);
    setIsConfigured(false);
  };

  const handleUpload = async () => {
    if (!profiles || profiles.length === 0) {
      setUploadResult({ success: 0, failed: 0 });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const result = await saveBulkProfilesToSheets(profiles);
      setUploadResult(result);
    } catch (error) {
      setUploadResult({ success: 0, failed: profiles.length });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Google Sheets Configuratie
        </CardTitle>
        <CardDescription>
          Koppel de applicatie aan Google Sheets voor automatische data opslag
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Geconfigureerd</AlertTitle>
            <AlertDescription className="text-green-700">
              Google Sheets is succesvol gekoppeld. Data wordt automatisch gesynchroniseerd.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheets-url">
              Google Apps Script Web App URL *
            </Label>
            <Input
              id="sheets-url"
              type="url"
              placeholder="https://script.google.com/macros/s/...../exec"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Zie GOOGLE_SHEETS_SETUP.md voor instructies
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">
              API Key (optioneel)
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Optionele API key voor extra beveiliging"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleTest}
              disabled={!url || testing}
              variant="outline"
              className="flex-1"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testen...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Test Verbinding
                </>
              )}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!url}
              className="flex-1"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Opgeslagen
                </>
              ) : (
                'Opslaan'
              )}
            </Button>
            
            {url && (
              <Button
                onClick={handleClear}
                variant="destructive"
              >
                Wissen
              </Button>
            )}
          </div>

          {testResult && (
            <Alert className={testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
              {testResult.success ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertTitle className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                {testResult.success ? 'Succes' : 'Fout'}
              </AlertTitle>
              <AlertDescription className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Direct browser test button */}
          {url && (
            <div className="mt-2">
              <Button
                onClick={() => window.open(url, '_blank')}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Open URL in nieuwe tab (voor directe test)
              </Button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Hoe werkt het?</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Volg de instructies in GOOGLE_SHEETS_SETUP.md</li>
            <li>Deploy de Google Apps Script als Web App</li>
            <li>Kopieer de Web App URL en plak hier</li>
            <li>Test de verbinding</li>
            <li>Sla op - data wordt nu automatisch gesynchroniseerd</li>
          </ol>
          
          {testResult && !testResult.success && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-amber-900 mb-2">⚠️ Troubleshooting "Failed to fetch"</h5>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-amber-900 mb-1">1️⃣ Controleer je deployment:</p>
                  <ul className="text-xs text-amber-800 space-y-1 ml-4 list-disc">
                    <li>Open je Google Apps Script</li>
                    <li>Klik rechtsboven op <strong>"Deploy"</strong> → <strong>"Manage deployments"</strong></li>
                    <li>Check of er een deployment staat met status <strong>"Active"</strong></li>
                    <li>Klik op het tandwiel icoon (Edit) bij je deployment</li>
                  </ul>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-amber-900 mb-1">2️⃣ Controleer de permissions:</p>
                  <ul className="text-xs text-amber-800 space-y-1 ml-4 list-disc">
                    <li><strong>Execute as:</strong> Moet staan op "Me" (jouw account)</li>
                    <li><strong>Who has access:</strong> Moet staan op <strong>"Anyone"</strong> (niet "Anyone with Google account"!)</li>
                    <li>Klik op <strong>"Deploy"</strong> om de wijzigingen op te slaan</li>
                  </ul>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-amber-900 mb-1">3️⃣ Test direct in browser:</p>
                  <ul className="text-xs text-amber-800 space-y-1 ml-4 list-disc">
                    <li>Klik op de knop hierboven: "Open URL in nieuwe tab"</li>
                    <li><strong>Verwacht resultaat:</strong> JSON met <code className="bg-amber-100 px-1">{`{"success":false,"message":"Invalid action"}`}</code></li>
                    <li><strong>Als je een login scherm ziet:</strong> Permissions staan NIET op "Anyone"</li>
                    <li><strong>Als je een 404 krijgt:</strong> URL is incorrect of deployment is niet actief</li>
                  </ul>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-amber-900 mb-1">4️⃣ Maak een nieuwe deployment:</p>
                  <ul className="text-xs text-amber-800 space-y-1 ml-4 list-disc">
                    <li>Soms helpt het om een compleet nieuwe deployment te maken</li>
                    <li>Klik op <strong>"Deploy"</strong> → <strong>"New deployment"</strong></li>
                    <li>Type: <strong>"Web app"</strong></li>
                    <li>Who has access: <strong>"Anyone"</strong></li>
                    <li>Kopieer de nieuwe URL (eindigt op /exec)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {profiles && profiles.length > 0 && isConfigured && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-medium">Bestaande profielen uploaden</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Upload {profiles.length} lokale profiel{profiles.length !== 1 ? 'en' : ''} naar Google Sheets
                </p>
              </div>
              <Button
                onClick={handleUpload}
                disabled={uploading}
                variant="outline"
                size="sm"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploaden...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Upload Alle Profielen
                  </>
                )}
              </Button>
            </div>

            {uploadResult && (
              <Alert className={uploadResult.success > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                {uploadResult.success > 0 ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={uploadResult.success > 0 ? 'text-green-800' : 'text-red-800'}>
                  {uploadResult.success > 0 ? 'Upload Succesvol' : 'Upload Mislukt'}
                </AlertTitle>
                <AlertDescription className={uploadResult.success > 0 ? 'text-green-700' : 'text-red-700'}>
                  {uploadResult.success > 0 && `✅ ${uploadResult.success} profiel${uploadResult.success !== 1 ? 'en' : ''} succesvol geüpload`}
                  {uploadResult.failed > 0 && ` | ❌ ${uploadResult.failed} mislukt`}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}