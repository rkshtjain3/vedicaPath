// Nakshatra Gana mapping (1-27)
// Deva: 1, 5, 7, 8, 13, 15, 17, 22, 27
// Manushya: 2, 4, 11, 12, 20, 21, 25, 26
// Rakshasa: 3, 6, 9, 10, 14, 16, 18, 19, 23, 24
const GANA_MAP = {
    1: 'DEVA', 2: 'MANUSHYA', 3: 'RAKSHASA', 4: 'MANUSHYA', 5: 'DEVA',
    6: 'RAKSHASA', 7: 'DEVA', 8: 'DEVA', 9: 'RAKSHASA', 10: 'RAKSHASA',
    11: 'MANUSHYA', 12: 'MANUSHYA', 13: 'DEVA', 14: 'RAKSHASA', 15: 'DEVA',
    16: 'RAKSHASA', 17: 'DEVA', 18: 'RAKSHASA', 19: 'RAKSHASA', 20: 'MANUSHYA',
    21: 'MANUSHYA', 22: 'DEVA', 23: 'RAKSHASA', 24: 'RAKSHASA', 25: 'MANUSHYA',
    26: 'MANUSHYA', 27: 'DEVA',
};
// Nadi mapping (1-27)
// Adi: 1, 6, 7, 12, 13, 18, 19, 24, 25
// Madhya: 2, 5, 8, 11, 14, 17, 20, 23, 26
// Antya: 3, 4, 9, 10, 15, 16, 21, 22, 27
const NADI_MAP = {
    1: 'ADI', 2: 'MADHYA', 3: 'ANTYA', 4: 'ANTYA', 5: 'MADHYA', 6: 'ADI',
    7: 'ADI', 8: 'MADHYA', 9: 'ANTYA', 10: 'ANTYA', 11: 'MADHYA', 12: 'ADI',
    13: 'ADI', 14: 'MADHYA', 15: 'ANTYA', 16: 'ANTYA', 17: 'MADHYA', 18: 'ADI',
    19: 'ADI', 20: 'MADHYA', 21: 'ANTYA', 22: 'ANTYA', 23: 'MADHYA', 24: 'ADI',
    25: 'ADI', 26: 'MADHYA', 27: 'ANTYA',
};
export function calculateAshtaKoota(moonNakshatraA, // 1-27
moonRashiA, // 1-12
moonNakshatraB, moonRashiB) {
    const scores = [];
    // 1. Varna (1 point)
    // Brahmin: 4, 8, 12 | Kshatriya: 1, 5, 9 | Vaishya: 2, 6, 10 | Shudra: 3, 7, 11
    const getVarnaRank = (rashi) => {
        if ([4, 8, 12].includes(rashi))
            return 4; // Brahmin
        if ([1, 5, 9].includes(rashi))
            return 3; // Kshatriya
        if ([2, 6, 10].includes(rashi))
            return 2; // Vaishya
        return 1; // Shudra
    };
    const varnaA = getVarnaRank(moonRashiA);
    const varnaB = getVarnaRank(moonRashiB);
    const varnaPts = varnaB >= varnaA ? 1 : 0;
    scores.push({
        kootaName: 'Varna',
        maxPoints: 1,
        obtainedPoints: varnaPts,
        description: varnaPts === 1 ? 'Harmonious spiritual and work temperaments.' : 'Minor difference in core work orientation.',
    });
    // 2. Vashya (2 points)
    const isSameRashi = moonRashiA === moonRashiB;
    const vashyaPts = isSameRashi ? 2 : 1;
    scores.push({
        kootaName: 'Vashya',
        maxPoints: 2,
        obtainedPoints: vashyaPts,
        description: vashyaPts === 2 ? 'Strong mutual attraction and influence.' : 'Balanced mutual compatibility.',
    });
    // 3. Tara (3 points)
    const countAB = ((moonNakshatraB - moonNakshatraA + 27) % 9);
    const countBA = ((moonNakshatraA - moonNakshatraB + 27) % 9);
    const isAuspiciousTara = (c) => ![3, 5, 7].includes(c);
    let taraPts = 0;
    if (isAuspiciousTara(countAB) && isAuspiciousTara(countBA))
        taraPts = 3;
    else if (isAuspiciousTara(countAB) || isAuspiciousTara(countBA))
        taraPts = 1.5;
    scores.push({
        kootaName: 'Tara',
        maxPoints: 3,
        obtainedPoints: taraPts,
        description: `Destiny and health alignment (${taraPts}/3 points).`,
    });
    // 4. Yoni (4 points)
    const yoniPts = (moonNakshatraA % 14 === moonNakshatraB % 14) ? 4 : 2;
    scores.push({
        kootaName: 'Yoni',
        maxPoints: 4,
        obtainedPoints: yoniPts,
        description: yoniPts >= 3 ? 'High biological and physical harmony.' : 'Moderate physical affinity.',
    });
    // 5. Graha Maitri (5 points)
    const maitriPts = (moonRashiA === moonRashiB || Math.abs(moonRashiA - moonRashiB) === 6) ? 5 : 3;
    scores.push({
        kootaName: 'GrahaMaitri',
        maxPoints: 5,
        obtainedPoints: maitriPts,
        description: `Psychological and emotional friendship (${maitriPts}/5 points).`,
    });
    // 6. Gana (6 points)
    const ganaA = GANA_MAP[moonNakshatraA] || 'DEVA';
    const ganaB = GANA_MAP[moonNakshatraB] || 'DEVA';
    let ganaPts = 6;
    if (ganaA === ganaB)
        ganaPts = 6;
    else if ((ganaA === 'DEVA' && ganaB === 'MANUSHYA') || (ganaA === 'MANUSHYA' && ganaB === 'DEVA'))
        ganaPts = 5;
    else if ((ganaA === 'DEVA' && ganaB === 'RAKSHASA') || (ganaA === 'RAKSHASA' && ganaB === 'DEVA'))
        ganaPts = 1;
    else
        ganaPts = 0;
    scores.push({
        kootaName: 'Gana',
        maxPoints: 6,
        obtainedPoints: ganaPts,
        description: `Temperamental match (${ganaA} vs ${ganaB} -> ${ganaPts}/6 points).`,
    });
    // 7. Bhakoot (7 points)
    const diffRashi = ((moonRashiB - moonRashiA + 12) % 12) + 1;
    const isBhakootDosha = [2, 6, 8, 12].includes(diffRashi);
    const bhakootPts = isBhakootDosha ? 0 : 7;
    scores.push({
        kootaName: 'Bhakoot',
        maxPoints: 7,
        obtainedPoints: bhakootPts,
        description: isBhakootDosha ? 'Bhakoot Dosha present (requires Rashi Lord friendship check).' : 'Auspicious Rashi relationship (7/7 points).',
    });
    // 8. Nadi (8 points)
    const nadiA = NADI_MAP[moonNakshatraA] || 'ADI';
    const nadiB = NADI_MAP[moonNakshatraB] || 'ADI';
    const isNadiDosha = nadiA === nadiB;
    const nadiPts = isNadiDosha ? 0 : 8;
    scores.push({
        kootaName: 'Nadi',
        maxPoints: 8,
        obtainedPoints: nadiPts,
        description: isNadiDosha ? `Same Nadi (${nadiA}) present — Nadi Dosha.` : `Different Nadis (${nadiA} & ${nadiB}) — Excellent physiological match (8/8 points).`,
    });
    const totalObtained = scores.reduce((sum, s) => sum + s.obtainedPoints, 0);
    const percentage = Math.round((totalObtained / 36) * 100);
    let grade = 'AVERAGE';
    if (totalObtained >= 28)
        grade = 'EXCELLENT';
    else if (totalObtained >= 21)
        grade = 'GOOD';
    else if (totalObtained >= 18)
        grade = 'AVERAGE';
    else if (totalObtained >= 14)
        grade = 'BELOW_AVERAGE';
    else
        grade = 'POOR';
    return {
        scores,
        totalObtained,
        maxTotal: 36,
        percentage,
        compatibilityGrade: grade,
        nadiDoshaPresent: isNadiDosha,
        bhakootDoshaPresent: isBhakootDosha,
    };
}
