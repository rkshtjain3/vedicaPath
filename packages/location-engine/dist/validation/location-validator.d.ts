import { BirthLocation } from '../types/location-engine-types.js';
export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
export declare function validateLatitude(latitude: number): boolean;
export declare function validateLongitude(longitude: number): boolean;
export declare function validateBirthLocation(location: Partial<BirthLocation>): ValidationResult;
//# sourceMappingURL=location-validator.d.ts.map