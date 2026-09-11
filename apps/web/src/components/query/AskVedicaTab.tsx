'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  HelpCircle,
  Search,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  Layers,
  Filter,
  ArrowRight,
  X,
  FileCode,
  Compass,
  Briefcase,
  Coins,
  Heart,
  Clock,
  Zap,
  ShieldCheck,
  Target,
  BookOpen,
  Lightbulb,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  User,
  Bot,
  RotateCcw,
  Copy,
  Check,
  Globe,
  Sun,
  Moon,
  MessageSquare,
  Sparkle,
  Eye,
  EyeOff,
  Key,
  Cpu,
  Cloud,
} from 'lucide-react';
import { executeQueryEngine, QueryAnswer, QueryEvidenceItem } from '@vedica/query-engine';
import { useI18n, Language } from '@/lib/i18n';
import { DailyLifeBriefing } from './DailyLifeBriefing';
import { DecisionSimulatorModal } from './DecisionSimulatorModal';
import { AyurJyotishCard } from './AyurJyotishCard';
import { LifeDossierModal } from './LifeDossierModal';

function renderInlineText(text: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-semibold text-amber-200">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="text-slate-200 italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

export function FormattedMarkdownMessage({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let blockquoteBuffer: string[] = [];

  const flushBlockquote = (key: number) => {
    if (blockquoteBuffer.length === 0) return null;
    const items = blockquoteBuffer.map((l) => l.replace(/^>\s*/, '').trim()).filter(Boolean);
    blockquoteBuffer = [];
    return (
      <div
        key={`quote-${key}`}
        className="my-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-950/50 to-slate-950 border border-amber-500/35 text-slate-100 text-xs sm:text-sm space-y-2 shadow-lg"
      >
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <Target className="w-4 h-4 text-amber-400" />
          <span>Core Verdict & Timing</span>
        </div>
        <div className="space-y-1.5 pl-1">
          {items.map((item, idx) => (
            <div key={idx} className="leading-relaxed">
              {renderInlineText(item)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check for blockquote
    if (line.startsWith('>')) {
      blockquoteBuffer.push(line);
      continue;
    } else if (blockquoteBuffer.length > 0) {
      const bq = flushBlockquote(i);
      if (bq) elements.push(bq);
    }

    if (!line) {
      continue;
    }

    // Dividers
    if (line === '---' || line === '***' || line === '___') {
      elements.push(
        <div key={`hr-${i}`} className="my-2.5 border-t border-slate-800/80" />
      );
      continue;
    }

    // Title / Major Heading (### ...)
    if (line.startsWith('### ')) {
      const title = line.replace('### ', '').trim();
      elements.push(
        <div key={`h3-${i}`} className="pb-1.5 border-b border-indigo-500/30">
          <h3 className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-slate-100 to-indigo-200">
            {title}
          </h3>
        </div>
      );
      continue;
    }

    // Subheading (#### ...)
    if (line.startsWith('#### ')) {
      const title = line.replace('#### ', '').trim();
      elements.push(
        <h4
          key={`h4-${i}`}
          className="text-xs sm:text-sm font-bold text-amber-400/90 tracking-wide mt-2.5 flex items-center gap-1.5"
        >
          <span>{title}</span>
        </h4>
      );
      continue;
    }

    // Bullet points (* ... or - ...)
    if (line.startsWith('* ') || line.startsWith('- ')) {
      const bulletContent = line.slice(2).trim();
      const isDo = bulletContent.includes('✅') || bulletContent.toLowerCase().startsWith('do:');
      const isAvoid = bulletContent.includes('❌') || bulletContent.toLowerCase().startsWith('avoid:');

      if (isDo) {
        elements.push(
          <div
            key={`bullet-${i}`}
            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-xs text-slate-200"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{renderInlineText(bulletContent.replace(/^[✅\s*]+/, ''))}</div>
          </div>
        );
      } else if (isAvoid) {
        elements.push(
          <div
            key={`bullet-${i}`}
            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/50 text-xs text-slate-200"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{renderInlineText(bulletContent.replace(/^[❌\s*]+/, ''))}</div>
          </div>
        );
      } else {
        elements.push(
          <div key={`bullet-${i}`} className="flex items-start gap-2 text-xs text-slate-300 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 shrink-0 mt-1.5" />
            <div className="leading-relaxed">{renderInlineText(bulletContent)}</div>
          </div>
        );
      }
      continue;
    }

    // Regular text paragraph
    elements.push(
      <p key={`p-${i}`} className="text-xs sm:text-sm text-slate-300 leading-relaxed">
        {renderInlineText(line)}
      </p>
    );
  }

  // Flush any trailing blockquote
  if (blockquoteBuffer.length > 0) {
    const bq = flushBlockquote(lines.length);
    if (bq) elements.push(bq);
  }

  return <div className="space-y-2.5">{elements}</div>;
}

interface AskVedicaTabProps {
  calculationData: any;
  fullName?: string;
  transitDate?: string;
  initialQuery?: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  topic?: string;
  followUps?: Array<{ en: string; hi: string; query: string }>;
}

interface QuickConsultationCategory {
  id: string;
  name: string;
  nameHi: string;
  icon: any;
  border: string;
  bg: string;
  text: string;
  badge: string;
  queries: Array<{ en: string; hi: string; query: string }>;
}

const QUICK_CONSULTATIONS: QuickConsultationCategory[] = [
  {
    id: 'abroad',
    name: 'Foreign Travel & Relocation',
    nameHi: 'विदेश गमन एवं स्थान परिवर्तन',
    icon: Globe,
    border: 'border-cyan-500/30 hover:border-cyan-500/60',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    badge: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    queries: [
      {
        en: 'Is there any possibility to go abroad for me?',
        hi: 'क्या मेरी कुण्डली में विदेश जाने के योग हैं?',
        query: 'Is there any possibility to go abroad for me?',
      },
      {
        en: 'Will I get PR or settle overseas permanently?',
        hi: 'क्या मुझे विदेश में स्थायी निवास (PR) मिलेगा?',
        query: 'Will I get PR or settle overseas permanently?',
      },
      {
        en: 'When will my visa and foreign travel window activate?',
        hi: 'मेरी विदेश यात्रा और वीजा का शुभ समय कब शुरू होगा?',
        query: 'When will my visa and foreign travel window activate?',
      },
    ],
  },
  {
    id: 'career',
    name: 'Career & Business Path',
    nameHi: 'करियर एवं आजीविका',
    icon: Briefcase,
    border: 'border-indigo-500/30 hover:border-indigo-500/60',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    badge: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    queries: [
      {
        en: 'What is my career path in detail? Job vs business?',
        hi: 'मेरे करियर का विस्तृत विश्लेषण क्या है? नौकरी या व्यापार?',
        query: 'What is my career path in detail? Job vs business?',
      },
      {
        en: 'When is my next major promotion or career leap?',
        hi: 'मेरी अगली पदोन्नति या करियर में बड़ा उछाल कब आएगा?',
        query: 'When is my next major promotion or career leap?',
      },
      {
        en: 'What business industry suits my chart best?',
        hi: 'मेरी कुण्डली के अनुसार कौन सा व्यवसाय सबसे उपयुक्त है?',
        query: 'What business industry suits my chart best?',
      },
    ],
  },
  {
    id: 'struggles',
    name: 'Overcoming Failures & Delays',
    nameHi: 'बाधाएं एवं असफलता निवारण',
    icon: ShieldAlert,
    border: 'border-orange-500/30 hover:border-orange-500/60',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    badge: 'bg-orange-950 text-orange-300 border-orange-800',
    queries: [
      {
        en: 'Why am I getting fail from last 2 years?',
        hi: 'मुझे पिछले 2 वर्षों से असफलताएं क्यों मिल रही हैं?',
        query: 'Why am I getting fail from last 2 years?',
      },
      {
        en: 'When will this difficult phase end?',
        hi: 'यह कठिन समय कब समाप्त होगा और राहत कब मिलेगी?',
        query: 'When will this difficult phase end?',
      },
      {
        en: 'What are practical remedies for my obstacles?',
        hi: 'मेरी रुकावटों के लिए व्यावहारिक और सात्विक उपाय क्या हैं?',
        query: 'What are practical remedies for my obstacles?',
      },
    ],
  },
  {
    id: 'property',
    name: 'Property & Wealth Accumulation',
    nameHi: 'भवन, संपत्ति एवं समृद्धि',
    icon: Coins,
    border: 'border-amber-500/30 hover:border-amber-500/60',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-950 text-amber-300 border-amber-800',
    queries: [
      {
        en: 'When will I buy a home or property?',
        hi: 'मैं अपना मकान या संपत्ति कब खरीदूंगा?',
        query: 'When will I buy a home or property?',
      },
      {
        en: 'How will I build long-term wealth and clear debts?',
        hi: 'मैं धन-समृद्धि कैसे बनाऊं और ऋण से कैसे मुक्त होऊं?',
        query: 'How will I build long-term wealth and clear debts?',
      },
    ],
  },
  {
    id: 'relationships',
    name: 'Love & Marriage Timing',
    nameHi: 'संबंध एवं विवाह',
    icon: Heart,
    border: 'border-rose-500/30 hover:border-rose-500/60',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    badge: 'bg-rose-950 text-rose-300 border-rose-800',
    queries: [
      {
        en: 'When will I get married and how will my partner be?',
        hi: 'मेरा विवाह कब होगा और जीवनसाथी कैसा होगा?',
        query: 'When will I get married and how will my partner be?',
      },
      {
        en: 'What does my chart show about marriage harmony?',
        hi: 'दांपत्य जीवन में सामंजस्य के क्या योग हैं?',
        query: 'What does my chart show about marriage harmony?',
      },
    ],
  },
  {
    id: 'dharma',
    name: 'Life Purpose & Dharma',
    nameHi: 'जीवन लक्ष्य एवं आत्मिक उद्देश्य',
    icon: Compass,
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    queries: [
      {
        en: 'What is the core purpose and mission of my life?',
        hi: 'मेरी कुण्डली के अनुसार मेरे जीवन का मुख्य उद्देश्य क्या है?',
        query: 'What is the core purpose and mission of my life?',
      },
      {
        en: 'What are my natural superpowers and strengths?',
        hi: 'मेरी स्वाभाविक प्रतिभा और मूल क्षमता क्या है?',
        query: 'What are my natural superpowers and strengths?',
      },
    ],
  },
  {
    id: 'decision',
    name: 'Strategic Decision Simulator',
    nameHi: 'रणनीतिक निर्णय सिम्युलेटर (Option A vs B)',
    icon: Target,
    border: 'border-amber-500/30 hover:border-amber-500/60',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-950 text-amber-300 border-amber-800',
    queries: [
      {
        en: 'Compare Option A vs Option B for my career decision simulator',
        hi: 'विकल्प A बनाम विकल्प B का ग्रहीय निर्णय सिम्युलेटर चलाएं',
        query: 'Compare Option A vs Option B for my career decision simulator',
      },
      {
        en: 'Should I choose job stability or start an independent venture?',
        hi: 'क्या मुझे नौकरी में रहना चाहिए या स्वतंत्र व्यवसाय शुरू करना चाहिए?',
        query: 'Should I choose job stability or start an independent venture?',
      },
    ],
  },
  {
    id: 'ayurveda',
    name: 'Ayur-Jyotish & Bio-Rhythm',
    nameHi: 'आयुर्-ज्योतिष एवं जैविक दिनचर्या',
    icon: Sparkles,
    border: 'border-teal-500/30 hover:border-teal-500/60',
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    badge: 'bg-teal-950 text-teal-300 border-teal-800',
    queries: [
      {
        en: 'What is my Ayurvedic Dosha and circadian bio-rhythm breakdown?',
        hi: 'मेरी जन्म कुण्डली के अनुसार त्रिदोष प्रकृति व पाचक अग्नि बताएं?',
        query: 'What is my Ayurvedic Dosha and circadian bio-rhythm breakdown?',
      },
      {
        en: 'What adaptogens and daily routine optimize my energy?',
        hi: 'ऊर्जा और स्वास्थ्य वृद्धि के लिए कौन सी आयुर्वेदिक औषधियां लें?',
        query: 'What adaptogens and daily routine optimize my energy?',
      },
    ],
  },
];

export function AskVedicaTab({ calculationData, fullName, transitDate, initialQuery }: AskVedicaTabProps) {
  const { t, language } = useI18n();
  const [question, setQuestion] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [queryAnswer, setQueryAnswer] = useState<QueryAnswer | null>(null);
  const [audit, setAudit] = useState<any>(null);
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'SUPPORTIVE' | 'CHALLENGING' | 'NEUTRAL'>('ALL');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('ALL');
  const [showEvidenceAccordion, setShowEvidenceAccordion] = useState<boolean>(false);

  // Threaded Conversation State
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false);
  const [activeStreamingText, setActiveStreamingText] = useState<string>('');
  const [latestFollowUps, setLatestFollowUps] = useState<Array<{ en: string; hi: string; query: string }>>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Local AI Engine & Language Selector State
  const [engineMode, setEngineMode] = useState<'rag' | 'cloud' | 'ollama'>('rag');
  const [cloudProvider, setCloudProvider] = useState<'groq' | 'gemini' | 'openai' | 'deepseek' | 'openrouter'>('groq');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('qwen2.5:3b');
  const [aiLanguage, setAiLanguage] = useState<'auto' | 'en' | 'hi' | 'hinglish'>('auto');
  const [ollamaStatus, setOllamaStatus] = useState<{
    connected: boolean;
    models: Array<{ name: string; size?: number }>;
    loading: boolean;
  }>({ connected: false, models: [], loading: false });

  // Persistence for user preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('vedica_ai_api_key');
      const savedProvider = localStorage.getItem('vedica_ai_provider') as any;
      const savedEngine = localStorage.getItem('vedica_ai_engine_mode') as any;
      if (savedKey) setApiKey(savedKey);
      if (savedProvider) setCloudProvider(savedProvider);
      if (savedEngine) setEngineMode(savedEngine);
    }
  }, []);

  const updateApiKey = (val: string) => {
    setApiKey(val);
    if (typeof window !== 'undefined') {
      if (val) localStorage.setItem('vedica_ai_api_key', val);
      else localStorage.removeItem('vedica_ai_api_key');
    }
  };

  const updateCloudProvider = (p: 'groq' | 'gemini' | 'openai' | 'deepseek' | 'openrouter') => {
    setCloudProvider(p);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vedica_ai_provider', p);
    }
  };

  const updateEngineMode = (m: 'rag' | 'cloud' | 'ollama') => {
    setEngineMode(m);
    if (typeof window !== 'undefined') {
      localStorage.setItem('vedica_ai_engine_mode', m);
    }
  };

  // Voice Speech Recognition State
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Modals for Decision Simulator & AI Life Dossier
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

  // Text to Speech State
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper for voice language
  const getEffectiveAudioLang = (text?: string) => {
    if (text && /[\u0900-\u097F]/.test(text)) return 'hi-IN';
    if (aiLanguage === 'hi' || aiLanguage === 'hinglish') return 'hi-IN';
    if (aiLanguage === 'en') return 'en-US';
    return language === 'hi' ? 'hi-IN' : 'en-US';
  };

  // Fetch local Ollama models on mount
  const checkOllamaConnection = async () => {
    setOllamaStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/ai/models');
      if (res.ok) {
        const data = await res.json();
        setOllamaStatus({
          connected: !!data.connected,
          models: data.models || [],
          loading: false,
        });
        if (data.models && data.models.length > 0) {
          setSelectedModel(data.models[0].name);
        }
      } else {
        setOllamaStatus({ connected: false, models: [], loading: false });
      }
    } catch {
      setOllamaStatus({ connected: false, models: [], loading: false });
    }
  };

  useEffect(() => {
    checkOllamaConnection();
  }, []);

  const astro = calculationData?.astrology || {};
  const dasha = calculationData?.dasha || {};
  const moonSign = astro.moonSign?.name || astro.moonSign?.sign || 'Capricorn';
  const lagnaSign = astro.lagna?.sign?.name || astro.ascendant?.sign || 'Gemini';
  const activeMaha = dasha.current?.mahadasha?.planet || dasha.current?.mahadasha?.lord || 'Jupiter';
  const activeAntar = dasha.current?.antardasha?.planet || dasha.current?.antardasha?.lord || 'Saturn';
  const name = fullName || calculationData?.fullName || 'Seeker';

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = getEffectiveAudioLang();

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setQuestion(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language, aiLanguage]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      setQuestion(initialQuery);
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(language === 'hi' ? 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता।' : 'Your browser does not support voice input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = getEffectiveAudioLang();
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition failed to start:', err);
      }
    }
  };

  const handleSpeak = (messageId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/###/g, '')
      .replace(/####/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/---/g, '')
      .replace(/>/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = getEffectiveAudioLang(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (messageId: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    }
  };

  const handleResetChat = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setMessages([]);
    setLatestFollowUps([]);
    setQueryAnswer(null);
  };

  const handleSearch = async (queryToRun?: string) => {
    const q = (queryToRun !== undefined ? queryToRun : question).trim();
    if (!q) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setQuestion('');
    setLoading(true);
    setIsAiStreaming(true);
    setActiveStreamingText('');

    const userMessageId = `user_${Date.now()}`;
    const assistantMessageId = `ai_${Date.now()}`;

    const newUserMsg: ChatMessageItem = {
      id: userMessageId,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, newUserMsg];
    setMessages(updatedHistory);

    // 1. Run deterministic calculation engine
    try {
      const result = executeQueryEngine(calculationData, q, {
        transitDate,
        fullName: fullName || calculationData?.fullName,
        calculationReproducibilityHash: calculationData?.reproducibilityHash || calculationData?.hash,
      });
      setQueryAnswer(result.query);
      setAudit(result.audit);
    } catch (err) {
      console.error('Failed to execute query engine:', err);
    }

    // 2. Stream from local AI Hybrid RAG Engine with conversation history
    try {
      const conversationPayload = updatedHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const effectiveEngine = engineMode === 'cloud' ? cloudProvider : engineMode;
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          calculationData,
          fullName: fullName || calculationData?.fullName,
          language: aiLanguage,
          conversationHistory: conversationPayload,
          engineMode: effectiveEngine,
          selectedModel: engineMode === 'ollama' ? selectedModel : undefined,
          apiKey: apiKey ? apiKey.trim() : undefined,
          apiProvider: engineMode === 'cloud' ? cloudProvider : undefined,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('AI endpoint response error');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';
      let detectedTopic = 'GENERAL';
      let followUps: Array<{ en: string; hi: string; query: string }> = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'meta') {
                detectedTopic = data.topic || 'GENERAL';
                if (data.followUps) {
                  followUps = data.followUps;
                  setLatestFollowUps(followUps);
                }
              } else if (data.type === 'token') {
                accumulated += data.token;
                setActiveStreamingText(accumulated);
              } else if (data.type === 'done') {
                if (data.followUps) {
                  followUps = data.followUps;
                  setLatestFollowUps(followUps);
                }
              }
            } catch {
              // Ignore partial chunk parsing
            }
          }
        }
      }

      const finalAssistantMsg: ChatMessageItem = {
        id: assistantMessageId,
        role: 'assistant',
        content: accumulated,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topic: detectedTopic,
        followUps,
      };

      setMessages((prev) => [...prev, finalAssistantMsg]);
      setActiveStreamingText('');
    } catch (aiErr) {
      console.warn('AI streaming fallback error:', aiErr);
    } finally {
      setIsAiStreaming(false);
      setLoading(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const isHi = language === 'hi';

  return (
    <div className="space-y-8" id="tab-query-container">
      {/* 1. Proactive Daily Life Briefing Banner */}
      <DailyLifeBriefing
        calculationData={calculationData}
        fullName={fullName}
        onAskQuestion={(q) => handleSearch(q)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
      />

      {/* 2. Personal AI Agent Console Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Agent Profile & Quick Consultations Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Agent Persona Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-amber-400/40">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-100 text-base">Vedica AI</h3>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {isHi ? 'व्यक्तिगत वैदिक जीवन सलाहकार' : 'Personal Vedic Life Consultant'}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    {isHi ? 'लोकल एआई • १००% निजी' : 'Local AI • 100% Private'}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Seeker Chart Context Pill */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                <span>{isHi ? 'सक्रिय कुण्डली विवरण' : 'Active Natal Matrix'}</span>
                <span className="text-amber-400 font-normal">{name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="text-slate-400">
                  {isHi ? 'लग्न:' : 'Lagna:'} <strong className="text-slate-200">{lagnaSign}</strong>
                </div>
                <div className="text-slate-400">
                  {isHi ? 'राशि:' : 'Rashi:'} <strong className="text-slate-200">{moonSign}</strong>
                </div>
                <div className="text-slate-400 col-span-2">
                  {isHi ? 'वर्तमान दशा:' : 'Active Dasha:'} <strong className="text-amber-400">{activeMaha}-{activeAntar}</strong>
                </div>
              </div>
            </div>

            {/* AI Engine Selector Card */}
            <div className="bg-slate-950/90 border border-indigo-900/40 rounded-2xl p-3.5 space-y-3 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                <span>{isHi ? '⚙️ एआई इंजन मोड' : '⚙️ AI Intelligence Engine'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                  engineMode === 'cloud'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : engineMode === 'ollama'
                    ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {engineMode === 'cloud' ? 'CLOUD AI' : engineMode === 'ollama' ? 'LOCAL LLM' : 'ZERO LATENCY'}
                </span>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => updateEngineMode('rag')}
                  className={`py-1.5 px-1.5 rounded-lg text-[10.5px] font-medium transition-all flex items-center justify-center gap-1 ${
                    engineMode === 'rag'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Deterministic Vedic Astrological Reasoner"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isHi ? 'वैदिक इंजन' : 'Vedic RAG'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateEngineMode('cloud')}
                  className={`py-1.5 px-1.5 rounded-lg text-[10.5px] font-medium transition-all flex items-center justify-center gap-1 ${
                    engineMode === 'cloud'
                      ? 'bg-emerald-600 text-white font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Cloud AI Reasoning (Groq Llama 3.3, Gemini, OpenAI)"
                >
                  <Cloud className="w-3 h-3" />
                  <span>{isHi ? 'क्लाउड एआई' : 'Cloud AI'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateEngineMode('ollama');
                    if (!ollamaStatus.connected) checkOllamaConnection();
                  }}
                  className={`py-1.5 px-1.5 rounded-lg text-[10.5px] font-medium transition-all flex items-center justify-center gap-1 ${
                    engineMode === 'ollama'
                      ? 'bg-indigo-600 text-white font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Local Desktop Ollama Daemon"
                >
                  <Bot className="w-3 h-3" />
                  <span>{isHi ? 'लोकल ओलामा' : 'Ollama'}</span>
                </button>
              </div>

              {/* Engine Context Details */}
              {engineMode === 'rag' ? (
                <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-amber-400 font-semibold mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{isHi ? 'यूनिवर्सल सिमेंटिक वैदिक रीज़नर' : 'Universal Semantic Vedic Reasoner'}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-400">
                    {isHi
                      ? 'शून्य विलंबता के साथ किसी भी प्रश्न (माता, पिता, भाई, संतान, परीक्षा, कोर्ट, कर्ज, वाहन, विवाह आदि) का भाव व ग्रह आधारित प्रत्यक्ष उत्तर।'
                      : 'Zero-latency dynamic reasoner deconstructing any custom question into 12 Bhavas, Karakas, and active Dasha timelines.'}
                  </p>
                </div>
              ) : engineMode === 'cloud' ? (
                <div className="space-y-2.5 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>{isHi ? 'क्लाउड एलएलएम प्रोवाइडर' : 'Cloud LLM Provider'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">
                        {isHi ? 'एआई प्रोवाइडर चुनें:' : 'Select Provider:'}
                      </label>
                      <select
                        value={cloudProvider}
                        onChange={(e) => updateCloudProvider(e.target.value as any)}
                        className="w-full bg-slate-950 border border-indigo-900/50 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="groq">Groq (Llama 3.3 70B — 500 T/s Ultra-Fast)</option>
                        <option value="gemini">Google Gemini (1.5 Flash)</option>
                        <option value="openai">OpenAI (GPT-4o-mini)</option>
                        <option value="deepseek">DeepSeek (V3 Chat)</option>
                        <option value="openrouter">OpenRouter AI</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] text-slate-400">
                          {isHi ? 'एपीआई की (वैकल्पिक):' : 'API Key (Optional / Bring Your Own):'}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          {showApiKey ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                          <span>{showApiKey ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          onChange={(e) => updateApiKey(e.target.value)}
                          placeholder={
                            cloudProvider === 'groq'
                              ? 'gsk_... (or leave empty to use server key)'
                              : cloudProvider === 'gemini'
                              ? 'AIzaSy... (or leave empty)'
                              : 'sk-... (or leave empty)'
                          }
                          className="w-full bg-slate-950 border border-indigo-900/50 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <p className="text-[9.5px] text-slate-500 mt-1">
                        {cloudProvider === 'groq' ? (
                          <span>
                            Tip: Get a 100% free Groq key at{' '}
                            <a
                              href="https://console.groq.com/keys"
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 underline hover:text-emerald-300"
                            >
                              console.groq.com
                            </a>
                          </span>
                        ) : cloudProvider === 'gemini' ? (
                          <span>
                            Tip: Get a free Gemini key at{' '}
                            <a
                              href="https://aistudio.google.com/"
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 underline hover:text-emerald-300"
                            >
                              aistudio.google.com
                            </a>
                          </span>
                        ) : (
                          <span>Keys are stored securely in your browser localStorage.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ollamaStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      <span className="text-[11px] font-semibold text-slate-300">
                        {ollamaStatus.connected
                          ? isHi
                            ? 'ओलामा कनेक्टेड'
                            : 'Ollama Connected'
                          : isHi
                          ? 'ओलामा ऑफलाइन'
                          : 'Ollama Offline'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={checkOllamaConnection}
                      disabled={ollamaStatus.loading}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 underline font-mono"
                    >
                      {ollamaStatus.loading ? 'Checking...' : 'Refresh'}
                    </button>
                  </div>

                  {ollamaStatus.connected && ollamaStatus.models.length > 0 ? (
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">
                        {isHi ? 'मॉडल चुनें:' : 'Select Local Model:'}
                      </label>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-slate-950 border border-indigo-900/50 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        {ollamaStatus.models.map((m) => (
                          <option key={m.name} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="text-[10.5px] text-slate-400 leading-snug space-y-1">
                      <p>
                        {isHi
                          ? 'लोकल मॉडल चलाने के लिए टर्मिनल में रन करें:'
                          : 'To use local LLM, run in terminal:'}
                      </p>
                      <code className="block bg-slate-950 px-2 py-1 rounded text-[10px] text-emerald-400 font-mono border border-slate-800">
                        ollama run qwen2.5:3b
                      </code>
                      <p className="text-[10px] text-slate-500 italic">
                        {isHi
                          ? '(ऑटो-फॉलबैक: गणितीय वैदिक इंजन सक्रिय रहेगा)'
                          : '(Auto-fallback to Vedic Mathematical engine if offline)'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* AI Conversation Language Selector */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    {isHi ? 'बातचीत की भाषा' : 'Conversation Language'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono font-normal">
                    {aiLanguage === 'auto'
                      ? isHi ? 'स्मार्ट ऑटो' : 'Smart Auto'
                      : aiLanguage === 'hi'
                      ? 'हिंदी (Hindi)'
                      : aiLanguage === 'hinglish'
                      ? 'Hinglish ✨'
                      : 'English'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
                  {[
                    { id: 'auto', label: isHi ? 'ऑटो' : 'Auto' },
                    { id: 'en', label: 'English' },
                    { id: 'hi', label: 'हिंदी' },
                    { id: 'hinglish', label: 'Hinglish' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAiLanguage(opt.id as any)}
                      className={`py-1.5 rounded-lg text-[10.5px] font-medium transition-all text-center cursor-pointer ${
                        aiLanguage === opt.id
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleResetChat}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isHi ? 'नई बातचीत शुरू करें (+ New Consultation)' : '+ Start New Consultation'}
              </button>
            )}
          </div>

          {/* Quick Life Consultation Directory */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                {isHi ? 'त्वरित जीवन परामर्श' : 'Instant Consultations'}
              </h4>
            </div>

            <div className="space-y-3">
              {QUICK_CONSULTATIONS.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <div className={`p-1 rounded-lg ${cat.bg} ${cat.text}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{isHi ? cat.nameHi : cat.name}</span>
                    </div>

                    <div className="space-y-1 pl-6">
                      {cat.queries.map((qObj, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSearch(qObj.query)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800/80 hover:border-indigo-500/40 text-slate-400 hover:text-slate-100 text-[11px] transition flex items-center justify-between group cursor-pointer"
                        >
                          <span className="line-clamp-1">{isHi ? qObj.hi : qObj.en}</span>
                          <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 shrink-0 ml-1 transition" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Main Agent Conversation Thread & Input Console (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col min-h-[600px] justify-between relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Conversation Messages Container */}
            <div className="space-y-6 flex-1 overflow-y-auto max-h-[580px] pr-2 custom-scrollbar relative z-10 pb-4">
              {messages.length === 0 && (
                <div className="text-center py-16 px-4 space-y-4 max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">
                    {isHi ? `नमस्ते ${name}, मैं आपका वेदिका एआई मार्गदर्शक हूँ` : `Hello ${name}, I am your Vedica Life Navigator`}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {isHi
                      ? 'विदेश गमन, करियर, विवाह, भवन क्रय, धन अथवा हालिया संघर्षों पर कोई भी प्रश्न पूछें। मैं आपकी कुण्डली के शास्त्रीय आधार पर सीधा व स्पष्ट उत्तर दूंगा।'
                      : 'Ask anything about foreign relocation, career path, marriage timing, real estate, or recent struggles. I will provide direct, empathetic guidance grounded in your verified chart.'}
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center gap-2">
                    {[
                      'Is there any possibility to go abroad for me?',
                      'What is my career path? Job vs business?',
                      'When will I buy a home or property?',
                      'Why am I getting fail from last 2 years?',
                    ].map((sampleQ, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSearch(sampleQ)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-medium transition cursor-pointer"
                      >
                        {sampleQ}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Render Chat History */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-amber-400 shrink-0 mt-1 shadow">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[92%] sm:max-w-[85%] rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium'
                        : 'bg-slate-950/90 border border-indigo-500/30 text-slate-100'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-2.5">
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-85 flex items-center gap-1.5">
                        {msg.role === 'user' ? (
                          <>
                            <User className="w-3.5 h-3.5" /> {name}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Vedica AI
                            {msg.topic && (
                              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 text-[10px] font-mono">
                                {msg.topic}
                              </span>
                            )}
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] opacity-60 font-mono">{msg.timestamp}</span>
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                              title="Copy Answer"
                            >
                              {copiedMessageId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSpeak(msg.id, msg.content)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition cursor-pointer"
                              title={speakingMessageId === msg.id ? 'Stop Reading' : 'Listen to Answer'}
                            >
                              {speakingMessageId === msg.id ? (
                                <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              ) : (
                                <Volume2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message Content */}
                    {msg.role === 'assistant' ? (
                      <FormattedMarkdownMessage content={msg.content} />
                    ) : (
                      <div className="text-sm leading-relaxed whitespace-pre-line font-medium text-slate-950">
                        {msg.content}
                      </div>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-9 h-9 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shrink-0 mt-1 shadow">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}

              {/* Live Streaming Active Bubble */}
              {isAiStreaming && activeStreamingText && (
                <div className="flex gap-3.5 justify-start">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-amber-400 shrink-0 mt-1 shadow">
                    <Bot className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="max-w-[92%] sm:max-w-[85%] rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-xl bg-slate-950/90 border border-indigo-500/40 text-slate-100">
                    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5">
                      <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-300 flex items-center gap-1.5 animate-pulse font-mono">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> {isHi ? 'उत्तर तैयार हो रहा है...' : 'Streaming response...'}
                      </span>
                    </div>
                    <div>
                      <FormattedMarkdownMessage content={activeStreamingText} />
                      <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Smart Contextual Follow-Up Suggestions */}
            {latestFollowUps.length > 0 && !loading && (
              <div className="py-2.5 px-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2 my-2 animate-in fade-in">
                <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  {isHi ? 'अनुवर्ती प्रश्न (Suggested Follow-Ups):' : 'Suggested Follow-Up Inquiries:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {latestFollowUps.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSearch(chip.query)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-indigo-900/50 border border-indigo-500/30 hover:border-indigo-400 text-slate-200 hover:text-white text-xs font-medium transition text-left flex items-center gap-1.5 group cursor-pointer shadow-sm"
                    >
                      <span>{isHi ? chip.hi : chip.en}</span>
                      <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fixed Bottom Input Bar & Microphone */}
            <div className="pt-3 border-t border-slate-800/80 relative z-20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
                className="relative flex items-center shadow-2xl rounded-2xl"
              >
                <div className="absolute left-4 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>

                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    isListening
                      ? (isHi ? 'सुन रहा हूँ... बोलिए...' : 'Listening... Speak now...')
                      : (isHi ? 'विदेश यात्रा, करियर, विवाह, धन या कोई भी प्रश्न पूछें...' : 'Ask about foreign travel, career, marriage, wealth, or any life inquiry...')
                  }
                  className={`w-full bg-slate-950/90 border ${
                    isListening ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-slate-700 focus:border-amber-400'
                  } rounded-2xl pl-12 pr-40 py-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner`}
                />

                {/* Microphone Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-24 p-2.5 rounded-xl transition cursor-pointer flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse shadow-lg'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak your question'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !question.trim()}
                  className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer"
                >
                  {loading ? (isHi ? 'विश्लेषण...' : 'Analyzing...') : (isHi ? 'पूछें' : 'Send')}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Technical Calculation Evidence Accordion (Collapsible for Transparency) */}
      {queryAnswer && (
        <div className="space-y-4 pt-2">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <button
              type="button"
              onClick={() => setShowEvidenceAccordion(!showEvidenceAccordion)}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{isHi ? 'शास्त्रीय गणना प्रमाण देखें' : 'View Underlying Astrological Calculation Evidence'}</span>
                <span className="text-xs text-slate-500 font-mono">
                  ({queryAnswer.evidenceGroups.reduce((acc, g) => acc + g.evidence.length, 0)} {isHi ? 'प्रमाण' : 'evidence items'})
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-400 group-hover:text-amber-300 font-semibold">
                <span>{showEvidenceAccordion ? (isHi ? 'छिपाएं' : 'Hide Details') : (isHi ? 'खोलें' : 'Expand Details')}</span>
                {showEvidenceAccordion ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </button>

            {showEvidenceAccordion && (
              <div className="space-y-4 pt-3 border-t border-slate-800 animate-in fade-in">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['ALL', 'SUPPORTIVE', 'CHALLENGING', 'NEUTRAL'] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setDirectionFilter(dir)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        directionFilter === dir
                          ? 'bg-amber-500 text-slate-950 font-bold shadow'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {dir === 'ALL'
                        ? (isHi ? 'सभी' : 'ALL')
                        : dir === 'SUPPORTIVE'
                        ? (isHi ? 'अनुकूल' : 'SUPPORTIVE')
                        : dir === 'CHALLENGING'
                        ? (isHi ? 'बाधक' : 'CHALLENGING')
                        : (isHi ? 'तटस्थ' : 'NEUTRAL')}{' '}
                      (
                      {dir === 'ALL'
                        ? queryAnswer.evidenceGroups.reduce((acc, g) => acc + g.evidence.length, 0)
                        : queryAnswer.evidenceGroups
                            .flatMap((g) => g.evidence)
                            .filter((e) => e.direction === dir).length}
                      )
                    </button>
                  ))}
                </div>

                {/* Evidence Groups */}
                <div className="space-y-4">
                  {queryAnswer.evidenceGroups.map((group, gIdx) => {
                    const groupFiltered = group.evidence.filter((e) =>
                      directionFilter === 'ALL' ? true : e.direction === directionFilter
                    );
                    if (groupFiltered.length === 0) return null;

                    return (
                      <div
                        key={gIdx}
                        className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-indigo-400" />
                            {group.title}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {groupFiltered.length} items
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {groupFiltered.map((item) => (
                            <div
                              key={item.id}
                              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 space-y-2 transition"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                    item.direction === 'SUPPORTIVE'
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                      : item.direction === 'CHALLENGING'
                                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                      : 'bg-slate-800 border-slate-700 text-slate-300'
                                  }`}
                                >
                                  {item.direction}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  Weight: {typeof item.weight === 'number' ? item.weight.toFixed(1) : (item.weight != null ? Number(item.weight).toFixed(1) : '1.0')}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-slate-200 leading-snug">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ayur-Jyotish & Circadian Bio-Rhythm Section */}
      <AyurJyotishCard
        calculationData={calculationData}
        onAskQuestion={(q) => handleSearch(q)}
      />

      {/* Modals */}
      <DecisionSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        calculationData={calculationData}
        onRunSimulationInChat={(q) => handleSearch(q)}
      />

      <LifeDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        calculationData={calculationData}
        fullName={fullName}
      />
    </div>
  );
}
