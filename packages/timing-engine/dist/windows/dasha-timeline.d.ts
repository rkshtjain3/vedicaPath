import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { BirthChart } from '@vedica/astrology-core';
import { DashaPeriod } from '@vedica/dasha-engine';
import { TimingProfile } from '../profiles/timing-profile.js';
import { DomainTimelinePeriod, TimingDomain } from '../types/timing-types.js';
export declare function getDomainDashaTimeline(params: {
    chart: BirthChart;
    analysis: ChartAnalysisResult;
    mahadashas: DashaPeriod[];
    domain: TimingDomain;
    start: Date;
    end: Date;
    profile: TimingProfile;
}): DomainTimelinePeriod[];
//# sourceMappingURL=dasha-timeline.d.ts.map