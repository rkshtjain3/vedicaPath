import { PersonalAstrologyReport } from './types/report-types.js';
import { PersonalReportProfile } from './profiles/personal-report-profile.js';
export interface ReportInputData {
    chart: any;
    analysis: any;
    yogaAnalysis?: any;
    divisionalCharts?: any;
    vargaComparison?: any;
    strengthAnalysis?: any;
    shadbala?: any;
    ashtakavarga?: any;
    rules?: any;
    timing?: any;
    numerology?: any;
    lifeDomainAnalysis?: any;
    timelineAnalysis?: any;
    transitAnalysis?: any;
    natalDashaTransitConvergence?: any;
    crossChartAnalysis?: any;
}
export declare function generatePersonalReport(input: ReportInputData, profile?: PersonalReportProfile): PersonalAstrologyReport;
