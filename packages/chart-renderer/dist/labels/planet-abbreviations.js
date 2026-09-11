export const PLANET_ABBREVIATIONS = {
    Sun: 'Su',
    Moon: 'Mo',
    Mars: 'Ma',
    Mercury: 'Me',
    Jupiter: 'Ju',
    Venus: 'Ve',
    Saturn: 'Sa',
    Rahu: 'Ra',
    Ketu: 'Ke',
    Ascendant: 'As',
    Lagna: 'As',
};
export function getPlanetAbbreviation(planetName) {
    if (PLANET_ABBREVIATIONS[planetName]) {
        return PLANET_ABBREVIATIONS[planetName];
    }
    return planetName.slice(0, 2);
}
export const RASHI_NAMES = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
];
export const RASHI_LORDS = {
    Aries: 'Mars',
    Taurus: 'Venus',
    Gemini: 'Mercury',
    Cancer: 'Moon',
    Leo: 'Sun',
    Virgo: 'Mercury',
    Libra: 'Venus',
    Scorpio: 'Mars',
    Sagittarius: 'Jupiter',
    Capricorn: 'Saturn',
    Aquarius: 'Saturn',
    Pisces: 'Jupiter',
};
export function getRashiIdByName(name) {
    const normalized = name.trim().toLowerCase();
    const idx = RASHI_NAMES.findIndex((r) => r.toLowerCase() === normalized);
    return idx >= 0 ? idx + 1 : 1;
}
export function getRashiNameById(id) {
    const index = Math.max(0, Math.min(11, (id - 1) % 12));
    return RASHI_NAMES[index];
}
export function formatDegree(decimalDeg) {
    if (decimalDeg === undefined || decimalDeg === null)
        return '';
    const degrees = Math.floor(decimalDeg % 30);
    const minutesDecimal = (decimalDeg % 1) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.round((minutesDecimal % 1) * 60);
    return `${degrees}° ${minutes}' ${seconds}"`;
}
