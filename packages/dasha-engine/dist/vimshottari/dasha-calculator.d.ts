import { PlanetLord } from './canonical-vimshottari.js';
import { CurrentDashaResult, DashaPeriod, StartingDashaBalance } from './vimshottari-types.js';
export declare const MS_PER_JULIAN_YEAR: number;
/**
 * Calculates starting Dasha balance from Moon's sidereal longitude (0 - 360).
 */
export declare function calculateBirthDashaBalance(moonLongitude: number): StartingDashaBalance;
/**
 * Helper to get canonical index of a lord in VIMSHOTTARI_CYCLE (0..8)
 */
export declare function getLordIndex(lord: PlanetLord): number;
/**
 * Generates Pratyantardashas for an Antardasha period.
 */
export declare function generatePratyantardashas(antardashaLord: PlanetLord, antardashaDurationYears: number, antardashaStart: Date): DashaPeriod[];
/**
 * Generates Antardashas for a Mahadasha period.
 */
export declare function generateAntardashas(mahadashaLord: PlanetLord, fullMahadashaYears: number, mahadashaStart: Date, mahadashaEnd: Date): DashaPeriod[];
/**
 * Generates full sequence of Mahadashas (with Antardashas and Pratyantardashas) starting from birth.
 */
export declare function generateMahadashas(input: {
    birthInstant: Date;
    moonLongitude: number;
}): {
    balance: StartingDashaBalance;
    mahadashas: DashaPeriod[];
};
/**
 * Resolves current active Mahadasha, Antardasha, and Pratyantardasha for any instant.
 */
export declare function getCurrentDasha(input: {
    mahadashas: DashaPeriod[];
    instant: Date;
}): CurrentDashaResult;
//# sourceMappingURL=dasha-calculator.d.ts.map