export type D10HouseCategory = 'KENDRA' | 'TRIKONA' | 'UPACHAYA' | 'DUSTHANA' | 'OTHER';

export function getD10HouseCategory(house: number): D10HouseCategory {
  if ([1, 4, 7, 10].includes(house)) {
    return 'KENDRA';
  }
  if ([5, 9].includes(house)) {
    return 'TRIKONA';
  }
  if ([3, 11].includes(house)) {
    return 'UPACHAYA';
  }
  if ([6, 8, 12].includes(house)) {
    return 'DUSTHANA';
  }
  return 'OTHER';
}
