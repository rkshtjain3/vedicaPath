import { OpenMeteoLocationProvider } from '../providers/open-meteo-provider.js';
import { StaticFallbackLocationProvider } from '../providers/static-fallback-provider.js';
export class CompositeLocationProvider {
    name = 'COMPOSITE_PROVIDER';
    primaryProvider;
    fallbackProvider;
    constructor(primaryProvider, fallbackProvider) {
        this.primaryProvider = primaryProvider || new OpenMeteoLocationProvider();
        this.fallbackProvider = fallbackProvider || new StaticFallbackLocationProvider();
    }
    async searchCountries(query) {
        return this.primaryProvider.searchCountries(query);
    }
    async searchCities(query, countryCode) {
        const trimmed = query.trim();
        if (!trimmed)
            return [];
        let primaryResults = [];
        try {
            primaryResults = await this.primaryProvider.searchCities(trimmed, countryCode);
        }
        catch (err) {
            console.warn('Primary geocoding provider failed, resorting to fallback:', err);
        }
        let fallbackResults = [];
        try {
            fallbackResults = await this.fallbackProvider.searchCities(trimmed, countryCode);
        }
        catch (err) {
            console.warn('Fallback geocoding provider failed:', err);
        }
        // Merge primary + fallback, deduplicating by normalized displayName
        const combinedMap = new Map();
        for (const item of primaryResults) {
            const key = item.displayName.toLowerCase();
            if (!combinedMap.has(key)) {
                combinedMap.set(key, item);
            }
        }
        for (const item of fallbackResults) {
            const key = item.displayName.toLowerCase();
            if (!combinedMap.has(key)) {
                combinedMap.set(key, item);
            }
        }
        return Array.from(combinedMap.values());
    }
    async resolveLocation(locationId) {
        if (locationId.startsWith('openmeteo:')) {
            try {
                return await this.primaryProvider.resolveLocation(locationId);
            }
            catch (err) {
                console.warn('Failed resolving with primary provider, attempting fallback:', err);
            }
        }
        if (locationId.startsWith('static:')) {
            return await this.fallbackProvider.resolveLocation(locationId);
        }
        // Attempt primary then fallback
        try {
            return await this.primaryProvider.resolveLocation(locationId);
        }
        catch {
            return await this.fallbackProvider.resolveLocation(locationId);
        }
    }
}
//# sourceMappingURL=composite-location-provider.js.map