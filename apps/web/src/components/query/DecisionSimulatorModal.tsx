'use client';

import React, { useState, useMemo } from 'react';
import {
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Compass,
  CheckCircle2,
  X,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface DecisionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculationData: any;
  onRunSimulationInChat: (query: string) => void;
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export function DecisionSimulatorModal({
  isOpen,
  onClose,
  calculationData,
  onRunSimulationInChat,
}: DecisionSimulatorModalProps) {
  const { language } = useI18n();
  const isHi = language === 'hi';

  const astro = calculationData?.astrology || {};
  const dasha = calculationData?.dasha || {};
  const jaimini = calculationData?.jaimini || {};
  const ashtakavarga = calculationData?.ashtakavarga || {};

  const lagnaSign = astro.lagna?.sign?.name || astro.ascendant?.sign || 'Aries';
  const activeMaha = dasha.current?.mahadasha?.planet || dasha.current?.mahadasha?.lord || 'Sun';
  const activeAntar = dasha.current?.antardasha?.planet || dasha.current?.antardasha?.lord || 'Moon';
  const amk = jaimini.charaKarakas?.find((k: any) => k.karaka === 'AmK')?.planet || 'Mercury';

  // State
  const [optionA, setOptionA] = useState('Start New Venture / High-Growth Strategic Role');
  const [optionB, setOptionB] = useState('Continue in Current Safe Salaried Position');
  const [decisionDomain, setDecisionDomain] = useState<'CAREER' | 'RELOCATION' | 'FINANCE'>('CAREER');
  const [hasSimulated, setHasSimulated] = useState(false);

  // Dynamic simulation computation from user chart
  const { scoreA, scoreB, differentialText, reasonA, reasonB } = useMemo(() => {
    const lagnaIdx = Math.max(0, ZODIAC_SIGNS.indexOf(lagnaSign));
    const tenthSign = ZODIAC_SIGNS[(lagnaIdx + 9) % 12];
    const eleventhSign = ZODIAC_SIGNS[(lagnaIdx + 10) % 12];
    const twelfthSign = ZODIAC_SIGNS[(lagnaIdx + 11) % 12];
    const fourthSign = ZODIAC_SIGNS[(lagnaIdx + 3) % 12];
    const ninthSign = ZODIAC_SIGNS[(lagnaIdx + 8) % 12];

    const sav = ashtakavarga?.sav?.signPoints || {};
    const tenthPts = sav[tenthSign] || 28;
    const eleventhPts = sav[eleventhSign] || 28;
    const twelfthPts = sav[twelfthSign] || 28;
    const fourthPts = sav[fourthSign] || 28;
    const ninthPts = sav[ninthSign] || 28;

    let sA = 78;
    let sB = 70;
    let rA = '';
    let rB = '';

    if (decisionDomain === 'CAREER') {
      sA = Math.min(96, Math.max(60, Math.round(62 + (tenthPts - 28) * 3.5 + (eleventhPts - 28) * 2)));
      sB = Math.min(88, Math.max(52, Math.round(70 - (tenthPts - 28) * 1.5)));
      rA = isHi
        ? `दशम भाव (${tenthSign}, ${tenthPts} बिंदु) और अमात्यकारक (${amk}) का प्रबल प्रभाव; दीर्घकालिक साख व स्वायत्तता निर्माण।`
        : `Strong 10th house (${tenthSign}, ${tenthPts} SAV bindus) & Amatyakaraka (${amk}) resonance; compounds authority.`;
      rB = isHi
        ? `तात्कालिक सुरक्षा देता है परंतु ${activeMaha}-${activeAntar} दशा में विकास की गति सीमित हो सकती है।`
        : `Provides short-term comfort but caps sovereign leverage under active ${activeMaha}-${activeAntar} cycle.`;
    } else if (decisionDomain === 'RELOCATION') {
      sA = Math.min(95, Math.max(58, Math.round(60 + (twelfthPts - 28) * 3.5 + (ninthPts - 28) * 2.5)));
      sB = Math.min(86, Math.max(54, Math.round(72 - (twelfthPts - 28) * 1.5)));
      rA = isHi
        ? `द्वादश भाव (${twelfthSign}, ${twelfthPts} बिंदु) व नवम भाव (${ninthSign}) वैश्विक क्षितिज व अंतरराष्ट्रीय गतिशीलता को सशक्त करते हैं।`
        : `12th house (${twelfthSign}, ${twelfthPts} bindus) & 9th house (${ninthSign}) activate global residency and foreign expansion.`;
      rB = isHi
        ? `स्थानीय आधार बनाए रखता है, परंतु वैश्विक अनुभवों से मिलने वाले लाभ को सीमित करता है।`
        : `Maintains local comfort but delays international network capitalization.`;
    } else {
      sA = Math.min(94, Math.max(60, Math.round(58 + (fourthPts - 28) * 3.5 + (eleventhPts - 28) * 2)));
      sB = Math.min(90, Math.max(55, Math.round(66 + (eleventhPts - 28) * 2)));
      rA = isHi
        ? `चतुर्थ भाव (${fourthSign}, ${fourthPts} बिंदु) और लाभ भाव (${eleventhSign}, ${eleventhPts} बिंदु) से अचल संपत्ति में स्थायित्व।`
        : `4th house (${fourthSign}, ${fourthPts} bindus) & 11th house (${eleventhSign}, ${eleventhPts} bindus) favor tangible asset compounding.`;
      rB = isHi
        ? `तरल पूंजी में वृद्धि, परंतु अचल संपत्ति के दीर्घकालिक सुरक्षा मूल्य से वंचित रह सकते हैं।`
        : `Liquid flexibility is high, but misses the physical land anchorage of the 4th house.`;
    }

    const diff = sA - sB;
    const diffTxt = diff >= 0
      ? `Option A +${diff}% Planetary Leverage`
      : `Option B +${Math.abs(diff)}% Planetary Leverage`;

    return { scoreA: sA, scoreB: sB, differentialText: diffTxt, reasonA: rA, reasonB: rB };
  }, [lagnaSign, activeMaha, activeAntar, amk, ashtakavarga, decisionDomain, isHi]);

  if (!isOpen) return null;

  // Preset scenarios
  const presets = [
    {
      title: isHi ? 'नौकरी बनाम व्यापार' : 'Job vs Business / Venture',
      a: isHi ? 'स्वयं का व्यवसाय / स्टार्टअप शुरू करना' : 'Found Independent Venture / Startup',
      b: isHi ? 'वर्तमान सुरक्षित कॉर्पोरेट नौकरी में रहना' : 'Stay in Stable Corporate Job',
      domain: 'CAREER' as const,
    },
    {
      title: isHi ? 'विदेश स्थानांतरण बनाम भारत' : 'Overseas Relocation vs India Tech Lead',
      a: isHi ? 'अमेरिका / यूरोप में विदेशी अवसर स्वीकार करना' : 'Accept Overseas Role in US / Europe',
      b: isHi ? 'भारत में रहकर सीनियर लीडरशिप संभालना' : 'Stay in India for Senior Leadership',
      domain: 'RELOCATION' as const,
    },
    {
      title: isHi ? 'संपत्ति क्रय बनाम इक्विटी निवेश' : 'Real Estate Asset vs Equity Growth',
      a: isHi ? 'अचल संपत्ति / मकान में बड़ा निवेश' : 'Invest Heavily in Real Estate / Flat',
      b: isHi ? 'तरल इक्विटी व इंडेक्स फंड्स में संचय' : 'Systematic Liquid Equity & Index Allocation',
      domain: 'FINANCE' as const,
    },
  ];

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSimulated(true);
  };

  const handleSendToAI = () => {
    const prompt = isHi
      ? `रणनीतिक निर्णय सिम्युलेटर: कृपया विकल्प A ("${optionA}") और विकल्प B ("${optionB}") की मेरी जन्म कुंडली (लग्न ${lagnaSign}, महादशा ${activeMaha}-${activeAntar}, अमात्यकारक ${amk}) के अनुसार विस्तृत तुलना करें।`
      : `Decision Simulator: Compare Option A ("${optionA}") vs Option B ("${optionB}") for my chart (Lagna: ${lagnaSign}, Dasha: ${activeMaha}-${activeAntar}, Amatyakaraka: ${amk}).`;
    onRunSimulationInChat(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-indigo-500/20 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-amber-400/40">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-400">
                {isHi ? 'वैदिक निर्णय सिम्युलेटर' : 'Vedica Strategic "What-If" Simulator'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 font-mono">
                {activeMaha}-{activeAntar} Dasha
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-100">
              {isHi ? 'विकल्प A बनाम विकल्प B का ग्रहीय विश्लेषण' : 'Simulate Strategic Decisions & Paths'}
            </h3>
          </div>
        </div>

        {/* Preset Quick Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {isHi ? 'त्वरित परिदृश्य चुनें (Presets):' : 'Popular Decision Scenarios:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setOptionA(p.a);
                  setOptionB(p.b);
                  setDecisionDomain(p.domain);
                  setHasSimulated(true);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-400/50 text-slate-300 transition"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSimulate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Option A */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>{isHi ? 'विकल्प A (स्वायत्त / महत्वाकांक्षी)' : 'OPTION A (High Growth / Strategic)'}</span>
                <Zap className="w-3.5 h-3.5" />
              </div>
              <textarea
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                rows={3}
                className="w-full bg-slate-950/80 border border-emerald-900/60 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-400 transition"
                placeholder={isHi ? 'पहला विकल्प दर्ज करें...' : 'Describe Option A...'}
              />
            </div>

            {/* Option B */}
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                <span>{isHi ? 'विकल्प B (सुरक्षित / पारंपरिक)' : 'OPTION B (Safe / Incremental)'}</span>
                <Compass className="w-3.5 h-3.5" />
              </div>
              <textarea
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                rows={3}
                className="w-full bg-slate-950/80 border border-indigo-900/60 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-400 transition"
                placeholder={isHi ? 'दूसरा विकल्प दर्ज करें...' : 'Describe Option B...'}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{isHi ? 'ग्रहीय तुलना गणना करें' : 'Compute Astrological Alignment'}</span>
            </button>
          </div>
        </form>

        {/* Simulation Output Card */}
        {hasSimulated && (
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>{isHi ? 'तुलनात्मक स्कोरकार्ड एवं निष्कर्ष' : 'Astrological Scorecard & Differential'}</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {differentialText}
              </span>
            </div>

            {/* Visual Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
                <div className="flex justify-between text-xs font-semibold text-emerald-300">
                  <span>Option A (Strategic Mastery)</span>
                  <span className="font-bold">{scoreA}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${scoreA}%` }} />
                </div>
                <p className="text-[11px] text-slate-400">
                  {reasonA}
                </p>
              </div>

              <div className="space-y-1.5 bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/20">
                <div className="flex justify-between text-xs font-semibold text-indigo-300">
                  <span>Option B (Safe Routine)</span>
                  <span className="font-bold">{scoreB}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{ width: `${scoreB}%` }} />
                </div>
                <p className="text-[11px] text-slate-400">
                  {reasonB}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-amber-300">
                <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  {isHi
                    ? 'सिफारिश: अपनी दीर्घकालिक स्वायत्तता और दुर्लभ कौशल को प्राथमिकता दें।'
                    : 'Recommendation: Favor the sovereign path that maximizes craft compounding.'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSendToAI}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                <span>{isHi ? 'वेदिका एआई से विस्तृत विश्लेषण लें' : 'Deep Dive with Vedica AI'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

