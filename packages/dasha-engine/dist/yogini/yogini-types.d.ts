import { PlanetLord } from '../vimshottari/canonical-vimshottari.js';
import { YoginiMetadata, YoginiName } from './canonical-yogini.js';
export type YoginiDashaLevel = 'MAHADASHA' | 'ANTARDASHA';
export interface StartingYoginiBalance {
    moonLongitude: number;
    nakshatraIndex: number;
    nakshatraName: string;
    startingYogini: YoginiMetadata;
    positionInNakshatraDegree: number;
    progressPercentage: number;
    remainingPercentage: number;
    fullMahadashaYears: number;
    balanceYearsAtBirth: number;
    balanceDaysAtBirth: number;
}
export interface YoginiPeriod {
    level: YoginiDashaLevel;
    yogini: YoginiName;
    hindiName: string;
    sanskritName: string;
    lord: PlanetLord;
    nature: 'BENEFIC' | 'MALEFIC';
    deity: string;
    significations: string;
    start: Date;
    end: Date;
    parentYogini?: YoginiName;
    children?: YoginiPeriod[];
    calculationMetadata?: {
        durationYears: number;
        durationDays: number;
        durationBasis?: string;
    };
}
export interface CurrentYoginiDashaResult {
    instant: Date;
    mahadasha?: YoginiPeriod;
    antardasha?: YoginiPeriod;
}
export interface YoginiDashaResult {
    balance: StartingYoginiBalance;
    mahadashas: YoginiPeriod[];
    current: CurrentYoginiDashaResult;
    totalCycles: number;
}
//# sourceMappingURL=yogini-types.d.ts.map