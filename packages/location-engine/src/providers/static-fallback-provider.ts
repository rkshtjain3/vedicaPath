import { searchCountries, getCountryByCode } from '../countries/country-dataset.js';
import {
  BirthLocation,
  Country,
  LocationSearchProvider,
} from '../types/location-engine-types.js';

export const STATIC_GLOBAL_CITIES: BirthLocation[] = [
  // India
  {
    id: 'static:IN:panipat',
    countryCode: 'IN',
    countryName: 'India',
    city: 'Panipat',
    region: 'Haryana',
    latitude: 29.3909,
    longitude: 76.9635,
    timezone: 'Asia/Kolkata',
    displayName: 'Panipat, Haryana, India',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:IN:panchkula',
    countryCode: 'IN',
    countryName: 'India',
    city: 'Panchkula',
    region: 'Haryana',
    latitude: 30.6942,
    longitude: 76.8606,
    timezone: 'Asia/Kolkata',
    displayName: 'Panchkula, Haryana, India',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:IN:panaji',
    countryCode: 'IN',
    countryName: 'India',
    city: 'Panaji',
    region: 'Goa',
    latitude: 15.4909,
    longitude: 73.8278,
    timezone: 'Asia/Kolkata',
    displayName: 'Panaji, Goa, India',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:IN:newdelhi',
    countryCode: 'IN',
    countryName: 'India',
    city: 'New Delhi',
    region: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: 'Asia/Kolkata',
    displayName: 'New Delhi, Delhi, India',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:IN:mumbai',
    countryCode: 'IN',
    countryName: 'India',
    city: 'Mumbai',
    region: 'Maharashtra',
    latitude: 19.076,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    displayName: 'Mumbai, Maharashtra, India',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:IN:bengaluru',
    countryCode: 'IN',
    countryName: 'India',
    city: 'Bengaluru',
    region: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: 'Asia/Kolkata',
    displayName: 'Bengaluru, Karnataka, India',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:IN:chennai',
    countryCode: 'IN',
    countryName: 'India',
    city: 'Chennai',
    region: 'Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: 'Asia/Kolkata',
    displayName: 'Chennai, Tamil Nadu, India',
    source: 'STATIC_FALLBACK',
  },

  // United States
  {
    id: 'static:US:newyork',
    countryCode: 'US',
    countryName: 'United States',
    city: 'New York',
    region: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
    displayName: 'New York, New York, United States',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:US:springfield_il',
    countryCode: 'US',
    countryName: 'United States',
    city: 'Springfield',
    region: 'Illinois',
    latitude: 39.7817,
    longitude: -89.6501,
    timezone: 'America/Chicago',
    displayName: 'Springfield, Illinois, United States',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:US:springfield_ma',
    countryCode: 'US',
    countryName: 'United States',
    city: 'Springfield',
    region: 'Massachusetts',
    latitude: 42.1015,
    longitude: -72.5898,
    timezone: 'America/New_York',
    displayName: 'Springfield, Massachusetts, United States',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:US:losangeles',
    countryCode: 'US',
    countryName: 'United States',
    city: 'Los Angeles',
    region: 'California',
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: 'America/Los_Angeles',
    displayName: 'Los Angeles, California, United States',
    source: 'STATIC_FALLBACK',
  },

  // United Kingdom
  {
    id: 'static:GB:london',
    countryCode: 'GB',
    countryName: 'United Kingdom',
    city: 'London',
    region: 'England',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
    displayName: 'London, England, United Kingdom',
    source: 'STATIC_FALLBACK',
  },

  // Canada
  {
    id: 'static:CA:toronto',
    countryCode: 'CA',
    countryName: 'Canada',
    city: 'Toronto',
    region: 'Ontario',
    latitude: 43.6532,
    longitude: -79.3832,
    timezone: 'America/Toronto',
    displayName: 'Toronto, Ontario, Canada',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:CA:london_on',
    countryCode: 'CA',
    countryName: 'Canada',
    city: 'London',
    region: 'Ontario',
    latitude: 42.9849,
    longitude: -81.2453,
    timezone: 'America/Toronto',
    displayName: 'London, Ontario, Canada',
    source: 'STATIC_FALLBACK',
  },

  // Australia
  {
    id: 'static:AU:sydney',
    countryCode: 'AU',
    countryName: 'Australia',
    city: 'Sydney',
    region: 'New South Wales',
    latitude: -33.8688,
    longitude: 151.2093,
    timezone: 'Australia/Sydney',
    displayName: 'Sydney, New South Wales, Australia',
    source: 'STATIC_FALLBACK',
  },
  {
    id: 'static:AU:melbourne',
    countryCode: 'AU',
    countryName: 'Australia',
    city: 'Melbourne',
    region: 'Victoria',
    latitude: -37.8136,
    longitude: 144.9631,
    timezone: 'Australia/Melbourne',
    displayName: 'Melbourne, Victoria, Australia',
    source: 'STATIC_FALLBACK',
  },

  // Germany
  {
    id: 'static:DE:berlin',
    countryCode: 'DE',
    countryName: 'Germany',
    city: 'Berlin',
    region: 'Berlin',
    latitude: 52.52,
    longitude: 13.405,
    timezone: 'Europe/Berlin',
    displayName: 'Berlin, Berlin, Germany',
    source: 'STATIC_FALLBACK',
  },

  // Japan
  {
    id: 'static:JP:tokyo',
    countryCode: 'JP',
    countryName: 'Japan',
    city: 'Tokyo',
    region: 'Kanto',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
    displayName: 'Tokyo, Kanto, Japan',
    source: 'STATIC_FALLBACK',
  },

  // United Arab Emirates
  {
    id: 'static:AE:dubai',
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    city: 'Dubai',
    region: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: 'Asia/Dubai',
    displayName: 'Dubai, Dubai, United Arab Emirates',
    source: 'STATIC_FALLBACK',
  },

  // Singapore
  {
    id: 'static:SG:singapore',
    countryCode: 'SG',
    countryName: 'Singapore',
    city: 'Singapore',
    region: 'Central',
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: 'Asia/Singapore',
    displayName: 'Singapore, Central, Singapore',
    source: 'STATIC_FALLBACK',
  },

  // Nepal
  {
    id: 'static:NP:kathmandu',
    countryCode: 'NP',
    countryName: 'Nepal',
    city: 'Kathmandu',
    region: 'Bagmati',
    latitude: 27.7172,
    longitude: 85.324,
    timezone: 'Asia/Kathmandu',
    displayName: 'Kathmandu, Bagmati, Nepal',
    source: 'STATIC_FALLBACK',
  },

  // France
  {
    id: 'static:FR:paris',
    countryCode: 'FR',
    countryName: 'France',
    city: 'Paris',
    region: 'Île-de-France',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    displayName: 'Paris, Île-de-France, France',
    source: 'STATIC_FALLBACK',
  },
];

export class StaticFallbackLocationProvider implements LocationSearchProvider {
  public readonly name = 'STATIC_FALLBACK';

  async searchCountries(query: string): Promise<Country[]> {
    return searchCountries(query);
  }

  async searchCities(query: string, countryCode?: string): Promise<BirthLocation[]> {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    let list = STATIC_GLOBAL_CITIES;
    if (countryCode) {
      const codeUpper = countryCode.toUpperCase();
      list = list.filter((l) => l.countryCode === codeUpper);
    }

    return list.filter(
      (l) =>
        l.city.toLowerCase().includes(trimmed) ||
        (l.region && l.region.toLowerCase().includes(trimmed)) ||
        l.displayName.toLowerCase().includes(trimmed)
    );
  }

  async resolveLocation(locationId: string): Promise<BirthLocation> {
    const found = STATIC_GLOBAL_CITIES.find((l) => l.id === locationId);
    if (found) return found;

    throw new Error(`Location not found in static dataset: ${locationId}`);
  }
}
