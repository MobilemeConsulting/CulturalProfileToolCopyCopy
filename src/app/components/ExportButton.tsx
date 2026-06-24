import { Download } from 'lucide-react';
import type { Profile } from '../App';

interface ExportButtonProps {
  profile: Profile | null;
}

export function ExportButton({ profile }: ExportButtonProps) {
  const handleExport = () => {
    if (!profile) return;
    
    // Add AHHA metadata to export
    const exportData = {
      ...profile,
      exportedBy: 'AHHA Vlaanderen - Profiel Matching Tool',
      exportedAt: new Date().toISOString(),
      version: '1.0',
      website: 'https://www.ahha.vlaanderen'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const prefix = profile.organisationType === 'cultural' ? 'cultureel' : 'profit';
    const filename = profile.meta.orgName
      ? `ahha-${profile.meta.orgName.toLowerCase().replace(/\s+/g, '-')}-${prefix}-profiel.json`
      : `ahha-${prefix}-profiel.json`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!profile}
      className={`flex items-center gap-2 px-6 py-3 transition-all font-medium ${
        profile
          ? 'border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-white cursor-pointer'
          : 'border-2 border-white/20 text-white/40 cursor-not-allowed'
      }`}
    >
      <Download className="w-5 h-5" />
      <span>Exporteren</span>
    </button>
  );
}
