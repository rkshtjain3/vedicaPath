import { createEvidenceItem } from '../shared/evidence.js';
import { calculateDomainScoring } from '../shared/scoring.js';
import { detectEvidenceConflicts } from '../shared/conflict-detector.js';
import { calculateConfidence } from '../shared/confidence.js';
import { getHouseSAVPoints } from '../shared/ashtakavarga-helper.js';
import { getPlanetStrengthInfo } from '../shared/strength-helper.js';
export function evaluateWealthDomain(engineData) {
    const evidenceItems = [];
    const whyEvidence = [];
    const { astrology, analysis, strengthAnalysis, shadbala, ashtakavarga, yogaAnalysis, dasha, timing, } = engineData;
    const strongDignities = ['EXALTED', 'OWN_SIGN', 'MOOLATRIKONA'];
    const weakDignities = ['DEBILITATED', 'ENEMY_SIGN', 'GREAT_ENEMY_SIGN'];
    const neutralDignities = ['FRIEND_SIGN', 'NEUTRAL_SIGN', 'GREAT_FRIEND_SIGN', 'FRIEND', 'NEUTRAL'];
    // 1. 2nd House & 11th House Lords (Dignity & House Placement)
    const h2LordFact = analysis?.houseLordFacts?.find((hl) => hl.house === 2);
    const h11LordFact = analysis?.houseLordFacts?.find((hl) => hl.house === 11);
    const h2Fact = analysis?.houseFacts?.find((h) => h.house === 2);
    const h11Fact = analysis?.houseFacts?.find((h) => h.house === 11);
    if (h2LordFact) {
        if (strongDignities.includes(h2LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'WEALTH-D1-2ND-LORD-STRONG',
                domain: 'WEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'WEALTH-001',
                description: `2nd Lord of accumulated wealth (${h2LordFact.lord}) has strong ${h2LordFact.dignity} dignity.`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 1.0,
                whyEvidence: [`2nd Lord = ${h2LordFact.lord}`, `Dignity = ${h2LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (weakDignities.includes(h2LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'WEALTH-D1-2ND-LORD-WEAK',
                domain: 'WEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'WEALTH-001',
                description: `2nd Lord of accumulated wealth (${h2LordFact.lord}) is in ${h2LordFact.dignity} dignity, suggesting need for disciplined savings management.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.85,
                whyEvidence: [`2nd Lord = ${h2LordFact.lord}`, `Dignity = ${h2LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else {
            const item = createEvidenceItem({
                id: 'WEALTH-D1-2ND-LORD-STABLE',
                domain: 'WEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'WEALTH-001',
                description: `2nd Lord of accumulated wealth (${h2LordFact.lord}) holds stable ${h2LordFact.dignity || 'NEUTRAL'} dignity, providing a steady savings baseline.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.7,
                whyEvidence: [`2nd Lord = ${h2LordFact.lord}`, `Dignity = ${h2LordFact.dignity || 'NEUTRAL'}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        // 2nd Lord Placement
        if ([1, 2, 4, 5, 7, 9, 10, 11].includes(h2LordFact.lordHouse)) {
            const item = createEvidenceItem({
                id: 'WEALTH-D1-2ND-LORD-PLACEMENT-AUSPICIOUS',
                domain: 'WEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'WEALTH-002',
                description: `2nd Lord (${h2LordFact.lord}) is placed in auspicious House ${h2LordFact.lordHouse}, reinforcing financial stability.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.8,
                whyEvidence: [`2nd Lord = ${h2LordFact.lord}`, `Placed in House ${h2LordFact.lordHouse}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if ([6, 8, 12].includes(h2LordFact.lordHouse)) {
            const item = createEvidenceItem({
                id: 'WEALTH-D1-2ND-LORD-PLACEMENT-DUSTHANA',
                domain: 'WEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'WEALTH-002',
                description: `2nd Lord (${h2LordFact.lord}) is situated in Trika House ${h2LordFact.lordHouse}, indicating financial fluctuations or expenditure pressures.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.75,
                whyEvidence: [`2nd Lord = ${h2LordFact.lord}`, `Placed in House ${h2LordFact.lordHouse}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    if (h11LordFact) {
        if (strongDignities.includes(h11LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'WEALTH-D1-11TH-LORD-STRONG',
                domain: 'WEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'WEALTH-001',
                description: `11th Lord of gains & income (${h11LordFact.lord}) has strong ${h11LordFact.dignity} dignity.`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 1.0,
                whyEvidence: [`11th Lord = ${h11LordFact.lord}`, `Dignity = ${h11LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (weakDignities.includes(h11LordFact.dignity)) {
            const item = createEvidenceItem({
                id: 'WEALTH-D1-11TH-LORD-WEAK',
                domain: 'WEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'WEALTH-001',
                description: `11th Lord of gains & income (${h11LordFact.lord}) is in ${h11LordFact.dignity} dignity, suggesting income streams require consistent effort.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.85,
                whyEvidence: [`11th Lord = ${h11LordFact.lord}`, `Dignity = ${h11LordFact.dignity}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else {
            const item = createEvidenceItem({
                id: 'WEALTH-D1-11TH-LORD-STABLE',
                domain: 'WEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'WEALTH-001',
                description: `11th Lord of gains & income (${h11LordFact.lord}) holds stable ${h11LordFact.dignity || 'NEUTRAL'} dignity, supporting revenue generation.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.7,
                whyEvidence: [`11th Lord = ${h11LordFact.lord}`, `Dignity = ${h11LordFact.dignity || 'NEUTRAL'}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        // 11th Lord Placement
        if ([1, 2, 4, 5, 7, 9, 10, 11].includes(h11LordFact.lordHouse)) {
            const item = createEvidenceItem({
                id: 'WEALTH-D1-11TH-LORD-PLACEMENT-AUSPICIOUS',
                domain: 'WEALTH',
                sourceEngine: 'astrology-core',
                sourceRuleId: 'WEALTH-002',
                description: `11th Lord (${h11LordFact.lord}) is placed in House ${h11LordFact.lordHouse}, facilitating realization of financial gains.`,
                direction: 'SUPPORTIVE',
                strength: 'MEDIUM',
                weight: 0.8,
                whyEvidence: [`11th Lord = ${h11LordFact.lord}`, `Placed in House ${h11LordFact.lordHouse}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    // 2. 12th House Expense Pressure Check
    const h12LordFact = analysis?.houseLordFacts?.find((hl) => hl.house === 12);
    if (h12LordFact && [2, 11].includes(h12LordFact.lordHouse)) {
        const item = createEvidenceItem({
            id: 'WEALTH-12TH-LORD-IN-WEALTH-HOUSE',
            domain: 'WEALTH',
            sourceEngine: 'rules-engine',
            sourceRuleId: 'WEALTH-003',
            description: `12th Lord of expenses (${h12LordFact.lord}) is placed in wealth house ${h12LordFact.lordHouse}, indicating financial outflows or expenditure pressure.`,
            direction: 'CHALLENGING',
            strength: 'MEDIUM',
            weight: 0.85,
            whyEvidence: [`12th Lord = ${h12LordFact.lord}`, `Placed in House ${h12LordFact.lordHouse}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // 3. Jupiter & Venus Significators (Dhanakaraka & Shukra)
    const jupiterInfo = getPlanetStrengthInfo('Jupiter', engineData);
    const venusInfo = getPlanetStrengthInfo('Venus', engineData);
    if (jupiterInfo.isStrong) {
        const item = createEvidenceItem({
            id: 'WEALTH-JUPITER-SHADBALA-STRONG',
            domain: 'WEALTH',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-JUPITER',
            description: `Jupiter (Dhanakaraka / significator of wealth) possesses strong planetary strength.`,
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
            id: 'WEALTH-JUPITER-SHADBALA-CHALLENGING',
            domain: 'WEALTH',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-JUPITER-MODERATE',
            description: `Jupiter (Dhanakaraka) operates with sensitive dignity (${jupiterInfo.dignity}) or lower strength, advising disciplined budgeting.`,
            direction: 'CHALLENGING',
            strength: 'MEDIUM',
            weight: 0.8,
            whyEvidence: [`Jupiter Dignity = ${jupiterInfo.dignity}`, `Overall Strength = ${jupiterInfo.overallStrength || 'Below Average'}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    else {
        const item = createEvidenceItem({
            id: 'WEALTH-JUPITER-BASELINE',
            domain: 'WEALTH',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-JUPITER-BASELINE',
            description: `Jupiter (Dhanakaraka) holds steady baseline planetary strength, providing grounded financial discretion.`,
            direction: 'SUPPORTIVE',
            strength: 'LOW',
            weight: 0.6,
            whyEvidence: [`Jupiter Dignity = ${jupiterInfo.dignity}`, `Overall Strength = ${jupiterInfo.overallStrength || 'Moderate'}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    if (venusInfo.isStrong) {
        const item = createEvidenceItem({
            id: 'WEALTH-VENUS-SHADBALA-STRONG',
            domain: 'WEALTH',
            sourceEngine: 'shadbala-engine',
            sourceRuleId: 'SHADBALA-VENUS',
            description: `Venus (significator of assets, luxury & prosperity) possesses strong strength.`,
            direction: 'SUPPORTIVE',
            strength: 'MEDIUM',
            weight: 0.8,
            whyEvidence: [`Venus Strength = ${venusInfo.overallStrength || 'Strong'}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // 4. Ashtakavarga SAV Points in 2nd & 11th Houses
    const sav11 = getHouseSAVPoints(ashtakavarga, analysis, 11);
    const sav2 = getHouseSAVPoints(ashtakavarga, analysis, 2);
    if (sav11 !== undefined) {
        if (sav11 >= 30) {
            const item = createEvidenceItem({
                id: 'WEALTH-ASHTAKAVARGA-11TH-HIGH',
                domain: 'WEALTH',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-11TH',
                description: `11th House of gains holds strong Ashtakavarga SAV score (${sav11} points).`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 0.9,
                whyEvidence: [`11th House SAV = ${sav11} points (Benchmark average: 28)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (sav11 < 25) {
            const item = createEvidenceItem({
                id: 'WEALTH-ASHTAKAVARGA-11TH-LOW',
                domain: 'WEALTH',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-11TH',
                description: `11th House of gains holds below-average Ashtakavarga SAV score (${sav11} points), indicating potential friction in irregular revenues.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.75,
                whyEvidence: [`11th House SAV = ${sav11} points (Benchmark average: 28)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else {
            const item = createEvidenceItem({
                id: 'WEALTH-ASHTAKAVARGA-11TH-BASELINE',
                domain: 'WEALTH',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-11TH',
                description: `11th House of gains holds steady baseline Ashtakavarga SAV score (${sav11} points).`,
                direction: 'SUPPORTIVE',
                strength: 'LOW',
                weight: 0.6,
                whyEvidence: [`11th House SAV = ${sav11} points (Benchmark average: 28)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    if (sav2 !== undefined) {
        if (sav2 >= 30) {
            const item = createEvidenceItem({
                id: 'WEALTH-ASHTAKAVARGA-2ND-HIGH',
                domain: 'WEALTH',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-2ND',
                description: `2nd House of accumulated wealth holds strong Ashtakavarga SAV score (${sav2} points).`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 0.9,
                whyEvidence: [`2nd House SAV = ${sav2} points (Benchmark average: 28)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
        else if (sav2 < 25) {
            const item = createEvidenceItem({
                id: 'WEALTH-ASHTAKAVARGA-2ND-LOW',
                domain: 'WEALTH',
                sourceEngine: 'ashtakavarga-engine',
                sourceRuleId: 'SAV-2ND',
                description: `2nd House of accumulated wealth holds below-average Ashtakavarga SAV score (${sav2} points), indicating expenditure vigilance needed.`,
                direction: 'CHALLENGING',
                strength: 'MEDIUM',
                weight: 0.75,
                whyEvidence: [`2nd House SAV = ${sav2} points (Benchmark average: 28)`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    // 5. Occupants of 2nd & 11th Houses
    if (h11Fact?.planets?.length) {
        const item = createEvidenceItem({
            id: 'WEALTH-11TH-HOUSE-OCCUPANTS',
            domain: 'WEALTH',
            sourceEngine: 'astrology-core',
            sourceRuleId: 'WEALTH-004',
            description: `Planetary occupation in 11th House of gains (${h11Fact.planets.join(', ')}) supports productive income flow.`,
            direction: 'SUPPORTIVE',
            strength: 'MEDIUM',
            weight: 0.8,
            whyEvidence: [`11th House Occupants = ${h11Fact.planets.join(', ')}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    if (h2Fact?.planets?.length) {
        const benefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
        const hasBenefic = h2Fact.planets.some((p) => benefics.includes(p));
        const item = createEvidenceItem({
            id: 'WEALTH-2ND-HOUSE-OCCUPANTS',
            domain: 'WEALTH',
            sourceEngine: 'astrology-core',
            sourceRuleId: 'WEALTH-004',
            description: `Planets occupying 2nd House of wealth (${h2Fact.planets.join(', ')}) actively color savings and asset retention.`,
            direction: hasBenefic ? 'SUPPORTIVE' : 'NEUTRAL',
            strength: 'MEDIUM',
            weight: 0.7,
            whyEvidence: [`2nd House Occupants = ${h2Fact.planets.join(', ')}`],
        });
        evidenceItems.push(item);
        whyEvidence.push(...item.whyEvidence);
    }
    // 6. Dhana Yogas
    if (yogaAnalysis?.yogas) {
        const dhanaYogas = yogaAnalysis.yogas.filter((y) => ['Dhana Yoga', 'Laxmi Yoga', 'Vasumati Yoga', 'Chandra Mangala Yoga'].includes(y.name));
        for (const y of dhanaYogas) {
            const item = createEvidenceItem({
                id: `WEALTH-YOGA-${y.name.toUpperCase().replace(/\s+/g, '-')}`,
                domain: 'WEALTH',
                sourceEngine: 'yoga-engine',
                sourceRuleId: y.name,
                description: `Classical ${y.name} is present, indicating financial abundance & wealth accumulation potential.`,
                direction: 'SUPPORTIVE',
                strength: 'HIGH',
                weight: 1.0,
                whyEvidence: [`Yoga = ${y.name}`, `Category = ${y.category}`, `Description = ${y.description}`],
            });
            evidenceItems.push(item);
            whyEvidence.push(...item.whyEvidence);
        }
    }
    // 6. Dasha Context
    const dashaContextItems = [];
    const currentMD = dasha?.current?.mahadasha;
    const currentAD = dasha?.current?.antardasha;
    if (currentMD) {
        const mdLord = currentMD.lord;
        const isConnWealth = [2, 11, 5, 9].includes(analysis?.houseLordFacts?.find((hl) => hl.lord === mdLord)?.house);
        dashaContextItems.push({
            periodType: 'CURRENT_MAHADASHA',
            mahadashaLord: mdLord,
            antardashaLord: currentAD?.lord,
            domainRelevance: isConnWealth ? 'WEALTH_HOUSE_LORDSHIP' : 'GENERAL_DASHA_CONTEXT',
            nonPredictiveExplanation: `Current ${mdLord} Mahadasha activates wealth houses and financial themes.`,
        });
    }
    // 7. Transit Context
    const transitContextItems = [];
    const jupiterTransit = timing?.transits?.planets?.find((p) => p.planet === 'Jupiter');
    if (jupiterTransit) {
        transitContextItems.push({
            planet: 'Jupiter',
            currentSign: jupiterTransit.currentSign?.name || 'Current Sign',
            transitedHouseFromLagna: jupiterTransit.houseFromLagna,
            transitedHouseFromMoon: jupiterTransit.houseFromMoon || 1,
            bavPoints: jupiterTransit.bavPoints || 4,
            savPoints: jupiterTransit.savPoints || 28,
            classification: [2, 11, 5, 9].includes(jupiterTransit.houseFromLagna) ? 'SUPPORTIVE' : 'NEUTRAL',
            nonPredictiveExplanation: `Jupiter transits House ${jupiterTransit.houseFromLagna} relative to Lagna, highlighting wealth development opportunities.`,
        });
    }
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
        'yoga-engine',
        'dasha-engine',
        'timing-engine',
    ]);
    return {
        domain: 'WEALTH',
        title: 'Wealth & Asset Accumulation',
        summary: `Wealth analysis shows ${scoring.state.replace(/_/g, ' ')} indicators based on 2nd/11th house strength, Dhanakaraka Jupiter, and Ashtakavarga SAV distribution.`,
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
                role: 'Dhanakaraka & Wisdom Significator',
                sign: astrology?.planets?.find((p) => p.planet === 'Jupiter')?.sign?.name || 'N/A',
                house: astrology?.planets?.find((p) => p.planet === 'Jupiter')?.house || 1,
                dignity: astrology?.planets?.find((p) => p.planet === 'Jupiter')?.dignity || 'NEUTRAL',
                strengthScore: strengthAnalysis?.planets?.find((p) => p.planet === 'Jupiter')?.score || 0,
                shadbalaRatio: jupiterInfo.ratio || 1.0,
            },
            {
                planet: 'Venus',
                role: 'Asset & Prosperity Significator',
                sign: astrology?.planets?.find((p) => p.planet === 'Venus')?.sign?.name || 'N/A',
                house: astrology?.planets?.find((p) => p.planet === 'Venus')?.house || 1,
                dignity: astrology?.planets?.find((p) => p.planet === 'Venus')?.dignity || 'NEUTRAL',
                strengthScore: strengthAnalysis?.planets?.find((p) => p.planet === 'Venus')?.score || 0,
                shadbalaRatio: venusInfo.ratio || 1.0,
            },
        ],
        relevantHouses: [
            {
                house: 2,
                sign: analysis?.houseFacts?.find((h) => h.house === 2)?.sign?.name || 'N/A',
                lord: h2LordFact?.lord || 'N/A',
                lordDignity: h2LordFact?.dignity || 'N/A',
                occupants: analysis?.houseFacts?.find((h) => h.house === 2)?.planets || [],
            },
            {
                house: 11,
                sign: analysis?.houseFacts?.find((h) => h.house === 11)?.sign?.name || 'N/A',
                lord: h11LordFact?.lord || 'N/A',
                lordDignity: h11LordFact?.dignity || 'N/A',
                occupants: analysis?.houseFacts?.find((h) => h.house === 11)?.planets || [],
            },
        ],
        relevantYogas: yogaAnalysis?.yogas
            ? yogaAnalysis.yogas.map((y) => ({ name: y.name, category: y.category, relevance: y.description }))
            : [],
        divisionalEvidence: [],
        dashaContext: dashaContextItems,
        transitContext: transitContextItems,
        whyEvidence,
    };
}
//# sourceMappingURL=wealth.js.map