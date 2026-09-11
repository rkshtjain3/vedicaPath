export const SIGN_NAMES = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];
export const SIGN_LORDS = {
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
export function calculateHouseFacts(lagnaSignIndex, planetFacts) {
    const houseFacts = [];
    for (let houseNumber = 1; houseNumber <= 12; houseNumber++) {
        const signIndex = (lagnaSignIndex + houseNumber - 1) % 12;
        const signName = SIGN_NAMES[signIndex];
        const lord = SIGN_LORDS[signName];
        const occupyingPlanets = planetFacts
            .filter((p) => p.house === houseNumber)
            .map((p) => p.planet);
        houseFacts.push({
            house: houseNumber,
            sign: signName,
            lord,
            planets: occupyingPlanets,
            occupied: occupyingPlanets.length > 0,
            occupantCount: occupyingPlanets.length,
        });
    }
    return houseFacts;
}
