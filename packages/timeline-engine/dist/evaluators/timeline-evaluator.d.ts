import { TimelineAnalysisOutput } from '../types.js';
export interface EvaluateTimelineOptions {
    currentDate?: Date | string;
    historyYears?: number;
    futureYears?: number;
}
export declare function evaluateTimelineEngine(engineData: any, options?: EvaluateTimelineOptions): TimelineAnalysisOutput;
//# sourceMappingURL=timeline-evaluator.d.ts.map