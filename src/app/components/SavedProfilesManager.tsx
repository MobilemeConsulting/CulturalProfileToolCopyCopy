import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, TrendingUp, Trash2, Eye, Calendar } from 'lucide-react';
import type { Profile } from '../App';

interface SavedProfilesManagerProps {
  profiles: Profile[];
  onLoad: (profile: Profile) => void;
  onDelete: (id: string) => void;
}

export function SavedProfilesManager({ profiles, onLoad, onDelete }: SavedProfilesManagerProps) {
  const userProfiles = profiles.filter(p => !p.id.startsWith('demo-'));

  const culturalProfiles = userProfiles.filter(p => p.organisationType === 'cultural');
  const profitProfiles = userProfiles.filter(p => p.organisationType === 'profit');

  return (
    <div className="space-y-8">
      {/* User Profiles Section */}
      {userProfiles.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="text-slate-400 mb-4">
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nog geen opgeslagen profielen</p>
              <p className="text-sm">Start met het maken van een nieuw profiel hierboven, of probeer een demo!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {culturalProfiles.length > 0 && (
            <Card className="shadow-lg border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  Mijn Culturele Organisaties ({culturalProfiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {culturalProfiles.map((profile) => (
                    <Card key={profile.id} className="border border-purple-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 mb-1">
                              {profile.meta.orgName || 'Naamloos profiel'}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {profile.meta.orgType || 'Geen type'}
                            </p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">
                            Cultureel
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                          <Calendar className="w-3 h-3" />
                          {new Date(profile.updatedAt).toLocaleDateString('nl-NL')}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onLoad(profile)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            Laden
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Weet je zeker dat je dit profiel wilt verwijderen?')) {
                                onDelete(profile.id);
                              }
                            }}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {profitProfiles.length > 0 && (
            <Card className="shadow-lg border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Mijn Profit Bedrijven ({profitProfiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profitProfiles.map((profile) => (
                    <Card key={profile.id} className="border border-blue-200 hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 mb-1">
                              {profile.meta.orgName || 'Naamloos profiel'}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {profile.meta.orgType || 'Geen type'}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            Profit
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                          <Calendar className="w-3 h-3" />
                          {new Date(profile.updatedAt).toLocaleDateString('nl-NL')}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onLoad(profile)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            Laden
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Weet je zeker dat je dit profiel wilt verwijderen?')) {
                                onDelete(profile.id);
                              }
                            }}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
