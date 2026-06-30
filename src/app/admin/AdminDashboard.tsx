import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  LogOut,
  Trophy,
  LayoutDashboard,
  Grid3x3,
  BarChart3,
  Users as UsersIcon,
  AlertTriangle,
  ClipboardCheck,
  Building2,
  TrendingUp,
  Save,
  Loader2,
  Check,
  Menu,
  X,
} from 'lucide-react';
import { OrganisationProfile } from '../data/types';
import {
  getAllProfiles,
  saveMatchResult,
  getMatchResults,
  MatchResult,
} from '../services/supabaseService';
import { getAllDemoProfiles } from '../data/demoProfiles';
import { computeMatch, getMatchLabel } from '../utils/matching';
import {
  buildMatchMatrix,
  computeKpis,
  csroiBenchmark,
  perceptionGaps,
  dataQuality,
} from '../utils/adminStats';
import { UsersSection } from './UsersSection';
import { ProfilesSection } from './ProfilesSection';
import { InsightsSection } from './InsightsSection';
import { CompareSection } from './CompareSection';
import { FileDown, Mail, Database, Sparkles, ChevronDown, ChevronUp, StickyNote, FileSpreadsheet, ArrowLeftRight } from 'lucide-react';
import { exportMatchReportToPdf } from '../utils/pdfExport';
import { exportProfilesToExcel, exportMatchDataToExcel } from '../utils/excelExport';
import { sendMatchReport, buildMatchReportHtml } from '../services/reportService';
import {
  updateMatchStatus,
  updateMatchCRM,
  MATCH_STATUSES,
  MATCH_STATUS_LABELS,
  MatchStatus,
} from '../services/matchStatusService';

const STORAGE_KEY = 'cultural-profiles';

export function matchColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function matchBg(score: number): string {
  if (score >= 80) return 'bg-green-100 border-green-300';
  if (score >= 60) return 'bg-yellow-100 border-yellow-300';
  if (score >= 40) return 'bg-orange-100 border-orange-300';
  return 'bg-red-100 border-red-300';
}

type Tab =
  | 'overview'
  | 'profiles'
  | 'matrix'
  | 'ranking'
  | 'compare'
  | 'csroi'
  | 'gaps'
  | 'quality'
  | 'insights'
  | 'users';

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overzicht', icon: LayoutDashboard },
  { id: 'profiles', label: 'Profielen', icon: Database },
  { id: 'matrix', label: 'Match-matrix', icon: Grid3x3 },
  { id: 'ranking', label: 'Ranking', icon: Trophy },
  { id: 'compare', label: 'Vergelijking', icon: ArrowLeftRight },
  { id: 'csroi', label: 'CSROI-benchmark', icon: BarChart3 },
  { id: 'gaps', label: 'Perceptiekloof', icon: AlertTriangle },
  { id: 'quality', label: 'Datakwaliteit', icon: ClipboardCheck },
  { id: 'insights', label: 'Inzichten', icon: Sparkles },
  { id: 'users', label: 'Gebruikers', icon: UsersIcon },
];

export function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [profiles, setProfiles] = useState<OrganisationProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedResults, setSavedResults] = useState<MatchResult[]>([]);

  const loadProfiles = async () => {
    let loaded = await getAllProfiles();
    if (!loaded || loaded.length === 0) {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        try {
          loaded = JSON.parse(local) as OrganisationProfile[];
        } catch {
          loaded = [];
        }
      }
    }
    if (!loaded || loaded.length === 0) loaded = getAllDemoProfiles();
    setProfiles(loaded);
  };

  useEffect(() => {
    (async () => {
      await loadProfiles();
      setSavedResults(await getMatchResults());
      setLoading(false);
    })();
  }, []);

  const refreshResults = async () => setSavedResults(await getMatchResults());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobiele topbar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 sticky top-0 z-40">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5" /> Admin
        </h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Zijbalk — altijd zichtbaar op desktop, toggle op mobiel */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-60 shrink-0 bg-slate-900 text-white flex flex-col md:sticky md:top-0 md:h-screen z-30`}>
        <div className="hidden md:block px-5 py-5 border-b border-slate-800">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" /> Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">Beheer &amp; statistieken</p>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSidebarOpen(false); }}
                className={`w-full px-3 py-2 text-sm rounded-lg inline-flex items-center gap-3 transition-colors ${
                  tab === t.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" /> {t.label}
              </button>
            );
          })}
        </nav>

        <div className="px-2 py-3 border-t border-slate-800 space-y-1">
          <a
            href="/"
            className="w-full px-3 py-2 text-sm rounded-lg inline-flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <ArrowLeft className="w-4 h-4" /> Naar de app
          </a>
          <button
            onClick={onSignOut}
            className="w-full px-3 py-2 text-sm rounded-lg inline-flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <LogOut className="w-4 h-4" /> Uitloggen
          </button>
        </div>
      </aside>

      {/* Inhoud */}
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {tab === 'overview' && <OverviewSection profiles={profiles} savedCount={savedResults.length} savedResults={savedResults} />}
          {tab === 'profiles' && <ProfilesSection profiles={profiles} onChanged={loadProfiles} />}
          {tab === 'matrix' && <MatrixSection profiles={profiles} />}
          {tab === 'ranking' && (
            <RankingSection profiles={profiles} savedResults={savedResults} onSaved={refreshResults} />
          )}
          {tab === 'compare' && <CompareSection profiles={profiles} />}
          {tab === 'csroi' && <CsroiSection profiles={profiles} />}
          {tab === 'gaps' && <GapsSection profiles={profiles} />}
          {tab === 'quality' && <QualitySection profiles={profiles} />}
          {tab === 'insights' && <InsightsSection profiles={profiles} />}
          {tab === 'users' && <UsersSection />}
        </div>
      </main>
    </div>
  );
}

