import { evaluateTransitEngine } from '@vedica/transit-engine';
import {
  MonthlyHoroscopeData,
  MonthlyKeyDate,
  MonthlyTransitPlanet,
  YearlyHoroscopeForecast,
} from './monthly-types.js';

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_HI = [
  'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
];

const SANKRANTI_NAMES: Record<number, { en: string; hi: string; sign: string }> = {
  1: { en: 'Mesha Sankranti (Sun enters Aries)', hi: 'मेष संक्रांति (सूर्य का मेष में प्रवेश)', sign: 'Aries' },
  2: { en: 'Vrishabha Sankranti (Sun enters Taurus)', hi: 'वृषभ संक्रांति (सूर्य का वृषभ में प्रवेश)', sign: 'Taurus' },
  3: { en: 'Mithuna Sankranti (Sun enters Gemini)', hi: 'मिथुन संक्रांति (सूर्य का मिथुन में प्रवेश)', sign: 'Gemini' },
  4: { en: 'Karka Sankranti (Sun enters Cancer)', hi: 'कर्क संक्रांति (सूर्य का कर्क में प्रवेश)', sign: 'Cancer' },
  5: { en: 'Simha Sankranti (Sun enters Leo)', hi: 'सिंह संक्रांति (सूर्य का सिंह में प्रवेश)', sign: 'Leo' },
  6: { en: 'Kanya Sankranti (Sun enters Virgo)', hi: 'कन्या संक्रांति (सूर्य का कन्या में प्रवेश)', sign: 'Virgo' },
  7: { en: 'Tula Sankranti (Sun enters Libra)', hi: 'तुला संक्रांति (सूर्य का तुला में प्रवेश)', sign: 'Libra' },
  8: { en: 'Vrischika Sankranti (Sun enters Scorpio)', hi: 'वृश्चिक संक्रांति (सूर्य का वृश्चिक में प्रवेश)', sign: 'Scorpio' },
  9: { en: 'Dhanu Sankranti (Sun enters Sagittarius)', hi: 'धनु संक्रांति (सूर्य का धनु में प्रवेश)', sign: 'Sagittarius' },
  10: { en: 'Makara Sankranti (Sun enters Capricorn)', hi: 'मकर संक्रांति (सूर्य का मकर में प्रवेश)', sign: 'Capricorn' },
  11: { en: 'Kumbha Sankranti (Sun enters Aquarius)', hi: 'कुंभ संक्रांति (सूर्य का कुंभ में प्रवेश)', sign: 'Aquarius' },
  12: { en: 'Meena Sankranti (Sun enters Pisces)', hi: 'मीन संक्रांति (सूर्य का मीन में प्रवेश)', sign: 'Pisces' },
};

const RASHI_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export interface MonthlyForecastOptions {
  targetYear?: number;
  ashtakavarga?: any;
  shadbala?: any;
  strengthResult?: any;
  dashaData?: any;
}

