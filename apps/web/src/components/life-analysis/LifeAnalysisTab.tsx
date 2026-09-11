'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Coins,
  Heart,
  Activity,
  GraduationCap,
  Home,
  Sparkles,
  Shield,
  HelpCircle,
  Clock,
  Compass,
  AlertTriangle,
  X,
  ChevronRight,
  Layers,
  Sun,
  Moon,
  Zap,
  CheckCircle2,
  Calendar,
  HeartHandshake,
  TrendingUp,
  ShieldCheck,
  Award,
  Filter,
  BookOpen,
} from 'lucide-react';
import { JargonTooltip } from '../glossary/JargonTooltip';
import { SattvicHabitTracker } from './SattvicHabitTracker';
import { useI18n, Language, translateSign } from '../../lib/i18n';

interface LifeAnalysisTabProps {
  lifeDomainAnalysis: any;
  fullName?: string;
  astroData?: any;
  dashaData?: any;
  transitData?: any;
  yogaData?: any;
  onNavigateTab?: (tab: string, queryPrompt?: string) => void;
}

const DOMAIN_ICONS: Record<string, any> = {
  CAREER: Briefcase,
  WEALTH: Coins,
  RELATIONSHIPS: Heart,
  HEALTH: Activity,
  EDUCATION: GraduationCap,
  PROPERTY: Home,
  SPIRITUALITY: Sparkles,
};

