import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Loader2, Building2, TrendingUp, Palette, Users, Briefcase, Heart, MessageSquare, Eye, ArrowLeft } from 'lucide-react';
import { OrganisationProfile } from '../data/types';
import { getProfile } from '../services/supabaseService';
import { Badge } from './ui/badge';

export function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<OrganisationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    getProfile(id).then((p) => {
      if (p) {
        setProfile(p);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
          <p className="text-slate-600">Profiel laden...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Profiel niet gevonden</h1>
          <p className="text-slate-600">
            Dit profiel bestaat niet of is niet meer beschikbaar.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar de tool
          </Link>
        </div>
      </div>
    );
  }

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
        return { bg: 'from-purple-50 to-purple-100', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800', bar: 'from-purple-400 to-purple-600', border: 'border-purple-200' };
      case 'audience':
        return { bg: 'from-blue-50 to-blue-100', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800', bar: 'from-blue-400 to-blue-600', border: 'border-blue-200' };
      case 'organisation':
        return { bg: 'from-pink-50 to-pink-100', text: 'text-pink-700', badge: 'bg-pink-100 text-pink-800', bar: 'from-pink-400 to-pink-600', border: 'border-pink-200' };
      case 'identity':
        return { bg: 'from-orange-50 to-orange-100', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800', bar: 'from-orange-400 to-orange-600', border: 'border-orange-200' };
      default:
        return { bg: 'from-slate-50 to-slate-100', text: 'text-slate-700', badge: 'bg-slate-100 text-slate-800', bar: 'from-slate-400 to-slate-600', border: 'border-slate-200' };
    }
  };

  const isCultural = profile.organisationType === 'cultural';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-slate-900">AHHA Cultureel Profiel</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div className={`absolute inset-0 ${isCultural ? 'bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900' : 'bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900'}`}></div>
          <div className="relative p-8 sm:p-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                {isCultural ? (
                  <Building2 className="w-8 h-8 text-white" />
                ) : (
                  <TrendingUp className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {profile.meta.orgName || 'Organisatie'}
                </h1>
                <p className="text-white/80 text-lg">
                  {profile.meta.orgType || (isCultural ? 'Culturele organisatie' : 'Bedrijf')} · {profile.meta.year}
                  {profile.meta.industry && ` · ${profile.meta.industry}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tone of Voice & Visual Keywords */}
        {(profile.identitySummary.toneOfVoice.length > 0 || profile.identitySummary.visualKeywords.length > 0) && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {profile.identitySummary.toneOfVoice.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    Tone of Voice
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.identitySummary.toneOfVoice.map((tone, i) => (
                      <Badge key={i} className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-900 border border-orange-200">
                        {tone}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.identitySummary.visualKeywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-pink-600" />
                    Visuele kernwoorden
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.identitySummary.visualKeywords.map((kw, i) => (
                      <Badge key={i} className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-900 border border-pink-200">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dimensions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Dimensies & Scores</h2>
          {profile.dimensions.map((dimension) => {
            const colors = getColorScheme(dimension.id);
            return (
              <div key={dimension.id} className={`bg-white rounded-xl border-2 ${colors.border} shadow-sm overflow-hidden`}>
                <div className={`bg-gradient-to-r ${colors.bg} px-6 py-4`}>
                  <h3 className={`text-lg font-semibold ${colors.text} flex items-center gap-2`}>
                    {getIcon(dimension.id)}
                    {dimension.label}
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  {dimension.axes.map((axis) => (
                    <div key={axis.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-slate-900 text-sm">{axis.label}</h4>
                        <span className={`text-xl font-bold ${colors.text}`}>{axis.score}</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all`}
                          style={{ width: `${axis.score}%` }}
                        ></div>
                      </div>
                      {axis.description && (
                        <p className="text-sm text-slate-600">{axis.description}</p>
                      )}
                      {axis.identityWords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {axis.identityWords.map((word, wi) => (
                            <Badge key={wi} className={`px-2 py-0.5 text-xs ${colors.badge}`}>
                              {word}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 pt-8 pb-4 text-center space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar de tool
          </Link>
          <p className="text-xs text-slate-400">
            AHHA Cultureel Profiel Tool · {new Date().getFullYear()}
          </p>
        </div>
      </main>
    </div>
  );
}
