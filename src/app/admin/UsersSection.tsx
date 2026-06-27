import { useEffect, useState } from 'react';
import { UserPlus, Loader2, Check, Mail, Shield, User as UserIcon, RefreshCw } from 'lucide-react';
import { listUsers, inviteUser, setUserRole, AdminUser } from '../services/authService';

export function UsersSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [inviting, setInviting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setUsers(await listUsers());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const [inviteLink, setInviteLink] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setFeedback(null);
    setInviteLink('');
    const { error, inviteLink: link } = await inviteUser(email, role);
    setInviting(false);
    if (error) {
      setFeedback({ ok: false, msg: error });
      return;
    }
    if (link) {
      setInviteLink(link);
      setFeedback({ ok: true, msg: `Gebruiker aangemaakt! Kopieer de invite-link hieronder en stuur die naar ${email}.` });
    } else {
      setFeedback({ ok: true, msg: `Uitnodiging verstuurd naar ${email}.` });
    }
    setEmail('');
    await load();
  };

  const handleRoleChange = async (user: AdminUser, newRole: 'admin' | 'user') => {
    const { error } = await setUserRole(user.id, newRole);
    if (error) {
      setFeedback({ ok: false, msg: error });
      return;
    }
    await load();
  };

  return (
    <div className="space-y-6">
      {/* Uitnodigen */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> Nieuwe gebruiker uitnodigen
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          De uitnodiging wordt per e-mail verstuurd (via Brevo-SMTP). De gebruiker kiest zelf een
          wachtwoord via de link.
        </p>
        <form onSubmit={handleInvite} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mailadres</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="nieuw@email.be"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={inviting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all disabled:opacity-60"
          >
            {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Uitnodigen
          </button>
        </form>

        {feedback && (
          <div
            className={`mt-3 text-sm rounded-md px-3 py-2 ${
              feedback.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {feedback.ok ? '✓ ' : '✗ '}
            {feedback.msg}
          </div>
        )}

        {inviteLink && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md px-3 py-3 space-y-2">
            <p className="text-sm font-medium text-blue-900">Invite-link (kopieer en stuur naar de gebruiker):</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 text-xs bg-white border border-blue-300 rounded px-2 py-1.5 text-blue-800 font-mono"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={() => { navigator.clipboard.writeText(inviteLink); }}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Kopiëren
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gebruikerslijst */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Gebruikers ({users.length})</h2>
          <button
            onClick={load}
            className="text-sm text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" /> Vernieuwen
          </button>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : users.length === 0 ? (
          <p className="text-sm text-slate-500">
            Geen gebruikers gevonden (of geen rechten/RPC nog niet uitgevoerd).
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate flex items-center gap-2">
                    {u.role === 'admin' ? (
                      <Shield className="w-4 h-4 text-slate-700" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-slate-400" />
                    )}
                    {u.email}
                  </div>
                  <div className="text-xs text-slate-400">
                    {u.last_sign_in_at
                      ? `Laatste login: ${new Date(u.last_sign_in_at).toLocaleString('nl-BE')}`
                      : 'Nog niet ingelogd'}
                  </div>
                </div>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u, e.target.value as 'admin' | 'user')}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
