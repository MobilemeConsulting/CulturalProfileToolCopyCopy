import { useEffect, useState } from 'react';
import { UserPlus, Loader2, Check, Mail, Shield, User as UserIcon, RefreshCw, Trash2, Send, KeyRound } from 'lucide-react';
import { listUsers, inviteUser, setUserRole, deleteUser, resendInvite, resetUserPassword, AdminUser, Role } from '../services/authService';

const ROLE_OPTIONS: Role[] = ['admin', 'bestuurder', 'lid', 'user'];

export function UsersSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('user');
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

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [resetPwUser, setResetPwUser] = useState<string | null>(null);
  const [newPw, setNewPw] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleRoleChange = async (user: AdminUser, newRole: Role) => {
    const { error } = await setUserRole(user.id, newRole);
    if (error) {
      setFeedback({ ok: false, msg: error });
      return;
    }
    await load();
  };

  const handleDelete = async (user: AdminUser) => {
    setActionLoading(user.id);
    setFeedback(null);
    const { error } = await deleteUser(user.id);
    setActionLoading(null);
    setConfirmDelete(null);
    if (error) {
      setFeedback({ ok: false, msg: error });
      return;
    }
    setFeedback({ ok: true, msg: `${user.email} is verwijderd.` });
    await load();
  };

  const handleResend = async (user: AdminUser) => {
    setActionLoading(user.id);
    setFeedback(null);
    setInviteLink('');
    const { error, inviteLink: link } = await resendInvite(user.email, user.role);
    setActionLoading(null);
    if (error) {
      setFeedback({ ok: false, msg: error });
      return;
    }
    if (link) {
      setInviteLink(link);
      setFeedback({ ok: true, msg: `Nieuwe invite-link gegenereerd voor ${user.email}. Kopieer hieronder.` });
    }
  };

  const handleResetPassword = async (user: AdminUser) => {
    if (newPw.length < 8) {
      setFeedback({ ok: false, msg: 'Wachtwoord moet minstens 8 tekens zijn.' });
      return;
    }
    setActionLoading(user.id);
    setFeedback(null);
    const { error } = await resetUserPassword(user.id, newPw);
    setActionLoading(null);
    setResetPwUser(null);
    setNewPw('');
    if (error) {
      setFeedback({ ok: false, msg: error });
      return;
    }
    setFeedback({ ok: true, msg: `Wachtwoord ingesteld voor ${user.email}. Deel het veilig met de gebruiker.` });
  };

  return (
    <div className="space-y-6">
      {/* Uitnodigen */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> Nieuwe gebruiker uitnodigen
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Er wordt een invite-link gegenereerd die je kopieert en deelt. De gebruiker kiest zelf een
          wachtwoord via de link. De link is 24 uur geldig.
        </p>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-3">
          <div className="flex-1 min-w-0">
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
              onChange={(e) => setRole(e.target.value as Role)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
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
              <div key={u.id} className="py-3 space-y-2">
                <div className="flex items-center justify-between gap-4">
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
                  <div className="flex items-center gap-2">
                    {/* Opnieuw uitnodigen (alleen als nog niet ingelogd) */}
                    {!u.last_sign_in_at && (
                      <button
                        onClick={() => handleResend(u)}
                        disabled={actionLoading === u.id}
                        title="Nieuwe invite-link genereren"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        {actionLoading === u.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    {/* Rol wijzigen */}
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value as Role)}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    {/* Wachtwoord resetten */}
                    <button
                      onClick={() => { setResetPwUser(u.id); setNewPw(''); }}
                      disabled={actionLoading === u.id}
                      title="Wachtwoord instellen"
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    {/* Verwijderen */}
                    <button
                      onClick={() => setConfirmDelete(u.id)}
                      disabled={actionLoading === u.id}
                      title="Gebruiker verwijderen"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Wachtwoord resetten */}
                {resetPwUser === u.id && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                    <p className="text-sm text-amber-800 shrink-0">Nieuw wachtwoord voor {u.email}:</p>
                    <input
                      type="text"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      placeholder="Min. 8 tekens"
                      className="flex-1 px-2 py-1 text-sm border border-amber-300 rounded"
                    />
                    <button
                      onClick={() => handleResetPassword(u)}
                      disabled={actionLoading === u.id}
                      className="px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      {actionLoading === u.id && <Loader2 className="w-3 h-3 animate-spin" />}
                      Instellen
                    </button>
                    <button
                      onClick={() => setResetPwUser(null)}
                      className="px-3 py-1 bg-white text-slate-600 text-xs rounded border border-slate-300 hover:bg-slate-50"
                    >
                      Annuleren
                    </button>
                  </div>
                )}
                {/* Bevestigingsdialoog voor verwijderen */}
                {confirmDelete === u.id && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    <p className="text-sm text-red-800 flex-1">
                      {u.email} definitief verwijderen?
                    </p>
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={actionLoading === u.id}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      {actionLoading === u.id && <Loader2 className="w-3 h-3 animate-spin" />}
                      Ja, verwijder
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-1 bg-white text-slate-600 text-xs rounded border border-slate-300 hover:bg-slate-50"
                    >
                      Annuleren
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
