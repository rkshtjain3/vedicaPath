'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

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
  const [selectedDomain, setSelectedDomain] = useState<string>('CAREER');
  const [selectedAspect, setSelectedAspect] = useState<any | null>(null);
  const [selectedConjunction, setSelectedConjunction] = useState<any | null>(null);
  const [selectedConvergenceDomain, setSelectedConvergenceDomain] = useState<any | null>(null);
  const [transitDateInput, setTransitDateInput] = useState<string>(
    transitData?.calculationDate?.split('T')[0] || new Date().toISOString().split('T')[0]
  );

  if (!transitData) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800 font-mono">
        {language === 'hi'
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

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onDateChange && transitDateInput) {
      onDateChange(transitDateInput);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Date Selector Header */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h2 className="text-lg font-bold text-cyan-300 uppercase tracking-wider">
              {language === 'hi' ? 'दैनिक ग्रहीय गोचर एवं संगम विश्लेषण' : 'Gochar (Transit) & Convergence Engine'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'hi'
              ? 'जन्म कुंडली के आधार पर वास्तविक समय में निरयण ग्रहीय गोचर स्थिति।'
              : 'Real-time sidereal planetary positions relative to natal chart facts.'}
          </p>
        </div>

        <form onSubmit={handleDateSubmit} className="flex items-center gap-2">
          <label htmlFor="transit-date-input" className="text-xs text-slate-400">
            {language === 'hi' ? 'गोचर तिथि:' : 'Target Transit Date:'}
          </label>
          <input
            id="transit-date-input"
            type="date"
            value={transitDateInput}
            onChange={(e) => setTransitDateInput(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
          />
          <button
            id="btn-update-transit-date"
            type="submit"
            disabled={isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? (language === 'hi' ? 'अद्यतन हो रहा है...' : 'Updating...') : (language === 'hi' ? 'गोचर देखें' : 'Evaluate Date')}
          </button>
        </form>
      </div>

      {/* 2. Transit Overview Cards (9 Planets) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
          {language === 'hi' ? 'ग्रहीय गोचर एवं जन्म भाव स्थिति' : 'Planetary Positions & Natal House Positions'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {planets.map((p: any) => (
            <div
              key={p.planet}
              id={`transit-card-${p.planet}`}
              className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-300 text-sm">{translatePlanet(p.planet)}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  p.isRetrograde ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {p.isRetrograde ? (language === 'hi' ? 'वक्री' : 'RETROGRADE') : (language === 'hi' ? 'मार्गी' : 'DIRECT')}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-semibold">
                {translateSign(p.sign?.name || p.sign)} {p.formattedDegree}
              </div>
              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                <div>
                  <span className="block text-slate-500 text-[9px]">{language === 'hi' ? 'लग्न भाव' : 'Lagna House'}</span>
                  <span className="font-bold text-slate-200">{p.houseFromLagna}{language === 'hi' ? 'वां' : 'th'}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[9px]">{language === 'hi' ? 'चंद्र भाव' : 'Moon House'}</span>
                  <span className="font-bold text-indigo-300">{p.houseFromMoon}{language === 'hi' ? 'वां' : 'th'}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-[9px]">{language === 'hi' ? 'नक्षत्र' : 'Nakshatra'}</span>
                  <span className="truncate block font-bold text-emerald-300">{translateNakshatra(p.nakshatra?.name, language) || '-'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Aspect & Conjunction Explorers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aspect Explorer */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex justify-between items-center">
            <span>{language === 'hi' ? 'शास्त्रीय वैदिक दृष्टि अन्वेषक' : 'Classical Vedic Aspect Explorer'}</span>
            <span className="text-xs font-normal text-slate-400">({aspects.length} {language === 'hi' ? 'सक्रिय' : 'Active'})</span>
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {aspects.map((asp: any, idx: number) => (
              <div
                key={idx}
                id={`aspect-item-${idx}`}
                onClick={() => setSelectedAspect(asp)}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-bold text-amber-300">{translatePlanet(asp.transitingPlanet, language)}</span>
                  <span className="text-slate-400 px-1">→</span>
                  <span className="font-bold text-indigo-300">{language === 'hi' ? `जन्म ${translatePlanet(asp.natalTarget, language)}` : `Natal ${asp.natalTarget}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {asp.aspectType} {language === 'hi' ? 'दृष्टि' : 'aspect'}
                  </span>
                  <span className="text-[10px] text-cyan-400 underline">WHY?</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Natal Conjunction Explorer */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex justify-between items-center">
            <span>{language === 'hi' ? 'युति अन्वेषक (Conjunctions)' : 'Natal Conjunction Explorer'}</span>
            <span className="text-xs font-normal text-slate-400">({conjunctions.length} {language === 'hi' ? 'सक्रिय' : 'Active'})</span>
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {conjunctions.map((conj: any, idx: number) => (
              <div
                key={idx}
                id={`conjunction-item-${idx}`}
                onClick={() => setSelectedConjunction(conj)}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex justify-between items-center text-xs"
              >
                <div>
                  <span className="font-bold text-amber-300">{translatePlanet(conj.transitingPlanet, language)}</span>
                  <span className="text-slate-400 px-1">{language === 'hi' ? 'युति' : 'conjunct'}</span>
                  <span className="font-bold text-emerald-300">{language === 'hi' ? `जन्म ${translatePlanet(conj.natalPlanet, language)}` : `Natal ${conj.natalPlanet}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {language === 'hi' ? 'दूरी:' : 'Dist:'} {conj.angularDistance}°
                  </span>
                  <span className="text-[10px] text-cyan-400 underline">WHY?</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Domain Transit Evidence Filter */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
            {language === 'hi' ? 'जीवन क्षेत्र अनुसार गोचर प्रमाण' : 'Domain-Specific Transit Evidence'}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {['CAREER', 'WEALTH', 'RELATIONSHIPS', 'HEALTH', 'EDUCATION', 'PROPERTY', 'SPIRITUALITY'].map((dom) => (
              <button
                key={dom}
                id={`filter-domain-${dom.toLowerCase()}`}
                onClick={() => setSelectedDomain(dom)}
                className={`text-[11px] px-3 py-1 rounded-lg border transition font-semibold ${
                  selectedDomain === dom
                    ? 'bg-cyan-600 text-slate-950 border-cyan-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {translateDomain(dom)}
              </button>
            ))}
          </div>
        </div>

        {activeDomainData ? (
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>{language === 'hi' ? 'अनुकूल:' : 'Supportive:'} <strong className="text-emerald-400">+{activeDomainData.supportiveCount}</strong></span>
              <span>{language === 'hi' ? 'बाधक:' : 'Challenging:'} <strong className="text-rose-400">-{activeDomainData.challengingCount}</strong></span>
              <span>{language === 'hi' ? 'तटस्थ:' : 'Neutral:'} <strong className="text-slate-300">{activeDomainData.neutralCount}</strong></span>
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
                      {language === 'hi' ? (item.direction === 'SUPPORTIVE' ? 'अनुकूल' : 'बाधक') : item.direction}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic">
            {language === 'hi' ? 'चयनित क्षेत्र के लिए कोई गोचर प्रमाण नहीं मिला।' : 'No transit evidence recorded for selected domain.'}
          </div>
        )}
      </div>

      {/* 5. Natal–Dasha–Transit Convergence Panel */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
              {language === 'hi' ? 'जन्म–दशा–गोचर संगम विश्लेषण' : 'Natal–Dasha–Transit Convergence Analysis'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'जन्म कुण्डली, दशा, गोचर और अष्टकवर्ग की समन्वित शास्त्रीय गणना।'
                : 'Cross-engine agreement across Natal, Dasha, Transit, and Ashtakavarga layers.'}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            {language === 'hi' ? 'दोहरी गणना-मुक्त (Anti-Double-Counting)' : 'Anti-Double-Counting Enforced'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(convergenceDomains).map((cd: any) => (
            <div
              key={cd.domain}
              id={`convergence-card-${cd.domain}`}
              onClick={() => setSelectedConvergenceDomain(cd)}
              className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer space-y-2"
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
                  {language === 'hi'
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
                  <span className="text-slate-500 block">{language === 'hi' ? 'जन्म' : 'Natal'}</span>
                  <span className="font-bold text-slate-200">{cd.natalEvidenceCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{language === 'hi' ? 'दशा' : 'Dasha'}</span>
                  <span className="font-bold text-indigo-300">{cd.dashaEvidenceCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{language === 'hi' ? 'गोचर' : 'Transit'}</span>
                  <span className="font-bold text-cyan-300">{cd.transitEvidenceCount}</span>
                </div>
              </div>
              <div className="text-[10px] text-cyan-400 underline pt-1 text-right">
                {language === 'hi' ? 'संगम विश्लेषण देखें (WHY?)' : 'WHY? Convergence Explorer'}
              </div>
            </div>
          ))}
        </div>
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
