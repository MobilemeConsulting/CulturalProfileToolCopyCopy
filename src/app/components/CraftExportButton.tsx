import { Download } from 'lucide-react';
import type { Dimension } from '../App';

interface CraftExportButtonProps {
  dimensions: Dimension[];
  orgName: string;
}

interface CraftScores {
  creativity: number;
  resilience: number;
  futures: number;
  transformation: number;
}

interface ESGScores {
  environmental: number;
  social: number;
  governance: number;
}

interface NEBScores {
  beautiful: number;
  sustainable: number;
  together: number;
}

export function CraftExportButton({ dimensions, orgName }: CraftExportButtonProps) {
  const calculateCraftScores = (): CraftScores => {
    const artistic = dimensions.find(d => d.id === 'artistic');
    const organisation = dimensions.find(d => d.id === 'organisation');
    const identity = dimensions.find(d => d.id === 'identity');

    return {
      creativity: artistic?.axes.find(a => a.id === 'experimental_vs_traditioneel')?.score || 50,
      resilience: organisation?.axes.find(a => a.id === 'pionier_vs_beheerder')?.score 
        ? 100 - (organisation.axes.find(a => a.id === 'pionier_vs_beheerder')?.score || 50)
        : 50,
      futures: identity?.axes.find(a => a.id === 'erfgoed_vs_future')?.score || 50,
      transformation: (
        ((organisation?.axes.find(a => a.id === 'activistisch_vs_neutraal')?.score || 50)) +
        ((identity?.axes.find(a => a.id === 'roots_vs_hybride')?.score || 50))
      ) / 2,
    };
  };

  const calculateESGScores = (): ESGScores => {
    const organisation = dimensions.find(d => d.id === 'organisation');
    const audience = dimensions.find(d => d.id === 'audience');
    const identity = dimensions.find(d => d.id === 'identity');

    return {
      environmental: (
        ((organisation?.axes.find(a => a.id === 'activistisch_vs_neutraal')?.score || 50)) +
        ((identity?.axes.find(a => a.id === 'erfgoed_vs_future')?.score || 50))
      ) / 2,
      social: (
        ((audience?.axes.find(a => a.id === 'participatief_vs_presentatie')?.score || 50)) +
        (100 - (audience?.axes.find(a => a.id === 'lokaal_vs_internationaal')?.score || 50))
      ) / 2,
      governance: organisation?.axes.find(a => a.id === 'pionier_vs_beheerder')?.score 
        ? 100 - (organisation.axes.find(a => a.id === 'pionier_vs_beheerder')?.score || 50)
        : 50,
    };
  };

  const calculateNEBScores = (): NEBScores => {
    const artistic = dimensions.find(d => d.id === 'artistic');
    const audience = dimensions.find(d => d.id === 'audience');
    const organisation = dimensions.find(d => d.id === 'organisation');
    const identity = dimensions.find(d => d.id === 'identity');

    return {
      beautiful: (
        ((artistic?.axes.find(a => a.id === 'experimental_vs_traditioneel')?.score || 50)) +
        ((artistic?.axes.find(a => a.id === 'niche_vs_breed')?.score || 50))
      ) / 2,
      sustainable: (
        ((organisation?.axes.find(a => a.id === 'activistisch_vs_neutraal')?.score || 50)) +
        (100 - (organisation?.axes.find(a => a.id === 'pionier_vs_beheerder')?.score || 50))
      ) / 2,
      together: (
        ((audience?.axes.find(a => a.id === 'participatief_vs_presentatie')?.score || 50)) +
        ((identity?.axes.find(a => a.id === 'roots_vs_hybride')?.score || 50))
      ) / 2,
    };
  };

  const handleExport = () => {
    const craftScores = calculateCraftScores();
    const esgScores = calculateESGScores();
    const nebScores = calculateNEBScores();

    const overallImpactScore = Math.round(
      (Object.values(craftScores).reduce((a, b) => a + b, 0) / 4 +
       Object.values(esgScores).reduce((a, b) => a + b, 0) / 3 +
       Object.values(nebScores).reduce((a, b) => a + b, 0) / 3) / 3
    );

    const exportData = {
      organisation: orgName,
      exportedBy: 'AHHA Vlaanderen - NEB Impact CRaFT Tool',
      exportedAt: new Date().toISOString(),
      version: '1.0',
      website: 'https://www.ahha.vlaanderen',
      overallImpactScore,
      craft: {
        creativity: Math.round(craftScores.creativity),
        resilience: Math.round(craftScores.resilience),
        futures: Math.round(craftScores.futures),
        transformation: Math.round(craftScores.transformation),
        average: Math.round(Object.values(craftScores).reduce((a, b) => a + b, 0) / 4),
      },
      esg: {
        environmental: Math.round(esgScores.environmental),
        social: Math.round(esgScores.social),
        governance: Math.round(esgScores.governance),
        average: Math.round(Object.values(esgScores).reduce((a, b) => a + b, 0) / 3),
      },
      neb: {
        beautiful: Math.round(nebScores.beautiful),
        sustainable: Math.round(nebScores.sustainable),
        together: Math.round(nebScores.together),
        average: Math.round(Object.values(nebScores).reduce((a, b) => a + b, 0) / 3),
      },
      rawDimensions: dimensions,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const filename = orgName
      ? `ahha-craft-${orgName.toLowerCase().replace(/\s+/g, '-')}.json`
      : 'ahha-craft-profiel.json';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-6 py-3 bg-white/30 backdrop-blur-md text-white rounded-xl hover:bg-white/40 transition-all shadow-xl hover:shadow-2xl border border-white/40 font-semibold"
    >
      <Download className="w-5 h-5" />
      <span>Export CRaFT</span>
    </button>
  );
}
