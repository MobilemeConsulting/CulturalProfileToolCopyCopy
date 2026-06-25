import { useState } from 'react';
import { Sparkles, Loader2, Globe, Copy, Check } from 'lucide-react';
import { OrganisationProfile } from '../data/types';
import { perceptionGaps } from '../utils/adminStats';
import {
  generateConversationStarter,
  ConversationStarterResult,
} from '../services/insightsService';

function resultToText(r: ConversationStarterResult): string {
  const block = (title: string, items: string[]) =>
    items.length ? `${title}\n${items.map((i) => `- ${i}`).join('\n')}` : '';
  return [
    `MISSIE\n${r.missie}`,
    block('WAARDEN', r.waarden),
    `CULTUUR\n${r.cultuur}`,
    block('AANSLUITING', r.aansluiting),
    block('AFWIJKING', r.afwijking),
    block('DIRECTIE vs TEAM', r.directieTeam),
    block('GESPREKSTARTERS', r.gesprekstarters),
  ]
    .filter(Boolean)
    .join('\n\n');
}

export function InsightsSection({ profiles }: { profiles: OrganisationProfile[] }) {
  const [selectedId, setSelectedId] = useState<string>(profiles[0]?.id ?? '');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConversationStarterResult | null>(null);
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const profile = profiles.find((p) => p.id === selectedId) || null;

  const handleGenerate = async () => {
    if (!profile || !websiteUrl.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setRaw('');

    const gaps = perceptionGaps([profile])[0]?.gaps ?? [];
    const res = await generateConversationStarter({
      orgName: profile.meta.orgName || 'Onbekend',
      websiteUrl: websiteUrl.trim(),
      dimensions: profile.dimensions.map((d) => ({
        label: d.label,
        axes: d.axes.map((a) => ({ label: a.label, score: a.score })),
      })),
      gaps: gaps.map((g) => ({
        dimensionLabel: g.dimensionLabel,
        axisLabel: g.axisLabel,
        leadership: g.leadership,
        staff: g.staff,
        diff: g.diff,
      })),
    });

    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setResult(res.structured);
      setRaw(res.raw);
    }
  };

  const handleCopy = async () => {
    const text = result ? resultToText(result) : raw;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Gesprekstarter genereren</h2>
            <p className="text-sm text-slate-500">
              Vergelijkt de <strong>beweerde</strong> cultuur (website) met het{' '}
              <strong>gemeten</strong> profiel en de directie/team-verschillen.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Organisatie</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.meta.orgName || 'Naamloos'} ({p.organisationType})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Website-URL</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://www.bedrijf.be"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !profile || !websiteUrl.trim()}
          className="inline-flex items-center gap-2 px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Analyseren...' : 'Genereer gesprekstarter'}
        </button>

        {error && <div className="text-sm bg-red-50 text-red-700 rounded-md px-3 py-2">✗ {error}</div>}
      </div>

      {(result || raw) && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Resultaat</h3>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Gekopieerd' : 'Kopiëren'}
            </button>
          </div>

          {result ? (
            <div className="space-y-5">
              <TextBlock title="Missie" text={result.missie} />
              <Chips title="Waarden" items={result.waarden} />
              <TextBlock title="Cultuur" text={result.cultuur} />
              <ListBlock title="Aansluiting" items={result.aansluiting} accent="green" />
              <ListBlock title="Afwijking" items={result.afwijking} accent="orange" />
              {result.directieTeam.length > 0 && (
                <ListBlock title="Directie vs team" items={result.directieTeam} accent="blue" />
              )}
              <ListBlock title="Gesprekstarters" items={result.gesprekstarters} accent="purple" />
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">{raw}</div>
          )}
        </div>
      )}
    </div>
  );
}

function TextBlock({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
    </div>
  );
}

function Chips({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900 mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const accentMap: Record<string, string> = {
  green: 'border-green-300 bg-green-50',
  orange: 'border-orange-300 bg-orange-50',
  blue: 'border-blue-300 bg-blue-50',
  purple: 'border-purple-300 bg-purple-50',
};

function ListBlock({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: keyof typeof accentMap;
}) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-900 mb-2">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`text-sm text-slate-700 border-l-2 pl-3 py-1 rounded ${accentMap[accent]}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
