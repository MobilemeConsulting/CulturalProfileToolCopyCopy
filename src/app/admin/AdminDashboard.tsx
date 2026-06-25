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
import { FileDown, Mail, Database } from 'lucide-react';
import { exportMatchReportToPdf } from '../utils/pdfExport';
import { sendMatchReport, buildMatchReportHtml } from '../services/reportService';
import {
  updateMatchStatus,
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

type Tab = 'overview' | 'profiles' | 'matrix' | 'ranking' | 'csroi' | 'gaps' | 'quality' | 'users';

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overzicht', icon: LayoutDashboard },
  { id: 'profiles', label: 'Profielen', icon: Database },
  { id: 'matrix', label: 'Match-matrix', icon: Grid3x3 },
  { id: 'ranking', label: 'Ranking', icon: Trophy },
  { id: 'csroi', label: 'CSROI-benchmark', icon: BarChart3 },
  { id: 'gaps', label: 'Perceptiekloof', icon: AlertTriangle },
  { id: 'quality', label: 'Datakwaliteit', icon: ClipboardCheck },
  { id: 'users', label: 'Gebruikers', icon: UsersIcon },
];

export function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [profiles, setProfiles] = useState<OrganisationProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
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
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6" /> Admin Dashboard
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Beheer, matching-overzicht en statistieken. Enkel voor beheerders.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-slate-300 hover:text-white inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> App
            </a>
            <button
              onClick={onSignOut}
              className="text-sm text-slate-300 hover:text-white inline-flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> Uitloggen
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 inline-flex items-center gap-2 transition-colors ${
                  tab === t.id
                    ? 'border-white text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'overview' && <OverviewSection profiles={profiles} savedCount={savedResults.length} />}
        {tab === 'profiles' && <ProfilesSection profiles={profiles} onChanged={loadProfiles} />}
        {tab === 'matrix' && <MatrixSection profiles={profiles} />}
        {tab === 'ranking' && (
          <RankingSection profiles={profiles} savedResults={savedResults} onSaved={refreshResults} />
        )}
        {tab === 'csroi' && <CsroiSection profiles={profiles} />}
        {tab === 'gaps' && <GapsSection profiles={profiles} />}
        {tab === 'quality' && <QualitySection profiles={profiles} />}
        {tab === 'users' && <UsersSection />}
      </div>
    </div>
  );
}

// --- Overzicht (KPI's) ------------------------------------------------------
function OverviewSection({
  profiles,
  savedCount,
}: {
  profiles: OrganisationProfile[];
  savedCount: number;
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <div className="text-3xl font-bold text-slate-900">{t.value}</div>
            <div className="text-xs text-slate-500 mt-1">{t.label}</div>
          </div>
        ))}
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
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Ranking ({ranking.length})</h2>
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
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Opgeslagen resultaten ({savedResults.length})
          </h2>
          <div className="space-y-2 max-h-80 overflow-auto">
            {savedResults.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between text-sm border-b border-slate-100 pb-2 gap-3"
              >
                <span className="text-slate-700 flex-1 truncate">
                  {profileName(res.cultural_id)} ↔ {profileName(res.profit_id)}
                </span>
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
            ))}
          </div>
        </div>
      )}
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
