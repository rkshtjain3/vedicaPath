import { StrengthProfile } from '../types/strength-types.js';

export const PERSONAL_STRENGTH_V1: StrengthProfile = {
  version: 'personal-strength-v1',
  weights: {
    EXALTED: 6,
    MOOLATRIKONA: 5,
    OWN_SIGN: 4,
    GREAT_FRIEND_SIGN: 3,
    FRIENDLY_SIGN: 2,
    NEUTRAL_SIGN: 0,
    ENEMY_SIGN: -2,
    GREAT_ENEMY_SIGN: -3,
    DEBILITATED: -5,
    KENDRA_HOUSE: 3,
    TRIKONA_HOUSE: 3,
    UPACHAYA_HOUSE: 1,
    DUSTHANA_HOUSE: -2,
    VARGOTTAMA: 3,
    COMBUSTION: -3,
    RETROGRADE_DEFAULT: 0,
    BENEFIC_ASPECT: 1,
    MALEFIC_ASPECT: -1,
  },
  thresholds: {
    VERY_STRONG: 7,
    STRONG: 3,
    MODERATE: 0,
    WEAK: -3,
    VERY_WEAK: -4,
  },
};
