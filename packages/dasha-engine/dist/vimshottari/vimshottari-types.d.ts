import { PlanetLord } from './canonical-vimshottari.js';
export type DashaLevel = 'MAHADASHA' | 'ANTARDASHA' | 'PRATYANTARDASHA';
export interface StartingDashaBalance {
    moonLongitude: number;
    nakshatraIndex: number;
    nakshatraName: string;
    nakshatraLord: PlanetLord;
    positionInNakshatraDegree: number;
    progressPercentage: number;
    remainingPercentage: number;
    fullMahadashaYears: number;
    balanceYearsAtBirth: number;
    balanceDaysAtBirth: number;
}
export interface DashaPeriod {
    level: DashaLevel;
    lord: PlanetLord;
    start: Date;
    end: Date;
    parentLord?: PlanetLord;
    children?: DashaPeriod[];
    calculationMetadata?: {
        durationYears: number;
        durationDays: number;
        durationBasis?: string;
    };
}
export interface CurrentDashaResult {
    instant: Date;
    mahadasha?: DashaPeriod;
    antardasha?: DashaPeriod;
    pratyantardasha?: DashaPeriod;
}
//# sourceMappingURL=vimshottari-types.d.ts.map