export interface BirthLocation {
  id?: string;
  countryCode: string;
  countryName: string;
  city: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  displayName: string;
  source: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface LocationSearchOptions {
  query: string;
  countryCode?: string;
  limit?: number;
}

export interface LocationSearchProvider {
  name: string;
  searchCountries(query: string): Promise<Country[]>;
  searchCities(query: string, countryCode?: string): Promise<BirthLocation[]>;
  resolveLocation(locationId: string): Promise<BirthLocation>;
}

export interface LocationResolutionMetadata {
  source: string;
  resolvedAt: string;
  providerVersion: string;
  manualOverride: boolean;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  exactMatch: boolean;
  fallbackUsed: boolean;
  warnings: string[];
}
