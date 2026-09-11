export * from './types/location-engine-types.js';
export * from './countries/country-dataset.js';
export * from './providers/open-meteo-provider.js';
export * from './providers/static-fallback-provider.js';
export * from './geocoding/composite-location-provider.js';
export * from './timezone/timezone-resolver.js';
export * from './validation/location-validator.js';
export * from './caching/location-cache.js';
import { CompositeLocationProvider } from './geocoding/composite-location-provider.js';
import { LocationCache } from './caching/location-cache.js';
export function createLocationMetadata(location, manualOverride = false) {
    const warnings = [];
    let confidence = 'HIGH';
    let exactMatch = true;
    let fallbackUsed = location.source === 'STATIC_FALLBACK';
    if (manualOverride) {
        confidence = 'MEDIUM';
        warnings.push('Manual location coordinates entered by user.');
    }
    if (fallbackUsed) {
        confidence = 'MEDIUM';
        warnings.push('Offline location data was used.');
    }
    if (!location.region) {
        if (confidence === 'HIGH')
            confidence = 'MEDIUM';
        warnings.push('Location details could not be fully verified. Please confirm before calculating.');
    }
    if (location.source === 'APPROXIMATE') {
        confidence = 'LOW';
        warnings.push('Location accuracy may affect astrology calculations. Please verify the selected city or use manual coordinates.');
    }
    return {
        source: location.source,
        resolvedAt: new Date().toISOString(),
        providerVersion: 'location-engine-v1',
        manualOverride,
        confidence,
        exactMatch,
        fallbackUsed,
        warnings,
    };
}
export class LocationEngine {
    provider;
    countryCache = new LocationCache();
    cityCache = new LocationCache();
    locationCache = new LocationCache();
    constructor(provider) {
        this.provider = provider || new CompositeLocationProvider();
    }
    async searchCountries(query = '') {
        const key = `countries:${query.toLowerCase()}`;
        const cached = this.countryCache.get(key);
        if (cached)
            return cached;
        const result = await this.provider.searchCountries(query);
        this.countryCache.set(key, result);
        return result;
    }
    async searchCities(query, countryCode) {
        const key = `cities:${countryCode || 'ALL'}:${query.toLowerCase()}`;
        const cached = this.cityCache.get(key);
        if (cached)
            return cached;
        const result = await this.provider.searchCities(query, countryCode);
        this.cityCache.set(key, result);
        return result;
    }
    async resolveLocation(locationId) {
        const cached = this.locationCache.get(locationId);
        if (cached)
            return cached;
        const result = await this.provider.resolveLocation(locationId);
        this.locationCache.set(locationId, result);
        return result;
    }
    getMetadata(location, manualOverride = false) {
        return createLocationMetadata(location, manualOverride);
    }
}
//# sourceMappingURL=index.js.map