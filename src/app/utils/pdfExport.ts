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
  const { toneOfVoice, visualKeywords } = profile.identitySummary;

  if (toneOfVoice.length > 0) {
    const toneLines = doc.splitTextToSize(`Tone of voice: ${toneOfVoice.join(', ')}`, PAGE_RIGHT - MARGIN_LEFT);
    toneLines.forEach((textLine: string) => {
      ensureSpace(LINE_HEIGHT);
      doc.text(textLine, MARGIN_LEFT, y);
      y += LINE_HEIGHT;
    });
  }

  if (visualKeywords.length > 0) {
    const visualLines = doc.splitTextToSize(`Visuele kernwoorden: ${visualKeywords.join(', ')}`, PAGE_RIGHT - MARGIN_LEFT);
    visualLines.forEach((textLine: string) => {
      ensureSpace(LINE_HEIGHT);
      doc.text(textLine, MARGIN_LEFT, y);
      y += LINE_HEIGHT;
    });
  }

  if (toneOfVoice.length === 0 && visualKeywords.length === 0) {
    ensureSpace(LINE_HEIGHT);
    doc.text('Niet verzameld via de vragenlijst.', MARGIN_LEFT, y);
    y += LINE_HEIGHT;
  }

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

/* ── Kleuren ── */
const COLOR_PURPLE: [number, number, number] = [124, 58, 237]; // #7c3aed — cultureel
const COLOR_BLUE: [number, number, number] = [37, 99, 235];    // #2563eb — profit
const COLOR_GREEN: [number, number, number] = [22, 163, 74];   // #16a34a — hoge match
const COLOR_AMBER: [number, number, number] = [217, 119, 6];   // #d97706 — matige match
const COLOR_RED: [number, number, number] = [220, 38, 38];     // #dc2626 — lage match
const COLOR_GRAY_LIGHT: [number, number, number] = [229, 231, 235];
const COLOR_GRAY_TEXT: [number, number, number] = [107, 114, 128];
const COLOR_DARK: [number, number, number] = [31, 41, 55];
const COLOR_WHITE: [number, number, number] = [255, 255, 255];

function matchColor(score: number): [number, number, number] {
  if (score >= 80) return COLOR_GREEN;
  if (score >= 60) return COLOR_AMBER;
  return COLOR_RED;
}

function matchLabel(score: number): string {
  if (score >= 80) return 'Uitstekende match';
  if (score >= 60) return 'Goede match';
  if (score >= 40) return 'Matige match';
  return 'Lage match';
}

function matchSummary(
  score: number,
  culturalName: string,
  profitName: string,
): string {
  const rounded = Math.round(score);
  if (score >= 80)
    return `${culturalName} en ${profitName} vertonen een uitstekende culturele aansluiting (${rounded}%). De CSROI-dimensies liggen dicht bij elkaar, wat wijst op sterk gedeelde waarden en een groot potentieel voor een impactvolle samenwerking.`;
  if (score >= 60)
    return `${culturalName} en ${profitName} hebben een goede culturele match (${rounded}%). Er is voldoende overlap in de CSROI-dimensies om een waardevolle samenwerking op te bouwen, met ruimte voor complementaire versterking op specifieke dimensies.`;
  if (score >= 40)
    return `${culturalName} en ${profitName} tonen een matige culturele match (${rounded}%). Enkele dimensies sluiten goed aan, maar er zijn ook duidelijke verschillen. Een samenwerking is mogelijk mits gerichte afstemming op de afwijkende dimensies.`;
  return `${culturalName} en ${profitName} hebben een lage culturele match (${rounded}%). De CSROI-profielen lopen sterk uiteen. Een samenwerking vereist aanzienlijke inspanning om de culturele kloof te overbruggen.`;
}

function dimensionInsight(dim: DimensionMatch): string {
  const diff = Math.abs(dim.culturalScore - dim.profitScore);
  if (diff <= 1)
    return 'Nagenoeg identieke scores — sterke basis voor samenwerking op deze dimensie.';
  if (dim.matchScore >= 80)
    return 'Goede aansluiting: beide organisaties scoren vergelijkbaar.';
  if (dim.matchScore >= 60)
    return 'Redelijke overlap, met ruimte voor wederzijds leren.';
  if (dim.culturalScore > dim.profitScore)
    return 'De culturele organisatie scoort hoger; het profitbedrijf kan hier groeien.';
  return 'Het profitbedrijf scoort hoger; de culturele organisatie kan hier inspireren.';
}

