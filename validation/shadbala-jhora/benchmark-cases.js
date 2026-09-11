/**
 * Classical Shadbala Real-World JHora Benchmark Test Cases
 * Cases 001 to 010 covering:
 * - CASE-001: Normal Indian chart
 * - CASE-002: Birth near midnight
 * - CASE-003: Planet close to exaltation/debilitation boundary
 * - CASE-004: Planet close to 0°/360° longitude boundary
 * - CASE-005: Planet near Drekkana boundary
 * - CASE-006: Kendra house placement
 * - CASE-007: Panaphara placement
 * - CASE-008: Apoklima placement
 * - CASE-009: Foreign location chart
 * - CASE-010: DST-sensitive chart
 *
 * NOTE: Reference values default to empty objects and validationStatus is strictly set to NOT_VALIDATED
 * until verified reference outputs from JHora are populated.
 */
export const SHADBALA_JHORA_BENCHMARK_CASES = [
    {
        id: 'CASE-001',
        description: 'Normal Indian chart (New Delhi birth)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '1985-06-15',
            time: '08:30:00',
            location: 'New Delhi, India',
            latitude: 28.6139,
            longitude: 77.209,
            timezone: 'Asia/Kolkata',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
    {
        id: 'CASE-002',
        description: 'Birth near midnight (Midnight chart date boundary transition)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '1990-12-31',
            time: '23:59:30',
            location: 'Mumbai, India',
            latitude: 19.076,
            longitude: 72.8777,
            timezone: 'Asia/Kolkata',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
    {
        id: 'CASE-003',
        description: 'Planet close to exaltation/debilitation boundary (Sun at Aries 9.9° vs Libra 10.1°)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '1995-04-24',
            time: '06:00:00',
            location: 'Ujjain, India',
            latitude: 23.1765,
            longitude: 75.7885,
            timezone: 'Asia/Kolkata',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
    {
        id: 'CASE-004',
        description: 'Planet close to 0°/360° sidereal longitude (Pisces 29.9° / Aries 0.1°)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '1988-03-31',
            time: '18:15:00',
            location: 'Varanasi, India',
            latitude: 25.3176,
            longitude: 82.9739,
            timezone: 'Asia/Kolkata',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
    {
        id: 'CASE-005',
        description: 'Planet near Drekkana boundary (9.999999° vs 10.000000°)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '2000-01-01',
            time: '12:00:00',
            location: 'Bengaluru, India',
            latitude: 12.9716,
            longitude: 77.5946,
            timezone: 'Asia/Kolkata',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
    {
        id: 'CASE-006',
        description: 'Kendra house placement (Planets in houses 1, 4, 7, 10)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '1992-08-10',
            time: '05:30:00',
            location: 'Kolkata, India',
            latitude: 22.5726,
            longitude: 88.3639,
            timezone: 'Asia/Kolkata',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
    {
        id: 'CASE-007',
        description: 'Panaphara placement (Planets in houses 2, 5, 8, 11)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '1997-11-05',
            time: '14:20:00',
            location: 'Chennai, India',
            latitude: 13.0827,
            longitude: 80.2707,
            timezone: 'Asia/Kolkata',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
    {
        id: 'CASE-008',
        description: 'Apoklima placement (Planets in houses 3, 6, 9, 12)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '1982-02-18',
            time: '21:45:00',
            location: 'Ahmedabad, India',
            latitude: 23.0225,
            longitude: 72.5714,
            timezone: 'Asia/Kolkata',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
    {
        id: 'CASE-009',
        description: 'Foreign location chart (London, UK birth)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '1994-07-20',
            time: '10:15:00',
            location: 'London, UK',
            latitude: 51.5074,
            longitude: -0.1278,
            timezone: 'Europe/London',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
    {
        id: 'CASE-010',
        description: 'DST-sensitive chart (New York birth during Daylight Saving Time)',
        source: {
            software: 'JHora',
            version: '8.0 Parashari Shadbala',
            settings: { ayanamsha: 'Lahiri', zodiac: 'SIDEREAL', houseSystem: 'Whole Sign' },
        },
        birthDetails: {
            date: '1987-06-01',
            time: '15:30:00',
            location: 'New York, USA',
            latitude: 40.7128,
            longitude: -74.006,
            timezone: 'America/New_York',
        },
        expected: {},
        validationStatus: 'NOT_VALIDATED',
    },
];
//# sourceMappingURL=benchmark-cases.js.map