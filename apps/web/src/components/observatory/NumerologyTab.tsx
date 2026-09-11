'use client';

import React from 'react';
import { Sparkles, User, Info } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export interface NumerologyTabProps {
  numData: any;
}

export const NumerologyTab: React.FC<NumerologyTabProps> = ({ numData }) => {
  const { language } = useI18n();

  if (!numData) return null;

  return (
    <div id="numerology-content" className="space-y-8">
      {/* 10A. BIRTH NUMEROLOGY */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-slate-200 uppercase tracking-wider">10A. Birth-Based Numerology</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            numData.lifePath,
            numData.birthday,
            numData.attitude,
            numData.personalYear,
            numData.personalMonth,
            numData.personalDay,
          ].filter(Boolean).map((item) => (
            <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="font-bold text-slate-200 text-base">{item.title}</h3>
                <div className="flex items-center gap-2">
                  {item.isMasterNumber && (
                    <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                      Master Number
                    </span>
                  )}
                  <span className="text-3xl font-extrabold text-amber-400 font-mono">
                    {item.finalNumber}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider font-mono">Formula Reduction Steps:</span>
                <div className="bg-slate-950 rounded-xl p-3.5 space-y-2 text-xs font-mono text-slate-300 border border-slate-800/60">
                  {item.formulaSteps?.map((step: any) => (
                    <div key={step.stepNumber} className="flex justify-between items-center py-1 border-b border-slate-900 last:border-0">
                      <span className="text-slate-400">Step {step.stepNumber} ({step.description}):</span>
                      <span className="text-amber-300 font-semibold">{step.expression}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10B. NAME NUMEROLOGY */}
      <div className="space-y-4 pt-4 border-t border-slate-800" id="name-numerology-section">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-200 uppercase tracking-wider">10B. Name-Based Numerology</h2>
          </div>
          {numData.nameAnalysis && (
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-xs font-mono font-bold">
              {numData.nameAnalysis.system} ({numData.nameAnalysis.profileVersion})
            </span>
          )}
        </div>

        {!numData.nameAnalysis ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center space-y-2 text-slate-400" id="no-name-notice">
            <Info className="w-6 h-6 text-amber-400 mx-auto" />
            <p className="text-sm font-medium text-slate-300">Enter a full name to calculate name-based numerology.</p>
            <p className="text-xs text-slate-400">Name numerology evaluates Expression (Destiny), Soul Urge, and Personality numbers using the Pythagorean system.</p>
          </div>
        ) : (
          <div className="space-y-6" id="name-numerology-results">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold font-mono">Analyzed Full Name:</span>
                <p className="text-lg font-bold text-amber-300">{numData.nameAnalysis.fullName}</p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Normalized String: <span className="text-slate-200 font-bold">{numData.nameAnalysis.normalizedName}</span> ({numData.nameAnalysis.normalizedName?.length} letters)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                numData.nameAnalysis.expressionNumber,
                numData.nameAnalysis.soulUrgeNumber,
                numData.nameAnalysis.personalityNumber,
              ].filter(Boolean).map((item: any) => (
                <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <h3 className="font-bold text-slate-200 text-sm">{item.title}</h3>
                      <div className="flex items-center gap-2">
                        {item.isMasterNumber && (
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            Master
                          </span>
                        )}
                        <span className="text-3xl font-extrabold text-amber-400 font-mono">
                          {item.finalNumber}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1 font-mono">
                      <div>Raw Sum: <strong className="text-amber-300">{item.rawSum}</strong></div>
                      {item.includedLetters && (
                        <div className="truncate">Letters: <span className="text-slate-300">{item.includedLetters.join(', ')}</span></div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] uppercase text-slate-400 font-semibold tracking-wider font-mono">Formula & Trace:</span>
                      <div className="bg-slate-950 rounded-xl p-3 space-y-2 text-[11px] font-mono text-slate-300 border border-slate-800/60 max-h-48 overflow-y-auto">
                        {item.formulaSteps?.map((step: any) => (
                          <div key={step.stepNumber} className="border-b border-slate-900 last:border-0 pb-1">
                            <div className="text-slate-400 text-[10px]">Step {step.stepNumber}: {step.description}</div>
                            <div className="text-amber-300 font-semibold break-all">{step.expression}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