function formatDate(): string {
  return new Date().toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Teken een afgeronde rechthoek (jsPDF heeft geen ingebouwde roundedRect).
 */
function roundedRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  style: 'S' | 'F' | 'FD' = 'F',
): void {
  // Kap de radius af als hij groter is dan de helft van de afmeting
  const rx = Math.min(r, w / 2);
  const ry = Math.min(r, h / 2);
  doc.roundedRect(x, y, w, h, rx, ry, style);
}

/**
 * Voeg footer toe aan de huidige pagina.
 */
function drawFooter(doc: jsPDF, pageNum: number, totalPages: number): void {
  const footerY = 290;
  doc.setDrawColor(...COLOR_GRAY_LIGHT);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT, footerY - 4, PAGE_RIGHT, footerY - 4);

  doc.setFontSize(8);
  doc.setTextColor(...COLOR_GRAY_TEXT);
  doc.text('Gegenereerd door AHHA Cultural Matching Tool', MARGIN_LEFT, footerY);
  doc.text(formatDate(), 105, footerY, { align: 'center' });
  doc.text(`${pageNum} / ${totalPages}`, PAGE_RIGHT, footerY, { align: 'right' });
}

/**
 * Genereer en download een professioneel PDF-matchrapport tussen een culturele
 * organisatie en een profit-bedrijf, met de totale match en een visueel
 * overzicht per CSROI-dimensie.
 */
