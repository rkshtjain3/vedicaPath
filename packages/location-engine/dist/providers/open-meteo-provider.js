import { searchCountries, getCountryByCode } from '../countries/country-dataset.js';
export class OpenMeteoLocationProvider {
    name = 'OPEN_METEO';
    async searchCountries(query) {
        return searchCountries(query);
    }
    async searchCities(query, countryCode) {
        const trimmed = query.trim();
        if (!trimmed)
            return [];
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=15&language=en&format=json`;
            const resp = await fetch(url, {
                headers: {
                    'User-Agent': 'VedicAstrologyAnalyzer/1.0',
                },
            });
            if (!resp.ok) {
                throw new Error(`Open-Meteo API returned status ${resp.status}`);
            }
            const data = await resp.json();
            if (!data.results || !Array.isArray(data.results)) {
                return [];
            }
            let filtered = data.results;
            if (countryCode) {
                const targetCode = countryCode.toUpperCase();
                filtered = filtered.filter((item) => item.country_code && item.country_code.toUpperCase() === targetCode);
            }
            return filtered.map((item) => {
                const countryObj = getCountryByCode(item.country_code) || {
                    code: item.country_code || countryCode || 'UN',
                    name: item.country || 'Unknown Country',
                };
                const regionStr = item.admin1 || item.admin2 || '';
                const parts = [item.name];
                if (regionStr)
                    parts.push(regionStr);
                parts.push(countryObj.name);
                const displayName = parts.join(', ');
                const locId = `openmeteo:${item.latitude.toFixed(4)},${item.longitude.toFixed(4)},${encodeURIComponent(item.name)}`;
                return {
                    id: locId,
                    countryCode: countryObj.code,
                    countryName: countryObj.name,
                    city: item.name,
                    region: regionStr || undefined,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    timezone: item.timezone || 'UTC',
                    displayName,
                    source: this.name,
                };
            });
        }
        catch (err) {
            console.warn('OpenMeteoLocationProvider search failed:', err);
            return [];
        }
    }
    async resolveLocation(locationId) {
        if (!locationId.startsWith('openmeteo:')) {
            throw new Error(`Invalid locationId format for OpenMeteo provider: ${locationId}`);
        }
        const raw = locationId.replace('openmeteo:', '');
        const [latStr, lonStr, cityEnc] = raw.split(',');
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);
        const cityName = decodeURIComponent(cityEnc || 'City');
        const searchRes = await this.searchCities(cityName);
        const matched = searchRes.find((l) => Math.abs(l.latitude - lat) < 0.01 && Math.abs(l.longitude - lon) < 0.01);
        if (matched)
            return matched;
        return {
            id: locationId,
            countryCode: 'UN',
            countryName: 'Resolved Location',
            city: cityName,
            latitude: lat,
            longitude: lon,
            timezone: 'UTC',
            displayName: `${cityName} (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
            source: this.name,
        };
    }
}
//# sourceMappingURL=open-meteo-provider.js.map