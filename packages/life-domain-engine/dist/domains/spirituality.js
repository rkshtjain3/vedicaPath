import { createEvidenceItem } from '../shared/evidence.js';
import { calculateDomainScoring } from '../shared/scoring.js';
import { detectEvidenceConflicts } from '../shared/conflict-detector.js';
import { calculateConfidence } from '../shared/confidence.js';
import { getPlanetStrengthInfo } from '../shared/strength-helper.js';
export function evaluateSpiritualityDomain(engineData) {
    const evidenceItems = [];
    const whyEvidence = [];
    const { astrology, analysis, strengthAnalysis, shadbala, yogaAnalysis, dasha, } = engineData;
    const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
    const weakDignities = ['DEBILITATED', 'ENEMY_SIGN', 'GREAT_ENEMY_SIGN'];
    // 1. 9th & 12th Lords (Dharma & Moksha Houses)
    const h9LordFact = analysis?.houseLordFacts?.find((hl) => hl.house === 9);
    const h12LordFact = analysis?.houseLordFacts?.find((hl) => hl.house === 12);
    const h9Fact = analysis?.houseFacts?.find((h) => h.house === 9);
    const h12Fact = analysis?.houseFacts?.find((h) => h.house === 12);
    if (h9LordFact) {
        if (strongDignities.includes(h9LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'SPIRIT-D1-9TH-LORD-STRONG',
                domain: 'SPIRITUALITY',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'SPIRIT-001',
                description: `9th Lord of dharma & higher wisdom (${h9LordFact.lord}) has strong ${h9LordFact.dignity} dignity.`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 1.0,
                whyEvidence: [`9th Lord = ${h9LordFact.lord}`, `Dignity = ${h9LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (weakDignities.includes(h9LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'SPIRIT-D1-9TH-LORD-WEAK',
                domain: 'SPIRITUALITY',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'SPIRIT-001',
                description: `9th Lord (${h9LordFact.lord}) is in ${h9LordFact.dignity} dignity, suggesting periods of questioning belief structures or philosophical realignment.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.8,
                whyEvidence: [`9th Lord = ${h9LordFact.lord}`, `Dignity = ${h9LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else {
            const item = createEvidenceItem({
                id: 'SPIRIT-D1-9TH-LORD-STABLE',
                domain: 'SPIRITUALITY',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'SPIRIT-001',
                description: `9th Lord (${h9LordFact.lord}) holds stable ${h9LordFact.dignity || 'NEUTRAL'} dignity, fostering grounded ethical alignment.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.7,
                whyEvidence: [`9th Lord = ${h9LordFact.lord}`, `Dignity = ${h9LordFact.dignity || 'NEUTRAL'}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        if ([1, 4, 5, 7, 9, 10, 8, 12].includes(h9LordFact.lordHouse)) {
            const item = createEvidenceItem({
                id: 'SPIRIT-D1-9TH-LORD-PLACEMENT',
                domain: 'SPIRITUALITY',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'SPIRIT-002',
                description: `9th Lord (${h9LordFact.lord}) is placed in House ${h9LordFact.lordHouse}, supporting philosophical depth and higher knowledge.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.75,
                whyEvidence: [`9th Lord = ${h9LordFact.lord}`, `Placed in House ${h9LordFact.lordHouse}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    if (h12LordFact) {
        if (strongDignities.includes(h12LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'SPIRIT-D1-12TH-LORD-STRONG',
                domain: 'SPIRITUALITY',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'SPIRIT-001',
                description: `12th Lord of moksha & inner contemplation (${h12LordFact.lord}) has strong ${h12LordFact.dignity} dignity.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.85,
                whyEvidence: [`12th Lord = ${h12LordFact.lord}`, `Dignity = ${h12LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (weakDignities.includes(h12LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'SPIRIT-D1-12TH-LORD-WEAK',
                domain: 'SPIRITUALITY',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'SPIRIT-001',
                description: `12th Lord (${h12LordFact.lord}) is in ${h12LordFact.dignity} dignity, suggesting fluctuating discipline in meditative routines.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.75,
                whyEvidence: [`12th Lord = ${h12LordFact.lord}`, `Dignity = ${h12LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else {
            const item = createEvidenceItem({
                id: 'SPIRIT-D1-12TH-LORD-STABLE',
                domain: 'SPIRITUALITY',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'SPIRIT-001',
                description: `12th Lord (${h12LordFact.lord}) holds stable ${h12LordFact.dignity || 'NEUTRAL'} dignity, assisting inward tranquility.`,
                direction: 'SUPPORTIVE',
                strength: 'LOW',
                weight: 0.65,
                whyEvidence: [`12th Lord = ${h12LordFact.lord}`, `Dignity = ${h12LordFact.dignity || 'NEUTRAL'}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    // 2. Ketu Mokshakaraka & Jupiter Dharmakaraka
    const jupiterInfo = getPlanetStrengthInfo('Jupiter', engineData);
    const ketuFact = analysis?.planetFacts?.find((f) => f.planet === 'Ketu');
    if (jupiterInfo.isStrong) {
        const item = createEvidenceItem({
            id: 'SPIRIT-JUPITER-SHADBALA-STRONG',
            domain: 'SPIRITUALITY',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-JUPITER',
            description: `Jupiter (Dharmakaraka / significator of spiritual truth & grace) possesses strong strength.`,
            direction: 'SUPPORTIVE',
            strength: 'HIGH',
            weight: 0.95,
            whyEvidence: [`Jupiter Strength = ${jupiterInfo.overallStrength || (jupiterInfo.ratio !== undefined ? `Ratio ${jupiterInfo.ratio.toFixed(2)}` : 'Strong')}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    else if (jupiterInfo.isWeak) {
        const item = createEvidenceItem({
            id: 'SPIRIT-JUPITER-SHADBALA-CHALLENGING',
            domain: 'SPIRITUALITY',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-JUPITER-MODERATE',
            description: `Jupiter operates with sensitive dignity (${jupiterInfo.dignity}) or reduced strength, advising grounded contemplation.`,
            direction: 'CHALLENGING',
            strength: 'MEDIUM',
            weight: 0.75,
            whyEvidence: [`Jupiter Dignity = ${jupiterInfo.dignity}`, `Overall Strength = ${jupiterInfo.overallStrength || 'Below Average'}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    if (jupiterInfo.house && [1, 4, 5, 7, 9, 10, 12].includes(jupiterInfo.house)) {
        const item = createEvidenceItem({
            id: 'SPIRIT-JUPITER-KENDRA-TRIKONA',
            domain: 'SPIRITUALITY',
            sourceEngine: 'astrology-core',
            sourceRuleId: 'JUPITER-PLACEMENT',
            description: `Jupiter (Dharmakaraka) is placed in prominent House ${jupiterInfo.house}, providing moral and philosophical orientation.`,
            direction: 'SUPPORTIVE',
            strength: 'MEDIUM',
            weight: 0.8,
            whyEvidence: [`Jupiter House Placement = House ${jupiterInfo.house}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // Ketu in Moksha houses (4, 8, 12) or Dharma house (9)
    if (ketuFact && [4, 8, 9, 12].includes(ketuFact.house)) {
        const isPrimaryMoksha = [9, 12].includes(ketuFact.house);
        const item = createEvidenceItem({
            id: 'SPIRIT-KETU-MOKSHA-HOUSE',
            domain: 'SPIRITUALITY',
            sourceEngine: 'astrology-core',
            sourceRuleId: 'KETU-MOKSHA',
            description: `Ketu (Mokshakaraka / significator of spiritual detachment) occupies Moksha/Dharma house ${ketuFact.house}, encouraging introspective and meditative inclination.`,
            direction: 'SUPPORTIVE',
            strength: isPrimaryMoksha ? 'HIGH' : 'MEDIUM',
            weight: isPrimaryMoksha ? 1.0 : 0.8,
            whyEvidence: [`Ketu House Placement = House ${ketuFact.house}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // 9th and 12th House Occupants
    if (h9Fact?.planets?.length) {
        const item = createEvidenceItem({
            id: 'SPIRIT-9TH-HOUSE-OCCUPANTS',
            domain: 'SPIRITUALITY',
            sourceEngine: 'astrology-core',
            sourceRuleId: 'SPIRIT-003',
            description: `Planets in 9th House (${h9Fact.planets.join(', ')}) actively stimulate dharmic and philosophical inquiries.`,
            direction: 'SUPPORTIVE',
            strength: 'MEDIUM',
            weight: 0.75,
            whyEvidence: [`9th House Occupants = ${h9Fact.planets.join(', ')}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    if (h12Fact?.planets?.length) {
        const item = createEvidenceItem({
            id: 'SPIRIT-12TH-HOUSE-OCCUPANTS',
            domain: 'SPIRITUALITY',
            sourceEngine: 'astrology-core',
            sourceRuleId: 'SPIRIT-003',
            description: `Planets occupying 12th House (${h12Fact.planets.join(', ')}) heighten contemplative depth and solitude affinity.`,
            direction: 'SUPPORTIVE',
            strength: 'MEDIUM',
            weight: 0.75,
            whyEvidence: [`12th House Occupants = ${h12Fact.planets.join(', ')}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // 3. Spiritual Yogas
    if (yogaAnalysis?.yogas) {
        const spiritYogas = yogaAnalysis.yogas.filter((y) => ['Sanyasa Yoga', 'Gaja Kesari Yoga', 'Hamsa Yoga', 'Kedar Yoga'].includes(y.name));
        for (const y of spiritYogas) {
            const item = createEvidenceItem({
                id: `SPIRIT-YOGA-${y.name.toUpperCase().replace(/\s+/g, '-')}`,
                domain: 'SPIRITUALITY',
                sourceEngine: 'yoga-engine',
                sourceRuleId: y.name,
                description: `Classical ${y.name} is present, indicating spiritual depth, philosophical inclination, or meditative alignment.`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 1.0,
                whyEvidence: [`Yoga = ${y.name}`, `Category = ${y.category}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    const dashaContextItems = [];
    const currentMD = dasha?.current?.mahadasha;
    if (currentMD) {
        dashaContextItems.push({
            periodType: 'CURRENT_MAHADASHA',
            mahadashaLord: currentMD.lord,
            domainRelevance: 'SPIRITUAL_THEME_ACTIVATION',
            nonPredictiveExplanation: `Current ${currentMD.lord} Mahadasha provides contextual activation for internal reflection, dharma, and spiritual practice.`,
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
        domain: 'SPIRITUALITY',
        title: 'Spirituality & Dharma',
        summary: `Spirituality evaluation indicates ${scoring.state.replace(/_/g, ' ')} alignment based on 9th/12th house lords, Ketu Mokshakaraka, and Dharmakaraka Jupiter.`,
        state: scoring.state,
        scoring,
        confidence,
        supportingFactors,
        challengingFactors,
        neutralFactors,
        mixedSignals: conflicts,
        relevantPlanetaryIndicators: [
            {
                planet: 'Jupiter',
                role: 'Dharmakaraka & Spiritual Wisdom Karaka',
                sign: jupiterInfo.sign,
                house: jupiterInfo.house,
                dignity: jupiterInfo.dignity,
                strengthScore: jupiterInfo.score,
                shadbalaRatio: jupiterInfo.ratio || 1.0,
            },
            {
                planet: 'Ketu',
                role: 'Mokshakaraka & Intuition Karaka',
                sign: ketuFact?.sign?.name || 'N/A',
                house: ketuFact?.house || 1,
                dignity: ketuFact?.dignity || 'NEUTRAL',
                strengthScore: 0,
                shadbalaRatio: 1.0,
            },
        ],
        relevantHouses: [
            {
                house: 9,
                sign: analysis?.houseFacts?.find((h) => h.house === 9)?.sign?.name || 'N/A',
                lord: h9LordFact?.lord || 'N/A',
                lordDignity: h9LordFact?.dignity || 'N/A',
                occupants: analysis?.houseFacts?.find((h) => h.house === 9)?.planets || [],
            },
            {
                house: 12,
                sign: analysis?.houseFacts?.find((h) => h.house === 12)?.sign?.name || 'N/A',
                lord: h12LordFact?.lord || 'N/A',
                lordDignity: h12LordFact?.dignity || 'N/A',
                occupants: analysis?.houseFacts?.find((h) => h.house === 12)?.planets || [],
            },
        ],
        relevantYogas: [],
        divisionalEvidence: [],
        dashaContext: dashaContextItems,
        transitContext: [],
        whyEvidence,
    };
}
//# sourceMappingURL=spirituality.js.map