import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { BirthChart } from '@vedica/astrology-core';
import { DashaPeriod } from '@vedica/dasha-engine';
import { TransitTimelineStep } from './transit-timeline.js';
import { TimingProfile } from '../profiles/timing-profile.js';
import { CombinedActivityWindow, TimingDomain, TimingEngineResult } from '../types/timing-types.js';
import { TransitCalculationEngine } from '../transit/transit-calculator.js';
export declare function getCombinedTimeline(params: {
    chart: BirthChart;
    analysis: ChartAnalysisResult;
    mahadashas: DashaPeriod[];
    domain: TimingDomain;
    start: Date;
    end: Date;
    profile: TimingProfile;
    engine?: TransitCalculationEngine;
    precalculatedSteps?: TransitTimelineStep[];
}): Promise<CombinedActivityWindow[]>;
export declare function evaluateTimingEngine(params: {
    chart: BirthChart;
    analysis: ChartAnalysisResult;
    dasha: {
        mahadashas: DashaPeriod[];
        current?: any;
    };
    instant?: Date;
    profile: TimingProfile;
}): Promise<TimingEngineResult>;
//# sourceMappingURL=combined-timeline.d.ts.map