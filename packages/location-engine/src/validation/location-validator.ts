import { isValidIANATimezone } from '../timezone/timezone-resolver.js';
import { BirthLocation } from '../types/location-engine-types.js';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateLatitude(latitude: number): boolean {
  return typeof latitude === 'number' && !isNaN(latitude) && latitude >= -90 && latitude <= 90;
}

export function validateLongitude(longitude: number): boolean {
  return (
    typeof longitude === 'number' && !isNaN(longitude) && longitude >= -180 && longitude <= 180
  );
}

export function validateBirthLocation(location: Partial<BirthLocation>): ValidationResult {
  const errors: string[] = [];

  if (!location.countryCode || typeof location.countryCode !== 'string' || location.countryCode.length < 2) {
    errors.push('Invalid country code');
  }

  if (!location.city || typeof location.city !== 'string' || !location.city.trim()) {
    errors.push('City name is required');
  }

  if (location.latitude === undefined || !validateLatitude(location.latitude)) {
    errors.push('Latitude must be a valid number between -90 and +90 degrees');
  }

  if (location.longitude === undefined || !validateLongitude(location.longitude)) {
    errors.push('Longitude must be a valid number between -180 and +180 degrees');
  }

  if (!location.timezone || !isValidIANATimezone(location.timezone)) {
    errors.push(`Invalid IANA timezone string: '${location.timezone}'`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
