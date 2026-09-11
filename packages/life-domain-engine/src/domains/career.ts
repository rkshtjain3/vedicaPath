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
import { getHouseSAVPoints } from '../shared/ashtakavarga-helper.js';
import { getPlanetStrengthInfo } from '../shared/strength-helper.js';

export function evaluateCareerDomain(engineData: any): DomainEvaluationResult {
  const evidenceItems: DomainEvidenceItem[] = [];
  const whyEvidence: string[] = [];

  const {
    astrology,
    analysis,
    divisionalCharts,
    strengthAnalysis,
    shadbala,
    ashtakavarga,
    yogaAnalysis,
    rules,
    dasha,
    timing,
    transitAshtakavarga,
    crossChartAnalysis,
  } = engineData;

  const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
  const weakDignities = ['DEBILITATED', 'ENEMY_SIGN', 'GREAT_ENEMY_SIGN'];
  const neutralDignities = ['FRIEND_SIGN', 'NEUTRAL_SIGN', 'GREAT_FRIEND_SIGN', 'FRIEND', 'NEUTRAL'];

  // 1. D1 10th House & 10th Lord
  const h10LordFact = analysis?.houseLordFacts?.find((hl: any) => hl.house === 10);
  const h10Fact = analysis?.houseFacts?.find((h: any) => h.house === 10);

  if (h10LordFact) {
    if (strongDignities.includes(h10LordFact.dignity)) {
      const item = createEvidenceItem({
        id: 'CAREER-D1-10TH-LORD-STRONG',
        domain: 'CAREER',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'CAREER-001',
        description: `10th Lord ${h10LordFact.lord} is placed in house ${h10LordFact.lordHouse} with strong ${h10LordFact.dignity} dignity.`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
        weight: 1.0,
        whyEvidence: [
          `10th Lord = ${h10LordFact.lord}`,
          `Dignity = ${h10LordFact.dignity}`,
          `Placed in House ${h10LordFact.lordHouse}`,
        ],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else if (weakDignities.includes(h10LordFact.dignity)) {
      const item = createEvidenceItem({
        id: 'CAREER-D1-10TH-LORD-WEAK',
        domain: 'CAREER',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'CAREER-001',
        description: `10th Lord ${h10LordFact.lord} is in ${h10LordFact.dignity} dignity, creating potential professional friction or delays.`,
        direction: 'CHALLENGING',
        strength: 'MEDIUM',
        weight: 0.8,
        whyEvidence: [
          `10th Lord = ${h10LordFact.lord}`,
          `Dignity = ${h10LordFact.dignity}`,
        ],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else {
      const item = createEvidenceItem({
        id: 'CAREER-D1-10TH-LORD-NEUTRAL',
        domain: 'CAREER',
        sourceEngine: 'astrology-core',
        sourceRuleId: 'CAREER-001',
        description: `10th Lord ${h10LordFact.lord} is in stable ${h10LordFact.dignity} dignity in House ${h10LordFact.lordHouse}, supporting steady professional continuity.`,
        direction: 'SUPPORTIVE',
        strength: 'MEDIUM',
        weight: 0.7,
        whyEvidence: [
          `10th Lord = ${h10LordFact.lord}`,
          `Dignity = ${h10LordFact.dignity}`,
          `Placed in House ${h10LordFact.lordHouse}`,
        ],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }

    // 10th Lord House Placement
    const lordHouse = h10LordFact.lordHouse || h10LordFact.house;
    if (lordHouse) {
      if ([1, 4, 7, 10].includes(lordHouse)) {
        const item = createEvidenceItem({
          id: 'CAREER-D1-10TH-LORD-KENDRA',
          domain: 'CAREER',
          sourceEngine: 'astrology-core',
          sourceRuleId: 'CAREER-002',
          description: `10th Lord ${h10LordFact.lord} occupies prominent Kendra House ${lordHouse}, enhancing career visibility and professional standing.`,
          direction: 'SUPPORTIVE',
          strength: 'HIGH',
          weight: 0.85,
          whyEvidence: [`10th Lord House = ${lordHouse}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
      } else if ([5, 9].includes(lordHouse)) {
        const item = createEvidenceItem({
          id: 'CAREER-D1-10TH-LORD-TRIKONA',
          domain: 'CAREER',
          sourceEngine: 'astrology-core',
          sourceRuleId: 'CAREER-002',
          description: `10th Lord ${h10LordFact.lord} occupies auspicious Trikona House ${lordHouse}, indicating alignment between personal purpose and career path.`,
          direction: 'SUPPORTIVE',
          strength: 'HIGH',
          weight: 0.85,
          whyEvidence: [`10th Lord House = ${lordHouse}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
      } else if ([3, 6, 11].includes(lordHouse)) {
        const item = createEvidenceItem({
          id: 'CAREER-D1-10TH-LORD-UPACHAYA',
          domain: 'CAREER',
          sourceEngine: 'astrology-core',
          sourceRuleId: 'CAREER-002',
          description: `10th Lord ${h10LordFact.lord} is in Upachaya House ${lordHouse}, supporting growth in career through persistent effort and skill over time.`,
          direction: 'SUPPORTIVE',
          strength: 'MEDIUM',
          weight: 0.75,
          whyEvidence: [`10th Lord House = ${lordHouse}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
      } else if ([8, 12].includes(lordHouse)) {
        const item = createEvidenceItem({
          id: 'CAREER-D1-10TH-LORD-DUSTHANA',
          domain: 'CAREER',
          sourceEngine: 'astrology-core',
          sourceRuleId: 'CAREER-002',
          description: `10th Lord ${h10LordFact.lord} is situated in House ${lordHouse}, suggesting suitability for research, transformation, international work, or periodic transitions.`,
          direction: 'CHALLENGING',
          strength: 'MEDIUM',
          weight: 0.75,
          whyEvidence: [`10th Lord House = ${lordHouse}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
      }
    }
  }

  // 10th House Occupants
  if (h10Fact && Array.isArray(h10Fact.planets) && h10Fact.planets.length > 0) {
    const item = createEvidenceItem({
      id: 'CAREER-10TH-HOUSE-OCCUPANTS',
      domain: 'CAREER',
      sourceEngine: 'astrology-core',
      sourceRuleId: 'CAREER-H10-OCC',
      description: `10th House of career is occupied by ${h10Fact.planets.join(', ')}, directly activating career visibility and activities.`,
      direction: 'SUPPORTIVE',
      strength: 'HIGH',
      weight: 0.85,
      whyEvidence: [`10th House Occupants = ${h10Fact.planets.join(', ')}`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  }

  // 10th House Ashtakavarga SAV Points
  const sav10 = getHouseSAVPoints(ashtakavarga, analysis, 10);
  if (sav10 !== undefined) {
    if (sav10 >= 30) {
      const item = createEvidenceItem({
        id: 'CAREER-SAV-10TH-HIGH',
        domain: 'CAREER',
        sourceEngine: 'ashtakavarga-engine',
        sourceRuleId: 'SAV-001',
        description: `10th House holds strong Ashtakavarga score (${sav10} points), indicating substantial professional stamina and vocational backing.`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
        weight: 0.85,
        whyEvidence: [`10th House SAV = ${sav10} points (>= 30 baseline)`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else if (sav10 < 25) {
      const item = createEvidenceItem({
        id: 'CAREER-SAV-10TH-LOW',
        domain: 'CAREER',
        sourceEngine: 'ashtakavarga-engine',
        sourceRuleId: 'SAV-001',
        description: `10th House holds modest Ashtakavarga score (${sav10} points), advising thoughtful pacing and continuous skill upgrading.`,
        direction: 'CHALLENGING',
        strength: 'MEDIUM',
        weight: 0.7,
        whyEvidence: [`10th House SAV = ${sav10} points (< 25)`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    } else {
      const item = createEvidenceItem({
        id: 'CAREER-SAV-10TH-BALANCED',
        domain: 'CAREER',
        sourceEngine: 'ashtakavarga-engine',
        sourceRuleId: 'SAV-001',
        description: `10th House holds balanced Ashtakavarga score (${sav10} points), providing steady vocational stamina.`,
        direction: 'SUPPORTIVE',
        strength: 'LOW',
        weight: 0.5,
        whyEvidence: [`10th House SAV = ${sav10} points (25-29 baseline)`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }
  }

  // 2. Sun & Saturn Significators (using getPlanetStrengthInfo)
  const saturnInfo = getPlanetStrengthInfo('Saturn', engineData);
  const sunInfo = getPlanetStrengthInfo('Sun', engineData);

  if (saturnInfo.isStrong) {
    const item = createEvidenceItem({
      id: 'CAREER-SATURN-SHADBALA-STRONG',
      domain: 'CAREER',
      sourceEngine: 'shadbala-engine',
      sourceRuleId: 'SHADBALA-SATURN',
      description: `Saturn (karaka of career & perseverance) has strong Shadbala (${saturnInfo.rupas.toFixed(2)} Rupas).`,
      direction: 'SUPPORTIVE',
      strength: 'HIGH',
      weight: 0.9,
      whyEvidence: [`Saturn Shadbala Score = ${saturnInfo.rupas.toFixed(2)} Rupas`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  } else if (saturnInfo.isWeak) {
    const item = createEvidenceItem({
      id: 'CAREER-SATURN-SHADBALA-LOW',
      domain: 'CAREER',
      sourceEngine: 'shadbala-engine',
      sourceRuleId: 'SHADBALA-SATURN',
      description: `Saturn shows moderate strength (${saturnInfo.rupas.toFixed(2)} Rupas), advising sustained patience in career growth.`,
      direction: 'CHALLENGING',
      strength: 'MEDIUM',
      weight: 0.65,
      whyEvidence: [`Saturn Shadbala Score = ${saturnInfo.rupas.toFixed(2)} Rupas`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  }

  if (sunInfo.isStrong) {
    const item = createEvidenceItem({
      id: 'CAREER-SUN-SHADBALA-STRONG',
      domain: 'CAREER',
      sourceEngine: 'shadbala-engine',
      sourceRuleId: 'SHADBALA-SUN',
      description: `Sun (karaka of authority & leadership standing) has strong Shadbala (${sunInfo.rupas.toFixed(2)} Rupas).`,
      direction: 'SUPPORTIVE',
      strength: 'MEDIUM',
      weight: 0.8,
      whyEvidence: [`Sun Shadbala Score = ${sunInfo.rupas.toFixed(2)} Rupas`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  } else if (sunInfo.isWeak) {
    const item = createEvidenceItem({
      id: 'CAREER-SUN-SHADBALA-LOW',
      domain: 'CAREER',
      sourceEngine: 'shadbala-engine',
      sourceRuleId: 'SHADBALA-SUN',
      description: `Sun has moderate leadership strength (${sunInfo.rupas.toFixed(2)} Rupas), encouraging collaborative rather than purely hierarchical authority.`,
      direction: 'CHALLENGING',
      strength: 'MEDIUM',
      weight: 0.6,
      whyEvidence: [`Sun Shadbala Score = ${sunInfo.rupas.toFixed(2)} Rupas`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  }

  // 3. D10 Divisional Chart Evidence
  const d10AscSign =
    divisionalCharts?.d10Analysis?.ascendantSign ||
    divisionalCharts?.d10Chart?.ascendant?.sign?.name ||
    divisionalCharts?.d10Chart?.ascendant?.sign;
  const d10AscLord =
    divisionalCharts?.d10Analysis?.ascendantLord ||
    divisionalCharts?.d10Chart?.ascendant?.ruler;

  if (d10AscSign || d10AscLord) {
    const item = createEvidenceItem({
      id: 'CAREER-D10-ASCENDANT',
      domain: 'CAREER',
      sourceEngine: 'divisional-chart-engine',
      sourceRuleId: 'D10-ANALYSIS',
      description: `D10 Dashamsha Ascendant is in ${d10AscSign || 'aligned sign'} with lord ${d10AscLord || 'ruler'}.`,
      direction: 'SUPPORTIVE',
      strength: 'MEDIUM',
      weight: 0.75,
      whyEvidence: [`D10 Lagna = ${d10AscSign || 'N/A'}`, `D10 Lord = ${d10AscLord || 'N/A'}`],
    });
    evidenceItems.push(item);
    whyEvidence.push(...item.whyEvidence);
  }

  // 4. Classical Yogas Relevant to Career
  if (yogaAnalysis?.yogas) {
    const rajaYogas = yogaAnalysis.yogas.filter((y: any) =>
      ['Raja Yoga', 'Dharma Karma Adhipati Yoga', 'Amala Yoga', 'Gaja Kesari Yoga'].includes(y.name)
    );
    for (const y of rajaYogas) {
      const item = createEvidenceItem({
        id: `CAREER-YOGA-${y.name.toUpperCase().replace(/\s+/g, '-')}`,
        domain: 'CAREER',
        sourceEngine: 'yoga-engine',
        sourceRuleId: y.name,
        description: `Classical ${y.name} is present, supporting professional elevation and standing.`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
        weight: 1.0,
        whyEvidence: [`Yoga = ${y.name}`, `Category = ${y.category}`, `Description = ${y.description}`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }
  }

  // 5. Existing D10 Career Rules
  if (rules?.careerD10) {
    const d10RulesList = Array.isArray(rules.careerD10)
      ? rules.careerD10
      : rules.careerD10.rules || [];
    const triggeredD10Rules = d10RulesList.filter((r: any) => r.triggered);
    for (const r of triggeredD10Rules) {
      const item = createEvidenceItem({
        id: `CAREER-RULE-${r.ruleId}`,
        domain: 'CAREER',
        sourceEngine: 'rules-engine',
        sourceRuleId: r.ruleId,
        description: `Career D10 Rule ${r.ruleId} evaluated positive for professional activation.`,
        direction: 'SUPPORTIVE',
        strength: 'MEDIUM',
        weight: 0.8,
        whyEvidence: [r.explanationKey || `Rule ${r.ruleId} triggered`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }
  }

  // 6. Dasha Context
  const dashaContextItems: DashaContextItem[] = [];
  const currentMD = dasha?.current?.mahadasha;
  const currentAD = dasha?.current?.antardasha;

  if (currentMD) {
    const mdLord = currentMD.lord;
    const isConn10 = analysis?.houseFacts?.find((h: any) => h.house === 10)?.planets?.includes(mdLord);
    const isConnLord = h10LordFact?.lord === mdLord;

    dashaContextItems.push({
      periodType: 'CURRENT_MAHADASHA',
      mahadashaLord: mdLord,
      antardashaLord: currentAD?.lord,
      domainRelevance: isConn10 || isConnLord ? 'DIRECT_10TH_HOUSE_CONNECTION' : 'GENERAL_DASHA_CONTEXT',
      nonPredictiveExplanation: `During current ${mdLord} Mahadasha (${currentAD?.lord || ''} Antardasha), career indicators are activated through ${mdLord}'s natal position and lordship.`,
    });

    if (isConn10 || isConnLord) {
      const item = createEvidenceItem({
        id: 'CAREER-DASHA-CURRENT-CONNECTION',
        domain: 'CAREER',
        sourceEngine: 'dasha-engine',
        sourceRuleId: 'DASHA-10TH-CONN',
        description: `Current Mahadasha lord ${mdLord} connects directly to 10th house of profession.`,
        direction: 'SUPPORTIVE',
        strength: 'HIGH',
        weight: 1.0,
        whyEvidence: [`Current Mahadasha Lord = ${mdLord}`, `10th House Connection = YES`],
      });
      evidenceItems.push(item);
      whyEvidence.push(...item.whyEvidence);
    }
  }

  // 7. Transit Context
  const transitContextItems: TransitContextItem[] = [];
  const saturnTransit = timing?.transits?.planets?.find((p: any) => p.planet === 'Saturn');
  const jupiterTransit = timing?.transits?.planets?.find((p: any) => p.planet === 'Jupiter');

  if (saturnTransit) {
    const is10thTransit = saturnTransit.houseFromLagna === 10;
    transitContextItems.push({
      planet: 'Saturn',
      currentSign: saturnTransit.currentSign?.name || 'Current Sign',
      transitedHouseFromLagna: saturnTransit.houseFromLagna,
      transitedHouseFromMoon: saturnTransit.houseFromMoon || 1,
      bavPoints: saturnTransit.bavPoints || 4,
      savPoints: saturnTransit.savPoints || 28,
      classification: is10thTransit ? 'SUPPORTIVE' : 'NEUTRAL',
      nonPredictiveExplanation: `Saturn transits House ${saturnTransit.houseFromLagna} from Lagna. Saturn transit context provides structural focus on professional responsibilities.`,
    });
  }

  if (jupiterTransit) {
    const is10thTransit = jupiterTransit.houseFromLagna === 10;
    transitContextItems.push({
      planet: 'Jupiter',
      currentSign: jupiterTransit.currentSign?.name || 'Current Sign',
      transitedHouseFromLagna: jupiterTransit.houseFromLagna,
      transitedHouseFromMoon: jupiterTransit.houseFromMoon || 1,
      bavPoints: jupiterTransit.bavPoints || 4,
      savPoints: jupiterTransit.savPoints || 28,
      classification: is10thTransit ? 'SUPPORTIVE' : 'NEUTRAL',
      nonPredictiveExplanation: `Jupiter transits House ${jupiterTransit.houseFromLagna} from Lagna, offering expanded perspective and growth opportunities.`,
    });
  }

  // Filter evidence into categories
  const supportingFactors = evidenceItems.filter((i) => i.direction === 'SUPPORTIVE');
  const challengingFactors = evidenceItems.filter((i) => i.direction === 'CHALLENGING');
  const neutralFactors = evidenceItems.filter((i) => i.direction === 'NEUTRAL');

  const scoring = calculateDomainScoring(evidenceItems);
  const conflicts = detectEvidenceConflicts(supportingFactors, challengingFactors);
  const confidence = calculateConfidence(evidenceItems, [
    'astrology-core',
    'rules-engine',
    'shadbala-engine',
    'ashtakavarga-engine',
    'divisional-chart-engine',
    'yoga-engine',
    'dasha-engine',
    'timing-engine',
  ]);

  // Extract Relevant Planetary Indicators
  const relevantPlanetaryIndicators = [
    {
      planet: 'Sun',
      role: 'King & Authority Significator',
      sign: sunInfo.sign,
      house: sunInfo.house,
      dignity: sunInfo.dignity,
      strengthScore: sunInfo.score,
      shadbalaRatio: sunInfo.ratio || 1.0,
    },
    {
      planet: 'Saturn',
      role: 'Profession & Service Significator',
      sign: saturnInfo.sign,
      house: saturnInfo.house,
      dignity: saturnInfo.dignity,
      strengthScore: saturnInfo.score,
      shadbalaRatio: saturnInfo.ratio || 1.0,
    },
  ];

  const relevantHouses = [
    {
      house: 10,
      sign: h10Fact?.sign?.name || 'N/A',
      lord: h10LordFact?.lord || 'N/A',
      lordDignity: h10LordFact?.dignity || 'N/A',
      occupants: h10Fact?.planets || [],
    },
    {
      house: 6,
      sign: analysis?.houseFacts?.find((h: any) => h.house === 6)?.sign?.name || 'N/A',
      lord: analysis?.houseLordFacts?.find((hl: any) => hl.house === 6)?.lord || 'N/A',
      lordDignity: analysis?.houseLordFacts?.find((hl: any) => hl.house === 6)?.dignity || 'N/A',
      occupants: analysis?.houseFacts?.find((h: any) => h.house === 6)?.planets || [],
    },
  ];

  return {
    domain: 'CAREER',
    title: 'Career & Vocation',
    summary: `Career analysis shows ${scoring.state.replace(/_/g, ' ')} indicators based on 10th house configuration, Saturn/Sun strength, and D10 Dashamsha alignment.`,
    state: scoring.state,
    scoring,
    confidence,
    supportingFactors,
    challengingFactors,
    neutralFactors,
    mixedSignals: conflicts,
    relevantPlanetaryIndicators,
    relevantHouses,
    relevantYogas: yogaAnalysis?.yogas
      ? yogaAnalysis.yogas.map((y: any) => ({ name: y.name, category: y.category, relevance: y.description }))
      : [],
    divisionalEvidence: d10AscSign
      ? [
          {
            chartType: 'D10',
            indicator: 'Dashamsha Ascendant',
            placement: `${d10AscSign} (Lord: ${d10AscLord || 'N/A'})`,
            finding: 'D10 chart confirms vocational inclination and alignment.',
          },
        ]
      : [],
    dashaContext: dashaContextItems,
    transitContext: transitContextItems,
    whyEvidence,
  };
}
