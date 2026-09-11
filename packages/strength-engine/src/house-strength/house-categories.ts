export function getHouseCategories(houseNumber: number): string[] {
  const categories: string[] = [];

  if ([1, 4, 7, 10].includes(houseNumber)) {
    categories.push('KENDRA');
  }
  if ([1, 5, 9].includes(houseNumber)) {
    categories.push('TRIKONA');
  }
  if ([3, 6, 10, 11].includes(houseNumber)) {
    categories.push('UPACHAYA');
  }
  if ([6, 8, 12].includes(houseNumber)) {
    categories.push('DUSTHANA');
  }

  return categories;
}
