/**
 * Calculates the 1-indexed relative house position of a target sign
 * counted from a source sign position in the zodiac.
 *
 * Formula:
 * relativeHouse = ((targetSignIndex - sourceSignIndex + 12) % 12) + 1
 *
 * @param sourceSignIndex Sign index (1 = Aries, ..., 12 = Pisces)
 * @param targetSignIndex Sign index (1 = Aries, ..., 12 = Pisces)
 * @returns Relative house index in [1, 12]
 */
export declare function getRelativeHouse(sourceSignIndex: number, targetSignIndex: number): number;
