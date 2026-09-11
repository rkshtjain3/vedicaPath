import {
  DomainEvaluationResult,
  DomainEvidenceItem,
  DashaContextItem,
  TransitContextItem,
} from '../types.js';
import { createEvidenceItem } from '../shared/evidence.js';
import { calculateDomainScoring } from '../shared/scoring.js';
import { detectEvidenceConflicts } from '../shared/conflict-detector.js';
import { calculateConfidence } from '../shared/confidence.js';
import { getPlanetStrengthInfo } from '../shared/strength-helper.js';

export function evaluateRelationshipsDomain(engineData: any): DomainEvaluationResult {
  const evidenceItems: DomainEvidenceItem[] = [];
  const whyEvidence: string[] = [];

  const {
    astrology,
    analysis,
    divisionalCharts,
    strengthAnalysis,
    shadbala,
    yogaAnalysis,
    dasha,
    timing,
  } = engineData;

  // 1. 7th House & 7th Lord
  const h7LordFact = analysis?.houseLordFacts?.find((hl: any) => hl.house === 7);
  const h7Fact = analysis?.houseFacts?.find((h: any) => h.house === 7);

  if (h7LordFact) {
    const isStrong = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'].includes(h7LordFact.dignity);
    const isWeak = ['DEBILITATED', 'ENEMY_SIGN', 'GREAT_ENEMY_SIGN'].includes(h7LordFact.dignity);

    if (isStrong) {
      const item = createEvidenceItem({
        id: 'RELATIONSHIPS-D1-7TH-LORD-STRONG',
        domain: 'RELATIONSHIPS',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'REL-001',
        description: `7th Lord ${h7LordFact.lord} holds strong ${h7LordFact.dignity} dignity, supporting partnership harmony and stability.`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
        weight: 1.0,
        whyEvidence: [`7th Lord = ${h7LordFact.lord}`, `Dignity = ${h7LordFact.dignity}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else if (isWeak) {
      const item = createEvidenceItem({
        id: 'RELATIONSHIPS-D1-7TH-LORD-WEAK',
        domain: 'RELATIONSHIPS',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'REL-001',
        description: `7th Lord ${h7LordFact.lord} is in ${h7LordFact.dignity} dignity, creating potential partnership friction or delays.`,
        direction: 'CHALLENGING',
        strength: 'MEDIUM',
        weight: 0.8,
        whyEvidence: [`7th Lord = ${h7LordFact.lord}`, `Dignity = ${h7LordFact.dignity}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else {
      const item = createEvidenceItem({
        id: 'RELATIONSHIPS-D1-7TH-LORD-STABLE',
        domain: 'RELATIONSHIPS',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'REL-001',
        description: `7th Lord ${h7LordFact.lord} holds stable ${h7LordFact.dignity || 'NEUTRAL'} dignity, providing steady relational baseline.`,
        direction: 'SUPPORTIVE',
        strength: 'MEDIUM',
        weight: 0.7,
        whyEvidence: [`7th Lord = ${h7LordFact.lord}`, `Dignity = ${h7LordFact.dignity || 'NEUTRAL'}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }

    if ([1, 4, 5, 7, 9, 10, 2, 11].includes(h7LordFact.lordHouse)) {
      const item = createEvidenceItem({
        id: 'RELATIONSHIPS-D1-7TH-LORD-PLACEMENT',
        domain: 'RELATIONSHIPS',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'REL-002',
        description: `7th Lord (${h7LordFact.lord}) is placed in House ${h7LordFact.lordHouse}, reinforcing relational continuity.`,
        direction: 'SUPPORTIVE',
        strength: 'MEDIUM',
        weight: 0.75,
        whyEvidence: [`7th Lord = ${h7LordFact.lord}`, `Placed in House ${h7LordFact.lordHouse}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }
  }

  // 2. Venus Kalatrakaraka
  const venusInfo = getPlanetStrengthInfo('Venus', engineData);
  if (venusInfo.isStrong) {
    const item = createEvidenceItem({
      id: 'RELATIONSHIPS-VENUS-SHADBALA-STRONG',
      domain: 'RELATIONSHIPS',
      sourceEngine: 'shadbala-engine',
      sourceRuleId: 'SHADBALA-VENUS',
      description: `Venus (Kalatrakaraka / significator of relationships) possesses strong planetary strength.`,
      direction: 'SUPPORTIVE',
      strength: 'HIGH',
      weight: 0.95,
      whyEvidence: [`Venus Strength = ${venusInfo.overallStrength || (venusInfo.ratio !== undefined ? `Ratio ${venusInfo.ratio.toFixed(2)}` : 'Strong')}`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  }

  // 3. D9 Navamsha Chart Evidence
  const d9Analysis = divisionalCharts?.d9Analysis;
  const d9Chart = divisionalCharts?.d9 || divisionalCharts?.d9Chart;
  const ascSign = d9Analysis?.ascendantSign || d9Analysis?.ascendant?.sign?.name || d9Chart?.ascendant?.sign?.name;
  const ascLord = d9Analysis?.ascendantLord || d9Analysis?.ascendant?.sign?.ruler || d9Chart?.ascendant?.sign?.ruler;

  if (ascSign) {
    const item = createEvidenceItem({
      id: 'RELATIONSHIPS-D9-NAVAMSHA-LAGNA',
      domain: 'RELATIONSHIPS',
      sourceEngine: 'divisional-chart-engine',
      sourceRuleId: 'D9-ANALYSIS',
      description: `D9 Navamsha Lagna is in ${ascSign} (Lord: ${ascLord || 'N/A'}), confirming relational inner disposition.`,
      direction: 'SUPPORTIVE',
      strength: 'MEDIUM',
      weight: 0.8,
      whyEvidence: [`D9 Ascendant Sign = ${ascSign}`, `D9 Lord = ${ascLord || 'N/A'}`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  }

  // 4. Dasha Context (Non-predictive timing)
  const dashaContextItems: DashaContextItem[] = [];
  const currentMD = dasha?.current?.mahadasha;
  const currentAD = dasha?.current?.antardasha;

  if (currentMD) {
    const mdLord = currentMD.lord;
    const isConn7 = h7LordFact?.lord === mdLord || h7Fact?.planets?.includes(mdLord) || mdLord === 'Venus';

    dashaContextItems.push({
      periodType: 'CURRENT_MAHADASHA',
      mahadashaLord: mdLord,
      antardashaLord: currentAD?.lord,
      domainRelevance: isConn7 ? 'DIRECT_7TH_HOUSE_OR_VENUS_CONNECTION' : 'GENERAL_RELATIONSHIP_CONTEXT',
      nonPredictiveExplanation: `Current ${mdLord} Mahadasha activates relational themes. (Note: This engine evaluates contextual activation; no guaranteed event or marriage timing is predicted).`,
    });
  }

  // 5. Transit Context
  const transitContextItems: TransitContextItem[] = [];
  const jupiterTransit = timing?.transits?.planets?.find((p: any) => p.planet === 'Jupiter');

  if (jupiterTransit) {
    transitContextItems.push({
      planet: 'Jupiter',
      currentSign: jupiterTransit.currentSign?.name || 'Current Sign',
      transitedHouseFromLagna: jupiterTransit.houseFromLagna,
      transitedHouseFromMoon: jupiterTransit.houseFromMoon || 1,
      bavPoints: jupiterTransit.bavPoints || 4,
      savPoints: jupiterTransit.savPoints || 28,
      classification: [7, 1, 3, 11].includes(jupiterTransit.houseFromLagna) ? 'SUPPORTIVE' : 'NEUTRAL',
      nonPredictiveExplanation: `Jupiter transits House ${jupiterTransit.houseFromLagna} relative to Lagna, creating supportive relational context.`,
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
    'divisional-chart-engine',
    'dasha-engine',
    'timing-engine',
  ]);

  return {
    domain: 'RELATIONSHIPS',
    title: 'Relationships & Partnerships',
    summary: `Relationship analysis displays ${scoring.state.replace(/_/g, ' ')} status based on 7th house, Venus dignity, and D9 Navamsha structure.`,
    state: scoring.state,
    scoring,
    confidence,
    supportingFactors,
    challengingFactors,
    neutralFactors,
    mixedSignals: conflicts,
    relevantPlanetaryIndicators: [
      {
        planet: 'Venus',
        role: 'Kalatrakaraka & Relationship Significator',
        sign: venusInfo.sign,
        house: venusInfo.house,
        dignity: venusInfo.dignity,
        strengthScore: venusInfo.score,
        shadbalaRatio: venusInfo.ratio || 1.0,
      },
    ],
    relevantHouses: [
      {
        house: 7,
        sign: h7Fact?.sign?.name || 'N/A',
        lord: h7LordFact?.lord || 'N/A',
        lordDignity: h7LordFact?.dignity || 'N/A',
        occupants: h7Fact?.planets || [],
      },
    ],
    relevantYogas: [],
    divisionalEvidence: ascSign
      ? [
          {
            chartType: 'D9',
            indicator: 'Navamsha Ascendant',
            placement: `${ascSign} (Lord: ${ascLord || 'N/A'})`,
            finding: 'D9 chart provides micro-level partnership verification.',
          },
        ]
      : [],
    dashaContext: dashaContextItems,
    transitContext: transitContextItems,
    whyEvidence,
    disclaimer: 'This evaluation provides deterministic interpretations of configured astrological rules. It does not predict guaranteed marriage timing or future relationship events.',
  };
}
