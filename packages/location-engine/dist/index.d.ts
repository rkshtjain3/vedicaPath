export * from './types/location-engine-types.js';
export * from './countries/country-dataset.js';
export * from './providers/open-meteo-provider.js';
export * from './providers/static-fallback-provider.js';
export * from './geocoding/composite-location-provider.js';
export * from './timezone/timezone-resolver.js';
export * from './validation/location-validator.js';
export * from './caching/location-cache.js';
import { CompositeLocationProvider } from './geocoding/composite-location-provider.js';
import { BirthLocation, Country, LocationResolutionMetadata } from './types/location-engine-types.js';
export declare function createLocationMetadata(location: BirthLocation, manualOverride?: boolean): LocationResolutionMetadata;
export declare class LocationEngine {
    private provider;
    private countryCache;
    private cityCache;
    private locationCache;
    constructor(provider?: CompositeLocationProvider);
    searchCountries(query?: string): Promise<Country[]>;
    searchCities(query: string, countryCode?: string): Promise<BirthLocation[]>;
    resolveLocation(locationId: string): Promise<BirthLocation>;
    getMetadata(location: BirthLocation, manualOverride?: boolean): LocationResolutionMetadata;
}
//# sourceMappingURL=index.d.ts.map