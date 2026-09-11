const SIGN_ELEMENTS = {
    Aries: { vata: 20, pitta: 70, kapha: 10 },
    Taurus: { vata: 20, pitta: 20, kapha: 60 },
    Gemini: { vata: 70, pitta: 20, kapha: 10 },
    Cancer: { vata: 10, pitta: 20, kapha: 70 },
    Leo: { vata: 10, pitta: 80, kapha: 10 },
    Virgo: { vata: 50, pitta: 40, kapha: 10 },
    Libra: { vata: 65, pitta: 25, kapha: 10 },
    Scorpio: { vata: 20, pitta: 50, kapha: 30 },
    Sagittarius: { vata: 30, pitta: 60, kapha: 10 },
    Capricorn: { vata: 55, pitta: 15, kapha: 30 },
    Aquarius: { vata: 75, pitta: 15, kapha: 10 },
    Pisces: { vata: 25, pitta: 15, kapha: 60 },
};
export function calculateAyurvedicDoshaProfile(calculationData) {
    const ast = calculationData?.astrology || calculationData || {};
    const lagnaSign = ast.lagna?.sign?.name || ast.ascendant?.sign || 'Gemini';
    const moonSign = ast.moonSign?.name || ast.moonSign?.sign || 'Capricorn';
    const sunPlanet = ast.planets?.find?.((p) => p.planet === 'Sun' || p.name === 'Sun');
    const sunSign = sunPlanet?.sign?.name || sunPlanet?.sign || 'Virgo';
    const lagnaElem = SIGN_ELEMENTS[lagnaSign] || SIGN_ELEMENTS.Gemini;
    const moonElem = SIGN_ELEMENTS[moonSign] || SIGN_ELEMENTS.Capricorn;
    const sunElem = SIGN_ELEMENTS[sunSign] || SIGN_ELEMENTS.Virgo;
    // Weighted calculation: Lagna (45%), Sun (30%), Moon (25%)
    const rawVata = lagnaElem.vata * 0.45 + sunElem.vata * 0.3 + moonElem.vata * 0.25;
    const rawPitta = lagnaElem.pitta * 0.45 + sunElem.pitta * 0.3 + moonElem.pitta * 0.25;
    const rawKapha = lagnaElem.kapha * 0.45 + sunElem.kapha * 0.3 + moonElem.kapha * 0.25;
    const total = rawVata + rawPitta + rawKapha || 100;
    const vataPct = Math.round((rawVata / total) * 100);
    const pittaPct = Math.round((rawPitta / total) * 100);
    const kaphaPct = 100 - (vataPct + pittaPct);
    // Determine Primary Dosha
    let primaryDosha = 'VATA';
    if (vataPct >= 40 && pittaPct >= 35)
        primaryDosha = 'VATA_PITTA';
    else if (pittaPct >= 40 && kaphaPct >= 35)
        primaryDosha = 'PITTA_KAPHA';
    else if (vataPct >= 40 && kaphaPct >= 35)
        primaryDosha = 'VATA_KAPHA';
    else if (vataPct >= pittaPct && vataPct >= kaphaPct)
        primaryDosha = 'VATA';
    else if (pittaPct >= vataPct && pittaPct >= kaphaPct)
        primaryDosha = 'PITTA';
    else
        primaryDosha = 'KAPHA';
    // Digestive Fire
    let digestiveFire = 'Vishama (Irregular/Vata)';
    if (primaryDosha === 'PITTA' || primaryDosha === 'VATA_PITTA') {
        digestiveFire = 'Tikshna (Intense/Pitta)';
    }
    else if (primaryDosha === 'KAPHA') {
        digestiveFire = 'Manda (Slow/Kapha)';
    }
    // Recommendations based on constitution
    let adaptogens = ['Ashwagandha (Grounding & Vata regulation)', 'Brahmi (Cognitive calming)', 'Tulsi (Immune support)'];
    let favoredFoods = ['Warm soups, cooked root vegetables, ghee, cumin & ginger', 'Moong dal khichdi', 'Warm herbal teas (CCF: Cumin-Coriander-Fennel)'];
    let avoidFoods = ['Ice-cold water, dry crackers, raw salads at night', 'Carbonated sodas', 'Excessive unfermented dairy & late-night heavy snacking'];
    let breathwork = 'Anulom-Vilom (Alternate Nostril) 10 mins before meals to activate rest-and-digest parasympathetic mode.';
    if (primaryDosha === 'PITTA' || pittaPct >= 45) {
        adaptogens = ['Shatavari (Cooling & tissue soothing)', 'Amalaki (Natural Vitamin C & bile balancing)', 'Brahmi'];
        favoredFoods = ['Cooling fruits (sweet apples, melons, pomegranates)', 'Coconut water, coriander water, ghee', 'Sweet grains like basmati rice & oats'];
        avoidFoods = ['Excessive chili, deep fried oily foods, alcohol', 'Pungent vinegars, fermented hot sauces'];
        breathwork = 'Sheetali & Sheetkari (Cooling Breath) 5-7 mins during high noon heat.';
    }
    else if (primaryDosha === 'KAPHA') {
        adaptogens = ['Trikatu (Ginger, Black Pepper, Long Pepper)', 'Guggulu (Metabolism stimulant)', 'Tulsi'];
        favoredFoods = ['Light steamed greens, warming spices (cinnamon, mustard seeds, cloves)', 'Pomegranate, honey in warm water'];
        avoidFoods = ['Heavy fried cheeses, iced desserts, creamy gravies', 'Overeating post-sunset'];
        breathwork = 'Kapalabhati (Skull-shining stimulating breath) in the early morning.';
    }
    return {
        primaryDosha,
        scores: {
            vata: Math.round(rawVata),
            pitta: Math.round(rawPitta),
            kapha: Math.round(rawKapha),
        },
        percentages: {
            vata: vataPct,
            pitta: pittaPct,
            kapha: kaphaPct,
        },
        digestiveFireType: digestiveFire,
        circadianBioClock: {
            idealWakeWindow: '5:30 AM – 6:15 AM (Brahma Muhurta Vata Clarity)',
            peakDigestionWindow: '12:00 PM – 1:30 PM (Solar Jatharagni Peak)',
            deepWorkWindow: '9:00 AM – 12:00 PM & 3:00 PM – 5:30 PM',
            windDownWindow: '8:30 PM – 9:30 PM (Dim lighting & digital detox)',
            idealSleepWindow: '10:00 PM – 6:00 AM (Optimal Melatonin & Ojas Renewal)',
        },
        adaptogensAndHerbs: adaptogens,
        sattvicDietGuidelines: {
            favored: favoredFoods,
            toAvoid: avoidFoods,
        },
        breathworkProtocol: breathwork,
    };
}
//# sourceMappingURL=dosha-calculator.js.map