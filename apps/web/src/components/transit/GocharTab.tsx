'use client';

import React, { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  Eye,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface GocharTabProps {
  transitData?: any;
  convergenceData?: any;
  onDateChange?: (date: string) => void;
  isLoading?: boolean;
}

export function GocharTab({
  transitData,
  convergenceData,
  onDateChange,
  isLoading = false,
}: GocharTabProps) {
  const { t, language, translatePlanet, translateDomain, translateSign, translateNakshatra } = useI18n();
  const isHi = language === 'hi';

  const [selectedDomain, setSelectedDomain] = useState<string>('CAREER');
  const [selectedAspect, setSelectedAspect] = useState<any | null>(null);
  const [selectedConjunction, setSelectedConjunction] = useState<any | null>(null);
  const [selectedConvergenceDomain, setSelectedConvergenceDomain] = useState<any | null>(null);
  
  const initialDate = transitData?.calculationDate?.split('T')[0] || new Date().toISOString().split('T')[0];
  const [transitDateInput, setTransitDateInput] = useState<string>(initialDate);

  // Mobile collapsible accordion states
  const [openPlanets, setOpenPlanets] = useState<boolean>(true);
  const [openAspects, setOpenAspects] = useState<boolean>(true);
  const [openDomainEvidence, setOpenDomainEvidence] = useState<boolean>(true);
  const [openConvergence, setOpenConvergence] = useState<boolean>(true);

  // Time slider offset in days from current date (range: -180 days to +730 days)
  const todayMs = new Date().setHours(0, 0, 0, 0);
  const currentTransitMs = new Date(transitDateInput).getTime();
  const initialOffsetDays = Math.round((currentTransitMs - todayMs) / (1000 * 60 * 60 * 24));
  const [sliderOffsetDays, setSliderOffsetDays] = useState<number>(
    isNaN(initialOffsetDays) ? 0 : Math.max(-180, Math.min(730, initialOffsetDays))
  );

  const handleSliderChange = (newDays: number) => {
    setSliderOffsetDays(newDays);
    const targetDate = new Date(Date.now() + newDays * 24 * 60 * 60 * 1000);
    const targetIso = targetDate.toISOString().split('T')[0];
    setTransitDateInput(targetIso);
    if (onDateChange) {
      onDateChange(targetIso);
    }
  };

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onDateChange && transitDateInput) {
      const targetMs = new Date(transitDateInput).getTime();
      const diffDays = Math.round((targetMs - todayMs) / (1000 * 60 * 60 * 24));
      setSliderOffsetDays(Math.max(-180, Math.min(730, diffDays)));
      onDateChange(transitDateInput);
    }
  };

  const quickJumpPresets = [
    { label: isHi ? '⏮ आज (Today)' : '⏮ Today', days: 0 },
    { label: isHi ? '+1 माह (+30d)' : '+1 Month', days: 30 },
    { label: isHi ? '+3 माह (+90d)' : '+3 Months', days: 90 },
    { label: isHi ? '+6 माह (+180d)' : '+6 Months', days: 180 },
    { label: isHi ? '+1 वर्ष (+1y)' : '+1 Year', days: 365 },
    { label: isHi ? '+2 वर्ष (+2y)' : '+2 Years', days: 730 },
  ];

  if (!transitData) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800 font-mono">
        {isHi
          ? 'कोई गोचर डेटा उपलब्ध नहीं। कृपया पहले जन्म कुंडली की गणना करें।'
          : 'No transit calculation data available. Please calculate a birth chart first.'}
      </div>
    );
  }

  const planets = transitData.planets || [];
  const aspects = transitData.aspects || [];
  const conjunctions = transitData.conjunctions || [];
  const domainEvidence = transitData.domainEvidence || {};
  const activeDomainData = domainEvidence[selectedDomain];

  const convergenceDomains = convergenceData?.domainConvergence || {};
  const convergenceSummary = convergenceData?.convergenceSummary || {};

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Interactive Time-Slider & Date Selector Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 p-5 sm:p-6 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-base sm:text-lg font-bold text-cyan-300 uppercase tracking-wider">
                {isHi ? 'दैनिक ग्रहीय गोचर एवं टाइम-स्क्रबर' : 'Interactive Gochar (Transit) Time-Scrubber'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi
                ? 'समय स्लाइडर को ड्रैग करें और भविष्य के गोचर का अपनी कुण्डली पर सीधा प्रभाव देखें।'
                : 'Scrub across timeline to simulate planetary transits and natal house activations in real-time.'}
            </p>
          </div>

          <form onSubmit={handleDateSubmit} className="flex flex-wrap items-center gap-2">
            <label htmlFor="transit-date-input" className="text-xs text-slate-400">
              {isHi ? 'गोचर तिथि:' : 'Target Date:'}
            </label>
            <input
              id="transit-date-input"
              type="date"
              value={transitDateInput}
              onChange={(e) => setTransitDateInput(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              id="btn-update-transit-date"
              type="submit"
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-xl transition disabled:opacity-50 cursor-pointer shadow"
            >
              {isLoading ? (isHi ? 'गणना जारी...' : 'Updating...') : (isHi ? 'गोचर देखें' : 'Evaluate')}
            </button>
          </form>
        </div>

        {/* Interactive Timeline Scrubber Slider */}
        <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{isHi ? 'टाइमलाइन स्लाइडर (-6 माह से +2 वर्ष):' : 'Scrub Future Transits (-6m to +2y):'}</span>
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-400 text-[11px]">Active Target:</span>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-900/60 text-cyan-300 font-bold border border-indigo-700/50">
                {transitDateInput} ({sliderOffsetDays >= 0 ? `+${sliderOffsetDays}d` : `${sliderOffsetDays}d`})
              </span>
            </div>
          </div>

          {/* Slider Input */}
          <div className="relative pt-1">
            <input
              type="range"
              min="-180"
              max="730"
              step="5"
              value={sliderOffsetDays}
              onChange={(e) => handleSliderChange(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 focus:outline-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-6 Months</span>
              <span className="text-cyan-400 font-bold">Today</span>
              <span>+6 Months</span>
              <span>+1 Year</span>
              <span>+2 Years</span>
            </div>
          </div>

          {/* Quick Timeline Preset Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickJumpPresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSliderChange(p.days)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-mono cursor-pointer ${
                  Math.abs(sliderOffsetDays - p.days) <= 4
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-cyan-500/50 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Transit Overview Cards (9 Planets) - Collapsible on Mobile */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-3">
        <div
          onClick={() => setOpenPlanets(!openPlanets)}
          className="flex items-center justify-between cursor-pointer group select-none"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
              {isHi ? 'ग्रहीय गोचर एवं जन्म भाव स्थिति (9 ग्रह)' : 'Planetary Positions & Natal House Positions (9 Planets)'}
            </h3>
          </div>
          <button
            type="button"
            className="p-1 rounded-lg bg-slate-800/80 text-slate-400 group-hover:text-white transition"
          >
            {openPlanets ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {openPlanets && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 animate-in fade-in duration-200">
            {planets.map((p: any) => (
              <div
                key={p.planet}
                id={`transit-card-${p.planet}`}
                className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/90 hover:border-cyan-500/50 transition space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-300 text-sm">{translatePlanet(p.planet)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    p.isRetrograde ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {p.isRetrograde ? (isHi ? 'वक्री' : 'RETROGRADE') : (isHi ? 'मार्गी' : 'DIRECT')}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">
                  {translateSign(p.sign?.name || p.sign)} {p.formattedDegree}
                </div>
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <div>
                    <span className="block text-slate-500 text-[9px]">{isHi ? 'लग्न भाव' : 'Lagna House'}</span>
                    <span className="font-bold text-slate-200">{p.houseFromLagna}{isHi ? 'वां' : 'th'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[9px]">{isHi ? 'चंद्र भाव' : 'Moon House'}</span>
                    <span className="font-bold text-indigo-300">{p.houseFromMoon}{isHi ? 'वां' : 'th'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 text-[9px]">{isHi ? 'नक्षत्र' : 'Nakshatra'}</span>
                    <span className="truncate block font-bold text-emerald-300">{translateNakshatra(p.nakshatra?.name, language) || '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Aspect & Conjunction Explorers Grid - Collapsible on Mobile */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-3">
        <div
          onClick={() => setOpenAspects(!openAspects)}
          className="flex items-center justify-between cursor-pointer group select-none"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              {isHi ? 'शास्त्रीय वैदिक दृष्टि एवं युति अन्वेषक' : 'Classical Vedic Aspects & Conjunctions'}
            </h3>
            <span className="text-xs font-normal text-slate-400">({aspects.length + conjunctions.length} Active)</span>
          </div>
          <button
            type="button"
            className="p-1 rounded-lg bg-slate-800/80 text-slate-400 group-hover:text-white transition"
          >
            {openAspects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {openAspects && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 animate-in fade-in duration-200">
            {/* Aspect Explorer */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex justify-between items-center">
                <span>{isHi ? 'वैदिक दृष्टि (Aspects)' : 'Vedic Aspects'}</span>
                <span className="text-[11px] font-normal text-slate-400">({aspects.length})</span>
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {aspects.map((asp: any, idx: number) => (
                  <div
                    key={idx}
                    id={`aspect-item-${idx}`}
                    onClick={() => setSelectedAspect(asp)}
                    className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-300">{translatePlanet(asp.transitingPlanet, language)}</span>
                      <span className="text-slate-400 px-1">→</span>
                      <span className="font-bold text-indigo-300">{isHi ? `जन्म ${translatePlanet(asp.natalTarget, language)}` : `Natal ${asp.natalTarget}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {asp.aspectType} {isHi ? 'दृष्टि' : 'aspect'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Natal Conjunction Explorer */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex justify-between items-center">
                <span>{isHi ? 'युति अन्वेषक (Conjunctions)' : 'Natal Conjunctions'}</span>
                <span className="text-[11px] font-normal text-slate-400">({conjunctions.length})</span>
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {conjunctions.map((conj: any, idx: number) => (
                  <div
                    key={idx}
                    id={`conjunction-item-${idx}`}
                    onClick={() => setSelectedConjunction(conj)}
                    className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500/40 transition cursor-pointer flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-amber-300">{translatePlanet(conj.transitingPlanet, language)}</span>
                      <span className="text-slate-400 px-1">{isHi ? 'युति' : 'conjunct'}</span>
                      <span className="font-bold text-emerald-300">{isHi ? `जन्म ${translatePlanet(conj.natalPlanet, language)}` : `Natal ${conj.natalPlanet}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        {isHi ? 'दूरी:' : 'Dist:'} {conj.angularDistance}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Domain Transit Evidence Filter - Collapsible on Mobile */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
        <div
          onClick={() => setOpenDomainEvidence(!openDomainEvidence)}
          className="flex items-center justify-between cursor-pointer group select-none"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
              {isHi ? 'जीवन क्षेत्र अनुसार गोचर प्रमाण (Domain Evidence)' : 'Domain-Specific Transit Evidence'}
            </h3>
          </div>
          <button
            type="button"
            className="p-1 rounded-lg bg-slate-800/80 text-slate-400 group-hover:text-white transition"
          >
            {openDomainEvidence ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {openDomainEvidence && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-200">
            <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-3">
              {['CAREER', 'WEALTH', 'RELATIONSHIPS', 'HEALTH', 'EDUCATION', 'PROPERTY', 'SPIRITUALITY'].map((dom) => (
                <button
                  key={dom}
                  id={`filter-domain-${dom.toLowerCase()}`}
                  onClick={() => setSelectedDomain(dom)}
                  className={`text-[11px] px-3 py-1 rounded-lg border transition font-semibold cursor-pointer ${
                    selectedDomain === dom
                      ? 'bg-cyan-600 text-slate-950 border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {translateDomain(dom)}
                </button>
              ))}
            </div>

            {activeDomainData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>{isHi ? 'अनुकूल:' : 'Supportive:'} <strong className="text-emerald-400">+{activeDomainData.supportiveCount}</strong></span>
                  <span>{isHi ? 'बाधक:' : 'Challenging:'} <strong className="text-rose-400">-{activeDomainData.challengingCount}</strong></span>
                  <span>{isHi ? 'तटस्थ:' : 'Neutral:'} <strong className="text-slate-300">{activeDomainData.neutralCount}</strong></span>
                </div>

                {activeDomainData.disclaimer && (
                  <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/60 text-amber-300 text-xs">
                    {activeDomainData.disclaimer}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeDomainData.evidence?.map((item: any) => (
                    <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-amber-300">{translatePlanet(item.planet, language)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          item.direction === 'SUPPORTIVE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {isHi ? (item.direction === 'SUPPORTIVE' ? 'अनुकूल' : 'बाधक') : item.direction}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">
                {isHi ? 'चयनित क्षेत्र के लिए कोई गोचर प्रमाण नहीं मिला।' : 'No transit evidence recorded for selected domain.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Natal–Dasha–Transit Convergence Panel - Collapsible on Mobile */}
      <div className="bg-slate-900/60 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-4">
        <div
          onClick={() => setOpenConvergence(!openConvergence)}
          className="flex items-center justify-between cursor-pointer group select-none"
        >
          <div>
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              {isHi ? 'जन्म–दशा–गोचर संगम विश्लेषण' : 'Natal–Dasha–Transit Convergence Analysis'}
            </h3>
            <p className="text-xs text-slate-400">
              {isHi
                ? 'जन्म कुण्डली, दशा, गोचर और अष्टकवर्ग की समन्वित शास्त्रीय गणना।'
                : 'Cross-engine agreement across Natal, Dasha, Transit, and Ashtakavarga layers.'}
            </p>
          </div>
          <button
            type="button"
            className="p-1 rounded-lg bg-slate-800/80 text-slate-400 group-hover:text-white transition"
          >
            {openConvergence ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {openConvergence && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 animate-in fade-in duration-200">
            {Object.values(convergenceDomains).map((cd: any) => (
              <div
                key={cd.domain}
                id={`convergence-card-${cd.domain}`}
                onClick={() => setSelectedConvergenceDomain(cd)}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer space-y-2 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 text-xs">{translateDomain(cd.domain, language)}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    cd.convergenceLevel === 'HIGH_CONVERGENCE'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : cd.convergenceLevel === 'MIXED_SIGNALS'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}>
                    {isHi
                      ? cd.convergenceLevel === 'HIGH_CONVERGENCE'
                        ? 'उच्च संगम'
                        : cd.convergenceLevel === 'MIXED_SIGNALS'
                        ? 'मिश्रित संकेत'
                        : 'सामान्य स्तर'
                      : cd.convergenceLevel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-500 block">{isHi ? 'जन्म' : 'Natal'}</span>
                    <span className="font-bold text-slate-200">{cd.natalEvidenceCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{isHi ? 'दशा' : 'Dasha'}</span>
                    <span className="font-bold text-indigo-300">{cd.dashaEvidenceCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{isHi ? 'गोचर' : 'Transit'}</span>
                    <span className="font-bold text-cyan-300">{cd.transitEvidenceCount}</span>
                  </div>
                </div>

                <div className="text-[10px] text-cyan-400 underline pt-1 text-right">
                  {isHi ? 'संगम विश्लेषण देखें (WHY?)' : 'WHY? Convergence Explorer'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Aspect WHY Modal */}
      {selectedAspect && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              Vedic Aspect Evidence
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              {selectedAspect.whyEvidence?.map((line: string, i: number) => (
                <p key={i} className="p-2 bg-slate-950 rounded border border-slate-800">{line}</p>
              ))}
            </div>
            <button
              id="close-aspect-modal"
              onClick={() => setSelectedAspect(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Conjunction WHY Modal */}
      {selectedConjunction && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider">
              Natal Conjunction Evidence
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              {selectedConjunction.whyEvidence?.map((line: string, i: number) => (
                <p key={i} className="p-2 bg-slate-950 rounded border border-slate-800">{line}</p>
              ))}
            </div>
            <button
              id="close-conjunction-modal"
              onClick={() => setSelectedConjunction(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Convergence WHY Explorer Modal */}
      {selectedConvergenceDomain && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              {selectedConvergenceDomain.domain} Convergence Trace
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              {selectedConvergenceDomain.whyEvidence?.map((line: string, i: number) => (
                <p key={i} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] leading-relaxed">{line}</p>
              ))}
            </div>
            <button
              id="close-convergence-modal"
              onClick={() => setSelectedConvergenceDomain(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