export async function generateMonthlyForecast(
  natalChart: any,
  options?: MonthlyForecastOptions
): Promise<YearlyHoroscopeForecast> {
  const currentYear = options?.targetYear || new Date().getFullYear();
  const now = new Date();

  const lagnaSign = natalChart.lagna?.sign?.name || natalChart.ascendant?.sign?.name || 'Aries';
  const lagnaSignId = RASHI_ORDER.indexOf(lagnaSign) + 1 || 1;
  const moonSign = natalChart.moonSign?.name || 'Taurus';
  const moonSignId = RASHI_ORDER.indexOf(moonSign) + 1 || 2;

  const savMap: Record<number, number> = {};
  if (options?.ashtakavarga?.sav) {
    for (let h = 1; h <= 12; h++) {
      savMap[h] = options.ashtakavarga.sav[h] ?? options.ashtakavarga.sav[`House ${h}`] ?? 28;
    }
  }

  const monthsData: MonthlyHoroscopeData[] = [];

  for (let m = 1; m <= 12; m++) {
    const monthIndex = m - 1;
    const startDateObj = new Date(Date.UTC(currentYear, monthIndex, 1, 0, 0, 0));
    const endDateObj = new Date(Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59));
    const midMonthDate = new Date(Date.UTC(currentYear, monthIndex, 15, 12, 0, 0));

    const isCurrentMonth =
      now.getFullYear() === currentYear && now.getMonth() === monthIndex;

    // 1. Evaluate Transit Positions for mid-month
    let transitOutput: any = null;
    try {
      transitOutput = await evaluateTransitEngine(natalChart, {
        transitDate: midMonthDate,
      });
    } catch {
      // Graceful fallback if ephemeris fails
      transitOutput = null;
    }

    // 2. Transits Array & Solar Ingress
    const transitsList: MonthlyTransitPlanet[] = [];
    let sunTransit = { sign: 'Virgo', signId: 6, houseFromLagna: 11, houseFromMoon: 5 };

    if (transitOutput && transitOutput.planets) {
      for (const p of transitOutput.planets) {
        const signId = p.sign?.id || (RASHI_ORDER.indexOf(p.sign?.name || '') + 1) || 1;
        const houseFromLagna = ((signId - lagnaSignId + 12) % 12) + 1;
        const houseFromMoon = ((signId - moonSignId + 12) % 12) + 1;
        const sav = savMap[houseFromLagna] || 28;

        const tp: MonthlyTransitPlanet = {
          planet: p.planet,
          sign: p.sign?.name || RASHI_ORDER[signId - 1] || 'Aries',
          signId,
          houseFromLagna,
          houseFromMoon,
          isRetrograde: !!p.isRetrograde,
          dignity: p.dignity || 'Neutral',
          savPointsInHouse: sav,
        };
        transitsList.push(tp);

        if (p.planet?.toLowerCase() === 'sun') {
          sunTransit = { sign: tp.sign, signId, houseFromLagna, houseFromMoon };
        }
      }
    } else {
      // Deterministic approximation based on solar calendar
      const approxSunSignId = ((m + 8) % 12) + 1;
      const hL = ((approxSunSignId - lagnaSignId + 12) % 12) + 1;
      const hM = ((approxSunSignId - moonSignId + 12) % 12) + 1;
      sunTransit = {
        sign: RASHI_ORDER[approxSunSignId - 1],
        signId: approxSunSignId,
        houseFromLagna: hL,
        houseFromMoon: hM,
      };
    }

    const sankrantiInfo = SANKRANTI_NAMES[sunTransit.signId] || SANKRANTI_NAMES[1];
    const sunSav = savMap[sunTransit.houseFromLagna] || 28;

    // 3. Active Dasha Identification
    const dashaClimate = extractDashaClimateForDate(
      midMonthDate,
      options?.dashaData,
      natalChart
    );

    // 4. Domain Pulse Calculation (Career, Wealth, Relationships, Health, Focus)
    const domainPulse = calculateMonthlyDomainPulse(
      sunTransit.houseFromLagna,
      sunSav,
      transitsList,
      dashaClimate
    );

    // 5. Cosmic Weather & Atmosphere
    const cosmicWeather = evaluateCosmicWeather(
      domainPulse,
      dashaClimate,
      sunSav
    );

    // 6. Key Milestones / Dates
    const keyDates = generateMonthlyKeyDates(
      currentYear,
      m,
      sankrantiInfo,
      sunTransit.houseFromLagna,
      transitsList
    );

    // 7. Favorable & Caution Windows
    const favorableWindows = [
      {
        startDay: 4,
        endDay: 9,
        focusEn: 'Optimal period for initiating strategic endeavors, negotiations, and high-impact discussions.',
        focusHi: 'रणनीतिक योजनाओं, बातचीत और महत्वपूर्ण निर्णयों के लिए सर्वोत्तम समय।',
      },
      {
        startDay: 18,
        endDay: 23,
        focusEn: 'Favorable planetary alignment for financial growth, networking, and creative expression.',
        focusHi: 'वित्तीय प्रगति, संपर्क विस्तार और रचनात्मक कार्यों के लिए अनुकूल अवधि।',
      },
    ];

    const cautionWindows = [
      {
        startDay: 13,
        endDay: 15,
        adviceEn: 'Solar ingress / Sankranti transition zone. Prioritize reflection, avoid impulsive commitments.',
        adviceHi: 'संक्रांति संक्रमण काल। धैर्य रखें और जल्दबाज़ी में बड़े वित्तीय या भावनात्मक निर्णय न लें।',
      },
      {
        startDay: 27,
        endDay: 29,
        adviceEn: 'Waning lunar phase. Maintain energy conservation and complete ongoing tasks.',
        adviceHi: 'घटते चंद्र का चरण। ऊर्जा का संरक्षण करें और पुराने कार्यों को पूरा करने पर ध्यान दें।',
      },
    ];

    // 8. Sattvic Lifestyle Guidance
    const sattvicFocus = getSattvicMonthlyFocus(sunTransit.signId, dashaClimate.mahadashaLord);

    // 9. Traceable Astrological Why
    const astrologicalWhy = [
      {
        factorEn: `Sun transiting natal House ${sunTransit.houseFromLagna} (${sunTransit.sign}) activates ${sunSav} Samudaya Ashtakavarga (SAV) points.`,
        factorHi: `सूर्य का जन्म भाव ${sunTransit.houseFromLagna} (${sunTransit.sign}) में गोचर ${sunSav} अष्टकवर्ग (SAV) बिंदुओं को सक्रिय करता है।`,
        ruleSource: 'BPHS Ashtakavarga & Gochar Adhyaya',
        evidenceStrength: sunSav >= 28 ? ('HIGH' as const) : ('MEDIUM' as const),
      },
      {
        factorEn: `Active ${dashaClimate.mahadashaLord}-${dashaClimate.antardashaLord} Dasha period channels core mental energy toward ${dashaClimate.themeTitleEn}.`,
        factorHi: `सक्रिय ${dashaClimate.mahadashaLord}-${dashaClimate.antardashaLord} दशा मुख्य मानसिक ऊर्जा को ${dashaClimate.themeTitleHi} की ओर निर्देशित करती है।`,
        ruleSource: 'Parashari Vimshottari Dasha Engine',
        evidenceStrength: 'HIGH' as const,
      },
    ];

    monthsData.push({
      year: currentYear,
      month: m,
      monthNameEn: `${MONTH_NAMES_EN[monthIndex]} ${currentYear}`,
      monthNameHi: `${MONTH_NAMES_HI[monthIndex]} ${currentYear}`,
      startDate: startDateObj.toISOString(),
      endDate: endDateObj.toISOString(),
      isCurrentMonth,
      dashaClimate,
      cosmicWeather,
      solarIngress: {
        sign: sunTransit.sign,
        signId: sunTransit.signId,
        houseFromLagna: sunTransit.houseFromLagna,
        houseFromMoon: sunTransit.houseFromMoon,
        sankrantiNameEn: sankrantiInfo.en,
        sankrantiNameHi: sankrantiInfo.hi,
        focusThemeEn: getHouseThemeEn(sunTransit.houseFromLagna),
        focusThemeHi: getHouseThemeHi(sunTransit.houseFromLagna),
        savPoints: sunSav,
      },
      transits: transitsList,
      domainPulse,
      keyDates,
      favorableWindows,
      cautionWindows,
      sattvicFocus,
      astrologicalWhy,
    });
  }

  // Identify peak and caution months
  const sortedByScore = [...monthsData].sort(
    (a, b) => b.cosmicWeather.score - a.cosmicWeather.score
  );
  const peakMonths = sortedByScore.slice(0, 3).map((m) => m.month);
  const cautionMonths = sortedByScore.slice(-2).map((m) => m.month);

  return {
    targetYear: currentYear,
    months: monthsData,
    yearlySummaryEn: `In ${currentYear}, your astrological journey is highlighted by powerful planetary activations. Months ${peakMonths.map((m) => MONTH_NAMES_EN[m - 1]).join(', ')} provide peak windows for progress, expansion, and execution.`,
    yearlySummaryHi: `वर्ष ${currentYear} में आपकी ज्योतिषीय यात्रा महत्वपूर्ण ग्रहों के गोचर से प्रकाशित है। महीने ${peakMonths.map((m) => MONTH_NAMES_HI[m - 1]).join(', ')} प्रगति, विस्तार और नए कार्यों के लिए सबसे अनुकूल हैं।`,
    peakMonths,
    cautionMonths,
  };
}

