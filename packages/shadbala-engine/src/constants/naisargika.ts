import { PlanetName } from '@vedica/astrology-core';

/**
 * Classical Naisargika Bala (Natural Strength) constants in Virupas.
 *
 * According to Parashari classical Vedic astrology, natural strength is fixed based on illumination/brilliance:
 * 1. Sun     = 60.00 Virupas (1.000 Rupa = 60/60)
 * 2. Moon    = 51.43 Virupas (0.857 Rupa = 51 + 3/7 virupas = 51.428571...)
 * 3. Venus   = 42.86 Virupas (0.714 Rupa = 42 + 6/7 virupas = 42.857142...)
 * 4. Jupiter = 34.29 Virupas (0.571 Rupa = 34 + 2/7 virupas = 34.285714...)
 * 5. Mercury = 25.71 Virupas (0.429 Rupa = 25 + 5/7 virupas = 25.714285...)
 * 6. Mars    = 17.14 Virupas (0.286 Rupa = 17 + 1/7 virupas = 17.142857...)
 * 7. Saturn  = 8.57 Virupas  (0.143 Rupa = 8 + 4/7 virupas  = 8.571428...)
 *
 * Source: Brihat Parasara Hora Shastra (BPHS) Shadbala Adhyaya.
 */
export const NAISARGIKA_BALA_VIRUPAS: Record<PlanetName, number> = {
  Sun: 60.0,
  Moon: 51.42857142857143,
  Venus: 42.857142857142854,
  Jupiter: 34.285714285714285,
  Mercury: 25.714285714285715,
  Mars: 17.142857142857142,
  Saturn: 8.571428571428571,
  Rahu: 0,
  Ketu: 0,
};

export const NAISARGIKA_BALA_METADATA = {
  sourceCategory: 'Brihat Parasara Hora Shastra (BPHS)',
  version: 'classical-naisargika-v1',
  unit: 'VIRUPA',
};
