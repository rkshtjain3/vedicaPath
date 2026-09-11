const ZODIAC_SIGNS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];
export function diagnoseStruggleAndFailure(params) {
    const { chart, analysis, currentDasha, ashtakavarga, transitAnalysis, currentDate = new Date() } = params;
    const causes = [];
    const moonSign = chart.moonSign?.name || chart.moonSign?.sign || 'Aries';
    const ascSign = chart.lagna?.sign?.name || chart.ascendant?.sign || 'Aries';
    const currentMaha = currentDasha?.mahadasha?.planet || 'Saturn';
    const currentAntar = currentDasha?.antardasha?.planet || 'Mercury';
    const antarEnd = currentDasha?.antardasha?.endDate ? currentDasha.antardasha.endDate.split('T')[0] : '2027-03-01';
    // 1. Check Sade Sati & Saturn Pressure
    // Transiting Saturn is currently in Pisces/Aquarius
    const saturnTransitSign = transitAnalysis?.planets?.find((p) => p.name === 'Saturn')?.sign || 'Pisces';
    const moonIdx = ZODIAC_SIGNS.indexOf(moonSign);
    const satIdx = ZODIAC_SIGNS.indexOf(saturnTransitSign);
    let isSadeSati = false;
    let isAshtamaShani = false;
    let isKantakaShani = false;
    if (moonIdx !== -1 && satIdx !== -1) {
        const diff = ((satIdx - moonIdx + 12) % 12) + 1;
        if (diff === 12 || diff === 1 || diff === 2) {
            isSadeSati = true;
            causes.push({
                code: 'SADE_SATI_ACTIVE',
                category: 'SADE_SATI',
                title: 'Active Saturn Sade Sati Transit',
                titleHi: 'शनि साढ़े साती का प्रभाव',
                severity: diff === 1 ? 'HIGH' : 'MODERATE',
                explanation: 'Saturn is transiting adjacent to your natal Moon. This cycle is known for testing emotional resilience, stripping away illusions, slowing down easy progress, and demanding uncompromising discipline.',
                explanationHi: 'शनि आपकी जन्म राशि के निकट भ्रमण कर रहे हैं। यह काल धैर्य, अनुशासन और मानसिक दृढ़ता की परीक्षा लेता है तथा अनावश्यक भ्रमों को दूर करता है।',
                astrologicalDetail: `Transiting Saturn in ${saturnTransitSign} is in the ${diff === 12 ? '12th (entry)' : diff === 1 ? 'peak' : 'setting'} phase from natal Moon (${moonSign}).`,
            });
        }
        else if (diff === 8) {
            isAshtamaShani = true;
            causes.push({
                code: 'ASHTAMA_SHANI',
                category: 'ASHTAMA_SHANI',
                title: 'Ashtama Shani (Saturn in 8th from Moon)',
                titleHi: 'अष्टम शनि का प्रभाव',
                severity: 'HIGH',
                explanation: 'Saturn transiting the 8th house from natal Moon triggers unexpected roadblocks, delays in closures, and psychological restructuring.',
                explanationHi: 'चंद्रमा से अष्टम भाव में शनि का गोचर अनपेक्षित रुकावटें, विलंब तथा मानसिक दबाव उत्पन्न करता है।',
                astrologicalDetail: `Saturn transiting ${saturnTransitSign} (8th from natal Moon ${moonSign}).`,
            });
        }
        else if (diff === 4 || diff === 10) {
            isKantakaShani = true;
            causes.push({
                code: 'KANTAKA_SHANI',
                category: 'ASHTAMA_SHANI',
                title: 'Kantaka Shani (Saturn Quadrant Pressure)',
                titleHi: 'कंटक शनि गोचर',
                severity: 'MODERATE',
                explanation: 'Saturn transiting a cardinal square (4th or 10th) from Moon tests career stability and domestic peace, requiring double the effort for standard outcomes.',
                explanationHi: 'चंद्रमा से चतुर्थ या दशम भाव में शनि का गोचर कार्यक्षेत्र और पारिवारिक सुख में अतिरिक्त परिश्रम की मांग करता है।',
                astrologicalDetail: `Saturn in ${saturnTransitSign} (${diff}th from Moon).`,
            });
        }
    }
    // 2. Check Rahu / Ketu Active Periods & Nodal Friction
    if (currentMaha === 'Rahu' || currentAntar === 'Rahu') {
        causes.push({
            code: 'RAHU_ACTIVATION',
            category: 'RAHU_KETU_AXIS',
            title: 'Rahu Dasha Transformation & Turbulence',
            titleHi: 'राहु दशा का अनपेक्षित प्रभाव',
            severity: currentMaha === 'Rahu' ? 'HIGH' : 'MODERATE',
            explanation: 'Rahu cycles create rapid ambition accompanied by sudden shifts, restlessness, unexpected pivots, and trial-by-fire learning experiences where old methods stop working.',
            explanationHi: 'राहु की दशा तीव्र महत्वाकांक्षा के साथ-साथ अचानक परिवर्तन, अस्थिरता और अप्रत्याशित अनुभव प्रदान करती है जहां पुरानी रणनीतियां निष्फल हो जाती हैं।',
            astrologicalDetail: `Active ${currentMaha}-${currentAntar} Vimshottari period under Rahu's karmic node influence.`,
        });
    }
    else if (currentMaha === 'Ketu' || currentAntar === 'Ketu') {
        causes.push({
            code: 'KETU_ACTIVATION',
            category: 'RAHU_KETU_AXIS',
            title: 'Ketu Detachment & Reorientation Cycle',
            titleHi: 'केतु दशा में आंतरिक मंथन',
            severity: 'MODERATE',
            explanation: 'Ketu brings a feeling of apathy or blockage in external material pursuits to force you into deeper self-reflection, skill mastery, or shedding outdated attachments.',
            explanationHi: 'केतु का प्रभाव बाह्य कार्यों में कुछ उदासीनता या रुकावट लाता है ताकि व्यक्ति आंतरिक चिंतन और आत्म-सुधार पर ध्यान केंद्रित कर सके।',
            astrologicalDetail: `Active ${currentMaha}-${currentAntar} period with Ketu nodal influence.`,
        });
    }
    // 3. Check 8th or 12th House activations in Analysis
    const dusthanaPlanets = ['Saturn', 'Rahu', 'Ketu', 'Mars'];
    if (dusthanaPlanets.includes(currentAntar) && !causes.some((c) => c.code.includes(currentAntar.toUpperCase()))) {
        causes.push({
            code: 'SUB_LORD_FRICTION',
            category: 'DASHA_DUSTHANA',
            title: `${currentAntar} Sub-Period Karmic Consolidation`,
            titleHi: `${currentAntar} अंतर्दशा का प्रभाव`,
            severity: 'MODERATE',
            explanation: `The ongoing sub-period of ${currentAntar} requires patience and restructuring. Progress during this time is slow but foundational for long-term endurance.`,
            explanationHi: `${currentAntar} की अंतर्दशा में परिणाम धीमी गति से प्राप्त होते हैं, जो भविष्य की दृढ़ नींव तैयार करते हैं।`,
            astrologicalDetail: `Active Antardasha lord is ${currentAntar} under ${currentMaha} Mahadasha.`,
        });
    }
    // If no negative causes were triggered, provide reassurance
    if (causes.length === 0) {
        causes.push({
            code: 'NATURAL_CONSOLIDATION',
            category: 'DASHA_DUSTHANA',
            title: 'Natural Cycle of Effort & Incubation',
            titleHi: 'परिश्रम एवं संचय का स्वाभाविक काल',
            severity: 'MILD',
            explanation: 'Your chart does not show severe afflictions, but current planetary movements require consistent effort without expecting instant shortcuts.',
            explanationHi: 'आपकी कुण्डली में कोई तीव्र दोष नहीं है, परंतु वर्तमान ग्रह स्थिति त्वरित परिणामों के स्थान पर निरंतर प्रयास की अपेक्षा रखती है।',
            astrologicalDetail: 'Standard developmental phase under current dasha and transit matrix.',
        });
    }
    const hasHighSeverity = causes.some((c) => c.severity === 'HIGH');
    const primaryCause = causes[0];
    const statusHeadline = hasHighSeverity
        ? `Karmic Testing & Restructuring Phase (Active ${primaryCause.title})`
        : `Consolidation & Foundation-Building Phase`;
    const statusHeadlineHi = hasHighSeverity
        ? `कर्म मंथन एवं पुनर्गठन का समय (${primaryCause.titleHi})`
        : `स्थिरता एवं आधार निर्माण का काल`;
    const rootExplanation = `The obstacles or feeling of "getting stuck" in the recent 1–2 years are not a permanent failure; they are directly driven by ${causes.map((c) => c.title).join(' and ')}. In Vedic astrology, these cycles act like winter: surface growth freezes so deep roots can grow.`;
    const rootExplanationHi = `विगत 1-2 वर्षों में आ रही बाधाएं अथवा असफलताएं स्थायी नहीं हैं। इनका मुख्य कारण ${causes.map((c) => c.titleHi).join(' एवं ')} है। वैदिक ज्योतिष में यह काल शीत ऋतु के समान है, जहां बाह्य प्रगति धीमी रहकर आंतरिक क्षमता का विकास होता है।`;
    const karmicLesson = `This phase is forcing you to discard shortcuts, build deep emotional resilience, and master your core craft. Rushing decisions or blaming external factors will only prolong friction; embracing structured discipline unlocks the breakthrough.`;
    const karmicLessonHi = `यह समय आपको शॉर्टकट छोड़कर, मानसिक धैर्य विकसित करने और अपने कौशल में निपुण होने का अवसर दे रहा है। अनुशासित प्रयास ही सफलता का मार्ग प्रशस्त करेगा।`;
    const reliefDate = antarEnd;
    const reliefTimelineSummary = `The peak friction begins shifting towards ease after ${antarEnd}, when the current sub-period concludes and the incoming dasha brings renewed momentum.`;
    const reliefTimelineSummaryHi = `${antarEnd} के पश्चात वर्तमान अंतर्दशा की समाप्ति के साथ ग्रह स्थिति में सकारात्मक परिवर्तन आरंभ होगा और नए अवसर प्राप्त होंगे।`;
    const actionProtocol = [
        {
            category: 'MINDSET',
            title: 'Shift from Outcome-Obsession to Process Mastery',
            titleHi: 'परिणाम के स्थान पर कर्म और प्रक्रिया पर ध्यान दें',
            description: 'Accept that this is a building season. Measure daily consistency rather than immediate validation or quick returns.',
            descriptionHi: 'यह नींव मजबूत करने का समय है। तात्कालिक परिणाम की चिंता छोड़कर दैनिक निरंतरता पर ध्यान दें।',
        },
        {
            category: 'ACTION',
            title: 'Avoid High-Risk Gambles or Impulsive Exits',
            titleHi: 'अति-जोखिम अथवा जल्दबाजी में निर्णय न लें',
            description: 'Do not quit jobs, burn bridges, or invest in speculative schemes during turbulent sub-periods. Protect cash reserves and preserve stability.',
            descriptionHi: 'सट्टेबाजी अथवा बिना विचार किए बड़े वित्तीय जोखिम से बचें। वित्तीय संतुलन और धैर्य बनाए रखें।',
        },
        {
            category: 'SATTVIC_PRACTICE',
            title: 'Grounding Routine, Surya Arghya & Seva',
            titleHi: 'नियमित दिनचर्या, सूर्य आराधना एवं सेवा भाव',
            description: 'Wake up early, offer water to the rising Sun, practice 15 minutes of Pranayama, and engage in quiet acts of service on Saturdays/Tuesdays to stabilize planetary energies.',
            descriptionHi: 'प्रातःकाल जल्दी उठें, सूर्य को जल अर्पित करें, 15 मिनट प्राणायाम करें तथा शनिवार/मंगलवार को निस्वार्थ सेवा कार्य करें।',
        },
    ];
    return {
        hasActiveTurbulence: hasHighSeverity || causes.length > 1,
        statusHeadline,
        statusHeadlineHi,
        rootExplanation,
        rootExplanationHi,
        karmicLesson,
        karmicLessonHi,
        activeCauses: causes,
        reliefDate,
        reliefTimelineSummary,
        reliefTimelineSummaryHi,
        actionProtocol,
    };
}
//# sourceMappingURL=failure-diagnostic-engine.js.map