'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Flame, 
  ShieldCheck, 
  RotateCcw,
} from 'lucide-react';
import { useI18n, Language } from '../../lib/i18n';

interface HabitItem {
  id: string;
  title: string;
  sanskrit: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  cosmicPillar: string;
  duration: string;
}

const SATTVIC_HABITS: HabitItem[] = [
  {
    id: 'surya-light',
    title: 'Solar Circadian Alignment',
    sanskrit: 'सूर्य नमस्कार एवं प्रातः प्रकाश',
    icon: Sun,
    description: '15 minutes of early morning sunlight within 1 hour of waking. Activates dopamine, sets circadian clock, and harmonizes natural vitality.',
    cosmicPillar: 'Sun (Surya) • Core Vitality & Leadership',
    duration: '15 min'
  },
  {
    id: 'chandra-breath',
    title: 'Lunar Mind Breathwork (Pranayama)',
    sanskrit: 'नाड़ी शोधन प्राणायाम',
    icon: Moon,
    description: '10 minutes of gentle alternate nostril breathing. Calms the autonomic nervous system, quiets mental chatter, and stabilizes emotional reactions.',
    cosmicPillar: 'Moon (Chandra) • Emotional Equilibrium',
    duration: '10 min'
  },
  {
    id: 'saturn-seva',
    title: 'Conscious Seva or Ethical Deed',
    sanskrit: 'निःस्वार्थ सेवा एवं दान',
    icon: HeartHandshake,
    description: 'Voluntary act of service, checking on someone in need, or feeding birds/animals. Directly neutralizes karmic friction through humility and generosity.',
    cosmicPillar: 'Saturn (Shani) • Karma Yoga & Humility',
    duration: '5-15 min'
  },
  {
    id: 'night-winddown',
    title: 'Subconscious Release & Digital Curfew',
    sanskrit: 'रात्रि विश्राम एवं ध्यान',
    icon: Sparkles,
    description: 'Disengaging screens 45 min before sleep, quiet gratitude journaling, and breathing into restful sleep to clear subconscious residues.',
    cosmicPillar: '12th House & Ketu • Deep Mental Rejuvenation',
    duration: '20 min'
  }
];

const STORAGE_PREFIX = 'vedicapath_sattvic_habits_';
const STREAK_KEY = 'vedicapath_sattvic_streak';

const HABIT_I18N: Record<Language, Record<string, { title: string; description: string; cosmicPillar: string }>> = {
  en: {
    'surya-light': {
      title: 'Solar Circadian Alignment',
      description: '15 minutes of early morning sunlight within 1 hour of waking. Activates dopamine, sets circadian clock, and harmonizes natural vitality.',
      cosmicPillar: 'Sun (Surya) • Core Vitality & Leadership',
    },
    'chandra-breath': {
      title: 'Lunar Mind Breathwork (Pranayama)',
      description: '10 minutes of gentle alternate nostril breathing. Calms the autonomic nervous system, quiets mental chatter, and stabilizes emotional reactions.',
      cosmicPillar: 'Moon (Chandra) • Emotional Equilibrium',
    },
    'saturn-seva': {
      title: 'Conscious Seva or Ethical Deed',
      description: 'Voluntary act of service, checking on someone in need, or feeding birds/animals. Directly neutralizes karmic friction through humility and generosity.',
      cosmicPillar: 'Saturn (Shani) • Karma Yoga & Humility',
    },
    'night-winddown': {
      title: 'Subconscious Release & Digital Curfew',
      description: 'Disengaging screens 45 min before sleep, quiet gratitude journaling, and breathing into restful sleep to clear subconscious residues.',
      cosmicPillar: '12th House & Ketu • Deep Mental Rejuvenation',
    },
  },
  hi: {
    'surya-light': {
      title: 'सूर्य नमस्कार एवं प्रातः प्रकाश (Surya Alignment)',
      description: 'जागने के १ घंटे के भीतर १५ मिनट प्रातःकालीन सूर्य प्रकाश। डोपामाइन सक्रिय करता है, जैविक घड़ी संतुलित करता है और आत्म-तेज बढ़ाता है।',
      cosmicPillar: 'सूर्य (Surya) • आत्म-तेज, जीवन शक्ति एवं नेतृत्व',
    },
    'chandra-breath': {
      title: 'नाड़ी शोधन प्राणायाम (Lunar Breathwork)',
      description: '१० मिनट शांत अनुलोम-विलोम प्राणायाम। स्वायत्त तंत्रिका तंत्र को शांत करता है, मानसिक चंचलता घटाता है और भावनात्मक संतुलन लाता है।',
      cosmicPillar: 'चंद्र (Chandra) • भावनात्मक संतुलन एवं शांत मन',
    },
    'saturn-seva': {
      title: 'निःस्वार्थ सेवा एवं सदकर्म (Karma Seva)',
      description: 'किसी जरूरतमंद की सहायता, पशु-पक्षियों को दाना-पानी या निःस्वार्थ सेवा। विनम्रता व उदारता से प्रारब्ध के घर्षण को शांत करता है।',
      cosmicPillar: 'शनि (Shani) • कर्म योग, विनम्रता एवं त्याग',
    },
    'night-winddown': {
      title: 'रात्रि विश्राम एवं डिजिटल डिटॉक्स (Digital Curfew)',
      description: 'सोने से ४५ मिनट पूर्व स्क्रीन बंद, कृतज्ञता स्मरण और शांत ध्यान। अवचेतन के तनाव को विसर्जित कर गहरी नींद प्रदान करता है।',
      cosmicPillar: '१२वां भाव एवं केतु • मानसिक पुनरुत्थान एवं शांति',
    },
  },
};

