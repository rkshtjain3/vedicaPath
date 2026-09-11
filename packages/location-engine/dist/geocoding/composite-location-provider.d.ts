import { BirthLocation, Country, LocationSearchProvider } from '../types/location-engine-types.js';
export declare class CompositeLocationProvider implements LocationSearchProvider {
    readonly name = "COMPOSITE_PROVIDER";
    private primaryProvider;
    private fallbackProvider;
    constructor(primaryProvider?: LocationSearchProvider, fallbackProvider?: LocationSearchProvider);
    searchCountries(query: string): Promise<Country[]>;
    searchCities(query: string, countryCode?: string): Promise<BirthLocation[]>;
    resolveLocation(locationId: string): Promise<BirthLocation>;
}
//# sourceMappingURL=composite-location-provider.d.ts.map