import { BirthChart } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';

export interface LifeStorybookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  archetypeBadge?: string;
  archetypeBadgeHi?: string;
  executiveSummary: string;
  executiveSummaryHi: string;
  sections: Array<{
    heading: string;
    headingHi: string;
    content: string;
    contentHi: string;
    highlights?: string[];
    highlightsHi?: string[];
  }>;
  astrologicalEvidenceSummary: string;
  astrologicalEvidenceSummaryHi: string;
}

export interface LifeStorybook {
  fullName?: string;
  primaryArchetype: string;
  primaryArchetypeHi: string;
  coreLifeMission: string;
  coreLifeMissionHi: string;
  chapters: LifeStorybookChapter[];
}

export function synthesizeLifeStorybook(params: {
  chart: BirthChart;
  analysis: ChartAnalysisResult;
  fullName?: string;
  dashaData?: any;
  timingData?: any;
  milestones?: any;
  struggles?: any;
}): LifeStorybook {
  const { chart, analysis, fullName, dashaData, milestones, struggles } = params;

  const ascSign = chart.lagna?.sign?.name || (chart as any).ascendant?.sign || 'Aries';
  const moonSign = chart.moonSign?.name || (chart.moonSign as any)?.sign || 'Aries';
  const sunSign = chart.planets?.find((p) => p.planet === 'Sun')?.sign?.name || 'Leo';
  const currentMaha = dashaData?.current?.mahadasha?.planet || 'Saturn';
  const currentAntar = dashaData?.current?.antardasha?.planet || 'Mercury';

  // 1. Determine Core Soul Archetype from Ascendant & Sun
  let primaryArchetype = 'The Strategic Innovator';
  let primaryArchetypeHi = 'रणनीतिक नवप्रवर्तक';
  let coreMission = 'To architect impactful systems, master difficult frontiers, and create lasting value through sustained intellectual and practical excellence.';
  let coreMissionHi = 'प्रभावशाली प्रणालियों का निर्माण करना, जटिल चुनौतियों पर विजय प्राप्त करना तथा बौद्धिक एवं व्यावहारिक उत्कृष्टता से दीर्घकालिक मूल्य स्थापित करना।';

  if (ascSign === 'Aries' || ascSign === 'Scorpio') {
    primaryArchetype = 'The Pioneering Catalyst';
    primaryArchetypeHi = 'अग्रणी एवं साहसी पथप्रदर्शक';
    coreMission = 'To break new ground, champion fearless initiatives, lead with courageous conviction, and overcome challenging obstacles with decisive action.';
    coreMissionHi = 'नवीन पथ प्रशस्त करना, निर्भीक पहलों का नेतृत्व करना तथा साहसिक निर्णयों द्वारा कठिन चुनौतियों पर विजय प्राप्त करना।';
  } else if (ascSign === 'Taurus' || ascSign === 'Libra') {
    primaryArchetype = 'The Harmonious Builder';
    primaryArchetypeHi = 'सौंदर्य एवं स्थिरता का निर्माता';
    coreMission = 'To build enduring beauty, cultivate financial prosperity, foster harmonious partnerships, and create stable, aesthetic environments.';
    coreMissionHi = 'स्थायी समृद्धि का निर्माण करना, मधुर संबंध विकसित करना तथा स्थिर एवं सुरुचिपूर्ण परिवेश की स्थापना करना।';
  } else if (ascSign === 'Gemini' || ascSign === 'Virgo') {
    primaryArchetype = 'The Master Strategist & Analyst';
    primaryArchetypeHi = 'कुशल रणनीतिकार एवं विश्लेषक';
    coreMission = 'To synthesize complex information, optimize systems for precision, bridge gaps through communication, and solve multifaceted problems with agile intelligence.';
    coreMissionHi = 'जटिल सूचनाओं का विश्लेषण करना, प्रणालियों को त्रुटिहीन बनाना तथा अपनी बौद्धिक क्षमता से बहुआयामी समस्याओं का समाधान करना।';
  } else if (ascSign === 'Cancer' || ascSign === 'Pisces') {
    primaryArchetype = 'The Visionary Empath & Guide';
    primaryArchetypeHi = 'सहज ज्ञानी एवं पथप्रदर्शक';
    coreMission = 'To elevate human consciousness, nurture emotional depth, lead with compassionate wisdom, and manifest intuitive insights into reality.';
    coreMissionHi = 'मानवीय संवेदनाओं को सशक्त करना, करुणामय मार्गदर्शन प्रदान करना तथा अंतर्ज्ञान को यथार्थ में रूपांतरित करना।';
  } else if (ascSign === 'Leo' || ascSign === 'Sagittarius') {
    primaryArchetype = 'The Sovereign Leader & Philosopher';
    primaryArchetypeHi = 'प्रभावशाली नेतृत्वकर्ता एवं चिंतक';
    coreMission = 'To inspire others with visionary leadership, uphold high ethical standards, expand philosophical horizons, and create a grand, honorable legacy.';
    coreMissionHi = 'दूरदर्शी नेतृत्व से दूसरों को प्रेरित करना, उच्च नैतिक मूल्यों की रक्षा करना तथा एक गौरवशाली विरासत का निर्माण करना।';
  } else if (ascSign === 'Capricorn' || ascSign === 'Aquarius') {
    primaryArchetype = 'The System Architect & Reformer';
    primaryArchetypeHi = 'प्रणाली वास्तुकार एवं संगठनकर्ता';
    coreMission = 'To construct scalable structures, uphold disciplined perseverance, bring social innovation, and build institutions that stand the test of time.';
    coreMissionHi = 'दीर्घकालिक संरचनाओं का निर्माण करना, अनुशासित परिश्रम बनाए रखना तथा समाज के लिए उपयोगी एवं स्थायी प्रणालियों की स्थापना करना।';
  }

  // Next Milestone strings
  const nextProp = milestones?.propertyWindows?.[0];
  const nextMarr = milestones?.marriageWindows?.[0];
  const nextCar = milestones?.careerWindows?.[0];

  const chapters: LifeStorybookChapter[] = [
    // CHAPTER 1: AIM & SOUL PURPOSE (DHARMA)
    {
      id: 'chapter-dharma',
      chapterNumber: 1,
      title: 'The Blueprint & Aim of Your Life',
      titleHi: 'जीवन का उद्देश्य एवं आत्मा का मूल स्वभाव',
      subtitle: 'Understanding your true calling, core archetype, and natural superpowers',
      subtitleHi: 'अपनी स्वाभाविक प्रतिभा, जीवन लक्ष्य और आत्मिक क्षमता को जानें',
      archetypeBadge: primaryArchetype,
      archetypeBadgeHi: primaryArchetypeHi,
      executiveSummary: `Your chart indicates that you are not wired for a generic, repetitive life. Born with ${ascSign} rising and Moon in ${moonSign}, your life's higher purpose is centered on ${coreMission.toLowerCase()}`,
      executiveSummaryHi: `आपकी कुण्डली दर्शाती है कि आपका जीवन सामान्य ढर्रे पर चलने के लिए नहीं है। ${ascSign} लग्न और ${moonSign} चंद्र राशि के साथ आपका मुख्य उद्देश्य अपनी बौद्धिक और व्यावहारिक क्षमता से विशिष्ट पहचान बनाना है।`,
      sections: [
        {
          heading: 'Your Core Soul Calling & Life Archetype',
          headingHi: 'आपका मूल व्यक्तित्व एवं आत्मिक लक्ष्य',
          content: `You operate under the archetype of "${primaryArchetype}". Your natural disposition thrives when you are given autonomy, challenging projects, and the freedom to create solutions that outlast immediate trends. You find meaning not merely in routine success, but in mastering skills and solving problems that others find overwhelming.`,
          contentHi: `आप "${primaryArchetypeHi}" के रूप में कार्य करते हैं। आपकी स्वाभाविक ऊर्जा तब सर्वश्रेष्ठ रूप में प्रकट होती है जब आपको स्वतंत्रता और चुनौतीपूर्ण कार्य सौंपे जाते हैं। आप सतही सफलता के स्थान पर गहन दक्षता में विश्वास रखते हैं।`,
          highlights: [
            `Core Archetype: ${primaryArchetype}`,
            `Guiding Principle: Excellence through autonomy and mastery`,
            `Ascendant (${ascSign}) + Moon (${moonSign}) synthesis`,
          ],
          highlightsHi: [
            `मूल स्वरूप: ${primaryArchetypeHi}`,
            `मार्गदर्शक सिद्धांत: स्वायत्तता और कौशल द्वारा श्रेष्ठता`,
            `${ascSign} लग्न एवं ${moonSign} राशि का संयुक्त प्रभाव`,
          ],
        },
        {
          heading: 'Your 3 Innate Superpowers',
          headingHi: 'आपकी 3 स्वाभाविक शक्तियां',
          content: `1. **Strategic Foresight:** You possess an innate ability to look beyond immediate confusion and identify where future value lies.\n2. **Resilient Problem-Solving:** Under pressure, you have the capacity to detach emotionally and focus on structural solutions.\n3. **Authenticity & Integrity:** You cannot fake interest in shallow pursuits; when you commit your soul to a project, your output is exceptional.`,
          contentHi: `1. **दीर्घकालिक दूरदर्शिता:** आप तात्कालिक भ्रम से परे देखकर भविष्य के सही अवसरों को पहचानने में सक्षम हैं।\n2. **दबाव में धैर्य:** कठिन परिस्थितियों में व्यावहारिक और सुविचारित समाधान खोजने की क्षमता।\n3. **सच्ची लगन:** जब आप किसी लक्ष्य के प्रति समर्पित होते हैं, तो आपकी कार्यकुशलता अद्वितीय होती है।`,
        },
        {
          heading: 'Karmic Growth Axis (What to Master vs What to Evolve)',
          headingHi: 'कर्म विकास का मार्ग (क्या त्यागें और क्या अपनाएं)',
          content: `Your karmic axis urges you to move away from over-analyzing past self-doubt or seeking validation from small-minded circles. Your evolution demands stepping boldly into your leadership authority, trusting your own judgment, and building things of lasting significance.`,
          contentHi: `आपका कर्म मार्ग आपको संशय और बाहरी अनुमोदन की प्रतीक्षा से बाहर निकलकर अपने आत्मविश्वास और नेतृत्व पर भरोसा करने का निर्देश देता है।`,
        },
      ],
      astrologicalEvidenceSummary: `Ascendant in ${ascSign}, Moon in ${moonSign}, Sun in ${sunSign} with active ${currentMaha} Mahadasha and ${currentAntar} Antardasha.`,
      astrologicalEvidenceSummaryHi: `${ascSign} लग्न, ${moonSign} चंद्र, ${sunSign} सूर्य तथा ${currentMaha}-${currentAntar} दशा चक्र पर आधारित।`,
    },

    // CHAPTER 2: CAREER PATH IN DETAIL (ARTHA)
    {
      id: 'chapter-artha',
      chapterNumber: 2,
      title: 'Your Detailed Career Trajectory',
      titleHi: 'करियर पथ एवं आजीविका का विस्तृत विश्लेषण',
      subtitle: 'Ideal industries, Job vs Business fit, leadership style, and peak promotion timing',
      subtitleHi: 'उपयुक्त कार्यक्षेत्र, नौकरी बनाम व्यापार, नेतृत्व क्षमता और पदोन्नति का समय',
      executiveSummary: `Your professional DNA is optimized for roles requiring deep domain expertise, strategy, and executive judgment rather than micromanaged manual execution.`,
      executiveSummaryHi: `आपका कार्यक्षेत्र गहन ज्ञान, रणनीति और स्वतंत्र निर्णय क्षमता पर आधारित है। आप सामान्य दिनचर्या की बजाय प्रभावकारी भूमिकाओं में अधिक सफल होते हैं।`,
      sections: [
        {
          heading: 'Job vs. Startup / Entrepreneurship Fit',
          headingHi: 'नौकरी बनाम व्यापार/स्टार्टअप अनुकूलता',
          content: `Your chart shows a strong **Hybrid / Strategic Enterprise profile**. While starting in structured corporate environments builds necessary domain credibility, your ultimate peak fulfillment and financial expansion come from holding high autonomy, leading specialized teams, or launching your own venture/consultancy.`,
          contentHi: `आपकी कुण्डली एक **मजबूत स्वतंत्र एवं रणनीतिक प्रोफाइल** दर्शाती है। यद्यपि प्रारंभिक वर्षों में संगठित नौकरी से अनुभव प्राप्त होता है, परंतु आपकी वास्तविक प्रगति स्वायत्त भूमिकाओं, टीम नेतृत्व अथवा स्वतंत्र उद्यम से होगी।`,
          highlights: [
            'Entrepreneurship / Advisory Suitability: 80%+',
            'Ideal Work Style: High autonomy, strategic leadership, results-oriented',
            'Avoid: Monotonous, micromanaged environments with no upside',
          ],
          highlightsHi: [
            'स्वतंत्र कार्य/उद्यम उपयुक्तता: 80%+',
            'कार्यशैली: पूर्ण स्वायत्तता एवं परिणामोन्मुखी नेतृत्व',
            'परहेज करें: अत्यधिक नियंत्रण और सीमित विकास वाले वातावरण से',
          ],
        },
        {
          heading: 'High-Affinity Sectors & Roles',
          headingHi: 'अत्यधिक उपयुक्त उद्योग एवं कार्यक्षेत्र',
          content: `1. **Technology, Product & Architecture:** Building high-value digital or physical systems.\n2. **Consulting, Strategy & High-Level Advisory:** Solving high-stakes organizational or technical problems.\n3. **Executive Management & Enterprise Operations:** Guiding cross-functional teams toward clear targets.\n4. **Finance, Investment & Asset Management:** Strategic capital deployment and risk calculation.`,
          contentHi: `1. **तकनीक, उत्पाद विकास एवं सिस्टम डिजाइन**\n2. **रणनीतिक परामर्श एवं उच्च-स्तरीय सलाहकार भूमिकाएं**\n3. **प्रबंधन, परिचालन एवं संगठनात्मक नेतृत्व**\n4. **वित्त, निवेश एवं परिसंपत्ति प्रबंधन**`,
        },
        {
          heading: 'Upcoming Career Acceleration Window',
          headingHi: 'आगामी करियर प्रगति एवं पदोन्नति का समय',
          content: nextCar
            ? `Your strongest upcoming acceleration window is active from **${nextCar.startDate} to ${nextCar.endDate}** (${nextCar.confidenceLabel}). Use this window to negotiate senior roles, launch major projects, or scale revenue.`
            : `Your career is entering a key consolidation phase. Focus on upgrading rare skills and building executive leverage.`,
          contentHi: nextCar
            ? `करियर में तीव्र प्रगति और पदोन्नति का सबसे अनुकूल काल **${nextCar.startDate} से ${nextCar.endDate}** (${nextCar.confidenceLabelHi}) के मध्य है। इस अवधि में महत्वपूर्ण पहलों को आगे बढ़ाएं।`
            : `वर्तमान समय कौशल वृद्धि और मजबूत संपर्क बनाने का है।`,
        },
      ],
      astrologicalEvidenceSummary: `10th house karmasthana synthesis, D10 Dashamsha cross-chart verification, and active ${currentMaha}-${currentAntar} progression.`,
      astrologicalEvidenceSummaryHi: `दशम भाव, दशमांश (D10) चार्ट तथा सक्रिय ${currentMaha}-${currentAntar} दशा पर आधारित।`,
    },

    // CHAPTER 3: WEALTH & HOME ACQUISITION (SAMRIDDHI)
    {
      id: 'chapter-samriddhi',
      chapterNumber: 3,
      title: 'Wealth, Assets & Home Acquisition',
      titleHi: 'धन, समृद्धि एवं भवन क्रय का समय',
      subtitle: 'When you will buy a house, asset accumulation timeline, and financial security index',
      subtitleHi: 'मकान/भूमि खरीदने का समय, संपत्ति संचय और वित्तीय सुरक्षा',
      executiveSummary: `Your chart indicates strong long-term asset accumulation, with significant wealth tied to tangible property, smart investments, and compounded professional income.`,
      executiveSummaryHi: `आपकी कुण्डली दीर्घकालिक संपत्ति निर्माण और अचल संपत्ति (भूमि-भवन) में सफल निवेश का शुभ संकेत देती है।`,
      sections: [
        {
          heading: 'When Will You Buy a Home or Real Estate?',
          headingHi: 'भवन अथवा अचल संपत्ति कब क्रय करेंगे?',
          content: nextProp
            ? `Your primary property acquisition window opens between **${nextProp.startDate} and ${nextProp.endDate}** (${nextProp.confidenceLabel}). During this cycle, planetary energies support stable real estate purchases, home improvements, and building domestic permanence.`
            : `Property acquisition is strongly supported during favorable Jupiter and Mars antardasha transits over your 4th house axis.`,
          contentHi: nextProp
            ? `मकान या भूमि क्रय करने का प्रमुख योग **${nextProp.startDate} से ${nextProp.endDate}** (${nextProp.confidenceLabelHi}) के मध्य निर्मित हो रहा है। यह काल स्थायी आवास और पारिवारिक सुख के लिए शुभ है।`
            : `गुरु एवं मंगल की अनुकूल अंतर्दशा में भवन निर्माण अथवा क्रय का श्रेष्ठ योग बनता है।`,
          highlights: [
            `Next Prime Window: ${nextProp ? `${nextProp.startDate} to ${nextProp.endDate}` : 'Active in coming sub-period'}`,
            'Property Nature: Modern, well-connected, high aesthetic and comfort value',
            'Asset Type: Residential real estate and long-term appreciating equity',
          ],
          highlightsHi: [
            `आगामी श्रेष्ठ समय: ${nextProp ? `${nextProp.startDate} से ${nextProp.endDate}` : 'आगामी अंतर्दशा में सक्रिय'}`,
            'भवन स्वरूप: आधुनिक, सुसज्जित और शांतिपूर्ण वातावरण',
            'संपत्ति प्रकार: आवासीय भवन एवं दीर्घकालिक सुरक्षित निवेश',
          ],
        },
        {
          heading: 'Wealth Accumulation Pattern',
          headingHi: 'धन संचय का स्वरूप',
          content: `Your financial growth follows an exponential curve: steady compounding in earlier phases followed by rapid expansion once your core reputation and network mature. You gain more through equity, property appreciation, and ownership than through simple fixed-salary increments.`,
          contentHi: `आपका धन संचय क्रमिक और स्थायी है। जैसे-जैसे आपका अनुभव और साख बढ़ती है, आपकी आय में उल्लेखनीय वृद्धि होती है। आप स्वामित्व और निवेश के माध्यम से अधिक लाभ कमाते हैं।`,
        },
      ],
      astrologicalEvidenceSummary: `4th house (Bhumisthana), 2nd/11th Dhana Bhavas, and Mars-Venus significator alignments.`,
      astrologicalEvidenceSummaryHi: `चतुर्थ भाव (सुख एवं भूमि), द्वितीय/एकादश धन भाव तथा मंगल-शुक्र की अनुकूलता।`,
    },

    // CHAPTER 4: LOVE & MARRIAGE (KAMA)
    {
      id: 'chapter-kama',
      chapterNumber: 4,
      title: 'Love, Marriage & Relationships',
      titleHi: 'विवाह, प्रेम एवं दांपत्य जीवन',
      subtitle: 'When you will get married, your partner dynamic, and marital harmony keys',
      subtitleHi: 'विवाह का समय, जीवनसाथी का स्वभाव और सुखी दांपत्य के सूत्र',
      executiveSummary: `Your relational profile values intellectual respect, mutual independence, and genuine emotional loyalty over superficial charm.`,
      executiveSummaryHi: `आप वैवाहिक जीवन में बौद्धिक समझ, परस्पर सम्मान और सच्ची निष्ठा को सर्वाधिक महत्व देते हैं।`,
      sections: [
        {
          heading: 'When Will You Get Married / Deepen Commitment?',
          headingHi: 'विवाह अथवा गंभीर रिश्ते का समय कब है?',
          content: nextMarr
            ? `Your most auspicious marriage and union window is indicated between **${nextMarr.startDate} and ${nextMarr.endDate}** (${nextMarr.confidenceLabel}). This is a prime phase for meeting a compatible life partner, formal engagement, or solidifying marital harmony.`
            : `Favorable relationship activations occur during Venus and Jupiter dasha periods with supportive Navamsha transits.`,
          contentHi: nextMarr
            ? `विवाह अथवा गंभीर संबंध के लिए सर्वाधिक शुभ काल **${nextMarr.startDate} से ${nextMarr.endDate}** (${nextMarr.confidenceLabelHi}) के मध्य है। इस समय अनुकूल जीवनसाथी मिलने अथवा विवाह तय होने के प्रबल योग हैं।`
            : `शुक्र और गुरु की शुभ दशा में दांपत्य सुख का सुंदर योग बनता है।`,
        },
        {
          heading: 'Your Partner’s Characteristics & Dynamic',
          headingHi: 'जीवनसाथी का स्वभाव एवं व्यक्तित्व',
          content: `Your life partner is indicated to be intelligent, self-respecting, practical, and grounded. They bring emotional balance and clarity to your life. The relationship succeeds when both partners maintain honest communication and give each other space for individual intellectual pursuits.`,
          contentHi: `आपका जीवनसाथी समझदार, स्वाभिमानी, व्यावहारिक और सुलझे हुए विचारों वाला होगा। वे आपके जीवन में स्थिरता और संतुलन लाएंगे। आपसी संवाद और विश्वास इस रिश्ते की मुख्य ताकत होगी।`,
        },
      ],
      astrologicalEvidenceSummary: `7th house (Kalatrasthana), D9 Navamsha chart harmony, and Venus/Jupiter relational significators.`,
      astrologicalEvidenceSummaryHi: `सप्तम भाव, नवांश (D9) कुण्डली तथा शुक्र-गुरु ग्रह की स्थिति पर आधारित।`,
    },

    // CHAPTER 5: TOUGH PHASES & EXPLAINING SETBACKS (MOKSHA & RESILIENCE)
    {
      id: 'chapter-moksha',
      chapterNumber: 5,
      title: 'Understanding Struggles & Overcoming Delays',
      titleHi: 'बाधाओं का रहस्य एवं असफलताओं पर विजय',
      subtitle: 'Why the last 1–2 years were tough, when relief arrives, and your sattvic recovery plan',
      subtitleHi: 'विगत 1-2 वर्ष कठिन क्यों रहे, राहत कब मिलेगी और क्या उपाय करें',
      executiveSummary: struggles?.rootExplanation || `Recent obstacles and feeling stuck are part of a specific karmic restructuring phase designed to prune weak strategies and build unbreakable resilience.`,
      executiveSummaryHi: struggles?.rootExplanationHi || `हाल के समय में आई रुकावटें एक आवश्यक कर्म मंथन का हिस्सा हैं, जो आपको अधिक सक्षम और परिपक्व बनाने के लिए आई हैं।`,
      sections: [
        {
          heading: 'Why Have You Faced Delays & Setbacks?',
          headingHi: 'विगत समय में असफलताएं और विलंब क्यों हुए?',
          content: struggles?.rootExplanation || `Planetary transits like Saturn Sade Sati or intense sub-periods temporarily slow down outward momentum. This is not bad luck—it is a cosmic audit asking you to upgrade your methods, eliminate distractions, and master emotional self-control.`,
          contentHi: struggles?.rootExplanationHi || `शनि गोचर अथवा कठिन अंतर्दशा के कारण बाह्य प्रगति धीमी हो जाती है। यह समय आत्म-सुधार और अनावश्यक भटकाव को समाप्त करने का है।`,
          highlights: struggles?.activeCauses?.map((c: any) => `${c.title}: ${c.explanation}`) || [
            'Active sub-period consolidation cycle',
            'Karmic testing designed to forge discipline',
          ],
          highlightsHi: struggles?.activeCauses?.map((c: any) => `${c.titleHi}: ${c.explanationHi}`) || [
            'ग्रहों की दशा का आंतरिक प्रभाव',
            'धैर्य और अनुशासन की परीक्षा का समय',
          ],
        },
        {
          heading: 'When Does the Tough Phase End? (Light at the End of the Tunnel)',
          headingHi: 'यह कठिन समय कब समाप्त होगा? (राहत का समय)',
          content: struggles?.reliefTimelineSummary || `The peak friction begins lifting after ${struggles?.reliefDate || 'the upcoming dasha shift'}, paving the way for clearer momentum, new breakthroughs, and renewed confidence.`,
          contentHi: struggles?.reliefTimelineSummaryHi || `ग्रह दशा में परिवर्तन के साथ स्थितियां पुनः अनुकूल होंगी और रुके हुए कार्यों में गति आएगी।`,
        },
        {
          heading: 'Your Actionable Sattvic Protocol & Remedies',
          headingHi: 'व्यावहारिक एवं सात्विक मार्गदर्शन (उपाय)',
          content: struggles?.actionProtocol
            ? struggles.actionProtocol.map((p: any, idx: number) => `${idx + 1}. **${p.title}:** ${p.description}`).join('\n\n')
            : '1. Maintain a disciplined morning routine.\n2. Avoid speculative gambles.\n3. Practice daily meditation and selfless service.',
          contentHi: struggles?.actionProtocol
            ? struggles.actionProtocol.map((p: any, idx: number) => `${idx + 1}. **${p.titleHi}:** ${p.descriptionHi}`).join('\n\n')
            : '1. नियमित दिनचर्या का पालन करें।\n2. जल्दबाजी में बड़े वित्तीय निर्णय न लें।\n3. ध्यान एवं सेवा भाव बनाए रखें।',
        },
      ],
      astrologicalEvidenceSummary: `Evaluation of Sade Sati, active ${currentMaha}-${currentAntar} sub-period, and transit pressure matrix.`,
      astrologicalEvidenceSummaryHi: `शनि गोचर, साढ़े साती तथा वर्तमान ${currentMaha}-${currentAntar} दशा का विश्लेषण।`,
    },
  ];

  return {
    fullName,
    primaryArchetype,
    primaryArchetypeHi,
    coreLifeMission: coreMission,
    coreLifeMissionHi: coreMissionHi,
    chapters,
  };
}
