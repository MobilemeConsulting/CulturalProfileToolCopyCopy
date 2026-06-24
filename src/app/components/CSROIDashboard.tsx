import { Card, CardContent } from './ui/card';
import { Dimension } from '../App';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Award, Target, Copy, CheckCircle2 } from 'lucide-react';
import { 
  computeCSROIScores, 
  calculateOverallCSROI, 
  categorizeScore, 
  generateBaselineText,
  getTopAndBottomDimensions 
} from '../utils/csroiCalculations';
import { CSROIScores } from '../types/csroi';
import { useState } from 'react';

interface CSROIDashboardProps {
  dimensions: Dimension[];
  orgName: string;
  crossoverFocus?: string;
}

export function CSROIDashboard({ dimensions, orgName, crossoverFocus }: CSROIDashboardProps) {
  const [copied, setCopied] = useState(false);
  
  // Calculate CSROI scores
  const csroiScores = computeCSROIScores(dimensions);
  const overallScore = calculateOverallCSROI(csroiScores);
  const { top, bottom } = getTopAndBottomDimensions(csroiScores);
  const baselineText = generateBaselineText(csroiScores, overallScore, orgName, crossoverFocus);

  // Prepare radar chart data
  const radarData = (Object.keys(csroiScores) as Array<keyof CSROIScores>).map(dimension => ({
    dimension: dimension.replace(' & ', ' &\n'), // Line break for readability
    score: csroiScores[dimension],
    fullMark: 5
  }));

  // Copy baseline to clipboard
  const copyBaseline = async () => {
    try {
      await navigator.clipboard.writeText(baselineText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Overall Score */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1768026058295-caf3636c61ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwY29udGVtcG9yYXJ5JTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc3MTY4NTE0MXww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-cyan-900/90 to-blue-900/95 backdrop-blur-sm"></div>
        </div>
        
        <Card className="relative bg-transparent border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-white drop-shadow-lg" />
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg">CSROI Dashboard</h2>
                </div>
                <p className="text-blue-100 text-lg drop-shadow-md">
                  Cultural and Social Return on Investment voor {orgName}
                </p>
              </div>
              <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/30 shadow-xl">
                <div className="text-5xl font-bold text-white drop-shadow-lg">{overallScore}</div>
                <div className="text-sm text-blue-100 mt-1">CSROI Index (0-5)</div>
                <div className="text-xs text-blue-200 mt-1">{categorizeScore(overallScore)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Tiles */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Overall Category */}
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20"></div>
          <Card className="relative bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Overall Niveau</h3>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{overallScore} / 5</div>
              <div className="text-sm text-slate-600">{categorizeScore(overallScore)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Strong Dimensions */}
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20"></div>
          <Card className="relative bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Sterke Dimensies</h3>
              </div>
              <div className="space-y-2">
                {top.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="font-semibold text-slate-900">{item.dimension}</div>
                    <div className="text-green-600">{item.score.toFixed(2)} / 5</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Opportunities */}
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20"></div>
          <Card className="relative bg-white/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Groeikansen</h3>
              </div>
              <div className="space-y-2">
                {bottom.map((item, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="font-semibold text-slate-900">{item.dimension}</div>
                    <div className="text-orange-600">{item.score.toFixed(2)} / 5</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Radar Chart & Detailed Scores */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1631295161934-ec6c829d282a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBwZW9wbGUlMjB0b2dldGhlciUyMGRpdmVyc2l0eXxlbnwxfHx8fDE3NzE1OTk4MDd8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-blue-50/90 to-slate-50/95"></div>
          
          <Card className="relative bg-transparent border-0">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">CSROI Dimensies</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      tick={{ fill: '#94a3b8' }}
                      tickCount={6}
                    />
                    <Radar
                      name="CSROI Score"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Scores */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1763630730215-d97346f23065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGFydGlzdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzE2MTU5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-purple-50/90 to-slate-50/95"></div>
          
          <Card className="relative bg-transparent border-0">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Gedetailleerde Scores</h3>
              <div className="space-y-4">
                {(Object.keys(csroiScores) as Array<keyof CSROIScores>).map((dimension) => {
                  const score = csroiScores[dimension];
                  const category = categorizeScore(score);
                  const colorClass = 
                    category === 'Sterk' ? 'bg-green-500' :
                    category === 'In opbouw' ? 'bg-yellow-500' :
                    'bg-orange-500';
                  
                  return (
                    <div key={dimension} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-slate-900 text-sm">{dimension}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-900">{score.toFixed(2)}</span>
                          <span className={`text-xs px-2 py-1 rounded-full text-white ${colorClass}`}>
                            {category}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full ${colorClass} transition-all duration-500`}
                          style={{ width: `${(score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Baseline Text */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590968802291-f1e1f86cde34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjBtdXJhbCUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MTY4NTE0MXww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 to-slate-100/95"></div>
        
        <Card className="relative bg-transparent border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">📝 Baseline CSROI Profiel</h3>
              <button
                onClick={copyBaseline}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium shadow-md"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Gekopieerd!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Kopieer voor rapport
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-blue-200 shadow-sm">
              <p className="text-slate-800 leading-relaxed">
                {baselineText}
              </p>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              💡 Deze baseline-tekst kan direct gebruikt worden in Canva, rapporten of presentaties
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
