# Location Accuracy Policy & Resolution Metadata

## Overview
Birth location resolution in `@vedica/location-engine` isolates geocoding logic from planetary calculation algorithms while enforcing strict safety rules to prevent incorrect or silent location substitutions.

---

## 1. Core Safety Rules
1. **No Silent Approximations**: A location search query will **never** silently resolve to a different city with the same name, a nearby city, or an arbitrary country fallback.
2. **Strict Fallback Policy**: The `StaticFallbackLocationProvider` only matches cities explicitly listed in its static offline dataset. If a city query is not found in static data, it returns `NO RESULT` rather than approximating.
3. **Duplicate City Disambiguation**: Cities sharing the same name (e.g. *London, England, UK* vs *London, Ontario, Canada*; *Springfield, Illinois* vs *Springfield, Massachusetts*) are distinct objects with separate country codes, regions, coordinates, and IANA timezones.

---

## 2. Confidence Metadata Matrix

Every resolved location attaches a `LocationResolutionMetadata` object:

```ts
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
```

| Confidence Level | Criteria | UI Behavior |
| :--- | :--- | :--- |
| **HIGH** | Exact geocoding result from primary provider with verified region, city, country, and IANA timezone. | Normal display |
| **MEDIUM** | Verified city match, but region details unavailable or static fallback dataset used. | Warning badge displayed in UI |
| **LOW** | Approximate location match or manually overridden coordinates. | Red alert warning displayed in UI |

---

## 3. Manual Override Mode
For power users who wish to specify precise GPS coordinates or custom IANA timezones, the Web UI provides an explicit **Manual Override Mode**. When enabled:
- Coordinate fields become editable.
- An explicit warning banner cautions the user that inaccurate coordinates directly alter ascendant (Lagna) and house cusp calculation results.
