import { YoginiMetadata, YoginiName } from './canonical-yogini.js';
import { CurrentYoginiDashaResult, StartingYoginiBalance, YoginiPeriod, YoginiDashaResult } from './yogini-types.js';
/**
 * Calculates starting Yogini Dasha balance at birth from Moon longitude.
 */
export declare function calculateBirthYoginiBalance(moonLongitude: number): StartingYoginiBalance;
/**
 * Helper to get canonical index of a Yogini in YOGINI_CYCLE (0..7)
 */
export declare function getYoginiIndex(yogini: YoginiName): number;
/**
 * Generates Antardashas for a Yogini Mahadasha.
 * In Yogini Dasha, each Mahadasha of M years contains 8 Antardashas starting from itself,
 * where each Antardasha duration = (M * A) / 36 years.
 */
export declare function generateYoginiAntardashas(mahadashaYogini: YoginiMetadata, fullMahadashaYears: number, mahadashaStart: Date, mahadashaEnd: Date): YoginiPeriod[];
/**
 * Generates full sequence of Yogini Mahadashas (with Antardashas) starting from birth.
 * By default computes 3 full cycles (3 * 36 = 108 years).
 */
export declare function generateYoginiDashas(input: {
    birthInstant: Date;
    moonLongitude: number;
    cycles?: number;
}): {
    balance: StartingYoginiBalance;
    mahadashas: YoginiPeriod[];
};
/**
 * Resolves current active Yogini Mahadasha and Antardasha for any instant.
 */
export declare function getCurrentYoginiDasha(input: {
    mahadashas: YoginiPeriod[];
    instant: Date;
}): CurrentYoginiDashaResult;
/**
 * Complete Yogini Dasha calculation bundle.
 */
export declare function calculateYoginiDasha(input: {
    birthInstant: Date;
    moonLongitude: number;
    targetInstant?: Date;
    cycles?: number;
}): YoginiDashaResult;
//# sourceMappingURL=yogini-calculator.d.ts.map