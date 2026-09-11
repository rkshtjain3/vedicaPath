'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateSign: (signName?: string, lang?: Language) => string;
  translatePlanet: (planetName?: string, lang?: Language) => string;
  translateDomain: (domainKey?: string, lang?: Language) => string;
  translateDomainState: (state?: string, lang?: Language) => string;
  translateNakshatra: (nakshatraName?: string, lang?: Language) => string;
  translateDignity: (dignity?: string, lang?: Language) => string;
  translateStrength: (level?: string, lang?: Language) => string;
  translateRelationship: (rel?: string, lang?: Language) => string;
}

export const ZODIAC_MAP_HI: Record<string, string> = {
  Aries: 'मेष (Aries)',
  Taurus: 'वृषभ (Taurus)',
  Gemini: 'मिथुन (Gemini)',
  Cancer: 'कर्क (Cancer)',
  Leo: 'सिंह (Leo)',
  Virgo: 'कन्या (Virgo)',
  Libra: 'तुला (Libra)',
  Scorpio: 'वृश्चिक (Scorpio)',
  Sagittarius: 'धनु (Sagittarius)',
  Capricorn: 'मकर (Capricorn)',
  Aquarius: 'कुम्भ (Aquarius)',
  Pisces: 'मीन (Pisces)',
};

export const PLANET_MAP_HI: Record<string, string> = {
  Sun: 'सूर्य (Sun)',
  Moon: 'चन्द्र (Moon)',
  Mars: 'मंगल (Mars)',
  Mercury: 'बुध (Mercury)',
  Jupiter: 'गुरु / बृहस्पति (Jupiter)',
  Venus: 'शुक्र (Venus)',
  Saturn: 'शनि (Saturn)',
  Rahu: 'राहु (Rahu)',
  Ketu: 'केतु (Ketu)',
};

export const DOMAIN_MAP_HI: Record<string, string> = {
  CAREER: 'आजीविका एवं करियर (Career & Vocation)',
  WEALTH: 'धन एवं आर्थिक समृद्धि (Wealth & Assets)',
  RELATIONSHIPS: 'संबंध एवं दांपत्य (Relationships & Marriage)',
  HEALTH: 'स्वास्थ्य एवं जीवनी शक्ति (Health & Vitality)',
  EDUCATION: 'विद्या एवं बौद्धिक क्षमता (Education & Intellect)',
  PROPERTY: 'संपत्ति एवं गृहसुख (Property & Real Estate)',
  SPIRITUALITY: 'अध्यात्म एवं धर्म (Spirituality & Dharma)',
};

export const STATE_MAP_HI: Record<string, string> = {
  STRONGLY_SUPPORTIVE: 'अत्यधिक अनुकूल (Strongly Supportive)',
  SUPPORTIVE: 'अनुकूल (Supportive)',
  MIXED: 'संतुलित / मिश्रित (Balanced / Mixed)',
  CHALLENGING: 'सावधानी आवश्यक (Requires Care)',
  STRONGLY_CHALLENGING: 'विशेष सतर्कता (High Vigilance)',
  BASELINE: 'सामान्य स्तर (Baseline)',
};

export const DIGNITY_MAP_HI: Record<string, string> = {
  EXALTED: 'उच्च (Exalted)',
  DEBILITATED: 'नीच (Debilitated)',
  OWN_SIGN: 'स्वराशि (Own Sign)',
  MOOLATRIKONA: 'मूलत्रिकोण (Moolatrikona)',
  GREAT_FRIEND: 'अधिमित्र राशि (Great Friend)',
  FRIENDLY: 'मित्र राशि (Friendly)',
  FRIEND: 'मित्र (Friend)',
  NEUTRAL: 'सम राशि (Neutral)',
  ENEMY: 'शत्रु राशि (Enemy)',
  BITTER_ENEMY: 'अधिशत्रु राशि (Bitter Enemy)',
  GREAT_ENEMY: 'अधिशत्रु राशि (Great Enemy)',
};

export const STRENGTH_LEVEL_MAP_HI: Record<string, string> = {
  VERY_STRONG: 'अति बली (Very Strong)',
  STRONG: 'बली (Strong)',
  MODERATE: 'मध्यम (Moderate)',
  WEAK: 'दुर्बल (Weak)',
  VERY_WEAK: 'अति दुर्बल (Very Weak)',
};

export const RELATIONSHIP_MAP_HI: Record<string, string> = {
  GREAT_FRIEND: 'अधिमित्र (Great Friend)',
  FRIEND: 'मित्र (Friend)',
  NEUTRAL: 'सम (Neutral)',
  ENEMY: 'शत्रु (Enemy)',
  BITTER_ENEMY: 'अधिशत्रु (Bitter Enemy)',
  GREAT_ENEMY: 'अधिशत्रु (Great Enemy)',
};

