import {
  DomainEvaluationResult,
  DomainEvidenceItem,
  DashaContextItem,
} from '../types.js';
import { createEvidenceItem } from '../shared/evidence.js';
import { calculateDomainScoring } from '../shared/scoring.js';
import { detectEvidenceConflicts } from '../shared/conflict-detector.js';
import { calculateConfidence } from '../shared/confidence.js';
import { getHouseSAVPoints } from '../shared/ashtakavarga-helper.js';
import { getPlanetStrengthInfo } from '../shared/strength-helper.js';

export function evaluatePropertyDomain(engineData: any): DomainEvaluationResult {
  const evidenceItems: DomainEvidenceItem[] = [];
  const whyEvidence: string[] = [];

  const {
    astrology,
    analysis,
    strengthAnalysis,
    shadbala,
    ashtakavarga,
    yogaAnalysis,
    dasha,
  } = engineData;

  const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
  const weakDignities = ['DEBILITATED', 'ENEMY_SIGN', 'GREAT_ENEMY_SIGN'];

  // 1. 4th House & 4th Lord
  const h4LordFact = analysis?.houseLordFacts?.find((hl: any) => hl.house === 4);
  const h4Fact = analysis?.houseFacts?.find((h: any) => h.house === 4);

  if (h4LordFact) {
    if (strongDignities.includes(h4LordFact.dignity)) {
      const item = createEvidenceItem({
        id: 'PROP-D1-4TH-LORD-STRONG',
        domain: 'PROPERTY',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'PROP-001',
        description: `4th Lord of real estate & vehicle comforts (${h4LordFact.lord}) has strong ${h4LordFact.dignity} dignity.`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
        weight: 1.0,
        whyEvidence: [`4th Lord = ${h4LordFact.lord}`, `Dignity = ${h4LordFact.dignity}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else if (weakDignities.includes(h4LordFact.dignity)) {
      const item = createEvidenceItem({
        id: 'PROP-D1-4TH-LORD-WEAK',
        domain: 'PROPERTY',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'PROP-001',
        description: `4th Lord (${h4LordFact.lord}) is in ${h4LordFact.dignity} dignity, suggesting potential real estate or residence challenges.`,
        direction: 'CHALLENGING',
        strength: 'MEDIUM',
        weight: 0.85,
        whyEvidence: [`4th Lord = ${h4LordFact.lord}`, `Dignity = ${h4LordFact.dignity}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else {
      const item = createEvidenceItem({
        id: 'PROP-D1-4TH-LORD-STABLE',
        domain: 'PROPERTY',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'PROP-001',
        description: `4th Lord (${h4LordFact.lord}) holds stable ${h4LordFact.dignity || 'NEUTRAL'} dignity, supporting residential and fixed-asset foundations.`,
        direction: 'SUPPORTIVE',
        strength: 'MEDIUM',
        weight: 0.7,
        whyEvidence: [`4th Lord = ${h4LordFact.lord}`, `Dignity = ${h4LordFact.dignity || 'NEUTRAL'}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }

    // 4th Lord Placement
    if ([1, 4, 5, 7, 9, 10, 2, 11].includes(h4LordFact.lordHouse)) {
      const item = createEvidenceItem({
        id: 'PROP-D1-4TH-LORD-PLACEMENT-AUSPICIOUS',
        domain: 'PROPERTY',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'PROP-002',
        description: `4th Lord (${h4LordFact.lord}) is placed in House ${h4LordFact.lordHouse}, supporting acquisition of property and domestic comforts.`,
        direction: 'SUPPORTIVE',
        strength: 'MEDIUM',
        weight: 0.8,
        whyEvidence: [`4th Lord = ${h4LordFact.lord}`, `Placed in House ${h4LordFact.lordHouse}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else if ([6, 8, 12].includes(h4LordFact.lordHouse)) {
      const item = createEvidenceItem({
        id: 'PROP-D1-4TH-LORD-PLACEMENT-DUSTHANA',
        domain: 'PROPERTY',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'PROP-002',
        description: `4th Lord (${h4LordFact.lord}) is placed in Dusthana House ${h4LordFact.lordHouse}, indicating potential residence relocations or property maintenance vigilance.`,
        direction: 'CHALLENGING',
        strength: 'MEDIUM',
        weight: 0.75,
        whyEvidence: [`4th Lord = ${h4LordFact.lord}`, `Placed in House ${h4LordFact.lordHouse}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }
  }

  // 2. Mars Bhoomikaraka (Land & Property Significator)
  const marsInfo = getPlanetStrengthInfo('Mars', engineData);

  if (marsInfo.isStrong) {
    const item = createEvidenceItem({
      id: 'PROP-MARS-SHADBALA-STRONG',
      domain: 'PROPERTY',
      sourceEngine: 'shadbala-engine',
      sourceRuleId: 'SHADBALA-MARS',
      description: `Mars (Bhoomikaraka / significator of land & real estate) possesses strong strength.`,
      direction: 'SUPPORTIVE',
      strength: 'HIGH',
      weight: 0.95,
      whyEvidence: [`Mars Strength = ${marsInfo.overallStrength || (marsInfo.ratio !== undefined ? `Ratio ${marsInfo.ratio.toFixed(2)}` : 'Strong')}`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  } else if (marsInfo.isWeak) {
    const item = createEvidenceItem({
      id: 'PROP-MARS-SHADBALA-CHALLENGING',
      domain: 'PROPERTY',
      sourceEngine: 'shadbala-engine',
      sourceRuleId: 'SHADBALA-MARS-MODERATE',
      description: `Mars (Bhoomikaraka) operates with sensitive dignity (${marsInfo.dignity}) or lower strength, advising legal diligence in land dealings.`,
      direction: 'CHALLENGING',
      strength: 'MEDIUM',
      weight: 0.75,
      whyEvidence: [`Mars Dignity = ${marsInfo.dignity}`, `Overall Strength = ${marsInfo.overallStrength || 'Below Average'}`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  }

  if (marsInfo.house && [1, 4, 5, 7, 9, 10].includes(marsInfo.house)) {
    const item = createEvidenceItem({
      id: 'PROP-MARS-KENDRA-TRIKONA',
      domain: 'PROPERTY',
      sourceEngine: 'astrology-core',
      sourceRuleId: 'MARS-PLACEMENT',
      description: `Mars is placed in active House ${marsInfo.house}, providing drive and initiative for asset and land ownership.`,
      direction: 'SUPPORTIVE',
      strength: 'MEDIUM',
      weight: 0.75,
      whyEvidence: [`Mars House Placement = House ${marsInfo.house}`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  }

  // 3. 4th House Ashtakavarga SAV Points
  const sav4 = getHouseSAVPoints(ashtakavarga, analysis, 4);
  if (sav4 !== undefined) {
    if (sav4 >= 30) {
      const item = createEvidenceItem({
        id: 'PROP-ASHTAKAVARGA-4TH-HIGH',
        domain: 'PROPERTY',
        sourceEngine: 'ashtakavarga-engine',
        sourceRuleId: 'SAV-4TH',
        description: `4th House of property & home holds strong Ashtakavarga SAV score (${sav4} points).`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
        weight: 0.9,
        whyEvidence: [`4th House SAV = ${sav4} points (Benchmark average: 28)`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else if (sav4 < 25) {
      const item = createEvidenceItem({
        id: 'PROP-ASHTAKAVARGA-4TH-LOW',
        domain: 'PROPERTY',
        sourceEngine: 'ashtakavarga-engine',
        sourceRuleId: 'SAV-4TH',
        description: `4th House holds below-average Ashtakavarga SAV score (${sav4} points), indicating potential domestic restlessness.`,
        direction: 'CHALLENGING',
        strength: 'MEDIUM',
        weight: 0.75,
        whyEvidence: [`4th House SAV = ${sav4} points (Benchmark average: 28)`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else {
      const item = createEvidenceItem({
        id: 'PROP-ASHTAKAVARGA-4TH-BASELINE',
        domain: 'PROPERTY',
        sourceEngine: 'ashtakavarga-engine',
        sourceRuleId: 'SAV-4TH',
        description: `4th House holds steady baseline Ashtakavarga SAV score (${sav4} points).`,
        direction: 'SUPPORTIVE',
        strength: 'LOW',
        weight: 0.6,
        whyEvidence: [`4th House SAV = ${sav4} points (Benchmark average: 28)`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }
  }

  // 4. 4th House Occupants
  if (h4Fact?.planets?.length) {
    const benefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
    const hasBenefic = h4Fact.planets.some((p: string) => benefics.includes(p));
    const item = createEvidenceItem({
      id: 'PROP-4TH-HOUSE-OCCUPANTS',
      domain: 'PROPERTY',
      sourceEngine: 'astrology-core',
      sourceRuleId: 'PROP-003',
      description: `Planets in 4th House (${h4Fact.planets.join(', ')}) influence domestic atmosphere and residential stability.`,
      direction: hasBenefic ? 'SUPPORTIVE' : 'NEUTRAL',
      strength: 'MEDIUM',
      weight: 0.7,
      whyEvidence: [`4th House Occupants = ${h4Fact.planets.join(', ')}`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  }

  // 5. Ruchaka Yoga & Property Yogas
  if (yogaAnalysis?.yogas) {
    const propYogas = yogaAnalysis.yogas.filter((y: any) => ['Ruchaka Yoga'].includes(y.name));
    for (const y of propYogas) {
      const item = createEvidenceItem({
        id: `PROP-YOGA-${y.name.toUpperCase().replace(/\s+/g, '-')}`,
        domain: 'PROPERTY',
        sourceEngine: 'yoga-engine',
        sourceRuleId: y.name,
        description: `Classical ${y.name} (Pancha Mahapurusha Yoga of Mars) is present, indicating property ownership and land acquisition potential.`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
        weight: 1.0,
        whyEvidence: [`Yoga = ${y.name}`, `Category = ${y.category}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }
  }

  const dashaContextItems: DashaContextItem[] = [];
  const currentMD = dasha?.current?.mahadasha;
  if (currentMD) {
    dashaContextItems.push({
      periodType: 'CURRENT_MAHADASHA',
      mahadashaLord: currentMD.lord,
      domainRelevance: 'PROPERTY_THEME_ACTIVATION',
      nonPredictiveExplanation: `Current ${currentMD.lord} Mahadasha provides contextual activation for fixed assets, residence, and property.`,
    });
  }

  const supportingFactors = evidenceItems.filter((i) => i.direction === 'SUPPORTIVE');
  const challengingFactors = evidenceItems.filter((i) => i.direction === 'CHALLENGING');
  const neutralFactors = evidenceItems.filter((i) => i.direction === 'NEUTRAL');

  const scoring = calculateDomainScoring(evidenceItems);
  const conflicts = detectEvidenceConflicts(supportingFactors, challengingFactors);
  const confidence = calculateConfidence(evidenceItems, [
    'astrology-core',
    'shadbala-engine',
    'yoga-engine',
    'dasha-engine',
  ]);

  return {
    domain: 'PROPERTY',
    title: 'Property & Real Estate',
    summary: `Property evaluation shows ${scoring.state.replace(/_/g, ' ')} indicators based on 4th house, Mars Bhoomikaraka strength, and fixed asset yogas.`,
    state: scoring.state,
    scoring,
    confidence,
    supportingFactors,
    challengingFactors,
    neutralFactors,
    mixedSignals: conflicts,
    relevantPlanetaryIndicators: [
      {
        planet: 'Mars',
        role: 'Bhoomikaraka & Real Estate Karaka',
        sign: marsInfo.sign,
        house: marsInfo.house,
        dignity: marsInfo.dignity,
        strengthScore: marsInfo.score,
        shadbalaRatio: marsInfo.ratio || 1.0,
      },
    ],
    relevantHouses: [
      {
        house: 4,
        sign: h4Fact?.sign?.name || 'N/A',
        lord: h4LordFact?.lord || 'N/A',
        lordDignity: h4LordFact?.dignity || 'N/A',
        occupants: h4Fact?.planets || [],
      },
    ],
    relevantYogas: [],
    divisionalEvidence: [],
    dashaContext: dashaContextItems,
    transitContext: [],
    whyEvidence,
  };
}