export const SattvicHabitTracker: React.FC = () => {
  const { language, t } = useI18n();
  const [completedHabits, setCompletedHabits] = useState<Record<string, boolean>>({});
  const [streakCount, setStreakCount] = useState<number>(1);
  const [todayDateStr, setTodayDateStr] = useState<string>('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTodayDateStr(today);

    // Load today's habits
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + today);
      if (saved) {
        setCompletedHabits(JSON.parse(saved));
      }
      const savedStreak = localStorage.getItem(STREAK_KEY);
      if (savedStreak) {
        setStreakCount(parseInt(savedStreak, 10) || 1);
      }
    } catch {
      // Ignore storage errors in test or restricted environments
    }
  }, []);

  const toggleHabit = (id: string) => {
    const updated = {
      ...completedHabits,
      [id]: !completedHabits[id]
    };
    setCompletedHabits(updated);

    if (todayDateStr) {
      try {
        localStorage.setItem(STORAGE_PREFIX + todayDateStr, JSON.stringify(updated));
        
        // Update streak if all completed
        const count = Object.values(updated).filter(Boolean).length;
        if (count === SATTVIC_HABITS.length) {
          const newStreak = streakCount + 1;
          setStreakCount(newStreak);
          localStorage.setItem(STREAK_KEY, String(newStreak));
        }
      } catch {
        // Ignore storage errors
      }
    }
  };

  const handleResetToday = () => {
    setCompletedHabits({});
    if (todayDateStr) {
      try {
        localStorage.removeItem(STORAGE_PREFIX + todayDateStr);
      } catch {
        // Ignore storage errors
      }
    }
  };

  const completedCount = Object.values(completedHabits).filter(Boolean).length;
  const progressPct = Math.round((completedCount / SATTVIC_HABITS.length) * 100);

  return (
    <div id="sattvic-habit-tracker" className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('habits.badge')}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" /> {streakCount}-{t('habits.streak')}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
            {t('habits.title')}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            {t('habits.subtitle')}
          </p>
        </div>

        {/* Progress Pill */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-4 shrink-0 sm:self-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{t('habits.today')}</span>
            <span className="text-base font-extrabold text-emerald-300">
              {completedCount} {language === 'hi' ? 'में से' : 'of'} {SATTVIC_HABITS.length} {t('habits.complete')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-xs text-emerald-400 bg-emerald-500/10">
            {progressPct}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {SATTVIC_HABITS.map((habit) => {
          const isDone = !!completedHabits[habit.id];
          const Icon = habit.icon;
          const habitInfo = HABIT_I18N[language]?.[habit.id] || habit;

          return (
            <div
              key={habit.id}
              id={`habit-${habit.id}`}
              onClick={() => toggleHabit(habit.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 select-none ${
                isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 transition-colors ${
                  isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/60 text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-xs sm:text-sm font-bold transition-colors ${
                      isDone ? 'text-emerald-200 line-through' : 'text-slate-100'
                    }`}>
                      {habitInfo.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {habit.duration}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {habitInfo.description}
                  </p>
                  <span className="text-[10px] font-medium text-emerald-400/90 block pt-0.5">
                    ✦ {habitInfo.cosmicPillar}
                  </span>
                </div>
              </div>

              <button
                type="button"
                id={`habit-checkbox-${habit.id}`}
                aria-label={`Toggle ${habitInfo.title}`}
                className="shrink-0 mt-1 focus:outline-none"
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 transition-transform scale-110" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400 transition-colors" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer / Reset action */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
        <span className="flex items-center gap-1.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {t('habits.privacy')}
        </span>
        {completedCount > 0 && (
          <button
            type="button"
            onClick={handleResetToday}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> {t('habits.reset')}
          </button>
        )}
      </div>
    </div>
  );
};