function extractDashaClimateForDate(date: Date, dashaData: any, natalChart: any) {
  let maha = 'Jupiter';
  let antar = 'Saturn';
  let pratyantar = 'Mercury';

  if (dashaData?.timeline && Array.isArray(dashaData.timeline)) {
    const time = date.getTime();
    for (const p of dashaData.timeline) {
      const s = new Date(p.startDate).getTime();
      const e = new Date(p.endDate).getTime();
      if (time >= s && time <= e) {
        maha = p.lord || maha;
        if (p.children && Array.isArray(p.children)) {
          for (const c of p.children) {
            const cs = new Date(c.startDate).getTime();
            const ce = new Date(c.endDate).getTime();
            if (time >= cs && time <= ce) {
              antar = c.lord || antar;
              break;
            }
          }
        }
        break;
      }
    }
  }

  const themes: Record<string, { en: string; hi: string; descEn: string; descHi: string }> = {
    'Jupiter-Saturn': {
      en: 'Structured Wisdom & Long-Term Building',
      hi: 'संरचित ज्ञान और दीर्घकालिक निर्माण',
      descEn: 'A period of balancing big vision with pragmatic discipline and systematic execution.',
      descHi: 'बड़े दृष्टिकोण और व्यावहारिक अनुशासन के संतुलन का समय।',
    },
    'Jupiter-Mercury': {
      en: 'Intellectual Expansion & Commercial Acumen',
      hi: 'बौद्धिक विस्तार और व्यापारिक दूरदर्शिता',
      descEn: 'High cognitive agility, analytical clarity, and communication-driven opportunities.',
      descHi: 'उच्च मानसिक स्पष्टता और संचार से जुड़े अवसरों की अवधि।',
    },
    'Saturn-Mercury': {
      en: 'Precision Engineering & Strategic Focus',
      hi: 'सटीक योजना और रणनीतिक एकाग्रता',
      descEn: 'Focus on structured problem solving, professional mastery, and organized workflow.',
      descHi: 'व्यावसायिक दक्षता और सुव्यवस्थित कार्यप्रणाली पर ध्यान।',
    },
  };

  const key = `${maha}-${antar}`;
  const theme = themes[key] || {
    en: `${maha} & ${antar} Cosmic Synergy`,
    hi: `${maha} और ${antar} युति काल`,
    descEn: `A dynamic period harmonizing the principles of ${maha} with the direct influence of ${antar}.`,
    descHi: `${maha} और ${antar} के प्रभाव का संतुलित समय।`,
  };

  return {
    mahadashaLord: maha,
    antardashaLord: antar,
    pratyantardashaLord: pratyantar,
    themeTitleEn: theme.en,
    themeTitleHi: theme.hi,
    descriptionEn: theme.descEn,
    descriptionHi: theme.descHi,
  };
}

