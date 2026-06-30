import { useState } from 'react';
import {
  Building2,
  TrendingUp,
  Pencil,
  Trash2,
  Plus,
  ArrowLeft,
  Save,
  Share2,
  Check,
} from 'lucide-react';
import { OrganisationProfile } from '../data/types';
import { saveProfile, deleteProfile } from '../services/supabaseService';
import { ProfileCreationWizard } from '../components/ProfileCreationWizard';

const STORAGE_KEY = 'cultural-profiles';

function persistLocal(profiles: OrganisationProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

function splitList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

type Mode =
  | { kind: 'list' }
  | { kind: 'create' }
  | { kind: 'edit'; profile: OrganisationProfile };

interface ProfilesSectionProps {
  profiles: OrganisationProfile[];
  onChanged: () => Promise<void> | void;
}

export function ProfilesSection({ profiles, onChanged }: ProfilesSectionProps) {
  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const [typeFilter, setTypeFilter] = useState<'all' | 'cultural' | 'profit'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = async (profileId: string) => {
    const url = `${window.location.origin}/profiel/${profileId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(profileId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      window.prompt('Kopieer deze link:', url);
    }
  };

  // Opslaan: naar Supabase én localStorage, daarna lijst verversen.
  const handleSave = async (profile: OrganisationProfile) => {
    await saveProfile(profile);
    const others = profiles.filter((p) => p.id !== profile.id);
    persistLocal([...others, profile]);
    await onChanged();
    setMode({ kind: 'list' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Dit profiel definitief verwijderen uit de database?')) return;
    await deleteProfile(id);
    persistLocal(profiles.filter((p) => p.id !== id));
    await onChanged();
  };

  if (mode.kind === 'create') {
    return (
      <div>
        <button
          onClick={() => setMode({ kind: 'list' })}
          className="mb-4 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Terug naar lijst
        </button>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <ProfileCreationWizard onProfileCreated={handleSave} onImport={handleSave} />
        </div>
      </div>
    );
  }

  if (mode.kind === 'edit') {
    return (
      <ProfileEditor
        profile={mode.profile}
        onCancel={() => setMode({ kind: 'list' })}
        onSave={handleSave}
      />
    );
  }

  const filtered = profiles.filter(
    (p) => typeFilter === 'all' || p.organisationType === typeFilter
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1">
          {(['all', 'cultural', 'profit'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                typeFilter === t
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t === 'all' ? 'Alle' : t === 'cultural' ? 'Cultureel' : 'Profit'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setMode({ kind: 'create' })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm"
        >
          <Plus className="w-4 h-4" /> Nieuw profiel
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
          Geen profielen in deze categorie.
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              {p.organisationType === 'cultural' ? (
                <Building2 className="w-5 h-5 text-purple-600 shrink-0" />
              ) : (
                <TrendingUp className="w-5 h-5 text-blue-600 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate">
                  {p.meta.orgName || 'Naamloos profiel'}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {p.meta.orgType || 'Geen type'} · {p.organisationType} ·{' '}
                  {p.dimensions.length} dimensies
                </div>
              </div>
              <button
                onClick={() => handleCopyLink(p.id)}
                title="Deelbare link kopiëren"
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {copiedId === p.id ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setMode({ kind: 'edit', profile: p })}
                title="Bewerken"
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                title="Verwijderen"
                className="p-2 rounded-lg text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Generieke editor (werkt voor cultureel én profit) ----------------------
function ProfileEditor({
  profile,
  onCancel,
  onSave,
}: {
  profile: OrganisationProfile;
  onCancel: () => void;
  onSave: (p: OrganisationProfile) => void;
}) {
  const [orgName, setOrgName] = useState(profile.meta.orgName);
  const [orgType, setOrgType] = useState(profile.meta.orgType);
  const [year, setYear] = useState(String(profile.meta.year ?? new Date().getFullYear()));
  const [industry, setIndustry] = useState(profile.meta.industry ?? '');
  const [crossoverFocus, setCrossoverFocus] = useState(profile.meta.crossoverFocus ?? '');
  const [toneOfVoice, setToneOfVoice] = useState(
    (profile.identitySummary?.toneOfVoice ?? []).join(', ')
  );
  const [visualKeywords, setVisualKeywords] = useState(
    (profile.identitySummary?.visualKeywords ?? []).join(', ')
  );
  // Diepe kopie zodat we de scores los kunnen bewerken.
  const [dimensions, setDimensions] = useState(
    () => JSON.parse(JSON.stringify(profile.dimensions)) as OrganisationProfile['dimensions']
  );

  const setScore = (di: number, ai: number, value: number) => {
    setDimensions((prev) =>
      prev.map((d, i) =>
        i !== di
          ? d
          : { ...d, axes: d.axes.map((a, j) => (j !== ai ? a : { ...a, score: value })) }
      )
    );
  };

  const save = () => {
    const updated: OrganisationProfile = {
      ...profile,
      meta: {
        ...profile.meta,
        orgName,
        orgType,
        year: Number(year) || profile.meta.year,
        industry: industry.trim() || undefined,
        crossoverFocus: (crossoverFocus || undefined) as OrganisationProfile['meta']['crossoverFocus'],
      },
      dimensions,
      identitySummary: {
        toneOfVoice: splitList(toneOfVoice),
        visualKeywords: splitList(visualKeywords),
      },
      updatedAt: new Date().toISOString(),
    };
    onSave(updated);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Annuleren
      </button>

      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h3 className="font-semibold text-slate-900">Organisatie</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Naam">
            <input className={inputCls} value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </Field>
          <Field label="Type">
            <input className={inputCls} value={orgType} onChange={(e) => setOrgType(e.target.value)} />
          </Field>
          <Field label="Jaar">
            <input
              className={inputCls}
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Field>
          <Field label="Industrie (optioneel)">
            <input className={inputCls} value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </Field>
          <Field label="Crossover focus">
            <input
              className={inputCls}
              value={crossoverFocus}
              onChange={(e) => setCrossoverFocus(e.target.value)}
              placeholder="bv. innovatie, gemeenschap, hr"
            />
          </Field>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
        <h3 className="font-semibold text-slate-900">Dimensies & scores (0-100)</h3>
        {dimensions.map((dim, di) => (
          <div key={dim.id} className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">{dim.label}</h4>
            {dim.axes.map((axis, ai) => (
              <div key={axis.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-64 shrink-0 truncate" title={axis.label}>
                  {axis.label}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={axis.score}
                  onChange={(e) => setScore(di, ai, parseInt(e.target.value, 10))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={axis.score}
                  onChange={(e) => setScore(di, ai, Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="w-16 text-sm border border-slate-300 rounded px-2 py-1"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <h3 className="font-semibold text-slate-900">Identiteit (komma-gescheiden)</h3>
        <Field label="Tone of voice">
          <input className={inputCls} value={toneOfVoice} onChange={(e) => setToneOfVoice(e.target.value)} />
        </Field>
        <Field label="Visuele keywords">
          <input
            className={inputCls}
            value={visualKeywords}
            onChange={(e) => setVisualKeywords(e.target.value)}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:text-slate-900">
          Annuleren
        </button>
        <button
          onClick={save}
          className="inline-flex items-center gap-2 px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900"
        >
          <Save className="w-4 h-4" /> Opslaan
        </button>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}
