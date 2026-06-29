import { useEffect, useState } from 'react';
import { Loader2, Check, Lock } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { setPassword } from '../services/authService';

// Pagina voor het accepteren van een uitnodiging: de invite-link redirectt
// via Supabase Auth naar deze pagina met tokens in de URL-hash.
// Supabase verwerkt de tokens automatisch → sessie wordt aangemaakt.
export function AdminAccept() {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      setError('Supabase is niet geconfigureerd.');
      return;
    }

    // Check of er een fout in de URL zit (bv. verlopen token)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', ''));
    const urlError = params.get('error_description') || params.get('error');
    if (urlError) {
      setChecking(false);
      setError(urlError);
      setDebugInfo(`URL bevatte fout: ${urlError}`);
      return;
    }

    // Luister naar auth-wijzigingen — Supabase pikt tokens automatisch op uit de URL-hash.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AdminAccept] auth event:', event, session?.user?.email);
      if (session?.user) {
        setHasSession(true);
        setChecking(false);
      }
    });

    // Fallback: als na 3 seconden nog geen sessie, geef foutmelding.
    const fallback = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setHasSession(true);
      } else {
        setDebugInfo(`Geen sessie na timeout. URL hash: ${hash ? 'aanwezig' : 'leeg'}`);
      }
      setChecking(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallback);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Wachtwoord moet minstens 8 tekens zijn.');
      return;
    }
    if (password !== confirm) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }
    setBusy(true);
    const { error } = await setPassword(password);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setDone(true);
    setTimeout(() => {
      window.location.href = '/admin';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="max-w-md w-full bg-white border border-gray-200 p-12 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-slate-800 rounded-full mb-6">
            <Lock className="w-8 h-8 text-slate-800" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Account activeren</h2>
        </div>

        {checking ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : !hasSession ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-red-600">
              {error || 'Geen geldige uitnodiging gevonden. Open deze pagina via de link uit je uitnodigingsmail.'}
            </p>
            <p className="text-xs text-slate-400">
              Mogelijke oorzaken: de link is verlopen (24u geldig), al eerder gebruikt, of niet correct gekopieerd.
            </p>
            {debugInfo && (
              <p className="text-xs text-slate-300 font-mono break-all">{debugInfo}</p>
            )}
            <a href="/admin" className="inline-block mt-4 text-sm text-slate-600 hover:text-slate-900 underline">
              → Ga naar admin login
            </a>
          </div>
        ) : done ? (
          <p className="text-green-700 text-center flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> Wachtwoord ingesteld! Je wordt doorgestuurd...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Nieuw wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPwd(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-slate-800"
                placeholder="Minstens 8 tekens"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Bevestig wachtwoord</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-slate-800"
                placeholder="Herhaal wachtwoord"
              />
            </div>
            {error && <p className="text-red-600 text-sm">✗ {error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-slate-800 text-white py-3 rounded-md hover:bg-slate-900 transition-all font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Activeren
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
