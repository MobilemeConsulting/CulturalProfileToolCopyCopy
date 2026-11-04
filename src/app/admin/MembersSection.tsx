import { useEffect, useState } from 'react';
import {
  UserPlus,
  Loader2,
  RefreshCw,
  Trash2,
  Pencil,
  X,
  Mail,
  Phone,
  Building2,
  Users as UsersIcon,
} from 'lucide-react';
import {
  getMembers,
  saveMember,
  deleteMember,
  Member,
  MemberInput,
  MemberType,
} from '../services/membersService';

const EMPTY: MemberInput = {
  naam: '',
  type: 'lid',
  functie: '',
  email: '',
  telefoon: '',
  organisatie: '',
  notities: '',
};

const TYPE_LABEL: Record<MemberType, string> = {
  lid: 'Lid',
  bestuurder: 'Bestuurder',
};

export function MembersSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<MemberInput>(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | MemberType>('all');

  const load = async () => {
    setLoading(true);
    setMembers(await getMembers());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(EMPTY);
    setEditId(null);
  };

  const startEdit = (m: Member) => {
    setEditId(m.id);
    setForm({
      naam: m.naam,
      type: m.type,
      functie: m.functie ?? '',
      email: m.email ?? '',
      telefoon: m.telefoon ?? '',
      organisatie: m.organisatie ?? '',
      notities: m.notities ?? '',
    });
    setFeedback(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.naam.trim()) {
      setFeedback({ ok: false, msg: 'Naam is verplicht.' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    // Lege strings als null bewaren (nettere data).
    const payload: MemberInput = {
      naam: form.naam.trim(),
      type: form.type,
      functie: form.functie?.trim() || null,
      email: form.email?.trim() || null,
      telefoon: form.telefoon?.trim() || null,
      organisatie: form.organisatie?.trim() || null,
      notities: form.notities?.trim() || null,
    };
    const { error } = await saveMember(payload, editId ?? undefined);
    setSaving(false);
    if (error) {
      setFeedback({ ok: false, msg: error });
      return;
    }
    setFeedback({ ok: true, msg: editId ? 'Wijzigingen opgeslagen.' : `${payload.naam} toegevoegd.` });
    resetForm();
    await load();
  };

  const handleDelete = async (m: Member) => {
    setActionLoading(m.id);
    setFeedback(null);
    const { error } = await deleteMember(m.id);
    setActionLoading(null);
    setConfirmDelete(null);
    if (error) {
      setFeedback({ ok: false, msg: error });
      return;
    }
    setFeedback({ ok: true, msg: `${m.naam} is verwijderd.` });
    if (editId === m.id) resetForm();
    await load();
  };

  const shown = members.filter((m) => filter === 'all' || m.type === filter);
  const counts = {
    lid: members.filter((m) => m.type === 'lid').length,
    bestuurder: members.filter((m) => m.type === 'bestuurder').length,
  };

  return (
    <div className="space-y-6">
      {/* Toevoegen / bewerken */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
          <UserPlus className="w-5 h-5" /> {editId ? 'Lid bewerken' : 'Lid of bestuurder toevoegen'}
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Dit is een register van contacten. Deze personen loggen niet zelf in — dat verloopt via de
          tab <strong>Gebruikers</strong> (alleen voor beheerders).
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Naam *</label>
            <input
              type="text"
              value={form.naam}
              onChange={(e) => setForm({ ...form, naam: e.target.value })}
              required
              placeholder="Voor- en achternaam"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as MemberType })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="lid">Lid</option>
              <option value="bestuurder">Bestuurder</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Functie / rol</label>
            <input
              type="text"
              value={form.functie ?? ''}
              onChange={(e) => setForm({ ...form, functie: e.target.value })}
              placeholder="bv. Voorzitter, Penningmeester"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organisatie</label>
            <input
              type="text"
              value={form.organisatie ?? ''}
              onChange={(e) => setForm({ ...form, organisatie: e.target.value })}
              placeholder="Optioneel"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mailadres</label>
            <input
              type="email"
              value={form.email ?? ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="naam@email.be"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefoon</label>
            <input
              type="tel"
              value={form.telefoon ?? ''}
              onChange={(e) => setForm({ ...form, telefoon: e.target.value })}
              placeholder="+32 ..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Notities</label>
            <textarea
              value={form.notities ?? ''}
              onChange={(e) => setForm({ ...form, notities: e.target.value })}
              rows={2}
              placeholder="Optioneel"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 resize-y"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {editId ? 'Opslaan' : 'Toevoegen'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <X className="w-4 h-4" /> Annuleren
              </button>
            )}
          </div>
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
      </div>

      {/* Lijst */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Register ({members.length})
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
              {([
                ['all', `Alle (${members.length})`],
                ['bestuurder', `Bestuur (${counts.bestuurder})`],
                ['lid', `Leden (${counts.lid})`],
              ] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilter(val)}
                  className={`px-3 py-1.5 ${
                    filter === val ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={load}
              className="text-sm text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" /> Vernieuwen
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : shown.length === 0 ? (
          <p className="text-sm text-slate-500">Nog geen contacten in deze weergave.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {shown.map((m) => (
              <div key={m.id} className="py-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 flex items-center gap-2 flex-wrap">
                      <UsersIcon className="w-4 h-4 text-slate-400 shrink-0" />
                      {m.naam}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          m.type === 'bestuurder'
                            ? 'bg-slate-800 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {TYPE_LABEL[m.type]}
                      </span>
                      {m.functie && <span className="text-xs text-slate-500">· {m.functie}</span>}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      {m.organisatie && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {m.organisatie}
                        </span>
                      )}
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-slate-800">
                          <Mail className="w-3.5 h-3.5" /> {m.email}
                        </a>
                      )}
                      {m.telefoon && (
                        <a href={`tel:${m.telefoon}`} className="inline-flex items-center gap-1 hover:text-slate-800">
                          <Phone className="w-3.5 h-3.5" /> {m.telefoon}
                        </a>
                      )}
                    </div>
                    {m.notities && <p className="mt-1 text-xs text-slate-500 italic">{m.notities}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(m)}
                      title="Bewerken"
                      className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(m.id)}
                      disabled={actionLoading === m.id}
                      title="Verwijderen"
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {confirmDelete === m.id && (
                  <div className="mt-2 flex items-center gap-3 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    <p className="text-sm text-red-800 flex-1">{m.naam} definitief verwijderen?</p>
                    <button
                      onClick={() => handleDelete(m)}
                      disabled={actionLoading === m.id}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 inline-flex items-center gap-1"
                    >
                      {actionLoading === m.id && <Loader2 className="w-3 h-3 animate-spin" />}
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
