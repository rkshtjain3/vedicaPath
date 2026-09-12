'use client';

import React, { useState, useEffect } from 'react';
import {
  Hand,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Award,
  Layers,
  Info,
  Sliders,
  Maximize2,
  FileText,
  UploadCloud,
  RefreshCw,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PalmistryTabProps {
  initialHandType?: 'LEFT_HAND' | 'RIGHT_HAND';
}

export function PalmistryTab({ initialHandType = 'RIGHT_HAND' }: PalmistryTabProps) {
  const { language } = useI18n();
  const isHi = language === 'hi';

  const [handType, setHandType] = useState<'LEFT_HAND' | 'RIGHT_HAND'>(initialHandType);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<number>(9);
  const [activeRuleCategory, setActiveRuleCategory] = useState<string>('ALL');

  const runAnalysis = async (customPayload: any = {}) => {
    setLoading(true);
    try {
      const res = await fetch('/api/palmistry/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handType,
          handDominance: 'DOMINANT',
          ...customPayload,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysis(json.data);
      }
    } catch (err) {
      console.error('Failed to run palmistry analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [handType]);

  const pipeline = analysis?.pipelineStages || [];
  const lines = analysis?.lines;
  const mounts = analysis?.mounts;
  const ratios = analysis?.digitalRatios;
  const quality = analysis?.quality;
  const rules = analysis?.ruleResults || [];

  const filteredRules = activeRuleCategory === 'ALL'
    ? rules
    : rules.filter((r: any) => r.category === activeRuleCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 border border-teal-500/30 shadow-2xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-900/60 border border-teal-400/30 text-teal-300 font-mono text-[11px] font-semibold">
              vedica-palmistry-v1
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 font-mono text-[11px] font-semibold">
              9-Stage CV & AST Pipeline
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Hand className="w-6 h-6 text-teal-400" />
            <span>{isHi ? 'हस्तरेखा एवं करतल लक्षण विश्लेषण (Palmistry)' : 'Deterministic Palmistry & Hast Rekha (हस्तरेखा)'}</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Computer Vision observation model analyzing palmar line vectors, 2D:4D finger digital ratios, and 7 Palmar Mounts with AST Hast Rekha rules.
          </p>
        </div>

        {/* Hand Controls & Upload */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setHandType('RIGHT_HAND')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                handType === 'RIGHT_HAND' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isHi ? 'दक्षिण कर (Right)' : 'Right Palm'}
            </button>
            <button
              type="button"
              onClick={() => setHandType('LEFT_HAND')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                handType === 'LEFT_HAND' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isHi ? 'वाम कर (Left)' : 'Left Palm'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => runAnalysis()}
            disabled={loading}
            className="px-4 py-2 rounded-2xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{isHi ? 'पुनः विश्लेषण' : 'Re-Analyze'}</span>
          </button>
        </div>
      </div>

      {/* 9-Stage Pipeline Progress Meter */}
      <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-teal-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4" />
            <span>9-Stage Pipeline Execution Trace</span>
          </span>
          <span className="font-mono text-slate-400">Status: 100% Deterministic</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {[
            '1. Photo Input',
            '2. Quality Assess',
            '3. Hand Detect',
            '4. Landmarks',
            '5. Lines Detection',
            '6. Mount Measure',
            '7. Observations',
            '8. Hast Rules',
            '9. Interpretation',
          ].map((stName, idx) => {
            const stageNum = idx + 1;
            const stageInfo = pipeline.find((p: any) => p.stageNumber === stageNum);
            const isPassed = stageInfo?.status === 'PASSED';
            return (
              <div
                key={idx}
                className={`p-2 rounded-xl border text-center transition ${
                  isPassed
                    ? 'bg-teal-950/40 border-teal-500/40 text-teal-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono font-bold">{stName}</div>
                <div className="text-[9px] mt-0.5 text-slate-400">{isPassed ? '✓ Passed' : 'Pending'}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Palmar Vector Canvas & Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Vector SVG Palm Diagram (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/90 border border-teal-500/30 rounded-3xl p-5 shadow-2xl relative space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4" />
              <span>Palmar Landmark Vector Blueprint</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-900/60 border border-teal-700/50 font-mono text-teal-300">
              {handType}
            </span>
          </div>

          {/* SVG Vector Palm Representation */}
          <div className="relative w-full aspect-[4/5] bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-md">
              {/* Outer Palm Outline */}
              <path
                d="M 120 450 Q 80 320 80 200 C 80 140 100 80 140 40 Q 150 30 160 50 L 160 160 Q 180 30 200 20 Q 210 20 220 50 L 220 160 Q 240 40 260 35 Q 270 35 280 60 L 280 180 Q 300 80 315 75 Q 325 75 330 100 L 330 250 Q 340 340 290 450 Z"
                fill="#0f172a"
                stroke="#14b8a6"
                strokeWidth="2.5"
                strokeDasharray="none"
              />

              {/* Primary Lines Overlay */}
              {/* 1. Life Line (Green Arc around Shukra/Venus) */}
              <path
                d="M 140 200 Q 130 280 200 420"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <text x="110" y="320" fill="#34d399" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Life Line (आयु)
              </text>

              {/* 2. Head Line (Blue Sloping) */}
              <path
                d="M 140 200 Q 220 250 310 290"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <text x="210" y="240" fill="#38bdf8" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Head Line (मस्तिष्क)
              </text>

              {/* 3. Heart Line (Rose Curve) */}
              <path
                d="M 330 190 Q 240 160 160 140"
                fill="none"
                stroke="#fb7185"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <text x="230" y="150" fill="#fb7185" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Heart Line (हृदय)
              </text>

              {/* 4. Fate Line (Amber Shaft) */}
              <path
                d="M 210 440 L 210 160"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />
              <text x="215" y="360" fill="#fbbf24" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                Fate Line (भाग्य)
              </text>

              {/* Palmar Landmarks Anchor Dots */}
              {[
                { x: 140, y: 200, label: 'Index Base' },
                { x: 200, y: 170, label: 'Middle Base' },
                { x: 260, y: 175, label: 'Ring Base' },
                { x: 320, y: 200, label: 'Pinky Base' },
                { x: 200, y: 440, label: 'Wrist Base' },
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              ))}
            </svg>
          </div>

          {/* Quality Assessment Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>Image Quality Meter</span>
              <span className="text-teal-400">{quality?.handVisibilityConfidence}% Confidence</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400">
              <div>Sharpness: <span className="text-slate-200">{quality?.sharpnessScore}/100</span></div>
              <div>Lighting: <span className="text-slate-200">{quality?.lightingScore}/100</span></div>
              <div>Contrast: <span className="text-slate-200">{quality?.contrastScore}/100</span></div>
            </div>
          </div>
        </div>

        {/* Palmar Lines & Mount Metrics Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* 2D:4D Finger Digital Ratio Card */}
          <div className="p-4 rounded-3xl bg-slate-950/80 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>2D:4D Digital Finger Ratio & Prenatal Balance</span>
              </span>
              <span className="font-mono text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                Ratio: {ratios?.ratio2D4D}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              <strong>Digit Pattern:</strong> {ratios?.digitClassification?.replace(/_/g, ' ')} — {ratios?.temperamentHint}
            </p>
          </div>

          {/* 4 Primary Lines Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Primary Palmar Lines Analysis</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Life Line */}
              {lines?.lifeLine && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span>{lines.lifeLine.nameSanskrit}</span>
                    <span className="font-mono text-[11px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">
                      Length: {lines.lifeLine.lengthPercentage}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {lines.lifeLine.keyObservation}
                  </p>
                </div>
              )}

              {/* Head Line */}
              {lines?.headLine && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-sky-500/30 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-sky-400">
                    <span>{lines.headLine.nameSanskrit}</span>
                    <span className="font-mono text-[11px] bg-sky-950 px-2 py-0.5 rounded text-sky-300">
                      Length: {lines.headLine.lengthPercentage}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {lines.headLine.keyObservation}
                  </p>
                </div>
              )}

              {/* Heart Line */}
              {lines?.heartLine && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-rose-400">
                    <span>{lines.heartLine.nameSanskrit}</span>
                    <span className="font-mono text-[11px] bg-rose-950 px-2 py-0.5 rounded text-rose-300">
                      Length: {lines.heartLine.lengthPercentage}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {lines.heartLine.keyObservation}
                  </p>
                </div>
              )}

              {/* Fate Line */}
              {lines?.fateLine && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-amber-400">
                    <span>{lines.fateLine.nameSanskrit}</span>
                    <span className="font-mono text-[11px] bg-amber-950 px-2 py-0.5 rounded text-amber-300">
                      Length: {lines.fateLine.lengthPercentage}%
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {lines.fateLine.keyObservation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 7 Palmar Mounts Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>7 Palmar Mounts Prominence (पर्वत विकास)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {mounts && Object.values(mounts).map((m: any) => (
                <div key={m.id} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-200 text-[11px]">{m.nameSanskrit}</div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${m.score}%` }} />
                  </div>
                  <div className="text-[10px] text-teal-300 font-mono flex items-center justify-between pt-0.5">
                    <span>{m.score}/100</span>
                    <span className="text-slate-400 text-[9px] truncate">{m.prominence.split('_')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Triggered Hast Rekha AST Rules & Evidence Drawer */}
      <div className="p-6 rounded-3xl bg-slate-950/90 border border-teal-500/30 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Deterministic Hast Rekha AST Rules & Mathematical Evidence</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {['ALL', 'VITALITY', 'COGNITION', 'DESTINY'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveRuleCategory(cat)}
                className={`px-2.5 py-1 rounded-xl font-semibold transition cursor-pointer ${
                  activeRuleCategory === cat
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Triggered Rules List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((rule: any) => (
            <div key={rule.ruleId} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isHi ? rule.titleHi : rule.title}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {rule.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi ? rule.findingHi : rule.finding}
              </p>

              <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <div className="text-teal-400 font-semibold uppercase">Evidence Trace:</div>
                {rule.evidenceTrace?.map((ev: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span>•</span>
                    <span>{ev}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
