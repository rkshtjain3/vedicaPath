import { BirthLocation, Country, LocationSearchProvider } from '../types/location-engine-types.js';
export declare class OpenMeteoLocationProvider implements LocationSearchProvider {
    readonly name = "OPEN_METEO";
    searchCountries(query: string): Promise<Country[]>;
    searchCities(query: string, countryCode?: string): Promise<BirthLocation[]>;
    resolveLocation(locationId: string): Promise<BirthLocation>;
}
//# sourceMappingURL=open-meteo-provider.d.ts.map