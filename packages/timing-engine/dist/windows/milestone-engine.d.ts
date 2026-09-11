import { BirthChart } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
import { DashaPeriod } from '@vedica/dasha-engine';
export interface LifeMilestoneWindow {
    id: string;
    category: 'PROPERTY' | 'MARRIAGE' | 'CAREER_ELEVATION' | 'RELOCATION' | 'WEALTH_WINDFALL';
    title: string;
    titleHi: string;
    description: string;
    descriptionHi: string;
    startDate: string;
    endDate: string;
    confidence: 'HIGH' | 'MODERATE' | 'FAVORABLE';
    confidenceLabel: string;
    confidenceLabelHi: string;
    supportingFactors: string[];
    supportingFactorsHi: string[];
    astrologicalBasis: string;
    astrologicalBasisHi: string;
}
export interface MilestoneEngineResult {
    propertyWindows: LifeMilestoneWindow[];
    marriageWindows: LifeMilestoneWindow[];
    careerWindows: LifeMilestoneWindow[];
    relocationWindows: LifeMilestoneWindow[];
    nextMajorMilestone: LifeMilestoneWindow | null;
}
export declare function calculateLifeMilestones(params: {
    chart: BirthChart;
    analysis: ChartAnalysisResult;
    mahadashas: DashaPeriod[];
    currentDate?: Date;
}): MilestoneEngineResult;
//# sourceMappingURL=milestone-engine.d.ts.map