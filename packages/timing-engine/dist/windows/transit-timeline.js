import { TransitCalculationEngine } from '../transit/transit-calculator.js';
import { evaluateTransitRules } from '../transit/transit-rules.js';
export async function calculateTransitTimelineSteps(params) {
    const { chart, start, end, profile, stepDays = 14, engine = new TransitCalculationEngine() } = params;
    const dates = [];
    const curr = new Date(start);
    while (curr <= end) {
        dates.push(new Date(curr));
        curr.setDate(curr.getDate() + stepDays);
    }
    const steps = await Promise.all(dates.map(async (d) => {
        const transits = await engine.calculateTransit(d, chart);
        const allEvals = evaluateTransitRules(transits, profile);
        return {
            date: d,
            allEvals,
        };
    }));
    return steps;
}
export async function getDomainTransitTimeline(params) {
    const { chart, domain, start, end, profile, stepDays = 7, engine, precalculatedSteps } = params;
    const steps = precalculatedSteps || await calculateTransitTimelineSteps({ chart, start, end, profile, stepDays, engine });
    const windows = [];
    let prevEvalKey = '';
    let windowStart = new Date(start);
    let currentEvals = [];
    let currentScore = 0;
    for (let i = 0; i < steps.length; i++) {
        const { date, allEvals } = steps[i];
        const domainEvals = allEvals.filter((e) => e.domain === domain);
        const triggeredRules = domainEvals
            .filter((e) => e.triggered)
            .map((e) => e.ruleId)
            .sort()
            .join(',');
        let score = 0;
        for (const ev of domainEvals) {
            if (ev.triggered) {
                for (const ef of ev.effects) {
                    score += ef.value;
                }
            }
        }
        if (triggeredRules !== prevEvalKey) {
            if (prevEvalKey !== '') {
                windows.push({
                    start: windowStart.toISOString(),
                    end: new Date(date.getTime() - 24 * 3600 * 1000).toISOString(),
                    evaluations: currentEvals,
                    score: currentScore,
                });
            }
            windowStart = new Date(date);
            prevEvalKey = triggeredRules;
            currentEvals = domainEvals;
            currentScore = score;
        }
    }
    if (windowStart <= end) {
        windows.push({
            start: windowStart.toISOString(),
            end: end.toISOString(),
            evaluations: currentEvals,
            score: currentScore,
        });
    }
    return windows;
}
//# sourceMappingURL=transit-timeline.js.map