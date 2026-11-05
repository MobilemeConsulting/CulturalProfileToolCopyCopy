import { Card, CardContent } from './ui/card';
import { Dimension } from '../App';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Leaf, Users, Shield, Lightbulb, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { CraftExportButton } from './CraftExportButton';
import { 
  calculateCraftScores, 
  calculateESGScores, 
  calculateNEBScores,
  calculateOverallImpactScore,
  getFrameworkAverages,
  type CraftScores,
  type ESGScores,
  type NEBScores
} from '../utils/craftCalculations';

interface CraftProfileProps {
  dimensions: Dimension[];
  orgName: string;
}

export function CraftProfile({ dimensions, orgName }: CraftProfileProps) {
  // Calculate all scores using utility functions
  const craftScores = calculateCraftScores(dimensions);
  const esgScores = calculateESGScores(dimensions);
  const nebScores = calculateNEBScores(dimensions);

  // Prepare data for CRaFT radar chart
  const craftRadarData = [
    { dimension: 'Creativity', score: Math.round(craftScores.creativity), fullMark: 100 },
    { dimension: 'Resilience', score: Math.round(craftScores.resilience), fullMark: 100 },
    { dimension: 'Futures', score: Math.round(craftScores.futures), fullMark: 100 },
    { dimension: 'Transformation', score: Math.round(craftScores.transformation), fullMark: 100 },
  ];

  // Prepare data for ESG radar chart
  const esgRadarData = [
    { dimension: 'Environmental', score: Math.round(esgScores.environmental), fullMark: 100 },
    { dimension: 'Social', score: Math.round(esgScores.social), fullMark: 100 },
    { dimension: 'Governance', score: Math.round(esgScores.governance), fullMark: 100 },
  ];

  // Prepare data for NEB radar chart
  const nebRadarData = [
    { dimension: 'Beautiful', score: Math.round(nebScores.beautiful), fullMark: 100 },
    { dimension: 'Sustainable', score: Math.round(nebScores.sustainable), fullMark: 100 },
    { dimension: 'Together', score: Math.round(nebScores.together), fullMark: 100 },
  ];

  // Calculate overall impact score using utility function
  const overallImpactScore = calculateOverallImpactScore(craftScores, esgScores, nebScores);
  
  // Get framework averages
  const frameworkAverages = getFrameworkAverages(craftScores, esgScores, nebScores);

  return (
    <div className="space-y-6">
      {/* Header with Export and Background */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1768026058295-caf3636c61ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwY29udGVtcG9yYXJ5JTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc3MTY4NTE0MXww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-pink-900/90 to-purple-900/95 backdrop-blur-sm"></div>
        </div>
        
        <Card className="relative bg-transparent border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg">NEB Impact CRaFT Profiel</h2>
                </div>
                <p className="text-purple-100 text-lg drop-shadow-md">
                  Volledige impact analyse voor {orgName}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center bg-white/20 backdrop-blur-md rounded-2xl px-8 py-5 border border-white/30 shadow-xl">
                  <div className="text-5xl font-bold text-white drop-shadow-lg">{overallImpactScore}</div>
                  <div className="text-sm text-purple-100 mt-1">Totale impactscore</div>
                </div>
                <div className="print:hidden">
                  <CraftExportButton dimensions={dimensions} orgName={orgName} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CRaFT Scores with Background */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1763630730215-d97346f23065?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGFydGlzdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzE2MTU5MDh8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-cyan-50/90 to-blue-50/95"></div>
        
        <Card className="relative bg-transparent border-0">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">CRaFT Dimensies</h3>
                <p className="text-sm text-slate-600">Creativity, Resilience, Futures, Transformation</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* CRaFT Radar Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={craftRadarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <Radar
                      name="CRaFT Score"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* CRaFT Scores List */}
              <div className="space-y-4">
                <ScoreItem
                  label="Creativity"
                  score={craftScores.creativity}
                  icon={<Lightbulb className="w-5 h-5" />}
                  color="blue"
                  description="Innovatiekracht en creatieve experimenten"
                />
                <ScoreItem
                  label="Resilience"
                  score={craftScores.resilience}
                  icon={<Shield className="w-5 h-5" />}
                  color="green"
                  description="Veerkracht en organisatorische stabiliteit"
                />
                <ScoreItem
                  label="Futures"
                  score={craftScores.futures}
                  icon={<TrendingUp className="w-5 h-5" />}
                  color="purple"
                  description="Toekomstvisie en strategische richting"
                />
                <ScoreItem
                  label="Transformation"
                  score={craftScores.transformation}
                  icon={<Zap className="w-5 h-5" />}
                  color="orange"
                  description="Transformatievermogen en aanpassingskracht"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESG Scores with Background */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1631295161934-ec6c829d282a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBwZW9wbGUlMjB0b2dldGhlciUyMGRpdmVyc2l0eXxlbnwxfHx8fDE3NzE1OTk4MDd8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/95 via-emerald-50/90 to-green-50/95"></div>
        
        <Card className="relative bg-transparent border-0">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">ESG Impact</h3>
                <p className="text-sm text-slate-600">Environmental, Social, Governance</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* ESG Radar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={esgRadarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <Radar
                      name="ESG Score"
                      dataKey="score"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* ESG Scores List */}
              <div className="space-y-4">
                <ScoreItem
                  label="Environmental"
                  score={esgScores.environmental}
                  icon={<Leaf className="w-5 h-5" />}
                  color="green"
                  description="Milieubewustzijn en duurzaamheid"
                />
                <ScoreItem
                  label="Social"
                  score={esgScores.social}
                  icon={<Users className="w-5 h-5" />}
                  color="blue"
                  description="Sociale impact en gemeenschapsbetrokkenheid"
                />
                <ScoreItem
                  label="Governance"
                  score={esgScores.governance}
                  icon={<Shield className="w-5 h-5" />}
                  color="purple"
                  description="Organisatiestructuur en transparantie"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NEB Scores with Background */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590968802291-f1e1f86cde34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjBtdXJhbCUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MTY4NTE0MXww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/95 via-pink-50/90 to-purple-50/95"></div>
        
        <Card className="relative bg-transparent border-0">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">New European Bauhaus</h3>
                <p className="text-sm text-slate-600">Beautiful, Sustainable, Together</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* NEB Radar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={nebRadarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8' }} />
                    <Radar
                      name="NEB Score"
                      dataKey="score"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* NEB Scores List */}
              <div className="space-y-4">
                <ScoreItem
                  label="Beautiful"
                  score={nebScores.beautiful}
                  icon={<Sparkles className="w-5 h-5" />}
                  color="pink"
                  description="Esthetische kwaliteit en culturele waarde"
                />
                <ScoreItem
                  label="Sustainable"
                  score={nebScores.sustainable}
                  icon={<Leaf className="w-5 h-5" />}
                  color="green"
                  description="Duurzame praktijken en langetermijnvisie"
                />
                <ScoreItem
                  label="Together"
                  score={nebScores.together}
                  icon={<Users className="w-5 h-5" />}
                  color="blue"
                  description="Inclusiviteit en gemeenschapsvorming"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card with Background */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1672841821756-fc04525771c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBmZXN0aXZhbCUyMGNyb3dkfGVufDF8fHx8MTc3MTYxMDM0OHww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 to-slate-100/95"></div>
        
        <Card className="relative bg-transparent border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Impact Samenvatting</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {frameworkAverages.craft}
                </div>
                <div className="text-sm text-slate-600">CRaFT Gemiddelde</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {frameworkAverages.esg}
                </div>
                <div className="text-sm text-slate-600">ESG Gemiddelde</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {frameworkAverages.neb}
                </div>
                <div className="text-sm text-slate-600">NEB Gemiddelde</div>
              </div>
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Hoe werkt NEB Impact CRaFT?
              </h4>
              <p className="text-blue-800 mb-2">
                Dit profiel wordt automatisch gegenereerd op basis van de ingevulde organisatiedata en combineert drie frameworks:
              </p>
              <ul className="text-blue-800 space-y-1 ml-4">
                <li><strong>CRaFT</strong>: Creativity, Resilience, Futures, Transformation</li>
                <li><strong>ESG</strong>: Environmental, Social, Governance impact</li>
                <li><strong>NEB</strong>: New European Bauhaus (Beautiful, Sustainable, Together)</li>
              </ul>
              <p className="text-blue-800 mt-2">
                De Totale impactscore combineert alle dimensies tot één holistische beoordeling van uw culturele impact.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface ScoreItemProps {
  label: string;
  score: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  description: string;
}

function ScoreItem({ label, score, icon, color, description }: ScoreItemProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  const progressColorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{label}</div>
            <div className="text-xs text-slate-500">{description}</div>
          </div>
        </div>
        <div className="text-lg font-bold text-slate-900">{Math.round(score)}</div>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${progressColorClasses[color]} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
