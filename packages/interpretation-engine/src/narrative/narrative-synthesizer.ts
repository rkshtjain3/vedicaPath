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

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

function getSignByIndex(index: number): string {
  const norm = ((index % 12) + 12) % 12;
  return ZODIAC_SIGNS[norm];
}

function getSignIndex(signName: string): number {
  const idx = ZODIAC_SIGNS.findIndex((s) => s.toLowerCase() === (signName || '').toLowerCase());
  return idx >= 0 ? idx : 0;
}

function getSignLord(signName: string): string {
  const s = (signName || '').toLowerCase();
  if (s === 'aries' || s === 'scorpio') return 'Mars';
  if (s === 'taurus' || s === 'libra') return 'Venus';
  if (s === 'gemini' || s === 'virgo') return 'Mercury';
  if (s === 'cancer') return 'Moon';
  if (s === 'leo') return 'Sun';
  if (s === 'sagittarius' || s === 'pisces') return 'Jupiter';
  if (s === 'capricorn' || s === 'aquarius') return 'Saturn';
  return 'Mars';
}

function getElementOfSign(signName: string): 'Fire' | 'Earth' | 'Air' | 'Water' {
  const s = (signName || '').toLowerCase();
  if (['aries', 'leo', 'sagittarius'].includes(s)) return 'Fire';
  if (['taurus', 'virgo', 'capricorn'].includes(s)) return 'Earth';
  if (['gemini', 'libra', 'aquarius'].includes(s)) return 'Air';
  return 'Water';
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
  const currentMaha = dashaData?.current?.mahadasha?.planet || dashaData?.current?.mahadasha?.lord || 'Jupiter';
  const currentAntar = dashaData?.current?.antardasha?.planet || dashaData?.current?.antardasha?.lord || 'Saturn';

  const ascIdx = getSignIndex(ascSign);
  const secondSign = getSignByIndex(ascIdx + 1);
  const thirdSign = getSignByIndex(ascIdx + 2);
  const fourthSign = getSignByIndex(ascIdx + 3);
  const fifthSign = getSignByIndex(ascIdx + 4);
  const sixthSign = getSignByIndex(ascIdx + 5);
  const seventhSign = getSignByIndex(ascIdx + 6);
  const eighthSign = getSignByIndex(ascIdx + 7);
  const ninthSign = getSignByIndex(ascIdx + 8);
  const tenthSign = getSignByIndex(ascIdx + 9);
  const eleventhSign = getSignByIndex(ascIdx + 10);
  const twelfthSign = getSignByIndex(ascIdx + 11);

  const fourthLord = getSignLord(fourthSign);
  const seventhLord = getSignLord(seventhSign);
  const tenthLord = getSignLord(tenthSign);

  const lagnaElement = getElementOfSign(ascSign);
  const moonElement = getElementOfSign(moonSign);

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

  // Dynamic Superpowers based on Lagna Element and Planets
  let superpower1En = 'Strategic Foresight: Looking beyond immediate chaos to spot high-value future opportunities.';
  let superpower1Hi = 'दीर्घकालिक दूरदर्शिता: तात्कालिक भ्रम से परे भविष्य के सही अवसरों को पहचानने की क्षमता।';
  let superpower2En = 'Resilient Execution: Staying grounded under high pressure to turn complex ideas into tangible results.';
  let superpower2Hi = 'दबाव में धैर्य व कर्मठता: कठिन परिस्थितियों में भी शांत रहकर योजना को यथार्थ में बदलना।';
  let superpower3En = 'Authentic Influence: Natural intellectual clarity and personal integrity that commands deep respect.';
  let superpower3Hi = 'सच्ची लगन व प्रभाव: बौद्धिक स्पष्टता और सत्यनिष्ठा जिससे समाज में आदर मिलता है।';

  if (lagnaElement === 'Fire') {
    superpower1En = 'Bold Pioneering Drive: Taking fearless, decisive action when others hesitate or overthink.';
    superpower1Hi = 'निर्भीक पहल: जहां अन्य लोग संकोच करते हैं, वहां साहसपूर्वक पहला कदम उठाने की क्षमता।';
    superpower2En = 'Inspirational Magnetism: Radiating infectious enthusiasm that rallies peers around ambitious visions.';
    superpower2Hi = 'प्रेरणादायी ऊर्जा: अपने उत्साह और आत्मविश्वास से दूसरों को बड़े लक्ष्यों हेतु प्रेरित करना।';
    superpower3En = 'Rapid Recovery: Bouncing back swiftly from setbacks with doubled energy and fresh conviction.';
    superpower3Hi = 'तीव्र पुनरुत्थान: असफलताओं से निराश हुए बिना दुगुनी ऊर्जा से पुनः उठ खड़े होना।';
  } else if (lagnaElement === 'Earth') {
    superpower1En = 'Pragmatic Resource Mastery: Compounding capital, tangible assets, and high-efficiency processes.';
    superpower1Hi = 'व्यावहारिक कुशलता: धन, अचल संपत्ति और समय का सर्वोत्तम उपयोग कर स्थायी निर्माण करना।';
    superpower2En = 'Unshakeable Consistency: Outlasting short-term hype through disciplined, reliable daily execution.';
    superpower2Hi = 'अटल निरंतरता: प्रतिदिन अनुशासित परिश्रम से दीर्घकालिक श्रेष्ठता हासिल करना।';
    superpower3En = 'Discerning Realism: Spotting flaws, operational risks, and hidden costs before they escalate.';
    superpower3Hi = 'सूक्ष्म यथार्थ दृष्टि: जोखिमों और लागतों का सटीक पूर्व-आकलन करने की योग्यता।';
  } else if (lagnaElement === 'Air') {
    superpower1En = 'Agile Cognitive Synthesis: Rapidly decoding, abstracting, and connecting multifaceted technical & social concepts.';
    superpower1Hi = 'तीक्ष्ण बौद्धिक विश्लेषण: जटिल तकनीकी व सामाजिक प्रणालियों को शीघ्र समझकर जोड़ने की कला।';
    superpower2En = 'High-Leverage Articulation: Communicating complex ideas with razor-sharp persuasive clarity.';
    superpower2Hi = 'प्रभावशाली संवाद: कठिन विचारों को अत्यंत सरल व प्रभावशाली ढंग से प्रस्तुत करना।';
    superpower3En = 'Systems Optimization: Eliminating structural bottlenecks to build scalable, friction-free workflows.';
    superpower3Hi = 'प्रणाली सुधार: कार्यप्रणाली की कमियों को दूर कर बड़े पैमाने पर काम को सुगम बनाना।';
  } else if (lagnaElement === 'Water') {
    superpower1En = 'Deep Intuitive Foresight: Sensing emotional undercurrents, unspoken motivations, and cultural shifts.';
    superpower1Hi = 'गहन अंतर्ज्ञान: लोगों की अनकही भावनाओं और भविष्य की प्रवृत्तियों को पहले से भांप लेना।';
    superpower2En = 'Transformative Empathy: Healing interpersonal friction and building deeply loyal, enduring alliances.';
    superpower2Hi = 'सहानुभूति व जुड़ाव: आपसी मतभेदों को सुलझाकर अटूट विश्वास और निष्ठा का निर्माण करना।';
    superpower3En = 'Creative Regeneration: Channeling profound feelings into high-impact artistic, strategic, or healing works.';
    superpower3Hi = 'रचनात्मक पुनरुद्धार: आंतरिक संवेदनाओं को उत्कृष्ट कला, रणनीति अथवा परामर्श में बदलना।';
  }

  // Dynamic Career Sectors based on 10th House Sign
  let sectorsEn: string[] = [];
  let sectorsHi: string[] = [];

  const tSign = tenthSign.toLowerCase();
  if (tSign.includes('aries') || tSign.includes('scorpio')) {
    sectorsEn = [
      'Technology, Engineering, Cybersecurity & Defense Systems',
      'Real Estate Development, Heavy Infrastructure & Construction',
      'High-Stakes Operations, Sports, Surgery & Emergency Management',
      'Autonomous Venture Building & Dynamic Leadership Roles'
    ];
    sectorsHi = [
      'प्रौद्योगिकी, इंजीनियरिंग, साइबर सुरक्षा एवं रक्षा प्रणालियां',
      'अचल संपत्ति विकास, बुनियादी ढांचा एवं निर्माण प्रबंधन',
      'महत्वपूर्ण परिचालन, खेल, शल्य चिकित्सा एवं आपातकालीन प्रबंधन',
      'स्वतंत्र व्यापारिक उद्यम एवं ऊर्जावान नेतृत्वकारी भूमिकाएं'
    ];
  } else if (tSign.includes('taurus') || tSign.includes('libra')) {
    sectorsEn = [
      'Luxury Goods, Architecture, Interior Design & Media Arts',
      'Wealth Advisory, Private Equity, Banking & Asset Valuation',
      'Hospitality, High-End Commerce, Food Systems & Fine Arts',
      'Strategic Partnerships, Corporate Diplomacy & Consumer Brands'
    ];
    sectorsHi = [
      'लक्जरी उत्पाद, वास्तुकला, इंटीरियर डिजाइन एवं कलात्मक मीडिया',
      'धन प्रबंधन, प्राइवेट इक्विटी, बैंकिंग एवं परिसंपत्ति मूल्यांकन',
      'आतिथ्य सत्कार, उच्च स्तरीय व्यापार एवं उपभोक्ता ब्रांड्स',
      'रणनीतिक साझेदारी, वाणिज्यिक संधि एवं सौहार्दपूर्ण संवाद'
    ];
  } else if (tSign.includes('gemini') || tSign.includes('virgo')) {
    sectorsEn = [
      'Software Architecture, Artificial Intelligence & Cloud Platforms',
      'Strategic Management Consulting, Data Analytics & Research',
      'Media, Publishing, EdTech, Content Strategy & Telecommunications',
      'Fintech, Supply Chain Logistics & Algorithmic Optimization'
    ];
    sectorsHi = [
      'सॉफ्टवेयर आर्किटेक्चर, आर्टिफिशियल इंटेलिजेंस एवं क्लाउड सिस्टम्स',
      'रणनीतिक प्रबंधन परामर्श, डेटा विश्लेषिकी एवं शोध कार्य',
      'मीडिया, प्रकाशन, एडटेक, संचार तकनीक एवं सामग्री निर्माण',
      'फिनटेक, आपूर्ति श्रृंखला रसद एवं स्वचालित व्यापार प्रणालियां'
    ];
  } else if (tSign.includes('cancer') || tSign.includes('pisces')) {
    sectorsEn = [
      'Healthcare, Pharmaceuticals, Biotechnology & Integrative Healing',
      'International NGO Governance, Marine & Environmental Sustainability',
      'Creative Screenwriting, Psychology, Cinema & Human Resources',
      'Higher Education, Philanthropy & Value-Driven Foundations'
    ];
    sectorsHi = [
      'स्वास्थ्य सेवा, फार्मास्यूटिकल्स, बायोटेक एवं समग्र चिकित्सा',
      'अंतरराष्ट्रीय संस्थागत प्रबंधन, पर्यावरण एवं जल संसाधन',
      'रचनात्मक लेखन, मनोविज्ञान, सिनेमा एवं मानव संसाधन प्रबंधन',
      'उच्च शिक्षा, परोपकारी न्यास एवं मूल्य-आधारित संगठन'
    ];
  } else if (tSign.includes('leo') || tSign.includes('sagittarius')) {
    sectorsEn = [
      'Corporate Executive Leadership, Public Policy & Sovereign Administration',
      'Jurisprudence, Constitutional Law, Ethics & Higher Academia',
      'Venture Capital, Sovereign Wealth & Strategic Cross-Border Advisory',
      'Institutional Governance & Brand Ambassadorship'
    ];
    sectorsHi = [
      'कॉर्पोरेट कार्यकारी नेतृत्व, लोकनीति एवं प्रशासनिक सेवाएं',
      'विधि, न्यायशास्त्र, उच्च शिक्षा एवं दार्शनिक शोध संस्थान',
      'वेंचर कैपिटल, अंतरराष्ट्रीय निवेश एवं रणनीतिक परामर्श',
      'संस्थागत मार्गदर्शन एवं प्रतिष्ठित सामाजिक नेतृत्व'
    ];
  } else {
    // Capricorn / Aquarius
    sectorsEn = [
      'Large-Scale Enterprise Architecture, Decentralized Networks & Web3',
      'Energy, Renewable Power, Industrial Machinery & Heavy Logistics',
      'Social Innovation, Public Infrastructure & Institutional Reform',
      'Deep-Tech Hardware, Aerospace & Long-Term Scalable Platforms'
    ];
    sectorsHi = [
      'बड़े पैमाने की एंटरप्राइज संरचनाएं, विकेंद्रीकृत नेटवर्क एवं टेक',
      'ऊर्जा, नवीकरणीय संसाधन, औद्योगिक मशीनरी एवं भारी रसद',
      'सामाजिक नवाचार, सार्वजनिक अवसंरचना एवं संस्थागत सुधार',
      'डीप-टेक हार्डवेयर, एयरोस्पेस एवं दीर्घकालिक प्रणालियां'
    ];
  }

  // Dynamic Spouse Profile based on 7th House
  let spouseProfileEn = 'Intelligent, grounded, and loyal partner who values open communication and shared goals.';
  let spouseProfileHi = 'समझदार, व्यावहारिक और निष्ठावान जीवनसाथी जो स्पष्ट संवाद और साझा लक्ष्यों को महत्व देते हैं।';

  const sSign = seventhSign.toLowerCase();
  if (sSign.includes('aries') || sSign.includes('scorpio')) {
    spouseProfileEn = `Dynamic, courageous, direct in speech, and action-oriented (Mars-influenced ${seventhSign}). They bring bold initiative, physical energy, and protective loyalty into your life.`;
    spouseProfileHi = `ऊर्जावान, साहसी, स्पष्टवादी और कर्मठ स्वभाव के (${seventhSign} राशि / मंगल प्रभाव)। वे आपके जीवन में आत्मविश्वास और सुरक्षा का भाव लाएंगे।`;
  } else if (sSign.includes('taurus') || sSign.includes('libra')) {
    spouseProfileEn = `Refined, graceful, peace-loving, aesthetically minded, and financially prudent (Venus-influenced ${seventhSign}). They cultivate an elegant, welcoming, and emotionally harmonious domestic sanctuary.`;
    spouseProfileHi = `सुरुचिपूर्ण, शांतप्रिय, सुरुचि संपन्न और आर्थिक रूप से समझदार (${seventhSign} राशि / शुक्र प्रभाव)। वे घर में सौंदर्य, सुख और संतुलन स्थापित करेंगे।`;
  } else if (sSign.includes('gemini') || sSign.includes('virgo')) {
    spouseProfileEn = `Quick-witted, articulate, intellectually curious, and multi-talented (Mercury-influenced ${seventhSign}). They serve as your intellectual sounding board and thrive in thoughtful, stimulating conversations.`;
    spouseProfileHi = `कुशाग्र बुद्धि, वाक्पटु, जिज्ञासु और बहुमुखी प्रतिभा के धनी (${seventhSign} राशि / बुध प्रभाव)। वे एक सच्चे मित्र और बौद्धिक सलाहकार की भूमिका निभाएंगे।`;
  } else if (sSign.includes('cancer') || sSign.includes('pisces')) {
    spouseProfileEn = `Emotionally intuitive, empathetic, nurturing, and spiritually deep (Water sign ${seventhSign}). They provide deep emotional security, unconditional support, and family-first dedication.`;
    spouseProfileHi = `भावनात्मक रूप से गहरे, दयालु, संवेदनशील और आध्यात्मिक सोच वाले (${seventhSign} राशि)। वे पारिवारिक मूल्यों और परस्पर स्नेह को सर्वोच्च प्राथमिकता देंगे।`;
  } else if (sSign.includes('leo') || sSign.includes('sagittarius')) {
    spouseProfileEn = `Dignified, visionary, highly educated, ethical, and respected in society (${seventhSign}). They inspire your personal ambitions and uphold prominent cultural and familial standards.`;
    spouseProfileHi = `स्वाभिमानी, उच्च शिक्षित, नैतिक मूल्यों से युक्त और समाज में प्रतिष्ठित (${seventhSign} राशि)। वे आपकी महत्वाकांक्षाओं को नई ऊंचाई देंगे।`;
  } else {
    // Capricorn / Aquarius
    spouseProfileEn = `Mature, realistic, methodical, disciplined, and dependable (${seventhSign} / Saturn). They value long-term stability, practical partnership, and building enduring family security.`;
    spouseProfileHi = `गंभीर, व्यवस्थित, कर्मठ, यथार्थवादी और अत्यधिक विश्वसनीय (${seventhSign} राशि / शनि प्रभाव)। वे जीवन में स्थायित्व और सुरक्षा को प्राथमिकता देंगे।`;
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
      subtitle: `Your ${ascSign} Ascendant calling, ${primaryArchetype} soul archetype, and innate superpowers`,
      subtitleHi: `${ascSign} लग्न, ${primaryArchetypeHi} स्वरूप और स्वाभाविक शक्तियों का विश्लेषण`,
      archetypeBadge: primaryArchetype,
      archetypeBadgeHi: primaryArchetypeHi,
      executiveSummary: `Your birth chart reveals an individual configured for purposeful impact rather than passive routine. Born with ${ascSign} Rising (${lagnaElement} Element) and Moon in ${moonSign} (${moonElement} Element), your life's higher mission centers on: ${coreMission}`,
      executiveSummaryHi: `आपकी कुण्डली एक उद्देश्यपूर्ण और प्रभावशाली जीवन का संकेत देती है। ${ascSign} लग्न (${lagnaElement} तत्व) और ${moonSign} चंद्र राशि (${moonElement} तत्व) के साथ आपका मूल जीवन लक्ष्य है: ${coreMissionHi}`,
      sections: [
        {
          heading: 'Your Core Soul Calling & Life Archetype',
          headingHi: 'आपका मूल व्यक्तित्व एवं आत्मिक लक्ष्य',
          content: `You operate under the archetype of "${primaryArchetype}". Your natural disposition thrives when you are given autonomy, challenging projects, and the freedom to create solutions that outlast immediate trends. You find meaning not merely in routine success, but in mastering skills and solving problems that others find overwhelming.`,
          contentHi: `आप "${primaryArchetypeHi}" के रूप में कार्य करते हैं। आपकी स्वाभाविक ऊर्जा तब सर्वश्रेष्ठ रूप में प्रकट होती है जब आपको स्वतंत्रता और चुनौतीपूर्ण कार्य सौंपे जाते हैं। आप सतही सफलता के स्थान पर गहन दक्षता में विश्वास रखते हैं।`,
          highlights: [
            `Core Soul Archetype: ${primaryArchetype}`,
            `Rising Alignment: ${ascSign} (${lagnaElement} Element)`,
            `Emotional Core: Moon in ${moonSign} (${moonElement} Element)`,
          ],
          highlightsHi: [
            `मूल आत्मिक स्वरूप: ${primaryArchetypeHi}`,
            `लग्न संरेखण: ${ascSign} (${lagnaElement} तत्व)`,
            `भावनात्मक आधार: ${moonSign} में चंद्र (${moonElement} तत्व)`,
          ],
        },
        {
          heading: 'Your 3 Innate Superpowers',
          headingHi: 'आपकी 3 स्वाभाविक शक्तियां',
          content: `1. **${superpower1En.split(':')[0]}:** ${superpower1En.split(':')[1]}\n2. **${superpower2En.split(':')[0]}:** ${superpower2En.split(':')[1]}\n3. **${superpower3En.split(':')[0]}:** ${superpower3En.split(':')[1]}`,
          contentHi: `1. **${superpower1Hi.split(':')[0]}:** ${superpower1Hi.split(':')[1]}\n2. **${superpower2Hi.split(':')[0]}:** ${superpower2Hi.split(':')[1]}\n3. **${superpower3Hi.split(':')[0]}:** ${superpower3Hi.split(':')[1]}`,
        },
        {
          heading: 'Karmic Growth Axis (What to Master vs What to Evolve)',
          headingHi: 'कर्म विकास का मार्ग (क्या त्यागें और क्या अपनाएं)',
          content: `Your karmic axis urges you to move away from over-analyzing past self-doubt or seeking validation from small-minded circles. Your evolution demands stepping boldly into your leadership authority, trusting your own judgment, and building things of lasting significance under your active ${currentMaha}-${currentAntar} progression.`,
          contentHi: `आपका कर्म मार्ग आपको संशय और बाहरी अनुमोदन की प्रतीक्षा से बाहर निकलकर अपने आत्मविश्वास और नेतृत्व पर भरोसा करने का निर्देश देता है। वर्तमान ${currentMaha}-${currentAntar} दशा में दीर्घकालिक लक्ष्यों पर अडिग रहें।`,
        },
      ],
      astrologicalEvidenceSummary: `Ascendant in ${ascSign} (${lagnaElement}), Moon in ${moonSign} (${moonElement}), Sun in ${sunSign} with active ${currentMaha} Mahadasha and ${currentAntar} Antardasha.`,
      astrologicalEvidenceSummaryHi: `${ascSign} लग्न (${lagnaElement} तत्व), ${moonSign} चंद्र (${moonElement} तत्व), ${sunSign} सूर्य तथा ${currentMaha}-${currentAntar} दशा चक्र पर आधारित।`,
    },

    // CHAPTER 2: CAREER PATH IN DETAIL (ARTHA)
    {
      id: 'chapter-artha',
      chapterNumber: 2,
      title: 'Your Detailed Career Trajectory',
      titleHi: 'करियर पथ एवं आजीविका का विस्तृत विश्लेषण',
      subtitle: `10th House in ${tenthSign} (Lord: ${tenthLord}), Job vs Business strategy, and peak timing`,
      subtitleHi: `दशम भाव (${tenthSign} / भावेश: ${tenthLord}), नौकरी बनाम व्यापार एवं पदोन्नति का समय`,
      executiveSummary: `Your professional DNA is governed by ${tenthSign} on the 10th House axis (ruled by ${tenthLord}), optimizing your career for strategic autonomy, domain depth, and measurable authority over low-leverage micromanaged execution.`,
      executiveSummaryHi: `आपका करियर दशम भाव में ${tenthSign} राशि (स्वामी: ${tenthLord}) द्वारा संचालित है, जो आपको स्वतंत्र निर्णय, विशेषज्ञता और रणनीतिक नेतृत्व में सर्वोच्च सफलता दिलाता है।`,
      sections: [
        {
          heading: 'Job vs. Startup / Entrepreneurship Fit',
          headingHi: 'नौकरी बनाम व्यापार/स्टार्टअप अनुकूलता',
          content: `Your chart exhibits a **High-Autonomy Enterprise Configuration**. While structured corporate roles in early phases provide domain credibility and key industry networks, your ultimate peak fulfillment and wealth compounding arrive through leading specialized projects, executive consulting, or launching autonomous business ventures.`,
          contentHi: `आपकी कुण्डली **स्वायत्त उद्यम एवं विशेषज्ञ नेतृत्व** की ओर संकेत करती है। प्रारंभिक वर्षों में संगठित नौकरी से अनुभव और नेटवर्क मिलता है, परंतु आपका वास्तविक विस्तार स्वतंत्र निर्णय क्षमता और उद्यम से होगा।`,
          highlights: [
            `10th House Karmasthana: ${tenthSign} (Ruled by ${tenthLord})`,
            'Enterprise & Ownership Affinity: 85%+',
            'Optimal Work Style: High autonomy, strategic leadership, results-oriented',
            'Avoid: Stagnant roles with micromanagement and no upside',
          ],
          highlightsHi: [
            `दशम कर्म भाव: ${tenthSign} (स्वामी: ${tenthLord})`,
            'स्वतंत्र कार्य/उद्यम उपयुक्तता: 85%+',
            'कार्यशैली: पूर्ण स्वायत्तता एवं परिणामोन्मुखी नेतृत्व',
            'परहेज करें: अत्यधिक नियंत्रण और सीमित विकास वाले वातावरण से',
          ],
        },
        {
          heading: 'Top Aligned Industries & Sectors',
          headingHi: 'अत्यधिक उपयुक्त उद्योग एवं कार्यक्षेत्र',
          content: sectorsEn.map((s, idx) => `${idx + 1}. **${s.split(',')[0]}:** ${s}`).join('\n\n'),
          contentHi: sectorsHi.map((s, idx) => `${idx + 1}. **${s}**`).join('\n\n'),
        },
        {
          heading: 'Upcoming Career Acceleration Window',
          headingHi: 'आगामी करियर प्रगति एवं पदोन्नति का समय',
          content: nextCar
            ? `Your strongest upcoming acceleration window is active from **${nextCar.startDate} to ${nextCar.endDate}** (${nextCar.confidenceLabel}). Use this window to negotiate senior leadership roles, launch major client initiatives, or expand equity.`
            : `Your career is entering a key consolidation phase under the ${currentMaha}-${currentAntar} cycle. Focus on upgrading rare skills and building executive leverage.`,
          contentHi: nextCar
            ? `करियर में तीव्र प्रगति और पदोन्नति का सबसे अनुकूल काल **${nextCar.startDate} से ${nextCar.endDate}** (${nextCar.confidenceLabelHi}) के मध्य है। इस अवधि में महत्वपूर्ण पहलों को आगे बढ़ाएं।`
            : `वर्तमान समय ${currentMaha}-${currentAntar} दशा में कौशल वृद्धि और मजबूत संपर्क बनाने का है।`,
        },
      ],
      astrologicalEvidenceSummary: `10th House in ${tenthSign} (Lord: ${tenthLord}), D10 Dashamsha alignment, and active ${currentMaha}-${currentAntar} sub-period.`,
      astrologicalEvidenceSummaryHi: `दशम भाव में ${tenthSign} (स्वामी: ${tenthLord}), दशमांश (D10) चार्ट तथा सक्रिय ${currentMaha}-${currentAntar} दशा पर आधारित।`,
    },

    // CHAPTER 3: WEALTH & HOME ACQUISITION (SAMRIDDHI)
    {
      id: 'chapter-samriddhi',
      chapterNumber: 3,
      title: 'Wealth, Assets & Home Acquisition',
      titleHi: 'धन, समृद्धि एवं भवन क्रय का समय',
      subtitle: `4th House in ${fourthSign} (Lord: ${fourthLord}), property timing, and wealth compounding pattern`,
      subtitleHi: `चतुर्थ भाव (${fourthSign} / भावेश: ${fourthLord}), मकान/भूमि क्रय का समय एवं धन संचय`,
      executiveSummary: `Your chart indicates strong long-term asset accumulation, with 2nd House (${secondSign}) and 11th House (${eleventhSign}) generating sustainable surplus, while the 4th House in ${fourthSign} (Lord: ${fourthLord}) protects physical real estate and domestic sanctuary.`,
      executiveSummaryHi: `आपकी कुण्डली में द्वितीय भाव (${secondSign}) एवं एकादश भाव (${eleventhSign}) निरंतर धन आगमन सुनिश्चित करते हैं, तथा चतुर्थ भाव (${fourthSign}) अचल संपत्ति व गृह सुख को मजबूती प्रदान करता है।`,
      sections: [
        {
          heading: 'When Will You Buy a Home or Real Estate?',
          headingHi: 'भवन अथवा अचल संपत्ति कब क्रय करेंगे?',
          content: nextProp
            ? `Your primary property acquisition window opens between **${nextProp.startDate} and ${nextProp.endDate}** (${nextProp.confidenceLabel}). During this cycle, planetary energies support stable real estate purchases, land acquisition, home upgrades, and building domestic permanence.`
            : `Property acquisition is strongly activated when supportive planetary transits trigger your 4th house axis (${fourthSign}, ruled by ${fourthLord}).`,
          contentHi: nextProp
            ? `मकान या भूमि क्रय करने का प्रमुख योग **${nextProp.startDate} से ${nextProp.endDate}** (${nextProp.confidenceLabelHi}) के मध्य निर्मित हो रहा है। यह काल स्थायी आवास और पारिवारिक सुख के लिए अत्यंत शुभ है।`
            : `चतुर्थ भाव (${fourthSign} / स्वामी: ${fourthLord}) के शुभ गोचर में भवन निर्माण अथवा क्रय का श्रेष्ठ योग बनता है।`,
          highlights: [
            `Prime Real Estate Window: ${nextProp ? `${nextProp.startDate} to ${nextProp.endDate}` : 'Active in coming sub-period'}`,
            `4th House Sanctuary: ${fourthSign} (Lord: ${fourthLord})`,
            'Asset Focus: Ready residential property, appreciating land, and secure equity',
          ],
          highlightsHi: [
            `आगामी श्रेष्ठ समय: ${nextProp ? `${nextProp.startDate} से ${nextProp.endDate}` : 'आगामी अंतर्दशा में सक्रिय'}`,
            `चतुर्थ सुख भाव: ${fourthSign} (स्वामी: ${fourthLord})`,
            'संपत्ति प्रकार: आवासीय भवन, गुणवत्तापूर्ण भूमि एवं सुरक्षित निवेश',
          ],
        },
        {
          heading: 'Wealth Accumulation & Capital Compounding Pattern',
          headingHi: 'धन संचय एवं पूंजी वृद्धि का स्वरूप',
          content: `Your financial growth follows an exponential curve: steady compounding through structured discipline in earlier phases followed by rapid expansion once your proprietary skills and professional equity mature. Long-term wealth is built through tangible assets and intellectual property rather than volatile gambling.`,
          contentHi: `आपका धन संचय क्रमिक और स्थायी है। जैसे-जैसे आपका अनुभव और साख बढ़ती है, आपकी आय में उल्लेखनीय वृद्धि होती है। आप स्वामित्व और सुरक्षित निवेश के माध्यम से अधिक लाभ कमाते हैं।`,
        },
      ],
      astrologicalEvidenceSummary: `4th House (${fourthSign}, Lord: ${fourthLord}), 2nd House (${secondSign}), 11th House (${eleventhSign}), and active dasha axis.`,
      astrologicalEvidenceSummaryHi: `चतुर्थ भाव (${fourthSign}), द्वितीय भाव (${secondSign}), एकादश भाव (${eleventhSign}) तथा सक्रिय दशा अक्ष पर आधारित।`,
    },

    // CHAPTER 4: LOVE & MARRIAGE (KAMA)
    {
      id: 'chapter-kama',
      chapterNumber: 4,
      title: 'Love, Marriage & Relationships',
      titleHi: 'विवाह, प्रेम एवं दांपत्य जीवन',
      subtitle: `7th House in ${seventhSign} (Lord: ${seventhLord}), partner traits, and marital harmony`,
      subtitleHi: `सप्तम भाव (${seventhSign} / भावेश: ${seventhLord}), जीवनसाथी का स्वभाव और सुखी दांपत्य`,
      executiveSummary: `Your relational axis is defined by ${seventhSign} in the 7th House (Lord: ${seventhLord}), indicating a partnership grounded in intellectual respect, emotional maturity, and mutual professional autonomy over superficial drama.`,
      executiveSummaryHi: `आपकी कुण्डली में सप्तम भाव ${seventhSign} राशि (स्वामी: ${seventhLord}) में स्थित है, जो बौद्धिक समझ, परस्पर आदर और परिपक्व निष्ठा पर आधारित सुंदर दांपत्य जीवन का संकेत देता है।`,
      sections: [
        {
          heading: 'When Will You Get Married / Deepen Commitment?',
          headingHi: 'विवाह अथवा गंभीर रिश्ते का समय कब है?',
          content: nextMarr
            ? `Your most auspicious marriage and commitment window is indicated between **${nextMarr.startDate} and ${nextMarr.endDate}** (${nextMarr.confidenceLabel}). This is a prime phase for meeting a highly compatible life partner, formal matrimonial alliances, or solidifying relational harmony.`
            : `Favorable relationship activations occur during supportive sub-periods energizing your 7th house (${seventhSign}, ruled by ${seventhLord}) with D9 Navamsha harmony.`,
          contentHi: nextMarr
            ? `विवाह अथवा गंभीर संबंध के लिए सर्वाधिक शुभ काल **${nextMarr.startDate} से ${nextMarr.endDate}** (${nextMarr.confidenceLabelHi}) के मध्य है। इस समय अनुकूल जीवनसाथी मिलने अथवा विवाह तय होने के प्रबल योग हैं।`
            : `सप्तम भाव (${seventhSign} / स्वामी: ${seventhLord}) एवं नवमांश (D9) के शुभ संरेखण में दांपत्य सुख का योग बनता है।`,
          highlights: [
            `Marriage Timing Window: ${nextMarr ? `${nextMarr.startDate} to ${nextMarr.endDate}` : 'Active during supportive transits'}`,
            `7th House Union Axis: ${seventhSign} (Ruled by ${seventhLord})`,
            'Relational Key: Clear transparent dialogue & mutual respect for individuality',
          ],
          highlightsHi: [
            `विवाह शुभ समय: ${nextMarr ? `${nextMarr.startDate} से ${nextMarr.endDate}` : 'शुभ गोचर में सक्रिय'}`,
            `सप्तम भाव: ${seventhSign} (स्वामी: ${seventhLord})`,
            'सफलता का सूत्र: स्पष्ट संवाद और एक-दूसरे की स्वतंत्रता का सम्मान',
          ],
        },
        {
          heading: 'Your Partner’s Characteristics & Relationship Dynamics',
          headingHi: 'जीवनसाथी का स्वभाव एवं व्यक्तित्व',
          content: spouseProfileEn,
          contentHi: spouseProfileHi,
        },
      ],
      astrologicalEvidenceSummary: `7th House in ${seventhSign} (Lord: ${seventhLord}), D9 Navamsha chart harmony, and active ${currentMaha}-${currentAntar} transit cycle.`,
      astrologicalEvidenceSummaryHi: `सप्तम भाव (${seventhSign} / स्वामी: ${seventhLord}), नवमांश (D9) चक्र तथा सक्रिय ${currentMaha}-${currentAntar} दशा पर आधारित।`,
    },

    // CHAPTER 5: TOUGH PHASES & EXPLAINING SETBACKS (MOKSHA & RESILIENCE)
    {
      id: 'chapter-moksha',
      chapterNumber: 5,
      title: 'Understanding Struggles & Overcoming Delays',
      titleHi: 'बाधाओं का रहस्य एवं असफलताओं पर विजय',
      subtitle: 'Why recent years felt challenging, when relief arrives, and your sattvic recovery plan',
      subtitleHi: 'कठिन समय का ज्योतिषीय कारण, राहत की समय-सीमा और सात्विक समाधान',
      executiveSummary: struggles?.rootExplanation || `Recent obstacles and feeling stuck are part of a specific karmic restructuring phase under the ${currentMaha}-${currentAntar} cycle designed to prune weak strategies and forge unbreakable discipline.`,
      executiveSummaryHi: struggles?.rootExplanationHi || `हाल के समय में आई रुकावटें ${currentMaha}-${currentAntar} दशा चक्र के अंतर्गत एक आवश्यक कर्म मंथन हैं, जो आपको अधिक सक्षम और परिपक्व बनाने के लिए आई हैं।`,
      sections: [
        {
          heading: 'Why Have You Faced Delays & Setbacks?',
          headingHi: 'विगत समय में असफलताएं और विलंब क्यों हुए?',
          content: struggles?.rootExplanation || `Planetary transits like Saturn Sade Sati or intense sub-periods temporarily slow down outward momentum. This is not a curse—it is a cosmic calibration asking you to upgrade your methods, eliminate distractions, and master emotional self-control.`,
          contentHi: struggles?.rootExplanationHi || `शनि गोचर अथवा कठिन अंतर्दशा के कारण बाह्य प्रगति धीमी हो जाती है। यह समय आत्म-सुधार और अनावश्यक भटकाव को समाप्त करने का है।`,
          highlights: struggles?.activeCauses?.map((c: any) => `${c.title}: ${c.explanation}`) || [
            `Active ${currentMaha}-${currentAntar} consolidation cycle`,
            'Karmic testing designed to forge unshakeable discipline',
          ],
          highlightsHi: struggles?.activeCauses?.map((c: any) => `${c.titleHi || c.title}: ${c.explanationHi || c.explanation}`) || [
            `${currentMaha}-${currentAntar} दशा का आंतरिक प्रभाव`,
            'धैर्य और अनुशासन की परीक्षा का समय',
          ],
        },
        {
          heading: 'When Does the Tough Phase End? (Light at the End of the Tunnel)',
          headingHi: 'यह कठिन समय कब समाप्त होगा? (राहत का समय)',
          content: struggles?.reliefTimelineSummary || `The peak friction begins lifting after ${struggles?.reliefDate || 'the upcoming sub-period transition'}, paving the way for clearer momentum, new breakthroughs, and renewed confidence.`,
          contentHi: struggles?.reliefTimelineSummaryHi || `ग्रह दशा में परिवर्तन (लगभग ${struggles?.reliefDate || 'आगामी समय'}) के साथ स्थितियां पुनः अनुकूल होंगी और रुके हुए कार्यों में गति आएगी।`,
        },
        {
          heading: 'Your Actionable Sattvic Protocol & Remedies',
          headingHi: 'व्यावहारिक एवं सात्विक मार्गदर्शन (उपाय)',
          content: struggles?.actionProtocol
            ? struggles.actionProtocol.map((p: any, idx: number) => `${idx + 1}. **${p.title}:** ${p.description}`).join('\n\n')
            : '1. **Morning Discipline:** 10 minutes of Surya Namaskar and hydration.\n2. **Financial Prudence:** Avoid speculative gambles during sub-period consolidation.\n3. **Selfless Action:** Weekly seva and Anulom-Vilom breathwork.',
          contentHi: struggles?.actionProtocol
            ? struggles.actionProtocol.map((p: any, idx: number) => `${idx + 1}. **${p.titleHi || p.title}:** ${p.descriptionHi || p.description}`).join('\n\n')
            : '1. **प्रातः अनुशासन:** 10 मिनट सूर्य नमस्कार व ध्यान।\n2. **वित्तीय संयम:** अनियोजित जोखिम भरे निर्णयों से बचें।\n3. **सात्विक सेवा:** सप्ताह में एक दिन सेवा भाव व प्राणायाम करें।',
        },
      ],
      astrologicalEvidenceSummary: `Evaluation of Sade Sati, active ${currentMaha}-${currentAntar} sub-period, and 6th/8th/12th transit pressure matrix.`,
      astrologicalEvidenceSummaryHi: `शनि गोचर, साढ़े साती तथा वर्तमान ${currentMaha}-${currentAntar} दशा का सूक्ष्म विश्लेषण।`,
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
