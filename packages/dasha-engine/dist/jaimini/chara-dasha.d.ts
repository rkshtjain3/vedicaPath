import { BirthChart } from '@vedica/astrology-core';
export interface CharaAntardashaPeriod {
    rashiIndex: number;
    rashiName: string;
    start: Date;
    end: Date;
    durationMonths: number;
}
export interface CharaDashaEvidence {
    rashiIndex: number;
    rashiName: string;
    isDirect: boolean;
    signLord: string;
    lordSignIndex: number;
    lordSignName: string;
    lordDistance: number;
    durationYears: number;
    reasoning: string;
    reasoningHi: string;
}
export interface CharaDashaPeriod {
    rashiIndex: number;
    rashiName: string;
    start: Date;
    end: Date;
    durationYears: number;
    evidence: CharaDashaEvidence;
    antardashas?: CharaAntardashaPeriod[];
}
export interface CharaDashaResult {
    periods: CharaDashaPeriod[];
    lagnaSign: string;
    lagnaDirection: 'DIRECT' | 'REVERSE';
    calculationMethod: string;
    profileVersion: 'personal-jaimini-v1';
}
export declare function calculateCharaDasha(chart: BirthChart, birthInstant?: Date): CharaDashaResult;
//# sourceMappingURL=chara-dasha.d.ts.map