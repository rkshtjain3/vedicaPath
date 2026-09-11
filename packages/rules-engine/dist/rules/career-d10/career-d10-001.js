import { PERSONAL_CAREER_D10_RULES_V1 } from '../../profiles/career-d10-profile.js';
import { getD10HouseCategory } from './house-category-util.js';
import { RASHIS } from '@vedica/astrology-core';
import { calculatePlanetDignity } from '@vedica/analysis-engine';
export class D10Career001Rule {
    id = 'D10-CAREER-001';
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
        const d10LagnaSign = d10Chart.ascendant.sign;
        const tenthHouseObj = d10Chart.houses.find((h) => h.house === 10);
        const d10TenthSign = tenthHouseObj
            ? tenthHouseObj.sign
            : RASHIS[((d10LagnaSign.id + 10 - 2) % 12)];
        const tenthLord = d10TenthSign.ruler;
        const pos = d10Chart.planets[tenthLord];
        if (!pos) {
            return {
                ruleId: this.id,
                domain: 'CAREER_D10',
                triggered: false,
                effects: [],
                evidence: [],
                explanationKey: 'D10_10TH_LORD_NOT_FOUND',
            };
        }
        const d10LagnaSignId = d10LagnaSign.id;
        const house = ((pos.sign.id - d10LagnaSignId + 12) % 12) + 1;
        const houseCategory = getD10HouseCategory(house);
        const dummyFact = {
            planet: tenthLord,
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
        const effectClassification = profile.ruleEffects['D10-CAREER-001'][houseCategory] || 'NEUTRAL';
        const whyEvidence = [
            `D10 Lagna: ${d10LagnaSign.name}`,
            `D10 10th Sign: ${d10TenthSign.name}`,
            `10th Lord: ${tenthLord}`,
            `${tenthLord} is placed in: D10 House ${house} (${pos.sign.name})`,
            `Dignity: ${dignity.replace('_', ' ')}`,
            `House Category: ${houseCategory}`,
            `Classification: ${effectClassification}`,
        ];
        return {
            ruleId: this.id,
            domain: 'CAREER_D10',
            triggered: true,
            effects: [],
            evidence: [
                {
                    type: 'D10_10TH_LORD_PLACEMENT',
                    planet: tenthLord,
                    d10Sign: pos.sign.name,
                    d10House: house,
                    dignity,
                    houseCategory,
                    effectClassification,
                    whyEvidence,
                },
            ],
            explanationKey: 'D10_10TH_LORD_PLACEMENT_EVALUATED',
        };
    }
}
//# sourceMappingURL=career-d10-001.js.map