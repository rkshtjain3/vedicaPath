import { createEvidenceItem } from '../shared/evidence.js';
import { calculateDomainScoring } from '../shared/scoring.js';
import { detectEvidenceConflicts } from '../shared/conflict-detector.js';
import { calculateConfidence } from '../shared/confidence.js';
import { getHouseSAVPoints } from '../shared/ashtakavarga-helper.js';
import { getPlanetStrengthInfo } from '../shared/strength-helper.js';
export function evaluateEducationDomain(engineData) {
    const evidenceItems = [];
    const whyEvidence = [];
    const { astrology, analysis, strengthAnalysis, shadbala, ashtakavarga, yogaAnalysis, dasha, } = engineData;
    const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
    const weakDignities = ['DEBILITATED', 'ENEMY_SIGN', 'GREAT_ENEMY_SIGN'];
    // 1. 4th & 5th Lords (Foundational Learning & Higher Intellect)
    const h4LordFact = analysis?.houseLordFacts?.find((hl) => hl.house === 4);
    const h5LordFact = analysis?.houseLordFacts?.find((hl) => hl.house === 5);
    const h5Fact = analysis?.houseFacts?.find((h) => h.house === 5);
    if (h4LordFact) {
        if (strongDignities.includes(h4LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'EDU-D1-4TH-LORD-STRONG',
                domain: 'EDUCATION',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'EDU-001',
                description: `4th Lord of foundational education (${h4LordFact.lord}) has strong ${h4LordFact.dignity} dignity.`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 1.0,
                whyEvidence: [`4th Lord = ${h4LordFact.lord}`, `Dignity = ${h4LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (weakDignities.includes(h4LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'EDU-D1-4TH-LORD-WEAK',
                domain: 'EDUCATION',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'EDU-001',
                description: `4th Lord (${h4LordFact.lord}) is in ${h4LordFact.dignity} dignity, suggesting potential interruptions or need for disciplined academic routines.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.8,
                whyEvidence: [`4th Lord = ${h4LordFact.lord}`, `Dignity = ${h4LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else {
            const item = createEvidenceItem({
                id: 'EDU-D1-4TH-LORD-STABLE',
                domain: 'EDUCATION',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'EDU-001',
                description: `4th Lord (${h4LordFact.lord}) holds stable ${h4LordFact.dignity || 'NEUTRAL'} dignity, providing steady foundational learning capacity.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.7,
                whyEvidence: [`4th Lord = ${h4LordFact.lord}`, `Dignity = ${h4LordFact.dignity || 'NEUTRAL'}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    if (h5LordFact) {
        if (strongDignities.includes(h5LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'EDU-D1-5TH-LORD-STRONG',
                domain: 'EDUCATION',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'EDU-001',
                description: `5th Lord of intelligence & higher learning (${h5LordFact.lord}) has strong ${h5LordFact.dignity} dignity.`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 1.0,
                whyEvidence: [`5th Lord = ${h5LordFact.lord}`, `Dignity = ${h5LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (weakDignities.includes(h5LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'EDU-D1-5TH-LORD-WEAK',
                domain: 'EDUCATION',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'EDU-001',
                description: `5th Lord (${h5LordFact.lord}) is in ${h5LordFact.dignity} dignity, suggesting academic specialization may require concerted perseverance.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.8,
                whyEvidence: [`5th Lord = ${h5LordFact.lord}`, `Dignity = ${h5LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else {
            const item = createEvidenceItem({
                id: 'EDU-D1-5TH-LORD-STABLE',
                domain: 'EDUCATION',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'EDU-001',
                description: `5th Lord (${h5LordFact.lord}) holds stable ${h5LordFact.dignity || 'NEUTRAL'} dignity, supporting clear analytical intellect.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.7,
                whyEvidence: [`5th Lord = ${h5LordFact.lord}`, `Dignity = ${h5LordFact.dignity || 'NEUTRAL'}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        if ([1, 4, 5, 7, 9, 10, 2, 11].includes(h5LordFact.lordHouse)) {
            const item = createEvidenceItem({
                id: 'EDU-D1-5TH-LORD-PLACEMENT',
                domain: 'EDUCATION',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'EDU-002',
                description: `5th Lord (${h5LordFact.lord}) is situated in auspicious House ${h5LordFact.lordHouse}, reinforcing intellectual acumen and retention.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.8,
                whyEvidence: [`5th Lord = ${h5LordFact.lord}`, `Placed in House ${h5LordFact.lordHouse}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    // 2. Mercury & Jupiter Intellectual Significators
    const mercuryInfo = getPlanetStrengthInfo('Mercury', engineData);
    const jupiterInfo = getPlanetStrengthInfo('Jupiter', engineData);
    if (mercuryInfo.isStrong) {
        const item = createEvidenceItem({
            id: 'EDU-MERCURY-SHADBALA-STRONG',
            domain: 'EDUCATION',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-MERCURY',
            description: `Mercury (buddhi/intellect & analytical power) possesses strong planetary strength.`,
            direction: 'SUPPORTIVE',
            strength: 'HIGH',
            weight: 0.95,
            whyEvidence: [`Mercury Strength = ${mercuryInfo.overallStrength || (mercuryInfo.ratio !== undefined ? `Ratio ${mercuryInfo.ratio.toFixed(2)}` : 'Strong')}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    else {
        const item = createEvidenceItem({
            id: 'EDU-MERCURY-SHADBALA-BASELINE',
            domain: 'EDUCATION',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-MERCURY-BASELINE',
            description: `Mercury operates with steady baseline strength, providing reliable logical processing.`,
            direction: 'SUPPORTIVE',
            strength: 'LOW',
            weight: 0.6,
            whyEvidence: [`Mercury Strength = ${mercuryInfo.overallStrength || 'Moderate'}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    if (jupiterInfo.isStrong) {
        const item = createEvidenceItem({
            id: 'EDU-JUPITER-SHADBALA-STRONG',
            domain: 'EDUCATION',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-JUPITER',
            description: `Jupiter (Guru / wisdom & higher learning significator) holds strong strength.`,
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
            id: 'EDU-JUPITER-SHADBALA-CHALLENGING',
            domain: 'EDUCATION',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-JUPITER-MODERATE',
            description: `Jupiter operates with sensitive dignity (${jupiterInfo.dignity}) or lower strength, advising deliberate focus in theoretical subjects.`,
            direction: 'CHALLENGING',
            strength: 'MEDIUM',
            weight: 0.75,
            whyEvidence: [`Jupiter Dignity = ${jupiterInfo.dignity}`, `Overall Strength = ${jupiterInfo.overallStrength || 'Below Average'}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // 3. 5th House Occupants & SAV Points
    const sav5 = getHouseSAVPoints(ashtakavarga, analysis, 5);
    if (sav5 !== undefined) {
        if (sav5 >= 30) {
            const item = createEvidenceItem({
                id: 'EDU-ASHTAKAVARGA-5TH-HIGH',
                domain: 'EDUCATION',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-5TH',
                description: `5th House of intellect & scholarship holds strong Ashtakavarga SAV score (${sav5} points).`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 0.9,
                whyEvidence: [`5th House SAV = ${sav5} points (Benchmark average: 28)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (sav5 < 25) {
            const item = createEvidenceItem({
                id: 'EDU-ASHTAKAVARGA-5TH-LOW',
                domain: 'EDUCATION',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-5TH',
                description: `5th House holds below-average Ashtakavarga SAV score (${sav5} points), suggesting extra diligence needed during academic evaluations.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.75,
                whyEvidence: [`5th House SAV = ${sav5} points (Benchmark average: 28)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    if (h5Fact?.planets?.length) {
        const item = createEvidenceItem({
            id: 'EDU-5TH-HOUSE-OCCUPANTS',
            domain: 'EDUCATION',
            sourceEngine: 'astrology-core',
            sourceRuleId: 'EDU-003',
            description: `Planets occupying 5th House (${h5Fact.planets.join(', ')}) actively shape academic interests and intellectual temperament.`,
            direction: 'SUPPORTIVE',
            strength: 'MEDIUM',
            weight: 0.75,
            whyEvidence: [`5th House Occupants = ${h5Fact.planets.join(', ')}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // 4. Budhaditya & Saraswati Yogas
    if (yogaAnalysis?.yogas) {
        const eduYogas = yogaAnalysis.yogas.filter((y) => ['Budhaditya Yoga', 'Saraswati Yoga', 'Gaja Kesari Yoga'].includes(y.name));
        for (const y of eduYogas) {
            const item = createEvidenceItem({
                id: `EDU-YOGA-${y.name.toUpperCase().replace(/\s+/g, '-')}`,
                domain: 'EDUCATION',
                sourceEngine: 'yoga-engine',
                sourceRuleId: y.name,
                description: `Classical ${y.name} is present, indicating intellectual sharpness & academic acumen.`,
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
            domainRelevance: 'EDUCATIONAL_ACTIVATION',
            nonPredictiveExplanation: `Current ${currentMD.lord} Mahadasha provides contextual activation for intellectual pursuits and skill development.`,
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
        domain: 'EDUCATION',
        title: 'Education & Intellect',
        summary: `Education evaluation shows ${scoring.state.replace(/_/g, ' ')} indicators based on 4th/5th house strength, Mercury intellect, and Jupiter wisdom.`,
        state: scoring.state,
        scoring,
        confidence,
        supportingFactors,
        challengingFactors,
        neutralFactors,
        mixedSignals: conflicts,
        relevantPlanetaryIndicators: [
            {
                planet: 'Mercury',
                role: 'Intellect & Analytical Power Karaka',
                sign: astrology?.planets?.find((p) => p.planet === 'Mercury')?.sign?.name || 'N/A',
                house: astrology?.planets?.find((p) => p.planet === 'Mercury')?.house || 1,
                dignity: astrology?.planets?.find((p) => p.planet === 'Mercury')?.dignity || 'NEUTRAL',
                strengthScore: strengthAnalysis?.planets?.find((p) => p.planet === 'Mercury')?.score || 0,
                shadbalaRatio: mercuryInfo.ratio || 1.0,
            },
            {
                planet: 'Jupiter',
                role: 'Wisdom & Higher Education Karaka',
                sign: astrology?.planets?.find((p) => p.planet === 'Jupiter')?.sign?.name || 'N/A',
                house: astrology?.planets?.find((p) => p.planet === 'Jupiter')?.house || 1,
                dignity: astrology?.planets?.find((p) => p.planet === 'Jupiter')?.dignity || 'NEUTRAL',
                strengthScore: strengthAnalysis?.planets?.find((p) => p.planet === 'Jupiter')?.score || 0,
                shadbalaRatio: jupiterInfo.ratio || 1.0,
            },
        ],
        relevantHouses: [
            {
                house: 4,
                sign: analysis?.houseFacts?.find((h) => h.house === 4)?.sign?.name || 'N/A',
                lord: h4LordFact?.lord || 'N/A',
                lordDignity: h4LordFact?.dignity || 'N/A',
                occupants: analysis?.houseFacts?.find((h) => h.house === 4)?.planets || [],
            },
            {
                house: 5,
                sign: analysis?.houseFacts?.find((h) => h.house === 5)?.sign?.name || 'N/A',
                lord: h5LordFact?.lord || 'N/A',
                lordDignity: h5LordFact?.dignity || 'N/A',
                occupants: analysis?.houseFacts?.find((h) => h.house === 5)?.planets || [],
            },
        ],
        relevantYogas: [],
        divisionalEvidence: [],
        dashaContext: dashaContextItems,
        transitContext: [],
        whyEvidence,
    };
}
//# sourceMappingURL=education.js.map