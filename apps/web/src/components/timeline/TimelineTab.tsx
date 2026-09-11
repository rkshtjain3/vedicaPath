'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Filter,
  Info,
  TrendingUp,
  Layers,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  X,
  Compass,
  Sparkles,
  Zap,
  ShieldCheck,
  Target,
  Sun,
  Moon,
  Flame,
  Award,
  BookOpen,
  Anchor,
  Feather,
  Eye,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { JargonTooltip } from '../glossary/JargonTooltip';
import { MonthlyHoroscopeTab } from './MonthlyHoroscopeTab';
import { YoginiDashaView } from './YoginiDashaView';
import { useI18n, Language } from '@/lib/i18n';

interface TimelineTabProps {
  timelineData: any;
  monthlyForecast?: any;
  yoginiData?: any;
}


const PLANET_ARCHETYPES: Record<
  string,
  {
    title: string;
    seasonName: string;
    description: string;
    border: string;
    bg: string;
    text: string;
    barColor: string;
    icon: any;
  }
> = {
  Sun: {
    title: 'The Leader & Sovereign',
    seasonName: 'Season of Authority & Purpose',
    description: 'A focused era for stepping into authority, visibility, core self-expression, and executive ownership.',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    barColor: 'bg-amber-500',
    icon: Sun,
  },
  Moon: {
    title: 'The Nurturer & Intuitive',
    seasonName: 'Season of Emotional Growth & Mind',
    description: 'A deeply perceptive cycle prioritizing mental peace, community connections, emotional maturity, and home foundation.',
    border: 'border-slate-400/40',
    bg: 'bg-slate-400/10',
    text: 'text-slate-200',
    barColor: 'bg-slate-300',
    icon: Moon,
  },
  Mars: {
    title: 'The Warrior & Pioneer',
    seasonName: 'Season of Courage & Decisive Drive',
    description: 'High-octane physical energy, technical ambition, property development, and daring initiatives.',
    border: 'border-rose-500/40',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    barColor: 'bg-rose-500',
    icon: Flame,
  },
  Rahu: {
    title: 'The Catalyst & Expander',
    seasonName: 'Season of Breakthroughs & Ambition',
    description: 'Unconventional leaps, foreign connections, rapid career scaling, and challenging old boundaries.',
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    barColor: 'bg-violet-500',
    icon: Zap,
  },
  Jupiter: {
    title: 'The Sage & Counselor',
    seasonName: 'Season of Wisdom, Fortune & Expansion',
    description: 'Golden era of mentorship, wealth compounding, ethical growth, family blessings, and philosophical mastery.',
    border: 'border-yellow-500/40',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    barColor: 'bg-yellow-400',
    icon: Award,
  },
  Saturn: {
    title: 'The Architect & Master',
    seasonName: 'Season of Discipline, Duty & Endurance',
    description: 'The great builder: establishing enduring foundations through disciplined work, resilience, and patience.',
    border: 'border-indigo-500/40',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    barColor: 'bg-indigo-500',
    icon: Anchor,
  },
  Mercury: {
    title: 'The Scholar & Strategist',
    seasonName: 'Season of Intellect, Commerce & Adaptability',
    description: 'Rapid analytical agility, business negotiations, commercial transactions, writing, and intellectual curiosity.',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    icon: BookOpen,
  },
  Ketu: {
    title: 'The Mystic & Seeker',
    seasonName: 'Season of Inner Peace & Liberation',
    description: 'Subtle spiritual insight, detachment from superficial noise, deep intuitive research, and mental freedom.',
    border: 'border-stone-500/40',
    bg: 'bg-stone-500/10',
    text: 'text-stone-300',
    barColor: 'bg-stone-400',
    icon: Feather,
  },
  Venus: {
    title: 'The Creator & Harmonizer',
    seasonName: 'Season of Harmony, Art & Abundance',
    description: 'Flourishing relationships, creative expression, refined sensory pleasure, diplomatic success, and prosperity.',
    border: 'border-pink-500/40',
    bg: 'bg-pink-500/10',
    text: 'text-pink-400',
    barColor: 'bg-pink-400',
    icon: Sparkles,
  },
};

