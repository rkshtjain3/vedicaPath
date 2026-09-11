import { PERSONAL_STRENGTH_V1 } from '../profiles/personal-strength-v1.js';
import { CLASSICAL_PLANETS, calculateRelationshipMatrix, } from '../relationships/relationship-engine.js';
import { getHouseCategories } from '../house-strength/house-categories.js';
import { evaluateDignityStrength } from '../dignity/dignity-strength.js';
import { evaluateCombustionFactor, evaluateRetrogradeFactor, } from '../conditions/combustion-retrograde.js';
import { evaluateD1D9Comparison } from '../comparison/d1-d9-comparison.js';
export function calculateSinglePlanetStrength(planet, chart, analysis, relationships, d9Chart, profile = PERSONAL_STRENGTH_V1) {
    const factors = [];
    const pFact = analysis.planetFacts.find((p) => p.planet === planet);
    const houseNumber = pFact ? pFact.house : 1;
    const signLord = pFact ? getSignLordName(pFact.sign) : 'Sun';
    // 1. Sign Lord Panchadha Maitri Relationship
    const signLordRel = relationships[planet]?.[signLord];
    // 2. Dignity Factor
    const dignityResult = evaluateDignityStrength(planet, analysis, signLordRel, profile);
    factors.push(dignityResult.factor);
    // 3. House Placement Category Factors
    const houseCategories = getHouseCategories(houseNumber);
    if (houseCategories.includes('KENDRA')) {
        factors.push({
            id: `HOUSE_KENDRA_${planet.toUpperCase()}`,
            category: 'HOUSE',
            effect: 'SUPPORTIVE',
            scoreContribution: profile.weights.KENDRA_HOUSE,
            evidence: [
                `${planet} is in Kendra house ${houseNumber} (1st, 4th, 7th, or 10th).`,
                `Score Contribution: +${profile.weights.KENDRA_HOUSE}`,
            ],
        });
    }
    if (houseCategories.includes('TRIKONA') && houseNumber !== 1) {
        factors.push({
            id: `HOUSE_TRIKONA_${planet.toUpperCase()}`,
            category: 'HOUSE',
            effect: 'SUPPORTIVE',
            scoreContribution: profile.weights.TRIKONA_HOUSE,
            evidence: [
                `${planet} is in Trikona house ${houseNumber} (5th or 9th).`,
                `Score Contribution: +${profile.weights.TRIKONA_HOUSE}`,
            ],
        });
    }
    else if (houseNumber === 1) {
        factors.push({
            id: `HOUSE_TRIKONA_${planet.toUpperCase()}`,
            category: 'HOUSE',
            effect: 'SUPPORTIVE',
            scoreContribution: profile.weights.TRIKONA_HOUSE,
            evidence: [
                `${planet} is in Lagna (House 1 - Kendra & Trikona).`,
                `Score Contribution: +${profile.weights.TRIKONA_HOUSE}`,
            ],
        });
    }
    if (houseCategories.includes('UPACHAYA') && !houseCategories.includes('KENDRA')) {
        factors.push({
            id: `HOUSE_UPACHAYA_${planet.toUpperCase()}`,
            category: 'HOUSE',
            effect: 'SUPPORTIVE',
            scoreContribution: profile.weights.UPACHAYA_HOUSE,
            evidence: [
                `${planet} is in Upachaya house ${houseNumber} (3rd, 6th, 10th, or 11th).`,
                `Score Contribution: +${profile.weights.UPACHAYA_HOUSE}`,
            ],
        });
    }
    if (houseCategories.includes('DUSTHANA')) {
        factors.push({
            id: `HOUSE_DUSTHANA_${planet.toUpperCase()}`,
            category: 'HOUSE',
            effect: 'CHALLENGING',
            scoreContribution: profile.weights.DUSTHANA_HOUSE,
            evidence: [
                `${planet} is in Dusthana house ${houseNumber} (6th, 8th, or 12th).`,
                `Score Contribution: ${profile.weights.DUSTHANA_HOUSE}`,
            ],
        });
    }
    // 4. Combustion Factor
    const combustionFactor = evaluateCombustionFactor(planet, analysis, profile);
    if (combustionFactor) {
        factors.push(combustionFactor);
    }
    // 5. Retrograde Factor
    const retrogradeFactor = evaluateRetrogradeFactor(planet, analysis, profile);
    factors.push(retrogradeFactor);
    // 6. Aspect Influences
    const aspectingPlanets = analysis.aspects.filter((a) => a.targetPlanets.includes(planet));
    for (const asp of aspectingPlanets) {
        const isBenefic = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(asp.fromPlanet);
        const weight = isBenefic ? profile.weights.BENEFIC_ASPECT : profile.weights.MALEFIC_ASPECT;
        const effect = isBenefic ? 'SUPPORTIVE' : 'CHALLENGING';
        factors.push({
            id: `ASPECT_${asp.fromPlanet.toUpperCase()}_TO_${planet.toUpperCase()}`,
            category: 'ASPECT',
            effect,
            scoreContribution: weight,
            evidence: [
                `${planet} receives aspect from ${asp.fromPlanet} (Aspect ${asp.aspectNumber}).`,
                `Policy Effect: ${effect}. Score Contribution: ${weight > 0 ? '+' : ''}${weight}`,
            ],
        });
    }
    // 7. Conjunction Influences
    const conjunctions = analysis.conjunctions.filter((c) => (c.planetA === planet || c.planetB === planet) && c.detected);
    for (const conj of conjunctions) {
        const otherPlanet = conj.planetA === planet ? conj.planetB : conj.planetA;
        factors.push({
            id: `CONJUNCTION_${planet.toUpperCase()}_${otherPlanet.toUpperCase()}`,
            category: 'CONJUNCTION',
            effect: 'NEUTRAL',
            scoreContribution: 0,
            evidence: [
                `${planet} is conjunct ${otherPlanet} (Orb: ${conj.orb.toFixed(2)}°).`,
                `Policy Effect: NEUTRAL (No generic strength modifier).`,
            ],
        });
    }
    // 8. D1 & D9 Comparison & Vargottama Factor
    const comparison = evaluateD1D9Comparison(planet, analysis, d9Chart, profile);
    if (comparison.vargottamaFactor) {
        factors.push(comparison.vargottamaFactor);
    }
    // Calculate Total Score
    const totalScore = factors.reduce((sum, f) => sum + f.scoreContribution, 0);
    // Classify Overall Strength
    let overallStrength = 'MODERATE';
    if (totalScore >= profile.thresholds.VERY_STRONG) {
        overallStrength = 'VERY_STRONG';
    }
    else if (totalScore >= profile.thresholds.STRONG) {
        overallStrength = 'STRONG';
    }
    else if (totalScore >= profile.thresholds.MODERATE) {
        overallStrength = 'MODERATE';
    }
    else if (totalScore >= profile.thresholds.WEAK) {
        overallStrength = 'WEAK';
    }
    else {
        overallStrength = 'VERY_WEAK';
    }
    const isCombust = combustionFactor ? combustionFactor.effect === 'CHALLENGING' : false;
    const isRetro = pFact ? pFact.retrograde : false;
    return {
        planet,
        overallStrength,
        factors,
        score: totalScore,
        profileVersion: profile.version,
        d1Dignity: dignityResult.dignityName,
        d9Dignity: comparison.d9Sign ? `${planet} in ${comparison.d9Sign}` : undefined,
        house: houseNumber,
        houseCategories,
        isCombust,
        isRetrograde: isRetro,
        isVargottama: comparison.isVargottama,
    };
}
export function evaluateStrengthEngine(chart, analysis, d9Chart, profile = PERSONAL_STRENGTH_V1) {
    const relationships = calculateRelationshipMatrix(chart);
    const planets = CLASSICAL_PLANETS.map((p) => calculateSinglePlanetStrength(p, chart, analysis, relationships, d9Chart, profile));
    return {
        planets,
        relationships,
        profileVersion: profile.version,
    };
}
function getSignLordName(signName) {
    const map = {
        Aries: 'Mars',
        Taurus: 'Venus',
        Gemini: 'Mercury',
        Cancer: 'Moon',
        Leo: 'Sun',
        Virgo: 'Mercury',
        Libra: 'Venus',
        Scorpio: 'Mars',
        Sagittarius: 'Jupiter',
        Capricorn: 'Saturn',
        Aquarius: 'Saturn',
        Pisces: 'Jupiter',
    };
    return map[signName] || 'Sun';
}
