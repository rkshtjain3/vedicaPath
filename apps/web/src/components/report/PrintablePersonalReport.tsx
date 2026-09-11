'use client';

import React from 'react';
import { buildPrintableReportViewModel } from '@vedica/report-export';
import { NorthIndianChart, SouthIndianChart } from '@vedica/chart-renderer';
import { Printer, ShieldCheck, FileText, Sparkles, AlertCircle, Compass } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface PrintablePersonalReportProps {
  calculationResult: any;
  userProfile?: { fullName?: string };
}

const formatNum = (val: any): React.ReactNode => {
  if (val === undefined || val === null) return '-';
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && typeof val.finalNumber === 'number') return val.finalNumber;
  return '-';
};

export const PrintablePersonalReport: React.FC<PrintablePersonalReportProps> = ({
  calculationResult,
  userProfile,
}) => {
  const { t, language, translateSign, translatePlanet, translateDomain, translateDomainState } = useI18n();
  const reportVM = buildPrintableReportViewModel(calculationResult, userProfile);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-slate-100">
      {/* Non-Printable Header Bar */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            {t('report.title')}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {t('report.subtitle')}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          {t('report.print_btn')}
        </button>
      </div>

      {/* Printable Report Root Container */}
      <div className="printable-report bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-10 shadow-2xl">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-wrap justify-between items-start gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase block mb-1">
              Vedica Astrology Engine • Personal Report
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {reportVM.profile.fullName || 'Personal Astrology Report'}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Generated: {new Date(reportVM.generatedAt).toLocaleDateString()} at{' '}
              {new Date(reportVM.generatedAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="bg-slate-900 px-4 py-3 rounded-xl border border-slate-800 text-right font-mono text-xs">
            <span className="text-slate-500 text-[10px] uppercase block">Reproducibility Hash</span>
            <span className="text-amber-400 font-bold text-xs">{reportVM.audit.reproducibilityHash}</span>
          </div>
        </div>

        {/* Section 1: Profile Summary */}
        <section className="printable-section space-y-3">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            {t('report.sec1')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">
                {language === 'hi' ? 'नाम' : 'Name'}
              </span>
              <span className="text-slate-200 font-bold">{reportVM.profile.fullName || (language === 'hi' ? 'उपलब्ध नहीं' : 'Not Provided')}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">
                {language === 'hi' ? 'जन्म तिथि' : 'Date of Birth'}
              </span>
              <span className="text-slate-200 font-bold">{reportVM.profile.dateOfBirth}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">
                {language === 'hi' ? 'जन्म समय' : 'Time of Birth'}
              </span>
              <span className="text-slate-200 font-bold">{reportVM.profile.timeOfBirth}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">
                {language === 'hi' ? 'स्थान' : 'Location'}
              </span>
              <span className="text-slate-200 font-bold">{reportVM.profile.locationName}</span>
            </div>
          </div>
        </section>

        {/* Section 2: Calculation Configuration */}
        <section className="printable-section space-y-3">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            {t('report.sec2')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Zodiac</span>
              <span className="text-indigo-300 font-bold">{reportVM.config.zodiac}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Ayanamsha</span>
              <span className="text-indigo-300 font-bold">{reportVM.config.ayanamsha}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">House System</span>
              <span className="text-indigo-300 font-bold">{reportVM.config.houseSystem}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Node Type</span>
              <span className="text-indigo-300 font-bold">{reportVM.config.nodeType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">IANA Timezone</span>
              <span className="text-slate-300 font-bold">{reportVM.config.timezone}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block text-[10px] uppercase">Resolved UTC Instant</span>
              <span className="text-slate-300 font-bold">{reportVM.config.utcInstantIso}</span>
            </div>
          </div>
        </section>

        {/* Section 3: Birth Chart Overview (D1) */}
        <section className="printable-section space-y-4">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            {t('report.sec3')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <div className="md:col-span-6 max-w-[360px] mx-auto print-break-inside-avoid">
              <NorthIndianChart viewModel={reportVM.charts.d1} />
            </div>
            <div className="md:col-span-6 space-y-3 text-xs font-mono">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase">{language === 'hi' ? 'लग्न (Ascendant)' : 'Ascendant (Lagna)'}</span>
                <span className="text-amber-300 font-bold text-sm">
                  {translateSign(reportVM.charts.d1.ascendantSign, language)} {language === 'hi' ? 'लग्न' : 'Lagna'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="p-1.5">{language === 'hi' ? 'ग्रह' : 'Planet'}</th>
                      <th className="p-1.5">{language === 'hi' ? 'राशि' : 'Sign'}</th>
                      <th className="p-1.5">{language === 'hi' ? 'भाव' : 'House'}</th>
                      <th className="p-1.5">{language === 'hi' ? 'अंश' : 'Longitude'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {reportVM.charts.d1.planets.map((p) => (
                      <tr key={p.planet}>
                        <td className="p-1.5 font-bold text-indigo-300">{translatePlanet(p.planet, language)}</td>
                        <td className="p-1.5">{translateSign(p.sign, language)}</td>
                        <td className="p-1.5">{language === 'hi' ? `${p.house}वां` : `H${p.house}`}</td>
                        <td className="p-1.5 font-mono">{p.formattedDegree}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Divisional Charts (D9 & D10) */}
        <section className="printable-section space-y-4 print-page-break-before">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            {t('report.sec4')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 text-center space-y-2 print-break-inside-avoid">
              <h3 className="text-xs font-bold text-indigo-300 font-mono uppercase">D9 Navamsa Chart</h3>
              <div className="max-w-[320px] mx-auto">
                <NorthIndianChart viewModel={reportVM.charts.d9} />
              </div>
            </div>
            <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 text-center space-y-2 print-break-inside-avoid">
              <h3 className="text-xs font-bold text-indigo-300 font-mono uppercase">D10 Dashamsa Chart</h3>
              <div className="max-w-[320px] mx-auto">
                <NorthIndianChart viewModel={reportVM.charts.d10} />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Planetary Strength */}
        <section className="printable-section space-y-3">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            {t('report.sec5')}
          </h2>
          <div className="overflow-x-auto bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="p-2">{language === 'hi' ? 'ग्रह' : 'Planet'}</th>
                  <th className="p-2">{language === 'hi' ? 'समग्र बल' : 'Overall Strength'}</th>
                  <th className="p-2">{language === 'hi' ? 'षड्बल (विरूपा)' : 'Shadbala (Virupas)'}</th>
                  <th className="p-2">{language === 'hi' ? 'गणना स्थिति' : 'Implementation Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {reportVM.strengths.map((s) => (
                  <tr key={s.planet}>
                    <td className="p-2 font-bold text-indigo-300">{translatePlanet(s.planet, language)}</td>
                    <td className="p-2 text-slate-200">{s.classification || 'Neutral'}</td>
                    <td className="p-2 text-amber-300 font-bold">{s.shadbalaVirupas ? `${s.shadbalaVirupas} V` : '-'}</td>
                    <td className="p-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {language === 'hi' ? 'प्रमाणित' : s.implementationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: Classical Yogas */}
        <section className="printable-section space-y-3">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            {t('report.sec6')}
          </h2>
          <div className="space-y-2 font-mono text-xs">
            {reportVM.yogas.map((y) => (
              <div key={y.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-amber-300">{y.name} ({y.category})</h4>
                  <p className="text-slate-400 text-[11px] mt-1">{y.whyEvidence.join(' • ')}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DETECTED
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Domain Reports */}
        <section className="printable-section space-y-4">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            {t('report.sec7')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportVM.domains.map((d, idx) => (
              <div key={`dom-${idx}`} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="font-bold text-sm text-indigo-300 font-mono">{d.title}</h3>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">{d.summary}</p>
                <div className="text-[11px] font-mono text-slate-400">
                  <strong className="text-emerald-400">Evidence:</strong> {d.supportingEvidence.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7.5: Detailed 7 Life Domain Rule Synthesis */}
        {reportVM.lifeDomains && reportVM.lifeDomains.domains && (
          <section className="printable-section space-y-4">
            <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
              {language === 'hi'
                ? '७.५. विस्तृत ७ जीवन आयाम विश्लेषण'
                : '7.5. Detailed 7 Life Domain Synthesis (@vedica/life-domain-engine)'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {Object.entries(reportVM.lifeDomains.domains).map(([domKey, domObj]: [string, any]) => (
                <div key={domKey} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-indigo-300 text-sm">
                      {language === 'hi' ? translateDomain(domKey, language) : domObj.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {language === 'hi' ? translateDomainState(domObj.state, language) : domObj.state}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{domObj.summary}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>{language === 'hi' ? 'अनुकूल:' : 'Support:'} +{domObj.scoring?.supportScore}</span>
                    <span>{language === 'hi' ? 'बाधक:' : 'Challenge:'} -{domObj.scoring?.challengeScore}</span>
                    <span>{language === 'hi' ? 'विश्वास स्तर:' : 'Confidence:'} {domObj.confidence?.level}</span>
                  </div>
                  {domObj.disclaimer && (
                    <p className="text-[10px] text-amber-400 italic pt-1 border-t border-slate-800/60">
                      {domObj.disclaimer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 8: Timing Context */}
        <section className="printable-section space-y-3">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            {t('report.sec8')}
          </h2>
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex flex-wrap gap-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">
                  {language === 'hi' ? 'वर्तमान महादशा' : 'Current Mahadasha'}
                </span>
                <span className="text-amber-300 font-bold">{translatePlanet(reportVM.timing.currentMahadasha, language) || 'Moon'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">
                  {language === 'hi' ? 'वर्तमान अंतर्दशा' : 'Current Antardasha'}
                </span>
                <span className="text-indigo-300 font-bold">{translatePlanet(reportVM.timing.currentAntardasha, language) || 'Jupiter'}</span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] pt-2 border-t border-slate-800">
              {reportVM.timing.transitSummary}
            </p>
          </div>
        </section>

        {/* Section 8.5: Evidence-Based Timing Windows */}
        {reportVM.timelineSynthesis && (
          <section className="printable-section space-y-3">
            <h2 className="text-base font-bold text-cyan-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
              {language === 'hi'
                ? '८.५. बहु-स्तरीय कालक्रम एवं प्रमाण-आधारित समय-सीमाएं'
                : '8.5. Multi-Level Timeline & Evidence-Based Timing Windows'}
            </h2>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                <strong>Non-Guarantee Policy:</strong> These periods identify configured astrological indicators that are contextually emphasized according to the implemented Dasha and transit framework. They do not guarantee specific events.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportVM.timelineSynthesis.timingWindows?.slice(0, 6).map((win: any) => (
                  <div key={win.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-200">{language === 'hi' ? translateDomain(win.domain, language) : win.domain}</span>
                      <span className="text-[10px] text-cyan-400 font-semibold">{win.contextClass}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Support: +{win.supportScore} | Challenge: -{win.challengeScore} | Points: {win.evidenceCount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 8.6: Current Transit Context & Convergence */}
        {reportVM.transitSynthesis && (
          <section className="printable-section space-y-3">
            <h2 className="text-base font-bold text-cyan-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
              {language === 'hi'
                ? '८.६. वर्तमान गोचर एवं जन्म-दशा-गोचर संगम'
                : '8.6. Current Transit (Gochar) & Natal–Dasha–Transit Convergence'}
            </h2>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-3">
              <div className="flex flex-wrap justify-between text-[11px] text-slate-400">
                <span>Calculation Date: {new Date(reportVM.transitSynthesis.calculationDate).toLocaleDateString()}</span>
                <span>Profile: {reportVM.transitSynthesis.profileVersion}</span>
                <span>Hash: <span className="text-cyan-400 font-bold">{reportVM.transitSynthesis.reproducibilityHash?.substring(0, 12)}...</span></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                {reportVM.transitSynthesis.planets?.slice(0, 6).map((p: any) => (
                  <div key={p.planet} className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                    <span className="font-bold text-amber-300">{translatePlanet(p.planet, language)}</span>
                    <span className="text-slate-300">{translateSign(p.sign?.name || p.sign, language)} ({p.houseFromLagna}th house)</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-amber-300 leading-relaxed italic">
                Disclaimer: Transits reflect current planetary positions relative to birth chart facts. They do not constitute deterministic predictions or guaranteed outcomes.
              </div>
            </div>
          </section>
        )}

        {/* Section 9: Numerology */}
        <section className="printable-section space-y-3">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            {t('report.sec9')}
          </h2>
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs font-mono space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">
                  {language === 'hi' ? 'भाग्यांक (Life Path)' : 'Life Path Number'}
                </span>
                <span className="text-amber-300 font-bold text-sm">{formatNum(reportVM.numerology.lifePath)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">
                  {language === 'hi' ? 'मूलांक (Birthday)' : 'Birthday Number'}
                </span>
                <span className="text-indigo-300 font-bold text-sm">{formatNum(reportVM.numerology.birthday)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">
                  {language === 'hi' ? 'स्वभाव अंक (Attitude)' : 'Attitude Number'}
                </span>
                <span className="text-purple-300 font-bold text-sm">{formatNum(reportVM.numerology.attitude)}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">
                  {language === 'hi' ? 'व्यक्तिगत वर्ष (Personal Year)' : 'Personal Year'}
                </span>
                <span className="text-emerald-300 font-bold text-sm">{formatNum(reportVM.numerology.personalYear)}</span>
              </div>
            </div>

            {reportVM.numerology.hasNameNumerology ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">
                    {language === 'hi' ? 'नामांक / भाग्य (Destiny)' : 'Expression / Destiny'}
                  </span>
                  <span className="text-cyan-300 font-bold text-sm">{formatNum(reportVM.numerology.expressionNumber)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">
                    {language === 'hi' ? 'आत्म-प्रेरणा (Soul Urge)' : 'Soul Urge / Heart'}
                  </span>
                  <span className="text-rose-300 font-bold text-sm">{formatNum(reportVM.numerology.soulUrgeNumber)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">
                    {language === 'hi' ? 'व्यक्तित्व अंक (Personality)' : 'Personality Number'}
                  </span>
                  <span className="text-amber-300 font-bold text-sm">{formatNum(reportVM.numerology.personalityNumber)}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-[11px]">
                {reportVM.numerology.note}
              </div>
            )}
          </div>
        </section>

        {/* Section 10: Evidence, Methodology & Audit Footer */}
        <section className="printable-section space-y-3 border-t-2 border-indigo-500/30 pt-6">
          <h2 className="text-base font-bold text-indigo-300 font-mono uppercase tracking-wider">
            {t('report.sec10')}
          </h2>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Input Fingerprint</span>
                <span className="text-slate-300 font-bold break-all">{reportVM.audit.inputFingerprint}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Reproducibility Hash</span>
                <span className="text-amber-400 font-bold break-all">{reportVM.audit.reproducibilityHash}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase mb-1">Engine Package Versions</span>
              <div className="flex flex-wrap gap-2 text-[10px]">
                {Object.entries(reportVM.audit.engineProfileVersions).map(([pkg, ver]) => (
                  <span key={pkg} className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-indigo-300">
                    {pkg}: {ver}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 space-y-1">
              {reportVM.audit.limitations.map((lim, idx) => (
                <p key={`lim-${idx}`}>• {lim}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Section 11: Appendix - Evidence Questions Explored */}
        {reportVM.queryAnswers && reportVM.queryAnswers.length > 0 && (
          <section className="printable-section space-y-4 border-t-2 border-amber-500/30 pt-6">
            <h2 className="text-base font-bold text-amber-400 font-mono uppercase tracking-wider">
              {language === 'hi' ? '११. परिशिष्ट — अन्वेषित प्रमाण प्रश्न' : '11. Appendix — Evidence Questions Explored'}
            </h2>
            <div className="space-y-4">
              {reportVM.queryAnswers.map((qa: any, idx: number) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">&ldquo;{qa.question}&rdquo;</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      {qa.intent?.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{qa.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
