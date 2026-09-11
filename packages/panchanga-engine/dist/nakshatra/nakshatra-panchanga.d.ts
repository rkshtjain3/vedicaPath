import { PlanetName } from '@vedica/astrology-core';
import { NakshatraPanchangaFact } from '../types/panchanga-types.js';
interface NakshatraMeta {
    index: number;
    name: string;
    sanskritName: string;
    lord: PlanetName;
    deity: string;
    gana: 'Deva' | 'Manushya' | 'Rakshasa';
    animal: string;
}
export declare const NAKSHATRA_METADATA: NakshatraMeta[];
export declare function calculateNakshatraPanchanga(moonLongitude: number): NakshatraPanchangaFact;
export {};
