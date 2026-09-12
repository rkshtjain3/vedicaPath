import { BirthChart } from '@vedica/astrology-core';
export interface CharaDashaPeriod {
    rashiIndex: number;
    rashiName: string;
    start: Date;
    end: Date;
    durationYears: number;
}
export interface CharaDashaResult {
    periods: CharaDashaPeriod[];
    calculationMethod: string;
}
export declare function calculateCharaDasha(chart: BirthChart, birthInstant?: Date): CharaDashaResult;
//# sourceMappingURL=chara-dasha.d.ts.map