export const NAKSHATRA_MAP_HI: Record<string, string> = {
  Ashwini: 'अश्विनी',
  Bharani: 'भरणी',
  Krittika: 'कृत्तिका',
  Rohini: 'रोहिणी',
  Mrigashira: 'मृगशिरा',
  Ardra: 'आर्द्रा',
  Punarvasu: 'पुनर्वसु',
  Pushya: 'पुष्य',
  Ashlesha: 'आश्लेषा',
  Magha: 'मघा',
  'Purva Phalguni': 'पूर्वाफाल्गुनी',
  'Uttara Phalguni': 'उत्तराफाल्गुनी',
  Hasta: 'हस्त',
  Chitra: 'चित्रा',
  Swati: 'स्वाति',
  Vishakha: 'विशाखा',
  Anuradha: 'अनुराधा',
  Jyeshtha: 'ज्येष्ठा',
  Mula: 'मूल',
  'Purva Ashadha': 'पूर्वाषाढ़ा',
  'Uttara Ashadha': 'उत्तराषाढ़ा',
  Shravana: 'श्रवण',
  Dhanishta: 'धनिष्ठा',
  Shatabhisha: 'शतभिषा',
  'Purva Bhadrapada': 'पूर्वभाद्रपद',
  'Uttara Bhadrapada': 'उत्तरभाद्रपद',
  Revati: 'रेवती',
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.title': 'VEDICAPATH',
    'app.subtitle': 'Your Personal Vedic Life Compass — Clear, empowering guidance and cosmic timing, free from fear, superstition, and gatekeeping.',
    'app.phase_tag': '✨ 100% Deterministic • Zero Superstition',
    'app.benchmark_link': 'Benchmark Suite',
    'app.superstition_btn': 'Superstition-Free Jyotish',
    
    'form.header': 'Birth Parameters',
    'form.full_name': 'Full Name',
    'form.optional': 'optional',
    'form.full_name_help': 'Optional. Used for profile identification and name-based numerology. It does not affect planetary or astrology calculations.',
    'form.birth_date': 'Birth Date',
    'form.birth_time': 'Birth Time',
    'form.country': 'Country',
    'form.birth_city': 'Birth City',
    'form.birth_city_placeholder': 'Type city name (e.g. Panipat, New York, London)...',
    'form.selected_location': 'Selected Birth Location',
    'form.advanced_location': 'Advanced Location Details & Manual Override',
    'form.use_manual_coords': 'Use Manual Coordinates',
    'form.calculate': '[ CALCULATE BIRTH CHART ]',
    'form.calculating': 'Calculating Chart...',

    // Sample Archetypes
    'sample.title': '1-Click Archetype Profiles:',
    'sample.jobs': '💡 Tech Visionary (Steve Jobs)',
    'sample.kalam': '🚀 Dharma & Science (Dr. APJ Kalam)',
    'sample.contemporary': '👤 Contemporary Seeker (Rakshit)',

    // Mode Switcher
    'mode.compass': 'Life Compass',
    'mode.observatory': '🔭 Astrological Observatory (Advanced)',
    'mode.badge_compass': 'Personal Guidance',
    'mode.badge_observatory': 'Technical Research & Ephemeris',

    // Primary Compass Tabs
    'tabs.storybook': '📖 LIFE STORYBOOK',
    'tabs.life_navigator': '✨ LIFE NAVIGATOR',
    'tabs.ask_vedica': '💬 ASK VEDICA',
    'tabs.timeline': '⏳ COSMIC SEASONS & TIMELINE',
    'tabs.birth_chart': '🧭 BIRTH CHART',
    'tabs.transits': '🪐 GOCHAR / TRANSITS',
    'tabs.codex': '📖 JARGON BUSTER',
    'tabs.personal_report': '📄 PERSONAL REPORT',

    // Advanced Technical Observatory Tabs
    'tabs.positions': '1. Planetary Positions',
    'tabs.facts_yogas': '2. Facts & Yogas',
    'tabs.divisional': '3. Divisional Charts (D1-D60)',
    'tabs.strength': '4. Shadbala 6-Fold Strength',
    'tabs.ashtakavarga': '5. Ashtakavarga SAV / BAV',
    'tabs.rules': '6. Classical Rules & D10',
    'tabs.timing_transits': '7. Timing Windows',
    'tabs.insights': '8. Insights Matrix',
    'tabs.dasha': '9. Vimshottari Tree',
    'tabs.numerology': '10. Numerology Audit',
    'tabs.yogas': 'Classical Yogas Engine',
    'tabs.life_analysis': 'Life Domain Raw Engine',

    // Hero Trio & Cosmic Season
    'life.rising_sign': 'Rising Sign (Lagna) • Life Path',
    'life.rising_desc': 'Worldly outlook, personality foundation & physical blueprint',
    'life.moon_sign': 'Moon Sign (Rashi) • Mind & Instinct',
    'life.moon_desc': 'Subconscious emotional nature, instinctive reactions & feeling body',
    'life.sun_sign': 'Sun Sign • Soul Purpose',
    'life.sun_desc': 'Core vitality, leadership capacity & conscious willpower',
    'life.active_season': 'Current Active Cosmic Season',
    'life.lean_into': 'What to Lean Into',
    'life.mindful_moderate': 'What to Mindfully Moderate',
    'life.view_timeline': 'View Full 120-Year Timeline',
    'life.active_timeline': 'Active Timeline',
    'life.nakshatra_pada': 'Pada',

    // Life Crossroads Cards
    'life.domains_title': 'The 7 Core Life Crossroads',
    'life.domains_subtitle': 'Plain-English evaluation of your key life domains based on classical Vedic house and planetary configurations. Filter by support level:',
    'life.filter_all': 'All Domains',
    'life.filter_supportive': 'Supportive',
    'life.filter_challenging': 'Requires Care',
    'life.balance_title': 'Support vs. Friction Balance',
    'life.support_label': 'Support',
    'life.friction_label': 'Friction',
    'life.takeaways_title': 'Real-Life Takeaway',
    'life.superpowers_title': 'Superpowers (Cosmic Strengths)',
    'life.watchouts_title': 'Mindful Watchouts',
    'life.ask_btn': 'Ask Vedica',
    'life.proof_btn': 'Astrological Proof',
    'life.proof_modal_title': 'Astrological Proof & Evidentiary Trace',
    'life.proof_modal_sub': 'Zero black-box assertions. Every takeaway is strictly derived from classical Vedic planetary configurations.',
    'life.proof_confidence': 'Calculation Confidence',
    'life.proof_conditions': 'Evaluated Classical Rules & House Lords',
    'life.proof_close': 'Close Proof Explorer',

    // Habit Tracker
    'habits.title': 'Daily Sattvic Life Alignment Tracker',
    'habits.badge': 'Authentic Daily Remedies',
    'habits.streak': 'Day Habit Streak',
    'habits.subtitle': 'Classical Vedic remedies are not expensive commercial rituals. They are daily lifestyle habits that recalibrate your neurochemical and psychological frequency.',
    'habits.today': "Today's Alignment",
    'habits.complete': 'Complete',
    'habits.reset': 'Reset Today',
    'habits.privacy': 'Habit data is saved locally on your device for complete privacy.',
    'habits.h1_title': 'Solar Circadian Alignment',
    'habits.h1_desc': '15 minutes of early morning sunlight within 1 hour of waking. Activates dopamine, sets circadian clock, and harmonizes natural vitality.',
    'habits.h1_pillar': 'Sun (Surya) • Core Vitality & Leadership',
    'habits.h2_title': 'Lunar Mind Breathwork (Pranayama)',
    'habits.h2_desc': '10 minutes of gentle alternate nostril breathing. Calms the autonomic nervous system, quiets mental chatter, and stabilizes emotional reactions.',
    'habits.h2_pillar': 'Moon (Chandra) • Emotional Equilibrium',
    'habits.h3_title': 'Conscious Seva or Ethical Deed',
    'habits.h3_desc': 'Voluntary act of service, checking on someone in need, or feeding birds/animals. Directly neutralizes karmic friction through humility and generosity.',
    'habits.h3_pillar': 'Saturn (Shani) • Karma Yoga & Humility',
    'habits.h4_title': 'Subconscious Release & Digital Curfew',
    'habits.h4_desc': 'Disengaging screens 45 min before sleep, quiet gratitude journaling, and breathing into restful sleep to clear subconscious residues.',
    'habits.h4_pillar': '12th House & Ketu • Deep Mental Rejuvenation',

    // Upayas (Lifestyle Alignment)
    'upayas.badge': 'Sattvic Lifestyle Alignment (Upayas)',
    'upayas.title': 'Harmonize Your Energy — Practical & Ethical Living',
    'upayas.subtitle': 'Classical Vedic astrology emphasizes conscious conduct (*Niyama*), mindfulness (*Dhyāna*), and selfless service (*Seva*). No superstition, fear-mongering, or expensive rituals.',
    'upayas.c1_title': '1. Morning Solar & Physical Rhythm',
    'upayas.c1_desc': 'Step outside within 1 hour of sunrise for 10 minutes of direct sunlight. Practice 5 rounds of gentle Sun Salutations or rhythmic walking to awaken physical vitality and align circadian cycles.',
    'upayas.c1_tag': 'Surya & Mars Alignment',
    'upayas.c2_title': '2. Evening Mind Stillness & Breathwork',
    'upayas.c2_desc': 'Dedicate 8–10 minutes in the evening to alternate nostril breathing (*Nadi Shodhana*). Disconnect from digital screens 45 minutes prior to sleep to soothe the nervous system and quiet mental turbulence.',
    'upayas.c2_tag': 'Chandra & Mercury Alignment',
    'upayas.c3_title': '3. Ethical Giving & Karma Harmony',
    'upayas.c3_desc': 'Contribute modest regular service: mentor a student (aligns Jupiter/Mercury), feed birds or stray animals (aligns Saturn/Rahu), and practice punctuality and humility in daily communication.',
    'upayas.c3_tag': 'Jupiter & Saturn Alignment',

    // Ask Vedica Tab
    'ask.title': 'Ask Vedica',
    'ask.subtitle': 'Ask anything about your life, career, finances, relationships, or timing in plain natural language. Grounded in deterministic classical Vedic rules with zero superstition.',
    'ask.placeholder': 'Ask any question about your life path, career direction, or active timing...',
    'ask.btn': 'Analyze Inquiry',
    'ask.curated_title': 'Curated Life Decision Inquiries',
    'ask.strength_title': 'Cosmic Strength',
    'ask.moderation_title': 'Mindful Moderation',
    'ask.guidance_title': 'Strategic Guidance',
    'ask.why_btn': 'WHY Trace',

    // Timeline Tab
    'timeline.title': 'Cosmic Seasons & Life Cycles',
    'timeline.subtitle': 'Understand the macro chapters, sub-periods, and active planetary weather shaping your current life phase.',
    'timeline.map_title': '120-Year Vimshottari Life Map',
    'timeline.you_are_here': 'YOU ARE HERE',
    'timeline.weather_title': 'Active Planetary Weather Forecast (Transits Overlay)',
    'timeline.mahadasha': 'Major Life Chapter (Mahadasha)',
    'timeline.antardasha': 'Active Sub-Season (Antardasha)',
    'timeline.pratyantardasha': 'Immediate Focus (Pratyantardasha)',

    // Birth Chart Tab
    'chart.title': 'Birth Chart (Kundali)',
    'chart.subtitle': 'Accurate astronomical coordinates calculated using high-precision Swiss Ephemeris.',
    'chart.north': 'North Indian Style',
    'chart.south': 'South Indian Style',
    'chart.placements': 'Chart Placements',

    // Personal Report
    'report.title': 'Unified Personal Astrology & Numerology Report',
    'report.subtitle': 'Comprehensive deterministic analysis & printable report export',
    'report.print_btn': 'PRINT PERSONAL REPORT',
    'report.sec1': '1. Profile Summary',
    'report.sec2': '2. Calculation Configuration & Astronomical Environment',
    'report.sec3': '3. D1 Rashi Birth Chart Diagram & Placements',
    'report.sec4': '4. Divisional Charts (D9 Navamsa & D10 Dashamsa)',
    'report.sec5': '5. Planetary Strength & Shadbala Virupas',
    'report.sec6': '6. Classical Yogas',
    'report.sec7': '7. Domain Synthesis Reports (Non-Predictive Evidence)',
    'report.sec8': '8. Vimshottari Dasha & Timing Context',
    'report.sec9': '9. Numerology Synthesis',
    'report.sec10': '10. Calculation Details & Audit Metadata',

    'dashboard.title': 'Cross-Engine Benchmark Dashboard',
    'dashboard.total_cases': 'Total Cases',
    'dashboard.validated': 'Validated (PASS)',
    'dashboard.mismatches': 'Mismatches (FAIL)',
    'dashboard.not_validated': 'Not Validated',
    'dashboard.legacy_tool': 'Legacy Shadbala Tool',
    'table.id': 'ID',
    'table.category': 'Category',
    'table.title': 'Title',
    'table.status': 'Status',
    'table.actions': 'Actions',
    'table.execute': 'Execute Run'
  },
  hi: {
    'app.title': 'वैदिक पथ (VedicaPath)',
    'app.subtitle': 'आपका व्यक्तिगत वैदिक जीवन दिशा-सूचक — अंधविश्वास व भय से मुक्त, सरल भाषा में स्पष्ट जीवन मार्गदर्शन एवं कालचक्र।',
    'app.phase_tag': '✨ १००% गणितीय प्रमाण • अंधविश्वास मुक्त',
    'app.benchmark_link': 'बेंचमार्क सूट',
    'app.superstition_btn': 'अंधविश्वास-मुक्त ज्योतिष',

    'form.header': 'जन्म विवरण (Birth Parameters)',
    'form.full_name': 'पूरा नाम',
    'form.optional': 'ऐच्छिक',
    'form.full_name_help': 'ऐच्छिक। प्रोफ़ाइल पहचान और नाम-आधारित अंकशास्त्र के लिए उपयोगी। इससे ग्रहों या ज्योतिषीय गणनाओं पर कोई प्रभाव नहीं पड़ता।',
    'form.birth_date': 'जन्म तिथि',
    'form.birth_time': 'जन्म समय',
    'form.country': 'देश',
    'form.birth_city': 'जन्म शहर',
    'form.birth_city_placeholder': 'शहर का नाम लिखें (जैसे: नई दिल्ली, मुंबई, जयपुर)...',
    'form.selected_location': 'चयनित जन्म स्थान',
    'form.advanced_location': 'उन्नत स्थान विवरण एवं मैन्युअल ओवरराइड',
    'form.use_manual_coords': 'मैन्युअल निर्देशांक का प्रयोग करें',
    'form.calculate': '[ जन्म कुण्डली की गणना करें ]',
    'form.calculating': 'कुण्डली की गणना हो रही है...',

    // Sample Archetypes
    'sample.title': 'एक क्लिक में नमूना कुण्डली देखें:',
    'sample.jobs': '💡 तकनीकी नवप्रवर्तक (स्टीव जॉब्स)',
    'sample.kalam': '🚀 वैज्ञानिक व धर्मपरायण (डॉ. कलाम)',
    'sample.contemporary': '👤 समकालीन साधक (रक्षित)',

    // Mode Switcher
    'mode.compass': 'जीवन दिशा-सूचक (मुख्य)',
    'mode.observatory': '🔭 ज्योतिष वेधशाला (उन्नत गणना)',
    'mode.badge_compass': 'व्यक्तिगत मार्गदर्शन',
    'mode.badge_observatory': 'शोध एवं तकनीकी पंचांग',

    // Primary Compass Tabs
    'tabs.storybook': '📖 जीवन गाथा',
    'tabs.life_navigator': '✨ जीवन मार्गदर्शक',
    'tabs.ask_vedica': '💬 वेदिका से पूछें',
    'tabs.timeline': '⏳ कालचक्र एवं जीवन दशा',
    'tabs.birth_chart': '🧭 जन्म कुण्डली',
    'tabs.transits': '🪐 दैनिक गोचर',
    'tabs.codex': '📖 ज्योतिष शब्दकोश',
    'tabs.personal_report': '📄 विस्तृत जीवन रिपोर्ट',

    // Advanced Technical Observatory Tabs
    'tabs.positions': '1. ग्रह स्थिति एवं नक्षत्र',
    'tabs.facts_yogas': '2. तथ्य एवं शास्त्रीय योग',
    'tabs.divisional': '3. वर्ग कुण्डलियाँ (D1-D60)',
    'tabs.strength': '4. षड्बल (६-आयामी ग्रह बल)',
    'tabs.ashtakavarga': '5. अष्टकवर्ग (SAV / BAV)',
    'tabs.rules': '6. शास्त्रीय नियम व दशांश D10',
    'tabs.timing_transits': '7. समय अंतराल',
    'tabs.insights': '8. अंतर्दृष्टि विश्लेषण',
    'tabs.dasha': '9. विंशोत्तरी दशा वृक्ष',
    'tabs.numerology': '10. अंकशास्त्र सम्मिश्रण',
    'tabs.yogas': 'शास्त्रीय योग इंजन',
    'tabs.life_analysis': 'जीवन क्षेत्र विश्लेषण इंजन',

    // Hero Trio & Cosmic Season
    'life.rising_sign': 'लग्न राशि (Rising Sign) • जीवन पथ',
    'life.rising_desc': 'सांसारिक दृष्टिकोण, व्यक्तित्व का आधार एवं शारीरिक रूपरेखा',
    'life.moon_sign': 'चंद्र राशि (Moon Sign) • मन एवं सहज वृत्ति',
    'life.moon_desc': 'अवचेतन भावनात्मक स्वभाव, आंतरिक प्रतिक्रियाएं एवं संवेदनशीलता',
    'life.sun_sign': 'सूर्य राशि (Sun Sign) • आत्मिक संकल्प',
    'life.sun_desc': 'प्राण शक्ति, नेतृत्व सामर्थ्य एवं जाग्रत इच्छाशक्ति',
    'life.active_season': 'वर्तमान सक्रिय ब्रह्मांडीय कालचक्र',
    'life.lean_into': 'सकारात्मक ऊर्जा — इस समय क्या करें',
    'life.mindful_moderate': 'सतर्कता एवं संयम — क्या न करें',
    'life.view_timeline': 'पूर्ण १२०-वर्षीय कालचक्र देखें',
    'life.active_timeline': 'सक्रिय कालचक्र',
    'life.nakshatra_pada': 'पाद',

    // Life Crossroads Cards
    'life.domains_title': 'जीवन के ७ मुख्य आयाम',
    'life.domains_subtitle': 'शास्त्रीय वैदिक भावों एवं ग्रहीय स्थितियों पर आधारित सरल भाषा में विश्लेषण। अनुकूलता स्तर के आधार पर फ़िल्टर करें:',
    'life.filter_all': 'सभी आयाम',
    'life.filter_supportive': 'अनुकूल क्षेत्र',
    'life.filter_challenging': 'सावधानी क्षेत्र',
    'life.balance_title': 'अनुकूलता बनाम अवरोध संतुलन',
    'life.support_label': 'अनुकूल',
    'life.friction_label': 'अवरोध',
    'life.takeaways_title': 'जीवन के लिए व्यावहारिक निष्कर्ष',
    'life.superpowers_title': 'ग्रहीय शक्तियां एवं अनुकूल योग',
    'life.watchouts_title': 'सावधानी एवं धैर्य के क्षेत्र',
    'life.ask_btn': 'वेदिका से पूछें',
    'life.proof_btn': 'शास्त्रीय प्रमाण',
    'life.proof_modal_title': 'शास्त्रीय प्रमाण एवं गणितीय विश्लेषण',
    'life.proof_modal_sub': 'शून्य भ्रम या अंधविश्वास। प्रत्येक निष्कर्ष विशुद्ध शास्त्रीय प्रमाण एवं पराशरीय ग्रहीय नियमों पर आधारित है।',
    'life.proof_confidence': 'गणना विश्वसनीयता स्तर',
    'life.proof_conditions': 'मूल्यांकित शास्त्रीय नियम एवं भावेश',
    'life.proof_close': 'प्रमाण विंडो बंद करें',

    // Habit Tracker
    'habits.title': 'दैनिक सात्विक जीवन संतुलन ट्रैकर',
    'habits.badge': 'प्रामाणिक दैनिक वैदिक उपाय',
    'habits.streak': 'दिन की निरंतरता',
    'habits.subtitle': 'शास्त्रीय वैदिक उपाय कोई महंगे अंधविश्वासी अनुष्ठान नहीं हैं, बल्कि दैनिक जीवनशैली की आदतें हैं जो आपके मानसिक व न्यूरोकेमिकल संतुलन को स्थापित करती हैं।',
    'habits.today': 'आज का संतुलन',
    'habits.complete': 'पूर्ण',
    'habits.reset': 'आज का पुनः सेट करें',
    'habits.privacy': 'सभी डेटा आपकी पूर्ण गोपनीयता के लिए केवल आपके डिवाइस में सुरक्षित रहता है।',
    'habits.h1_title': 'सूर्य नमस्कार एवं प्रातः प्रकाश (Surya Alignment)',
    'habits.h1_desc': 'जागने के १ घंटे के भीतर १५ मिनट प्रातःकालीन सूर्य प्रकाश। डोपामाइन सक्रिय करता है, जैविक घड़ी संतुलित करता है और आत्म-तेज बढ़ाता है।',
    'habits.h1_pillar': 'सूर्य (Surya) • आत्म-तेज, जीवन शक्ति एवं नेतृत्व',
    'habits.h2_title': 'नाड़ी शोधन प्राणायाम (Lunar Breathwork)',
    'habits.h2_desc': '१० मिनट शांत अनुलोम-विलोम प्राणायाम। स्वायत्त तंत्रिका तंत्र को शांत करता है, मानसिक चंचलता घटाता है और भावनात्मक संतुलन लाता है।',
    'habits.h2_pillar': 'चंद्र (Chandra) • भावनात्मक संतुलन एवं शांत मन',
    'habits.h3_title': 'निःस्वार्थ सेवा एवं सदकर्म (Karma Seva)',
    'habits.h3_desc': 'किसी जरूरतमंद की सहायता, पशु-पक्षियों को दाना-पानी या निःस्वार्थ सेवा। विनम्रता व उदारता से प्रारब्ध के घर्षण को शांत करता है।',
    'habits.h3_pillar': 'शनि (Shani) • कर्म योग, विनम्रता एवं त्याग',
    'habits.h4_title': 'रात्रि विश्राम एवं डिजिटल डिटॉक्स (Digital Curfew)',
    'habits.h4_desc': 'सोने से ४५ मिनट पूर्व स्क्रीन बंद, कृतज्ञता स्मरण और शांत ध्यान। अवचेतन के तनाव को विसर्जित कर गहरी नींद प्रदान करता है।',
    'habits.h4_pillar': '१२वां भाव एवं केतु • मानसिक पुनरुत्थान एवं शांति',

    // Upayas (Lifestyle Alignment)
    'upayas.badge': 'सात्विक जीवनशैली अनुकूलन (उपाय)',
    'upayas.title': 'अपनी ऊर्जा को संतुलित करें — व्यावहारिक एवं सात्विक जीवन शैली',
    'upayas.subtitle': 'शास्त्रीय वैदिक ज्योतिष सचेत आचरण (*नियम*), ध्यान (*धारणा*), और निःस्वार्थ सेवा (*सेवा*) पर बल देता है। शून्य अंधविश्वास, भय या महंगे पाखंड।',
    'upayas.c1_title': '१. प्रातः सूर्य एवं शारीरिक लय (Morning Solar Rhythm)',
    'upayas.c1_desc': 'सूर्योदय के १ घंटे के भीतर १० मिनट प्रत्यक्ष धूप में रहें। ५ चक्र सूर्य नमस्कार या प्रातः भ्रमण करें जिससे शारीरिक जीवनी शक्ति जाग्रत हो और जैविक घड़ी संतुलित रहे।',
    'upayas.c1_tag': 'सूर्य एवं मंगल संतुलन',
    'upayas.c2_title': '२. सांध्य मन शांति एवं प्राणायाम (Evening Mind Stillness)',
    'upayas.c2_desc': 'संध्या समय ८-१० मिनट अनुलोम-विलोम (*नाड़ी शोधन*) प्राणायाम करें। सोने से ४५ मिनट पूर्व डिजिटल स्क्रीन बंद करें जिससे तंत्रिका तंत्र शांत रहे और मानसिक चंचलता दूर हो।',
    'upayas.c2_tag': 'चंद्र एवं बुध संतुलन',
    'upayas.c3_title': '३. निःस्वार्थ दान एवं कर्म शुद्धि (Ethical Karma Harmony)',
    'upayas.c3_desc': 'नियमित रूप से सेवा करें: किसी विद्यार्थी का मार्गदर्शन करें (गुरु/बुध अनुकूलन), बेसहारा पशुओं या पक्षियों को भोजन दें (शनि/राहु अनुकूलन), और आचरण में विनम्रता रखें।',
    'upayas.c3_tag': 'गुरु एवं शनि संतुलन',

    // Ask Vedica Tab
    'ask.title': 'वेदिका से पूछें',
    'ask.subtitle': 'अपने जीवन, करियर, वित्त, संबंधों या समय के बारे में स्वाभाविक भाषा में प्रश्न पूछें। शून्य अंधविश्वास, १००% गणितीय प्रमाण।',
    'ask.placeholder': 'अपने करियर, धन, संबंध या अनुकूल समय के बारे में कोई भी प्रश्न पूछें...',
    'ask.btn': 'विश्लेषण करें',
    'ask.curated_title': 'जीवन निर्णयों से जुड़े महत्वपूर्ण प्रश्न',
    'ask.strength_title': 'ग्रहीय अनुकूलता (Cosmic Strength)',
    'ask.moderation_title': 'धैर्य एवं सावधानी (Mindful Moderation)',
    'ask.guidance_title': 'व्यावहारिक मार्गदर्शन (Strategic Guidance)',
    'ask.why_btn': 'गणितीय प्रमाण (WHY Trace)',

    // Timeline Tab
    'timeline.title': 'ब्रह्मांडीय कालचक्र एवं जीवन दशाएं',
    'timeline.subtitle': 'विंशोत्तरी दशा व गोचर के आधार पर अपने जीवन के अध्यायों और समय के प्रवाह को समझें।',
    'timeline.map_title': '१२०-वर्षीय विंशोत्तरी जीवन मानचित्र',
    'timeline.you_are_here': 'वर्तमान समय (YOU ARE HERE)',
    'timeline.weather_title': 'वर्तमान ग्रहीय मौसम (दैनिक गोचर)',
    'timeline.mahadasha': 'प्रमुख जीवन अध्याय (महादशा)',
    'timeline.antardasha': 'सक्रिय उप-दौर (अंतर्दशा)',
    'timeline.pratyantardasha': 'तात्कालिक चरण (प्रत्यंतर्दशा)',

    // Birth Chart Tab
    'chart.title': 'जन्म कुण्डली (Kundali)',
    'chart.subtitle': 'स्विस एफिमरिस के उच्च-सटीक खगोलीय निर्देशांकों पर आधारित प्रामाणिक कुण्डली।',
    'chart.north': 'उत्तर भारतीय पद्धति (North Indian)',
    'chart.south': 'दक्षिण भारतीय पद्धति (South Indian)',
    'chart.placements': 'ग्रह स्थिति एवं भाव',

    // Personal Report
    'report.title': 'एकीकृत व्यक्तिगत ज्योतिष एवं अंकशास्त्र रिपोर्ट',
    'report.subtitle': 'व्यापक शास्त्रीय विश्लेषण एवं प्रिंट योग्य व्यक्तिगत रिपोर्ट',
    'report.print_btn': 'रिपोर्ट प्रिंट करें (PRINT)',
    'report.sec1': '१. जीवन सारांश (Profile Summary)',
    'report.sec2': '२. खगोलीय गणना विन्यास (Calculation Configuration)',
    'report.sec3': '३. लग्न कुण्डली (D1 Birth Chart)',
    'report.sec4': '४. वर्ग कुण्डलियाँ (D9 नवमांश एवं D10 दशांश)',
    'report.sec5': '५. ग्रहीय बल एवं षड्बल (Planetary Strength & Shadbala)',
    'report.sec6': '६. शास्त्रीय योग (Classical Yogas)',
    'report.sec7': '७. जीवन आयाम विश्लेषण (Domain Synthesis)',
    'report.sec8': '८. विंशोत्तरी दशा एवं कालचक्र (Timing Context)',
    'report.sec9': '९. अंकशास्त्र सम्मिश्रण (Numerology Synthesis)',
    'report.sec10': '१०. गणना विवरण एवं ऑडिट (Audit Metadata)',

    'dashboard.title': 'क्रॉस-इंजन बेंचमार्क डैशबोर्ड',
    'dashboard.total_cases': 'कुल मामले',
    'dashboard.validated': 'सत्यापित (पास)',
    'dashboard.mismatches': 'बेमेल (फेल)',
    'dashboard.not_validated': 'सत्यापित नहीं',
    'dashboard.legacy_tool': 'पुराना षड्बल उपकरण',
    'table.id': 'आईडी',
    'table.category': 'श्रेणी',
    'table.title': 'शीर्षक',
    'table.status': 'स्थिति',
    'table.actions': 'कार्रवाई',
    'table.execute': 'निष्पादित करें'
  }
};

