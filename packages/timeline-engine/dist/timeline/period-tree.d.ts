import { TimelinePeriod } from '../types.js';
export declare function filterTimelineByDateWindow(periods: TimelinePeriod[], windowStart: Date, windowEnd: Date): TimelinePeriod[];
export declare function findCurrentActiveHierarchy(periods: TimelinePeriod[]): {
    mahadasha?: TimelinePeriod;
    antardasha?: TimelinePeriod;
    pratyantardasha?: TimelinePeriod;
};
//# sourceMappingURL=period-tree.d.ts.map