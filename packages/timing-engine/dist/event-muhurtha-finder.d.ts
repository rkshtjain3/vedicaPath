import { BirthChart } from '@vedica/astrology-core';
export type AuspiciousIntention = 'BUSINESS_LAUNCH' | 'PROPERTY_PURCHASE' | 'TRAVEL' | 'MEDICAL_PROCEDURE';
export interface AuspiciousWindow {
    date: string;
    tithiName: string;
    nakshatraName: string;
    varaName: string;
    suitabilityScore: number;
    quality: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'CAUTION';
    reason: string;
    recommendedTimeWindow: string;
}
export interface AuspiciousSearchOptions {
    intention: AuspiciousIntention;
    startDateIso: string;
    horizonDays?: number;
}
export declare function findAuspiciousWindows(chart: BirthChart, options: AuspiciousSearchOptions): AuspiciousWindow[];
//# sourceMappingURL=event-muhurtha-finder.d.ts.map