// --- Overzicht (KPI's) ------------------------------------------------------
function OverviewSection({
  profiles,
  savedCount,
  savedResults,
}: {
  profiles: OrganisationProfile[];
  savedCount: number;
  savedResults: MatchResult[];
}) {
  const kpis = useMemo(() => computeKpis(profiles), [profiles]);

  const tiles = [
    { label: 'Culturele organisaties', value: kpis.culturalCount },
    { label: 'Profit bedrijven', value: kpis.profitCount },
    { label: 'Mogelijke paren', value: kpis.pairCount },
    { label: 'Gemiddelde match', value: `${kpis.avgMatch}%` },
    { label: 'Opgeslagen matches', value: savedCount },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="text-3xl font-bold text-slate-900">{t.value}</div>
            <div className="text-xs text-slate-500 mt-1">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => exportProfilesToExcel(profiles)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all text-sm"
        >
          <FileSpreadsheet className="w-4 h-4" /> Profielen exporteren (Excel)
        </button>
        <button
          onClick={() => exportMatchDataToExcel(profiles, savedResults)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all text-sm"
        >
          <FileSpreadsheet className="w-4 h-4" /> Matches exporteren (Excel)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {kpis.bestMatch && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <div className="text-sm font-medium text-green-900 mb-1">Beste match</div>
            <div className="text-green-800">
              {kpis.bestMatch.cultural} ↔ {kpis.bestMatch.profit}
            </div>
            <div className="text-2xl font-bold text-green-700 mt-1">{kpis.bestMatch.score}%</div>
          </div>
        )}
        {kpis.worstMatch && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="text-sm font-medium text-red-900 mb-1">Laagste match</div>
            <div className="text-red-800">
              {kpis.worstMatch.cultural} ↔ {kpis.worstMatch.profit}
            </div>
            <div className="text-2xl font-bold text-red-700 mt-1">{kpis.worstMatch.score}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Match-matrix (heatmap) -------------------------------------------------
function MatrixSection({ profiles }: { profiles: OrganisationProfile[] }) {
  const { culturals, profits, matrix } = useMemo(() => buildMatchMatrix(profiles), [profiles]);

  if (culturals.length === 0 || profits.length === 0) {
    return <Empty text="Minstens 1 cultureel én 1 profit profiel nodig voor de matrix." />;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm overflow-auto">
      <table className="border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-2 text-left text-slate-500 font-medium sticky left-0 bg-white">
              Cultureel \ Profit
            </th>
            {profits.map((p) => (
              <th key={p.id} className="p-2 text-xs font-medium text-slate-600 min-w-[90px] align-bottom">
                {p.meta.orgName || 'Naamloos'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {culturals.map((c, ci) => (
            <tr key={c.id}>
              <td className="p-2 text-xs font-medium text-slate-700 sticky left-0 bg-white whitespace-nowrap">
                {c.meta.orgName || 'Naamloos'}
              </td>
              {profits.map((p, pi) => {
                const score = matrix[ci][pi];
                return (
                  <td key={p.id} className="p-1">
                    <div
                      className={`rounded text-center py-2 font-semibold border ${matchBg(score)} ${matchColor(
                        score
                      )}`}
                      title={`${c.meta.orgName} ↔ ${p.meta.orgName}: ${score}%`}
                    >
                      {score}%
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Ranking (verplaatst, + opslaan) ----------------------------------------
function RankingSection({
  profiles,
  savedResults,
  onSaved,
}: {
  profiles: OrganisationProfile[];
  savedResults: MatchResult[];
  onSaved: () => void;
}) {
  const [baseId, setBaseId] = useState<string>(profiles[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const base = profiles.find((p) => p.id === baseId) || null;
  const opposites = base ? profiles.filter((p) => p.organisationType !== base.organisationType) : [];

  const ranking = base
    ? opposites
        .map((opp) => {
          const cultural = base.organisationType === 'cultural' ? base : opp;
          const profit = base.organisationType === 'cultural' ? opp : base;
          const { overall, dimensionMatches } = computeMatch(cultural.dimensions, profit.dimensions);
          return { opp, cultural, profit, overall, dimensionMatches };
        })
        .sort((a, b) => b.overall - a.overall)
    : [];

  const handleSaveAll = async () => {
    setSaving(true);
    setSaved(false);
    for (const r of ranking) {
      await saveMatchResult({
        cultural_id: r.cultural.id,
        profit_id: r.profit.id,
        match_score: Math.round(r.overall),
        dimension_scores: r.dimensionMatches,
      });
    }
    await onSaved();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const profileName = (id: string) => profiles.find((p) => p.id === id)?.meta.orgName || id;

  const handleMail = async (item: {
    cultural: OrganisationProfile;
    profit: OrganisationProfile;
    overall: number;
    dimensionMatches: { dimension: string | number; matchScore: number }[];
  }) => {
    const toEmail = window.prompt(
      `Naar welk e-mailadres wil je het matchrapport sturen?\n${item.cultural.meta.orgName} ↔ ${item.profit.meta.orgName}`
    );
    if (!toEmail) return;
    const html = buildMatchReportHtml({
      culturalName: item.cultural.meta.orgName,
      profitName: item.profit.meta.orgName,
      overall: Math.round(item.overall),
      dimensionMatches: item.dimensionMatches.map((d) => ({
        dimension: String(d.dimension),
        matchScore: d.matchScore,
      })),
    });
    const { error } = await sendMatchReport({
      toEmail,
      subject: `Matchrapport: ${item.cultural.meta.orgName} ↔ ${item.profit.meta.orgName}`,
      html,
    });
    if (error) window.alert('Mail mislukt: ' + error);
    else window.alert('Matchrapport verstuurd naar ' + toEmail);
  };

  const handleStatus = async (res: MatchResult, status: MatchStatus) => {
    if (!res.id) return;
    await updateMatchStatus(res.id, status);
    await onSaved();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Kies een organisatie om te ranken tegen alle tegenpartijen
        </label>
        <select
          value={baseId}
          onChange={(e) => setBaseId(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <optgroup label="Culturele organisaties">
            {profiles
              .filter((p) => p.organisationType === 'cultural')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.meta.orgName || 'Naamloos'}
                </option>
              ))}
          </optgroup>
          <optgroup label="Profit bedrijven">
            {profiles
              .filter((p) => p.organisationType === 'profit')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.meta.orgName || 'Naamloos'}
                </option>
              ))}
          </optgroup>
        </select>
        {base && (
          <div className="mt-3 text-sm text-slate-600 flex items-center gap-2">
            {base.organisationType === 'cultural' ? (
              <Building2 className="w-4 h-4 text-purple-600" />
            ) : (
              <TrendingUp className="w-4 h-4 text-blue-600" />
            )}
            <span>
              <strong>{base.meta.orgName}</strong> gerangschikt tegen {opposites.length}{' '}
              {base.organisationType === 'cultural' ? 'profit bedrijven' : 'culturele organisaties'}
            </span>
          </div>
        )}
      </div>

      {ranking.length === 0 ? (
        <Empty text="Geen tegenpartijen beschikbaar om tegen te ranken." />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Ranking ({ranking.length})</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportMatchDataToExcel(profiles, savedResults)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all text-sm"
              >
                <FileSpreadsheet className="w-4 h-4" /> Excel export
              </button>
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all disabled:opacity-60 text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Opslaan...
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-4 h-4" /> Opgeslagen
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Resultaten opslaan in Supabase
                  </>
                )}
              </button>
            </div>
          </div>

          {ranking.map((r, idx) => (
            <div
              key={r.opp.id}
              className={`rounded-lg border p-4 flex items-center gap-4 ${matchBg(r.overall)}`}
            >
              <div className="text-2xl font-bold text-slate-400 w-8 text-center">{idx + 1}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{r.opp.meta.orgName}</div>
                <div className="text-xs text-slate-500">
                  {r.opp.meta.orgType} · {getMatchLabel(r.overall)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportMatchReportToPdf({
                      culturalName: r.cultural.meta.orgName,
                      profitName: r.profit.meta.orgName,
                      overall: r.overall,
                      dimensionMatches: r.dimensionMatches.map((d) => ({
                        dimension: String(d.dimension),
                        culturalScore: d.culturalScore,
                        profitScore: d.profitScore,
                        matchScore: d.matchScore,
                      })),
                    })
                  }
                  title="Download matchrapport (PDF)"
                  className="p-2 rounded-lg bg-white/70 hover:bg-white text-slate-700 border border-slate-200"
                >
                  <FileDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMail(r)}
                  title="Mail matchrapport"
                  className="p-2 rounded-lg bg-white/70 hover:bg-white text-slate-700 border border-slate-200"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
              <div className={`text-3xl font-bold ${matchColor(r.overall)}`}>
                {Math.round(r.overall)}%
              </div>
            </div>
          ))}
        </div>
      )}

      {savedResults.length > 0 && (
        <SavedResultsCRM
          savedResults={savedResults}
          profileName={profileName}
          handleStatus={handleStatus}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}

// --- Opgeslagen resultaten met CRM-velden ------------------------------------
function SavedResultsCRM({
  savedResults,
  profileName,
  handleStatus,
  onSaved,
}: {
  savedResults: MatchResult[];
  profileName: (id: string) => string;
  handleStatus: (res: MatchResult, status: MatchStatus) => void;
  onSaved: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [crmData, setCrmData] = useState<Record<string, {
    notes: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    last_contact_at: string;
    next_contact_at: string;
  }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const toggleExpand = (id: string | undefined) => {
    if (!id) return;
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      // Initialiseer CRM-data vanuit het matchresultaat als nog niet aanwezig
      if (!crmData[id]) {
        const res = savedResults.find((r) => r.id === id);
        setCrmData((prev) => ({
          ...prev,
          [id]: {
            notes: res?.notes || '',
            contact_name: res?.contact_name || '',
            contact_email: res?.contact_email || '',
            contact_phone: res?.contact_phone || '',
            last_contact_at: res?.last_contact_at || '',
            next_contact_at: res?.next_contact_at || '',
          },
        }));
      }
    }
  };

  const updateField = (id: string, field: string, value: string) => {
    setCrmData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSaveCRM = async (id: string) => {
    setSavingId(id);
    setSavedId(null);
    const fields = crmData[id];
    const { error } = await updateMatchCRM(id, {
      notes: fields.notes || undefined,
      contact_name: fields.contact_name || undefined,
      contact_email: fields.contact_email || undefined,
      contact_phone: fields.contact_phone || undefined,
      last_contact_at: fields.last_contact_at || null,
      next_contact_at: fields.next_contact_at || null,
    });
    if (error) {
      window.alert('Opslaan mislukt: ' + error);
    } else {
      setSavedId(id);
      await onSaved();
      setTimeout(() => setSavedId(null), 2500);
    }
    setSavingId(null);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
        <StickyNote className="w-5 h-5 text-amber-600" />
        Opgeslagen resultaten ({savedResults.length})
      </h2>
      <div className="space-y-1">
        {savedResults.map((res) => {
          const isExpanded = expandedId === res.id;
          const fields = res.id ? crmData[res.id] : undefined;
          return (
            <div key={res.id} className="border border-slate-100 rounded-lg overflow-hidden">
              {/* Klikbare rij */}
              <div
                onClick={() => toggleExpand(res.id)}
                className="flex items-center justify-between text-sm px-3 py-2 gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="text-slate-700 truncate">
                    {profileName(res.cultural_id)} ↔ {profileName(res.profit_id)}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={(res.status as MatchStatus) || 'nieuw'}
                    onChange={(e) => handleStatus(res, e.target.value as MatchStatus)}
                    className="text-xs border border-slate-300 rounded px-2 py-1"
                  >
                    {MATCH_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {MATCH_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <span className={`font-semibold ${matchColor(res.match_score)}`}>
                    {Math.round(res.match_score)}%
                  </span>
                </div>
              </div>

              {/* Uitgeklapt CRM-paneel */}
              {isExpanded && res.id && fields && (
                <div className="bg-amber-50 border-t border-amber-200 px-4 py-4 space-y-4">
                  {/* Notities */}
                  <div>
                    <label className="block text-sm font-medium text-amber-900 mb-1">Notities</label>
                    <textarea
                      value={fields.notes}
                      onChange={(e) => updateField(res.id!, 'notes', e.target.value)}
                      rows={3}
                      placeholder="Voeg notities toe over deze match..."
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
                    />
                  </div>

                  {/* Contactgegevens grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-amber-900 mb-1">Contactpersoon</label>
                      <input
                        type="text"
                        value={fields.contact_name}
                        onChange={(e) => updateField(res.id!, 'contact_name', e.target.value)}
                        placeholder="Naam"
                        className="w-full px-3 py-1.5 border border-amber-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-amber-900 mb-1">E-mail</label>
                      <input
                        type="email"
                        value={fields.contact_email}
                        onChange={(e) => updateField(res.id!, 'contact_email', e.target.value)}
                        placeholder="e-mail@voorbeeld.be"
                        className="w-full px-3 py-1.5 border border-amber-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-amber-900 mb-1">Telefoon</label>
                      <input
                        type="tel"
                        value={fields.contact_phone}
                        onChange={(e) => updateField(res.id!, 'contact_phone', e.target.value)}
                        placeholder="+32 ..."
                        className="w-full px-3 py-1.5 border border-amber-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  {/* Datums */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-amber-900 mb-1">Laatst contact</label>
                      <input
                        type="date"
                        value={fields.last_contact_at}
                        onChange={(e) => updateField(res.id!, 'last_contact_at', e.target.value)}
                        className="w-full px-3 py-1.5 border border-amber-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-amber-900 mb-1">Volgend contact</label>
                      <input
                        type="date"
                        value={fields.next_contact_at}
                        onChange={(e) => updateField(res.id!, 'next_contact_at', e.target.value)}
                        className="w-full px-3 py-1.5 border border-amber-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  {/* Opslaan */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveCRM(res.id!)}
                      disabled={savingId === res.id}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {savingId === res.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Opslaan...</>
                      ) : savedId === res.id ? (
                        <><Check className="w-4 h-4" /> Opgeslagen</>
                      ) : (
                        <><Save className="w-4 h-4" /> CRM opslaan</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- CSROI-sectorbenchmark --------------------------------------------------
function CsroiSection({ profiles }: { profiles: OrganisationProfile[] }) {
  const rows = useMemo(() => csroiBenchmark(profiles), [profiles]);
  if (rows.length === 0) return <Empty text="Geen culturele profielen voor de benchmark." />;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm space-y-4">
      <p className="text-sm text-slate-500">
        Gemiddelde CSROI-score per dimensie over alle culturele organisaties (0-100).
      </p>
      {rows.map((r) => (
        <div key={r.dimension}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-700">{r.dimension}</span>
            <span className="font-semibold text-slate-900">{r.avg}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
              style={{ width: `${r.avg}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Perceptiekloof ---------------------------------------------------------
function GapsSection({ profiles }: { profiles: OrganisationProfile[] }) {
  const orgs = useMemo(() => perceptionGaps(profiles), [profiles]);
  if (orgs.length === 0)
    return <Empty text="Geen significante directie↔team-verschillen (>20 punten) gevonden." />;

  return (
    <div className="space-y-4">
      {orgs.map(({ profile, gaps }) => (
        <div key={profile.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-slate-900">{profile.meta.orgName}</h3>
            <span className="text-xs text-slate-500">({gaps.length} verschillen)</span>
          </div>
          <div className="space-y-2">
            {gaps.map((g, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">
                  {g.dimensionLabel} · {g.axisLabel}
                </span>
                <span className="text-slate-600">
                  Directie {g.leadership} / Team {g.staff}{' '}
                  <span className="font-semibold text-orange-600">(Δ {g.diff})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Datakwaliteit ----------------------------------------------------------
function QualitySection({ profiles }: { profiles: OrganisationProfile[] }) {
  const items = useMemo(() => dataQuality(profiles), [profiles]);
  if (items.length === 0)
    return <Empty text="Alle profielen zien er compleet uit. Geen problemen gevonden." />;

  return (
    <div className="space-y-3">
      {items.map(({ profile, issues }) => (
        <div key={profile.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <div className="font-medium text-slate-900 mb-2">
            {profile.meta.orgName || 'Naamloos profiel'}{' '}
            <span className="text-xs text-slate-400">({profile.id})</span>
          </div>
          <ul className="space-y-1">
            {issues.map((issue, i) => (
              <li key={i} className="text-sm text-orange-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> {issue}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
      {text}
    </div>
  );
}
