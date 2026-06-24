import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, Check, Loader2, Database, Server } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  isConfigured as isSupabaseConfigured,
  getAllProfiles,
  saveBulkProfiles,
} from '../services/supabaseService';
import { OrganisationProfile } from '../data/types';

interface SupabaseConfigProps {
  onConfigured?: () => void;
  profiles?: OrganisationProfile[];
}

// Supabase wordt geconfigureerd via environment variables (.env), niet via de UI.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

export function SupabaseConfig({ profiles }: SupabaseConfigProps) {
  const configured = isSupabaseConfigured();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    if (!configured) {
      setTestResult({
        success: false,
        message:
          '❌ Supabase is niet geconfigureerd. Stel VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY in je .env bestand in en herstart de dev-server.',
      });
      setTesting(false);
      return;
    }

    try {
      const result = await getAllProfiles();
      setTestResult({
        success: true,
        message: `Verbinding succesvol! ${result.length} profiel${
          result.length !== 1 ? 'en' : ''
        } gevonden in Supabase.`,
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `Verbinding mislukt: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleUpload = async () => {
    if (!profiles || profiles.length === 0) {
      setUploadResult({ success: 0, failed: 0 });
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const result = await saveBulkProfiles(profiles);
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
          <Database className="w-5 h-5" />
          Supabase Configuratie
        </CardTitle>
        <CardDescription>
          De applicatie slaat profielen op in Supabase. Lukt dat niet, dan blijft localStorage de
          fallback.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {configured ? (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Geconfigureerd</AlertTitle>
            <AlertDescription className="text-green-700">
              Supabase is gekoppeld. Nieuwe en gewijzigde profielen worden automatisch
              gesynchroniseerd.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Niet geconfigureerd</AlertTitle>
            <AlertDescription className="text-amber-700">
              Stel <code className="bg-amber-100 px-1">VITE_SUPABASE_URL</code> en{' '}
              <code className="bg-amber-100 px-1">VITE_SUPABASE_ANON_KEY</code> in je{' '}
              <code className="bg-amber-100 px-1">.env</code> bestand in en herstart de dev-server.
              Zonder Supabase werkt de app verder met localStorage.
            </AlertDescription>
          </Alert>
        )}

        {configured && SUPABASE_URL && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Server className="w-4 h-4" />
              Project URL
            </div>
            <div className="font-mono text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded px-3 py-2 break-all">
              {SUPABASE_URL}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleTest} disabled={testing} variant="outline" className="flex-1">
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testen...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Test Verbinding
              </>
            )}
          </Button>
        </div>

        {testResult && (
          <Alert
            className={testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
          >
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

        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Hoe werkt het?</h4>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Voer de SQL-migraties uit in je Supabase-project (supabase/migrations).</li>
            <li>Zet VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY in je .env bestand.</li>
            <li>Herstart de dev-server zodat de variabelen geladen worden.</li>
            <li>Test de verbinding met de knop hierboven.</li>
            <li>Upload bestaande profielen of maak een nieuw profiel aan - data wordt gesynchroniseerd.</li>
          </ol>
        </div>

        {profiles && profiles.length > 0 && configured && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-medium">Bestaande profielen uploaden</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Upload {profiles.length} lokaal profiel{profiles.length !== 1 ? 'en' : ''} naar
                  Supabase
                </p>
              </div>
              <Button onClick={handleUpload} disabled={uploading} variant="outline" size="sm">
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
              <Alert
                className={
                  uploadResult.success > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }
              >
                {uploadResult.success > 0 ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle className={uploadResult.success > 0 ? 'text-green-800' : 'text-red-800'}>
                  {uploadResult.success > 0 ? 'Upload Succesvol' : 'Upload Mislukt'}
                </AlertTitle>
                <AlertDescription
                  className={uploadResult.success > 0 ? 'text-green-700' : 'text-red-700'}
                >
                  {uploadResult.success > 0 &&
                    `✅ ${uploadResult.success} profiel${
                      uploadResult.success !== 1 ? 'en' : ''
                    } succesvol geüpload`}
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
