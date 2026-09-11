import { BirthChart } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
export interface StruggleCause {
    code: string;
    category: 'DASHA_DUSTHANA' | 'SADE_SATI' | 'ASHTAMA_SHANI' | 'RAHU_KETU_AXIS' | 'LOW_ASHTAKAVARGA' | 'COMBUST_DEBILITATED';
    title: string;
    titleHi: string;
    severity: 'HIGH' | 'MODERATE' | 'MILD';
    explanation: string;
    explanationHi: string;
    astrologicalDetail: string;
}
export interface StruggleDiagnosticResult {
    hasActiveTurbulence: boolean;
    statusHeadline: string;
    statusHeadlineHi: string;
    rootExplanation: string;
    rootExplanationHi: string;
    karmicLesson: string;
    karmicLessonHi: string;
    activeCauses: StruggleCause[];
    reliefDate: string;
    reliefTimelineSummary: string;
    reliefTimelineSummaryHi: string;
    actionProtocol: Array<{
        category: 'MINDSET' | 'ACTION' | 'SATTVIC_PRACTICE';
        title: string;
        titleHi: string;
        description: string;
        descriptionHi: string;
    }>;
}
export declare function diagnoseStruggleAndFailure(params: {
    chart: BirthChart;
    analysis: ChartAnalysisResult;
    currentDasha?: any;
    ashtakavarga?: any;
    transitAnalysis?: any;
    currentDate?: Date;
}): StruggleDiagnosticResult;
//# sourceMappingURL=failure-diagnostic-engine.d.ts.map