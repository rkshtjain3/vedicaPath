import { calculateCharaKarakas, analyzeKarakamsha } from './karakas/chara-karaka-calculator.js';
import { calculateArudhaPadas } from './arudha/arudha-calculator.js';
import { calculateRashiDrishti } from './drishti/rashi-drishti-calculator.js';
/**
 * Calculates a complete deterministic Jaimini Astrology report from a BirthChart.
 */
export function evaluateJaimini(birthChart, scheme = '7_KARAKA') {
    const charaKarakas = calculateCharaKarakas(birthChart, scheme);
    const karakamsha = analyzeKarakamsha(birthChart, charaKarakas);
    const arudhaPadas = calculateArudhaPadas(birthChart);
    const rashiDrishti = calculateRashiDrishti(birthChart);
    return {
        scheme,
        charaKarakas,
        karakamsha,
        arudhaPadas,
        rashiDrishti,
    };
}
