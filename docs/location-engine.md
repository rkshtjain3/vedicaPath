# Location Engine Documentation (`@vedica/location-engine`)

## Overview

The `@vedica/location-engine` package provides a modular, provider-independent global birth location selection and coordinate resolution framework. It automatically resolves latitude, longitude, and valid IANA timezones for users while keeping core astrology calculation logic completely unchanged.

---

## Architecture

```
@vedica/location-engine
├── countries/
│   └── country-dataset.ts       # Global ISO 3166-1 dataset (240+ countries)
├── providers/
│   ├── open-meteo-provider.ts   # Primary Provider (Open-Meteo Geocoding API)
│   └── static-fallback-provider.ts # Fallback Provider (Offline major cities)
├── geocoding/
│   └── composite-location-provider.ts # Primary/Fallback composite wrapper
├── timezone/
│   └── timezone-resolver.ts     # IANA timezone validator & coordinate resolver
├── validation/
│   └── location-validator.ts    # Latitude/Longitude boundary & schema validator
├── caching/
│   └── location-cache.ts        # In-memory LRU cache (TTL & capacity bounds)
└── index.ts                     # Main LocationEngine export
```

---

## Key Features & Design Principles

### 1. Simple User Experience
End users enter only **Birth Date**, **Birth Time**, **Country**, and **Birth City**. Technical coordinates (Latitude, Longitude, IANA Timezone) are resolved automatically and displayed under a collapsed, read-only Advanced Location Details card.

### 2. Provider Abstraction (`LocationSearchProvider`)
```ts
export interface LocationSearchProvider {
  name: string;
  searchCountries(query: string): Promise<Country[]>;
  searchCities(query: string, countryCode?: string): Promise<BirthLocation[]>;
  resolveLocation(locationId: string): Promise<BirthLocation>;
}
```
Application components never depend directly on a specific geocoding vendor. The system utilizes `CompositeLocationProvider` to seamlessly fall back to an offline static dataset if the primary external API fails or is unreachable.

### 3. Server-Side Execution & Privacy
All external location searches occur **server-side** via Next.js API endpoints (`/api/locations/countries`, `/api/locations/search`, `/api/locations/resolve`). No provider API credentials or secrets are ever exposed in client browser bundles.

### 4. IANA Timezone & Historical DST Handling
- Resolves standard IANA timezone strings (e.g. `Asia/Kolkata`, `America/New_York`, `Europe/London`, `Australia/Sydney`, `Asia/Tokyo`, `America/Toronto`).
- Historical Daylight Saving Time (DST) calculations are computed using the birth date, birth time, and IANA timezone ID, ensuring precise UTC ephemeris conversions across all historical eras.

### 5. Manual Override Mode
For power users or remote locations, an optional `Use Manual Coordinates` checkbox renders Latitude, Longitude, and Timezone fields editable. A warning banner alerts the user: *"Manual location values may produce incorrect astrology calculations if they are inaccurate."*

---

## Server API Endpoints

| Route | Query Parameters | Description |
| :--- | :--- | :--- |
| `GET /api/locations/countries` | `q` (optional query string) | Returns matching ISO countries. |
| `GET /api/locations/search` | `q` (city query), `country` (ISO code) | Searches cities within selected country. |
| `GET /api/locations/resolve` | `id` (location ID string) | Resolves full `BirthLocation` details. |

---

## Verification Commands

- **Location Engine Unit Tests**: `pnpm --filter @vedica/location-engine test`
- **Workspace Unit Tests**: `pnpm test`
- **Playwright E2E Tests**: `pnpm test:e2e`
- **Full Workspace Validation**: `pnpm validate`
