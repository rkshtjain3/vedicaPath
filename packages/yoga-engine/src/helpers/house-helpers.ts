/**
 * House Helpers for Classical Yoga Engine
 */

export function isKendraHouse(house: number): boolean {
  return [1, 4, 7, 10].includes(house);
}

export function isTrikonaHouse(house: number): boolean {
  return [1, 5, 9].includes(house);
}

export function isTrikHouse(house: number): boolean {
  return [6, 8, 12].includes(house);
}

export function isUpachayaHouse(house: number): boolean {
  return [3, 6, 10, 11].includes(house);
}

export function isWealthHouse(house: number): boolean {
  return [2, 5, 9, 11].includes(house);
}

/**
 * Calculates 1-based relative house distance from houseA to houseB in 12-house zodiac.
 * Example: houseA = 10, houseB = 1 -> ((1 - 10 + 12) % 12) + 1 = 4th house.
 */
export function getRelativeHouseDistance(fromHouse: number, toHouse: number): number {
  return ((toHouse - fromHouse + 12) % 12) + 1;
}

export function isKendraFromHouse(fromHouse: number, toHouse: number): boolean {
  const diff = getRelativeHouseDistance(fromHouse, toHouse);
  return isKendraHouse(diff);
}
