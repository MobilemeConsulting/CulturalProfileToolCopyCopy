import { Card, CardContent } from './ui/card';
import { Building2, TrendingUp } from 'lucide-react';

interface OrganisationTypeSelectorProps {
  onSelect: (type: 'cultural' | 'profit') => void;
}

export function OrganisationTypeSelector({ onSelect }: OrganisationTypeSelectorProps) {
  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-base font-semibold text-purple-600">AHHA Matching Tool</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          Kies uw organisatietype
        </h2>
        <p className="text-lg text-slate-600">
          Start met het invullen van een nieuw profiel
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <button
          onClick={() => onSelect('cultural')}
          className="group relative overflow-hidden rounded-2xl"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1701318226666-6b5b02d3df4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBzY3VscHR1cmUlMjBtdXNldW18ZW58MXx8fHwxNzcxNjQ3NDcxfDA&ixlib=rb-4.1.0&q=80&w=1080')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/85 to-purple-900/90 group-hover:from-purple-800/95 group-hover:via-pink-800/90 group-hover:to-purple-800/95 transition-all duration-500"></div>
          
          <Card className="relative bg-transparent border-2 border-white/20 shadow-2xl group-hover:border-white/40 transition-all">
            <CardContent className="p-10">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/30">
                  <Building2 className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                  Culturele Organisatie
                </h3>
                <p className="text-purple-100 mb-6 text-base drop-shadow-md">
                  Voor theaters, concertzalen, musea, kunstcentra en andere culturele instellingen
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/40 shadow-lg">
                  Klik om te starten →
                </div>
              </div>
            </CardContent>
          </Card>
        </button>

        <button
          onClick={() => onSelect('profit')}
          className="group relative overflow-hidden rounded-2xl"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbm5vdmF0aW9uJTIwdGVjaG5vbG9neSUyMGZ1dHVyZSUyMGRpZ2l0YWx8ZW58MXx8fHwxNzcxNjg1MTQzfDA&ixlib=rb-4.1.0&q=80&w=1080')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-900/85 to-blue-900/90 group-hover:from-blue-800/95 group-hover:via-indigo-800/90 group-hover:to-blue-800/95 transition-all duration-500"></div>
          
          <Card className="relative bg-transparent border-2 border-white/20 shadow-2xl group-hover:border-white/40 transition-all">
            <CardContent className="p-10">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/30">
                  <TrendingUp className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                  Profit Bedrijf
                </h3>
                <p className="text-blue-100 mb-6 text-base drop-shadow-md">
                  Voor bedrijven, sponsors en commerciële organisaties die samenwerking zoeken
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/40 shadow-lg">
                  Klik om te starten →
                </div>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>
    </div>
  );
}
