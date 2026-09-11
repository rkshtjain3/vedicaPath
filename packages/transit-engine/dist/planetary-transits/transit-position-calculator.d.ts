import { TransitCalculationProfile } from '../profile.js';
import { TransitCalculationConfiguration, TransitPosition } from '../types.js';
export declare function calculateTransitPositions(transitDate: Date, natalLagnaLongitude: number, natalMoonLongitude: number, natalSunLongitude: number, profile?: TransitCalculationProfile): Promise<{
    configuration: TransitCalculationConfiguration;
    planets: TransitPosition[];
}>;