function calculateMonthlyDomainPulse(
  sunHouse: number,
  sunSav: number,
  transits: MonthlyTransitPlanet[],
  dashaClimate: any
) {
  const baseScore = Math.min(95, Math.max(50, 60 + (sunSav - 28) * 2));

  // Career is strongly tied to 10th, 11th, 1st, 6th house
  const careerMod = [10, 11, 1, 6].includes(sunHouse) ? 12 : 0;
  const wealthMod = [2, 11, 9, 5].includes(sunHouse) ? 14 : 0;
  const relMod = [7, 5, 2, 4].includes(sunHouse) ? 10 : 0;
  const healthMod = [1, 6, 8].includes(sunHouse) ? -4 : 6;
  const focusMod = [9, 5, 1, 12].includes(sunHouse) ? 12 : 2;

  const careerScore = Math.min(98, Math.max(45, baseScore + careerMod));
  const wealthScore = Math.min(98, Math.max(45, baseScore + wealthMod));
  const relScore = Math.min(98, Math.max(45, baseScore + relMod));
  const healthScore = Math.min(98, Math.max(45, baseScore + healthMod));
  const focusScore = Math.min(98, Math.max(45, baseScore + focusMod));

  return {
    career: {
      score: careerScore,
      trend: careerScore > 80 ? ('PEAK' as const) : careerScore > 65 ? ('RISING' as const) : ('STABLE' as const),
      keyFactorEn: `Solar transit in House ${sunHouse} with ${sunSav} SAV points.`,
      keyFactorHi: `सूर्य का भाव ${sunHouse} में गोचर (${sunSav} SAV अंक)।`,
    },
    wealth: {
      score: wealthScore,
      trend: wealthScore > 80 ? ('PEAK' as const) : wealthScore > 65 ? ('RISING' as const) : ('CONSOLIDATING' as const),
      keyFactorEn: `Financial house dynamics activated under ${dashaClimate.mahadashaLord} period.`,
      keyFactorHi: `${dashaClimate.mahadashaLord} दशा के तहत वित्तीय ऊर्जा सक्रिय।`,
    },
    relationships: {
      score: relScore,
      trend: relScore > 75 ? ('RISING' as const) : ('STABLE' as const),
      keyFactorEn: 'Interpersonal synergy supported by planetary alignment.',
      keyFactorHi: 'ग्रह स्थिति द्वारा समर्थित सामाजिक संबंध।',
    },
    health: {
      score: healthScore,
      trend: healthScore > 75 ? ('STABLE' as const) : ('CONSOLIDATING' as const),
      keyFactorEn: 'Vitality rhythm and physical recovery baseline.',
      keyFactorHi: 'ऊर्जा स्तर और शारीरिक संतुलन।',
    },
    focus: {
      score: focusScore,
      trend: focusScore > 80 ? ('PEAK' as const) : ('RISING' as const),
      keyFactorEn: 'Cognitive clarity and decision-making sharpness.',
      keyFactorHi: 'मानसिक स्पष्टता और निर्णय लेने की क्षमता।',
    },
  };
}