const DOMAIN_COLORS: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  CAREER: { border: 'border-indigo-500/40', bg: 'bg-indigo-500/10', text: 'text-indigo-400', glow: 'shadow-indigo-500/10' },
  WEALTH: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'shadow-amber-500/10' },
  RELATIONSHIPS: { border: 'border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-400', glow: 'shadow-rose-500/10' },
  HEALTH: { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  EDUCATION: { border: 'border-sky-500/40', bg: 'bg-sky-500/10', text: 'text-sky-400', glow: 'shadow-sky-500/10' },
  PROPERTY: { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'shadow-purple-500/10' },
  SPIRITUALITY: { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-400', glow: 'shadow-cyan-500/10' },
};

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

function getSadeSatiInfo(moonSignName?: any, transitingSaturnSign?: any, lang: Language = 'en') {
  const safeMoon = typeof moonSignName === 'string' ? moonSignName : moonSignName?.name;
  const saturnSign = typeof transitingSaturnSign === 'string' ? transitingSaturnSign : transitingSaturnSign?.name || 'Pisces';

  if (!safeMoon) {
    return {
      isActive: false,
      phase: 'INACTIVE',
      title: lang === 'hi' ? 'साढ़े साती निष्क्रिय' : 'Sade Sati Inactive',
      badge: lang === 'hi' ? 'स्थिर' : 'STABLE',
      description: lang === 'hi' ? 'आपकी जन्म चंद्र राशि पर वर्तमान में शनि के साढ़े साती गोचर का कोई दबाव नहीं है।' : 'Your Moon sign is not under active Saturn 7.5-year transit pressure.',
      guidance: lang === 'hi' ? 'दैनिक स्थिरता, अध्ययन और नियमित कर्म के लिए उत्तम समय। बड़े व्यवधान की संभावना नहीं है।' : 'Favorable phase for steady routine and continuous compounding without major restructuring.',
    };
  }

  const moonIdx = ZODIAC_SIGNS.indexOf(safeMoon);
  const saturnIdx = ZODIAC_SIGNS.indexOf(saturnSign);

  if (moonIdx === -1 || saturnIdx === -1) {
    return {
      isActive: false,
      phase: 'INACTIVE',
      title: lang === 'hi' ? 'साढ़े साती निष्क्रिय' : 'Sade Sati Inactive',
      badge: lang === 'hi' ? 'स्थिर' : 'STABLE',
      description: lang === 'hi' ? 'शनि वर्तमान में आपकी जन्म चंद्र राशि के प्रभाव क्षेत्र से बाहर भ्रमण कर रहे हैं।' : 'Saturn is currently transiting outside your natal Moon quadrant.',
      guidance: lang === 'hi' ? 'मानसिक शांति, स्वाभाविक प्रगति और ऊर्जा संचय का अनुकूल काल।' : 'A period of mental equilibrium and natural flow.',
    };
  }

  const houseFromMoon = ((saturnIdx - moonIdx + 12) % 12) + 1;

  const trSaturnSign = lang === 'hi' ? translateSign(saturnSign, 'hi') : saturnSign;
  const trSafeMoon = lang === 'hi' ? translateSign(safeMoon, 'hi') : safeMoon;

  if (houseFromMoon === 12) {
    return {
      isActive: true,
      phase: 'RISING',
      title: lang === 'hi' ? 'साढ़े साती: प्रथम चरण (उदय काल)' : 'Sade Sati: Rising Phase (1st Phase)',
      badge: lang === 'hi' ? 'सक्रिय — उदय' : 'ACTIVE — RISING',
      description: lang === 'hi' ? `शनि ${trSaturnSign} में गोचर कर रहे हैं (आपकी चंद्र राशि ${trSafeMoon} से १२वें भाव में)।` : `Saturn is transiting ${saturnSign} (12th from your Moon in ${safeMoon}).`,
      guidance: lang === 'hi' ? 'अनावश्यक जिम्मेदारियों को कम करने, अच्छी नींद को प्राथमिकता देने और बिना किसी भय के आत्म-निरीक्षण करने का समय।' : 'Focus on clearing old commitments, prioritizing quality sleep, and auditing subconscious emotional habits without fear.',
    };
  } else if (houseFromMoon === 1) {
    return {
      isActive: true,
      phase: 'PEAK',
      title: lang === 'hi' ? 'साढ़े साती: द्वितीय चरण (शिखर काल)' : 'Sade Sati: Peak Phase (2nd Phase)',
      badge: lang === 'hi' ? 'सक्रिय — शिखर' : 'ACTIVE — PEAK',
      description: lang === 'hi' ? `शनि सीधे आपकी जन्म चंद्र राशि ${trSafeMoon} के ऊपर गोचर कर रहे हैं।` : `Saturn is directly transiting over your natal Moon in ${safeMoon}.`,
      guidance: lang === 'hi' ? 'मानसिक धैर्य, आत्म-अनुशासन और आंतरिक परिपक्वता का काल। बाहरी दिखावे को छोड़कर सादगी व सत्यनिष्ठा अपनाएं।' : 'A masterclass in emotional resilience and grounded discipline. Simplify daily obligations and let go of external validation.',
    };
  } else if (houseFromMoon === 2) {
    return {
      isActive: true,
      phase: 'SETTING',
      title: lang === 'hi' ? 'साढ़े साती: तृतीय चरण (अस्त काल)' : 'Sade Sati: Setting Phase (3rd Phase)',
      badge: lang === 'hi' ? 'सक्रिय — अस्त' : 'ACTIVE — SETTING',
      description: lang === 'hi' ? `शनि ${trSaturnSign} में गोचर कर रहे हैं (आपकी चंद्र राशि ${trSafeMoon} से दूसरे भाव में)।` : `Saturn is transiting ${saturnSign} (2nd from your Moon in ${safeMoon}).`,
      guidance: lang === 'hi' ? 'पारिवारिक नींव को मजबूत करने और दीर्घकालिक वित्तीय स्थिरता स्थापित करने का समय।' : 'Focus turns toward restructuring family foundations and long-term financial stability as old lessons solidify.',
    };
  }

  return {
    isActive: false,
    phase: 'INACTIVE',
    title: lang === 'hi' ? 'साढ़े साती निष्क्रिय' : 'Sade Sati Inactive',
    badge: lang === 'hi' ? 'स्थिर' : 'STABLE',
    description: lang === 'hi' ? `शनि ${trSaturnSign} में आपकी जन्म चंद्र राशि ${trSafeMoon} से ${houseFromMoon}वें भाव में हैं।` : `Saturn in ${saturnSign} sits in House ${houseFromMoon} from your natal Moon in ${safeMoon}.`,
    guidance: lang === 'hi' ? 'आपकी मानसिक व भावनात्मक स्थिति शनि के प्रत्यक्ष दबाव से मुक्त है। सकारात्मक आदतों को निरंतर बनाए रखें।' : 'Your emotional and psychological foundation is free from peak Saturn pressure. Continue building constructive habits.',
  };
}

function getDashaTheme(mahaLord?: string, antarLord?: string, lang: Language = 'en') {
  const normM = mahaLord ? mahaLord.charAt(0).toUpperCase() + mahaLord.slice(1).toLowerCase() : 'Unknown';
  const normA = antarLord ? antarLord.charAt(0).toUpperCase() + antarLord.slice(1).toLowerCase() : 'Unknown';

  const pairKey = `${normM}-${normA}`;

  const themesEn: Record<string, { title: string; summary: string; leanInto: string; watchOut: string }> = {
    'Mercury-Venus': {
      title: 'Creative Intellect & Strategic Harmony',
      summary: 'A fertile season merging Mercury’s analytical precision with Venus’s creative flair, aesthetic diplomacy, and social grace.',
      leanInto: 'Collaborative projects, written communication, high-value networking, and refining lifestyle aesthetics.',
      watchOut: 'Over-analyzing personal relationships or scattering energy across too many creative ideas.',
    },
    'Mercury-Sun': {
      title: 'Authoritative Expression & High Visibility',
      summary: 'Mercurial intellect receives the illumination of the Sun, conferring clarity of vision and professional assertiveness.',
      leanInto: 'Public presentations, leadership initiatives, publishing, and executive problem-solving.',
      watchOut: 'Ego conflicts in communication; prioritize collaborative listening over proving yourself right.',
    },
    'Mercury-Moon': {
      title: 'Intuitive Intellect & Emotional Synthesis',
      summary: 'Blends logical deduction with emotional intelligence, nurturing imaginative writing and domestic peace.',
      leanInto: 'Creative arts, mentoring, home upgrades, and connecting empathetically with family and peers.',
      watchOut: 'Restless overthinking, mental fatigue, or fluctuating mood swings during high-stress weeks.',
    },
    'Mercury-Mars': {
      title: 'Decisive Action & Technical Drive',
      summary: 'Sharpened intellect backed by martial drive, empowering quick tactical decisions, debate, and execution.',
      leanInto: 'Overcoming technical roadblocks, competitive projects, rigorous physical training, and bold launches.',
      watchOut: 'Impulsive arguments, sharp speech, or rushing through delicate legal/contractual details.',
    },
    'Mercury-Jupiter': {
      title: 'Wisdom, Dharma & Higher Education',
      summary: 'Unites sharp analytical capability with expansive philosophical discernment and moral integrity.',
      leanInto: 'Advanced studies, financial planning, teaching, publishing, and seeking wise counsel.',
      watchOut: 'Overpromising beyond realistic capacity or getting bogged down in dogma.',
    },
    'Mercury-Saturn': {
      title: 'Systematic Precision & Long-Range Mastery',
      summary: 'Mercurial curiosity disciplined by Saturnian endurance, ideal for deep research, coding, and structural building.',
      leanInto: 'Organizing complex workflows, financial audits, building durable foundations, and disciplined routines.',
      watchOut: 'Pessimism, mental stiffness, or delays in expected progress; trust the long compounding arc.',
    },
    'Rahu-Rahu': {
      title: 'Unconventional Ambition & Catalytic Breakthroughs',
      summary: 'A high-velocity cycle dismantling old limitations, catalyzing rapid innovation and bold non-linear expansion.',
      leanInto: 'Venturing into emerging domains, questioning outdated orthodoxies, and daring strategic experimentation.',
      watchOut: 'Impatience, chasing illusions, or over-extending resources without foundational verification.',
    },
    'Rahu-Jupiter': {
      title: 'Expansion Through Wisdom & Global Vision',
      summary: 'Rahu’s daring ambition receives Jupiter’s ethical anchor and strategic counsel, fostering sustainable expansion.',
      leanInto: 'Higher learning, foreign alliances, philosophical growth, and high-impact advisory roles.',
      watchOut: 'Over-optimism; ground high-minded visions in disciplined operational execution.',
    },
    'Rahu-Saturn': {
      title: 'Structural Transformation & Grinding Mastery',
      summary: 'Dynamic tension between Rahu’s drive for rapid breakthroughs and Saturn’s demand for unyielding patience and structural discipline.',
      leanInto: 'Enduring persistence, systematic problem solving, eliminating operational fluff, and building for the decade.',
      watchOut: 'Cynicism, burnout, or resistance to unavoidable structural restructuring.',
    },
    'Rahu-Mercury': {
      title: 'Innovative Intellect & Commercial Breakthroughs',
      summary: 'Electric mental agility and sharp commercial instincts, driving rapid technical adoption, media reach, and negotiating triumphs.',
      leanInto: 'Strategic marketing, digital innovation, technical publishing, and dynamic negotiations.',
      watchOut: 'Mental restlessness, scattered focus, or communicating impulsively under pressure.',
    },
    'Saturn-Saturn': {
      title: 'Foundational Architecture & Enduring Discipline',
      summary: 'The grand architect era: stripping away superficial trivialities to build bedrock character, institutions, and legacy.',
      leanInto: 'Uncompromising integrity, rigorous daily habits, long-term mastery, and patient stewardship.',
      watchOut: 'Perceived loneliness or frustration with slow progress; remember that enduring monuments take time.',
    },
    'Jupiter-Jupiter': {
      title: 'Expansive Dharma & Compounding Wisdom',
      summary: 'A golden chapter of philosophical illumination, ethical compounding, mentorship, and auspicious life blessings.',
      leanInto: 'Philanthropic leadership, investing in enduring wisdom, nurturing family harmony, and guiding others.',
      watchOut: 'Complacency or intellectual dogma; stay curious and receptive to fresh insights.',
    },
  };

  const themesHi: Record<string, { title: string; summary: string; leanInto: string; watchOut: string }> = {
    'Mercury-Venus': {
      title: 'रचनात्मक प्रज्ञा एवं रणनीतिक सामंजस्य (बुध-शुक्र)',
      summary: 'बुध के सूक्ष्म तार्किक विश्लेषण और शुक्र के कलात्मक, राजनयिक व सौंदर्यबोध का सुंदर संगम।',
      leanInto: 'सहयोगात्मक परियोजनाएं, उत्कृष्ट लेखन, प्रभावी नेटवर्किंग एवं जीवनशैली में सुरुचिपूर्ण परिष्कार।',
      watchOut: 'व्यक्तिगत संबंधों में अति-विश्लेषण या एक साथ बहुत से विचारों में ऊर्जा बिखरने से बचें।',
    },
    'Mercury-Sun': {
      title: 'प्रभावशाली अभिव्यक्ति एवं प्रतिष्ठा (बुध-सूर्य)',
      summary: 'बुध की तीक्ष्ण बुद्धि को सूर्य का आत्म-तेज प्राप्त होता है, जिससे कार्यक्षेत्र में स्पष्ट दूरदर्शिता और नेतृत्व मिलता है।',
      leanInto: 'सार्वजनिक प्रस्तुतियाँ, नेतृत्व की पहल, प्रकाशन एवं उच्चस्तरीय समस्या समाधान।',
      watchOut: 'संवाद में अहंकार या हठ; स्वयं को सही सिद्ध करने के स्थान पर दूसरों को धैर्य से सुनें।',
    },
    'Mercury-Moon': {
      title: 'सहज प्रज्ञा एवं भावनात्मक समन्वय (बुध-चंद्र)',
      summary: 'तार्किक क्षमता और भावनात्मक संवेदनशीलता का सुखद मिलन, जो रचनात्मक लेखन और घरेलू शांति को पोषित करता है।',
      leanInto: 'सृजनात्मक कलाएं, परामर्श, गृहसुख में वृद्धि एवं परिवार व मित्रों से आत्मीय जुड़ाव।',
      watchOut: 'अत्यधिक चिंता, मानसिक थकान या तनावपूर्ण दिनों में मूड में उतार-चढ़ाव।',
    },
    'Mercury-Mars': {
      title: 'निर्णायक कर्म एवं तकनीकी ऊर्जा (बुध-मंगल)',
      summary: 'तीक्ष्ण प्रज्ञा और पराक्रमी ऊर्जा का समन्वय, जो त्वरित रणनीतिक निर्णयों और तकनीकी क्रियान्वयन में सफलता देता है।',
      leanInto: 'जटिल तकनीकी चुनौतियों का समाधान, प्रतिस्पर्धी कार्य, शारीरिक व्यायाम एवं नए प्रोजेक्ट्स का शुभारंभ।',
      watchOut: 'जल्दबाजी में विवाद, कटु वाणी या कानूनी/अनुबंध के दस्तावेजों में असावधानी।',
    },
    'Mercury-Jupiter': {
      title: 'ज्ञान, धर्म एवं उच्च अध्ययन (बुध-गुरु)',
      summary: 'विस्तृत दार्शनिक विवेक, नैतिक निष्ठा और विश्लेषणात्मक दक्षता का श्रेष्ठ समन्वय।',
      leanInto: 'उच्च शिक्षा, वित्तीय योजना, अध्यापन, लेखन एवं वरिष्ठ विद्वानों का मार्गदर्शन।',
      watchOut: 'अपनी वास्तविक क्षमता से अधिक वादे करना या अनावश्यक रूढ़िवादिता में उलझना।',
    },
    'Mercury-Saturn': {
      title: 'व्यवस्था, अनुशासन एवं दीर्घकालिक सिद्धि (बुध-शनि)',
      summary: 'बुध की जिज्ञासा को शनि का धैर्य और अनुशासन मिलता है, जो गहन शोध, कोडिंग और स्थायी संरचनाओं के लिए सर्वोत्तम है।',
      leanInto: 'जटिल कार्यप्रणाली का संगठन, वित्तीय अंकेक्षण, मजबूत नींव का निर्माण एवं अनुशासित दिनचर्या।',
      watchOut: 'नकारात्मक सोच, मानसिक कठोरता या धीमी प्रगति से निराशा; समय के साथ होने वाले स्थायी लाभ पर भरोसा रखें।',
    },
    'Rahu-Rahu': {
      title: 'अपरंपरागत महत्वाकांक्षा एवं तीव्र परिवर्तन (राहु-राहु)',
      summary: 'पुरानी सीमाओं को तोड़कर नई राह बनाने का अत्यंत गतिशील काल, जो नवाचार और अप्रत्याशित विस्तार लाता है।',
      leanInto: 'नए क्षेत्रों में साहसपूर्ण कदम उठाना, पुरानी रूढ़ियों को चुनौती देना और रणनीतिक प्रयोग।',
      watchOut: 'अधीरता, भ्रम या बिना प्रामाणिक जांच के संसाधनों को दांव पर लगाने से बचें।',
    },
    'Rahu-Jupiter': {
      title: 'ज्ञान, विस्तार एवं वैश्विक दृष्टिकोण (राहु-गुरु)',
      summary: 'राहु की महत्वाकांक्षा को गुरु का नैतिक मार्गदर्शन व विवेक प्राप्त होता है, जो संतुलित और स्थायी प्रगति देता है।',
      leanInto: 'उच्च अध्ययन, दूरगामी योजनाएं, दार्शनिक चिंतन एवं समाजोपयोगी नेतृत्व।',
      watchOut: 'अति-उत्साह में व्यावहारिक धरातल न भूलें; अपने विचारों को अनुशासित क्रियान्वयन से जोड़ें।',
    },
    'Rahu-Saturn': {
      title: 'संरचनात्मक परिवर्तन एवं कर्म-साधना (राहु-शनि)',
      summary: 'राहु की तीव्र प्रगति की चाह और शनि के धैर्य व अनुशासन का द्वंद्वात्मक समन्वय, जो स्थायी सफलता गढ़ता है।',
      leanInto: 'धैर्यपूर्ण परिश्रम, व्यवस्थित समस्या निवारण, अनावश्यक दिखावे का त्याग और दीर्घकालिक दृष्टिकोण।',
      watchOut: 'निराशा, अत्यधिक थकान या स्वाभाविक संरचनात्मक बदलावों के प्रति हठधर्मिता।',
    },
    'Rahu-Mercury': {
      title: 'नवाचार, तीव्र बुद्धि एवं व्यावसायिक सफलता (राहु-बुध)',
      summary: 'विद्युत जैसी तीव्र बौद्धिक प्रज्ञा और व्यावसायिक कौशल, जो आधुनिक तकनीक और कूटनीतिक संवाद में अभूतपूर्व बढ़त देता है।',
      leanInto: 'रणनीतिक योजनाएं, डिजिटल नवाचार, प्रभावी संचार और महत्वपूर्ण वाणिज्यिक सौदे।',
      watchOut: 'मानसिक अशांति, बिखरती एकाग्रता या जल्दबाजी में दिए गए बयानों से बचें।',
    },
    'Saturn-Saturn': {
      title: 'स्थायी नींव निर्माण एवं कर्मठ अनुशासन (शनि-शनि)',
      summary: 'महान व्यवस्थापक का काल: सतही आडंबरों को हटाकर चरित्र, संस्था और स्थायी जीवन-मूल्यों का निर्माण।',
      leanInto: 'अडिग सत्यनिष्ठा, कठोर दैनिक नियम, कर्मठता और उत्तरदायित्व का पूर्ण निर्वहन।',
      watchOut: 'धीमी प्रगति से हताश न हों; याद रखें कि कालजयी कृतियां समय और धैर्य से ही बनती हैं।',
    },
    'Jupiter-Jupiter': {
      title: 'धर्म, ज्ञान एवं सर्वांगीण सौभाग्य (गुरु-गुरु)',
      summary: 'दार्शनिक प्रबोधन, नैतिक उत्थान, मार्गदर्शन और जीवन में शुभता व सम्मान का स्वर्णिम कालखंड।',
      leanInto: 'सद्कर्म, ज्ञानार्जन, परिवार में सद्भाव और दूसरों का निःस्वार्थ मार्गदर्शन।',
      watchOut: 'अहंकार या रूढ़िवादिता से बचें; सदैव विनम्र और सीखने के लिए तत्पर रहें।',
    },
  };

  if (lang === 'hi') {
    if (themesHi[pairKey]) return themesHi[pairKey];
    const devanagariPlanets: Record<string, string> = {
      Sun: 'सूर्य',
      Moon: 'चन्द्र',
      Mars: 'मंगल',
      Mercury: 'बुध',
      Jupiter: 'गुरु',
      Venus: 'शुक्र',
      Saturn: 'शनि',
      Rahu: 'राहु',
      Ketu: 'केतु',
    };
    const hiM = devanagariPlanets[normM] || normM;
    const hiA = devanagariPlanets[normA] || normA;
    return {
      title: `${hiM} महादशा • ${hiA} अंतर्दशा`,
      summary: `${hiM} के मूल स्वभाव का प्रभाव ${hiA} के विशिष्ट माध्यम से जीवन में सक्रिय है। यह समय प्राथमिकताओं को व्यवस्थित करने और विवेकपूर्ण कर्म का है।`,
      leanInto: `${hiM} की शक्तियों का सदुपयोग करें और ${hiA} के विवेक व संतुलन का समन्वय रखें।`,
      watchOut: 'प्राथमिकताओं को बिखरने न दें; जीवन के १-२ मुख्य लक्ष्यों पर एकाग्र रहें।',
    };
  }

  if (themesEn[pairKey]) {
    return themesEn[pairKey];
  }

  return {
    title: `${normM} Mahadasha • ${normA} Sub-Period`,
    summary: `Active planetary focus governed by the primary archetype of ${normM} illuminated through the specific lens of ${normA}.`,
    leanInto: `Focusing on ${normM}'s core strengths while exercising ${normA}'s diplomatic and discerning qualities.`,
    watchOut: 'Scattered priorities; anchor your attention on 1-2 primary life objectives.',
  };
}

function getHumanizedDomainTakeaway(key: string, state: string, lang: Language = 'en') {
  const isSupportive = state.includes('SUPPORTIVE');
  const isChallenging = state.includes('CHALLENGING');

  if (lang === 'hi') {
    const contentHi: Record<string, { summary: string; superpower: string; watchout: string; query: string }> = {
      CAREER: {
        summary: isSupportive
          ? 'दशम भाव की मजबूती एवं उच्च कार्यक्षमता के कारण आपकी आजीविका का मार्ग सुदृढ़ है। जब आपको स्वतंत्र जिम्मेदारी और रणनीतिक कार्य मिलता है, तब आप श्रेष्ठ परिणाम देते हैं।'
          : isChallenging
          ? 'करियर में निरंतर धैर्य और कौशल संवर्धन की आवश्यकता है। समय-समय पर होने वाले परिवर्तन आपको उच्च प्रशासनिक परिपक्वता के लिए तैयार करते हैं।'
          : 'संतुलित आजीविका आधार। स्वतंत्र पहल और सहकर्मियों के साथ समन्वय से सतत प्रगति सुनिश्चित होती है।',
        superpower: 'स्वाभाविक रणनीतिक धैर्य एवं जटिल प्रशासनिक जिम्मेदारियों को संभालने का सामर्थ्य।',
        watchout: 'सूक्ष्म प्रबंधन में उलझने या अधिकारियों के साथ अनावश्यक टकराव से बचें।',
        query: 'मेरी कुण्डली में करियर और आजीविका के श्रेष्ठ मार्ग के क्या संकेत हैं?',
      },
      WEALTH: {
        summary: isSupportive
          ? 'धन संचय और विविध स्रोतों से आय अर्जन के लिए मजबूत ग्रहीय सहयोग। अनुशासित व्यवस्था और दीर्घकालिक योजना से संपदा निरंतर बढ़ती है।'
          : isChallenging
          ? 'वित्तीय स्थिरता के लिए सचेत बजट और अनावश्यक व्यय पर नियंत्रण आवश्यक है। व्यवस्थित बचत आपको मानसिक शांति प्रदान करेगी।'
          : 'संतुलित आर्थिक प्रवाह। आकस्मिक निधि बनाने के साथ-साथ ऐसे कौशलों में निवेश करें जो आपकी आय क्षमता को बढ़ाएं।',
        superpower: 'द्वितीय एवं एकादश भाव का अनुकूल प्रभाव जो स्थिर पूंजी संचय की क्षमता देता है।',
        watchout: 'जल्दबाजी में किए जाने वाले सट्टेबाजी या शॉर्टकट से बचें; परिसंपत्ति सुरक्षा को प्राथमिकता दें।',
        query: 'मेरी कुण्डली में धन लाभ और आर्थिक समृद्धि के क्या योग हैं?',
      },
      RELATIONSHIPS: {
        summary: isSupportive
          ? 'आप संबंधों में बौद्धिक तालमेल और सच्ची पारदर्शिता को महत्व देते हैं। स्पष्ट और संवेदनशील संवाद आपके रिश्तों को सुदृढ़ एवं मधुर बनाए रखता है।'
          : isChallenging
          ? 'संबंध आपके भावनात्मक परिपक्वता का दर्पण हैं। धैर्यपूर्वक सुनने और पूर्वाग्रह न रखने से मनमुटाव समय रहते हल हो जाता है।'
          : 'संतुलित वैवाहिक व साझेदारी संकेत। परस्पर सम्मान और समान मूल्यों से संबंध प्रगाढ़ होते हैं।',
        superpower: 'संवेदनशील संवाद और परस्पर बौद्धिक आदर की उच्च क्षमता।',
        watchout: 'साथी के व्यवहार का अति-विश्लेषण करने या अवास्तविक पूर्णता की अपेक्षा करने से बचें।',
        query: 'मेरी कुण्डली में वैवाहिक जीवन एवं संबंधों के बारे में क्या संकेत हैं?',
      },
      HEALTH: {
        summary: isSupportive
          ? 'मजबूत शारीरिक गठन और उत्तम रोग प्रतिरोधक क्षमता। नियमित दिनचर्या और पर्याप्त नींद से आपकी जीवनी शक्ति उच्च बनी रहती है।'
          : isChallenging
          ? 'आपके तंत्रिका तंत्र और ऊर्जा को सचेत विश्राम की आवश्यकता है। निवारक स्वास्थ्य, मानसिक शांति और पौष्टिक आहार पर ध्यान दें।'
          : 'संतुलित प्राकृतिक स्वास्थ्य। नियमित व्यायाम और सात्विक आहार से आपकी ऊर्जा स्थिर रहती है।',
        superpower: 'लग्न और शुभ ग्रहों के प्रभाव से स्वाभाविक शारीरिक सहनशक्ति एवं जीवनी शक्ति।',
        watchout: 'अत्यधिक कार्यभार के दौरान मानसिक तनाव या अनियमित नींद से बचें; विश्राम को प्राथमिकता दें।',
        query: 'मेरी कुण्डली में स्वास्थ्य, रोग प्रतिरोधक क्षमता और ऊर्जा के क्या संकेत हैं?',
      },
      EDUCATION: {
        summary: isSupportive
          ? 'असाधारण बौद्धिक जिज्ञासा और तीव्र ग्रहणशीलता। जटिल, अमूर्त और विश्लेषणात्मक विषयों को सरलता से सीखने की स्वाभाविक प्रतिभा।'
          : isChallenging
          ? 'अध्ययन में तभी सफलता मिलती है जब आप कई विषयों में भटकने के बजाय एक व्यवस्थित पाठ्यक्रम का अनुसरण करें।'
          : 'संतुलित अध्ययन क्षमता। नियमित स्वाध्याय और व्यावहारिक प्रयोग से आपकी बौद्धिक क्षमता निखरती है।',
        superpower: 'विविध ज्ञान का त्वरित संश्लेषण एवं तार्किक समस्या समाधान।',
        watchout: 'एक साथ कई कार्यों में ध्यान भटकने से बचें; एकाग्र अध्ययन के लिए समय सुरक्षित रखें।',
        query: 'मेरी कुण्डली में विद्या, उच्च अध्ययन और बौद्धिक कौशल के क्या संकेत हैं?',
      },
      PROPERTY: {
        summary: isSupportive
          ? 'गृह सुख एवं अचल संपत्ति के लिए अत्यंत अनुकूल संकेत। शांतिपूर्ण, सुरक्षित और समृद्ध घर का निर्माण करने की प्रबल संभावना।'
          : isChallenging
          ? 'संपत्ति संबंधी निर्णयों और गृह सुख के लिए दस्तावेजों की सावधानीपूर्वक जांच और दीर्घकालिक बजट आवश्यक है।'
          : 'स्थिर घरेलू आधार। शांतिपूर्ण रहने का वातावरण बनाएं जो आपके मानसिक संतुलन में सहायक हो।',
        superpower: 'चतुर्थ भाव का अनुकूल प्रभाव एवं स्थायी अचल संपत्तियों में स्थायित्व।',
        watchout: 'दस्तावेजों की गहन समीक्षा किए बिना संपत्ति के मामलों में जल्दबाजी न करें।',
        query: 'मेरी कुण्डली में भूमि, भवन और गृह संपत्ति के क्या योग हैं?',
      },
      SPIRITUALITY: {
        summary: isSupportive
          ? 'गहन आंतरिक नैतिक दिशा-सूचक और स्वाभाविक दार्शनिक दृष्टि। एकांत चिंतन, स्वाध्याय और निष्काम सेवा से आत्मिक संतोष प्राप्त होता है।'
          : isChallenging
          ? 'आध्यात्मिक उन्नति केवल कल्पना में नहीं, बल्कि अपने आदर्शों को दैनिक व्यावहारिक आचरण में उतारने से प्राप्त होगी।'
          : 'संतुलित दार्शनिक जागरूकता। दैनिक कार्यों और संबंधों में सजगता लाने से आंतरिक शांति मिलती है।',
        superpower: 'उच्च ज्ञान, धर्म और नैतिक आत्म-संयम की स्वाभाविक प्रवृत्ति।',
        watchout: 'आध्यात्मिक पलायनवाद या निराशावाद से बचें; अपने ज्ञान को सेवा और सदकर्म में लगाएं।',
        query: 'मेरी कुण्डली में अध्यात्म, धर्म और जीवन के उद्देश्य के क्या संकेत हैं?',
      },
    };

    return contentHi[key] || {
      summary: 'शास्त्रीय वैदिक गणनाओं पर आधारित प्रामाणिक विश्लेषण।',
      superpower: 'अनुकूल ग्रहीय स्थिति।',
      watchout: 'संतुलित व सजग दृष्टिकोण बनाए रखें।',
      query: `मेरी कुण्डली में ${key} के क्या संकेत हैं?`,
    };
  }

  const content: Record<string, { summary: string; superpower: string; watchout: string; query: string }> = {
    CAREER: {
      summary: isSupportive
        ? 'Your vocational path is heavily fortified by high stamina and strong 10th-house alignment. You thrive when given autonomous responsibility, strategic scope, and clear ownership.'
        : isChallenging
        ? 'Career progression requires steady persistence and continuous skill upgrading. Periodic structural transitions prepare you for higher executive maturity.'
        : 'Steady vocational foundation. Balance independent initiative with collaborative stakeholder alignment for predictable progress.',
      superpower: 'Natural strategic endurance and capacity to shoulder complex executive responsibilities.',
      watchout: 'Avoid getting bogged down in micromanagement or premature friction with authority figures.',
      query: 'What does my chart show about my best career path and vocation?',
    },
    WEALTH: {
      summary: isSupportive
        ? 'Robust planetary backing for asset accumulation and diversified income generation. Wealth compounds predictably through disciplined systems and long-term planning.'
        : isChallenging
        ? 'Financial stability calls for conscious budgeting and safeguarding against emotional expenditure. Automated systematic savings yield superior peace of mind.'
        : 'Balanced financial flow. Focus on building an emergency buffer while investing in skillsets that amplify your earning power.',
      superpower: 'Solid 2nd & 11th house factors providing capacity for steady capital accumulation.',
      watchout: 'Resist impulsive speculative shortcuts; prioritize asset protection and disciplined compounding.',
      query: 'What are my wealth indicators and financial accumulation strengths?',
    },
    RELATIONSHIPS: {
      summary: isSupportive
        ? 'You value deep intellectual rapport and authentic transparency in partnerships. Direct, compassionate communication keeps your bonds harmonious and mutually empowering.'
        : isChallenging
        ? 'Partnerships serve as your mirror for emotional maturity. Practicing patient listening and avoiding projection resolves friction before it escalates.'
        : 'Balanced partnership indicators. Relationships thrive on shared philosophical values and mutual autonomy.',
      superpower: 'High capacity for empathetic dialogue and mutual intellectual respect.',
      watchout: 'Guard against over-analyzing a partner’s mood or expecting flawless perfection.',
      query: 'What does my chart reveal about relationships and partnerships?',
    },
    HEALTH: {
      summary: isSupportive
        ? 'Resilient natural constitution and recovery stamina. Your vitality remains high when supported by consistent sleep schedules and balanced daily routines.'
        : isChallenging
        ? 'Your nervous system and vitality benefit from intentional restorative rest. Emphasize preventive care, nervous-system calming, and physical grounding.'
        : 'Balanced constitutional baseline. Regular physical movement and clean nutrition maintain steady vitality.',
      superpower: 'Constitutional stamina from Lagna and vital planetary configurations.',
      watchout: 'Nervous tension or irregular sleep during high-workload phases; prioritize recovery.',
      query: 'What are my constitutional vitality and wellness indicators?',
    },
    EDUCATION: {
      summary: isSupportive
        ? 'Exceptional intellectual curiosity and rapid conceptual grasp. You have a natural talent for mastering complex, abstract, or analytical knowledge domains.'
        : isChallenging
        ? 'Learning thrives when you follow a structured curriculum rather than jumping between scattered interests. Depth over breadth brings mastery.'
        : 'Balanced learning capacity. Consistent reading and practical application unlock your intellectual potential.',
      superpower: 'Quick synthesis of diverse information and analytical problem-solving.',
      watchout: 'Distraction caused by multi-tasking; protect dedicated deep-work blocks.',
      query: 'What does my chart show about education, skills, and learning?',
    },
    PROPERTY: {
      summary: isSupportive
        ? 'Favorable domestic indicators and real-estate stability. High potential for establishing a peaceful, secure, and nurturing home sanctuary.'
        : isChallenging
        ? 'Domestic harmony and property decisions require meticulous verification of paperwork and careful long-range budgeting.'
        : 'Steady domestic foundation. Focus on creating an orderly living space that supports your mental well-being.',
      superpower: '4th house domestic backing and stability in physical fixed assets.',
      watchout: 'Rushing into property commitments without thorough contractual review.',
      query: 'What are my property and home foundation indicators?',
    },
    SPIRITUALITY: {
      summary: isSupportive
        ? 'Deep natural contemplative compass and inner moral anchor. Solitary introspection, philosophical reading, and ethical service bring profound fulfillment.'
        : isChallenging
        ? 'Spiritual growth comes from grounding your ideals into daily practical action rather than seeking escapism.'
        : 'Balanced philosophical awareness. Integrating mindfulness into work and relationships brings inner peace.',
      superpower: 'Natural inclination toward higher wisdom, dharma, and ethical self-mastery.',
      watchout: 'Spiritual bypassing or cynicism; anchor your wisdom in compassionate daily deeds.',
      query: 'What does my chart show about spirituality, dharma, and life purpose?',
    },
  };

  return content[key] || {
    summary: 'Rule-based deterministic synthesis of classical factors.',
    superpower: 'Consistent planetary evidence indicators.',
    watchout: 'Maintain balanced awareness.',
    query: `What does my chart show about ${key.toLowerCase()}?`,
  };
}

export const LifeAnalysisTab: React.FC<LifeAnalysisTabProps> = ({
  lifeDomainAnalysis,
  fullName,
  astroData,
  dashaData,
  transitData,
  yogaData,
  onNavigateTab,
}) => {
  const { t, language, translateSign, translatePlanet, translateDomain, translateDomainState, translateNakshatra } = useI18n();
  const [selectedDomainKey, setSelectedDomainKey] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<
    'OVERVIEW' | 'SUPPORT' | 'CHALLENGE' | 'MIXED' | 'INDICATORS' | 'DASHA' | 'TRANSIT' | 'WHY'
  >('OVERVIEW');
  const [domainFilter, setDomainFilter] = useState<'ALL' | 'SUPPORTIVE' | 'CHALLENGING'>('ALL');

  if (!lifeDomainAnalysis || !lifeDomainAnalysis.domains) {
    return (
      <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-200">{t('life.unavailable_title')}</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          {t('life.unavailable_desc')}
        </p>
      </div>
    );
  }

  const domainKeys = [
    'CAREER',
    'WEALTH',
    'RELATIONSHIPS',
    'HEALTH',
    'EDUCATION',
    'PROPERTY',
    'SPIRITUALITY',
  ];

  const currentMD = dashaData?.current?.mahadasha?.lord;
  const currentAD = dashaData?.current?.antardasha?.lord;
  const dashaTheme = getDashaTheme(currentMD, currentAD, language);

  const moonSign = typeof astroData?.moonSign === 'string' ? astroData.moonSign : (astroData?.moonSign?.name || 'Aries');
  const saturnPlanet = transitData?.planets?.find((p: any) => p.planet === 'Saturn');
  const saturnTransitSign = typeof saturnPlanet?.sign === 'string' ? saturnPlanet.sign : (saturnPlanet?.sign?.name || 'Pisces');
  const sadeSatiInfo = getSadeSatiInfo(moonSign, saturnTransitSign, language);

  const formatDateStr = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string') return val.split('T')[0];
    if (val instanceof Date) return val.toISOString().split('T')[0];
    return String(val);
  };

  const selectedDomain = selectedDomainKey ? lifeDomainAnalysis.domains[selectedDomainKey] : null;
  const SelectedIcon = selectedDomainKey ? DOMAIN_ICONS[selectedDomainKey] || Layers : Layers;

  const getStateBadge = (state: string) => {
    const label = translateDomainState(state);
    switch (state) {
      case 'STRONGLY_SUPPORTIVE':
        return (
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {label}
          </span>
        );
      case 'SUPPORTIVE':
        return (
          <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {label}
          </span>
        );
      case 'MIXED':
        return (
          <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> {label}
          </span>
        );
      case 'CHALLENGING':
        return (
          <span className="bg-rose-900/60 text-rose-300 border border-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Shield className="w-3 h-3 text-rose-400" /> {label}
          </span>
        );
      case 'STRONGLY_CHALLENGING':
        return (
          <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Shield className="w-3 h-3 text-rose-400" /> {label}
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {label}
          </span>
        );
    }
  };

  const filteredDomainKeys = domainKeys.filter((k) => {
    const domain = lifeDomainAnalysis.domains[k];
    if (!domain) return false;
    if (domainFilter === 'ALL') return true;
    if (domainFilter === 'SUPPORTIVE') return domain.state.includes('SUPPORTIVE');
    if (domainFilter === 'CHALLENGING') return domain.state.includes('CHALLENGING') || domain.state === 'MIXED';
    return true;
  });

  return (
    <div className="space-y-8" id="life-navigator-dashboard">
      {/* Highlight Banner to 5-Chapter Life Storybook */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex-shrink-0">
            <BookOpen className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-indigo-400/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {language === 'hi' ? 'विशेष नया अनुभव' : 'Recommended New Experience'}
            </div>
            <div className="text-base font-bold text-white">
              {language === 'hi' ? 'अपनी सम्पूर्ण ५-अध्यायी जीवन गाथा (Life Storybook) पढ़ें' : 'Read Your 5-Chapter Life Storybook'}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {language === 'hi'
                ? 'जीवन उद्देश्य, विस्तृत करियर पथ (नौकरी/व्यापार), मकान एवं विवाह का समय, और विगत बाधाओं का रहस्य।'
                : 'Life Aim, Detailed Career Path (Job vs Business), Home & Marriage Windows, and Overcoming Struggles.'}
            </div>
          </div>
        </div>
        <button
          id="btn-goto-storybook"
          onClick={() => onNavigateTab?.('storybook')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 flex-shrink-0 shadow-lg shadow-indigo-600/30"
        >
          <span>{language === 'hi' ? 'जीवन गाथा खोलें' : 'Open Life Storybook'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Cosmic Identity Trio Banner */}
      {astroData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="life-navigator-hero-trio">
          <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase block">
                <JargonTooltip termId="lagna" fallbackLabel={language === 'hi' ? 'लग्न राशि (Lagna) • जीवन पथ' : 'Rising Sign (Lagna) • Life Path'} />
              </span>
              <p className="text-base font-bold text-slate-100">
                {translateSign(astroData.lagna?.sign?.name, language) || 'Lagna'} <span className="text-xs text-slate-400 font-normal">({astroData.lagna?.sign?.sanskritName || ''})</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {astroData.lagna?.nakshatra?.name ? `${language === 'hi' ? 'नक्षत्र:' : 'Nakshatra:'} ${translateNakshatra(astroData.lagna.nakshatra.name, language)} (${language === 'hi' ? 'पाद' : 'Pada'} ${astroData.lagna.nakshatra.pada || 1})` : t('life.rising_desc')}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase block">
                <JargonTooltip termId="lagna" fallbackLabel={language === 'hi' ? 'चंद्र राशि (Rashi) • मन एवं सहज वृत्ति' : 'Moon Sign (Rashi) • Mind & Instinct'} />
              </span>
              <p className="text-base font-bold text-slate-100">
                {translateSign(astroData.moonSign?.name, language) || 'Moon Sign'} <span className="text-xs text-slate-400 font-normal">({astroData.moonSign?.sanskritName || ''})</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {astroData.birthNakshatra?.name ? `${language === 'hi' ? 'नक्षत्र:' : 'Star:'} ${translateNakshatra(astroData.birthNakshatra.name, language)} (${language === 'hi' ? 'पाद' : 'Pada'} ${astroData.birthNakshatra.pada || 1})` : t('life.moon_desc')}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase block">
                {language === 'hi' ? 'सूर्य राशि • आत्मिक संकल्प' : 'Sun Sign • Soul Purpose'}
              </span>
              <p className="text-base font-bold text-slate-100">
                {translateSign(astroData.planets?.find((p: any) => p.planet === 'Sun')?.sign?.name, language) || 'Sun Sign'}
              </p>
              <p className="text-[11px] text-slate-400">{t('life.sun_desc')}</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Active Life Chapter & Cosmic Weather Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6" id="active-cosmic-season-hero">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {t('life.active_season')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              {dashaTheme.title}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {dashaTheme.summary}
            </p>
          </div>

          {/* Dasha Period Stats Card */}
          {dashaData?.current?.mahadasha && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shrink-0 flex flex-col justify-between gap-3 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('life.active_timeline')}</span>
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                  {translatePlanet(currentMD, language)} • {translatePlanet(currentAD, language)}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'hi' ? 'आरंभ:' : 'Start:'}</span>
                  <span className="text-slate-200 font-mono">{formatDateStr(dashaData.current.antardasha?.start) || formatDateStr(dashaData.current.mahadasha?.start)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'hi' ? 'समाप्ति:' : 'End:'}</span>
                  <span className="text-slate-200 font-mono">{formatDateStr(dashaData.current.antardasha?.end) || formatDateStr(dashaData.current.mahadasha?.end)}</span>
                </div>
              </div>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('timeline')}
                  className="mt-1 text-xs text-center text-indigo-300 hover:text-indigo-200 font-bold flex items-center justify-center gap-1 hover:underline cursor-pointer"
                >
                  {t('life.view_timeline')} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Actionable Focus Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="flex items-start gap-2.5 bg-emerald-950/30 border border-emerald-500/20 p-3.5 rounded-xl">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block mb-0.5 uppercase tracking-wider text-[10px]">{t('life.lean_into')}</span>
              <span className="text-slate-300 leading-relaxed">{dashaTheme.leanInto}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-amber-950/30 border border-amber-500/20 p-3.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5 uppercase tracking-wider text-[10px]">{t('life.mindful_moderate')}</span>
              <span className="text-slate-300 leading-relaxed">{dashaTheme.watchOut}</span>
            </div>
          </div>
        </div>

        {/* Sade Sati & Saturn Transit Reality Check */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl ${sadeSatiInfo.isActive ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'} shrink-0 mt-0.5`}>
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-200 text-sm">
                  <JargonTooltip termId="sade-sati" fallbackLabel={sadeSatiInfo.title} />
                </h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sadeSatiInfo.isActive ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-emerald-950 text-emerald-300 border-emerald-800'}`}>
                  {sadeSatiInfo.badge}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{sadeSatiInfo.guidance}</p>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono shrink-0 sm:text-right">
            <span>{language === 'hi' ? 'शनि गोचर:' : 'Saturn Gochar:'} {translateSign(saturnTransitSign, language)}</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Controls & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            {t('life.domains_title')}
          </h3>
          <p className="text-xs text-slate-400">
            {t('life.domains_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setDomainFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${domainFilter === 'ALL' ? 'bg-indigo-600 text-white shadow font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {t('life.filter_all')}
          </button>
          <button
            type="button"
            onClick={() => setDomainFilter('SUPPORTIVE')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${domainFilter === 'SUPPORTIVE' ? 'bg-emerald-600 text-white shadow font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {t('life.filter_supportive')}
          </button>
          <button
            type="button"
            onClick={() => setDomainFilter('CHALLENGING')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${domainFilter === 'CHALLENGING' ? 'bg-amber-600 text-white shadow font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {t('life.filter_challenging')}
          </button>
        </div>
      </div>

      {/* 4. 7 Life Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="life-crossroads-grid">
        {filteredDomainKeys.map((key) => {
          const domain = lifeDomainAnalysis.domains[key];
          if (!domain) return null;

          const Icon = DOMAIN_ICONS[key] || Layers;
          const colors = DOMAIN_COLORS[key] || {
            border: 'border-slate-800',
            bg: 'bg-slate-900',
            text: 'text-indigo-400',
            glow: '',
          };
          const advice = getHumanizedDomainTakeaway(key, domain.state, language);

          const supportScore = domain.scoring?.supportScore || 0;
          const challengeScore = domain.scoring?.challengeScore || 0;
          const totalScore = supportScore + challengeScore;
          const supportPct = totalScore > 0 ? Math.round((supportScore / totalScore) * 100) : 50;

          return (
            <div
              key={key}
              id={`domain-card-${key.toLowerCase()}`}
              onClick={() => {
                setSelectedDomainKey(key);
                setActiveDetailTab('OVERVIEW');
              }}
              className={`group bg-slate-900/80 hover:bg-slate-900 border ${colors.border} hover:border-indigo-500/60 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-2xl ${colors.glow} cursor-pointer`}
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl ${colors.bg} ${colors.text} border ${colors.border}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">
                        {translateDomain(key, language)}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                        {domain.scoring?.supportCount || 0} {language === 'hi' ? 'अनुकूल कारक' : 'Supportive Factors'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {getStateBadge(domain.state)}
                  <span className="text-[11px] font-mono text-slate-400">
                    {language === 'hi' ? 'विश्वसनीयता:' : 'Confidence:'} <strong className="text-slate-200">{domain.confidence?.level || 'HIGH'}</strong>
                  </span>
                </div>

                {/* Score Ratio Balance Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-emerald-400 font-bold">{t('life.support_label')}: +{supportScore}</span>
                    <span className="text-rose-400 font-bold">{t('life.friction_label')}: -{challengeScore}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${supportPct}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{ width: `${100 - supportPct}%` }}
                    />
                  </div>
                </div>

                {/* Humanized Everyday Advice */}
                <p className="text-slate-300 text-xs leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                  {advice.summary}
                </p>

                {/* Top Superpower & Watchout */}
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2 text-emerald-300">
                    <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{advice.superpower}</span>
                  </div>
                  <div className="flex items-start gap-2 text-amber-300/90">
                    <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{advice.watchout}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {onNavigateTab ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab('query', advice.query);
                    }}
                    className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{t('life.ask_btn')}</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  id={`btn-why-proof-${key.toLowerCase()}`}
                  onClick={() => {
                    setSelectedDomainKey(key);
                    setActiveDetailTab('OVERVIEW');
                  }}
                  className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>{t('life.proof_btn')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Interactive Daily Sattvic Habit Tracker */}
      <SattvicHabitTracker />

      {/* 6. Actionable Sattvic Remedies & Lifestyle Alignment (Upayas) */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5" /> {t('upayas.badge')}
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              {t('upayas.title')}
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {t('upayas.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sun className="w-4 h-4" />
              <span>{t('upayas.c1_title')}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t('upayas.c1_desc')}
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Moon className="w-4 h-4" />
              <span>{t('upayas.c2_title')}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t('upayas.c2_desc')}
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Award className="w-4 h-4" />
              <span>{t('upayas.c3_title')}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t('upayas.c3_desc')}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-start gap-3 text-slate-400 text-xs">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-200">{language === 'hi' ? 'वैदिक पथ संकल्प:' : 'The VedicaPath Guarantee:'}</strong>{' '}
            {language === 'hi'
              ? 'शास्त्रीय पराशरीय सिद्धांत अनुसार जन्म कुण्डली आपका मौसम पूर्वानुमान है, कोई कारागार नहीं। आपका जाग्रत विवेक, आत्म-अनुशासन (पुरुषार्थ) और धर्मसम्मत आचरण ही आपके जीवन के सर्वोच्च नियंता हैं।'
              : 'In true Parashari shastra, your birth chart is a weather forecast, not a prison. Your conscious awareness, disciplined will (Purushartha), and righteous choices (Dharma) are the supreme arbiters of your destiny.'}
          </p>
        </div>
      </div>

      {/* 6. Domain Detail Modal / Deterministic Proof Drawer */}
      {selectedDomainKey && selectedDomain && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div id="proof-drawer-modal" className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${DOMAIN_COLORS[selectedDomainKey]?.bg} ${DOMAIN_COLORS[selectedDomainKey]?.text}`}>
                  <SelectedIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-100">{translateDomain(selectedDomainKey, language)}</h2>
                    {getStateBadge(selectedDomain.state)}
                  </div>
                  <p className="text-slate-400 text-xs">{t('life.proof_modal_sub')}</p>
                </div>
              </div>

              <button
                id="close-domain-modal"
                data-testid="btn-close-proof-modal"
                onClick={() => setSelectedDomainKey(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto text-xs font-semibold">
              {[
                { key: 'OVERVIEW', label: language === 'hi' ? 'अवलोकन' : 'Overview' },
                { key: 'SUPPORT', label: language === 'hi' ? `अनुकूल कारक (${selectedDomain.supportingFactors?.length || 0})` : `Supporting (${selectedDomain.supportingFactors?.length || 0})` },
                { key: 'CHALLENGE', label: language === 'hi' ? `बाधक कारक (${selectedDomain.challengingFactors?.length || 0})` : `Challenging (${selectedDomain.challengingFactors?.length || 0})` },
                { key: 'MIXED', label: language === 'hi' ? 'मिश्रित संकेत' : 'Mixed Signals' },
                { key: 'INDICATORS', label: language === 'hi' ? 'ग्रह कारक' : 'Planetary Indicators' },
                { key: 'DASHA', label: language === 'hi' ? 'दशा संदर्भ' : 'Dasha Context' },
                { key: 'TRANSIT', label: language === 'hi' ? 'गोचर संदर्भ' : 'Transit Context' },
                { key: 'WHY', label: language === 'hi' ? 'गणितीय प्रमाण (WHY)' : 'WHY Evidence' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  id={`domain-tab-${tab.key.toLowerCase()}`}
                  onClick={() => setActiveDetailTab(tab.key as any)}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    activeDetailTab === tab.key
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
              {/* Health Disclaimer Alert */}
              {selectedDomain.disclaimer && (
                <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl flex items-start gap-3 text-amber-200 text-xs">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block mb-0.5">Domain Disclaimer</span>
                    <span>{selectedDomain.disclaimer}</span>
                  </div>
                </div>
              )}

              {activeDetailTab === 'OVERVIEW' && (
                <div className="space-y-6">
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{language === 'hi' ? 'सारांश' : 'Summary'}</h4>
                    <p className="text-slate-200 leading-relaxed">
                      {language === 'hi'
                        ? getHumanizedDomainTakeaway(selectedDomainKey, selectedDomain.state, language).summary
                        : selectedDomain.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[11px]">{language === 'hi' ? 'अनुकूल अंक' : 'Support Score'}</span>
                      <p className="text-emerald-400 text-lg font-bold">+{selectedDomain.scoring?.supportScore}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[11px]">{language === 'hi' ? 'बाधा अंक' : 'Challenge Score'}</span>
                      <p className="text-rose-400 text-lg font-bold">-{selectedDomain.scoring?.challengeScore}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[11px]">{language === 'hi' ? 'विश्वसनीयता स्तर' : 'Confidence Level'}</span>
                      <p className="text-indigo-400 text-lg font-bold">{selectedDomain.confidence?.level}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === 'SUPPORT' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{language === 'hi' ? 'अनुकूल कारक' : 'Supporting Factors'}</h4>
                  {selectedDomain.supportingFactors?.length === 0 ? (
                    <p className="text-slate-500 text-xs italic">{language === 'hi' ? 'इस क्षेत्र के लिए कोई अनुकूल कारक दर्ज नहीं है।' : 'No supporting factors recorded for this domain.'}</p>
                  ) : (
                    selectedDomain.supportingFactors.map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-emerald-400 font-bold">{item.id}</span>
                          <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono">
                            Engine: {item.sourceEngine}
                          </span>
                        </div>
                        <p className="text-slate-200 text-xs">{item.description}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeDetailTab === 'CHALLENGE' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">{language === 'hi' ? 'बाधक कारक' : 'Challenging Factors'}</h4>
                  {selectedDomain.challengingFactors?.length === 0 ? (
                    <p className="text-slate-500 text-xs italic">{language === 'hi' ? 'इस क्षेत्र के लिए कोई बाधक कारक दर्ज नहीं है।' : 'No challenging factors recorded for this domain.'}</p>
                  ) : (
                    selectedDomain.challengingFactors.map((item: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-rose-400 font-bold">{item.id}</span>
                          <span className="bg-rose-950 text-rose-300 text-[10px] px-2 py-0.5 rounded font-mono">
                            Engine: {item.sourceEngine}
                          </span>
                        </div>
                        <p className="text-slate-200 text-xs">{item.description}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeDetailTab === 'MIXED' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{language === 'hi' ? 'मिश्रित संकेत एवं सुरक्षित विरोधाभास' : 'Mixed Signals & Preserved Conflicts'}</h4>
                  <p className="text-xs text-slate-400">
                    {selectedDomain.mixedSignals?.description || (language === 'hi' ? 'विरोधाभासी कारकों को बिना कृत्रिम निरस्तीकरण के सुरक्षित रखा गया है।' : 'Conflicting factors are retained without artificial cancellation.')}
                  </p>
                  {selectedDomain.mixedSignals?.conflictingPairs?.map((pair: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">{language === 'hi' ? 'अनुकूल कारक' : 'Support Factor'}</span>
                        <p className="text-slate-300 text-xs">{pair.support?.description}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-rose-400 uppercase">{language === 'hi' ? 'बाधक कारक' : 'Challenge Factor'}</span>
                        <p className="text-slate-300 text-xs">{pair.challenge?.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeDetailTab === 'INDICATORS' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{language === 'hi' ? 'प्रासंगिक ग्रहीय कारक' : 'Relevant Planetary Indicators'}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedDomain.relevantPlanetaryIndicators?.map((p: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100 text-sm">{translatePlanet(p.planet, language)}</span>
                          <span className="text-xs text-indigo-300 font-mono">{language === 'hi' ? `भाव ${p.house} (${translateSign(p.sign, language)})` : `House ${p.house} (${p.sign})`}</span>
                        </div>
                        <p className="text-slate-400 text-xs">{p.role}</p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span>{language === 'hi' ? 'गरिमा:' : 'Dignity:'} {p.dignity}</span>
                          <span>•</span>
                          <span>{language === 'hi' ? 'षड्बल अनुपात:' : 'Shadbala Ratio:'} {p.shadbalaRatio?.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDetailTab === 'DASHA' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{language === 'hi' ? 'दशा प्रभाव' : 'Dasha Context'}</h4>
                  {selectedDomain.dashaContext?.map((d: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-400 font-bold">{d.periodType}</span>
                        <span>{translatePlanet(d.mahadashaLord, language)} {language === 'hi' ? 'महादशा' : 'Mahadasha'}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{d.nonPredictiveExplanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeDetailTab === 'TRANSIT' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">{language === 'hi' ? 'गोचर प्रभाव' : 'Transit Context'}</h4>
                  {selectedDomain.transitContext?.map((t: any, idx: number) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-sky-400 font-bold">{translatePlanet(t.planet, language)} {language === 'hi' ? 'गोचर' : 'Transit'}</span>
                        <span>{language === 'hi' ? `लग्न से भाव ${t.transitedHouseFromLagna}` : `House ${t.transitedHouseFromLagna} from Lagna`}</span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">{t.nonPredictiveExplanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeDetailTab === 'WHY' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">{language === 'hi' ? 'गणितीय प्रमाण (WHY Traces)' : 'WHY Evidence Traces'}</h4>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 max-h-60 overflow-y-auto">
                    {selectedDomain.whyEvidence?.map((line: string, idx: number) => (
                      <p key={idx} className="text-xs font-mono text-slate-300">• {line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
