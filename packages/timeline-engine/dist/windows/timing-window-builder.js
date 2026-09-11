import { calculateTimingScoring } from '../shared/scoring.js';
import { classifyTimingWindowContext } from './window-classifier.js';
import { detectConflictPairs } from '../shared/conflict-detector.js';
import { buildTransitContextOverlay } from '../transit/transit-context.js';
import { filterEvidenceByDomain } from './overlap-detector.js';
export function buildTimingWindowsForPeriod(period, engineData) {
    const domains = [
        'CAREER',
        'WEALTH',
        'RELATIONSHIPS',
        'HEALTH',
        'EDUCATION',
        'PROPERTY',
        'SPIRITUALITY',
    ];
    const windows = [];
    const transitOverlay = buildTransitContextOverlay(engineData);
    for (const dom of domains) {
        const domEvidence = filterEvidenceByDomain(period.evidence || [], dom);
        const scoring = calculateTimingScoring(domEvidence);
        const contextClass = classifyTimingWindowContext(scoring);
        const conflictingPairs = detectConflictPairs(domEvidence);
        const supportingFactors = domEvidence.filter((e) => e.direction === 'SUPPORTIVE');
        const challengingFactors = domEvidence.filter((e) => e.direction === 'CHALLENGING');
        const whyEvidence = [
            `Domain: ${dom}`,
            `Period: ${period.id} (${period.lord})`,
            `Context Classification: ${contextClass}`,
            `Support Score: +${scoring.supportScore}`,
            `Challenge Score: -${scoring.challengeScore}`,
            ...domEvidence.flatMap((e) => e.whyEvidence),
        ];
        windows.push({
            id: `WINDOW-${period.id}-${dom}`,
            startDate: period.startDate,
            endDate: period.endDate,
            durationDays: period.durationDays,
            contextClass,
            domain: dom,
            activeLords: [period.lord],
            supportScore: scoring.supportScore,
            challengeScore: scoring.challengeScore,
            neutralScore: scoring.neutralScore,
            evidenceCount: domEvidence.length,
            supportingFactors,
            challengingFactors,
            mixedSignalsPreserved: conflictingPairs.length > 0,
            conflictingPairs: conflictingPairs.length > 0 ? conflictingPairs : undefined,
            transitContext: transitOverlay,
            whyEvidence,
        });
    }
    return windows;
}
//# sourceMappingURL=timing-window-builder.js.map