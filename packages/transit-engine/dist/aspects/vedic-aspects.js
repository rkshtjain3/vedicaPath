export const VEDIC_ASPECT_RULES = {
    Sun: [7],
    Moon: [7],
    Mars: [4, 7, 8],
    Mercury: [7],
    Jupiter: [5, 7, 9],
    Venus: [7],
    Saturn: [3, 7, 10],
    Rahu: [5, 7, 9],
    Ketu: [5, 7, 9],
};
export function getAspectingHouses(planet) {
    return VEDIC_ASPECT_RULES[planet] || [7];
}
