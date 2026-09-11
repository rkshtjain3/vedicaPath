/**
 * House Helpers for Classical Yoga Engine
 */
export declare function isKendraHouse(house: number): boolean;
export declare function isTrikonaHouse(house: number): boolean;
export declare function isTrikHouse(house: number): boolean;
export declare function isUpachayaHouse(house: number): boolean;
export declare function isWealthHouse(house: number): boolean;
/**
 * Calculates 1-based relative house distance from houseA to houseB in 12-house zodiac.
 * Example: houseA = 10, houseB = 1 -> ((1 - 10 + 12) % 12) + 1 = 4th house.
 */
export declare function getRelativeHouseDistance(fromHouse: number, toHouse: number): number;
export declare function isKendraFromHouse(fromHouse: number, toHouse: number): boolean;