export function translateSign(signName?: string, lang: Language = 'en'): string {
  if (!signName) return '';
  if (lang === 'hi') {
    const formatted = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();
    return ZODIAC_MAP_HI[formatted] || ZODIAC_MAP_HI[signName] || signName;
  }
  return signName;
}

export function translatePlanet(planetName?: string, lang: Language = 'en'): string {
  if (!planetName) return '';
  if (lang === 'hi') {
    const formatted = planetName.charAt(0).toUpperCase() + planetName.slice(1).toLowerCase();
    return PLANET_MAP_HI[formatted] || PLANET_MAP_HI[planetName] || planetName;
  }
  return planetName;
}

export function translateDomain(domainKey?: string, lang: Language = 'en'): string {
  if (!domainKey) return '';
  const upper = domainKey.toUpperCase();
  if (lang === 'hi') {
    return DOMAIN_MAP_HI[upper] || domainKey;
  }
  return domainKey;
}

export function translateDomainState(state?: string, lang: Language = 'en'): string {
  if (!state) return '';
  if (lang === 'hi') {
    const upper = state.toUpperCase();
    return STATE_MAP_HI[upper] || STATE_MAP_HI[state] || state;
  }
  return state;
}

export function translateNakshatra(nakshatraName?: string, lang: Language = 'en'): string {
  if (!nakshatraName) return '';
  if (lang === 'hi') {
    if (NAKSHATRA_MAP_HI[nakshatraName]) return NAKSHATRA_MAP_HI[nakshatraName];
    const formatted = nakshatraName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    return NAKSHATRA_MAP_HI[formatted] || nakshatraName;
  }
  return nakshatraName;
}

