import { RASHIS } from '@vedica/astrology-core';
import { calculatePlanetDignity } from '@vedica/analysis-engine';
/**
 * Calculates factual career cross-chart relationships between D1 Natal Rashi and D10 Dashamsa charts.
 * Produces machine-readable facts with step-by-step calculation trace evidence ("WHY?" evidence).
 * Does NOT generate predictive statements or generic horoscopes.
 */
export function calculateCareerCrossChartFacts(birthChart, d10Chart, d1Analysis, d9Chart, strengthScores) {
    const d1LagnaSignId = birthChart.lagna.sign.id;
    const d10LagnaSignId = d10Chart.ascendant.sign.id;
    // Helper: Get sign for house H in whole sign houses from Lagna ID
    const getHouseSign = (lagnaId, houseNum) => {
        const signId = ((lagnaId + houseNum - 2) % 12) + 1;
        return RASHIS[signId - 1];
    };
    // Helper: Get planet placement and dignity in D1
    const getD1PlanetFact = (planet) => {
        const fact = d1Analysis.planetFacts.find((f) => f.planet === planet);
        const dig = d1Analysis.dignities.find((d) => d.planet === planet);
        const pPos = birthChart.planets.find((p) => p.planet === planet);
        const sign = pPos ? pPos.sign : RASHIS[0];
        const house = fact ? fact.house : 1;
        const dignity = dig ? dig.primaryDignity : 'N/A';
        return { planet, sign, house, dignity };
    };
    // Helper: Get planet placement and dignity in D10
    const getD10PlanetFact = (planet) => {
        const pos = d10Chart.planets[planet];
        if (!pos) {
            return { planet, sign: RASHIS[0], house: 1, dignity: 'N/A' };
        }
        const house = ((pos.sign.id - d10LagnaSignId + 12) % 12) + 1;
        const dummyFact = {
            planet,
            longitude: pos.absoluteLongitude,
            sign: pos.sign.name,
            degreeInSign: pos.longitudeInSign,
            house,
            nakshatra: '',
            pada: 1,
            retrograde: false,
        };
        const dignityResult = calculatePlanetDignity(dummyFact);
        return { planet, sign: pos.sign, house, dignity: dignityResult.primaryDignity };
    };
    // 1. D1 10th House & Lords
    const d1TenthSign = getHouseSign(d1LagnaSignId, 10);
    const d1TenthLordName = d1TenthSign.ruler;
    const d1TenthHouseOccupants = d1Analysis.planetFacts
        .filter((f) => f.house === 10)
        .map((f) => f.planet);
    const d1TenthLord = getD1PlanetFact(d1TenthLordName);
    const d1SixthSign = getHouseSign(d1LagnaSignId, 6);
    const d1SixthLord = getD1PlanetFact(d1SixthSign.ruler);
    const d1EleventhSign = getHouseSign(d1LagnaSignId, 11);
    const d1EleventhLord = getD1PlanetFact(d1EleventhSign.ruler);
    // 2. D10 10th House & Lords
    const d10TenthHouseObj = d10Chart.houses.find((h) => h.house === 10);
    const d10TenthSign = d10TenthHouseObj ? d10TenthHouseObj.sign : getHouseSign(d10LagnaSignId, 10);
    const d10TenthLordName = d10TenthSign.ruler;
    const d10TenthHouseOccupants = d10TenthHouseObj ? d10TenthHouseObj.occupants : [];
    const d10TenthLord = getD10PlanetFact(d10TenthLordName);
    const d10SixthSign = getHouseSign(d10LagnaSignId, 6);
    const d10SixthLord = getD10PlanetFact(d10SixthSign.ruler);
    const d10EleventhSign = getHouseSign(d10LagnaSignId, 11);
    const d10EleventhLord = getD10PlanetFact(d10EleventhSign.ruler);
    // 3. Select Key Career Planets for Cross-Chart Matrix
    // Core career significators: Sun, Saturn, Jupiter + D1 10th Lord + D10 10th Lord
    const candidatePlanets = ['Sun', 'Saturn', 'Jupiter'];
    if (!candidatePlanets.includes(d1TenthLordName))
        candidatePlanets.push(d1TenthLordName);
    if (!candidatePlanets.includes(d10TenthLordName))
        candidatePlanets.push(d10TenthLordName);
    const crossChartPlanets = candidatePlanets.map((planet) => {
        const d1Fact = getD1PlanetFact(planet);
        const d10Fact = getD10PlanetFact(planet);
        const sameD1D10Sign = d1Fact.sign.id === d10Fact.sign.id;
        // Check traditional Vargottama (D1 sign === D9 sign)
        let vargottama = false;
        if (d9Chart && d9Chart.planets[planet]) {
            vargottama = d1Fact.sign.id === d9Chart.planets[planet].sign.id;
        }
        const strength = strengthScores ? strengthScores[planet] : undefined;
        // Build step-by-step WHY evidence trace
        const whyEvidence = [
            `D1 Placement: ${planet} is in ${d1Fact.sign.name} (House ${d1Fact.house}) with ${d1Fact.dignity} dignity.`,
            `D10 Placement: ${planet} is in ${d10Fact.sign.name} (House ${d10Fact.house}) with ${d10Fact.dignity} dignity in Dashamsa.`,
            `Same D1/D10 Sign: ${sameD1D10Sign ? 'YES' : 'NO'}.`,
        ];
        if (planet === d1TenthLordName) {
            whyEvidence.push(`Role in D1: ${planet} is the ruler of D1 10th house (${d1TenthSign.name}).`);
        }
        if (planet === d10TenthLordName) {
            whyEvidence.push(`Role in D10: ${planet} is the ruler of D10 10th house (${d10TenthSign.name}).`);
        }
        if (vargottama) {
            whyEvidence.push(`Vargottama Status: ${planet} is Vargottama (same sign in D1 Rashi and D9 Navamsa).`);
        }
        if (strength) {
            whyEvidence.push(`D1 Strength Engine Score: ${strength.totalScore} pts (${strength.classification}).`);
        }
        return {
            planet,
            d1Sign: d1Fact.sign,
            d1House: d1Fact.house,
            d1Dignity: d1Fact.dignity,
            d10Sign: d10Fact.sign,
            d10House: d10Fact.house,
            d10Dignity: d10Fact.dignity,
            sameD1D10Sign,
            vargottama,
            d1StrengthScore: strength?.totalScore,
            d1StrengthClassification: strength?.classification,
            whyEvidence,
        };
    });
    return {
        d1TenthHouse: {
            sign: d1TenthSign,
            lord: d1TenthLordName,
            occupants: d1TenthHouseOccupants,
        },
        d10TenthHouse: {
            sign: d10TenthSign,
            lord: d10TenthLordName,
            occupants: d10TenthHouseOccupants,
        },
        d1TenthLord,
        d10TenthLord,
        d1SixthLord,
        d10SixthLord,
        d1EleventhLord,
        d10EleventhLord,
        d10Ascendant: {
            sign: d10Chart.ascendant.sign,
            lord: d10Chart.ascendant.sign.ruler,
        },
        crossChartPlanets,
    };
}
