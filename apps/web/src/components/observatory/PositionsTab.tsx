'use client';

import React from 'react';
import { PanchangaCard } from '@/components/panchanga/PanchangaCard';
import { Table as TableIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface PositionsTabProps {
  astroData: any;
  panchangaData?: any;
}

export const PositionsTab: React.FC<PositionsTabProps> = ({ astroData, panchangaData }) => {
  const { t, language, translateSign } = useI18n();

  if (!astroData) return null;

  return (
    <div id="astrology-content" className="space-y-6">
      {panchangaData && <PanchangaCard panchanga={panchangaData} />}

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div>
          <span className="text-slate-400">Calculation Profile: </span>
          <span className="font-bold text-amber-400">{astroData.calculationProfile?.name || 'Vedic Sidereal'}</span>
          <span className="text-slate-500 ml-2">({astroData.calculationProfile?.version || 'v1'})</span>
        </div>
        <div className="flex gap-4 text-slate-300">
          <span>
            Zodiac: <strong className="text-slate-100 capitalize">{astroData.calculationProfile?.zodiac || 'sidereal'}</strong>
          </span>
          <span>
            Ayanamsa: <strong className="text-slate-100 capitalize">{astroData.calculationProfile?.ayanamsa || 'lahiri'}</strong>{' '}
            ({(astroData.ayanamsaValue ?? 23.85).toFixed(4)}°)
          </span>
          <span>
            Nodes: <strong className="text-slate-100 capitalize">{astroData.calculationProfile?.nodeType || 'mean'}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider font-mono">
            {language === 'hi' ? 'लग्न / Ascendant' : 'Lagna / Ascendant'}
          </span>
          <p className="text-2xl font-bold text-slate-100">
            {translateSign(astroData.lagna?.sign?.name || 'Aries', language)}
          </p>
          <p className="text-xs text-amber-400 font-mono">{astroData.lagna?.formattedDegree}</p>
          <p className="text-xs text-slate-400 font-mono">
            {astroData.lagna?.nakshatra?.name} (Pada {astroData.lagna?.nakshatra?.pada})
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider font-mono">
            {language === 'hi' ? 'चंद्र राशि (Rashi)' : 'Moon Sign (Rashi)'}
          </span>
          <p className="text-2xl font-bold text-slate-100">
            {translateSign(astroData.moonSign?.name || 'Cancer', language)}
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Sanskrit: {astroData.moonSign?.sanskritName || '-'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider font-mono">
            {language === 'hi' ? 'जन्म नक्षत्र' : 'Birth Nakshatra'}
          </span>
          <p className="text-2xl font-bold text-slate-100">{astroData.birthNakshatra?.name || '-'}</p>
          <p className="text-xs text-amber-400 font-mono">Pada {astroData.birthNakshatra?.pada || 1}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-slate-200 flex items-center gap-2 text-sm font-mono">
            <TableIcon className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'ग्रह स्थिति सारणी' : 'Planetary Positions Table'}</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table id="planet-table" className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                <th className="py-3.5 px-6">Planet</th>
                <th className="py-3.5 px-6">Sign</th>
                <th className="py-3.5 px-6">Degree</th>
                <th className="py-3.5 px-6">Nakshatra</th>
                <th className="py-3.5 px-6">Pada</th>
                <th className="py-3.5 px-6">Motion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
              {astroData.planets?.map((planet: any) => (
                <tr key={planet.planet} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-100">{planet.planet}</td>
                  <td className="py-3.5 px-6 text-slate-200">
                    {translateSign(planet.sign?.name, language)} ({planet.sign?.sanskritName})
                  </td>
                  <td className="py-3.5 px-6 text-amber-400">{planet.formattedDegree}</td>
                  <td className="py-3.5 px-6 text-slate-300">{planet.nakshatra?.name}</td>
                  <td className="py-3.5 px-6 text-slate-300">{planet.nakshatra?.pada}</td>
                  <td className="py-3.5 px-6">
                    {planet.isRetrograde ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Retrograde (R)
                      </span>
                    ) : (
                      <span className="text-slate-500">Direct</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
