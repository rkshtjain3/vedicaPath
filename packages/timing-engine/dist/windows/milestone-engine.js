export function calculateLifeMilestones(params) {
    const { chart, analysis, mahadashas, currentDate = new Date() } = params;
    const currentMs = currentDate.getTime();
    const propertyWindows = [];
    const marriageWindows = [];
    const careerWindows = [];
    const relocationWindows = [];
    // Identify Key House Lords from Lagna
    // In Vedic astrology:
    // 4th House / Mars / Venus / 4th Lord -> Property & Real Estate
    // 7th House / Venus / Jupiter / 7th Lord -> Marriage & Unions
    // 10th House / Sun / Saturn / 10th Lord -> Career Elevation & Authority
    // 9th & 12th House / Rahu / Moon -> Relocation & Travel
    // Flatten antardashas for the next 10-15 years around current date
    const relevantPeriods = [];
    for (const m of mahadashas) {
        const mahaLord = m.lord || m.planet || m.name || 'Jupiter';
        const subPeriods = m.children || m.antardashas || [];
        if (subPeriods.length > 0) {
            for (const a of subPeriods) {
                const antarLord = a.lord || a.planet || a.name || 'Mars';
                const startRaw = a.start || a.startDate;
                const endRaw = a.end || a.endDate;
                const start = startRaw instanceof Date ? startRaw : new Date(startRaw);
                const end = endRaw instanceof Date ? endRaw : new Date(endRaw);
                // Include periods starting from 2 years ago to 15 years in the future
                if (end.getTime() >= currentMs - 2 * 365 * 86400000 && start.getTime() <= currentMs + 15 * 365 * 86400000) {
                    relevantPeriods.push({
                        maha: mahaLord,
                        antar: antarLord,
                        start,
                        end,
                        startStr: start.toISOString().split('T')[0],
                        endStr: end.toISOString().split('T')[0],
                    });
                }
            }
        }
        else {
            const startRaw = m.start || m.startDate;
            const endRaw = m.end || m.endDate;
            const start = startRaw instanceof Date ? startRaw : new Date(startRaw);
            const end = endRaw instanceof Date ? endRaw : new Date(endRaw);
            relevantPeriods.push({
                maha: mahaLord,
                antar: mahaLord,
                start,
                end,
                startStr: start.toISOString().split('T')[0],
                endStr: end.toISOString().split('T')[0],
            });
        }
    }
    // 1. PROPERTY & REAL ESTATE WINDOWS (4th House, Mars, Venus, Jupiter)
    for (const p of relevantPeriods) {
        const isMars = p.maha === 'Mars' || p.antar === 'Mars';
        const isVenus = p.maha === 'Venus' || p.antar === 'Venus';
        const isJupiter = p.maha === 'Jupiter' || p.antar === 'Jupiter';
        const isMoon = p.maha === 'Moon' || p.antar === 'Moon';
        if ((isMars && isVenus) || (isJupiter && isMars) || (isJupiter && isVenus) || (isMoon && isMars)) {
            propertyWindows.push({
                id: `prop_${p.startStr}`,
                category: 'PROPERTY',
                title: 'Prime Property & Asset Acquisition Window',
                titleHi: 'भवन एवं अचल संपत्ति क्रय का अनुकूल योग',
                description: `A strong window for purchasing real estate, land, or a personal residence during the ${p.maha}-${p.antar} dasha cycle.`,
                descriptionHi: `${p.maha}-${p.antar} दशा काल में भूमि, भवन अथवा नवीन आवास क्रय के लिए अत्यंत अनुकूल समय।`,
                startDate: p.startStr,
                endDate: p.endStr,
                confidence: (isMars && isJupiter) || (isMars && isVenus) ? 'HIGH' : 'FAVORABLE',
                confidenceLabel: (isMars && isJupiter) || (isMars && isVenus) ? 'High Probability' : 'Favorable Window',
                confidenceLabelHi: (isMars && isJupiter) || (isMars && isVenus) ? 'उच्च संभावना' : 'अनुकूल काल',
                supportingFactors: [
                    `Active activation of ${p.maha} (Bhumikaraka/Prosperity) and ${p.antar} (Comfort & Luxury)`,
                    'Favorable 4th house and planetary significator alignment',
                ],
                supportingFactorsHi: [
                    `${p.maha} (भूमिकारक/समृद्धि) तथा ${p.antar} (सुख एवं विलासिता) की सक्रिय दशा`,
                    'चतुर्थ भाव एवं शुभ ग्रहों का सकारात्मक संयोग',
                ],
                astrologicalBasis: `Dasha of ${p.maha} with Antardasha of ${p.antar} activates the 4th house natural significators (Mars for land/construction, Venus for home comfort).`,
                astrologicalBasisHi: `${p.maha} महादशा में ${p.antar} की अंतर्दशा चतुर्थ भाव के प्राकृतिक कारकों (मंगल-भूमि, शुक्र-गृह सुख) को सक्रिय करती है।`,
            });
        }
    }
    // If no specific property window found in immediate range, add prime candidate window
    if (propertyWindows.length === 0 && relevantPeriods.length > 0) {
        const candidate = relevantPeriods.find((p) => p.maha === 'Jupiter' || p.maha === 'Mars' || p.antar === 'Jupiter' || p.antar === 'Mars') || relevantPeriods[0];
        propertyWindows.push({
            id: `prop_default_${candidate.startStr}`,
            category: 'PROPERTY',
            title: 'Real Estate & Fixed Asset Milestone',
            titleHi: 'संपत्ति निर्माण एवं गृह सुख योग',
            description: `Favorable window to invest in fixed assets and build long-term domestic security.`,
            descriptionHi: 'स्थायी संपत्ति में निवेश तथा पारिवारिक सुरक्षा को सुदृढ़ करने का अनुकूल समय।',
            startDate: candidate.startStr,
            endDate: candidate.endStr,
            confidence: 'FAVORABLE',
            confidenceLabel: 'Favorable Window',
            confidenceLabelHi: 'अनुकूल काल',
            supportingFactors: [`Dasha activation of ${candidate.maha}-${candidate.antar}`, 'Stable 4th house foundation'],
            supportingFactorsHi: [`${candidate.maha}-${candidate.antar} की दशा सक्रियता`, 'चतुर्थ भाव का स्थिर प्रभाव'],
            astrologicalBasis: `Activation of ${candidate.maha}-${candidate.antar} dasha.`,
            astrologicalBasisHi: `${candidate.maha}-${candidate.antar} की दशा का प्रभाव।`,
        });
    }
    // 2. MARRIAGE & PARTNERSHIP WINDOWS (7th House, Venus, Jupiter, Rahu/Ketu)
    for (const p of relevantPeriods) {
        const isVenus = p.maha === 'Venus' || p.antar === 'Venus';
        const isJupiter = p.maha === 'Jupiter' || p.antar === 'Jupiter';
        const isMercury = p.maha === 'Mercury' || p.antar === 'Mercury';
        const isRahu = p.maha === 'Rahu' || p.antar === 'Rahu';
        if ((isVenus && isJupiter) || (isJupiter && isMercury) || (isVenus && isMercury) || (isVenus && isRahu) || (isJupiter && isRahu)) {
            marriageWindows.push({
                id: `marr_${p.startStr}`,
                category: 'MARRIAGE',
                title: 'Marriage & Significant Union Window',
                titleHi: 'विवाह एवं दांपत्य संबंध योग',
                description: `High auspiciousness for finding a life partner, marriage engagement, or stabilizing a long-term commitment during ${p.maha}-${p.antar}.`,
                descriptionHi: `${p.maha}-${p.antar} दशा में जीवनसाथी के आगमन, विवाह संबंध अथवा दांपत्य जीवन में स्थिरता का अत्यंत शुभ समय।`,
                startDate: p.startStr,
                endDate: p.endStr,
                confidence: (isVenus && isJupiter) || (isJupiter && isMercury) ? 'HIGH' : 'FAVORABLE',
                confidenceLabel: (isVenus && isJupiter) || (isJupiter && isMercury) ? 'Peak Union Phase' : 'Favorable Phase',
                confidenceLabelHi: (isVenus && isJupiter) || (isJupiter && isMercury) ? 'सर्वोत्तम विवाह काल' : 'अनुकूल समय',
                supportingFactors: [
                    `Harmony of ${p.maha} (Wisdom/Union) and ${p.antar} (Love/Affection)`,
                    '7th house Kalatrakaraka activation in natal matrix',
                ],
                supportingFactorsHi: [
                    `${p.maha} तथा ${p.antar} का शुभ सामंजस्य`,
                    'सप्तम भाव एवं कलत्रकारक ग्रह की सक्रियता',
                ],
                astrologicalBasis: `Vimshottari Dasha linking ${p.maha} and ${p.antar} activates the 7th house and primary relational significators (Venus/Jupiter).`,
                astrologicalBasisHi: `${p.maha} एवं ${p.antar} की दशा सप्तम भाव तथा संबंध कारक ग्रहों को सक्रिय करती है।`,
            });
        }
    }
    // 3. CAREER BREAKTHROUGH & ELEVATION WINDOWS (10th House, Sun, Saturn, Mars, Mercury)
    for (const p of relevantPeriods) {
        const isSun = p.maha === 'Sun' || p.antar === 'Sun';
        const isSaturn = p.maha === 'Saturn' || p.antar === 'Saturn';
        const isJupiter = p.maha === 'Jupiter' || p.antar === 'Jupiter';
        const isMars = p.maha === 'Mars' || p.antar === 'Mars';
        const isMercury = p.maha === 'Mercury' || p.antar === 'Mercury';
        if ((isSun && isJupiter) || (isSaturn && isMercury) || (isJupiter && isMars) || (isSun && isMars) || (isSaturn && isJupiter)) {
            careerWindows.push({
                id: `car_${p.startStr}`,
                category: 'CAREER_ELEVATION',
                title: 'Major Career Leap & Authority Elevation',
                titleHi: 'करियर पदोन्नति एवं अधिकार वृद्धि काल',
                description: `Peak momentum for professional advancement, leadership promotion, business expansion, or public recognition during ${p.maha}-${p.antar}.`,
                descriptionHi: `${p.maha}-${p.antar} काल में कार्यक्षेत्र में पदोन्नति, नेतृत्व वृद्धि, व्यापार विस्तार अथवा प्रतिष्ठा प्राप्ति का श्रेष्ठ समय।`,
                startDate: p.startStr,
                endDate: p.endStr,
                confidence: (isSun && isJupiter) || (isJupiter && isMars) ? 'HIGH' : 'FAVORABLE',
                confidenceLabel: (isSun && isJupiter) || (isJupiter && isMars) ? 'Peak Acceleration' : 'Growth Momentum',
                confidenceLabelHi: (isSun && isJupiter) || (isJupiter && isMars) ? 'तीव्र प्रगति' : 'निरंतर विकास',
                supportingFactors: [
                    `Karmadhipati activation under ${p.maha}-${p.antar} cycle`,
                    'High 10th house vigor and executive drive',
                ],
                supportingFactorsHi: [
                    `${p.maha}-${p.antar} चक्र के अंतर्गत कर्माधिपति की सक्रियता`,
                    'दशम भाव में नेतृत्व एवं कार्यकुशलता का सकारात्मक प्रभाव',
                ],
                astrologicalBasis: `Activation of ${p.maha} and ${p.antar} stimulates the 10th house of vocation and the Rajayoga matrix.`,
                astrologicalBasisHi: `${p.maha} एवं ${p.antar} की दशा दशम भाव और राजयोग संरचना को बल प्रदान करती है।`,
            });
        }
    }
    // 4. RELOCATION & EXPANSION WINDOWS (9th/12th House, Rahu, Moon, Jupiter)
    for (const p of relevantPeriods) {
        const isRahu = p.maha === 'Rahu' || p.antar === 'Rahu';
        const isMoon = p.maha === 'Moon' || p.antar === 'Moon';
        const isJupiter = p.maha === 'Jupiter' || p.antar === 'Jupiter';
        if ((isRahu && isMoon) || (isRahu && isJupiter) || (isMoon && isJupiter)) {
            relocationWindows.push({
                id: `reloc_${p.startStr}`,
                category: 'RELOCATION',
                title: 'Geographic Relocation & Horizon Expansion',
                titleHi: 'स्थान परिवर्तन एवं दूरस्थ यात्रा योग',
                description: `Strong indications for long-distance relocation, overseas travel, new environment transition, or intellectual expansion.`,
                descriptionHi: 'दूरस्थ नगर/विदेश गमन, नवीन परिवेश में बसने अथवा नए क्षितिजों की खोज के लिए प्रबल योग।',
                startDate: p.startStr,
                endDate: p.endStr,
                confidence: 'FAVORABLE',
                confidenceLabel: 'Travel / Shift Active',
                confidenceLabelHi: 'स्थान परिवर्तन सक्रिय',
                supportingFactors: [
                    `9th/12th house travel axis energized by ${p.maha}-${p.antar}`,
                    'Expansionary planetary influence',
                ],
                supportingFactorsHi: [
                    `${p.maha}-${p.antar} द्वारा नवम/द्वादश भाव की सक्रियता`,
                    'यात्रा एवं नए अनुभवों का अनुकूल संयोग',
                ],
                astrologicalBasis: `Interaction between ${p.maha} and ${p.antar} engages the 9th/12th journey indicators.`,
                astrologicalBasisHi: `${p.maha} तथा ${p.antar} का संयोग यात्रा एवं नए परिवेश के भावों को जाग्रत करता है।`,
            });
        }
    }
    // Find next upcoming major milestone from current date
    const allWindows = [...propertyWindows, ...marriageWindows, ...careerWindows, ...relocationWindows]
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const nextMajorMilestone = allWindows.find((w) => new Date(w.endDate).getTime() >= currentMs) || allWindows[0] || null;
    return {
        propertyWindows: propertyWindows.slice(0, 3),
        marriageWindows: marriageWindows.slice(0, 3),
        careerWindows: careerWindows.slice(0, 3),
        relocationWindows: relocationWindows.slice(0, 3),
        nextMajorMilestone,
    };
}
//# sourceMappingURL=milestone-engine.js.map