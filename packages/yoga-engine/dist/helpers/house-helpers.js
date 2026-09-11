/**
 * House Helpers for Classical Yoga Engine
 */
export function isKendraHouse(house) {
    return [1, 4, 7, 10].includes(house);
}
export function isTrikonaHouse(house) {
    return [1, 5, 9].includes(house);
}
export function isTrikHouse(house) {
    return [6, 8, 12].includes(house);
}
export function isUpachayaHouse(house) {
    return [3, 6, 10, 11].includes(house);
}
export function isWealthHouse(house) {
    return [2, 5, 9, 11].includes(house);
}
/**
 * Calculates 1-based relative house distance from houseA to houseB in 12-house zodiac.
 * Example: houseA = 10, houseB = 1 -> ((1 - 10 + 12) % 12) + 1 = 4th house.
 */
export function getRelativeHouseDistance(fromHouse, toHouse) {
    return ((toHouse - fromHouse + 12) % 12) + 1;
}
export function isKendraFromHouse(fromHouse, toHouse) {
    const diff = getRelativeHouseDistance(fromHouse, toHouse);
    return isKendraHouse(diff);
}
