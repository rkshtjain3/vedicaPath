export interface GrahaAspect {
    targetHouse: number;
    aspectPercentage: number;
    specialAspect?: boolean;
    label: string;
}
/**
 * Computes classical Parashari Graha Drishti (aspects cast) for any planet from its source house.
 */
export declare function getPlanetaryAspects(planet: string, sourceHouse: number): GrahaAspect[];
