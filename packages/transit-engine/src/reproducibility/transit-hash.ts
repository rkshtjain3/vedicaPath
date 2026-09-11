import { createHash } from 'crypto';
import { TransitPosition } from '../types.js';

export function calculateTransitHash(
  profileVersion: string,
  transitDateIso: string,
  planets: TransitPosition[]
): string {
  const planetStrings = planets
    .map((p) => `${p.planet}:${p.sign.name}:${p.longitude.toFixed(4)}:${p.isRetrograde ? 'R' : 'D'}`)
    .sort()
    .join('|');

  const payload = `${profileVersion}|${transitDateIso}|${planetStrings}`;

  return createHash('sha256').update(payload).digest('hex');
}
