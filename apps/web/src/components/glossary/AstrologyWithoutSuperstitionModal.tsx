'use client';

import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Sun, 
  HeartHandshake, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface AstrologyWithoutSuperstitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCodexTab?: () => void;
}

export const AstrologyWithoutSuperstitionModal: React.FC<AstrologyWithoutSuperstitionModalProps> = ({
  isOpen,
  onClose,
  onOpenCodexTab,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="superstition-modal-title"
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="close-superstition-modal"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Empowering Vedic Wisdom • Zero Superstition
          </div>
          <h2 id="superstition-modal-title" className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            Astrology Without Superstition: The Freedom Manifesto
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Why you never need an intermediary or fear-peddling priest to understand your cosmic blueprint.
          </p>
        </div>

        {/* Section 1: What is Jyotish really? */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>1. What is Jyotish? The Light of Consciousness, Not Fatalism</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            In Sanskrit, <strong className="text-amber-300">Jyotish</strong> translates to <em>"the light that illuminates consciousness"</em>. Classical Vedic seers designed it as an observational clock — measuring cosmic rhythms, cognitive patterns, and developmental seasons. It was never intended to be a fatalistic tool of doom or dependency.
          </p>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200 leading-relaxed font-mono">
            &ldquo;There is no power in the universe greater than conscious human self-effort (Purushartha). Past momentum is like a weak horse; present conscious choice is like a champion horse. The champion always prevails.&rdquo;
            <span className="block mt-1 text-slate-400 font-sans italic">— Yoga Vasishtha (Classic Vedic Philosophical Treatise)</span>
          </div>
        </div>

        {/* Section 2: Karma vs Free Will Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>2. The 50/50 Vedic Rule: Starting Cards vs. How You Play</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                Prarabdha Karma (The Hand of Cards)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your birth chart reflects starting conditions: your biological constitution, innate inclinations, family environment, and initial psychological tendencies. This is fixed in the past, like seeds already sown.
              </p>
              <div className="text-[11px] text-slate-400 font-mono bg-slate-900/80 p-2 rounded">
                Example: Being born with an analytical mind or an intense emotional temperament.
              </div>
            </div>

            <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Purushartha / Kriyamana (Your Free Will)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                How you play your hand right now. Every thought, ethical decision, disciplined habit, and conscious reaction transforms or transcends chart obstacles. No planet can revoke your free will.
              </p>
              <div className="text-[11px] text-slate-400 font-mono bg-slate-900/80 p-2 rounded">
                Example: Channeling intense energy into rigorous exercise, clear boundaries, and honest communication.
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: The 3 Great Astrological Superstitions Debunked */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>3. Three Superstitions Exploited for Profit — Debunked</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-red-300">Myth 1: &ldquo;You have Manglik Dosha, your marriage is cursed!&rdquo;</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-red-950/60 text-red-400 font-semibold uppercase">Debunked</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-400">The Vedic Truth:</strong> Over 50% of people worldwide have Mars in these houses! Mars signifies courageous energy, passion, and ambition. In ancient patriarchal societies, assertive spouses were labeled &ldquo;problematic&rdquo;. In modern equal partnerships, strong Mars energy is a superpower when guided by honest communication and mutual respect.
              </p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-red-300">Myth 2: &ldquo;Sade Sati brings ruin and disaster unless you pay for poojas.&rdquo;</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-red-950/60 text-red-400 font-semibold uppercase">Debunked</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-400">The Vedic Truth:</strong> Saturn is the teacher of reality and endurance. Sade Sati simply audits your life — pruning wasteful habits and building unbreakable character. Most people achieve their defining career promotions, weddings, and long-term milestones during Sade Sati through dedicated hard work.
              </p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-red-300">Myth 3: &ldquo;Expensive gemstones and rituals will magically solve your problems.&rdquo;</span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-red-950/60 text-red-400 font-semibold uppercase">Debunked</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-emerald-400">The Vedic Truth:</strong> Parashara and authentic sages taught that real remedies are internal transformations (Sattvic habits). No stone on your finger can replace therapy, physical exercise, or ethical financial management.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Authentic Sattvic Remedies */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-base">
            <Sun className="w-5 h-5 text-emerald-400" />
            <span>4. Authentic Vedic Remedies: The 4 Daily Sattvic Pillars</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Classical texts emphasize that the highest remedies cost zero money and cultivate genuine psychological and physiological well-being:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5">
              <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block">1. Circadian Solar Alignment (Surya)</strong>
                <span className="text-slate-400">Wake before sunrise, 15 min morning sunlight, and Surya Namaskar to balance dopamine and vitality.</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5">
              <HeartHandshake className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 block">2. Selfless Service & Charity (Seva & Dāna)</strong>
                <span className="text-slate-400">Volunteering time to serve elders or those in need completely neutralizes Saturnian and Rahu friction.</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-300 block">3. Breathwork & Meditation (Chandra)</strong>
                <span className="text-slate-400">10-15 minutes of Nadi Shodhana (alternate nostril breathing) calms the restless lunar mind and anxiety.</span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300 block">4. Ethical Action (Dharma & Satya)</strong>
                <span className="text-slate-400">Speaking truth, non-harm, and clean professional ethics clear karmic debts faster than any ritual.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            VedicaPath provides transparent mathematical deductions so you never need a middleman.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onOpenCodexTab && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCodexTab();
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                Open Jargon-Buster Codex
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>I Understand My Free Will</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
