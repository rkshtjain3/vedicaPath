export function isValidIANATimezone(tz) {
    if (!tz || typeof tz !== 'string')
        return false;
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    }
    catch {
        return false;
    }
}
export function resolveTimezoneByCountryAndCoords(countryCode, latitude, longitude) {
    const code = (countryCode || '').toUpperCase();
    // Known country defaults
    switch (code) {
        case 'IN':
            return 'Asia/Kolkata';
        case 'NP':
            return 'Asia/Kathmandu';
        case 'LK':
            return 'Asia/Colombo';
        case 'BD':
            return 'Asia/Dhaka';
        case 'PK':
            return 'Asia/Karachi';
        case 'SG':
            return 'Asia/Singapore';
        case 'AE':
            return 'Asia/Dubai';
        case 'JP':
            return 'Asia/Tokyo';
        case 'GB':
            return 'Europe/London';
        case 'DE':
            return 'Europe/Berlin';
        case 'FR':
            return 'Europe/Paris';
        case 'IT':
            return 'Europe/Rome';
        case 'ES':
            return 'Europe/Madrid';
        case 'SE':
            return 'Europe/Stockholm';
        case 'NO':
            return 'Europe/Oslo';
        case 'NL':
            return 'Europe/Amsterdam';
        case 'CH':
            return 'Europe/Zurich';
    }
    // USA Regional Coordinate Bounding Box Resolution
    if (code === 'US') {
        if (longitude < -115)
            return 'America/Los_Angeles'; // Pacific
        if (longitude < -100)
            return 'America/Denver'; // Mountain
        if (longitude < -85)
            return 'America/Chicago'; // Central
        return 'America/New_York'; // Eastern
    }
    // Canada Regional Coordinate Bounding Box Resolution
    if (code === 'CA') {
        if (longitude < -115)
            return 'America/Vancouver';
        if (longitude < -100)
            return 'America/Edmonton';
        if (longitude < -85)
            return 'America/Winnipeg';
        return 'America/Toronto';
    }
    // Australia Regional Coordinate Bounding Box Resolution
    if (code === 'AU') {
        if (longitude < 125)
            return 'Australia/Perth';
        if (longitude < 140)
            return 'Australia/Adelaide';
        return 'Australia/Sydney';
    }
    // General fallback
    return 'UTC';
}
//# sourceMappingURL=timezone-resolver.js.map