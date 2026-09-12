import { RASHIS } from '@vedica/astrology-core';
import { calculateNavamsaPosition } from '@vedica/divisional-chart-engine';
const KARAKA_METADATA_7 = [
    {
        role: 'AK',
        name: 'Atmakaraka (आत्मकारक)',
        nameHi: 'आत्मकारक (आत्मा व जीवन-ध्येय)',
        significance: 'Soul significator, spiritual evolution, life purpose, supreme inner guide',
        significanceHi: 'आत्मा का कारक, आध्यात्मिक विकास, मूल जीवन-उद्देश्य एवं आंतरिक प्रेरणा',
    },
    {
        role: 'AmK',
        name: 'Amatyakaraka (अमात्यकारक)',
        nameHi: 'अमात्यकारक (कर्म व आजीविका)',
        significance: 'Career, profession, ministerial ability, societal authority, ambition',
        significanceHi: 'कर्म, पद-प्रतिष्ठा, आजीविका, प्रशासनिक क्षमता एवं सामाजिक उत्तरदायित्व',
    },
    {
        role: 'BK',
        name: 'Bhratrikaraka (भ्रातृकारक)',
        nameHi: 'भ्रातृकारक (गुरु व पराक्रम)',
        significance: 'Spiritual guides, mentors, teachers, siblings, courage and initiative',
        significanceHi: 'गुरु, पथ-प्रदर्शक, परामर्शदाता, भाई-बहन एवं साहसिक निर्णय',
    },
    {
        role: 'MK',
        name: 'Matrikaraka (मातृकारक)',
        nameHi: 'मातृकारक (माता व भावनात्मक सुख)',
        significance: 'Mother, emotional stability, inner peace, heart contentment, nurturing',
        significanceHi: 'माता का कारक, मानसिक शांति, भावनात्मक संतुलन एवं आंतरिक सुख',
    },
    {
        role: 'PK',
        name: 'Putrakaraka (पुत्रकारक)',
        nameHi: 'पुत्रकारक (संतान व मेधा)',
        significance: 'Children, higher intelligence, creativity, memory, disciples, wisdom',
        significanceHi: 'संतान सुख, तीव्र बुद्धि, मेधा, सृजनशीलता एवं गहन विवेक',
    },
    {
        role: 'GK',
        name: 'Gnatikaraka (ज्ञातिकारक)',
        nameHi: 'ज्ञातिकारक (चुनौतियां व संघर्ष)',
        significance: 'Karmic tests, obstacles, competition, health vulnerabilities, relatives',
        significanceHi: 'कर्मिक परीक्षाएं, बाधाएं, प्रतिस्पर्धा, स्वास्थ्य चुनौतियां एवं संघर्ष',
    },
    {
        role: 'DK',
        name: 'Darakaraka (दाराकारक)',
        nameHi: 'दाराकारक (जीवनसाथी व साझेदारी)',
        significance: 'Spouse, life partner, marriage, intimate bonds, business alliances',
        significanceHi: 'जीवनसाथी, वैवाहिक सुख, घनिष्ठ संबंध एवं व्यापारिक साझेदारियां',
    },
];
const KARAKA_METADATA_8 = [
    KARAKA_METADATA_7[0], // AK
    KARAKA_METADATA_7[1], // AmK
    KARAKA_METADATA_7[2], // BK
    KARAKA_METADATA_7[3], // MK
    {
        role: 'PiK',
        name: 'Pitrikaraka (पितृकारक)',
        nameHi: 'पितृकारक (पिता व पितृकुल)',
        significance: 'Father, paternal lineage, ancestral karma, dharma and heritage',
        significanceHi: 'पिता, पैतृक संस्कार, वंश परंपरा एवं धर्म पालन',
    },
    KARAKA_METADATA_7[4], // PK
    KARAKA_METADATA_7[5], // GK
    KARAKA_METADATA_7[6], // DK
];
/**
 * Calculates 7-Karaka or 8-Karaka Jaimini Chara Karakas with explicit WHY evidence.
 */
