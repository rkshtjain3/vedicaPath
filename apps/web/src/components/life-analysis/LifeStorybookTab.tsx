'use client';

import React, { useState } from 'react';
import {
  Compass,
  Briefcase,
  Coins,
  Heart,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Clock,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Home,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Layers,
  Flame,
} from 'lucide-react';
import { useI18n, Language } from '@/lib/i18n';

interface LifeStorybookTabProps {
  lifeStorybook?: any;
  milestones?: any;
  struggles?: any;
  fullName?: string;
  astroData?: any;
  onNavigateTab?: (tab: string, queryPrompt?: string) => void;
}

export const LifeStorybookTab: React.FC<LifeStorybookTabProps> = ({
  lifeStorybook,
  milestones,
  struggles,
  fullName,
  astroData,
  onNavigateTab,
}) => {
  const { language: lang, t } = useI18n();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});

  const toggleEvidence = (id: string) => {
    setExpandedEvidence((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const chapters = lifeStorybook?.chapters || [];
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const CHAPTER_ICONS = [Compass, Briefcase, Home, Heart, ShieldAlert];
  const CHAPTER_THEMES = [
    { border: 'border-cyan-500/40', bg: 'bg-cyan-500/10', text: 'text-cyan-400', badge: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
    { border: 'border-indigo-500/40', bg: 'bg-indigo-500/10', text: 'text-indigo-400', badge: 'bg-indigo-950 text-indigo-300 border-indigo-800' },
    { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-950 text-amber-300 border-amber-800' },
    { border: 'border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-400', badge: 'bg-rose-950 text-rose-300 border-rose-800' },
    { border: 'border-orange-500/40', bg: 'bg-orange-500/10', text: 'text-orange-400', badge: 'bg-orange-950 text-orange-300 border-orange-800' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* HERO BANNER: The Executive Blueprint */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-950 border border-indigo-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-xs font-semibold text-indigo-300 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'hi' ? 'जीवन नेविगेशन एवं आत्मिक उद्देश्य' : 'Executive Life Navigation Blueprint'}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {fullName ? `${fullName}'s ${lang === 'hi' ? 'जीवन गाथा' : 'Life Storybook'}` : lang === 'hi' ? 'आपकी जीवन गाथा' : 'Your Personal Life Storybook'}
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'जटिल ज्योतिषीय गणनाओं से परे, आपके जीवन के 5 मुख्य अध्यायों का स्पष्ट एवं व्यावहारिक विश्लेषण।'
                : 'Translating complex astronomical matrices into 5 clear, empowering life chapters: Aim of Life, Career Path, Property, Marriage, and Overcoming Struggles.'}
            </p>
          </div>

          {/* Core Archetype Highlight Card */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 md:p-5 flex items-center gap-4 min-w-[280px] shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-amber-400/80 font-medium uppercase tracking-wider">
                {lang === 'hi' ? 'मूल आत्मिक स्वरूप' : 'Core Life Archetype'}
              </div>
              <div className="text-lg font-bold text-white">
                {lang === 'hi' ? lifeStorybook?.primaryArchetypeHi : lifeStorybook?.primaryArchetype || 'The Strategic Innovator'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {astroData?.ascendant?.sign || 'Aries'} {lang === 'hi' ? 'लग्न' : 'Rising'} • {astroData?.moonSign?.sign || 'Moon'} {lang === 'hi' ? 'चंद्र' : 'Moon'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Question Shortcut Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-400 font-medium mr-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            {lang === 'hi' ? 'त्वरित प्रश्न:' : 'Quick Questions:'}
          </span>
          <button
            onClick={() => onNavigateTab?.('query', 'What is the aim of my life as per my chart?')}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-400/50 text-slate-200 transition flex items-center gap-1"
          >
            🧭 {lang === 'hi' ? 'मेरे जीवन का क्या उद्देश्य है?' : 'What is the aim of my life?'}
          </button>
          <button
            onClick={() => onNavigateTab?.('query', 'What is my career path in detail? Job vs business?')}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-400/50 text-slate-200 transition flex items-center gap-1"
          >
            💼 {lang === 'hi' ? 'मेरा करियर पथ क्या है? (नौकरी या व्यापार)' : 'Career path (Job vs Business)?'}
          </button>
          <button
            onClick={() => onNavigateTab?.('query', 'When will I buy a home or property?')}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-400/50 text-slate-200 transition flex items-center gap-1"
          >
            🏡 {lang === 'hi' ? 'मकान/संपत्ति कब खरीदूंगा?' : 'When will I buy a home?'}
          </button>
          <button
            onClick={() => onNavigateTab?.('query', 'When will I get married?')}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-400/50 text-slate-200 transition flex items-center gap-1"
          >
            ❤️ {lang === 'hi' ? 'विवाह का समय कब है?' : 'When will I get married?'}
          </button>
          <button
            onClick={() => onNavigateTab?.('query', 'Why am I getting fail from last 2 years?')}
            className="text-xs px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/50 border border-rose-700/50 text-rose-200 transition flex items-center gap-1 font-medium"
          >
            🌊 {lang === 'hi' ? 'पिछले 2 वर्षों से असफलताएं क्यों मिल रही हैं?' : 'Why am I failing from last 2 years?'}
          </button>
        </div>
      </div>

      {/* CHAPTER SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {chapters.map((ch: any, idx: number) => {
          const Icon = CHAPTER_ICONS[idx % CHAPTER_ICONS.length];
          const isSelected = activeChapterIndex === idx;
          const theme = CHAPTER_THEMES[idx % CHAPTER_THEMES.length];

          return (
            <button
              key={ch.id || idx}
              onClick={() => setActiveChapterIndex(idx)}
              className={`p-4 rounded-xl text-left transition-all relative border flex flex-col justify-between gap-3 ${
                isSelected
                  ? `${theme.bg} ${theme.border} ring-2 ring-indigo-500/50 shadow-lg shadow-indigo-500/10`
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${isSelected ? theme.bg : 'bg-slate-800'} ${theme.text}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {lang === 'hi' ? `अध्याय ${idx + 1}` : `Ch. ${idx + 1}`}
                </span>
              </div>
              <div>
                <div className="text-xs font-semibold text-white line-clamp-1">
                  {lang === 'hi' ? ch.titleHi : ch.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {lang === 'hi' ? ch.subtitleHi : ch.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE CHAPTER DISPLAY */}
      {currentChapter && (
        <div className="space-y-6">
          {/* Main Narrative Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {lang === 'hi' ? `अध्याय ${currentChapter.chapterNumber}` : `Chapter ${currentChapter.chapterNumber}`}
                  </span>
                  {currentChapter.archetypeBadge && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {lang === 'hi' ? currentChapter.archetypeBadgeHi : currentChapter.archetypeBadge}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {lang === 'hi' ? currentChapter.titleHi : currentChapter.title}
                </h2>
                <p className="text-sm text-slate-400">
                  {lang === 'hi' ? currentChapter.subtitleHi : currentChapter.subtitle}
                </p>
              </div>

              <button
                onClick={() => onNavigateTab?.('query', `Tell me more about ${currentChapter.title}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition self-start md:self-auto"
              >
                <HelpCircle className="w-4 h-4" />
                {lang === 'hi' ? 'इस विषय पर प्रश्न पूछें' : 'Ask Vedica About This'}
              </button>
            </div>

            {/* Executive Summary Quote Box */}
            <div className="p-4 md:p-5 rounded-xl bg-slate-950/60 border-l-4 border-indigo-500 text-slate-200 text-sm md:text-base leading-relaxed italic">
              "{lang === 'hi' ? currentChapter.executiveSummaryHi : currentChapter.executiveSummary}"
            </div>

            {/* Structured Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {currentChapter.sections?.map((sec: any, sIdx: number) => (
                <div
                  key={sIdx}
                  className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div className="space-y-2.5">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {lang === 'hi' ? sec.headingHi : sec.heading}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {lang === 'hi' ? sec.contentHi : sec.content}
                    </p>
                  </div>

                  {sec.highlights && sec.highlights.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/60 space-y-1.5">
                      <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                        {lang === 'hi' ? 'मुख्य सूत्र' : 'Key Takeaways'}
                      </div>
                      <ul className="space-y-1">
                        {(lang === 'hi' ? sec.highlightsHi || sec.highlights : sec.highlights).map((h: string, hIdx: number) => (
                          <li key={hIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* COLLAPSIBLE ASTRONOMICAL EVIDENCE ACCORDION */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => toggleEvidence(currentChapter.id)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  {lang === 'hi' ? 'शास्त्रीय एवं खगोलीय प्रमाण देखें' : 'View Astrological Calculation Evidence'}
                </span>
                {expandedEvidence[currentChapter.id] ? (
                  <ChevronDown className="w-4 h-4 text-indigo-400" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {expandedEvidence[currentChapter.id] && (
                <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="font-semibold text-slate-300">
                    {lang === 'hi' ? 'गणना आधार एवं प्रमाण:' : 'Calculation Basis & Evidence:'}
                  </div>
                  <p className="leading-relaxed">
                    {lang === 'hi' ? currentChapter.astrologicalEvidenceSummaryHi : currentChapter.astrologicalEvidenceSummary}
                  </p>
                  <div className="text-[11px] text-slate-500 italic pt-1">
                    {lang === 'hi'
                      ? 'यह विश्लेषण 100% गणितीय वैदिक गणनाओं, विंशोत्तरी दशा, नवम/दशमांश वर्ग और गोचर पर आधारित है।'
                      : 'Derived from 100% deterministic Swiss Ephemeris data, Vimshottari dasha cycles, Shodashavarga, and transit vectors.'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SPECIAL FOCUS CARDS: MILESTONES & STRUGGLE DIAGNOSTIC */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MILESTONE TIMING CARD */}
            <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {lang === 'hi' ? 'आगामी जीवन मील के पत्थर' : 'Upcoming Major Life Milestones'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'hi' ? 'मकान, विवाह, पदोन्नति एवं स्थान परिवर्तन का समय' : 'Estimated probability windows for key events'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {milestones?.propertyWindows?.[0] && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-white">
                          {lang === 'hi' ? milestones.propertyWindows[0].titleHi : milestones.propertyWindows[0].title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'hi' ? milestones.propertyWindows[0].descriptionHi : milestones.propertyWindows[0].description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                        {milestones.propertyWindows[0].startDate} → {milestones.propertyWindows[0].endDate}
                      </span>
                    </div>
                  </div>
                )}

                {milestones?.marriageWindows?.[0] && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-white">
                          {lang === 'hi' ? milestones.marriageWindows[0].titleHi : milestones.marriageWindows[0].title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'hi' ? milestones.marriageWindows[0].descriptionHi : milestones.marriageWindows[0].description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        {milestones.marriageWindows[0].startDate} → {milestones.marriageWindows[0].endDate}
                      </span>
                    </div>
                  </div>
                )}

                {milestones?.careerWindows?.[0] && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white">
                          {lang === 'hi' ? milestones.careerWindows[0].titleHi : milestones.careerWindows[0].title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {lang === 'hi' ? milestones.careerWindows[0].descriptionHi : milestones.careerWindows[0].description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {milestones.careerWindows[0].startDate} → {milestones.careerWindows[0].endDate}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STRUGGLE & FAILURE DIAGNOSTIC CARD */}
            <div className="bg-slate-900/80 border border-orange-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {lang === 'hi' ? 'बाधाओं एवं असफलताओं का विश्लेषण' : 'Why Am I Facing Obstacles / Delays?'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {lang === 'hi' ? 'विगत समय की कठिनाइयों का कारण एवं राहत का समय' : 'Diagnostic breakdown of recent 1–2 years friction'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-orange-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">
                    {lang === 'hi' ? struggles?.statusHeadlineHi || 'कर्म मंथन काल' : struggles?.statusHeadline || 'Karmic Testing Phase'}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {lang === 'hi' ? `राहत समय: ${struggles?.reliefDate || 'आगामी दशा'}` : `Relief: ${struggles?.reliefDate || 'Upcoming Dasha'}`}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'hi' ? struggles?.rootExplanationHi : struggles?.rootExplanation}
                </p>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-amber-400">
                    {lang === 'hi' ? 'सीख एवं विकास:' : 'The Core Lesson:'}
                  </span>
                  <p className="text-slate-400">
                    {lang === 'hi' ? struggles?.karmicLessonHi : struggles?.karmicLesson}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab?.('query', 'Why am I getting fail from last 2 years? What is the remedy?')}
                className="w-full py-2.5 rounded-xl bg-orange-950/60 hover:bg-orange-900/60 border border-orange-700/60 text-orange-200 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'विस्तृत समाधान एवं सात्विक उपाय देखें' : 'Explore Detailed Remedies & Action Steps'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
