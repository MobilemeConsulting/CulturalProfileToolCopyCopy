import { useEffect, useState } from 'react';
import { Loader2, Check, Lock } from 'lucide-react';
import { getCurrentUser, setPassword } from '../services/authService';

// Pagina voor het accepteren van een uitnodiging: de invite-link logt de
// gebruiker in (Supabase verwerkt de tokens in de URL automatisch); hier kiest
// de gebruiker een wachtwoord.
export function AdminAccept() {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Geef supabase-js even tijd om de sessie uit de URL-hash te lezen.
    const t = setTimeout(async () => {
      const user = await getCurrentUser();
      setHasSession(!!user);
      setChecking(false);
    }, 600);
    return () => clearTimeout(t);
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
          <p className="text-sm text-red-600 text-center">
            Geen geldige uitnodiging gevonden. Open deze pagina via de link uit je uitnodigingsmail.
          </p>
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
