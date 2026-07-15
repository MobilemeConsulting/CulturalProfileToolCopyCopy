import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { FileEdit, Eye, BarChart3, Info, Sparkles, Upload, Download, ExternalLink, TrendingUp, Users as UsersIcon } from 'lucide-react';
import { ExportButton } from './components/ExportButton';
// PasswordProtection & MatchingView bewust behouden voor eventuele re-activatie.
// import { PasswordProtection } from './components/PasswordProtection';
import { CSROIDashboard } from './components/CSROIDashboard';
import { OrganisationProfile } from './data/types';
import { migrateAllProfiles } from './utils/migrateProfiles';
import {
  isConfigured,
  getAllProfiles,
  saveProfile,
  deleteProfile as deleteProfileRemote,
  syncProfiles
} from './services/supabaseService';
import { exportProfileToPdf } from './utils/pdfExport';
import { ProfileOutput } from './components/ProfileOutput';
// import { MatchingView } from './components/MatchingView';
import { ProfileCreationWizard } from './components/ProfileCreationWizard';
import { SavedProfilesManager } from './components/SavedProfilesManager';
import { AhhaHeader } from './components/AhhaHeader';

export interface Axis {
  id: string;
  label: string;
  score: number;
  description: string;
  identityWords: string[];
}

export interface Dimension {
  id: string;
  label: string;
  axes: Axis[];
}

export interface ProfitProfileData {
  leadershipResponses: Dimension[];
  staffResponses: Dimension[];
  combinedDimensions: Dimension[];
}

