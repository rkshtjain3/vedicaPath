import { BirthLocation, Country, LocationSearchProvider } from '../types/location-engine-types.js';
export declare const STATIC_GLOBAL_CITIES: BirthLocation[];
export declare class StaticFallbackLocationProvider implements LocationSearchProvider {
    readonly name = "STATIC_FALLBACK";
    searchCountries(query: string): Promise<Country[]>;
    searchCities(query: string, countryCode?: string): Promise<BirthLocation[]>;
    resolveLocation(locationId: string): Promise<BirthLocation>;
}
//# sourceMappingURL=static-fallback-provider.d.ts.map