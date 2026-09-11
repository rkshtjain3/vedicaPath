export function getPlanetDignity(planet, dignities) {
    return dignities.find((d) => d.planet.toLowerCase() === planet.toLowerCase());
}
export function isDignified(dignity) {
    if (!dignity)
        return false;
    return (dignity.primaryDignity === 'OWN_SIGN' ||
        dignity.primaryDignity === 'EXALTED' ||
        dignity.primaryDignity === 'MOOLATRIKONA');
}
export function isExalted(dignity) {
    if (!dignity)
        return false;
    return dignity.primaryDignity === 'EXALTED';
}
export function isDebilitated(dignity) {
    if (!dignity)
        return false;
    return dignity.primaryDignity === 'DEBILITATED';
}