function getPlanetArchetype(planet: string, lang: Language = 'en') {
  const normPlanet = planet ? planet.charAt(0).toUpperCase() + planet.slice(1).toLowerCase() : 'Rahu';
  const base = PLANET_ARCHETYPES[normPlanet] || PLANET_ARCHETYPES[planet] || PLANET_ARCHETYPES.Rahu;
  if (lang === 'hi') {
    const hiMap: Record<string, { title: string; seasonName: string; description: string }> = {
      Sun: {
        title: 'सूर्य • आत्म-तेज एवं अधिपति',
        seasonName: 'अधिकार, प्रतिष्ठा एवं आत्मिक संकल्प का काल',
        description: 'कार्यक्षेत्र में प्रभाव, प्रत्यक्ष नेतृत्व, आत्म-अभिव्यक्ति और उच्च प्रशासनिक दायित्व का समय।',
      },
      Moon: {
        title: 'चंद्र • संवेदनशील एवं पोषक',
        seasonName: 'भावनात्मक संवर्धन एवं मन की शांति का काल',
        description: 'मानसिक शांति, पारिवारिक सामंजस्य, सामाजिक प्रतिष्ठा और आंतरिक संवेदनशीलता को प्राथमिकता देने का दौर।',
      },
      Mars: {
        title: 'मंगल • पराक्रमी एवं अग्रदूत',
        seasonName: 'साहस, निर्णायक कर्म एवं ऊर्जा का काल',
        description: 'प्रबल शारीरिक ऊर्जा, तकनीकी महत्वाकांक्षा, संपत्ति विकास और साहसिक पहलों के लिए अनुकूल समय।',
      },
      Rahu: {
        title: 'राहु • तीव्र विस्तारक एवं परिवर्तनकारी',
        seasonName: 'अप्रत्याशित प्रगति, महत्वाकांक्षा एवं नवाचार का काल',
        description: 'अपरंपरागत छलांग, विदेशी संबंध, तीव्र व्यावसायिक विस्तार और पुरानी सीमाओं को चुनौती देने का दौर।',
      },
      Jupiter: {
        title: 'गुरु • ज्ञानी, मार्गदर्शक एवं दार्शनिक',
        seasonName: 'ज्ञान, धर्म, सौभाग्य एवं समृद्धि का काल',
        description: 'मार्गदर्शन, स्थायी संपदा संचय, नैतिक उत्थान, पारिवारिक सुख और दार्शनिक सिद्धि का स्वर्णिम युग।',
      },
      Saturn: {
        title: 'शनि • व्यवस्थापक एवं कर्म-स्वामी',
        seasonName: 'अनुशासन, कर्तव्य, धैर्य एवं स्थायित्व का काल',
        description: 'कठिन परिश्रम, दृढ़ संकल्प और धैर्य के साथ स्थायी जीवन नींव व संस्थागत सफलता का निर्माण।',
      },
      Mercury: {
        title: 'बुध • विद्वान एवं रणनीतिकार',
        seasonName: 'बुद्धि, वाणिज्य, संचार एवं अनुकूलनशीलता का काल',
        description: 'तीव्र विश्लेषणात्मक क्षमता, व्यावसायिक सौदे, लेखन, संवाद और बौद्धिक जिज्ञासा का श्रेष्ठ दौर।',
      },
      Ketu: {
        title: 'केतु • साधक एवं मोक्ष-कारक',
        seasonName: 'आंतरिक शांति, शोध एवं वैराग्य का काल',
        description: 'गहन आध्यात्मिक अंतर्दृष्टि, सतही आडंबर से विरक्ति, सूक्ष्म शोध और मानसिक स्वाधीनता।',
      },
      Venus: {
        title: 'शुक्र • सृजनशील एवं सामंजस्य-कर्ता',
        seasonName: 'सौंदर्य, कला, प्रेम एवं समृद्धि का काल',
        description: 'मधुर संबंध, कलात्मक अभिव्यक्ति, परिष्कृत सौंदर्यबोध, कूटनीतिक सफलता और भौतिक ऐश्वर्य।',
      },
    };
    const hi = hiMap[normPlanet] || hiMap[planet];
    if (hi) {
      return { ...base, ...hi };
    }
  }
  return base;
}

