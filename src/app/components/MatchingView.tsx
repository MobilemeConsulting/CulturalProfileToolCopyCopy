import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
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
import type { Profile } from '../App';
import { Building2, TrendingUp, Sparkles, AlertCircle, CheckCircle2, Heart, Info, Users } from 'lucide-react';
import { computeCSROIScores, calculateOverallCSROI } from '../utils/csroiCalculations';
import { CSROIScores } from '../types/csroi';
import { calculateAxisMatch } from '../utils/matching';

interface MatchingViewProps {
  profiles: Profile[];
}

export function MatchingView({ profiles }: MatchingViewProps) {
  const culturalProfiles = profiles.filter(p => p.organisationType === 'cultural');
  const profitProfiles = profiles.filter(p => p.organisationType === 'profit');

  const [selectedCultural, setSelectedCultural] = useState<Profile | null>(
    culturalProfiles[0] || null
  );
  const [selectedProfit, setSelectedProfit] = useState<Profile | null>(
    profitProfiles[0] || null
  );

  if (culturalProfiles.length === 0 || profitProfiles.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Onvoldoende profielen voor matching
          </h3>
          <p className="text-slate-600 mb-4">
            Je hebt minimaal 1 cultureel profiel en 1 profit profiel nodig om een matching te maken.
          </p>
          <div className="flex gap-4 justify-center text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span>Cultureel: {culturalProfiles.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Profit: {profitProfiles.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Additional null check for selected profiles
  if (!selectedCultural || !selectedProfit) {
    return (
      <Card className="shadow-lg">
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Selecteer profielen
          </h3>
          <p className="text-slate-600">
            Selecteer een cultureel profiel en een profit profiel om te matchen.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate matching scores using CSROI dimensions
  // Convert both profiles to CSROI scores first
  const culturalCSROI = computeCSROIScores(selectedCultural.dimensions);
  const profitCSROI = computeCSROIScores(selectedProfit.dimensions);

  // Calculate matches per CSROI dimension
  const csroiDimensions = Object.keys(culturalCSROI) as Array<keyof CSROIScores>;
  
  const dimensionMatches = csroiDimensions.map(dimension => {
    const culturalScore = culturalCSROI[dimension];
    const profitScore = profitCSROI[dimension];
    const matchScore = calculateAxisMatch(culturalScore, profitScore);
    
    return {
      dimensionId: dimension,
      dimensionLabel: dimension,
      culturalScore: culturalScore * 20, // Convert to 0-100 for display
      profitScore: profitScore * 20,
      matchScore,
    };
  });

  const overallMatch =
    dimensionMatches.reduce((sum, d) => sum + d.matchScore, 0) / dimensionMatches.length;

  // Prepare radar chart data
  const radarData = csroiDimensions.map(dimension => ({
    axis: dimension,
    cultureel: culturalCSROI[dimension] * 20, // Convert to 0-100 scale
    profit: profitCSROI[dimension] * 20,
  }));

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getMatchBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-orange-100 border-orange-300';
  };

  const getMatchIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <Heart className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-orange-600" />;
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Uitstekende match';
    if (score >= 60) return 'Goede match';
    if (score >= 40) return 'Redelijke match';
    return 'Beperkte match';
  };

  return (
    <div className="space-y-8">
      {/* Profile Selectors */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-lg border-2 border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
              Culturele Organisatie
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <select
              value={selectedCultural?.id || ''}
              onChange={(e) => {
                const profile = culturalProfiles.find(p => p.id === e.target.value);
                if (profile) setSelectedCultural(profile);
              }}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {culturalProfiles.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.meta.orgName || 'Naamloos profiel'}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Profit Bedrijf
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <select
              value={selectedProfit?.id || ''}
              onChange={(e) => {
                const profile = profitProfiles.find(p => p.id === e.target.value);
                if (profile) setSelectedProfit(profile);
              }}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {profitProfiles.map(profile => (
                <option key={profile.id} value={profile.id}>
                  {profile.meta.orgName || 'Naamloos profiel'}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {/* Leadership vs Staff Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cultural Organization Response Comparison */}
        {selectedCultural.profitData?.leadershipResponses && 
         selectedCultural.profitData?.staffResponses && 
         selectedCultural.profitData.leadershipResponses.length > 0 && 
         selectedCultural.profitData.staffResponses.length > 0 && (
          <Card className="shadow-lg border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                {selectedCultural.meta.orgName} - Directie vs Team
              </CardTitle>
              <CardDescription>
                Vergelijking van percepties binnen de organisatie
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {selectedCultural.profitData.leadershipResponses.map((leaderDim, idx) => {
                  const staffDim = selectedCultural.profitData!.staffResponses[idx];
                  if (!staffDim) return null;
                  
                  return (
                    <div key={leaderDim.id} className="space-y-2">
                      <h4 className="font-semibold text-sm text-slate-900">{leaderDim.label}</h4>
                      {leaderDim.axes.map((leaderAxis, axisIdx) => {
                        const staffAxis = staffDim.axes[axisIdx];
                        if (!staffAxis) return null;
                        
                        const difference = Math.abs(leaderAxis.score - staffAxis.score);
                        const avgScore = Math.round((leaderAxis.score * 0.6 + staffAxis.score * 0.4));
                        
                        return (
                          <div key={leaderAxis.id} className="bg-slate-50 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 mb-2">{leaderAxis.label}</div>
                            
                            {/* Leadership Score */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-purple-700 w-20">Directie</span>
                              <div className="flex-1 bg-purple-100 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full transition-all"
                                  style={{ width: `${leaderAxis.score}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-purple-900 w-8">{leaderAxis.score}</span>
                            </div>
                            
                            {/* Staff Score */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-pink-700 w-20">Team</span>
                              <div className="flex-1 bg-pink-100 rounded-full h-2">
                                <div 
                                  className="bg-pink-600 h-2 rounded-full transition-all"
                                  style={{ width: `${staffAxis.score}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-pink-900 w-8">{staffAxis.score}</span>
                            </div>
                            
                            {/* Combined Weighted Score */}
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                              <span className="text-xs font-medium text-slate-700 w-20">Gewogen</span>
                              <div className="flex-1 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-slate-700 h-2 rounded-full transition-all"
                                  style={{ width: `${avgScore}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-900 w-8">{avgScore}</span>
                            </div>
                            
                            {difference > 20 && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                                <AlertCircle className="w-3 h-3" />
                                <span>Significant verschil: {difference} punten</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-800">
                    <strong>Weging:</strong> Directie 60% + Team 40% = Gecombineerd profiel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profit Organization Response Comparison */}
        {selectedProfit.profitData?.leadershipResponses && 
         selectedProfit.profitData?.staffResponses && 
         selectedProfit.profitData.leadershipResponses.length > 0 && 
         selectedProfit.profitData.staffResponses.length > 0 && (
          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                {selectedProfit.meta.orgName} - Management vs Personeel
              </CardTitle>
              <CardDescription>
                Vergelijking van percepties binnen de organisatie
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {selectedProfit.profitData.leadershipResponses.map((leaderDim, idx) => {
                  const staffDim = selectedProfit.profitData!.staffResponses[idx];
                  if (!staffDim) return null;
                  
                  return (
                    <div key={leaderDim.id} className="space-y-2">
                      <h4 className="font-semibold text-sm text-slate-900">{leaderDim.label}</h4>
                      {leaderDim.axes.map((leaderAxis, axisIdx) => {
                        const staffAxis = staffDim.axes[axisIdx];
                        if (!staffAxis) return null;
                        
                        const difference = Math.abs(leaderAxis.score - staffAxis.score);
                        const avgScore = Math.round((leaderAxis.score * 0.6 + staffAxis.score * 0.4));
                        
                        return (
                          <div key={leaderAxis.id} className="bg-slate-50 p-3 rounded-lg">
                            <div className="text-xs text-slate-600 mb-2">{leaderAxis.label}</div>
                            
                            {/* Leadership Score */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-blue-700 w-20">Management</span>
                              <div className="flex-1 bg-blue-100 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${leaderAxis.score}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-blue-900 w-8">{leaderAxis.score}</span>
                            </div>
                            
                            {/* Staff Score */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-indigo-700 w-20">Personeel</span>
                              <div className="flex-1 bg-indigo-100 rounded-full h-2">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full transition-all"
                                  style={{ width: `${staffAxis.score}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-indigo-900 w-8">{staffAxis.score}</span>
                            </div>
                            
                            {/* Combined Weighted Score */}
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200">
                              <span className="text-xs font-medium text-slate-700 w-20">Gewogen</span>
                              <div className="flex-1 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-slate-700 h-2 rounded-full transition-all"
                                  style={{ width: `${avgScore}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-900 w-8">{avgScore}</span>
                            </div>
                            
                            {difference > 20 && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                                <AlertCircle className="w-3 h-3" />
                                <span>Significant verschil: {difference} punten</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Weging:</strong> Management 60% + Personeel 40% = Gecombineerd profiel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Overall Match Score */}
      <Card className={`shadow-xl border-2 ${getMatchBgColor(overallMatch)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Sparkles className="w-7 h-7" />
                Totale Match Score
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {selectedCultural.meta.orgName || 'Culturele organisatie'} ↔{' '}
                {selectedProfit.meta.orgName || 'Profit bedrijf'}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${getMatchColor(overallMatch)}`}>
                {Math.round(overallMatch)}%
              </div>
              <div className="text-sm text-slate-600 mt-1 flex items-center gap-2 justify-end">
                {getMatchIcon(overallMatch)}
                {getMatchLabel(overallMatch)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallMatch} className="h-4" />
        </CardContent>
      </Card>

      {/* Radar Chart Comparison */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50">
          <CardTitle className="text-center text-2xl">
            Visuele Vergelijking
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <ResponsiveContainer width="100%" height={450}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: '#475569', fontSize: 11 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
              <Radar
                name="Cultureel"
                dataKey="cultureel"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.5}
                strokeWidth={2}
              />
              <Radar
                name="Profit"
                dataKey="profit"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
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
        </CardContent>
      </Card>

      {/* Detailed Dimension Matches */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Gedetailleerde Matching per CSROI Dimensie
        </h2>
        {dimensionMatches.map((dimMatch) => (
          <Card key={dimMatch.dimensionId} className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{dimMatch.dimensionLabel}</CardTitle>
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${getMatchColor(dimMatch.matchScore)}`}>
                    {Math.round(dimMatch.matchScore)}%
                  </span>
                  {getMatchIcon(dimMatch.matchScore)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Score Comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-900">
                        Cultureel Profiel
                      </span>
                      <span className="text-2xl font-bold text-purple-600">
                        {Math.round(dimMatch.culturalScore)}
                      </span>
                    </div>
                    <Progress value={dimMatch.culturalScore} className="h-2 bg-purple-200" />
                    <div className="text-xs text-purple-700 mt-2">
                      {selectedCultural.meta.orgName}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Profit Profiel</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {Math.round(dimMatch.profitScore)}
                      </span>
                    </div>
                    <Progress value={dimMatch.profitScore} className="h-2 bg-blue-200" />
                    <div className="text-xs text-blue-700 mt-2">
                      {selectedProfit.meta.orgName}
                    </div>
                  </div>
                </div>

                {/* Match Quality Indicator */}
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1">
                    <Progress value={dimMatch.matchScore} className="h-3" />
                  </div>
                  <Badge
                    className={`${
                      dimMatch.matchScore >= 80
                        ? 'bg-green-100 text-green-800'
                        : dimMatch.matchScore >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {getMatchLabel(dimMatch.matchScore)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights */}
      <Card className="shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Matching Inzichten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overallMatch >= 80 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">
                  ✓ Uitstekende Samenwerkingskansen
                </h4>
                <p className="text-sm text-green-800">
                  De profielen tonen een sterke overeenkomst. Er is een natuurlijke fit tussen
                  de organisaties die kan leiden tot vruchtbare samenwerking.
                </p>
              </div>
            )}

            {overallMatch >= 60 && overallMatch < 80 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">
                  ⚡ Goede Match met Groeipotentieel
                </h4>
                <p className="text-sm text-yellow-800">
                  Er is een solide basis voor samenwerking. Identificeer de sterkste
                  overeenkomsten en bouw daarop voort.
                </p>
              </div>
            )}

            {overallMatch < 60 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">
                  ⚠ Aanvullende Waarden
                </h4>
                <p className="text-sm text-orange-800">
                  De profielen verschillen op meerdere punten. Dit kan leiden tot complementaire
                  samenwerking waarbij beide partijen van elkaar leren.
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <h5 className="font-semibold text-slate-900 mb-2">Sterkste Overeenkomsten</h5>
                <ul className="space-y-1">
                  {dimensionMatches
                    .sort((a, b) => b.matchScore - a.matchScore)
                    .slice(0, 3)
                    .map((dim, i) => (
                      <li key={i} className="text-sm text-slate-700">
                        • {dim.dimensionLabel} ({Math.round(dim.matchScore)}%)
                      </li>
                    ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <h5 className="font-semibold text-slate-900 mb-2">Grootste Verschillen</h5>
                <ul className="space-y-1">
                  {dimensionMatches
                    .sort((a, b) => a.matchScore - b.matchScore)
                    .slice(0, 3)
                    .map((dim, i) => (
                      <li key={i} className="text-sm text-slate-700">
                        • {dim.dimensionLabel} ({Math.round(dim.matchScore)}%)
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
