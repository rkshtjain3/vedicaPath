import { PERSONAL_CAREER_D10_RULES_V1 } from '../../profiles/career-d10-profile.js';
import { RASHIS } from '@vedica/astrology-core';
import { calculatePlanetDignity } from '@vedica/analysis-engine';
export class D10Career002Rule {
    id = 'D10-CAREER-002';
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
        const effectClassification = profile.ruleEffects['D10-CAREER-002'][dignity] || 'NEUTRAL';
        const whyEvidence = [
            `D10 10th Lord: ${tenthLord}`,
            `Placed in D10 Sign: ${pos.sign.name} (House ${house})`,
            `Dignity Classification: ${dignity}`,
            `Effect Classification: ${effectClassification}`,
        ];
        return {
            ruleId: this.id,
            domain: 'CAREER_D10',
            triggered: true,
            effects: [],
            evidence: [
                {
                    type: 'D10_10TH_LORD_DIGNITY',
                    planet: tenthLord,
                    dignity,
                    effectClassification,
                    whyEvidence,
                },
            ],
            explanationKey: 'D10_10TH_LORD_DIGNITY_EVALUATED',
        };
    }
}
//# sourceMappingURL=career-d10-002.js.map