const formatDateStr = (val: any) => {
  if (!val) return '';
  if (typeof val === 'string') return val.split('T')[0];
  if (val instanceof Date) return val.toISOString().split('T')[0];
  return String(val);
};

export const TimelineTab: React.FC<TimelineTabProps> = ({ timelineData, monthlyForecast, yoginiData }) => {
  const { t, language, translatePlanet, translateDomain } = useI18n();
  const [timelineViewMode, setTimelineViewMode] = useState<'MONTHLY' | 'SEASONS' | 'YOGINI' | 'WINDOWS'>('SEASONS');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [zoomYears, setZoomYears] = useState<number>(10);
  const [selectedPeriod, setSelectedPeriod] = useState<any | null>(null);
  const [showTransits, setShowTransits] = useState<boolean>(true);
  const [whyModalEvidence, setWhyModalEvidence] = useState<any | null>(null);

  if (!timelineData || !timelineData.timeline) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl">
        <Clock className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-200">
          {language === 'hi' ? 'कोई कालक्रम डेटा उपलब्ध नहीं' : 'No Timeline Data Available'}
        </h3>
        <p className="text-sm text-slate-400 mt-2">
          {language === 'hi'
            ? 'विंशोत्तरी दशा चक्र एवं प्रमाण-आधारित समय-सीमाएं देखने हेतु जन्म कुंडली की गणना करें।'
            : 'Calculate a birth chart to view the multi-level Dasha timeline and evidence-based timing windows.'}
        </p>
      </div>
    );
  }

  const { currentPeriod, timeline, timingWindows, domainContexts, confidence } = timelineData;
  const currentMaha = currentPeriod?.mahadasha;
  const currentAntar = currentPeriod?.antardasha;
  const currentPrat = currentPeriod?.pratyantardasha;

  const currentMahaArchetype = currentMaha?.lord ? getPlanetArchetype(currentMaha.lord, language) : getPlanetArchetype('Rahu', language);
  const currentAntarArchetype = currentAntar?.lord ? getPlanetArchetype(currentAntar.lord, language) : getPlanetArchetype('Mars', language);

  // Extract all Mahadasha periods to build the 120-Year Life Seasons Bar
  const mahadashas = timeline.filter((p: any) => p.level === 'MAHADASHA');
  const totalDashaDuration = mahadashas.reduce((acc: number, p: any) => acc + (p.durationDays || 365), 0) || 1;

  const domains = [
    'ALL',
    'CAREER',
    'WEALTH',
    'RELATIONSHIPS',
    'HEALTH',
    'EDUCATION',
    'PROPERTY',
    'SPIRITUALITY',
  ];

  // Filter periods by selected domain relevance
  const filteredPeriods = timeline.filter((period: any) => {
    if (selectedDomain === 'ALL') return true;
    const relevance = period.lordContext?.lifeDomainRelevance || [];
    return relevance.includes(selectedDomain);
  });

  const filteredWindows = (selectedDomain === 'ALL'
    ? timingWindows
    : domainContexts[selectedDomain] || []
  );

  return (
    <div className="space-y-8" id="tab-timeline-container">
      {/* 0. SUB-VIEW NAVIGATION PILL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="subtab-monthly-horoscope"
            type="button"
            onClick={() => setTimelineViewMode('MONTHLY')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              timelineViewMode === 'MONTHLY'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {language === 'hi' ? 'मासिक राशिफल' : 'Monthly Forecast'}
          </button>

          <button
            id="subtab-cosmic-seasons"
            type="button"
            onClick={() => setTimelineViewMode('SEASONS')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              timelineViewMode === 'SEASONS'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            {language === 'hi' ? 'विंशोत्तरी (१२० वर्ष)' : 'Vimshottari (120y)'}
          </button>

          <button
            id="subtab-yogini-dasha"
            type="button"
            onClick={() => setTimelineViewMode('YOGINI')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              timelineViewMode === 'YOGINI'
                ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {language === 'hi' ? 'योगिनी दशा (३६ वर्ष)' : 'Yogini Dasha (36y)'}
          </button>

          <button
            id="subtab-timing-windows"
            type="button"
            onClick={() => setTimelineViewMode('WINDOWS')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              timelineViewMode === 'WINDOWS'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            {language === 'hi' ? 'प्रमाण समय-सीमाएं' : 'Evidence Windows'}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 px-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'hi' ? 'सटीक ज्योतिषीय कालक्रम' : 'Deterministic Astrological Timing'}</span>
        </div>
      </div>

      {timelineViewMode === 'MONTHLY' && (
        <MonthlyHoroscopeTab monthlyForecast={monthlyForecast} />
      )}

      {timelineViewMode === 'YOGINI' && (
        <YoginiDashaView yoginiData={yoginiData} />
      )}

      {timelineViewMode === 'SEASONS' && (
        <>
          {/* 1. HERO BANNER: ACTIVE DASHA & LIFE CHAPTER */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5 mb-6">

          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold tracking-wider text-cyan-400 uppercase">
                {language === 'hi' ? '120-वर्षीय महादशा चक्र व जीवन मौसम' : '120-Year Cosmic Seasons & Life Cycles'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1 tracking-tight">
              {language === 'hi' ? 'विंशोत्तरी दशा प्रणाली' : 'Vimshottari Dasha Hierarchy'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'शास्त्रीय ग्रहीय कालचक्र जो आपके वर्तमान जीवन अध्याय, उप-दशाओं व विकासात्मक पड़ावों को दर्शाता है।'
                : 'Classical planetary timing showing your active life era, sub-seasons, and developmental milestones.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono">
              {language === 'hi' ? 'गणितीय विश्वसनीयता:' : 'Mathematical Confidence:'}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                confidence?.level === 'HIGH'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}
            >
              {confidence?.level || 'HIGH'} ({confidence?.score || 85}%)
            </span>
          </div>
        </div>

        {/* Active Dasha Three-Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* MAHADASHA (Major Life Chapter) */}
          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  <JargonTooltip
                    termId="mahadasha"
                    fallbackLabel={language === 'hi' ? 'प्रमुख जीवन अध्याय (महादशा)' : 'Major Life Chapter (Mahadasha)'}
                  />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/40">
                  {language === 'hi' ? 'सक्रिय महादशा' : 'ACTIVE ERA'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${currentMahaArchetype.bg} ${currentMahaArchetype.text}`}>
                  {React.createElement(currentMahaArchetype.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-100">
                    {translatePlanet(currentMaha?.lord) || currentMaha?.lord || 'N/A'}
                  </h4>
                  <span className="text-xs text-cyan-300 font-medium">{currentMahaArchetype.seasonName}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {currentMahaArchetype.description}
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800/80 mt-3 flex justify-between">
              <span>{formatDateStr(currentMaha?.startDate)}</span>
              <span>—</span>
              <span>{formatDateStr(currentMaha?.endDate)}</span>
            </div>
          </div>

          {/* ANTARDASHA (Current Sub-Season) */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  <JargonTooltip
                    termId="antardasha"
                    fallbackLabel={language === 'hi' ? 'सक्रिय उप-ऋतु (अंतर्दशा)' : 'Active Sub-Season (Antardasha)'}
                  />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                  {language === 'hi' ? 'सक्रिय अंतर्दशा' : 'FOCAL PHASE'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${currentAntarArchetype.bg} ${currentAntarArchetype.text}`}>
                  {React.createElement(currentAntarArchetype.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-100">
                    {translatePlanet(currentAntar?.lord) || currentAntar?.lord || 'N/A'}
                  </h4>
                  <span className="text-xs text-amber-300 font-medium">{currentAntarArchetype.seasonName}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {currentAntarArchetype.description}
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800/80 mt-3 flex justify-between">
              <span>{formatDateStr(currentAntar?.startDate)}</span>
              <span>—</span>
              <span>{formatDateStr(currentAntar?.endDate)}</span>
            </div>
          </div>

          {/* PRATYANTARDASHA (Immediate Focus) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  <JargonTooltip
                    termId="antardasha"
                    fallbackLabel={language === 'hi' ? 'तात्कालिक चक्र (प्रत्यंतर्दशा)' : 'Immediate Focus (Pratyantardasha)'}
                  />
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/40">
                  {language === 'hi' ? 'प्रत्यंतर्दशा' : 'SHORT CYCLE'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-100">
                    {translatePlanet(currentPrat?.lord) || currentPrat?.lord || 'N/A'}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {language === 'hi'
                      ? `${translatePlanet(currentMaha?.lord)} व ${translatePlanet(currentAntar?.lord)} के प्रभाव में`
                      : `Under ${currentMaha?.lord} & ${currentAntar?.lord}`}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {language === 'hi'
                  ? 'वर्तमान 2 से 8 माह के अंतराल में दैनिक जीवन की लय और तात्कालिक ऊर्जा प्रवाह।'
                  : 'Day-to-day rhythm and acute energy shifts over the current 2 to 8 month window.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800/80 mt-3 flex justify-between">
              <span>{formatDateStr(currentPrat?.startDate)}</span>
              <span>—</span>
              <span>{formatDateStr(currentPrat?.endDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE 120-YEAR "LIFE SEASONS" JOURNEY MAP */}
      {mahadashas.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <JargonTooltip
                  termId="vimshottari-dasha"
                  fallbackLabel={language === 'hi' ? '120-वर्षीय विंशोत्तरी जीवन मानचित्र' : 'The 120-Year Vimshottari Life Map'}
                />
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? '9 शास्त्रीय ग्रहों के विकासात्मक चक्रों में आपकी संपूर्ण 120-वर्षीय जीवन यात्रा का विहंगम दृश्य।'
                  : 'A birds-eye view of your entire lifetime across the 9 classical developmental planetary cycles.'}
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-800">
              {language === 'hi'
                ? `सक्रिय: ${translatePlanet(currentMaha?.lord)} महादशा`
                : `Active: ${currentMaha?.lord} Era`}
            </span>
          </div>

          {/* Proportional Segmented Life Bar */}
          <div className="w-full h-8 bg-slate-950 rounded-2xl p-1 border border-slate-800 flex overflow-hidden gap-1">
            {mahadashas.map((m: any, idx: number) => {
              const archetype = getPlanetArchetype(m.lord, language);
              const pct = Math.max(5, Math.round(((m.durationDays || 365) / totalDashaDuration) * 100));
              const isCurrent = m.isCurrent || m.lord === currentMaha?.lord;

              return (
                <div
                  key={idx}
                  style={{ width: `${pct}%` }}
                  title={`${translatePlanet(m.lord)} (${formatDateStr(m.startDate)} - ${formatDateStr(m.endDate)})`}
                  className={`h-full rounded-xl transition-all duration-300 relative group cursor-pointer flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? `${archetype.barColor} text-slate-950 shadow-lg ring-2 ring-white/50 scale-[1.03] z-10 font-black`
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <span className="truncate px-1">{translatePlanet(m.lord)}</span>
                </div>
              );
            })}
          </div>

          {/* Mahadasha Quick Badges Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
            {mahadashas.map((m: any, idx: number) => {
              const archetype = getPlanetArchetype(m.lord, language);
              const isCurrent = m.isCurrent || m.lord === currentMaha?.lord;
              const Icon = archetype.icon;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPeriod(m)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${archetype.text}`} />
                      <span className="text-xs font-bold text-slate-200">{translatePlanet(m.lord)}</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {language === 'hi' ? 'वर्तमान' : 'NOW'}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-1.5">
                    {formatDateStr(m.startDate).split('-')[0]} – {formatDateStr(m.endDate).split('-')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. COSMIC WEATHER FORECAST (TRANSITS OVERLAY) */}
      {showTransits && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                {language === 'hi' ? (
                  <>
                    सक्रिय ग्रहीय गोचर मौसम (बृहस्पति एवं शनि <JargonTooltip termId="gochar" fallbackLabel="गोचर" />)
                  </>
                ) : (
                  <>
                    Active Planetary Weather Forecast (Jupiter & Saturn <JargonTooltip termId="gochar" fallbackLabel="Gochar" />)
                  </>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'जहां आपकी दशा आंतरिक जीवन के मौसम को नियंत्रित करती है, वहीं गोचर बाहरी वातावरणीय प्रभाव को प्रकट करता है।'
                  : 'While your Dasha governs the internal seasons of your life, transits represent the ambient external weather.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                id="transit-sampling-profile-select"
                className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-indigo-500"
                defaultValue="CURRENT_ONLY"
              >
                <option value="CURRENT_ONLY">{language === 'hi' ? 'नमूना: वर्तमान तिथि' : 'Sampling: Current Date'}</option>
                <option value="PERIOD_BOUNDARIES">{language === 'hi' ? 'नमूना: अवधि सीमाएं' : 'Sampling: Boundaries'}</option>
                <option value="START_MID_END">{language === 'hi' ? 'नमूना: प्रारंभ/मध्य/अंत' : 'Sampling: Start/Mid/End'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* JUPITER GOCHAR CARD */}
            <div className="bg-slate-950/80 p-5 border border-amber-500/20 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      {language === 'hi' ? 'बृहस्पति (गुरु) गोचर: उन्नति व विस्तार काल' : 'Jupiter Weather: Expansion Window'}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {language === 'hi'
                        ? `राशि: ${timingWindows[0]?.transitContext?.jupiter?.sign || 'Taurus'} • लग्न से ${timingWindows[0]?.transitContext?.jupiter?.houseFromLagna || 10}वां भाव`
                        : `Sign: ${timingWindows[0]?.transitContext?.jupiter?.sign || 'Taurus'} • House ${timingWindows[0]?.transitContext?.jupiter?.houseFromLagna || 10} from Lagna`}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                  {language === 'hi' && timingWindows[0]?.transitContext?.jupiter?.classification === 'FAVORABLE'
                    ? 'शुभ / अनुकूल'
                    : (timingWindows[0]?.transitContext?.jupiter?.classification || 'FAVORABLE')}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'गुरु जिस भाव से भ्रमण करते हैं, वहां विस्तार, शुचिता और सद्बुद्धि प्रदान करते हैं। यह काल व्यावसायिक प्रतिष्ठा, ज्ञानोपार्जन और दूरगामी निर्णयों के लिए अत्यंत शुभ है।'
                  : 'Jupiter expands and blesses whatever house it transits. Favorable energy for expanding professional recognition, seeking higher counsel, and taking calculated creative initiatives.'}
              </p>

              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between">
                <span>{language === 'hi' ? 'अष्टकवर्ग बल:' : 'Ashtakavarga Strength:'}</span>
                <span className="text-amber-400 font-bold">
                  {timingWindows[0]?.transitContext?.jupiter?.savPoints || 30} SAV pts (avg 28)
                </span>
              </div>
            </div>

            {/* SATURN GOCHAR CARD */}
            <div className="bg-slate-950/80 p-5 border border-indigo-500/20 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Anchor className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-300">
                      {language === 'hi' ? 'शनि गोचर: अनुशासन व कर्म परीक्षा' : 'Saturn Weather: Foundation Testing'}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {language === 'hi'
                        ? `राशि: ${timingWindows[0]?.transitContext?.saturn?.sign || 'Aquarius'} • लग्न से ${timingWindows[0]?.transitContext?.saturn?.houseFromLagna || 7}वां भाव`
                        : `Sign: ${timingWindows[0]?.transitContext?.saturn?.sign || 'Aquarius'} • House ${timingWindows[0]?.transitContext?.saturn?.houseFromLagna || 7} from Lagna`}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {language === 'hi' && (timingWindows[0]?.transitContext?.saturn?.classification === 'AVERAGE' || !timingWindows[0]?.transitContext?.saturn?.classification)
                    ? 'सामान्य / मध्यम'
                    : (timingWindows[0]?.transitContext?.saturn?.classification || 'AVERAGE')}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'hi'
                  ? 'शनि देव धैर्य, यथार्थ और दृढ़ संकल्प की परीक्षा लेते हैं। इस समय को स्थायी नींव बनाने, व्यर्थ के ऋण या भटकाव से बचने और अनुशासित आचरण के लिए उपयोग करें।'
                  : 'Saturn brings serious focus and reality checks. Use this time to build enduring structures, eliminate debt or unproductive commitments, and maintain disciplined emotional calm.'}
              </p>

              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80 flex justify-between">
                <span>{language === 'hi' ? 'अष्टकवर्ग बल:' : 'Ashtakavarga Strength:'}</span>
                <span className="text-indigo-400 font-bold">
                  {timingWindows[0]?.transitContext?.saturn?.savPoints || 28} SAV pts (avg 28)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FILTER & TIMELINE PERIOD CARDS */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 border border-slate-800 rounded-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 mr-1" />
            <span className="text-xs font-semibold text-slate-400 uppercase">
              {language === 'hi' ? 'क्षेत्र फ़िल्टर:' : 'Domain Filter:'}
            </span>
            {domains.map((dom) => (
              <button
                key={dom}
                id={`filter-domain-${dom.toLowerCase()}`}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                  selectedDomain === dom
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {dom === 'ALL' ? (language === 'hi' ? 'सभी' : 'ALL') : translateDomain(dom)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{language === 'hi' ? 'ज़ूम:' : 'Zoom:'}</span>
            {[1, 5, 10].map((yrs) => (
              <button
                key={yrs}
                onClick={() => setZoomYears(yrs)}
                className={`px-3 py-1 text-xs rounded-xl transition ${
                  zoomYears === yrs
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {language === 'hi' ? `${yrs} वर्ष` : `${yrs} yr${yrs > 1 ? 's' : ''}`}
              </button>
            ))}

            <button
              onClick={() => setShowTransits(!showTransits)}
              className={`px-3 py-1 text-xs rounded-xl border transition-all ${
                showTransits
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {language === 'hi'
                ? `गोचर: ${showTransits ? 'चालू' : 'बंद'}`
                : `Transits: ${showTransits ? 'ON' : 'OFF'}`}
            </button>
          </div>
        </div>

        {/* Periods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeriods.map((period: any) => {
            const isCurrent = period.isCurrent;
            const archetype = getPlanetArchetype(period.lord, language);
            const Icon = archetype.icon;

            return (
              <div
                key={period.id}
                id={`period-card-${period.id}`}
                onClick={() => setSelectedPeriod(period)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] flex flex-col justify-between shadow-md ${
                  isCurrent
                    ? 'bg-slate-900 border-cyan-500/70 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl ${archetype.bg} ${archetype.text}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                          {period.level}
                        </span>
                        <h4 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                          {translatePlanet(period.lord)}
                          {period.parentLord && (
                            <span className="text-xs font-normal text-slate-400">
                              ({translatePlanet(period.parentLord)})
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {language === 'hi' ? 'वर्तमान' : 'CURRENT'}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {archetype.seasonName}
                  </p>

                  <div className="text-xs text-slate-400 space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-3">
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'प्रारंभ:' : 'Start:'}</span>
                      <span className="text-slate-200 font-mono">{formatDateStr(period.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'समाप्ति:' : 'End:'}</span>
                      <span className="text-slate-200 font-mono">{formatDateStr(period.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'hi' ? 'अवधि:' : 'Duration:'}</span>
                      <span className="text-slate-200 font-mono">
                        {period.durationDays} {language === 'hi' ? 'दिन' : 'days'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {period.lordContext?.lifeDomainRelevance && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                      {period.lordContext.lifeDomainRelevance.map((dom: string) => (
                        <span
                          key={dom}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {translateDomain(dom)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* 5. EVIDENCE-BASED TIMING WINDOWS */}
      {timelineViewMode === 'WINDOWS' && (
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              {language === 'hi'
                ? `प्रमाण-आधारित समय-सीमाएं (${filteredWindows.length})`
                : `Evidence-Based Timing Windows (${filteredWindows.length})`}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'विशिष्ट जीवन निर्णयों के लिए दशा अनुकूलता एवं गोचर कारकों का निश्चित मिलन काल।'
                : 'Deterministic windows where dasha alignment and transit factors converge for specific life decisions.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWindows.map((win: any) => {
            let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';
            if (win.contextClass === 'HIGH_EVIDENCE_CONTEXT') {
              badgeStyle = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
            } else if (win.contextClass === 'MODERATE_EVIDENCE_CONTEXT') {
              badgeStyle = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
            } else if (win.contextClass === 'MIXED_EVIDENCE_CONTEXT') {
              badgeStyle = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
            }

            return (
              <div
                key={win.id}
                className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 transition flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      {translateDomain(win.domain)}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeStyle}`}>
                      {win.contextClass.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 font-mono bg-slate-900/60 p-2.5 rounded-xl">
                    <span className="text-emerald-400 font-bold">
                      {language === 'hi' ? 'समर्थन:' : 'Support:'} +{win.supportScore}
                    </span>
                    <span className="text-rose-400 font-bold">
                      {language === 'hi' ? 'चुनौती:' : 'Challenge:'} -{win.challengeScore}
                    </span>
                    <span className="text-slate-400">
                      {language === 'hi' ? 'बिंदु:' : 'Points:'} {win.evidenceCount}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-800/80">
                  <button
                    id={`why-btn-${win.id}`}
                    onClick={() => setWhyModalEvidence(win)}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-all hover:underline cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'तर्क एवं शास्त्रीय प्रमाण' : 'WHY? Evidence Explorer'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}


      {/* 6. PERIOD DETAILS MODAL */}
      {selectedPeriod && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <button
              id="close-period-modal"
              onClick={() => setSelectedPeriod(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs uppercase tracking-wider font-mono text-cyan-400">
                {language === 'hi' ? `${selectedPeriod.level} दशा सारांश` : `${selectedPeriod.level} Chapter Overview`}
              </span>
              <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                {translatePlanet(selectedPeriod.lord)} {language === 'hi' ? 'काल' : 'Era'}
                {selectedPeriod.parentLord && (
                  <span className="text-sm font-normal text-slate-400">
                    ({language === 'hi' ? `${translatePlanet(selectedPeriod.parentLord)} के अंतर्गत` : `under ${selectedPeriod.parentLord}`})
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {formatDateStr(selectedPeriod.startDate)} — {formatDateStr(selectedPeriod.endDate)} ({selectedPeriod.durationDays} {language === 'hi' ? 'दिन' : 'days'})
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider">
                  {language === 'hi' ? 'जन्म कुंडली में ग्रहीय बल एवं स्थिति' : 'Natal Planetary Strength & Dignity'}
                </h4>
                <p className="text-xs text-slate-300">
                  {language === 'hi' ? 'राशि:' : 'Sign:'} {selectedPeriod.lordContext?.natalContext?.sign || 'N/A'} • {language === 'hi' ? 'भाव:' : 'House:'} {selectedPeriod.lordContext?.natalContext?.house || 'N/A'} • {language === 'hi' ? 'गरिमा:' : 'Dignity:'} {selectedPeriod.lordContext?.natalContext?.dignity || 'NEUTRAL'}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  {language === 'hi' ? 'कुल बल:' : 'Overall Strength:'}{' '}
                  <strong className="text-slate-100">{selectedPeriod.lordContext?.strengthContext?.overallStrength || 'MODERATE'}</strong>
                </p>
              </div>

              {selectedPeriod.evidence && selectedPeriod.evidence.length > 0 && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider">
                    {language === 'hi' ? `दशा प्रमाण बिंदु (${selectedPeriod.evidence.length})` : `Timing Evidence (${selectedPeriod.evidence.length})`}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {selectedPeriod.evidence.map((ev: any) => (
                      <li key={ev.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2">
                        <span
                          className={`font-bold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5 ${
                            ev.direction === 'SUPPORTIVE'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {ev.direction}
                        </span>
                        <span className="text-slate-300 leading-relaxed">{ev.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedPeriod(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition shadow"
              >
                {language === 'hi' ? 'विवरण बंद करें' : 'Close Details'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* 7. WHY EVIDENCE EXPLORER MODAL */}
      {whyModalEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <button
              id="close-why-modal"
              onClick={() => setWhyModalEvidence(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                {language === 'hi'
                  ? `तर्क एवं शास्त्रीय प्रमाण: ${translateDomain(whyModalEvidence.domain)}`
                  : `WHY? Evidence Explorer: ${whyModalEvidence.domain}`}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {language === 'hi' ? 'प्रमाण श्रृंखला:' : 'Detailed evidentiary trace for'} {whyModalEvidence.id}
              </p>
            </div>

            <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed">
              {whyModalEvidence.whyEvidence?.map((line: string, idx: number) => (
                <div key={idx} className="border-b border-slate-900/80 pb-2 flex items-start gap-2">
                  <span className="text-slate-600 select-none">{idx + 1}.</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setWhyModalEvidence(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition shadow"
              >
                {language === 'hi' ? 'बंद करें' : 'Close Trace'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