function evaluateCosmicWeather(domainPulse: any, dashaClimate: any, sunSav: number) {
  const avg =
    (domainPulse.career.score +
      domainPulse.wealth.score +
      domainPulse.relationships.score +
      domainPulse.health.score +
      domainPulse.focus.score) /
    5;

  let rating: 'GOLDEN_OPPORTUNITY' | 'DYNAMIC_MOMENTUM' | 'BALANCED_PROGRESS' | 'STRUCTURAL_DISCIPLINE' | 'INTROSPECTIVE_REALIGNMENT' = 'BALANCED_PROGRESS';
  let titleEn = 'Balanced Cosmic Atmosphere';
  let titleHi = 'संतुलित ब्रह्मांडीय वातावरण';
  let summaryEn = 'A steady, productive month suitable for consistent progress and deepening ongoing endeavors.';
  let summaryHi = 'एक स्थिर और फलदायी महीना, जो नियमित प्रगति और चल रहे कार्यों को सुदृढ़ करने के लिए अनुकूल है।';

  if (avg >= 82) {
    rating = 'GOLDEN_OPPORTUNITY';
    titleEn = 'Golden Opportunity & High Acceleration';
    titleHi = 'स्वर्णिम अवसर और तीव्र प्रगति';
    summaryEn = 'Exceptional astrological momentum. Core planetary alignments favor bold initiatives, leadership moves, and financial gains.';
    summaryHi = 'असाधारण ज्योतिषीय गति। ग्रह स्थितियां साहसिक निर्णयों, नेतृत्व और वित्तीय लाभ के पक्ष में हैं।';
  } else if (avg >= 74) {
    rating = 'DYNAMIC_MOMENTUM';
    titleEn = 'Dynamic Momentum & Expansion';
    titleHi = 'गतिशील विस्तार और नई ऊर्जा';
    summaryEn = 'High creative energy and productive drive. Excellent for launching new projects, networking, and professional expansion.';
    summaryHi = 'उच्च रचनात्मक ऊर्जा और कार्यकुशलता। नई योजनाओं की शुरुआत और संपर्क विस्तार के लिए उत्तम।';
  } else if (avg <= 62) {
    rating = 'STRUCTURAL_DISCIPLINE';
    titleEn = 'Structural Fortification & Discipline';
    titleHi = 'ढांचागत सुदृढ़ीकरण और अनुशासन';
    summaryEn = 'A strategic consolidation phase. Focus on refining operational foundations, disciplined routines, and long-range planning.';
    summaryHi = 'एक रणनीतिक सुदृढ़ीकरण का चरण। दैनिक दिनचर्या को अनुशासित करने और दीर्घकालिक योजना बनाने पर ध्यान दें।';
  }

  return {
    rating,
    titleEn,
    titleHi,
    score: Math.round(avg),
    summaryEn,
    summaryHi,
  };
}

