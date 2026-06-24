import { jsPDF } from 'jspdf';
import type { OrganisationProfile } from '../data/types';

/** Verwijder/normaliseer tekens die problemen geven in bestandsnamen. */
function sanitizeFilename(value: string): string {
  return value.replace(/[\s/\\]+/g, '-');
}

/** Pagina-layout constanten (in mm, A4 staand). */
const MARGIN_LEFT = 20;
const MARGIN_TOP = 20;
const LINE_HEIGHT = 7;
const PAGE_BOTTOM = 280;
const PAGE_RIGHT = 190;

/**
 * Genereer en download een PDF met het volledige organisatieprofiel:
 * titel, dimensies met assen/scores en een identiteits-sectie.
 */
export function exportProfileToPdf(profile: OrganisationProfile): void {
  const doc = new jsPDF();
  let y = MARGIN_TOP;

  const ensureSpace = (needed: number): void => {
    if (y + needed > PAGE_BOTTOM) {
      doc.addPage();
      y = MARGIN_TOP;
    }
  };

  // Titel
  doc.setFontSize(20);
  doc.text(profile.meta.orgName || 'Profiel', MARGIN_LEFT, y);
  y += LINE_HEIGHT + 3;

  // Subtitel met orgType, jaar en organisatietype
  const organisationLabel =
    profile.organisationType === 'cultural'
      ? 'Culturele organisatie'
      : 'Profit bedrijf';
  doc.setFontSize(12);
  doc.text(
    `${profile.meta.orgType} · ${profile.meta.year} · ${organisationLabel}`,
    MARGIN_LEFT,
    y,
  );
  y += LINE_HEIGHT + 4;

  // Dimensies
  profile.dimensions.forEach((dimension) => {
    ensureSpace(LINE_HEIGHT + 2);
    doc.setFontSize(15);
    doc.text(dimension.label, MARGIN_LEFT, y);
    y += LINE_HEIGHT + 1;

    doc.setFontSize(11);
    dimension.axes.forEach((axis) => {
      ensureSpace(LINE_HEIGHT);
      const scoreText = `${axis.score}/100`;
      // Bereken een rij met stippellijn tussen label en score.
      const labelWidth = doc.getTextWidth(axis.label);
      const scoreWidth = doc.getTextWidth(scoreText);
      const available = PAGE_RIGHT - MARGIN_LEFT - labelWidth - scoreWidth;
      const dotWidth = doc.getTextWidth('.');
      const dotCount =
        dotWidth > 0 ? Math.max(0, Math.floor(available / dotWidth)) : 0;
      const dots = '.'.repeat(dotCount);
      const line = `${axis.label} ${dots} ${scoreText}`;
      doc.text(line, MARGIN_LEFT, y);
      y += LINE_HEIGHT;
    });

    y += 3;
  });

  // Identiteit-sectie
  ensureSpace(LINE_HEIGHT * 3);
  doc.setFontSize(15);
  doc.text('Identiteit', MARGIN_LEFT, y);
  y += LINE_HEIGHT + 1;

  doc.setFontSize(11);
  const toneText = `Tone of voice: ${profile.identitySummary.toneOfVoice.join(', ')}`;
  const visualText = `Visuele kernwoorden: ${profile.identitySummary.visualKeywords.join(', ')}`;

  const toneLines = doc.splitTextToSize(toneText, PAGE_RIGHT - MARGIN_LEFT);
  toneLines.forEach((textLine: string) => {
    ensureSpace(LINE_HEIGHT);
    doc.text(textLine, MARGIN_LEFT, y);
    y += LINE_HEIGHT;
  });

  const visualLines = doc.splitTextToSize(visualText, PAGE_RIGHT - MARGIN_LEFT);
  visualLines.forEach((textLine: string) => {
    ensureSpace(LINE_HEIGHT);
    doc.text(textLine, MARGIN_LEFT, y);
    y += LINE_HEIGHT;
  });

  const filename = `${sanitizeFilename(profile.meta.orgName || 'profiel')}-profiel.pdf`;
  doc.save(filename);
}

interface DimensionMatch {
  dimension: string;
  culturalScore: number;
  profitScore: number;
  matchScore: number;
}

interface MatchReportArgs {
  culturalName: string;
  profitName: string;
  overall: number;
  dimensionMatches: DimensionMatch[];
}

/**
 * Genereer en download een PDF-matchrapport tussen een culturele organisatie
 * en een profit-bedrijf, met de totale match en een overzicht per dimensie.
 */
export function exportMatchReportToPdf(args: MatchReportArgs): void {
  const { culturalName, profitName, overall, dimensionMatches } = args;
  const doc = new jsPDF();
  let y = MARGIN_TOP;

  const ensureSpace = (needed: number): void => {
    if (y + needed > PAGE_BOTTOM) {
      doc.addPage();
      y = MARGIN_TOP;
    }
  };

  // Titel
  doc.setFontSize(20);
  doc.text('Matchrapport', MARGIN_LEFT, y);
  y += LINE_HEIGHT + 3;

  doc.setFontSize(13);
  doc.text(`${culturalName} ↔ ${profitName}`, MARGIN_LEFT, y);
  y += LINE_HEIGHT + 4;

  // Totale match (groot)
  doc.setFontSize(18);
  doc.text(`Totale match: ${Math.round(overall)}%`, MARGIN_LEFT, y);
  y += LINE_HEIGHT + 5;

  // Overzicht per dimensie
  doc.setFontSize(11);
  dimensionMatches.forEach((match) => {
    const line = `${match.dimension}: cultureel ${Math.round(
      match.culturalScore,
    )} / profit ${Math.round(match.profitScore)} → match ${Math.round(
      match.matchScore,
    )}%`;
    const wrapped = doc.splitTextToSize(line, PAGE_RIGHT - MARGIN_LEFT);
    wrapped.forEach((textLine: string) => {
      ensureSpace(LINE_HEIGHT);
      doc.text(textLine, MARGIN_LEFT, y);
      y += LINE_HEIGHT;
    });
  });

  const filename = `match-${sanitizeFilename(culturalName)}-${sanitizeFilename(
    profitName,
  )}.pdf`;
  doc.save(filename);
}