export interface Profile {
  id: string;
  organisationType: 'cultural' | 'profit';
  meta: {
    orgName: string;
    orgType: string;
    year: number;
    crossoverFocus?: 'hr' | 'leiderschap' | 'innovatie' | 'reputatie' | 'gemeenschap';
  };
  dimensions: Dimension[];
  identitySummary: {
    toneOfVoice: string[];
    visualKeywords: string[];
  };
  profitData?: ProfitProfileData;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'cultural-profiles';

// const MATCHING_PASSWORD_KEY = 'matching-access-granted';

export default function App() {
  const [profiles, setProfiles] = useState<OrganisationProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<OrganisationProfile | null>(null);
  const [activeTab, setActiveTab] = useState('select');
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  // const [matchingUnlocked, setMatchingUnlocked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Matching unlock check verwijderd — matching nu via /admin

  // Load profiles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfiles(parsed);
        
        // Don't auto-sync on load - only sync when user explicitly saves/uploads
        // This prevents errors when Google Sheets is not properly configured
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
    }
  }, []);

  // Save profiles to localStorage
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }
  }, [profiles]);

  const handleProfileCreated = (profile: OrganisationProfile) => {
    setProfiles((prev) => {
      const existingIndex = prev.findIndex(p => p.id === profile.id);
      let updatedProfiles: OrganisationProfile[];
      
      if (existingIndex >= 0) {
        updatedProfiles = [...prev];
        updatedProfiles[existingIndex] = profile;
      } else {
        updatedProfiles = [...prev, profile];
      }
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));
      
      // Probeer ook naar Supabase te saven (silent fail)
      if (isConfigured()) {
        saveProfile(profile)
          .then((success) => {
            if (success) {
              console.log('✅ Profile saved to Supabase');
            } else {
              console.log('💾 Profile saved to localStorage only (Supabase sync failed)');
            }
          })
          .catch((error) => {
            console.log('💾 Profile saved to localStorage only (Supabase error)');
          });
      } else {
        console.log('💾 Profile saved to localStorage (Supabase not configured)');
      }
      
      return updatedProfiles;
    });
    setCurrentProfile(profile);
    setShowCreationWizard(false);
    setActiveTab('view');
  };

  const handleProfileImported = (profile: OrganisationProfile) => {
    setProfiles((prev) => {
      const filtered = prev.filter(p => p.id !== profile.id);
      return [...filtered, profile];
    });
    setCurrentProfile(profile);
    setShowCreationWizard(false);
    setActiveTab('view');
  };

  // Matching-tab verwijderd uit publieke tool — nu alleen via /admin.
  // Onderstaande code bewust als commentaar voor eventuele re-activatie:
  // const handleMatchingUnlock = () => {
  //   setMatchingUnlocked(true);
  //   sessionStorage.setItem(MATCHING_PASSWORD_KEY, 'true');
  //   toast.success('Toegang verleend!', {
  //     description: 'Je hebt nu toegang tot de matching functionaliteit',
  //   });
  // };

  const loadProfile = (profile: OrganisationProfile) => {
    setCurrentProfile(profile);
    setActiveTab('view');
  };

  const deleteProfile = (id: string) => {
    setProfiles((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      // Expliciet wegschrijven: de save-effect slaat alleen op bij length > 0,
      // dus bij het verwijderen van het laatste profiel moet dit hier gebeuren.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    if (currentProfile?.id === id) {
      setCurrentProfile(null);
      setActiveTab('select');
    }
    // Ook uit Supabase verwijderen (best-effort; faalt stil bij geen config).
    if (isConfigured()) {
      deleteProfileRemote(id).catch(() => {});
    }
    toast.success('Profiel verwijderd');
  };


  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const json = JSON.parse(content);
        
        if (json.id && json.organisationType && json.meta && json.dimensions) {
          setProfiles((prev) => {
            const filtered = prev.filter(p => p.id !== json.id);
            return [...filtered, json];
          });
          setCurrentProfile(json);
          toast.success('Profiel geïmporteerd!', {
            description: `${json.meta.orgName} profiel succesvol geladen`,
          });
          setShowCreationWizard(false);
          setActiveTab('view');
        } else {
          toast.error('Ongeldig bestand', {
            description: 'Het bestand bevat geen geldig profiel',
          });
        }
      } catch (error) {
        toast.error('Fout bij importeren', {
          description: 'Kon het bestand niet lezen. Controleer het formaat.',
        });
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      
      {/* AHHA Header */}
      <AhhaHeader />
      
      {/* Hero Section - AHHA Style met donkere achtergrond */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=1600')] bg-cover bg-center"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              AHHA overbrugt de kloof tussen<br className="hidden sm:inline" /> cultuur en bedrijven
            </h1>
            <p className="text-base sm:text-xl text-gray-300 font-light max-w-3xl mx-auto">
              Match culturele organisaties met profit bedrijven op basis van gedeelde waarden en doelstellingen
            </p>
          </div>
          
          <div className="flex gap-4 justify-center flex-wrap items-center mt-12">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white hover:bg-white/10 transition-all"
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Profiel Importeren</span>
            </button>
            <ExportButton profile={currentProfile} />
            <button
              onClick={() => currentProfile && exportProfileToPdf(currentProfile)}
              disabled={!currentProfile}
              className="flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">PDF Export</span>
            </button>
          </div>
        </div>
        
        {/* Teal accent bar */}
        <div className="h-2 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Conditionally show either wizard or tabs */}
        {showCreationWizard ? (
          <ProfileCreationWizard
            onProfileCreated={handleProfileCreated}
            onImport={handleProfileImported}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="select" className="flex items-center gap-2">
                <FileEdit className="w-4 h-4" />
                Start
              </TabsTrigger>
              <TabsTrigger value="view" className="flex items-center gap-2" disabled={!currentProfile}>
                <Eye className="w-4 h-4" />
                Overzicht
              </TabsTrigger>
            </TabsList>

            <TabsContent value="select">
              <div className="space-y-8">
                <div className="text-center">
                  <button
                    onClick={() => setShowCreationWizard(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                  >
                    + Nieuw Profiel Aanmaken
                  </button>
                </div>
                
                <SavedProfilesManager
                  profiles={profiles}
                  onLoad={loadProfile}
                  onDelete={deleteProfile}
                />
              </div>
            </TabsContent>

          <TabsContent value="view">
            {currentProfile && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Overzicht
                  </TabsTrigger>
                  <TabsTrigger value="csroi" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    CSROI
                  </TabsTrigger>
                  <TabsTrigger value="pitch" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Culturele Pitch
                  </TabsTrigger>
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Intake Details
                  </TabsTrigger>
                  <TabsTrigger value="responses" className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" />
                    Responses
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <ProfileOutput profile={currentProfile} />
                </TabsContent>

                <TabsContent value="csroi">
                  <CSROIDashboard 
                    dimensions={currentProfile.dimensions}
                    orgName={currentProfile.meta.orgName}
                    crossoverFocus={currentProfile.meta.crossoverFocus}
                  />
                </TabsContent>

                <TabsContent value="pitch">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 border-2 border-purple-300">
                      <h3 className="text-2xl font-bold text-purple-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        Culturele Identiteit
                      </h3>
                      <p className="text-purple-800">
                        Deze identiteitswoorden en visuele keywords zijn gebaseerd op uw scores en kunnen gebruikt worden voor branding en communicatie.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg p-6 shadow-lg border border-purple-200">
                        <h4 className="font-bold text-lg text-slate-900 mb-4">Tone of Voice</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentProfile.identitySummary.toneOfVoice.map((tone, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                              {tone}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 shadow-lg border border-pink-200">
                        <h4 className="font-bold text-lg text-slate-900 mb-4">Visuele Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentProfile.identitySummary.visualKeywords.map((keyword, idx) => (
                            <span key={idx} className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {currentProfile.dimensions.map(dimension => (
                        <div key={dimension.id} className="bg-white rounded-lg p-6 shadow-md border border-slate-200">
                          <h4 className="font-bold text-lg text-slate-900 mb-4">{dimension.label}</h4>
                          <div className="space-y-3">
                            {dimension.axes.map(axis => (
                              <div key={axis.id}>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium text-slate-700">{axis.label}</span>
                                  <span className="text-sm text-slate-600">{axis.score}/100</span>
                                </div>
                                {axis.identityWords.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {axis.identityWords.map((word, idx) => (
                                      <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                        {word}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="bg-white rounded-lg p-8 shadow-lg border border-slate-200">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Organisatie Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Organisatienaam</label>
                        <div className="text-lg text-slate-900">{currentProfile.meta.orgName || '-'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Organisatietype</label>
                        <div className="text-lg text-slate-900">{currentProfile.meta.orgType || '-'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Jaar</label>
                        <div className="text-lg text-slate-900">{currentProfile.meta.year}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type Organisatie</label>
                        <div className="text-lg text-slate-900 capitalize">
                          {currentProfile.organisationType === 'cultural' ? 'Culturele Organisatie' : 'Profit Bedrijf'}
                        </div>
                      </div>
                      {currentProfile.meta.crossoverFocus && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Crossover Focus</label>
                          <div className="text-lg text-slate-900 capitalize">{currentProfile.meta.crossoverFocus}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="responses">
                  {currentProfile.organisationType === 'profit' && currentProfile.profitData ? (
                    <div className="space-y-6">
                      <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                        <h3 className="text-xl font-bold text-blue-900 mb-2">Bedrijfsprofiel Weging</h3>
                        <p className="text-blue-800">
                          Dit profiel combineert antwoorden van bedrijfsleiding (60%) en personeel (40%)
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                          <h4 className="font-bold text-lg text-slate-900 mb-4">Management Responses</h4>
                          <p className="text-slate-600">60% weging in gecombineerd profiel</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-lg border border-slate-200">
                          <h4 className="font-bold text-lg text-slate-900 mb-4">Employee Responses</h4>
                          <p className="text-slate-600">40% weging in gecombineerd profiel</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                      <UsersIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Geen Response Data</h3>
                      <p className="text-slate-600">
                        Deze functionaliteit is alleen beschikbaar voor profit organisaties met employee responses.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>

            {/* Matching-tab verwijderd — beschikbaar via /admin dashboard */}
          </Tabs>
        )}
      </div>

      {/* Footer with Art Background */}
      <footer className="relative overflow-hidden mt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590968802291-f1e1f86cde34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjBtdXJhbCUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MTY4NTE0MXww&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-pink-900/95 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* About AHHA */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-lg">Over AHHA</h3>
              <p className="text-sm text-purple-100 leading-relaxed">
                AHHA Vlaanderen (Arts Heritage & Humanities Alliance) verbindt kunst, 
                erfgoed en geesteswetenschappen met bedrijven en maatschappij.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-lg">Contact</h3>
              <ul className="text-sm text-purple-100 space-y-2">
                <li>
                  <a 
                    href="https://www.ahha.vlaanderen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-2 group"
                  >
                    <span>www.ahha.vlaanderen</span>
                    <ExternalLink className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>Vlaanderen</li>
              </ul>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-lg">Platform</h3>
              <p className="text-sm text-purple-100 leading-relaxed">
                Deze matching tool helpt culturele organisaties en bedrijven 
                elkaar te vinden voor samenwerkingen en sponsoring.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/20 text-center">
            <p className="text-purple-100 text-sm">
              © {new Date().getFullYear()} AHHA Vlaanderen • Profiel Matching Tool
            </p>
            <p className="text-purple-200 text-xs mt-2">
              Met NEB Impact CRaFT technologie
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}