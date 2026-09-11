import { PERSONAL_CAREER_D10_RULES_V1 } from '../../profiles/career-d10-profile.js';
import { getD10HouseCategory } from './house-category-util.js';
import { calculatePlanetDignity } from '@vedica/analysis-engine';
export class D10Career004Rule {
    id = 'D10-CAREER-004';
    domain = 'CAREER_D10';
    version = '1.0.0';
    evaluate(context, profile = PERSONAL_CAREER_D10_RULES_V1) {
        const { d10Chart } = context;
        if (!d10Chart) {
            return {
                ruleId: this.id,
                domain: 'CAREER_D10',
                triggered: false,
                effects: [],
                evidence: [],
                explanationKey: 'D10_CHART_NOT_PROVIDED',
            };
        }
        const karakaPlanets = ['Sun', 'Saturn', 'Jupiter'];
        const d10LagnaSignId = d10Chart.ascendant.sign.id;
        const evidenceList = [];
        for (const planet of karakaPlanets) {
            const pos = d10Chart.planets[planet];
            if (!pos)
                continue;
            const house = ((pos.sign.id - d10LagnaSignId + 12) % 12) + 1;
            const houseCategory = getD10HouseCategory(house);
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
            const dignity = dignityResult.primaryDignity;
            const effectClassification = profile.ruleEffects['D10-CAREER-004'][dignity] || 'NEUTRAL';
            const whyEvidence = [
                `Career Karaka: ${planet}`,
                `D10 Placement: House ${house} (${pos.sign.name})`,
                `Dignity: ${dignity.replace('_', ' ')}`,
                `House Category: ${houseCategory}`,
                `Classification: ${effectClassification}`,
            ];
            evidenceList.push({
                type: 'D10_CAREER_KARAKA_PLACEMENT',
                planet,
                d10House: house,
                sign: pos.sign.name,
                dignity,
                houseCategory,
                effectClassification,
                whyEvidence,
            });
        }
        return {
            ruleId: this.id,
            domain: 'CAREER_D10',
            triggered: true,
            effects: [],
            evidence: evidenceList,
            explanationKey: 'D10_CAREER_KARAKAS_EVALUATED',
        };
    }
}
//# sourceMappingURL=career-d10-004.js.map