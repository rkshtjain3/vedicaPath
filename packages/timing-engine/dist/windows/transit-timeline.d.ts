import { BirthChart } from '@vedica/astrology-core';
import { TransitCalculationEngine } from '../transit/transit-calculator.js';
import { TimingProfile } from '../profiles/timing-profile.js';
import { TimingDomain, TransitEvaluation } from '../types/timing-types.js';
export interface TransitTimelineWindow {
    start: string;
    end: string;
    evaluations: TransitEvaluation[];
    score: number;
}
export interface TransitTimelineStep {
    date: Date;
    allEvals: TransitEvaluation[];
}
export declare function calculateTransitTimelineSteps(params: {
    chart: BirthChart;
    start: Date;
    end: Date;
    profile: TimingProfile;
    stepDays?: number;
    engine?: TransitCalculationEngine;
}): Promise<TransitTimelineStep[]>;
export declare function getDomainTransitTimeline(params: {
    chart: BirthChart;
    domain: TimingDomain;
    start: Date;
    end: Date;
    profile: TimingProfile;
    stepDays?: number;
    engine?: TransitCalculationEngine;
    precalculatedSteps?: TransitTimelineStep[];
}): Promise<TransitTimelineWindow[]>;
//# sourceMappingURL=transit-timeline.d.ts.map