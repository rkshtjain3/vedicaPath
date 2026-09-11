/**
 * Internal calculation input representing exact birth instant and location.
 */
export interface BirthTimeInput {
    dateOfBirth: string;
    timeOfBirth: string;
    timezone: string;
}
export interface UTCInstant {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    decimalHour: number;
    isoString: string;
}
export type LocalTimeResolution = {
    status: 'VALID';
    instant: Date;
    utcInstant: UTCInstant;
} | {
    status: 'AMBIGUOUS';
    possibleInstants: Date[];
    warning: string;
    utcInstant: UTCInstant;
} | {
    status: 'NON_EXISTENT';
    reason: string;
};
/**
 * Formats a given UTC Date into local YYYY-MM-DD HH:mm:ss for specified IANA timezone.
 */
export declare function formatInTimezone(date: Date, timezone: string): {
    dateStr: string;
    timeStr: string;
};
/**
 * Resolves local birth time in specified IANA timezone, detecting DST ambiguous or non-existent times.
 */
export declare function resolveLocalTime(input: BirthTimeInput, occurrencePref?: 'FIRST' | 'SECOND'): LocalTimeResolution;
/**
 * Calculates UTC instant from local date, time, and IANA timezone.
 * Handles daylight saving and timezone offsets correctly.
 */
export declare function getUTCInstant(input: BirthTimeInput): UTCInstant;
//# sourceMappingURL=time.d.ts.map