export function translateDignity(dignity?: string, lang: Language = 'en'): string {
  if (!dignity) return '';
  if (lang === 'hi') {
    const upper = dignity.toUpperCase();
    return DIGNITY_MAP_HI[upper] || dignity;
  }
  return dignity;
}

export function translateStrength(level?: string, lang: Language = 'en'): string {
  if (!level) return '';
  if (lang === 'hi') {
    const upper = level.toUpperCase();
    return STRENGTH_LEVEL_MAP_HI[upper] || level;
  }
  return level;
}

export function translateRelationship(rel?: string, lang: Language = 'en'): string {
  if (!rel) return '';
  if (lang === 'hi') {
    const upper = rel.toUpperCase();
    return RELATIONSHIP_MAP_HI[upper] || rel;
  }
  return rel;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const translateSignHelper = (signName?: string, lang?: Language) => translateSign(signName, lang || language);
  const translatePlanetHelper = (planetName?: string, lang?: Language) => translatePlanet(planetName, lang || language);
  const translateDomainHelper = (domainKey?: string, lang?: Language) => translateDomain(domainKey, lang || language);
  const translateDomainStateHelper = (state?: string, lang?: Language) => translateDomainState(state, lang || language);
  const translateNakshatraHelper = (nakshatraName?: string, lang?: Language) => translateNakshatra(nakshatraName, lang || language);
  const translateDignityHelper = (dignity?: string, lang?: Language) => translateDignity(dignity, lang || language);
  const translateStrengthHelper = (level?: string, lang?: Language) => translateStrength(level, lang || language);
  const translateRelationshipHelper = (rel?: string, lang?: Language) => translateRelationship(rel, lang || language);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateSign: translateSignHelper,
        translatePlanet: translatePlanetHelper,
        translateDomain: translateDomainHelper,
        translateDomainState: translateDomainStateHelper,
        translateNakshatra: translateNakshatraHelper,
        translateDignity: translateDignityHelper,
        translateStrength: translateStrengthHelper,
        translateRelationship: translateRelationshipHelper,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
