import { PlanetName } from '@vedica/astrology-core';
export interface AspectDetail {
    aspectingPlanet: PlanetName;
    aspectedPlanetOrHouse: string;
    type: string;
    orb: number;
}
