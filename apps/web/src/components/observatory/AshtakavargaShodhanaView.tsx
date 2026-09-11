'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info,
  BookOpen,
  Activity,
  CheckCircle,
  TrendingDown,
  Sun,
  Moon,
  Flame,
  Award,
  Anchor,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PlanetaryShodhana {
  planet: string;
  rawPoints: Record<string, number>;
  trikonaPoints: Record<string, number>;
  ekadhipatyaPoints: Record<string, number>;
  rashiPinda: number;
  grahaPinda: number;
  shodhyaPinda: number;
  explanation: string[];
}

interface ShodhanaResult {
  trikonaShodhana: Record<string, Record<string, number>>;
  ekadhipatyaShodhana: Record<string, Record<string, number>>;
  savTrikona: Record<string, number>;
  savEkadhipatya: Record<string, number>;
  planetaryPindas: Record<string, PlanetaryShodhana>;
  totalSarvaShodhyaPinda: number;
}

interface AshtakavargaShodhanaProps {
  shodhanaData?: ShodhanaResult;
  rawSavPoints?: Record<string, number>;
}

const RASHIS = [
  { name: 'Aries', hindi: 'मेष', id: 1, element: 'Fire', trine: '1, 5, 9' },
  { name: 'Taurus', hindi: 'वृषभ', id: 2, element: 'Earth', trine: '2, 6, 10' },
  { name: 'Gemini', hindi: 'मिथुन', id: 3, element: 'Air', trine: '3, 7, 11' },
  { name: 'Cancer', hindi: 'कर्क', id: 4, element: 'Water', trine: '4, 8, 12' },
  { name: 'Leo', hindi: 'सिंह', id: 5, element: 'Fire', trine: '1, 5, 9' },
  { name: 'Virgo', hindi: 'कन्या', id: 6, element: 'Earth', trine: '2, 6, 10' },
  { name: 'Libra', hindi: 'तुला', id: 7, element: 'Air', trine: '3, 7, 11' },
  { name: 'Scorpio', hindi: 'वृश्चिक', id: 8, element: 'Water', trine: '4, 8, 12' },
  { name: 'Sagittarius', hindi: 'धनु', id: 9, element: 'Fire', trine: '1, 5, 9' },
  { name: 'Capricorn', hindi: 'मकर', id: 10, element: 'Earth', trine: '2, 6, 10' },
  { name: 'Aquarius', hindi: 'कुम्भ', id: 11, element: 'Air', trine: '3, 7, 11' },
  { name: 'Pisces', hindi: 'मीन', id: 12, element: 'Water', trine: '4, 8, 12' },
];

const PLANETS = ['SUN', 'MOON', 'MARS', 'MERCURY', 'JUPITER', 'VENUS', 'SATURN'];

