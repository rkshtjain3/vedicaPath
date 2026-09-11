import { createEvidenceItem } from '../shared/evidence.js';
import { calculateDomainScoring } from '../shared/scoring.js';
import { detectEvidenceConflicts } from '../shared/conflict-detector.js';
import { calculateConfidence } from '../shared/confidence.js';
import { getHouseSAVPoints } from '../shared/ashtakavarga-helper.js';
import { getPlanetStrengthInfo } from '../shared/strength-helper.js';
export function evaluateHealthDomain(engineData) {
    const evidenceItems = [];
    const whyEvidence = [];
    const { astrology, analysis, strengthAnalysis, shadbala, ashtakavarga, dasha, timing, } = engineData;
    const HEALTH_DISCLAIMER = 'This section is not medical advice and does not diagnose or predict medical conditions. It presents traditional symbolic astrological indicators for self-reflection only.';
    const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
    const weakDignities = ['DEBILITATED', 'ENEMY_SIGN', 'GREAT_ENEMY_SIGN'];
    const neutralDignities = ['FRIEND_SIGN', 'NEUTRAL_SIGN', 'GREAT_FRIEND_SIGN', 'FRIEND', 'NEUTRAL'];
    // 1. 1st House & Lagna Lord (Vitality & Physical Constitution)
    const h1LordFact = analysis?.houseLordFacts?.find((hl) => hl.house === 1);
    const h1Fact = analysis?.houseFacts?.find((h) => h.house === 1);
    if (h1LordFact) {
        if (strongDignities.includes(h1LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'HEALTH-D1-1ST-LORD-STRONG',
                domain: 'HEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'HEALTH-001',
                description: `Lagna Lord ${h1LordFact.lord} possesses strong ${h1LordFact.dignity} dignity, supporting robust physical constitution and natural vitality.`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 1.0,
                whyEvidence: [`1st Lord = ${h1LordFact.lord}`, `Dignity = ${h1LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (weakDignities.includes(h1LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'HEALTH-D1-1ST-LORD-WEAK',
                domain: 'HEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'HEALTH-001',
                description: `Lagna Lord ${h1LordFact.lord} is in ${h1LordFact.dignity} dignity, suggesting potential need for conscious vitality and stamina management.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.8,
                whyEvidence: [`1st Lord = ${h1LordFact.lord}`, `Dignity = ${h1LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else {
            const item = createEvidenceItem({
                id: 'HEALTH-D1-1ST-LORD-NEUTRAL',
                domain: 'HEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'HEALTH-001',
                description: `Lagna Lord ${h1LordFact.lord} is in stable ${h1LordFact.dignity} dignity, providing a balanced baseline for constitution.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.7,
                whyEvidence: [`1st Lord = ${h1LordFact.lord}`, `Dignity = ${h1LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        // Lagna Lord placement in Kendra/Trikona vs Dusthana
        const lordHouse = h1LordFact.lordHouse || h1LordFact.house;
        if (lordHouse) {
            if ([1, 4, 7, 10].includes(lordHouse)) {
                const item = createEvidenceItem({
                    id: 'HEALTH-D1-1ST-LORD-KENDRA',
                    domain: 'HEALTH',
                    sourceEngine: 'astrology-core',
                    sourceRuleId: 'HEALTH-002',
                    description: `Lagna Lord ${h1LordFact.lord} occupies Kendra House ${lordHouse}, reinforcing bodily stamina and resilience.`,
                    direction: 'SUPPORTIVE',
                    strength: 'HIGH',
                    weight: 0.9,
                    whyEvidence: [`1st Lord House = ${lordHouse}`],
                });
                evidenceItems.push(item);
                whyEvidence.push(...item.whyEvidence);
            }
            else if ([5, 9].includes(lordHouse)) {
                const item = createEvidenceItem({
                    id: 'HEALTH-D1-1ST-LORD-TRIKONA',
                    domain: 'HEALTH',
                    sourceEngine: 'astrology-core',
                    sourceRuleId: 'HEALTH-002',
                    description: `Lagna Lord ${h1LordFact.lord} occupies auspicious Trikona House ${lordHouse}, enhancing vital energy.`,
                    direction: 'SUPPORTIVE',
                    strength: 'MEDIUM',
                    weight: 0.8,
                    whyEvidence: [`1st Lord House = ${lordHouse}`],
                });
                evidenceItems.push(item);
                whyEvidence.push(...item.whyEvidence);
            }
            else if ([6, 8, 12].includes(lordHouse)) {
                const item = createEvidenceItem({
                    id: 'HEALTH-D1-1ST-LORD-DUSTHANA',
                    domain: 'HEALTH',
                    sourceEngine: 'astrology-core',
                    sourceRuleId: 'HEALTH-002',
                    description: `Lagna Lord ${h1LordFact.lord} is located in Dusthana House ${lordHouse}, advising disciplined preventive lifestyle routines.`,
                    direction: 'CHALLENGING',
                    strength: 'MEDIUM',
                    weight: 0.8,
                    whyEvidence: [`1st Lord House = ${lordHouse}`],
                });
                evidenceItems.push(item);
                whyEvidence.push(...item.whyEvidence);
            }
        }
    }
    // 1st House Occupants
    if (h1Fact && Array.isArray(h1Fact.planets) && h1Fact.planets.length > 0) {
        const benefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
        const h1Benefics = h1Fact.planets.filter((p) => benefics.includes(p));
        if (h1Benefics.length > 0) {
            const item = createEvidenceItem({
                id: 'HEALTH-1ST-HOUSE-BENEFICS',
                domain: 'HEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'HEALTH-H1-OCC',
                description: `Lagna house is graced by benefic planet(s) (${h1Benefics.join(', ')}), promoting constitutional vigor.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.75,
                whyEvidence: [`Lagna Occupants = ${h1Benefics.join(', ')}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    // 1st House Ashtakavarga SAV Points
    const h1Sav = getHouseSAVPoints(ashtakavarga, analysis, 1);
    if (h1Sav !== undefined) {
        if (h1Sav >= 30) {
            const item = createEvidenceItem({
                id: 'HEALTH-SAV-1ST-HIGH',
                domain: 'HEALTH',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-001',
                description: `1st House holds strong Ashtakavarga score (${h1Sav} points), indicating high physical resilience and recovery ability.`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 0.85,
                whyEvidence: [`1st House SAV = ${h1Sav} points (>= 30 baseline)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (h1Sav < 25) {
            const item = createEvidenceItem({
                id: 'HEALTH-SAV-1ST-LOW',
                domain: 'HEALTH',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-001',
                description: `1st House holds modest Ashtakavarga score (${h1Sav} points), encouraging intentional restorative rest and nourishment.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.7,
                whyEvidence: [`1st House SAV = ${h1Sav} points (< 25)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else {
            const item = createEvidenceItem({
                id: 'HEALTH-SAV-1ST-BALANCED',
                domain: 'HEALTH',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-001',
                description: `1st House holds balanced Ashtakavarga score (${h1Sav} points), reflecting steady physical constitution.`,
                direction: 'SUPPORTIVE',
                strength: 'LOW',
                weight: 0.5,
                whyEvidence: [`1st House SAV = ${h1Sav} points (25-29 baseline)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    // 2. Sun & Moon Vitality & Mind Indicators (using getPlanetStrengthInfo)
    const sunInfo = getPlanetStrengthInfo('Sun', engineData);
    const moonInfo = getPlanetStrengthInfo('Moon', engineData);
    if (sunInfo.isStrong) {
        const item = createEvidenceItem({
            id: 'HEALTH-SUN-VITALITY-STRONG',
            domain: 'HEALTH',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-SUN',
            description: `Sun (karaka of vitality & immune strength) possesses strong Shadbala (${sunInfo.rupas.toFixed(2)} Rupas).`,
            direction: 'SUPPORTIVE',
            strength: 'HIGH',
            weight: 0.9,
            whyEvidence: [`Sun Shadbala = ${sunInfo.rupas.toFixed(2)} Rupas`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    else if (sunInfo.isWeak) {
        const item = createEvidenceItem({
            id: 'HEALTH-SUN-VITALITY-LOW',
            domain: 'HEALTH',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-SUN',
            description: `Sun has moderate vitality strength (${sunInfo.rupas.toFixed(2)} Rupas), advising regular outdoor activity and heart health awareness.`,
            direction: 'CHALLENGING',
            strength: 'MEDIUM',
            weight: 0.65,
            whyEvidence: [`Sun Shadbala = ${sunInfo.rupas.toFixed(2)} Rupas`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    else {
        const item = createEvidenceItem({
            id: 'HEALTH-SUN-VITALITY-BALANCED',
            domain: 'HEALTH',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-SUN',
            description: `Sun holds balanced vitality strength (${sunInfo.rupas.toFixed(2)} Rupas).`,
            direction: 'SUPPORTIVE',
            strength: 'LOW',
            weight: 0.5,
            whyEvidence: [`Sun Shadbala = ${sunInfo.rupas.toFixed(2)} Rupas`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    if (moonInfo.isStrong) {
        const item = createEvidenceItem({
            id: 'HEALTH-MOON-MIND-STRONG',
            domain: 'HEALTH',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-MOON',
            description: `Moon (karaka of nervous system & emotional balance) holds strong Shadbala (${moonInfo.rupas.toFixed(2)} Rupas).`,
            direction: 'SUPPORTIVE',
            strength: 'MEDIUM',
            weight: 0.8,
            whyEvidence: [`Moon Shadbala = ${moonInfo.rupas.toFixed(2)} Rupas`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    else if (moonInfo.isWeak) {
        const item = createEvidenceItem({
            id: 'HEALTH-MOON-MIND-SENSITIVE',
            domain: 'HEALTH',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-MOON',
            description: `Moon shows sensitive equilibrium (${moonInfo.rupas.toFixed(2)} Rupas), prioritizing quality sleep and stress-reduction practices.`,
            direction: 'CHALLENGING',
            strength: 'MEDIUM',
            weight: 0.6,
            whyEvidence: [`Moon Shadbala = ${moonInfo.rupas.toFixed(2)} Rupas`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // 3. 6th House & 6th Lord (Immunity & Overcoming Resistance)
    const h6LordFact = analysis?.houseLordFacts?.find((hl) => hl.house === 6);
    const h6Fact = analysis?.houseFacts?.find((h) => h.house === 6);
    const h8Fact = analysis?.houseFacts?.find((h) => h.house === 8);
    if (h6LordFact) {
        const h6LordHouse = h6LordFact.lordHouse || h6LordFact.house;
        if ([3, 6, 10, 11].includes(h6LordHouse)) {
            const item = createEvidenceItem({
                id: 'HEALTH-6TH-LORD-UPACHAYA',
                domain: 'HEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'HEALTH-H6-LORD',
                description: `6th Lord ${h6LordFact.lord} in Upachaya House ${h6LordHouse} signifies capacity to overcome health challenges through discipline.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.7,
                whyEvidence: [`6th Lord = ${h6LordFact.lord}`, `Placement = House ${h6LordHouse}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    const malefics = ['Mars', 'Saturn', 'Rahu', 'Ketu'];
    const h6Malefics = h6Fact ? h6Fact.planets.filter((p) => malefics.includes(p)) : [];
    const h8Malefics = h8Fact ? h8Fact.planets.filter((p) => malefics.includes(p)) : [];
    if (h6Malefics.length > 0) {
        const item = createEvidenceItem({
            id: 'HEALTH-6TH-HOUSE-MALEFICS',
            domain: 'HEALTH',
            sourceEngine: 'astrology-core',
            sourceRuleId: 'HEALTH-TRIK-6',
            description: `6th House of resistance contains ${h6Malefics.join(', ')} (classically associated with robust disease-fighting drive).`,
            direction: 'SUPPORTIVE',
            strength: 'MEDIUM',
            weight: 0.7,
            whyEvidence: [`6th House Malefics = ${h6Malefics.join(', ')}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    if (h8Malefics.length > 0) {
        const item = createEvidenceItem({
            id: 'HEALTH-8TH-HOUSE-MALEFICS',
            domain: 'HEALTH',
            sourceEngine: 'astrology-core',
            sourceRuleId: 'HEALTH-TRIK-8',
            description: `8th House of transformation contains ${h8Malefics.join(', ')}, advising routine physical maintenance and injury caution.`,
            direction: 'CHALLENGING',
            strength: 'MEDIUM',
            weight: 0.8,
            whyEvidence: [`8th House Malefics = ${h8Malefics.join(', ')}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // 4. Dasha Context
    const dashaContextItems = [];
    const currentMD = dasha?.current?.mahadasha;
    const currentAD = dasha?.current?.antardasha;
    if (currentMD) {
        const mdLord = currentMD.lord;
        const isTrikLord = [6, 8, 12].includes(analysis?.houseLordFacts?.find((hl) => hl.lord === mdLord)?.house);
        dashaContextItems.push({
            periodType: 'CURRENT_MAHADASHA',
            mahadashaLord: mdLord,
            antardashaLord: currentAD?.lord,
            domainRelevance: isTrikLord ? 'TRIK_HOUSE_LORDSHIP' : 'GENERAL_VITALITY_CONTEXT',
            nonPredictiveExplanation: `Current ${mdLord} Mahadasha activates energy management and physical wellness focus.`,
        });
    }
    const transitContextItems = [];
    const supportingFactors = evidenceItems.filter((i) => i.direction === 'SUPPORTIVE');
    const challengingFactors = evidenceItems.filter((i) => i.direction === 'CHALLENGING');
    const neutralFactors = evidenceItems.filter((i) => i.direction === 'NEUTRAL');
    const scoring = calculateDomainScoring(evidenceItems);
    const conflicts = detectEvidenceConflicts(supportingFactors, challengingFactors);
    const confidence = calculateConfidence(evidenceItems, [
        'astrology-core',
        'shadbala-engine',
        'ashtakavarga-engine',
        'dasha-engine',
    ]);
    return {
        domain: 'HEALTH',
        title: 'Health & Physical Vitality',
        summary: `Health evaluation indicates ${scoring.state.replace(/_/g, ' ')} vitality factors based on 1st house Lagna lord, Sun vitality, and Trik house configurations.`,
        state: scoring.state,
        scoring,
        confidence,
        supportingFactors,
        challengingFactors,
        neutralFactors,
        mixedSignals: conflicts,
        relevantPlanetaryIndicators: [
            {
                planet: 'Sun',
                role: 'Vitality & Physical Immunity Karaka',
                sign: sunInfo.sign,
                house: sunInfo.house,
                dignity: sunInfo.dignity,
                strengthScore: sunInfo.score,
                shadbalaRatio: sunInfo.ratio || 1.0,
            },
            {
                planet: 'Moon',
                role: 'Mind & Psychological Resilience Karaka',
                sign: moonInfo.sign,
                house: moonInfo.house,
                dignity: moonInfo.dignity,
                strengthScore: moonInfo.score,
                shadbalaRatio: moonInfo.ratio || 1.0,
            },
        ],
        relevantHouses: [
            {
                house: 1,
                sign: h1Fact?.sign?.name || 'N/A',
                lord: h1LordFact?.lord || 'N/A',
                lordDignity: h1LordFact?.dignity || 'N/A',
                occupants: h1Fact?.planets || [],
            },
            {
                house: 6,
                sign: h6Fact?.sign?.name || 'N/A',
                lord: analysis?.houseLordFacts?.find((hl) => hl.house === 6)?.lord || 'N/A',
                lordDignity: analysis?.houseLordFacts?.find((hl) => hl.house === 6)?.dignity || 'N/A',
                occupants: h6Fact?.planets || [],
            },
        ],
        relevantYogas: [],
        divisionalEvidence: [],
        dashaContext: dashaContextItems,
        transitContext: transitContextItems,
        whyEvidence,
        disclaimer: HEALTH_DISCLAIMER,
    };
}
//# sourceMappingURL=health.js.map