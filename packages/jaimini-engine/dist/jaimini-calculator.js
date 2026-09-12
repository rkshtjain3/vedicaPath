import { calculateCharaKarakas, analyzeKarakamsha } from './karakas/chara-karaka-calculator.js';
import { calculateArudhaPadas } from './arudha/arudha-calculator.js';
import { calculateRashiDrishti } from './drishti/rashi-drishti-calculator.js';
import { evaluateJaiminiYogas } from './yogas/jaimini-yoga-evaluator.js';
/**
 * Calculates a complete deterministic Jaimini Astrology report from a BirthChart (`personal-jaimini-v1`).
 */
export function evaluateJaimini(birthChart, scheme = '7_KARAKA') {
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
