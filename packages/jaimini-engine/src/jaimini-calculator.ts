import { BirthChart } from '@vedica/astrology-core';
import { calculateCharaKarakas, analyzeKarakamsha } from './karakas/chara-karaka-calculator.js';
import { calculateArudhaPadas } from './arudha/arudha-calculator.js';
import { calculateRashiDrishti } from './drishti/rashi-drishti-calculator.js';
import { evaluateJaiminiYogas } from './yogas/jaimini-yoga-evaluator.js';
import { JaiminiReport } from './types/jaimini-types.js';

/**
 * Calculates a complete deterministic Jaimini Astrology report from a BirthChart (`personal-jaimini-v1`).
 */
export function evaluateJaimini(
  birthChart: BirthChart,
  scheme: '7_KARAKA' | '8_KARAKA' = '7_KARAKA'
): JaiminiReport {
  const charaKarakas = calculateCharaKarakas(birthChart, scheme);
  const karakamsha = analyzeKarakamsha(birthChart, charaKarakas);
  const arudhaPadas = calculateArudhaPadas(birthChart);
  const rashiDrishti = calculateRashiDrishti(birthChart);
  const yogas = evaluateJaiminiYogas(birthChart, charaKarakas, karakamsha, arudhaPadas, rashiDrishti);

  return {
    profileVersion: 'personal-jaimini-v1',
    scheme,
    charaKarakas,
    karakamsha,
    arudhaPadas,
    rashiDrishti,
    yogas,
    calculationConvention: {
      karakaScheme: scheme,
      rahuDegreeTreatment: scheme === '8_KARAKA' ? 'RETROGRADE_DEGREES' : 'NONE',
      arudhaExceptionRule: 'CLASSICAL_10TH_SHIFT',
      rashiDrishtiRule: 'CLASSICAL_MOVABLE_FIXED_DUAL',
    },
  };
}