export const AshtakavargaShodhanaView: React.FC<AshtakavargaShodhanaProps> = ({
  shodhanaData,
  rawSavPoints,
}) => {
  const { language, translatePlanet } = useI18n();
  const [selectedPlanet, setSelectedPlanet] = useState<string>('SUN');

  if (!shodhanaData || !shodhanaData.planetaryPindas) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <Activity className="w-12 h-12 mx-auto mb-3 text-cyan-400 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-200">
          {language === 'hi' ? 'अष्टकवर्ग शोधन डेटा उपलब्ध नहीं' : 'Ashtakavarga Reductions Not Available'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {language === 'hi'
            ? 'कुंडली की पुनः गणना करें।'
            : 'Recalculate birth chart to load classical Shodhanas & Shodhya Pinda.'}
        </p>
      </div>
    );
  }

  const pinda = shodhanaData.planetaryPindas[selectedPlanet];

  return (
    <div className="space-y-6" id="ashtakavarga-shodhana-container">
      {/* 1. HERO BANNER: SHODHYA PINDA OVERVIEW */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                {language === 'hi'
                  ? 'शास्त्रीय अष्टकवर्ग शोधन एवं शोध्य पिण्ड'
                  : 'Classical Ashtakavarga Reductions & Shodhya Pinda'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1 tracking-tight">
              {language === 'hi' ? 'त्रिकोण एवं एकाधिपत्य शोधन' : 'Trikona & Ekadhipatya Shodhana'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {language === 'hi'
                ? 'बृहत् पराशर होरा शास्त्र के अनुसार अष्टकवर्ग बिंदुओं का गणितीय शोधन एवं ७ ग्रहों का शोध्य पिण्ड।'
                : 'Canonical reduction of raw Ashtakavarga bindus across trines and dual-lordships to calculate pure Shodhya Pinda.'}
            </p>
          </div>

          <div className="bg-slate-950/80 px-5 py-3 rounded-2xl border border-amber-500/30 text-right">
            <div className="text-[11px] font-mono text-slate-400">
              {language === 'hi' ? 'सर्व शोध्य पिण्ड (कुल):' : 'Total Sarva Shodhya Pinda:'}
            </div>
            <div className="text-2xl font-black text-amber-400">
              {shodhanaData.totalSarvaShodhyaPinda} <span className="text-xs font-normal text-slate-400">pts</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 justify-end">
              <CheckCircle className="w-3 h-3" />
              {language === 'hi' ? 'शुद्ध पराशरी गणित' : 'Parashara Verified'}
            </div>
          </div>
        </div>

        {/* Planetary Pinda Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {PLANETS.map((planetKey) => {
            const p = shodhanaData.planetaryPindas[planetKey];
            const isSelected = selectedPlanet === planetKey;
            return (
              <div
                key={planetKey}
                id={`pinda-planet-card-${planetKey.toLowerCase()}`}
                onClick={() => setSelectedPlanet(planetKey)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/40 scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold text-slate-300 block">
                    {translatePlanet(planetKey)}
                  </span>
                  <div className="text-lg font-black text-amber-400 mt-1">
                    {p?.shodhyaPinda || 0}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/80 mt-2 flex justify-between">
                  <span>R:{p?.rashiPinda}</span>
                  <span>G:{p?.grahaPinda}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. THREE-STAGE REDUCTION TABLE FOR SELECTED PLANET */}
      {pinda && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                {language === 'hi'
                  ? `${translatePlanet(selectedPlanet)}: ३-चरणीय शोधन तालिका`
                  : `${selectedPlanet}: 3-Stage Reduction Matrix`}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'hi'
                  ? 'मूल बिंदु → त्रिकोण शोधन (त्रिकोणों का न्यूनतम घटाव) → एकाधिपत्य शोधन (ग्रह स्थिति आधार)'
                  : 'Raw BAV → Trikona Shodhana (Trine minimum subtraction) → Ekadhipatya Shodhana (Sign occupancy rules)'}
              </p>
            </div>

            {/* Scorecard Pill */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">
                {language === 'hi' ? 'राशि पिण्ड:' : 'Rashi Pinda:'}{' '}
                <strong className="text-slate-200">{pinda.rashiPinda}</strong>
              </span>
              <span>+</span>
              <span className="text-slate-400">
                {language === 'hi' ? 'ग्रह पिण्ड:' : 'Graha Pinda:'}{' '}
                <strong className="text-slate-200">{pinda.grahaPinda}</strong>
              </span>
              <span>=</span>
              <span className="text-amber-400 font-bold">
                {language === 'hi' ? 'शोध्य पिण्ड:' : 'Shodhya Pinda:'} {pinda.shodhyaPinda}
              </span>
            </div>
          </div>

          {/* 12 Signs Comparison Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">{language === 'hi' ? 'राशि (भाव)' : 'Sign (Rashi)'}</th>
                  <th className="py-2.5 px-3">{language === 'hi' ? 'त्रिकोण समूह' : 'Trine Group'}</th>
                  <th className="py-2.5 px-3 text-center">{language === 'hi' ? '१. मूल BAV' : '1. Raw BAV'}</th>
                  <th className="py-2.5 px-3 text-center text-cyan-400">{language === 'hi' ? '२. त्रिकोण शोधन' : '2. Trikona'}</th>
                  <th className="py-2.5 px-3 text-center text-amber-400">{language === 'hi' ? '३. एकाधिपत्य शोधन' : '3. Ekadhipatya'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {RASHIS.map((r) => {
                  const raw = pinda.rawPoints[r.name] ?? 0;
                  const trik = pinda.trikonaPoints[r.name] ?? 0;
                  const ekad = pinda.ekadhipatyaPoints[r.name] ?? 0;

                  return (
                    <tr key={r.name} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-200 flex items-center gap-2">
                        <span>{language === 'hi' ? r.hindi : r.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-normal">({r.id})</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] font-sans">
                        {r.element} ({r.trine})
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-300 font-bold">
                        {raw}
                      </td>
                      <td className="py-2.5 px-3 text-center text-cyan-400 font-bold bg-cyan-950/20">
                        {trik}
                      </td>
                      <td className="py-2.5 px-3 text-center text-amber-400 font-bold bg-amber-950/20">
                        {ekad}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Explanation logs */}
          {pinda.explanation && pinda.explanation.length > 0 && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 mt-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'एकाधिपत्य शोधन तर्क व नियम' : 'Ekadhipatya Reduction Logic Trace'}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
                {pinda.explanation.map((exp, eIdx) => (
                  <li key={eIdx} className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 3. SARVASHTAKAVARGA (SAV) REDUCTIONS OVERVIEW */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">
            {language === 'hi'
              ? 'सर्व अष्टकवर्ग (SAV) शोधन वितरण'
              : 'Sarvashtakavarga (SAV) Composite Reductions'}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {RASHIS.map((r) => {
            const raw = rawSavPoints?.[r.name] ?? 0;
            const trik = shodhanaData.savTrikona[r.name] ?? 0;
            const ekad = shodhanaData.savEkadhipatya[r.name] ?? 0;

            return (
              <div
                key={r.name}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs"
              >
                <div className="flex justify-between items-center font-bold text-slate-200">
                  <span>{language === 'hi' ? r.hindi : r.name}</span>
                  <span className="text-slate-500 font-mono text-[10px]">#{r.id}</span>
                </div>

                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Raw SAV:</span>
                    <span className="font-bold text-slate-200">{raw}b</span>
                  </div>
                  <div className="flex justify-between text-cyan-400">
                    <span>Trikona:</span>
                    <span className="font-bold">{trik}b</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>Ekadhipatya:</span>
                    <span className="font-bold">{ekad}b</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
