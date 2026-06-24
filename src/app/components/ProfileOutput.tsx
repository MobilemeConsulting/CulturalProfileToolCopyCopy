import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { Profile } from '../App';
import { Building2, Palette, Users, Briefcase, Heart, MessageSquare, Eye, Printer, TrendingUp, UserCog, Info, Sparkles, Link2 } from 'lucide-react';
import { CraftProfile } from './CraftProfile';

interface ProfileOutputProps {
  profile: Profile;
}

export function ProfileOutput({ profile }: ProfileOutputProps) {
  // Prepare radar chart data
  const radarData = profile.dimensions.flatMap((dimension) =>
    dimension.axes.map((axis) => ({
      axis: axis.label.split('↔')[0].trim(),
      score: axis.score,
      fullLabel: axis.label,
    }))
  );

  const getIcon = (dimensionId: string) => {
    switch (dimensionId) {
      case 'artistic':
        return <Palette className="w-5 h-5" />;
      case 'audience':
        return <Users className="w-5 h-5" />;
      case 'organisation':
        return <Briefcase className="w-5 h-5" />;
      case 'identity':
        return <Heart className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getColorScheme = (dimensionId: string) => {
    switch (dimensionId) {
      case 'artistic':
        return {
          bg: 'from-purple-50 to-purple-100',
          text: 'text-purple-700',
          badge: 'bg-purple-100 text-purple-800',
          border: 'border-purple-200',
        };
      case 'audience':
        return {
          bg: 'from-blue-50 to-blue-100',
          text: 'text-blue-700',
          badge: 'bg-blue-100 text-blue-800',
          border: 'border-blue-200',
        };
      case 'organisation':
        return {
          bg: 'from-pink-50 to-pink-100',
          text: 'text-pink-700',
          badge: 'bg-pink-100 text-pink-800',
          border: 'border-pink-200',
        };
      case 'identity':
        return {
          bg: 'from-orange-50 to-orange-100',
          text: 'text-orange-700',
          badge: 'bg-orange-100 text-orange-800',
          border: 'border-orange-200',
        };
      default:
        return {
          bg: 'from-slate-50 to-slate-100',
          text: 'text-slate-700',
          badge: 'bg-slate-100 text-slate-800',
          border: 'border-slate-200',
        };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:space-y-6">
      {/* Print Button */}
      <div className="flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md"
        >
          <Printer className="w-4 h-4" />
          Afdrukken
        </button>
      </div>

      {/* Profit Data Alert */}
      {profile.organisationType === 'profit' && profile.profitData && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="w-5 h-5 text-blue-600" />
          <AlertTitle>Gecombineerd Bedrijfsprofiel</AlertTitle>
          <AlertDescription>
            Dit profiel is samengesteld uit antwoorden van bedrijfsleiding (60%) en personeel (40%)
          </AlertDescription>
        </Alert>
      )}

      {/* CRaFT Profile Alert for Cultural Organisations */}
      {profile.organisationType === 'cultural' && (
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1768026058295-caf3636c61ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwY29udGVtcG9yYXJ5JTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc3MTY4NTE0MXww&ixlib=rb-4.1.0&q=80&w=1080')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100/95 to-pink-100/95"></div>
          
          <Alert className="relative bg-transparent border-2 border-purple-300 shadow-none">
            <Sparkles className="w-6 h-6 text-purple-600 drop-shadow-sm" />
            <AlertTitle className="text-purple-900 font-bold text-lg">NEB Impact CRaFT Profiel Beschikbaar ✨</AlertTitle>
            <AlertDescription className="text-purple-800 text-base font-medium">
              Voor uw culturele organisatie wordt automatisch een NEB Impact CRaFT analyse gegenereerd met CRaFT, ESG en NEB scores. Scroll naar beneden om het volledige rapport te bekijken.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section with Background */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: profile.organisationType === 'cultural' 
              ? `url('https://images.unsplash.com/photo-1761229660731-891484da5c35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmb3JtYW5jZSUyMGFydCUyMHRoZWF0ZXIlMjBzdGFnZXxlbnwxfHx8fDE3NzE2ODUxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080')`
              : `url('https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbm5vdmF0aW9uJTIwdGVjaG5vbG9neSUyMGZ1dHVyZSUyMGRpZ2l0YWx8ZW58MXx8fHwxNzcxNjg1MTQzfDA&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        >
          <div className={`absolute inset-0 ${profile.organisationType === 'cultural' ? 'bg-gradient-to-r from-purple-900/95 via-pink-900/90 to-orange-900/95' : 'bg-gradient-to-r from-blue-900/95 via-indigo-900/90 to-purple-900/95'} backdrop-blur-sm`}></div>
        </div>
        
        <Card className="relative bg-transparent border-0">
          <div className="p-10">
            <div className="flex items-center gap-4 mb-6">
              {profile.organisationType === 'cultural' ? (
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                  <Building2 className="w-9 h-9 text-white drop-shadow-lg" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                  <TrendingUp className="w-9 h-9 text-white drop-shadow-lg" />
                </div>
              )}
              <div>
                <h2 className="text-4xl font-bold text-white drop-shadow-2xl">
                  {profile.meta.orgName || 'Uw Organisatie'}
                </h2>
                <p className="text-purple-100 text-xl drop-shadow-lg">
                  {profile.meta.orgType || (profile.organisationType === 'cultural' ? 'Culturele organisatie' : 'Bedrijf')} • {profile.meta.year}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="relative p-8 bg-white/95 backdrop-blur-sm">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  Tone of Voice
                </h3>
              <div className="flex flex-wrap gap-2">
                {profile.identitySummary.toneOfVoice.length > 0 ? (
                  profile.identitySummary.toneOfVoice.map((tone, index) => (
                    <Badge
                      key={index}
                      className="px-4 py-2 text-base bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-900 border border-orange-200"
                    >
                      {tone}
                    </Badge>
                  ))
                ) : (
                  <p className="text-slate-500 italic">Nog niet ingevuld</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-pink-600" />
                Visuele kernwoorden
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.identitySummary.visualKeywords.length > 0 ? (
                  profile.identitySummary.visualKeywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      className="px-4 py-2 text-base bg-gradient-to-r from-pink-100 to-purple-100 text-pink-900 border border-pink-200"
                    >
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <p className="text-slate-500 italic">Nog niet ingevuld</p>
                )}
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
      </div>

      {/* Pitch Section */}
      <Card className="shadow-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
          <CardTitle className="text-3xl font-bold text-purple-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8" />
            Organisatie Pitch
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Main Pitch */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-purple-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Wie zijn we?</h3>
              <p className="text-lg text-slate-700 leading-relaxed">
                <span className="font-bold text-purple-700">{profile.meta.orgName || 'Uw Organisatie'}</span> is een {profile.meta.orgType || (profile.organisationType === 'cultural' ? 'culturele organisatie' : 'bedrijf')} {' '}
                {profile.organisationType === 'cultural' 
                  ? 'dat zich onderscheidt door een unieke culturele identiteit en maatschappelijke impact.'
                  : 'dat organisatiecultuur en medewerkerswelzijn hoog in het vaandel draagt.'}
              </p>
            </div>

            {/* Key Strengths - based on highest scores */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-pink-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Onze Kracht</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {profile.dimensions
                  .flatMap(dim => dim.axes.map(axis => ({
                    ...axis,
                    dimensionLabel: dim.label
                  })))
                  .sort((a, b) => {
                    // Sort by distance from center (50)
                    const aDistance = Math.abs(a.score - 50);
                    const bDistance = Math.abs(b.score - 50);
                    return bDistance - aDistance;
                  })
                  .slice(0, 4)
                  .map((axis, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {axis.score}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">{axis.label}</p>
                        <p className="text-xs text-slate-600">{axis.dimensionLabel}</p>
                        {axis.description && (
                          <p className="text-sm text-slate-700 mt-1">{axis.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Identity Words */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-orange-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Onze Kernwaarden</h3>
              <div className="flex flex-wrap gap-2">
                {profile.dimensions
                  .flatMap(dim => dim.axes.flatMap(axis => axis.identityWords))
                  .filter((word, index, self) => self.indexOf(word) === index) // unique
                  .slice(0, 12)
                  .map((word, idx) => (
                    <Badge 
                      key={idx} 
                      className="px-4 py-2 text-base bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-900 border border-orange-300"
                    >
                      {word}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Partnership Call to Action */}
            {profile.organisationType === 'cultural' ? (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 shadow-xl text-white">
                <h3 className="text-2xl font-bold mb-3">Zoekt u een culturele partner?</h3>
                <p className="text-purple-100 mb-4 leading-relaxed">
                  Wij bieden unieke mogelijkheden voor cross-over samenwerking met bedrijven die hun organisatiecultuur willen versterken 
                  door middel van culturele interventies, teambuilding en community engagement.
                </p>
                <div className="flex items-center gap-2 text-purple-100">
                  <Link2 className="w-5 h-5" />
                  <span className="font-semibold">Bekijk ons volledige profiel en CSROI impact hieronder</span>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-xl text-white">
                <h3 className="text-2xl font-bold mb-3">Klaar voor culturele samenwerking?</h3>
                <p className="text-blue-100 mb-4 leading-relaxed">
                  Ons bedrijfsprofiel toont waar we staan op het vlak van innovatie, samenwerking en organisatiecultuur. 
                  We zijn opzoek naar culturele partners die onze waarden delen en ons team kunnen inspireren.
                </p>
                <div className="flex items-center gap-2 text-blue-100">
                  <Link2 className="w-5 h-5" />
                  <span className="font-semibold">Ontdek matching mogelijkheden in het Matching tabblad</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Radar Chart with Background */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1765278624799-9c90305b0b7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBkYW5jZSUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3MTY1OTQ3MHww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/95 to-purple-50/95"></div>
        
        <Card className="relative bg-transparent border-0">
          <CardHeader className="relative">
            <CardTitle className="text-center text-3xl font-bold text-slate-900">
              Cultureel Profiel Overzicht
            </CardTitle>
          </CardHeader>
        <CardContent className="pt-8">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#cbd5e1" />
              <PolarAngleAxis
                dataKey="axis"
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b' }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
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
      </div>

      {/* Detailed Dimensions */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-900">Gedetailleerd overzicht</h2>
        {profile.dimensions.map((dimension) => {
          const colors = getColorScheme(dimension.id);
          return (
            <Card key={dimension.id} className={`shadow-lg border-2 ${colors.border}`}>
              <CardHeader className={`bg-gradient-to-r ${colors.bg}`}>
                <CardTitle className={`flex items-center gap-3 ${colors.text}`}>
                  {getIcon(dimension.id)}
                  {dimension.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {dimension.axes.map((axis) => {
                    // Find original responses if profit profile
                    const leaderAxis = profile.profitData?.leadershipResponses
                      .find(d => d.id === dimension.id)
                      ?.axes.find(a => a.id === axis.id);
                    const staffAxis = profile.profitData?.staffResponses
                      .find(d => d.id === dimension.id)
                      ?.axes.find(a => a.id === axis.id);

                    return (
                      <div key={axis.id} className="border-l-4 border-slate-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-slate-900">{axis.label}</h4>
                          <span className={`text-2xl font-bold ${colors.text}`}>
                            {axis.score}
                          </span>
                        </div>

                        {/* Show breakdown for profit profiles */}
                        {profile.organisationType === 'profit' && leaderAxis && staffAxis && (
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-blue-50 p-2 rounded border border-blue-200">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-blue-700 flex items-center gap-1">
                                  <UserCog className="w-3 h-3" />
                                  Leiding
                                </span>
                                <span className="text-sm font-bold text-blue-600">{leaderAxis.score}</span>
                              </div>
                            </div>
                            <div className="bg-indigo-50 p-2 rounded border border-indigo-200">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-indigo-700 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  Personeel
                                </span>
                                <span className="text-sm font-bold text-indigo-600">{staffAxis.score}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Score Bar */}
                        <div className="w-full h-3 bg-slate-200 rounded-full mb-3 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors.bg.replace('50', '400').replace('100', '600')} transition-all`}
                            style={{ width: `${axis.score}%` }}
                          ></div>
                        </div>

                        {axis.description && (
                          <p className="text-slate-700 mb-3 leading-relaxed">
                            {axis.description}
                          </p>
                        )}

                        {axis.identityWords.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {axis.identityWords.map((word, wordIndex) => (
                              <Badge
                                key={wordIndex}
                                className={`px-3 py-1 ${colors.badge}`}
                              >
                                {word}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
        <CardHeader>
          <CardTitle>Statistieken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg text-center border border-slate-200">
              <div className="text-3xl font-bold text-purple-600">
                {profile.dimensions.length}
              </div>
              <div className="text-sm text-slate-600">Dimensies</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center border border-slate-200">
              <div className="text-3xl font-bold text-blue-600">
                {profile.dimensions.reduce((sum, dim) => sum + dim.axes.length, 0)}
              </div>
              <div className="text-sm text-slate-600">Assen</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center border border-slate-200">
              <div className="text-3xl font-bold text-pink-600">
                {profile.identitySummary.toneOfVoice.length}
              </div>
              <div className="text-sm text-slate-600">Tone of Voice</div>
            </div>
            <div className="bg-white p-4 rounded-lg text-center border border-slate-200">
              <div className="text-3xl font-bold text-orange-600">
                {profile.identitySummary.visualKeywords.length}
              </div>
              <div className="text-sm text-slate-600">Visuele keywords</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEB Impact CRaFT Profile - Only for Cultural Organisations */}
      {profile.organisationType === 'cultural' && (
        <>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl mt-12 mb-8 p-8">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1765278624799-9c90305b0b7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBkYW5jZSUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3MTY1OTQ3MHww&ixlib=rb-4.1.0&q=80&w=1080')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-pink-900/90 to-orange-900/95 backdrop-blur-sm"></div>
            </div>
            
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-4 border border-white/30 shadow-xl">
                <Sparkles className="w-9 h-9 text-white drop-shadow-lg" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-2xl">NEB Impact CRaFT Analyse</h2>
              <p className="text-purple-100 text-lg drop-shadow-lg max-w-2xl mx-auto">
                Automatisch gegenereerde impact analyse op basis van uw organisatieprofiel met CRaFT, ESG en NEB frameworks
              </p>
            </div>
          </div>
          
          <CraftProfile 
            dimensions={profile.dimensions} 
            orgName={profile.meta.orgName || 'Uw Organisatie'}
          />
        </>
      )}
    </div>
  );
}