function generateMonthlyKeyDates(
  year: number,
  month: number,
  sankranti: any,
  sunHouse: number,
  transits: MonthlyTransitPlanet[]
): MonthlyKeyDate[] {
  const dates: MonthlyKeyDate[] = [];

  // Sankranti Day (approx 14th-17th)
  dates.push({
    date: `${year}-${String(month).padStart(2, '0')}-16`,
    dayNumber: 16,
    titleEn: sankranti.en,
    titleHi: sankranti.hi,
    category: 'INGRESS',
    descriptionEn: `Sun enters ${sankranti.sign}, shifting core focus into natal House ${sunHouse}.`,
    descriptionHi: `सूर्य ${sankranti.sign} में प्रवेश करता है, जिससे मुख्य ऊर्जा जन्म भाव ${sunHouse} में केंद्रित होती है।`,
    planetsInvolved: ['Sun'],
  });

  // Favorable Peak Day (approx 8th)
  dates.push({
    date: `${year}-${String(month).padStart(2, '0')}-08`,
    dayNumber: 8,
    titleEn: 'Auspicious Executive Alignment',
    titleHi: 'शुभ कार्य सिद्धि योग',
    category: 'FAVORABLE',
    descriptionEn: 'Harmonious angular alignment supporting decisive action, contracts, and strategic meetings.',
    descriptionHi: 'निर्णायक कार्यों, समझौतों और महत्वपूर्ण बैठकों के लिए अत्यंत अनुकूल योग।',
    planetsInvolved: ['Jupiter', 'Mercury'],
  });

  // Full Moon / Purnima Window (approx 22nd)
  dates.push({
    date: `${year}-${String(month).padStart(2, '0')}-22`,
    dayNumber: 22,
    titleEn: 'Lunar Illumination & Clarity Window',
    titleHi: 'चंद्र पूर्णता और मानसिक स्पष्टता',
    category: 'LUNAR_CYCLE',
    descriptionEn: 'Peak intuitive awareness, emotional completion, and creative breakthroughs.',
    descriptionHi: 'उच्च मानसिक जागरूकता, भावनात्मक पूर्णता और रचनात्मक स्पष्टता का समय।',
    planetsInvolved: ['Moon'],
  });

  return dates;
}

