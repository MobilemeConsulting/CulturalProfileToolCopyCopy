import { useState, useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { ArrowLeftRight, Building2, TrendingUp } from 'lucide-react';
import { OrganisationProfile } from '../data/types';
import { computeCSROIScores } from '../utils/csroiCalculations';
import { CSROIScores } from '../types/csroi';
import { calculateAxisMatch } from '../utils/matching';
import { matchColor, matchBg } from './AdminDashboard';

const CSROI_SHORT_LABELS: Record<keyof CSROIScores, string> = {
  'Culturele participatie & beleving': 'Participatie',
  'Educatieve impact & leren': 'Educatie',
  'Sociale impact & gemeenschap': 'Sociaal',
  'Economische impact & cross-over': 'Economisch',
  'Innovatie & verbeelding': 'Innovatie',
};

export function CompareSection({ profiles }: { profiles: OrganisationProfile[] }) {
  const [idA, setIdA] = useState<string>(profiles[0]?.id ?? '');
  const [idB, setIdB] = useState<string>(profiles[1]?.id ?? '');

  const profileA = profiles.find((p) => p.id === idA) || null;
  const profileB = profiles.find((p) => p.id === idB) || null;

  const comparison = useMemo(() => {
    if (!profileA || !profileB) return null;

    const csroiA = computeCSROIScores(profileA.dimensions);
    const csroiB = computeCSROIScores(profileB.dimensions);
    const dims = Object.keys(csroiA) as Array<keyof CSROIScores>;

    const dimensionRows = dims.map((dim) => {
      const scoreA = csroiA[dim] * 20; // 0-100
      const scoreB = csroiB[dim] * 20;
      const match = calculateAxisMatch(csroiA[dim], csroiB[dim]);
      return { dimension: dim, scoreA, scoreB, match };
    });

    const radarData = dims.map((dim) => ({
      axis: CSROI_SHORT_LABELS[dim],
      profielA: csroiA[dim] * 20,
      profielB: csroiB[dim] * 20,
    }));

    // Show match score only when the two profiles are of opposite types
    const isOpposite = profileA.organisationType !== profileB.organisationType;
    const overallMatch = isOpposite
      ? dimensionRows.reduce((s, d) => s + d.match, 0) / dimensionRows.length
      : null;

    return { dimensionRows, radarData, overallMatch, isOpposite };
  }, [profileA, profileB]);

  if (profiles.length < 2) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
        Je hebt minstens 2 profielen nodig om te vergelijken.
      </div>
    );
  }

  const selectClasses =
    'w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500';

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profiel A */}
        <div className="bg-white rounded-lg border-2 border-purple-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Profiel A
          </label>
          <select value={idA} onChange={(e) => setIdA(e.target.value)} className={selectClasses}>
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
          {profileA && (
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              {profileA.organisationType === 'cultural' ? (
                <Building2 className="w-3 h-3 text-purple-600" />
              ) : (
                <TrendingUp className="w-3 h-3 text-blue-600" />
              )}
              {profileA.organisationType === 'cultural' ? 'Cultureel' : 'Profit'}
            </div>
          )}
        </div>

        {/* Profiel B */}
        <div className="bg-white rounded-lg border-2 border-blue-200 p-5 shadow-sm">
          <label className="block text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Profiel B
          </label>
          <select value={idB} onChange={(e) => setIdB(e.target.value)} className={selectClasses}>
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
          {profileB && (
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              {profileB.organisationType === 'cultural' ? (
                <Building2 className="w-3 h-3 text-purple-600" />
              ) : (
                <TrendingUp className="w-3 h-3 text-blue-600" />
              )}
              {profileB.organisationType === 'cultural' ? 'Cultureel' : 'Profit'}
            </div>
          )}
        </div>
      </div>

      {profileA && profileB && idA === idB && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          Je hebt hetzelfde profiel geselecteerd. Kies twee verschillende profielen om te vergelijken.
        </div>
      )}

      {comparison && profileA && profileB && idA !== idB && (
        <>
          {/* Match score (alleen bij tegengestelde types) */}
          {comparison.overallMatch !== null && (
            <div
              className={`rounded-lg border p-5 flex items-center justify-between ${matchBg(
                comparison.overallMatch
              )}`}
            >
              <div>
                <div className="text-sm font-medium text-slate-700">Match score</div>
                <div className="text-xs text-slate-500 mt-1">
                  {profileA.meta.orgName} ↔ {profileB.meta.orgName}
                </div>
              </div>
              <div className={`text-4xl font-bold ${matchColor(comparison.overallMatch)}`}>
                {Math.round(comparison.overallMatch)}%
              </div>
            </div>
          )}

          {/* Radar chart */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-slate-600" />
              CSROI Radarvergelijking
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={comparison.radarData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: '#475569', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar
                  name={profileA.meta.orgName || 'Profiel A'}
                  dataKey="profielA"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Radar
                  name={profileB.meta.orgName || 'Profiel B'}
                  dataKey="profielB"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Side-by-side dimension table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                Scores per CSROI-dimensie
              </h2>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3 font-medium text-slate-600">Dimensie</th>
                    <th className="text-center px-5 py-3 font-medium text-purple-700">
                      {profileA.meta.orgName || 'Profiel A'}
                    </th>
                    <th className="text-center px-5 py-3 font-medium text-blue-700">
                      {profileB.meta.orgName || 'Profiel B'}
                    </th>
                    <th className="text-center px-5 py-3 font-medium text-slate-600">Verschil</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.dimensionRows.map((row) => {
                    const diff = Math.abs(row.scoreA - row.scoreB);
                    return (
                      <tr key={row.dimension} className="border-b border-slate-100 last:border-0">
                        <td className="px-5 py-4 text-slate-700 font-medium">{row.dimension}</td>
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-20 bg-purple-100 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${row.scoreA}%` }}
                              />
                            </div>
                            <span className="font-semibold text-purple-700 w-10 text-right">
                              {Math.round(row.scoreA)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-20 bg-blue-100 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${row.scoreB}%` }}
                              />
                            </div>
                            <span className="font-semibold text-blue-700 w-10 text-right">
                              {Math.round(row.scoreB)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`font-semibold ${
                              diff > 30
                                ? 'text-red-600'
                                : diff > 15
                                ? 'text-orange-600'
                                : 'text-green-600'
                            }`}
                          >
                            {Math.round(diff)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {comparison.dimensionRows.map((row) => {
                const diff = Math.abs(row.scoreA - row.scoreB);
                return (
                  <div key={row.dimension} className="p-4 space-y-3">
                    <div className="font-medium text-slate-900 text-sm">{row.dimension}</div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-purple-700 w-16 shrink-0">
                        {profileA.meta.orgName || 'A'}
                      </span>
                      <div className="flex-1 bg-purple-100 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${row.scoreA}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-purple-900 w-8 text-right">
                        {Math.round(row.scoreA)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-700 w-16 shrink-0">
                        {profileB.meta.orgName || 'B'}
                      </span>
                      <div className="flex-1 bg-blue-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${row.scoreB}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-blue-900 w-8 text-right">
                        {Math.round(row.scoreB)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      Verschil:{' '}
                      <span
                        className={`font-semibold ${
                          diff > 30
                            ? 'text-red-600'
                            : diff > 15
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }`}
                      >
                        {Math.round(diff)} punten
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
