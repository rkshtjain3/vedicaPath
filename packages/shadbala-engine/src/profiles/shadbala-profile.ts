import { ShadbalaProfile } from '../types/shadbala-types.js';

export const PERSONAL_SHADBALA_V1: ShadbalaProfile = {
  version: 'personal-shadbala-v1',
  unit: 'VIRUPA',
  virupaPerRupa: 60,
  enabledComponents: [
    'STHANA_BALA',
    'DIG_BALA',
    'NAISARGIKA_BALA',
    'CHESHTA_BALA',
    'KAALA_BALA',
    'DRIK_BALA',
  ],
  digBalaMethodology: 'EXACT_ANGULAR',
  description: 'Canonical Classical Shadbala Profile V1 — Complete 6-fold mathematical strength system (BPHS Ch. 27)',
};
