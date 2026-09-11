import { NakshatraDetails, PlanetName } from '../types/astrology.js';
export interface NakshatraDefinition {
    id: number;
    name: string;
    ruler: PlanetName;
}
export declare const NAKSHATRAS: NakshatraDefinition[];
export declare function getNakshatraFromLongitude(longitude: number): NakshatraDetails;
//# sourceMappingURL=nakshatra-util.d.ts.map