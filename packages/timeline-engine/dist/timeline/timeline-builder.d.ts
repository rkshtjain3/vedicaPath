import { TimelinePeriod } from '../types.js';
export interface BuildTimelineOptions {
    currentDate?: Date;
    historyYears?: number;
    futureYears?: number;
}
export declare function buildMultiLevelTimeline(engineData: any, options?: BuildTimelineOptions): {
    targetDate: Date;
    allMahadashas: TimelinePeriod[];
    boundedTimeline: TimelinePeriod[];
};
//# sourceMappingURL=timeline-builder.d.ts.map