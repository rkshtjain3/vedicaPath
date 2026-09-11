const SIGN_NAMES = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];
function formatDegree(deg) {
    const norm = ((deg % 360) + 360) % 360;
    const degInSign = norm % 30;
    const d = Math.floor(degInSign);
    const m = Math.floor((degInSign - d) * 60);
    return `${d}° ${m < 10 ? '0' : ''}${m}'`;
}
function getSignName(deg) {
    const norm = ((deg % 360) + 360) % 360;
    const signIndex = Math.floor(norm / 30);
    return SIGN_NAMES[signIndex] || 'Aries';
}
// Saturday daytime Saturn segment = 1st, Sunday = 7th, Monday = 6th, Tuesday = 5th, Wednesday = 4th, Thursday = 3rd, Friday = 2nd
const SATURN_DAY_SEGMENTS = {
    0: 7, // Sunday
    1: 6, // Monday
    2: 5, // Tuesday
    3: 4, // Wednesday
    4: 3, // Thursday
    5: 2, // Friday
    6: 1, // Saturday
};
export function calculateUpagrahas(lagnaLongitude, dayIndex, isDayBirth = true) {
    const seg = SATURN_DAY_SEGMENTS[dayIndex] || 1;
    const offsetMultiplier = isDayBirth ? seg : ((seg + 4) % 8 || 8);
    // Approximate classical upagraha sphuta relative to Lagna
    const gulikaLongitude = ((lagnaLongitude + (offsetMultiplier * 30 * 0.8)) % 360 + 360) % 360;
    const mandiLongitude = ((gulikaLongitude + 1.5) % 360 + 360) % 360;
    return {
        gulikaLongitude,
        mandiLongitude,
        gulikaSign: getSignName(gulikaLongitude),
        mandiSign: getSignName(mandiLongitude),
        gulikaDegreeFormatted: formatDegree(gulikaLongitude),
        mandiDegreeFormatted: formatDegree(mandiLongitude),
    };
}
