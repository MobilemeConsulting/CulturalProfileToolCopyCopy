import { useState } from 'react';
import { Sparkles, Loader2, Globe, Copy, Check } from 'lucide-react';
import { OrganisationProfile } from '../data/types';
import { perceptionGaps } from '../utils/adminStats';
import { generateConversationStarter } from '../services/insightsService';

export function InsightsSection({ profiles }: { profiles: OrganisationProfile[] }) {
  const [selectedId, setSelectedId] = useState<string>(profiles[0]?.id ?? '');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const profile = profiles.find((p) => p.id === selectedId) || null;

  const handleGenerate = async () => {
    if (!profile || !websiteUrl.trim()) return;
    setLoading(true);
    setError('');
    setOutput('');

    const gaps = perceptionGaps([profile])[0]?.gaps ?? [];
    const result = await generateConversationStarter({
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
    if (result.error) setError(result.error);
    else setOutput(result.output ?? '');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
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
              <strong>gemeten</strong> profiel en de directie/team-verschillen, en stelt
              gesprekstarters voor.
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

      {output && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">Resultaat</h3>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Gekopieerd' : 'Kopiëren'}
            </button>
          </div>
          <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">{output}</div>
        </div>
      )}
    </div>
  );
}