export function calculateCharaKarakas(birthChart, scheme = '7_KARAKA') {
    const allowedPlanets = scheme === '7_KARAKA'
        ? ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']
        : ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu'];
    const candidatePlanets = [];
    for (const p of birthChart.planets) {
        if (!allowedPlanets.includes(p.planet))
            continue;
        const rawDegInSign = p.longitude % 30;
        let effectiveDegree = rawDegInSign;
        // For Rahu in 8-karaka scheme, retrograde degree is 30 - deg
        if (p.planet === 'Rahu' && scheme === '8_KARAKA') {
            effectiveDegree = 30 - rawDegInSign;
        }
        const sign = p.rashi ?? p.sign ?? RASHIS[Math.floor(p.longitude / 30)];
        candidatePlanets.push({
            planet: p.planet,
            degreeInSign: rawDegInSign,
            effectiveDegree,
            longitude: p.longitude,
            sign,
        });
    }
    // Sort descending by effective degree in sign
    candidatePlanets.sort((a, b) => b.effectiveDegree - a.effectiveDegree);
    const metaList = scheme === '7_KARAKA' ? KARAKA_METADATA_7 : KARAKA_METADATA_8;
    const result = [];
    for (let i = 0; i < metaList.length && i < candidatePlanets.length; i++) {
        const meta = metaList[i];
        const cand = candidatePlanets[i];
        const rank = i + 1;
        const isRahu8 = cand.planet === 'Rahu' && scheme === '8_KARAKA';
        const reasoning = isRahu8
            ? `${cand.planet} ranked #${rank} with effective degree ${cand.effectiveDegree.toFixed(4)}° (calculated as 30° - ${cand.degreeInSign.toFixed(4)}° due to retrograde motion in 8-Karaka scheme). Assigned as ${meta.role} (${meta.name}).`
            : `${cand.planet} ranked #${rank} with degree ${cand.degreeInSign.toFixed(4)}° in ${cand.sign.name}. Assigned as ${meta.role} (${meta.name}).`;
        const reasoningHi = isRahu8
            ? `${cand.planet} की प्रभावी डिग्री ${cand.effectiveDegree.toFixed(4)}° (8-कारक नियम में वक्री होने से 30° - ${cand.degreeInSign.toFixed(4)}°) के आधार पर #${rank} स्थान मिला। ${meta.role} (${meta.nameHi}) निर्धारित किया गया।`
            : `${cand.planet} की राशि डिग्री ${cand.degreeInSign.toFixed(4)}° (${cand.sign.name}) के आधार पर #${rank} स्थान मिला। ${meta.role} (${meta.nameHi}) निर्धारित किया गया।`;
        const evidence = {
            planet: cand.planet,
            longitude: Number(cand.longitude.toFixed(4)),
            signName: cand.sign.name,
            degreeInSign: Number(cand.degreeInSign.toFixed(4)),
            effectiveDegree: Number(cand.effectiveDegree.toFixed(4)),
            rank,
            assignedRole: meta.role,
            methodology: scheme === '7_KARAKA' ? 'Jaimini 7-Chara Karaka Classical Ranking' : 'Jaimini 8-Chara Karaka (with Rahu 30°-deg) Scheme',
            reasoning,
            reasoningHi,
        };
        result.push({
            role: meta.role,
            name: meta.name,
            nameHi: meta.nameHi,
            planet: cand.planet,
            degreeInSign: Number(cand.degreeInSign.toFixed(4)),
            longitude: Number(cand.longitude.toFixed(4)),
            sign: cand.sign,
            significance: meta.significance,
            significanceHi: meta.significanceHi,
            evidence,
        });
    }
    return result;
}
/**
 * Analyzes the Karakamsha (the D9 Navamsa sign occupied by the Atmakaraka) with explicit evidence.
 */
export function analyzeKarakamsha(birthChart, charaKarakas) {
    const ak = charaKarakas.find((k) => k.role === 'AK');
    if (!ak) {
        throw new Error('Atmakaraka not found in Chara Karaka list');
    }
    const navamsaPos = calculateNavamsaPosition(ak.longitude);
    const karakamshaSign = navamsaPos.sign;
    const d1LagnaSignId = birthChart.lagna?.sign?.id ?? birthChart.ascendant?.rashi?.id ?? 1;
    const karakamshaHouseFromLagna = ((karakamshaSign.id - d1LagnaSignId + 12) % 12) + 1;
    const lagnaLong = birthChart.ascendant?.totalLongitude ?? birthChart.lagna?.longitude ?? 0;
    const navamsaLagna = calculateNavamsaPosition(lagnaLong);
    const isSwamsha = navamsaLagna.sign.id === karakamshaSign.id;
    const reasoning = `Atmakaraka is ${ak.planet} (located at ${ak.longitude}° in D1 ${ak.sign.name}). Its Navamsa (D9) position falls in ${karakamshaSign.name}, forming the Karakamsha. In D1, this sign corresponds to House ${karakamshaHouseFromLagna} from Lagna.${isSwamsha ? ' Swamsha condition is satisfied (Navamsa Lagna equals Karakamsha).' : ''}`;
    const reasoningHi = `आत्मकारक ${ak.planet} (D1 ${ak.sign.name} में ${ak.longitude}° पर) नवांश (D9) में ${karakamshaSign.name} राशि में स्थित है, जो कारकांश बनाता है। D1 में यह लग्न से ${karakamshaHouseFromLagna}वां भाव है।${isSwamsha ? ' स्वांश स्थिति पूर्ण है (नवांश लग्न और कारकांश एक ही हैं)।' : ''}`;
    const evidence = {
        atmakarakaPlanet: ak.planet,
        d1Sign: ak.sign.name,
        d9NavamsaSign: karakamshaSign.name,
        karakamshaHouseFromD1Lagna: karakamshaHouseFromLagna,
        isSwamsha,
        reasoning,
        reasoningHi,
    };
    return {
        atmakarakaPlanet: ak.planet,
        d1Sign: ak.sign,
        karakamshaSign,
        karakamshaHouseFromLagna,
        isSwamsha,
        significance: `Karakamsha is in ${karakamshaSign.name} (House ${karakamshaHouseFromLagna} from Lagna). Reveals deep soul mission, inner Dharma, and spiritual aptitude.`,
        significanceHi: `कारकांश ${karakamshaSign.name} में स्थित है (लग्न से ${karakamshaHouseFromLagna}वां भाव)। यह आत्मा के मूल उद्देश्य, आध्यात्मिक प्रवृत्तियों एवं धर्म-मार्ग को उजागर करता है।`,
        evidence,
    };
}
