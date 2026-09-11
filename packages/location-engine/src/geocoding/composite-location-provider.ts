import { OpenMeteoLocationProvider } from '../providers/open-meteo-provider.js';
import { StaticFallbackLocationProvider } from '../providers/static-fallback-provider.js';
import {
  BirthLocation,
  Country,
  LocationSearchProvider,
} from '../types/location-engine-types.js';

export class CompositeLocationProvider implements LocationSearchProvider {
  public readonly name = 'COMPOSITE_PROVIDER';

  private primaryProvider: LocationSearchProvider;
  private fallbackProvider: LocationSearchProvider;

  constructor(
    primaryProvider?: LocationSearchProvider,
    fallbackProvider?: LocationSearchProvider
  ) {
    this.primaryProvider = primaryProvider || new OpenMeteoLocationProvider();
    this.fallbackProvider = fallbackProvider || new StaticFallbackLocationProvider();
  }

  async searchCountries(query: string): Promise<Country[]> {
    return this.primaryProvider.searchCountries(query);
  }

  async searchCities(query: string, countryCode?: string): Promise<BirthLocation[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    let primaryResults: BirthLocation[] = [];
    try {
      primaryResults = await this.primaryProvider.searchCities(trimmed, countryCode);
    } catch (err) {
      console.warn('Primary geocoding provider failed, resorting to fallback:', err);
    }

    let fallbackResults: BirthLocation[] = [];
    try {
      fallbackResults = await this.fallbackProvider.searchCities(trimmed, countryCode);
    } catch (err) {
      console.warn('Fallback geocoding provider failed:', err);
    }

    // Merge primary + fallback, deduplicating by normalized displayName
    const combinedMap = new Map<string, BirthLocation>();

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

  async resolveLocation(locationId: string): Promise<BirthLocation> {
    if (locationId.startsWith('openmeteo:')) {
      try {
        return await this.primaryProvider.resolveLocation(locationId);
      } catch (err) {
        console.warn('Failed resolving with primary provider, attempting fallback:', err);
      }
    }

    if (locationId.startsWith('static:')) {
      return await this.fallbackProvider.resolveLocation(locationId);
    }

    // Attempt primary then fallback
    try {
      return await this.primaryProvider.resolveLocation(locationId);
    } catch {
      return await this.fallbackProvider.resolveLocation(locationId);
    }
  }
}
