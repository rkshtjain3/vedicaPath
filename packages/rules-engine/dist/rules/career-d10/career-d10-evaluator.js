import { PERSONAL_CAREER_D10_RULES_V1 } from '../../profiles/career-d10-profile.js';
import { D10Career001Rule } from './career-d10-001.js';
import { D10Career002Rule } from './career-d10-002.js';
import { D10Career003Rule } from './career-d10-003.js';
import { D10Career004Rule } from './career-d10-004.js';
import { D10Career005Rule } from './career-d10-005.js';
import { calculateCareerCrossChartFacts } from '@vedica/divisional-chart-engine';
export function evaluateCareerD10Rules(context, profile = PERSONAL_CAREER_D10_RULES_V1) {
    const rulesList = [
        new D10Career001Rule(),
        new D10Career002Rule(),
        new D10Career003Rule(),
        new D10Career004Rule(),
        new D10Career005Rule(),
    ];
    const evaluations = [];
    const supportiveEvidence = [];
    const challengingEvidence = [];
    const neutralEvidence = [];
    for (const rule of rulesList) {
        const evalRes = rule.evaluate(context, profile);
        evaluations.push(evalRes);
        for (const ev of evalRes.evidence) {
            if (ev.effectClassification === 'SUPPORTIVE') {
                supportiveEvidence.push(ev);
            }
            else if (ev.effectClassification === 'CHALLENGING') {
                challengingEvidence.push(ev);
            }
            else {
                neutralEvidence.push(ev);
            }
        }
    }
    const mixedSignals = supportiveEvidence.length > 0 && challengingEvidence.length > 0;
    // Extract Summary Facts
    let summaryFacts = {
        d10LagnaSign: 'N/A',
        d10LagnaLord: 'N/A',
        d10TenthSign: 'N/A',
        d10TenthLord: 'N/A',
        d1TenthLord: 'N/A',
        sameTenthLord: false,
        d10TenthLordHouse: 0,
        d10TenthLordDignity: 'N/A',
        d10TenthLordHouseCategory: 'N/A',
        d10LagnaLordHouse: 0,
        d10LagnaLordDignity: 'N/A',
        d10LagnaLordHouseCategory: 'N/A',
        karakas: [],
    };
    if (context.chart && context.d10Chart && context.analysis) {
        const crossFacts = context.careerCrossChart ||
            calculateCareerCrossChartFacts(context.chart, context.d10Chart, context.analysis, context.d9Chart);
        const ev001 = evaluations.find((e) => e.ruleId === 'D10-CAREER-001')?.evidence[0];
        const ev003 = evaluations.find((e) => e.ruleId === 'D10-CAREER-003')?.evidence[0];
        const ev004List = evaluations.find((e) => e.ruleId === 'D10-CAREER-004')?.evidence || [];
        summaryFacts = {
            d10LagnaSign: crossFacts.d10Ascendant.sign.name,
            d10LagnaLord: crossFacts.d10Ascendant.lord,
            d10TenthSign: crossFacts.d10TenthHouse.sign.name,
            d10TenthLord: crossFacts.d10TenthHouse.lord,
            d1TenthLord: crossFacts.d1TenthHouse.lord,
            sameTenthLord: crossFacts.d1TenthHouse.lord === crossFacts.d10TenthHouse.lord,
            d10TenthLordHouse: ev001?.d10House || crossFacts.d10TenthLord.house,
            d10TenthLordDignity: ev001?.dignity || crossFacts.d10TenthLord.dignity,
            d10TenthLordHouseCategory: ev001?.houseCategory || 'N/A',
            d10LagnaLordHouse: ev003?.d10House || 0,
            d10LagnaLordDignity: ev003?.dignity || 'N/A',
            d10LagnaLordHouseCategory: ev003?.houseCategory || 'N/A',
            karakas: ev004List.map((k) => ({
                planet: k.planet,
                d10House: k.d10House,
                sign: k.sign,
                dignity: k.dignity,
                houseCategory: k.houseCategory,
            })),
        };
    }
    return {
        profileVersion: profile.version,
        rules: evaluations,
        supportiveEvidence,
        challengingEvidence,
        neutralEvidence,
        mixedSignals,
        summaryFacts,
    };
}
//# sourceMappingURL=career-d10-evaluator.js.map