export function exportMatchReportToPdf(args: MatchReportArgs): void {
  const { culturalName, profitName, overall, dimensionMatches } = args;
  const doc = new jsPDF();
  const pageWidth = 210;
  const contentWidth = PAGE_RIGHT - MARGIN_LEFT;
  let y = 0;
  let currentPage = 1;

  // We zullen na afloop footers toevoegen (totalPages moet bekend zijn).
  const pages: number[] = [1];

  const ensureSpace = (needed: number): void => {
    if (y + needed > PAGE_BOTTOM) {
      doc.addPage();
      currentPage++;
      pages.push(currentPage);
      y = MARGIN_TOP;
    }
  };

  // ─── HEADER SECTION ───────────────────────────────────────────────────────────

  // Paarse balk bovenaan
  doc.setFillColor(...COLOR_PURPLE);
  doc.rect(0, 0, pageWidth, 58, 'F');

  // AHHA branding
  doc.setTextColor(...COLOR_WHITE);
  doc.setFontSize(10);
  doc.text('AHHA VLAANDEREN', MARGIN_LEFT, 16);

  // Titel
  doc.setFontSize(28);
  doc.text('Matchrapport', MARGIN_LEFT, 32);

  // Subtitel
  doc.setFontSize(13);
  const subtitle = `${culturalName}  \u2194  ${profitName}`;
  const subtitleLines = doc.splitTextToSize(subtitle, contentWidth);
  doc.text(subtitleLines, MARGIN_LEFT, 42);

  // Datum rechts
  doc.setFontSize(9);
  doc.text(formatDate(), PAGE_RIGHT, 16, { align: 'right' });

  y = 70;

  // ─── OVERALL MATCH SCORE ──────────────────────────────────────────────────────

  const scoreRound = Math.round(overall);
  const scoreColor = matchColor(overall);
  const label = matchLabel(overall);

  // Score cirkel (visueel: grote gekleurde ronde achtergrond met percentage)
  const circleCenterX = 105;
  const circleR = 22;
  doc.setFillColor(...scoreColor);
  doc.circle(circleCenterX, y + circleR, circleR, 'F');

  doc.setTextColor(...COLOR_WHITE);
  doc.setFontSize(32);
  doc.text(`${scoreRound}%`, circleCenterX, y + circleR + 4, { align: 'center' });

  doc.setFontSize(10);
  doc.text('totale match', circleCenterX, y + circleR + 12, { align: 'center' });

  // Label onder de cirkel
  y += circleR * 2 + 18;
  doc.setTextColor(...scoreColor);
  doc.setFontSize(14);
  doc.text(label, circleCenterX, y, { align: 'center' });

  y += 10;

  // ─── EXECUTIVE SUMMARY ────────────────────────────────────────────────────────

  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(12);
  doc.text('Samenvatting', MARGIN_LEFT, y);
  y += 2;

  // Dunne lijn onder kop
  doc.setDrawColor(...COLOR_PURPLE);
  doc.setLineWidth(0.6);
  doc.line(MARGIN_LEFT, y, MARGIN_LEFT + 30, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(...COLOR_GRAY_TEXT);
  const summaryText = matchSummary(overall, culturalName, profitName);
  const summaryLines: string[] = doc.splitTextToSize(summaryText, contentWidth);
  summaryLines.forEach((line: string) => {
    ensureSpace(5);
    doc.text(line, MARGIN_LEFT, y);
    y += 5;
  });

  y += 8;

  // ─── LEGENDA ──────────────────────────────────────────────────────────────────

  ensureSpace(12);
  doc.setFontSize(8);

  // Cultureel legendablokje
  doc.setFillColor(...COLOR_PURPLE);
  roundedRect(doc, MARGIN_LEFT, y - 3, 4, 4, 1, 'F');
  doc.setTextColor(...COLOR_GRAY_TEXT);
  doc.text(`Cultureel (${culturalName})`, MARGIN_LEFT + 6, y);

  // Profit legendablokje
  doc.setFillColor(...COLOR_BLUE);
  roundedRect(doc, MARGIN_LEFT + 75, y - 3, 4, 4, 1, 'F');
  doc.text(`Profit (${profitName})`, MARGIN_LEFT + 81, y);

  y += 10;

  // ─── PER-DIMENSION BREAKDOWN ──────────────────────────────────────────────────

  doc.setTextColor(...COLOR_DARK);
  doc.setFontSize(12);
  doc.text('CSROI-dimensies', MARGIN_LEFT, y);
  y += 2;
  doc.setDrawColor(...COLOR_PURPLE);
  doc.setLineWidth(0.6);
  doc.line(MARGIN_LEFT, y, MARGIN_LEFT + 30, y);
  y += 8;

  const barMaxWidth = 90;
  const barHeight = 5;
  const barX = 65; // waar de balk begint

  dimensionMatches.forEach((dim) => {
    const blockHeight = 42;
    ensureSpace(blockHeight);

    const dimMatch = Math.round(dim.matchScore);
    const dimColor = matchColor(dim.matchScore);

    // Dimensienaam + match badge
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_DARK);
    doc.text(dim.dimension, MARGIN_LEFT, y);

    // Match-badge rechts
    doc.setFillColor(...dimColor);
    const badgeText = `${dimMatch}%`;
    const badgeW = 16;
    const badgeX = PAGE_RIGHT - badgeW;
    roundedRect(doc, badgeX, y - 4, badgeW, 6, 2, 'F');
    doc.setFontSize(9);
    doc.setTextColor(...COLOR_WHITE);
    doc.text(badgeText, badgeX + badgeW / 2, y, { align: 'center' });

    y += 6;

    // Culturele score-balk
    const cScore = Math.round(dim.culturalScore);
    const cWidth = (cScore / 5) * barMaxWidth;
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_GRAY_TEXT);
    doc.text('Cultureel', MARGIN_LEFT, y + 3.5);
    // Achtergrond balk
    doc.setFillColor(...COLOR_GRAY_LIGHT);
    roundedRect(doc, barX, y, barMaxWidth, barHeight, 1.5, 'F');
    // Gevulde balk
    if (cWidth > 0) {
      doc.setFillColor(...COLOR_PURPLE);
      roundedRect(doc, barX, y, Math.max(cWidth, 3), barHeight, 1.5, 'F');
    }
    // Score label
    doc.setTextColor(...COLOR_DARK);
    doc.text(`${cScore}/5`, barX + barMaxWidth + 3, y + 3.5);

    y += barHeight + 2;

    // Profit score-balk
    const pScore = Math.round(dim.profitScore);
    const pWidth = (pScore / 5) * barMaxWidth;
    doc.setTextColor(...COLOR_GRAY_TEXT);
    doc.text('Profit', MARGIN_LEFT, y + 3.5);
    doc.setFillColor(...COLOR_GRAY_LIGHT);
    roundedRect(doc, barX, y, barMaxWidth, barHeight, 1.5, 'F');
    if (pWidth > 0) {
      doc.setFillColor(...COLOR_BLUE);
      roundedRect(doc, barX, y, Math.max(pWidth, 3), barHeight, 1.5, 'F');
    }
    doc.setTextColor(...COLOR_DARK);
    doc.text(`${pScore}/5`, barX + barMaxWidth + 3, y + 3.5);

    y += barHeight + 3;

    // Inzicht per dimensie
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_GRAY_TEXT);
    const insight = dimensionInsight(dim);
    doc.text(insight, MARGIN_LEFT, y);

    y += 10;
  });

  // ─── FOOTERS ──────────────────────────────────────────────────────────────────

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(doc, p, totalPages);
  }

  // ─── SAVE ─────────────────────────────────────────────────────────────────────

  const filename = `match-${sanitizeFilename(culturalName)}-${sanitizeFilename(
    profitName,
  )}.pdf`;
  doc.save(filename);
}