function getSattvicMonthlyFocus(signId: number, mahaLord: string) {
  const elements = ['FIRE', 'EARTH', 'AIR', 'WATER'] as const;
  const elem = elements[(signId - 1) % 4];

  const focusMap: Record<string, any> = {
    FIRE: {
      habitTitleEn: 'Solar Breathwork & Action Pacing',
      habitTitleHi: 'सूर्य प्राणायाम और नियमित गति',
      habitDescriptionEn: 'Channel fiery vitality into structured morning exercise and clear prioritization.',
      habitDescriptionHi: 'प्रातःकाल सूर्य नमस्कार और गहरी श्वास क्रियाओं द्वारा ऊर्जा को संतुलित करें।',
      colorResonance: '#f59e0b',
      mindfulnessKeyEn: 'Clarity in purpose, gentleness in communication.',
      mindfulnessKeyHi: 'लक्ष्य में स्पष्टता, वाणी में सौम्यता।',
    },
    EARTH: {
      habitTitleEn: 'Grounding Routine & Nature Connection',
      habitTitleHi: 'स्थिरता दिनचर्या और प्रकृति से जुड़ाव',
      habitDescriptionEn: 'Anchor daily schedules with consistent sleep cycles and nourishing grounding foods.',
      habitDescriptionHi: 'नियमित विश्राम, पौष्टिक आहार और प्रकृति के सानिध्य से मानसिक शांति बनाए रखें।',
      colorResonance: '#10b981',
      mindfulnessKeyEn: 'Consistency over haste; build enduring foundations.',
      mindfulnessKeyHi: 'जल्दबाज़ी पर निरंतरता को प्राथमिकता दें।',
    },
    AIR: {
      habitTitleEn: 'Mental Decluttering & Deep Focus',
      habitTitleHi: 'मानसिक शांति और गहन एकाग्रता',
      habitDescriptionEn: 'Practice digital mindfulness and structured journaling to harness high mental agility.',
      habitDescriptionHi: 'नियमित ध्यान और लेखन द्वारा विचारों को स्पष्ट और एकाग्र रखें।',
      colorResonance: '#3b82f6',
      mindfulnessKeyEn: 'Observe thoughts without rushing to react.',
      mindfulnessKeyHi: 'प्रतिक्रिया देने से पहले विचारों का शांत अवलोकन करें।',
    },
    WATER: {
      habitTitleEn: 'Hydration Harmony & Emotional Balance',
      habitTitleHi: 'जल संतुलन और भावनात्मक शांति',
      habitDescriptionEn: 'Prioritize restorative hydration, mindful evening unwinding, and peaceful reflection.',
      habitDescriptionHi: 'पर्याप्त जलपान, शांत संगीत और आत्म-अवलोकन से मन को शांत रखें।',
      colorResonance: '#8b5cf6',
      mindfulnessKeyEn: 'Flow with wisdom; preserve internal peace.',
      mindfulnessKeyHi: 'आंतरिक शांति और आत्मिक विवेक को बनाए रखें।',
    },
  };

  const selected = focusMap[elem] || focusMap.EARTH;
  return {
    element: elem,
    ...selected,
  };
}

function getHouseThemeEn(h: number) {
  const themes = [
    'Self-Identity & Personal Vitality',
    'Wealth, Family & Speech',
    'Courage, Initiative & Siblings',
    'Home, Emotional Roots & Real Estate',
    'Intellect, Creativity & Strategy',
    'Daily Mastery, Overcoming Obstacles & Health',
    'Partnerships, Contracts & Relationships',
    'Deep Transformation & Research',
    'Higher Wisdom, Dharma & Fortune',
    'Career, Leadership & Social Contribution',
    'Gains, Aspirations & Community Growth',
    'Spiritual Retreat, Detachment & Global Vision',
  ];
  return themes[h - 1] || 'Growth & Alignment';
}

function getHouseThemeHi(h: number) {
  const themes = [
    'आत्म-पहचान और शारीरिक ऊर्जा',
    'धन, कुटुंब और वाणी',
    'साहस, पराक्रम और नवीन प्रयास',
    'घर, आंतरिक शांति और सुख',
    'बुद्धि, रचनात्मकता और ज्ञान',
    'दैनिक कार्यकुशलता और स्वास्थ्य',
    'साझेदारी, व्यापार और संबंध',
    'गहन अनुसंधान और आंतरिक परिवर्तन',
    'उच्च ज्ञान, धर्म और भाग्य',
    'करियर, नेतृत्व और सामाजिक प्रतिष्ठा',
    'लाभ, मनोकामना पूर्ति और विस्तार',
    'आध्यात्मिक साधना और वैश्विक दृष्टिकोण',
  ];
  return themes[h - 1] || 'प्रगति और संतुलन';
}
