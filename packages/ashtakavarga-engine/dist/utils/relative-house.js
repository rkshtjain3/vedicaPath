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
export function getRelativeHouse(sourceSignIndex, targetSignIndex) {
    if (sourceSignIndex < 1 ||
        sourceSignIndex > 12 ||
        targetSignIndex < 1 ||
        targetSignIndex > 12) {
        throw new Error(`Invalid sign index provided to getRelativeHouse: source=${sourceSignIndex}, target=${targetSignIndex}. Indices must be between 1 and 12.`);
    }
    return ((targetSignIndex - sourceSignIndex + 12) % 12) + 1;
}
