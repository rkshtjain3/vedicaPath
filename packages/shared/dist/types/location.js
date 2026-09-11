/**
 * Basic static location resolver implementation for Phase 1.
 */
export class StaticLocationResolver {
    static PRESETS = {
        'new delhi': { name: 'New Delhi, India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
        'mumbai': { name: 'Mumbai, India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
        'london': { name: 'London, UK', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
        'new york': { name: 'New York, USA', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
    };
    async resolveLocation(query) {
        const key = query.trim().toLowerCase();
        if (StaticLocationResolver.PRESETS[key]) {
            return StaticLocationResolver.PRESETS[key];
        }
        return {
            name: query || 'Default Location (New Delhi)',
            latitude: 28.6139,
            longitude: 77.2090,
            timezone: 'Asia/Kolkata',
        };
    }
}
//# sourceMappingURL=location.js.map