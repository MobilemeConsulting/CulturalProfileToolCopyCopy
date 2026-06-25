import { useEffect, useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, LogOut, ShieldAlert } from 'lucide-react';
import { signIn, signOut, getCurrentUser, isAdmin, onAuthChange } from '../services/authService';
import { AdminDashboard } from './AdminDashboard';

// --- Echte login via Supabase Auth ------------------------------------------
function AdminLogin({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await signIn(email, password);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSignedIn();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-200 p-12 rounded-lg shadow-lg">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 border border-slate-800 rounded-full mb-6">
              <Lock className="w-8 h-8 text-slate-800" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Admin Toegang</h2>
            <div className="w-16 h-0.5 bg-slate-800 mx-auto mb-4"></div>
            <p className="text-gray-600 font-light">
              Log in met je beheerdersaccount. Uitsluitend voor geautoriseerde beheerders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-900 mb-2">
                E-mailadres
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-slate-800 transition-all"
                placeholder="beheerder@email.be"
                autoFocus
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-900 mb-2">
                Wachtwoord
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:border-slate-800 transition-all"
                  placeholder="Voer wachtwoord in"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">✗ {error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-slate-800 text-white py-3 rounded-md hover:bg-slate-900 transition-all font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Inloggen
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-slate-800 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Terug naar de app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Getoond wanneer ingelogd maar geen admin-rol ---------------------------
function NotAdmin({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <div className="max-w-md w-full bg-white border border-gray-200 p-12 rounded-lg shadow-lg text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 border border-amber-500 rounded-full mb-6">
          <ShieldAlert className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Geen beheerdersrechten</h2>
        <p className="text-gray-600 mb-6">
          Je bent ingelogd als <strong>{email}</strong>, maar dit account heeft geen admin-rol.
          Vraag een beheerder om je te activeren.
        </p>
        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 transition-all"
        >
          <LogOut className="w-4 h-4" /> Uitloggen
        </button>
      </div>
    </div>
  );
}

type AuthState = 'loading' | 'signed-out' | 'not-admin' | 'admin';

export function AdminPage() {
  const [state, setState] = useState<AuthState>('loading');
  const [email, setEmail] = useState<string | null>(null);

  const check = async () => {
    const user = await getCurrentUser();
    if (!user) {
      setEmail(null);
      setState('signed-out');
      return;
    }
    setEmail(user.email ?? null);
    const admin = await isAdmin();
    setState(admin ? 'admin' : 'not-admin');
  };

  useEffect(() => {
    check();
    const sub = onAuthChange(() => check());
    return () => {
      sub?.unsubscribe?.();
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    await check();
  };

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    );
  }
  if (state === 'signed-out') return <AdminLogin onSignedIn={check} />;
  if (state === 'not-admin') return <NotAdmin email={email} onSignOut={handleSignOut} />;
  return <AdminDashboard onSignOut={handleSignOut} />;
}
