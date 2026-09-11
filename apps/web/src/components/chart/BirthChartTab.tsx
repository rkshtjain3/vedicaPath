'use client';

import React from 'react';
import { VedicChartContainer } from './VedicChartContainer';
import { PanchangaCard } from '@/components/panchanga/PanchangaCard';
import { Compass, Sparkles, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface BirthChartTabProps {
  calculationResult: any;
}

export const BirthChartTab: React.FC<BirthChartTabProps> = ({ calculationResult }) => {
  const { t, language, translateSign } = useI18n();
  const data = calculationResult?.data || calculationResult;

  if (!data || (!data.astrology && !data.lagna)) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <Compass className="w-10 h-10 text-indigo-400 mx-auto" />
        <h3 className="text-base font-bold text-white">
          {language === 'hi' ? 'कोई गणना डेटा उपलब्ध नहीं' : 'No Calculation Data Available'}
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          {language === 'hi'
            ? 'अपनी जन्म कुण्डली देखने के लिए कृपया जन्म तिथि, समय और स्थान दर्ज करें।'
            : 'Please submit a valid birth date, time, and location to calculate and render your birth chart.'}
        </p>
      </div>
    );
  }

  const rawLagnaSign = data.astrology?.lagna?.sign?.name || data.lagna?.sign?.name || 'Aries';
  const lagnaSign = translateSign(rawLagnaSign, language);
  const lagnaDeg = data.astrology?.lagna?.longitude ?? 0;
  const birthDate = data.audit?.birthLocalDate || data.astrology?.birthTime?.dateOfBirth || '-';
  const birthTime = data.audit?.birthLocalTime || data.astrology?.birthTime?.timeOfBirth || '-';
  const locationName = data.audit?.location?.displayName || data.astrology?.location?.name || '-';

  return (
    <div className="space-y-6">
      {/* Header Fact Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
              {language === 'hi' ? 'वैदिक जन्म कुण्डली' : 'Vedic Birth Chart'}
            </span>
            <h2 className="text-xl font-extrabold text-white">
              {data.audit?.name || data.fullName || (language === 'hi' ? 'व्यक्तिगत जन्म कुण्डली' : 'Personal Astrology Chart')}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>{birthDate} at {birthTime}</span>
            <span>•</span>
            <span>{locationName}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">
              {language === 'hi' ? 'लग्न राशि' : 'Ascendant (Lagna)'}
            </span>
            <span className="font-bold text-amber-300 text-sm">{lagnaSign}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">
              {language === 'hi' ? 'भोगांश' : 'Longitude'}
            </span>
            <span className="font-bold text-slate-200">{(lagnaDeg % 30).toFixed(2)}°</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">
              {language === 'hi' ? 'अयनांश' : 'Ayanamsha'}
            </span>
            <span className="font-bold text-indigo-300">{language === 'hi' ? 'लाहिड़ी (Lahiri)' : 'Lahiri'}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Container */}
      <VedicChartContainer calculationResult={data} />

      {/* Classical 5-Limb Vedic Panchanga & Daily Rhythm */}
      {data.panchanga && (
        <div className="mt-6">
          <PanchangaCard panchanga={data.panchanga} />
        </div>
      )}
    </div>
  );
};
