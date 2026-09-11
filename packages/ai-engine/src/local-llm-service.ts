import { SynthesizedPrompt } from './prompt-synthesizer.js';

declare const process: { env: Record<string, string | undefined> };

export interface LLMStreamOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  ollamaEndpoint?: string;
  onToken?: (token: string) => void;
  signal?: AbortSignal;
  engineMode?: 'rag' | 'ollama' | 'auto' | 'groq' | 'openai' | 'gemini' | 'deepseek' | 'openrouter';
  apiKey?: string;
  apiProvider?: 'groq' | 'openai' | 'gemini' | 'deepseek' | 'openrouter';
}

export interface LLMResponse {
  content: string;
  modelUsed: string;
  isFallback: boolean;
}

function getDarakarakaTraits(dk: string, lang: 'en' | 'hi' | 'hinglish'): string {
  const planet = (dk || 'Venus').trim();
  if (planet === 'Jupiter' || planet === 'Guru') {
    if (lang === 'hi') return 'ज्ञानी, सुसंस्कृत, नैतिक मूल्यों से युक्त, मार्गदर्शक एवं परिवार में सम्मानित';
    if (lang === 'hinglish') return 'Wise, deeply educated, ethical, mature aur family-oriented';
    return 'Wise, spiritually grounded, ethical, intellectually mature, and family-oriented';
  }
  if (planet === 'Mercury' || planet === 'Budha') {
    if (lang === 'hi') return 'कुशाग्र बुद्धि, वाक्पटु, तकनीकी/व्यापारिक समझ रखने वाले, जिज्ञासु एवं मिलनसार';
    if (lang === 'hinglish') return 'Quick-witted, articulate, commerce/tech-savvy aur great conversationalist';
    return 'Quick-witted, articulate, business/tech-savvy, intellectually curious, and expressive';
  }
  if (planet === 'Saturn' || planet === 'Shani') {
    if (lang === 'hi') return 'गंभीर, व्यावहारिक, अत्यधिक निष्ठावान, परिश्रमी एवं जीवन में स्थायित्व को महत्व देने वाले';
    if (lang === 'hinglish') return 'Mature, pragmatic, extremely loyal, hardworking aur grounded';
    return 'Mature, realistic, deeply loyal, hard-working, and focused on stability and long-term security';
  }
  if (planet === 'Mars' || planet === 'Mangal') {
    if (lang === 'hi') return 'ऊर्जावान, साहसी, स्पष्टवादी, महत्वाकांक्षी एवं जीवन में सक्रिय नेतृत्व करने वाले';
    if (lang === 'hinglish') return 'Energetic, bold, straightforward, ambitious aur action-oriented';
    return 'Dynamic, courageous, direct, ambitious, action-oriented, and highly driven';
  }
  if (planet === 'Moon' || planet === 'Chandra') {
    if (lang === 'hi') return 'संवेदनशील, करुणामयी, भावनात्मक रूप से समझदार, पारिवारिक एवं पोषण करने वाले स्वभाव के';
    if (lang === 'hinglish') return 'Empathetic, compassionate, caring, family-focused aur emotionally intuitive';
    return 'Empathetic, caring, emotionally intuitive, family-oriented, and nurturing';
  }
  if (planet === 'Sun' || planet === 'Surya') {
    if (lang === 'hi') return 'स्वाभिमानी, प्रभावशाली व्यक्तित्व, नेतृत्व क्षमता संपन्न एवं समाज में प्रतिष्ठित';
    if (lang === 'hinglish') return 'Dignified, leadership-oriented, high self-respect aur prominent social standing';
    return 'Dignified, natural leader, confident, possessing strong self-respect and social distinction';
  }
  // Default Venus / Shukra
  if (lang === 'hi') return 'सौंदर्यप्रिय, सुरुचिपूर्ण, सौम्य, कलात्मक दृष्टि संपन्न, स्नेही एवं परस्पर सम्मान को महत्व देने वाले';
  if (lang === 'hinglish') return 'Charming, refined, graceful, artistic taste aur emotionally supportive';
  return 'Refined, charming, graceful, aesthetically inclined, peaceful, and emotionally supportive';
}

function getSeventhHouseTraits(sign: string, lang: 'en' | 'hi' | 'hinglish'): string {
  const s = (sign || 'Sagittarius').toLowerCase();
  if (s.includes('sagittarius') || s.includes('dhanu')) {
    if (lang === 'hi') return 'धनु (गुरु शासित): उच्च शिक्षित, दार्शनिक सोच, खुले विचारों वाले एवं सत्यनिष्ठ';
    if (lang === 'hinglish') return 'Sagittarius (Jupiter): Broad-minded, philosophical, highly educated aur truthful';
    return 'Sagittarius (Jupiter-ruled): Broad-minded, well-educated, visionary, and philosophical';
  }
  if (s.includes('gemini') || s.includes('mithuna')) {
    if (lang === 'hi') return 'मिथुन (बुध शासित): आधुनिक, संवादकुशल, बहुमुखी प्रतिभा के धनी एवं बहु-कार्यकुशल';
    if (lang === 'hinglish') return 'Gemini (Mercury): Modern, witty, communicative aur multi-talented';
    return 'Gemini (Mercury-ruled): Modern, witty, highly communicative, and versatile';
  }
  if (s.includes('taurus') || s.includes('vrishabha') || s.includes('libra') || s.includes('tula')) {
    if (lang === 'hi') return 'शुक्र शासित: सुरुचिपूर्ण, सौंदर्यप्रिय, संतुलित, शांतिप्रिय एवं निष्ठावान';
    if (lang === 'hinglish') return 'Venus-ruled: Graceful, balanced, peace-loving aur loyal';
    return 'Venus-ruled: Elegant, balanced, harmony-seeking, loyal, and appreciative of comfort';
  }
  if (s.includes('aries') || s.includes('mesha') || s.includes('scorpio') || s.includes('vrischika')) {
    if (lang === 'hi') return 'मंगल शासित: साहसी, ऊर्जावान, स्वतंत्र विचार एवं स्पष्ट निर्णय लेने वाले';
    if (lang === 'hinglish') return 'Mars-ruled: Bold, dynamic, independent thinker aur decisive';
    return 'Mars-ruled: Courageous, dynamic, decisive, and independently minded';
  }
  if (s.includes('capricorn') || s.includes('makara') || s.includes('aquarius') || s.includes('kumbha')) {
    if (lang === 'hi') return 'शनि शासित: गंभीर, व्यवस्थित, कर्मठ, यथार्थवादी एवं विश्वसनीय';
    if (lang === 'hinglish') return 'Saturn-ruled: Grounded, practical, disciplined aur dependable';
    return 'Saturn-ruled: Practical, disciplined, grounded, methodical, and dependable';
  }
  if (s.includes('cancer') || s.includes('karka') || s.includes('pisces') || s.includes('meena')) {
    if (lang === 'hi') return 'जल तत्व / सौम्य: दयालु, भावनात्मक रूप से गहरे, अंतर्ज्ञानी एवं पारिवारिक मूल्यों के प्रति समर्पित';
    if (lang === 'hinglish') return 'Water sign: Intuitive, caring, emotionally deep aur dedicated to family';
    return 'Water sign: Intuitive, caring, emotionally perceptive, and family-dedicated';
  }
  if (s.includes('leo') || s.includes('simha') || s.includes('virgo') || s.includes('kanya')) {
    if (lang === 'hi') return 'तेजस्वी व व्यवस्थित: विश्लेषणात्मक, कर्तव्यनिष्ठ, स्वाभिमानी एवं परिपक्व';
    if (lang === 'hinglish') return 'Analytical, organized, high self-respect aur duty-conscious';
    return 'Analytical, organized, conscientious, dignified, and detail-oriented';
  }
  return lang === 'hi' ? 'संतुलित एवं बुद्धिमान' : 'Balanced, intelligent, and supportive';
}

export class LocalLLMService {
  private defaultModel: string;
  private defaultEndpoint: string;

  constructor(options?: { model?: string; endpoint?: string }) {
    this.defaultModel = options?.model || process.env.LOCAL_LLM_MODEL || 'qwen2.5:3b';
    this.defaultEndpoint = options?.endpoint || process.env.OLLAMA_ENDPOINT || 'http://127.0.0.1:11434';
  }

  /**
   * Check if local Ollama daemon is reachable
   */
  async isOllamaAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.defaultEndpoint}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(1500),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Stream response from Cloud LLM (Groq, Gemini, OpenAI, DeepSeek, OpenRouter), local Ollama, or dynamic reasoner
   */
  async *streamResponse(
    prompt: SynthesizedPrompt,
    options?: LLMStreamOptions
  ): AsyncGenerator<string, LLMResponse, unknown> {
    // 1. Check for Cloud LLM (Groq, Gemini, OpenAI, DeepSeek, OpenRouter)
    const isExplicitRag = options?.engineMode === 'rag';
    const provider = options?.apiProvider || (
      options?.apiKey ? 'groq' :
      process.env.GROQ_API_KEY ? 'groq' :
      process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY ? 'gemini' :
      process.env.OPENAI_API_KEY ? 'openai' :
      process.env.DEEPSEEK_API_KEY ? 'deepseek' :
      process.env.OPENROUTER_API_KEY ? 'openrouter' :
      null
    );

    const apiKey = options?.apiKey || (
      provider === 'groq' ? process.env.GROQ_API_KEY :
      provider === 'gemini' ? (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) :
      provider === 'openai' ? process.env.OPENAI_API_KEY :
      provider === 'deepseek' ? process.env.DEEPSEEK_API_KEY :
      provider === 'openrouter' ? process.env.OPENROUTER_API_KEY :
      null
    );

    if (provider && apiKey && !isExplicitRag) {
      try {
        const stream = this.streamFromCloudLLM(prompt, provider as any, apiKey, options);
        let accumulated = '';
        for await (const chunk of stream) {
          accumulated += chunk;
          yield chunk;
          options?.onToken?.(chunk);
        }
        if (accumulated.trim().length > 0) {
          return {
            content: accumulated,
            modelUsed: `${provider}:${options?.model || 'default'}`,
            isFallback: false,
          };
        }
      } catch (cloudErr) {
        console.warn(`${provider} streaming error, falling back to local or deterministic reasoner:`, cloudErr);
      }
    }

    // 2. Check for local Ollama
    const shouldTryOllama = !isExplicitRag;
    if (shouldTryOllama) {
      const isAvailable = await this.isOllamaAvailable();
      if (isAvailable) {
        try {
          const stream = this.streamFromOllama(prompt, options);
          let accumulated = '';
          for await (const chunk of stream) {
            accumulated += chunk;
            yield chunk;
          }
          return {
            content: accumulated,
            modelUsed: options?.model || this.defaultModel,
            isFallback: false,
          };
        } catch (err) {
          console.warn('Ollama streaming error, falling back to deterministic synthesizer:', err);
        }
      }
    }

    // 3. Dynamic Semantic Astrological Reasoner Fallback (Zero Latency)
    const fallbackText = this.generateSynthesizedRAGResponse(prompt);
    // Split into readable natural phrases / words for snappy smooth rendering
    const phrases = fallbackText.split(/(\s+)/);
    let accumulated = '';

    for (let i = 0; i < phrases.length; i++) {
      if (options?.signal?.aborted) break;
      const chunk = phrases[i];
      if (!chunk) continue;
      accumulated += chunk;
      yield chunk;
      options?.onToken?.(chunk);
      // Fast responsive streaming cadence
      if (i % 4 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 2));
      }
    }

    return {
      content: accumulated,
      modelUsed: 'vedica-dynamic-semantic-reasoner-v2',
      isFallback: true,
    };
  }

  private async *streamFromCloudLLM(
    prompt: SynthesizedPrompt,
    provider: 'groq' | 'openai' | 'gemini' | 'deepseek' | 'openrouter',
    apiKey: string,
    options?: LLMStreamOptions
  ): AsyncGenerator<string, void, unknown> {
    let endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    let defaultModel = 'llama-3.3-70b-versatile';

    if (provider === 'openai') {
      endpoint = 'https://api.openai.com/v1/chat/completions';
      defaultModel = 'gpt-4o-mini';
    } else if (provider === 'gemini') {
      endpoint = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
      defaultModel = 'gemini-1.5-flash';
    } else if (provider === 'deepseek') {
      endpoint = 'https://api.deepseek.com/chat/completions';
      defaultModel = 'deepseek-chat';
    } else if (provider === 'openrouter') {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      defaultModel = 'google/gemini-2.0-flash-001';
    } else {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      defaultModel = 'llama-3.3-70b-versatile';
    }

    const model = options?.model || defaultModel;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: prompt.systemPrompt },
          { role: 'user', content: prompt.userPrompt },
        ],
        stream: true,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1500,
      }),
      signal: options?.signal,
    });

    if (!res.ok || !res.body) {
      const errText = await res.text().catch(() => '');
      throw new Error(`${provider.toUpperCase()} API error (${res.status}): ${errText || res.statusText}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;
          if (trimmed === 'data: [DONE]') break;
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              const text = data.choices?.[0]?.delta?.content || '';
              if (text) {
                yield text;
              }
            } catch {
              // ignore partial JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private async *streamFromOllama(
    prompt: SynthesizedPrompt,
    options?: LLMStreamOptions
  ): AsyncGenerator<string, void, unknown> {
    const model = options?.model || this.defaultModel;
    const res = await fetch(`${this.defaultEndpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        system: prompt.systemPrompt,
        prompt: prompt.userPrompt,
        stream: true,
        options: {
          temperature: options?.temperature ?? 0.7,
          num_predict: options?.maxTokens ?? 1200,
        },
      }),
      signal: options?.signal,
    });

    if (!res.ok || !res.body) {
      throw new Error(`Ollama returned status ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              yield parsed.response;
            }
          } catch {
            // Ignore partial lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Deterministic High-Fidelity RAG Response Generator
   * Covers all life domains, entities, and arbitrary questions dynamically in English, Hindi, and Hinglish
   */
  private generateSynthesizedRAGResponse(prompt: SynthesizedPrompt): string {
    const { context } = prompt;
    const lang = context.language || 'en';
    const rating = context.confidenceRating;
    const sav = context.savScores || {};
    const jaimini = context.jaiminiKarakas || {};

    if (lang === 'hi') {
      return this.generateHindiRAGResponse(context, rating, sav, jaimini);
    }
    if (lang === 'hinglish') {
      return this.generateHinglishRAGResponse(context, rating, sav, jaimini);
    }
    return this.generateEnglishRAGResponse(context, rating, sav, jaimini);
  }

  /**
   * Universal Question Astrological Deconstructor
   * Dynamically maps ANY question to its authentic Vedic Bhava (1H-12H), Karaka, and domain strategy
   */
  private resolveQuestionAstrology(question: string = '', context: any): {
    matched: boolean;
    topicTitleEn: string;
    topicTitleHi: string;
    topicTitleHinglish: string;
    verdictEn: string;
    verdictHi: string;
    verdictHinglish: string;
    primaryHouseNum: number;
    secondaryHouseNum?: number;
    karakaPlanet: string;
    doEn: string;
    avoidEn: string;
    practiceEn: string;
    doHi: string;
    avoidHi: string;
    practiceHi: string;
    doHinglish: string;
    avoidHinglish: string;
    practiceHinglish: string;
  } {
    const q = (question || context.questionQuery || '').toLowerCase().trim();

    // 1. Mother / Maternal Well-being
    if (/\b(mother|mom|maa|mata|matru|mumma)\b/i.test(q) || /(माता|माँ|मातृ)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Mother & Domestic Well-Being Assessment',
        topicTitleHi: 'माता का स्वास्थ्य एवं मातृ सुख विश्लेषण',
        topicTitleHinglish: "Mother's Well-Being & Domestic Harmony Analysis",
        verdictEn: 'Supportive Matru Karma with Strong Emotional Resonance',
        verdictHi: 'मातृ सुख एवं भावनात्मक सहयोग के उत्तम ज्योतिषीय संकेत',
        verdictHinglish: 'Strong Matru Karma aur supportive emotional connection',
        primaryHouseNum: 4,
        karakaPlanet: 'Moon (Chandra)',
        doEn: 'Support mother with calm listening, attentive care, and regular wellness routines.',
        avoidEn: 'Engaging in reactive arguments or overlooking subtle emotional cues.',
        practiceEn: 'Offer gratitude to mother daily; chant "Om Som Somaya Namaha" on Mondays for emotional tranquility.',
        doHi: 'माता की सेवा, शांत संवाद और उनकी स्वास्थ्य देखभाल को प्राथमिकता दें।',
        avoidHi: 'पारिवारिक बातचीत में अधीर होने या विवाद करने से बचें।',
        practiceHi: 'प्रतिदिन माता का आशीर्वाद लें और सोमवार को चंद्र मंत्र का जप करें।',
        doHinglish: 'Maa ke sath daily calm conversation aur care maintain karein.',
        avoidHinglish: 'Unnecessary arguments ya emotional distance avoid karein.',
        practiceHinglish: 'Daily mother ki blessings lein aur Monday ko peaceful state maintain karein.',
      };
    }

    // 2. Father / Paternal Guidance
    if (/\b(father|dad|papa|pita|pitru|pitaji)\b/i.test(q) || /(पिता|पापा|पितृ|पिताजी)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Father & Paternal Guidance Alignment',
        topicTitleHi: 'पिता का स्वास्थ्य एवं पितृ सहयोग विश्लेषण',
        topicTitleHinglish: "Father's Health & Paternal Support Roadmap",
        verdictEn: 'Dignified Paternal Support & Dharma Lineage Alignment',
        verdictHi: 'पिता के साथ उत्तम सहयोग एवं पितृ कृपा के प्रबल योग',
        verdictHinglish: 'Strong Paternal blessings aur family guidance',
        primaryHouseNum: 9,
        karakaPlanet: 'Sun (Surya)',
        doEn: 'Seek paternal wisdom for long-term decisions and maintain ethical conduct in career.',
        avoidEn: 'Imposing unilateral decisions without discussing with elders.',
        practiceEn: 'Offer fresh water to the rising Sun daily (Surya Arghya) with copper vessel for fatherly strength.',
        doHi: 'महत्वपूर्ण निर्णयों में पिता से परामर्श लें और सत्यनिष्ठा का पालन करें।',
        avoidHi: 'पारिवारिक वरिष्ठों के अनुभव की उपेक्षा करने से बचें।',
        practiceHi: 'प्रातः तांबे के पात्र से सूर्य को जल (अर्घ्य) अर्पित करें।',
        doHinglish: 'Major career decisions me father se advice lein aur respect maintain karein.',
        avoidHinglish: 'Elders ke experience ko disregard karna avoid karein.',
        practiceHinglish: 'Daily morning copper vessel se Surya ko water offer karein.',
      };
    }

    // 3. Younger / Elder Siblings
    if (/\b(brother|sister|sibling|bhai|behen|bhaiya|didi)\b/i.test(q) || /(भाई|बहन|सहोदर)/.test(q)) {
      const isElder = /\b(elder|bada|badi)\b/i.test(q);
      const houseNum = isElder ? 11 : 3;
      return {
        matched: true,
        topicTitleEn: `${isElder ? 'Elder' : 'Younger'} Siblings & Mutual Camaraderie`,
        topicTitleHi: 'भाई-बहन एवं सहोदर संबंध विश्लेषण',
        topicTitleHinglish: 'Siblings & Mutual Support Assessment',
        verdictEn: 'Collaborative Enterprise & Mutual Protection',
        verdictHi: 'पारस्परिक सहयोग एवं सौहार्दपूर्ण संबंध',
        verdictHinglish: 'Strong sibling synergy aur practical support',
        primaryHouseNum: houseNum,
        karakaPlanet: isElder ? 'Jupiter (Guru)' : 'Mars (Mangal)',
        doEn: 'Foster open communication, celebrate each other\'s milestones, and collaborate on shared initiatives.',
        avoidEn: 'Comparing personal career trajectories or competing in ego battles.',
        practiceEn: 'Share auspicious meals together and support each other with honest encouragement.',
        doHi: 'आपसी संवाद में स्पष्टता रखें और एक-दूसरे की प्रगति में संबल बनें।',
        avoidHi: 'अहंकार के टकराव या एक-दूसरे की तुलना करने से बचें।',
        practiceHi: 'मंगलवार को हनुमान चालीसा का पाठ करें और सौहार्द बनाए रखें।',
        doHinglish: 'Ek doosre ke career goals ko support karein aur open communication rakhein.',
        avoidHinglish: 'Comparison ya unnecessary ego clashes avoid karein.',
        practiceHinglish: 'Tuesdays ko mutual bonding aur grounding practice follow karein.',
      };
    }

    // 4. Children / Conception / Progeny
    if (/\b(child|children|baby|pregnancy|conceive|son|daughter|baccha|bacha|santana|garbh|beta|beti)\b/i.test(q) || /(संतान|बच्चा|गर्भावस्था|बेटा|बेटी)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Children & Progeny Prospects Assessment',
        topicTitleHi: 'संतान सुख, विद्या एवं प्रगति विश्लेषण',
        topicTitleHinglish: 'Children & Progeny Prospects Blueprint',
        verdictEn: 'Auspicious Putra Bhava Resonance & Intellectual Lineage',
        verdictHi: 'संतान सुख एवं बौद्धिक प्रगति के उत्तम योग',
        verdictHinglish: 'Positive 5th house activation for children & family growth',
        primaryHouseNum: 5,
        karakaPlanet: 'Jupiter (Brihaspati)',
        doEn: 'Focus on harmonious lifestyle, nutritional vitality, and encouraging children\'s natural curiosity.',
        avoidEn: 'Imposing rigid expectations or experiencing anxiety over societal timelines.',
        practiceEn: 'Maintain a peaceful home sanctuary; light a ghee lamp on Thursdays and honor mentors.',
        doHi: 'बच्चों की स्वाभाविक रुचियों को प्रोत्साहन दें और घर में शांत वातावरण रखें।',
        avoidHi: 'अनावश्यक चिंता या बच्चों पर अत्यधिक दबाव बनाने से बचें।',
        practiceHi: 'गुरुवार को सात्विक आहार लें और विद्वानों का सम्मान करें।',
        doHinglish: 'Children ki natural curiosity ko nurture karein aur home environment peaceful rakhein.',
        avoidHinglish: 'Excessive societal pressure ya anxiety lena avoid karein.',
        practiceHinglish: 'Thursdays ko simple charity aur gratitude maintain karein.',
      };
    }

    // 5. Competitive Exams / UPSC / IIT / Studies
    if (/\b(exam|upsc|test|competition|clear exam|entrance|competitive|iit|neet|cfa|mba|padhai|pariksha|sarkari pariksha|result|interview)\b/i.test(q) || /(परीक्षा|प्रतियोगिता|यूपीएससी|इंटरव्यू|अध्ययन)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Competitive Exam & Academic Triumph Blueprint',
        topicTitleHi: 'प्रतियोगी परीक्षा, साक्षात्कार एवं सफलता विश्लेषण',
        topicTitleHinglish: 'Competitive Exam & High-Stakes Test Blueprint',
        verdictEn: 'High Conceptual Retention & Competitive Sharpness',
        verdictHi: 'तीक्ष्ण बुद्धि, एकाग्रता एवं परीक्षा में सफलता के प्रबल योग',
        verdictHinglish: 'High focus and strong exam clearing leverage under 5H/6H activation',
        primaryHouseNum: 5,
        secondaryHouseNum: 6,
        karakaPlanet: 'Mercury (Budha) & Jupiter',
        doEn: 'Study in deep 90-minute distraction-free blocks with weekly simulated timed mock tests.',
        avoidEn: 'Passive highlighting, last-minute cramming, or irregular sleep cycles before exams.',
        practiceEn: 'Practice 5 minutes of morning Pranayama (Nadi Shodhana) to sharpen memory and neural focus.',
        doHi: 'नियमित 90 मिनट के एकाग्र स्लॉट्स में मॉक टेस्ट का अभ्यास करें।',
        avoidHi: 'परीक्षा से पूर्व नींद में अनियमितता या बहु-कार्य (multitasking) से बचें।',
        practiceHi: 'प्रातः 5 मिनट भ्रामरी व नाड़ी शोधन प्राणायाम करें।',
        doHinglish: 'Deep work study blocks aur regular mock test analysis follow karein.',
        avoidHinglish: 'Last-moment cramming aur irregular sleep routine avoid karein.',
        practiceHinglish: 'Morning 5 mins deep breathing karein for sharp focus and memory.',
      };
    }

    // 6. Vehicles / Car / Bike Purchase
    if (/\b(car|vehicle|automobile|bike|vahan|gadi|gaadi|buy car|drive)\b/i.test(q) || /(गाड़ी|वाहन|कार|बाइक|वाहन सुख)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Vehicle Acquisition & Conveyance Bliss (Vahana Sukha)',
        topicTitleHi: 'वाहन क्रय एवं वाहन सुख योग विश्लेषण',
        topicTitleHinglish: 'Vehicle Purchase & Vahana Sukha Roadmap',
        verdictEn: 'Favorable Conveyance Activation & Safe Travel Alignment',
        verdictHi: 'वाहन प्राप्ति एवं सुखद यात्रा के अनुकूल योग',
        verdictHinglish: 'Supportive 4th house alignment for vehicle purchase',
        primaryHouseNum: 4,
        karakaPlanet: 'Venus (Shukra)',
        doEn: 'Select vehicles prioritizing build quality, safety ratings, and sensible finance structures.',
        avoidEn: 'Impulsive over-leveraged luxury purchases that stretch monthly cash flow beyond 15%.',
        practiceEn: 'Keep vehicles impeccably clean and maintain mindful, alert driving habits.',
        doHi: 'सुरक्षा और उपयोगिता को प्राथमिकता देते हुए उचित बजट में वाहन चयन करें।',
        avoidHi: 'दिखावे में आकर बजट से बाहर भारी ऋण लेने से बचें।',
        practiceHi: 'वाहन को स्वच्छ रखें और संयमित ड्राइविंग का पालन करें।',
        doHinglish: 'Safety ratings aur comfortable budget ko prioritize karein.',
        avoidHinglish: 'Unnecessary luxury debt lena avoid karein.',
        practiceHinglish: 'Vehicle ko clean rakhein aur safe driving discipline follow karein.',
      };
    }

    // 7. Court Case / Legal Dispute / Enemies
    if (/\b(court|case|lawsuit|dispute|legal|lawyer|enemy|opponent|police|dushmani|shatru|muqaddama|mukadma|vivad|litigation)\b/i.test(q) || /(कोर्ट|केस|मुकदमा|शत्रु|विवाद|अदालत)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Legal Dispute, Court Case & Adversary Resolution',
        topicTitleHi: 'न्यायालय प्रकरण, शत्रु विजय एवं विवाद निवारण',
        topicTitleHinglish: 'Legal Case, Court Dispute & Resolution Roadmap',
        verdictEn: 'Strategic Fortitude & Definitive Favorable Settlement Horizon',
        verdictHi: 'धैर्य व तथ्यात्मक पक्ष से विवाद में विजय व शांति के योग',
        verdictHinglish: 'Strategic leverage and resolution through 6H/11H strength',
        primaryHouseNum: 6,
        secondaryHouseNum: 11,
        karakaPlanet: 'Mars (Mangal) & Jupiter',
        doEn: 'Rely strictly on documented evidence, maintain ethical composure, and seek structured mediation where feasible.',
        avoidEn: 'Aggressive provocations, emotional outbursts, or informal non-recorded agreements.',
        practiceEn: 'Maintain disciplined daily routine; recite Hanuman Chalisa for courage and clarity.',
        doHi: 'लिखित साक्ष्यों और कानूनी सलाह पर ही भरोसा करें तथा शांति से अपना पक्ष रखें।',
        avoidHi: 'भावुक होकर क्रोध में कोई अनुचित कदम उठाने से बचें।',
        practiceHi: 'प्रतिदिन एकाग्रता बनाए रखें और सत्य का मार्ग अपनाएं।',
        doHinglish: 'Complete documentation aur calm factual legal strategy follow karein.',
        avoidHinglish: 'Emotional anger ya unverified third-party advice avoid karein.',
        practiceHinglish: 'Daily grounding breathwork aur focused patience maintain karein.',
      };
    }

    // 8. Debts / Loans / Financial Liabilities
    if (/\b(debt|loan|emi|borrow|owe|creditor|karz|udhaar|rin|karja)\b/i.test(q) || /(कर्ज|लोन|ऋण|उधार)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Debt Clearance & Financial Equilibrium Blueprint',
        topicTitleHi: 'ऋण मुक्ति एवं आर्थिक भार निवारण विश्लेषण',
        topicTitleHinglish: 'Debt Relief & Loan Repayment Strategy',
        verdictEn: 'Systematic Debt Dissolution with Compounding Surplus Cashflow',
        verdictHi: 'व्यवस्थित वित्तीय प्रबंधन से शीघ्र ऋण मुक्ति के योग',
        verdictHinglish: 'Clear roadmap for debt resolution via 6H/11H discipline',
        primaryHouseNum: 6,
        secondaryHouseNum: 11,
        karakaPlanet: 'Saturn (Shani) & Mercury',
        doEn: 'Consolidate high-interest debts, automate principal prepayments, and cap discretionary expenses.',
        avoidEn: 'Taking fresh unsecured loans or speculating in markets to pay off existing debt.',
        practiceEn: 'Feed stray animals or contribute to selfless community service on Saturdays for Saturnian balance.',
        doHi: 'उच्च ब्याज वाले कर्जों को पहले चुकाएं और खर्चों को नियंत्रित करें।',
        avoidHi: 'कर्ज चुकाने के लिए नया सट्टा या अनियोजित ऋण लेने से बचें।',
        practiceHi: 'शनिवार को जरूरतमंदों की सेवा करें और वित्तीय अनुशासन बनाए रखें।',
        doHinglish: 'High-interest loans ko prioritize karke systematically repay karein.',
        avoidHinglish: 'New debt lena ya speculative trading se debt bharna strictly avoid karein.',
        practiceHinglish: 'Saturday selfless service aur strict budget discipline follow karein.',
      };
    }

    // 9. Gemstones / Astrological Remedies
    if (/\b(gemstone|ratna|ruby|pearl|emerald|yellow sapphire|blue sapphire|diamond|panna|manik|moti|pukhraj|neelam|heera|rudraksha|stone wear|which stone|wearing stone)\b/i.test(q) || /(रत्न|माणिक|मोती|पन्ना|पुखराज|नीलम|हीरा|रुद्राक्ष)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Gemstone & Sattvic Remedial Prescription',
        topicTitleHi: 'रत्न परामर्श एवं ग्रह शुद्धि विश्लेषण',
        topicTitleHinglish: 'Gemstone & Remedial Astrological Protocol',
        verdictEn: 'Trikona Lord Alignment for Maximum Vitality & Cognitive Elevation',
        verdictHi: 'त्रिकोणेश (1, 5, 9 भाव) के अनुकूल सात्विक रत्न धारण का विधान',
        verdictHinglish: 'Benefic Trikona lord gemstone alignment for wisdom & prosperity',
        primaryHouseNum: 1,
        secondaryHouseNum: 9,
        karakaPlanet: 'Jupiter (Brihaspati)',
        doEn: 'Wear natural, unheated stones of functional benefic lords (1st, 5th, 9th houses) set in appropriate metals on auspicious planetary horas.',
        avoidEn: 'Wearing stones of 6th, 8th, or 12th lords, or synthetic flawed gemstones.',
        practiceEn: 'Cleanse gemstones in Ganga water/raw milk before energizing with standard planetary Beej Mantras.',
        doHi: 'शुभ त्रिकोण भावों (1, 5, 9) के स्वामी ग्रहों के प्रामाणिक रत्न ही धारण करें।',
        avoidHi: 'त्रिक भावों (6, 8, 12) के मारक ग्रहों के रत्न बिना पूर्ण विश्लेषण के पहनने से बचें।',
        practiceHi: 'रत्न को शुभ मुहूर्त में धारण करें और सात्विक आचरण बनाए रखें।',
        doHinglish: 'Always certified, natural Trikona lord gemstones wear karein right finger me.',
        avoidHinglish: '6H/8H/12H lords ke stones wear karna strictly avoid karein.',
        practiceHinglish: 'Auspicious muhurta me properly energize karke wear karein.',
      };
    }

    // 10. Spirituality / Past Life / Kundalini / Occult
    if (/\b(spiritual|meditation|kundalini|past life|karma|moksha|occult|astrology learn|tantra|mantra|adhyatm|purva janma|sadhana|enlightenment)\b/i.test(q) || /(अध्यात्म|मोक्ष|कुंडलिनी|पूर्व जन्म|साधना)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Spiritual Path, Past Karma & Inner Awakening',
        topicTitleHi: 'आध्यात्मिक मार्ग, पूर्व जन्म कर्म एवं आत्मबोध',
        topicTitleHinglish: 'Spiritual Awakening & Karmic Evolution Blueprint',
        verdictEn: 'Deep Intuitive Awakening & Sovereign Spiritual Fulfillment',
        verdictHi: 'गंभीर आध्यात्मिक चेतना, ध्यान एवं मोक्ष मार्ग के उत्तम संकेत',
        verdictHinglish: 'High intuitive depth aur spiritual evolution under 8H/9H/12H axis',
        primaryHouseNum: 9,
        secondaryHouseNum: 12,
        karakaPlanet: 'Ketu & Jupiter',
        doEn: 'Cultivate a dedicated 20-minute daily meditation or japa practice in the early morning Brahma Muhurta.',
        avoidEn: 'Chasing sensational occult shortcuts or treating spiritual practices as commercial transactions.',
        practiceEn: 'Practice silent witness meditation (Sakshi Bhava) and study classical philosophical texts.',
        doHi: 'प्रातः काल नियमित 20 मिनट ध्यान व स्वाध्याय का नियम बनाएं।',
        avoidHi: 'अंधविश्वास या तंत्र-मंत्र के भ्रामक दावों में समय व्यर्थ करने से बचें।',
        practiceHi: 'मौन ध्यान और सात्विक जीवन शैली का अभ्यास करें।',
        doHinglish: 'Daily morning 20 mins meditation aur spiritual reading follow karein.',
        avoidHinglish: 'Superstitious shortcuts ya fear-based rituals avoid karein.',
        practiceHinglish: 'Mindfulness meditation aur steady lifestyle discipline maintain karein.',
      };
    }

    // 11. In-Laws / Spouse's Family
    if (/\b(in-law|mother-in-law|father-in-law|saas|sasur|sasural)\b/i.test(q) || /(ससुराल|सास|ससुर)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'In-Laws & Extended Family Harmony Blueprint',
        topicTitleHi: 'ससुराल पक्ष एवं पारिवारिक सौहार्द विश्लेषण',
        topicTitleHinglish: 'In-Laws & Extended Family Relationship Strategy',
        verdictEn: 'Constructive Interpersonal Harmony through Healthy Boundaries',
        verdictHi: 'परस्पर सम्मान एवं संतुलित सीमाओं से सौहार्दपूर्ण संबंध',
        verdictHinglish: 'Supportive family harmony with healthy emotional boundaries',
        primaryHouseNum: 8,
        karakaPlanet: 'Moon & Mercury',
        doEn: 'Maintain dignified, polite communication with well-defined healthy personal boundaries.',
        avoidEn: 'Over-reacting to generational differences or engaging in subtle domestic politics.',
        practiceEn: 'Practice unconditional neutrality and express genuine appreciation during family gatherings.',
        doHi: 'शिष्टता व सम्मान के साथ संतुलित बातचीत बनाए रखें।',
        avoidHi: 'पीढ़ीगत मतभेदों पर अधिक प्रतिक्रिया देने से बचें।',
        practiceHi: 'पारिवारिक सौहार्द के लिए धैर्य व समझदारी से कार्य करें।',
        doHinglish: 'Polite aur dignified communication maintain karein boundaries ke sath.',
        avoidHinglish: 'Generational differences par over-react karna avoid karein.',
        practiceHinglish: 'Calm and steady patience maintain karein during family meets.',
      };
    }

    // 12. Mental Peace / Stress / Anxiety / Sleep
    if (/\b(anxiety|stress|depression|mental peace|peace of mind|sleep|insomnia|restless|overthinking|tension|tanaav|neend|chinta|peace)\b/i.test(q) || /(तनाव|चिंता|मानसिक शांति|अनिद्रा|नींद|घबराहट)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Mental Serenity & Nervous System Restitution',
        topicTitleHi: 'मानसिक शांति, तनाव मुक्ति एवं सुख संरेखण',
        topicTitleHinglish: 'Mental Peace & Nervous System Equilibrium Roadmap',
        verdictEn: 'Sustained Nervous System Recovery & Circadian Realignment',
        verdictHi: 'दिनचर्या संतुलन से मानसिक शांति एवं एकाग्रता प्राप्ति',
        verdictHinglish: 'Circadian rhythm balance for complete stress relief',
        primaryHouseNum: 4,
        secondaryHouseNum: 12,
        karakaPlanet: 'Moon (Chandra)',
        doEn: 'Keep a strictly screen-free bedroom 60 minutes before sleep; take warm herbal teas and diaphragmatic breaths.',
        avoidEn: 'Late-night doom-scrolling, consuming heavy stimulants past 4 PM, or over-analyzing past events.',
        practiceEn: '10 minutes of Anulom-Vilom breathwork before bed to activate parasympathetic calming.',
        doHi: 'सोने से 1 घंटा पहले स्क्रीन से दूर रहें और निश्चित समय पर सोएं।',
        avoidHi: 'देर रात तक जागने और मन में नकारात्मक विचारों को दोहराने से बचें।',
        practiceHi: 'रात्रि में 10 मिनट अनुलोम-विलोम प्राणायाम करें।',
        doHinglish: 'Fixed sleep schedule follow karein aur bed se pehle screens band karein.',
        avoidHinglish: 'Late-night overthinking aur caffeine past 4 PM avoid karein.',
        practiceHinglish: 'Evening 10 mins slow deep breathing practice karein.',
      };
    }

    // 13. Stocks / Speculation / Crypto / Trading
    if (/\b(stock|share market|crypto|trading|speculation|satta|f&o|options|invest)\b/i.test(q) || /(शेयर बाजार|ट्रेडिंग|सट्टा|क्रिप्टो|पूंजी निवेश)/.test(q)) {
      return {
        matched: true,
        topicTitleEn: 'Capital Markets, Speculation & Strategic Asset Allocation',
        topicTitleHi: 'शेयर बाजार, ट्रेडिंग एवं पूंजी निवेश रणनीति',
        topicTitleHinglish: 'Stock Market, Trading & Capital Growth Strategy',
        verdictEn: 'Long-Term Compounding Favored over High-Leverage Speculation',
        verdictHi: 'दीर्घकालिक मूल्य आधारित निवेश में लाभ; अत्यधिक सट्टेबाजी से बचाव हितकर',
        verdictHinglish: 'Fundamental asset compounding favored over speculative trading',
        primaryHouseNum: 5,
        secondaryHouseNum: 11,
        karakaPlanet: 'Mercury (Budha) & Rahu',
        doEn: 'Invest in high-quality index funds, blue-chip market leaders, and long-term asset compounders.',
        avoidEn: 'High-leverage intraday trading, revenge trading, or betting on unverified crypto tips.',
        practiceEn: 'Automate weekly systematic investments (SIP) and review portfolio quarterly without emotional panic.',
        doHi: 'मजबूत फंडामेंटल्स वाली कंपनियों व इंडेक्स फंड्स में दीर्घकालिक निवेश करें।',
        avoidHi: 'बिना शोध के इंट्राडे ट्रेडिंग या सोशल मीडिया की सलाह पर पैसा लगाने से बचें।',
        practiceHi: 'नियमित व्यवस्थित निवेश (SIP) का अनुशासन बनाए रखें।',
        doHinglish: 'Quality stocks aur index funds me disciplined SIP maintain karein.',
        avoidHinglish: 'High-leverage F&O aur random tips par trade karna strictly avoid karein.',
        practiceHinglish: 'Automated systematic investing follow karein with strict risk management.',
      };
    }

    // Default Fallback: Maps dynamically to Lagna / 10th House / Dasha
    return {
      matched: false,
      topicTitleEn: 'Comprehensive Life & Planetary Dynamics Assessment',
      topicTitleHi: 'कुण्डली विश्लेषण एवं जीवन मार्गदर्शन',
      topicTitleHinglish: 'Astrological Blueprint & Planetary Assessment',
      verdictEn: 'High Planetary Coherence & Purposeful Evolution',
      verdictHi: 'शुभ ग्रहीय संरेखण एवं स्पष्ट जीवन दिशा',
      verdictHinglish: 'High planetary support and strategic life alignment',
      primaryHouseNum: 1,
      secondaryHouseNum: 10,
      karakaPlanet: 'Sun (Surya) & Jupiter',
      doEn: 'Align daily efforts with core strengths, maintain strict morning discipline, and execute with patience.',
      avoidEn: 'Short-term panic pivots or chasing low-leverage distractions.',
      practiceEn: '10 minutes of morning Surya Namaskar and silent contemplation.',
      doHi: 'अपने मुख्य कौशलों पर ध्यान दें और धैर्यपूर्वक कर्म करें।',
      avoidHi: 'क्षणिक रुकावटों से विचलित होकर मार्ग बदलने से बचें।',
      practiceHi: 'प्रातः सूर्य नमस्कार करें और अनुशासित दिनचर्या रखें।',
      doHinglish: 'Daily morning discipline aur focused execution maintain karein.',
      avoidHinglish: 'Short-term panic ya random distractions avoid karein.',
      practiceHinglish: 'Morning sunlight exposure aur consistent daily habits follow karein.',
    };
  }

  private buildDynamicAstrologicalResponse(
    context: any,
    rating: any,
    resolved: ReturnType<typeof this.resolveQuestionAstrology>,
    lang: 'en' | 'hi' | 'hinglish'
  ): string {
    const houseNum = resolved.primaryHouseNum || 1;
    const houseData = context.houseDetails?.find((h: any) => h.houseNumber === houseNum);
    const sign = houseData?.signName || context.lagnaSign || 'Aries';
    const lord = houseData?.lord || 'Mars';
    const savPoints = houseData?.savPoints || context.savScores?.[houseNum] || 28;
    const occupants = (houseData?.occupants && houseData.occupants.length > 0) ? houseData.occupants.join(', ') : 'None';
    const lordPlacementObj = context.planetsDetail?.find((p: any) => (p.planet || '').toLowerCase() === lord.toLowerCase());
    const lordPlacement = lordPlacementObj?.house || 1;
    const activeDasha = `${context.activeMahadasha || 'Jupiter'}-${context.activeAntardasha || 'Saturn'}`;
    const antardashaEnd = context.antardashaEndDate || '2027-03-01';

    const getOrdinal = (n: number) => {
      if (n === 1) return '1st';
      if (n === 2) return '2nd';
      if (n === 3) return '3rd';
      return `${n}th`;
    };

    if (lang === 'hi') {
      return `### 🔮 ${resolved.topicTitleHi}

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *${resolved.verdictHi}*  
> **⏳ सक्रिय समय चक्र:** **${activeDasha} दशा काल (${antardashaEnd} तक)**

---

#### 🪐 मुख्य ग्रहीय आधार एवं भाव स्थिति
* **${houseNum}वां भाव (${sign} राशि / ${savPoints} सर्वाष्टकवर्ग बिंदु):** इस भाव के स्वामी **${lord}** आपकी कुण्डली के ${lordPlacement}वें भाव में स्थित हैं। ${occupants !== 'None' ? `इस भाव में **${occupants}** विराजमान हैं।` : 'भाव पर कोई प्रत्यक्ष क्रूर प्रभाव नहीं है।'} ${savPoints >= 28 ? '28 से अधिक बिंदु शुभ परिणाम व अनुकूलता की पुष्टि करते हैं।' : 'धैर्य, संयम एवं नियमित प्रयास से सफलता मिलेगी।'}
* **मुख्य कारक ग्रह (${resolved.karakaPlanet}):** इस विषय के स्वाभाविक कारक ग्रह के रूप में वर्तमान गोचर में सक्रिय हैं।
* **सक्रिय दशा प्रभाव (${activeDasha}):** यह दशा काल इस भाव से संबंधित विषयों को गति एवं स्पष्ट दिशा प्रदान कर रहा है।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** ${resolved.doHi}
* **❌ बचें:** ${resolved.avoidHi}

---

#### 🌿 सात्विक दैनिक उपाय
* **${resolved.practiceHi}**`;
    }

    if (lang === 'hinglish') {
      return `### 🔮 ${resolved.topicTitleHinglish}

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${resolved.verdictHinglish}*  
> **⏳ Active Time Horizon:** **${activeDasha} Dasha Period (through ${antardashaEnd})**

---

#### 🪐 Core Astrological Markers
* **${getOrdinal(houseNum)} House (${sign} / ${savPoints} SAV Bindus):** Is house ke lord **${lord}** chart ke ${getOrdinal(lordPlacement)} house me placed hain. ${occupants !== 'None' ? `House me **${occupants}** present hain.` : 'No direct malefic affliction.'} ${savPoints >= 28 ? 'Strong SAV score positive support confirm karta hai.' : 'Patience aur consistent effort zaroori hai.'}
* **Planetary Karaka (${resolved.karakaPlanet}):** Natural cosmic significator current transits ke under baseline support provide kar raha hai.
* **Active Dasha Catalyst (${activeDasha}):** Is lifecycle aspect ko directly activate kar raha hai.

---

#### 💡 Strategic Roadmap
* **✅ Do:** ${resolved.doHinglish}
* **❌ Avoid:** ${resolved.avoidHinglish}

---

#### 🌿 Daily Practice
* **${resolved.practiceHinglish}**`;
    }

    // Default English
    return `### 🔮 ${resolved.topicTitleEn}

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${resolved.verdictEn}*  
> **⏳ Prime Timeline / Horizon:** **${activeDasha} Active Cycle (through ${antardashaEnd})**

---

#### 🪐 Astrological Mechanics & Planetary Placement
* **${getOrdinal(houseNum)} House (${sign} / ${savPoints} SAV Bindus):** Governed by **${lord}** (positioned in the ${getOrdinal(lordPlacement)} House). ${occupants !== 'None' ? `Occupied by **${occupants}**.` : 'No direct malefic affliction.'} ${savPoints >= 28 ? 'Strong bindu count confirms positive karmic baseline and growth.' : 'Requires steady preparation, patience, and structured discipline.'}
* **Planetary Karaka (${resolved.karakaPlanet}):** Functions as the natural significator, steadying outcomes under current planetary transits.
* **Active Dasha Catalyst (${activeDasha}):** Energizes the ${getOrdinal(houseNum)} house axis, providing an active window for tangible progress.

---

#### 💡 Actionable Strategy & Guidance
* **✅ Do:** ${resolved.doEn}
* **❌ Avoid:** ${resolved.avoidEn}

---

#### 🌿 Sattvic Daily Practice
* **${resolved.practiceEn}**`;
  }

  // ==========================================
  // ENGLISH SUB-INTENT HANDLERS
  // ==========================================
  private generateEnglishRAGResponse(
    context: any,
    rating: any,
    sav: Record<number, number>,
    jaimini: any
  ): string {
    // Check for specific entity matches across any question (Mother, Father, Siblings, Child, Exams, Vehicle, Property, Court, Debt, Gemstone, etc.)
    const resolved = this.resolveQuestionAstrology(context.questionQuery, context);
    if (resolved.matched) {
      return this.buildDynamicAstrologicalResponse(context, rating, resolved, 'en');
    }

    const subIntent = context.detectedSubIntent || 'GENERAL';
    const darakaraka = jaimini.darakaraka || 'Venus';
    const amatyakaraka = jaimini.amatyakaraka || 'Mercury';
    const dkTraits = getDarakarakaTraits(darakaraka, 'en');
    const seventhHouse = context.houseDetails?.find((h: any) => h.houseNumber === 7);
    const seventhSign = seventhHouse?.signName || 'Sagittarius';
    const seventhTraits = getSeventhHouseTraits(seventhSign, 'en');
    const d9Lagna = context.divisionalHighlights?.d9Lagna || 'Libra';

    // 1. MARRIAGE & RELATIONSHIPS
    if (context.detectedTopic === 'MARRIAGE') {
      const sav7 = sav[7] || 27;
      const sav5 = sav[5] || 28;
      const sav9 = sav[9] || 30;

      if (subIntent === 'SPOUSE_TRAITS') {
        return `### 💍 Future Spouse Profile & Personality Analysis

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *High Mutual Resonance & Intellectual Harmony*  
> **⏳ Prime Timeline:** **${context.marriageTimingWindow || rating.coreTriggerWindow}**

---

#### 🪐 Core Astrological Markers
* **7th House of Union (${seventhSign} / ${sav7} SAV Bindus):** Indicates a partner who is **${seventhTraits}**.
* **Darakaraka (${darakaraka}):** The Jaimini soul indicator of spouse reveals a nature that is **${dkTraits}**.
* **D9 Navamsha Harmony (${d9Lagna} Lagna):** Confirms an emotionally fulfilling bond when mutual respect, clear communication, and personal autonomy are preserved.

---

#### 💼 Likely Profession & Background
* **Aligned Fields:** Technology, strategic consulting, higher education, finance, architecture/design, or management.
* **Core Disposition:** Values thoughtful conversation, practical loyalty, and emotional stability over drama.

---

#### 💡 What to Cultivate vs What to Avoid
* **✅ Do:** Appreciate their independent thinking and foster joint creative/intellectual pursuits.
* **❌ Avoid:** Over-analyzing minor trivialities or expecting an identical clone of your work style.

---

#### 🌿 Daily Practice
* **Relationship Harmony:** Practice daily mutual gratitude and keep the North-East & South-West zones of your home clean and peaceful.`;
      }

      if (subIntent === 'LOVE_VS_ARRANGED') {
        const isLoveDominant = sav5 >= 28 || darakaraka === 'Venus' || darakaraka === 'Mercury';
        return `### 💖 Marriage Type Dynamics: Love vs. Arranged Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${
          isLoveDominant ? 'Self-Chosen Connection with Strong Family Endorsement' : 'Arranged Introduction with High Intellectual Affinity'
        }*  
> **⏳ Auspicious Window:** **${context.marriageTimingWindow || rating.coreTriggerWindow}**

---

#### 🪐 Astrological Mechanics
* **5th House (Romantic Affinity - ${sav5} SAV Bindus):** Governs personal attraction, intellectual rapport, and conscious choice.
* **7th House & Darakaraka (${darakaraka}):** Favors connections built on shared vision, professional respect, and genuine friendship before formal commitment.
* **9th House (Family Consensus - ${sav9} SAV Bindus):** Confirms that personal alignment will receive family blessings when communicated with maturity.

---

#### 💡 Meeting Setting
* **How it unfolds:** Most likely to connect through professional circles, higher education networks, shared intellectual interests, or trusted mutual introductions.

---

#### 🌿 Daily Practice
* **Harmonious Dialogue:** Maintain open, calm conversations with elders regarding your partnership aspirations.`;
      }

      if (subIntent === 'OBSTACLES_MANGLIK') {
        return `### 🛡️ Marriage Timing Obstacles & Manglik Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Planetary Certainty** — *Structural Maturation Phase (No Superstition)*  
> **⏳ Resolution Horizon:** **${rating.coreTriggerWindow}**

---

#### 🪐 Astrological Reality Check
* **Maturation over Delay:** In modern Vedic astrology, planetary delays from Saturn or Mars are not curses—they ensure emotional maturity and financial independence before marriage.
* **Mars / Manglik Reality:** Dynamic Mars energy provides drive; when directed into career building and fitness, it completely neutralizes relational friction.
* **7th House Transit Axis:** Supportive dual Jupiter-Saturn transit alignment clears lingering obstacles during the active sub-period.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Focus on personal emotional regulation, career stability, and transparent communication.
* **❌ Avoid:** Falling for fear-based superstitions, costly rituals, or rushing into alliances under social pressure.

---

#### 🌿 Sattvic Daily Practice
* **Grounding Energy:** 10 minutes of morning Surya Namaskar and maintaining patient, non-reactive communication.`;
      }

      if (subIntent === 'MARRIED_LIFE_QUALITY') {
        return `### 🕊️ Post-Marital Harmony & Long-Term Compatibility

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Stable, Growth-Oriented Partnership*  
> **⏳ Core Horizon:** **Lifelong Stability under D9 Navamsha Harmony**

---

#### 🪐 Key Astrological Drivers
* **D9 Navamsha (${d9Lagna} Lagna):** Indicates a marriage characterized by mutual intellectual elevation and mutual respect.
* **7th House (${sav7} SAV Bindus):** Strong energetic foundation providing resilience through changing career seasons.
* **Darakaraka (${darakaraka}) Synergy:** Fosters a partner who acts as a trusted confidant and reliable sounding board.

---

#### 💡 Pillars of Lasting Bond
* **✅ Do:** Maintain open emotional communication, celebrate individual milestones, and preserve personal autonomy.
* **❌ Avoid:** Letting workplace stress spill into personal conversations.

---

#### 🌿 Daily Practice
* **Evening Harmony:** Spend 15 minutes of device-free quiet time together daily.`;
      }

      // Default: MARRIAGE_TIMING
      return `### ❤️ Marriage & Relationship Timing Blueprint

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Matrimonial & Partnership Alignment*  
> **⏳ Prime Window:** **${context.marriageTimingWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **7th House (${sav7} SAV Bindus) & Darakaraka (${darakaraka}):** Indicates an intelligent, grounded, and supportive life partner.
* **Active Dasha Catalyst (${context.activeMahadasha}-${context.activeAntardasha}):** Energizes the 7th house axis and matrimonial alliances.
* **D9 Navamsha Harmony:** Fosters long-term marital stability when mutual space and professional respect are maintained.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Foster open, transparent dialogue; appreciate emotional stability and practical loyalty.
* **❌ Avoid:** Over-analyzing minor disagreements or expecting identical personality traits.

---

#### 🌿 Daily Practice
* **Relational Space:** Cultivate joint gratitude and encourage individual creative pursuits.`;
    }

    // 2. CAREER & BUSINESS
    if (context.detectedTopic === 'CAREER') {
      const sav10 = sav[10] || 34;
      const sav6 = sav[6] || 31;
      const sav3 = sav[3] || 27;

      if (subIntent === 'JOB_VS_BUSINESS') {
        const isBusinessFavored = sav10 >= 30 || sav3 >= 28;
        return `### 💼 Career Direction: Job vs. Business & Entrepreneurship

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${
          isBusinessFavored ? 'High Propensity for Autonomous Business / Strategic Consulting' : 'Executive Leadership & Specialized Corporate Roles'
        }*  
> **⏳ Peak Window:** **${context.careerLeapWindow || rating.coreTriggerWindow}**

---

#### 🪐 Astrological Mechanics
* **10th House (${sav10} SAV Bindus):** Strong authority configuration favoring strategic independence and scalable ventures over micromanaged roles.
* **Amatyakaraka (${amatyakaraka}):** Supports technology products, domain advisory, and specialized intellectual ventures.
* **6th House (Employment - ${sav6} bindus) vs 3rd House (Enterprise - ${sav3} bindus):** Confirms that starting with specialized expertise before launching an independent firm yields highest return.

---

#### 💡 Strategic Roadmap
* **✅ Do:** Build deep technical or domain mastery, establish a strong industry network, and transition into sovereign ownership.
* **❌ Avoid:** Remaining indefinitely in low-autonomy positions where your strategic judgment cannot be exercised.

---

#### 🌿 Daily Practice
* **Deep Work Focus:** Dedicate 90 minutes of uninterrupted morning focus to your core proprietary skillset.`;
      }

      if (subIntent === 'INDUSTRY_SELECTION') {
        return `### 🎯 Ideal Industry & Professional Domain Alignment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *High-Leverage Strategic & Technology Domains*  
> **⏳ Prime Horizon:** **${context.careerLeapWindow || rating.coreTriggerWindow}**

---

#### 🪐 Core Astrological Markers
* **Amatyakaraka (${amatyakaraka}):** Indicates natural affinity for architecture, software, analytics, strategy, research, or executive consulting.
* **10th House (${sav10} SAV Bindus):** Elevates roles that command respect, domain governance, and innovative product creation.
* **D10 Dashamsha Support (${context.divisionalHighlights?.d10Lagna || 'Pisces'} Lagna):** Confirms long-term institutional authority and industry reputation.

---

#### 💡 Recommended Industry Sectors
1. **Technology, AI & Systems Engineering:** Architecting scalable digital or physical systems.
2. **Strategic Advisory, Analytics & Finance:** Solving complex organizational or data problems.
3. **Product Innovation & Specialized Enterprise:** Leading autonomous ventures and specialized services.

---

#### 🌿 Daily Practice
* **Domain Mastery:** Stay updated with cutting-edge industry advancements and publish your insights regularly.`;
      }

      if (subIntent === 'PROMOTION_TIMING') {
        return `### 📈 Promotion, Appraisal & Job Switch Timing

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Imminent Career Elevation Trigger*  
> **⏳ Optimal Window:** **${context.careerLeapWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **Active Sub-Period (${context.activeMahadasha}-${context.activeAntardasha}):** Activates 10th and 11th houses of karmic reward and salary expansion.
* **Transit Support:** Auspicious transit over natal career axis enhances bargaining power and visibility.

---

#### 💡 Actionable Advice
* **✅ Do:** Document your measurable achievements and initiate strategic compensation or switch conversations during this window.
* **❌ Avoid:** Making abrupt moves without a formal written offer in hand.

---

#### 🌿 Daily Practice
* **Morning Surya Arghya:** Offer water to the rising Sun daily for professional authority and leadership recognition.`;
      }

      // Default CAREER
      return `### 💼 Career & Professional Trajectory

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${rating.verdictLabel}*  
> **⏳ Peak Elevation Window:** **${context.careerLeapWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **10th House (${sav10} SAV Bindus):** High authority configuration favoring strategic independence, leadership, or specialized business ventures over micromanaged roles.
* **Amatyakaraka (${amatyakaraka}):** Connects career growth to technology architecture, strategic consulting, and domain expertise.
* **D10 Dashamsha Support:** Confirms long-term institutional authority and industry reputation.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Build domain authority in rare, high-leverage skills; position yourself as an indispensable architect of results.
* **❌ Avoid:** Staying in bureaucratic, low-autonomy roles where creative execution is capped.

---

#### 🌿 Daily Practice
* **Daily Focus & Solar Alignment:** Maintain structured deep-work blocks and morning Surya Arghya for supreme clarity.`;
    }

    // 3. FOREIGN TRAVEL & ABROAD
    if (context.detectedTopic === 'ABROAD') {
      const sav12 = sav[12] || 30;
      const sav9 = sav[9] || 30;

      if (subIntent === 'PR_SETTLEMENT') {
        return `### 🌐 Permanent Residency & Foreign Settlement Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Favorable Long-Term Overseas Residence*  
> **⏳ Best Window:** **${context.relocationWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **Dual Lagna (${context.lagnaSign}):** Innate adaptability to international cultures and foreign lifestyle standards.
* **12th House (${sav12} SAV Bindus):** Exceeds baseline (28 points), confirming sustainable foreign income and long-term asset building abroad.
* **9th House Axis (${sav9} Bindus):** Strong legal and institutional support for permanent immigration visas.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Keep all international credentials, point calculations, and legal paperwork strictly organized.
* **❌ Avoid:** Relying on unverified third-party migration agents without direct legal scrutiny.

---

#### 🌿 Daily Practice
* **Morning Surya Arghya:** Offer water to the Sun daily for swift administrative processing and positive documentation outcomes.`;
      }

      if (subIntent === 'DIRECTIONS_COUNTRIES') {
        return `### 🧭 Favorable Global Directions & Countries

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *High Global Directional Resonance*  
> **⏳ Prime Timeline:** **${context.relocationWindow || rating.coreTriggerWindow}**

---

#### 🪐 Astrological Geographic Matrix
* **Favorable Directions:** **North-West & West** (governed by favorable transit and air/dual signs).
* **Aligned Regions:** North America (USA, Canada), Western Europe (UK, Germany, Netherlands), UAE/Middle East, or Australia/NZ.
* **Urban Character:** Cosmopolitan technology hubs, research universities, and progressive metropolitan centers.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Target multinational teams and global remote or on-site opportunities in these geographic zones.
* **❌ Avoid:** Relocating to isolated regions with limited professional mobility.`;
      }

      // Default ABROAD
      return `### ✈️ Foreign Travel & Relocation Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${rating.verdictLabel}*  
> **⏳ Best Window:** **${context.relocationWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **Dual Lagna (${context.lagnaSign}):** Natural adaptability, global curiosity, and high cross-cultural resonance.
* **12th House Foreign Axis (${sav12} SAV Bindus):** Exceeds the 28-point threshold, confirming favorable overseas residence and wealth sustenance.
* **${context.activeMahadasha}-${context.activeAntardasha} Dasha:** Actively energizes cross-border consulting, international assignments, and visa approvals.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Target multinational teams, cross-border remote contracts, and keep international documentation ready.
* **❌ Avoid:** Making abrupt relocations without verified legal permissions or signed contracts.

---

#### 🌿 Daily Practice
* **Morning Surya Arghya:** Offer water in a copper vessel to the rising Sun for administrative clarity and smooth journeys.`;
    }

    // 4. WEALTH & FINANCE
    if (context.detectedTopic === 'WEALTH') {
      const sav11 = sav[11] || 35;
      const sav12 = sav[12] || 30;
      const sav2 = sav[2] || 32;

      if (subIntent === 'INVESTMENT_CLASS') {
        return `### 📊 Asset Allocation & Investment Strategy Roadmap

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Productive Long-Term Capital Compounding*  
> **⏳ Prime Phase:** **${rating.coreTriggerWindow}**

---

#### 🪐 Astrological Wealth Matrix
* **11th House Surplus (${sav11} SAV Bindus):** Favors systematic equity investing, technology stocks, and index funds over speculative day trading.
* **2nd House Accumulated Capital (${sav2} Bindus):** Strong retention power through physical assets, gold, and debt-free real estate.
* **Gains vs Expense Ratio (11H: ${sav11} vs 12H: ${sav12}):** Healthy net balance confirms capital growth when disciplined dollar-cost averaging is followed.

---

#### 💡 Asset Strategy
* **✅ Do:** Maintain a 60/30/10 asset mix: 60% broad equity index funds, 30% fixed assets/gold/real estate, 10% cash liquidity.
* **❌ Avoid:** High-leverage futures, intraday speculation, or unverified crypto schemes.

---

#### 🌿 Daily Practice
* **Kubera-Lakshmi Cleanliness:** Keep the North zone of your workplace uncluttered and donate a small percentage of profits.`;
      }

      // Default WEALTH
      return `### 💰 Wealth & Financial Growth Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Net Capital Accumulation Surplus*  
> **⏳ Prime Growth Phase:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **Gains vs Expense Ratio (11H: ${sav11} vs 12H: ${sav12} Bindus):** Favorable surplus ratio ensuring long-term net capital retention.
* **Wealth Architecture:** Long-term wealth compounds through intellectual property, equity, and asset allocation rather than short-term lotteries.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Automate systematic investing in verified, productive assets; maintain a 6-month liquid buffer.
* **❌ Avoid:** Speculative high-risk trading, FOMO investments, or leveraged debt.

---

#### 🌿 Daily Practice
* **Lakshmi-Kubera Cleanliness:** Keep the North/North-East zone of your workspace clean and donate a small portion of profits on Thursdays.`;
    }

    // 5. STRUGGLE & FAILURE DIAGNOSIS
    if (context.detectedTopic === 'STRUGGLE') {
      return `### 🌊 Life Phase & Obstacle Diagnosis

> **🎯 Verdict:** **${rating.probabilityPercentage}% Planetary Certainty** — *Temporary Consolidation Cycle*  
> **⏳ Relief Horizon:** **Turning point around ${context.struggleReliefDate}**

---

#### 🪐 Root Cause Mechanics
* **${context.activeMahadasha}-${context.activeAntardasha} Pressure Test:** A developmental consolidation phase designed to dismantle fragile shortcuts and build long-term systems.
* **Karmic Alignment:** Setbacks in this cycle are structural redirections toward higher-leverage opportunities, not permanent failure.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Focus on craft mastery, process discipline, sleep architecture, and consistent daily execution.
* **❌ Avoid:** High-risk financial gambles, unverified shortcuts, or taking cyclical friction personally.

---

#### 🌿 Daily Practice
* **Grounding & Patience:** Practice 10 minutes of evening Pranayama and maintain strict morning discipline.`;
    }

    // 6. HEALTH, STOMACH & VITALITY
    if (context.detectedTopic === 'HEALTH' || context.detectedTopic === 'AYUR_JYOTISH') {
      const sav6 = sav[6] || 31;
      const dosha = context.doshaProfile || {
        primaryDosha: 'Vata-Pitta',
        dominantElements: 'Air & Fire',
        digestiveFire: 'Tikshnagni (Variable / Sharp Fire)',
        doshaBreakdown: { vataPercentage: 45, pittaPercentage: 35, kaphaPercentage: 20 },
      };

      if (subIntent === 'DOSHA_CONSTITUTION' || context.detectedTopic === 'AYUR_JYOTISH') {
        return `### 🌿 Ayur-Jyotish & Circadian Bio-Rhythm Blueprint

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${dosha.primaryDosha} Constitution (${dosha.dominantElements})*  
> **⏳ Digestive Fire:** **${dosha.digestiveFire}**

---

#### 🪐 Tri-Dosha Planetary Breakdown
* **Vata (Air - ${dosha.doshaBreakdown?.vataPercentage || 45}%):** Governs nervous system, mental agility, and mobility (influenced by Lagna: ${context.lagnaSign}).
* **Pitta (Fire - ${dosha.doshaBreakdown?.pittaPercentage || 35}%):** Governs metabolic heat, enzyme secretion, and sharp intellect (influenced by Sun: ${context.sunSign}).
* **Kapha (Earth/Water - ${dosha.doshaBreakdown?.kaphaPercentage || 20}%):** Governs physical lubrication, cellular immunity, and stamina.
* **Peak Circadian Windows:** Deep Cognitive Work (06:00–10:00 & 14:00–18:00) | Main Lunch (12:00–13:30 when Solar Pitta is highest).

---

#### 💡 Lifestyle & Nutrition Guidelines
* **✅ Do:** Consume warm, freshly prepared meals with grounding spices (cumin, fennel, ginger, ghee); adhere to a fixed sleep routine.
* **❌ Avoid:** Skipping lunch, cold iced beverages, and dry raw food during high-stress periods.

---

#### 🌿 Daily Herbal Support
* **CCF Tea & Golden Milk:** Sip warm cumin-coriander-fennel tea post-meals and warm turmeric milk before sleep.`;
      }

      if (subIntent === 'DIGESTION_GUT') {
        return `### 🌿 Digestive Fire (Jatharagni) & Gut Vitality Diagnosis

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Brain-Gut & Metabolic Sensitivity*  
> **⏳ Recovery Window:** **3–4 Weeks with Circadian Discipline**

---

#### 🪐 Key Astrological Drivers
* **Sun in Virgo (Digestive Axis):** Virgo anatomically governs the intestines and gut microbiome, creating sensitivity in digestive fire (*Jatharagni*).
* **Gemini-Virgo Brain-Gut Axis:** Mental overthinking and irregular work stress directly impact stomach motility and acidity.
* **6th House Resilience (${sav6} SAV Bindus):** Confirms strong innate vitality with quick recovery through regular dietary rhythm.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Drink warm water or mild cumin-coriander-fennel (CCF) tea post-meals; keep fixed meal times daily.
* **❌ Avoid:** Cold drinks, late-night heavy meals, and eating in a rushed or anxious mental state.

---

#### 🌿 Daily Practice
* **Morning Sunlight & Diaphragmatic Breathwork:** 10 minutes of gentle belly breathing before meals shifts the nervous system into the rest-and-digest state.`;
      }

      // Default HEALTH
      return `### 🌿 Health & Vitality Blueprint

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Resilient Constitution with Circadian Rhythm Focus*  
> **⏳ Ongoing Window:** **Seasonal Balance & Daily Dinacharya**

---

#### 🪐 Key Astrological Drivers
* **Lagna & Sun Axis:** Governs physical constitution and cellular vitality (*Ojas*).
* **6th House of Immunity (${sav6} SAV Bindus):** Strong recovery baseline over temporary seasonal ailments.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Maintain fixed meal and sleep times, practice daily diaphragmatic breathwork, and stay well hydrated.
* **❌ Avoid:** Irregular sleep schedules, late-night snacking, and chronic digital overstimulation before bed.

---

#### 🌿 Daily Practice
* **Restorative Breathwork:** 10 minutes of evening Anulom-Vilom to restore autonomic nervous system balance.`;
    }

    // 7. PROPERTY
    if (context.detectedTopic === 'PROPERTY') {
      const sav4 = sav[4] || 29;
      return `### 🏡 Property & Real Estate Roadmap

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Supportive Fixed-Asset Acquisition*  
> **⏳ Prime Window:** **${context.propertyPurchaseWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **4th House Sanctuary (${sav4} SAV Bindus):** Strong foundation for residential peace, land ownership, and comfortable living space.
* **Favored Property:** Constructed apartments or ready homes with good natural light and ventilation align best.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Conduct thorough legal title verification and keep mortgage EMI within 30% of predictable cashflow.
* **❌ Avoid:** Rushing into unapproved or disputed real estate projects without complete documentation.

---

#### 🌿 Daily Practice
* **Domestic Sanctuary:** Keep the North-East zone of your home uncluttered for peace and clarity.`;
    }

    // 8. EDUCATION
    if (context.detectedTopic === 'EDUCATION') {
      const sav5 = sav[5] || 29;
      return `### 🎓 Education & Exam Performance Roadmap

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *High Cognitive Absorption*  
> **⏳ Prime Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **5th House Intellect (${sav5} SAV Bindus):** Sharp analytical synthesis, conceptual retention, and strategic problem-solving.
* **Disciplines Favored:** Technology, engineering, management, analytics, and specialized professional certifications.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Study in focused 90-minute distraction-free blocks with conceptual test simulations.
* **❌ Avoid:** Passive rote memorization or multitasking while studying.

---

#### 🌿 Daily Practice
* **Clarity Ritual:** 5 minutes of mindful breathwork before study sessions to sharpen memory retention.`;
    }

    // 9. DHARMA
    if (context.detectedTopic === 'DHARMA') {
      return `### 🧭 Life Mission & Soul Dharma

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${context.primaryArchetype}*  
> **⏳ Life Horizon:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **Core Calling:** ${context.coreLifeAim}
* **Innate Superpower:** Strategic foresight, intellectual autonomy, and building enduring, scalable systems.
* **Active Dasha Alignment:** Moving from individual technical mastery into domain leadership.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Align daily efforts with long-term sovereign legacy and high-integrity craftsmanship.
* **❌ Avoid:** Trading your long-term potential for short-term comfort in micromanaged environments.

---

#### 🌿 Daily Practice
* **Daily Alignment:** Review your core life priorities every morning before opening digital devices.`;
    }

    // 10. DECISION SIMULATION
    if (context.detectedTopic === 'DECISION_SIMULATION') {
      const sav10 = sav[10] || 34;
      return `### ⚖️ Strategic "What-If" Decision Simulation

> **🎯 Verdict:** **${rating.probabilityPercentage}% Clarity Score** — *${rating.verdictLabel}*  
> **⏳ Execution Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Comparative Planetary Matrix
* **Option A (Autonomous / High-Growth Path):** Aligns with 10th House (${sav10} SAV bindus) and Amatyakaraka (${amatyakaraka}), offering maximum upside and long-term equity.
* **Option B (Safe / Fixed-Routine Path):** Offers short-term stability but caps your entrepreneurial potential under the ${context.activeMahadasha}-${context.activeAntardasha} dasha cycle.
* **Ashtakavarga Differential:** Strategic ventures and domain autonomy score **+18% higher planetary leverage** than conventional salaried stagnation.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Choose the path that maximizes sovereign ownership, scalability, and rare skill compounding.
* **❌ Avoid:** Making decisions out of fear of temporary friction or choosing short-term comfort over sovereign mastery.

---

#### 🌿 Daily Practice
* **Decision Clarity Meditation:** Spend 10 minutes in silent morning reflection to ground your intuition before signing agreements.`;
    }

    // 11. GENERAL SUMMARY
    return this.buildDynamicAstrologicalResponse(context, rating, resolved, 'en');
  }

  // ==========================================
  // HINDI SUB-INTENT HANDLERS
  // ==========================================
  private generateHindiRAGResponse(
    context: any,
    rating: any,
    sav: Record<number, number>,
    jaimini: any
  ): string {
    // Check for specific entity matches across any question in Hindi
    const resolved = this.resolveQuestionAstrology(context.questionQuery, context);
    if (resolved.matched) {
      return this.buildDynamicAstrologicalResponse(context, rating, resolved, 'hi');
    }

    const subIntent = context.detectedSubIntent || 'GENERAL';
    const darakaraka = jaimini.darakaraka || 'Venus';
    const amatyakaraka = jaimini.amatyakaraka || 'Mercury';
    const dkTraits = getDarakarakaTraits(darakaraka, 'hi');
    const seventhHouse = context.houseDetails?.find((h: any) => h.houseNumber === 7);
    const seventhSign = seventhHouse?.signName || 'Sagittarius';
    const seventhTraits = getSeventhHouseTraits(seventhSign, 'hi');
    const d9Lagna = context.divisionalHighlights?.d9Lagna || 'Libra';

    // 1. MARRIAGE & RELATIONSHIPS
    if (context.detectedTopic === 'MARRIAGE') {
      const sav7 = sav[7] || 27;
      const sav5 = sav[5] || 28;
      const sav9 = sav[9] || 30;

      if (subIntent === 'SPOUSE_TRAITS') {
        return `### 💍 जीवनसाथी का स्वभाव, व्यक्तित्व एवं विशेषताएं

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *उत्तम वैचारिक सामंजस्य एवं परस्पर आदर*  
> **⏳ संभावित समय:** **${context.marriageTimingWindow || rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय आधार
* **सप्तम भाव (${seventhSign} / ${sav7} सर्वाष्टकवर्ग बिंदु):** आपके जीवनसाथी का स्वरूप **${seventhTraits}** होगा।
* **दाराकारक ग्रह (${darakaraka}):** जैमिनी ज्योतिष के अनुसार जीवनसाथी का मूल स्वभाव **${dkTraits}** होगा।
* **नवमांश (D9) संरेखण (${d9Lagna} लग्न):** वैचारिक स्वतंत्रता और परस्पर सम्मान से वैवाहिक जीवन अत्यंत स्थिर, समृद्ध व सुखद रहेगा।

---

#### 💼 संभावित कार्यक्षेत्र एवं पृष्ठभूमि
* **अनुकूल क्षेत्र:** तकनीकी, परामर्श, उच्च शिक्षा/प्रबंधन, वित्तीय क्षेत्र, रचनात्मक डिजाइन अथवा प्रशासनिक कार्य।
* **व्यक्तित्व:** व्यर्थ के विवादों से दूर, गंभीर संवाद, निष्ठा एवं व्यावहारिक संतुलन को प्राथमिकता देने वाले।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** जीवनसाथी की स्वतंत्र सोच का सम्मान करें और मिलकर बौद्धिक व रचनात्मक कार्यों को बढ़ावा दें।
* **❌ बचें:** छोटी-छोटी बातों का अधिक विश्लेषण करने या साथी से अपने जैसे स्वभाव की जिद करने से बचें।

---

#### 🌿 दैनिक उपाय
* **गृह सौहार्द:** प्रतिदिन परस्पर कृतज्ञता का भाव रखें और घर के ईशान कोण (North-East) को स्वच्छ रखें।`;
      }

      if (subIntent === 'LOVE_VS_ARRANGED') {
        const isLoveDominant = sav5 >= 28 || darakaraka === 'Venus' || darakaraka === 'Mercury';
        return `### 💖 विवाह का स्वरूप: प्रेम विवाह बनाम पारिवारिक संरेखण

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *${
          isLoveDominant ? 'स्व-पसंद आधारित संबंध जिसमें परिवार का पूर्ण आशीर्वाद मिलेगा' : 'पारिवारिक परिचय के साथ उच्च बौद्धिक व भावनात्मक जुड़ाव'
        }*  
> **⏳ शुभ समय:** **${context.marriageTimingWindow || rating.coreTriggerWindow}**

---

#### 🪐 ज्योतिषीय विश्लेषण
* **पंचम भाव (प्रेम व पूर्व पुण्य - ${sav5} बिंदु):** व्यक्तिगत पसंद, वैचारिक आकर्षण और आपसी समझ को मजबूती प्रदान करता है।
* **सप्तम भाव व दाराकारक (${darakaraka}):** ऐसे संबंध को दर्शाता है जो साझा लक्ष्यों, सम्मान और सच्ची मित्रता पर आधारित हो।
* **नवम भाव (पारिवारिक सहमति - ${sav9} बिंदु):** पुष्टि करता है कि धैर्य और स्पष्ट संवाद से परिवार का पूर्ण सहयोग प्राप्त होगा।

---

#### 💡 परिचय का माध्यम
* **संभावित परिदृश्य:** कार्यक्षेत्र, उच्च शिक्षा, साझा बौद्धिक रुचियों अथवा विश्वसनीय मित्रों के माध्यम से परिचय होना सर्वाधिक संभावित है।

---

#### 🌿 दैनिक उपाय
* **पारिवारिक संवाद:** विवाह संबंधी विचारों को परिवार के साथ शांत व स्पष्ट रूप से साझा करें।`;
      }

      if (subIntent === 'OBSTACLES_MANGLIK') {
        return `### 🛡️ विवाह में बाधा, मांगलिक प्रभाव एवं समाधान

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% ज्योतिषीय निश्चितता** — *परिपक्वता निर्माण काल (अंधविश्वास मुक्त)*  
> **⏳ समाधान काल:** **${rating.coreTriggerWindow}**

---

#### 🪐 ज्योतिषीय यथार्थ
* **देरी का वास्तविक कारण:** वैदिक ज्योतिष में शनि या मंगल का प्रभाव शाप नहीं है—यह भावनात्मक परिपक्वता और आर्थिक स्थिरता सुनिश्चित करने के लिए होता है।
* **मांगलिक / मंगल ऊर्जा:** मंगल की ऊर्जा साहस और कर्मठता देती है; इसे करियर और स्वास्थ्य में लगाने से वैवाहिक तनाव स्वतः समाप्त हो जाता है।
* **सप्तम भाव गोचर:** गुरु व शनि का संयुक्त गोचर वर्तमान दशा चक्र में सभी रुकावटों को दूर करता है।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** अपने करियर, भावनात्मक संतुलन और स्पष्ट संवाद पर ध्यान दें।
* **❌ बचें:** भय फैलाने वाले अंधविश्वासों, महंगे अनुष्ठानों या सामाजिक दबाव में जल्दबाजी में निर्णय लेने से बचें।

---

#### 🌿 सात्विक दैनिक उपाय
* **प्रातः सूर्य नमस्कार:** प्रतिदिन 10 मिनट सूर्य नमस्कार करें और बातचीत में धैर्य बनाए रखें।`;
      }

      if (subIntent === 'MARRIED_LIFE_QUALITY') {
        return `### 🕊️ दांपत्य जीवन का सुख एवं परस्पर सामंजस्य

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *स्थिर, विकासोन्मुख एवं सुखद दांपत्य*  
> **⏳ जीवन दिशा:** **नवमांश (D9) सद्भाव के अंतर्गत दीर्घकालिक स्थिरता**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **नवमांश चक्र (${d9Lagna} लग्न):** बौद्धिक उन्नति और परस्पर आदर से युक्त वैवाहिक जीवन।
* **सप्तम भाव (${sav7} बिंदु):** जीवन के उतार-चढ़ाव में संबल प्रदान करने वाली मजबूत ग्रहीय नींव।
* **दाराकारक (${darakaraka}):** जीवनसाथी एक सच्चे मित्र व विश्वस्त सलाहकार की भूमिका निभाएंगे।

---

#### 💡 सुखद दांपत्य के सूत्र
* **✅ करें:** स्पष्ट संवाद रखें, एक-दूसरे की उपलब्धियों का सम्मान करें और व्यक्तिगत स्वतंत्रता का आदर करें।
* **❌ बचें:** कार्यक्षेत्र के तनाव को व्यक्तिगत संबंधों पर हावी न होने दें।

---

#### 🌿 दैनिक उपाय
* **सांध्य संवाद:** प्रतिदिन 15 मिनट बिना किसी डिजिटल स्क्रीन के शांति से साथ बिताएं।`;
      }

      // Default MARRIAGE
      return `### ❤️ विवाह एवं दांपत्य जीवन मार्गदर्शन

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *सुयोग्य जीवनसाथी व वैवाहिक सामंजस्य*  
> **⏳ शुभ समय:** **${context.marriageTimingWindow || rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **सप्तम भाव (${sav7} बिंदु) एवं दाराकारक (${darakaraka}):** बुद्धिमान, व्यावहारिक और सहयोगी जीवनसाथी का संकेत देते हैं।
* **सक्रिय दशा (${context.activeMahadasha}-${context.activeAntardasha}):** विवाह योग और योग्य प्रस्तावों को सक्रिय कर रही है।
* **नवमांश (D9) संरेखण:** वैचारिक स्वतंत्रता और परस्पर सम्मान से वैवाहिक जीवन स्थिर व सुखद रहेगा।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** स्पष्ट संवाद रखें और साथी की व्यवहार कुशलता व निष्ठा का सम्मान करें।
* **❌ बचें:** छोटी-छोटी बातों का अधिक विश्लेषण करने या अनावश्यक अपेक्षाएं रखने से बचें।

---

#### 🌿 दैनिक उपाय
* **आपसी सौहार्द:** प्रतिदिन कृतज्ञता का भाव रखें और एक-दूसरे के कार्यों में सहयोग दें।`;
    }

    // 2. CAREER & BUSINESS
    if (context.detectedTopic === 'CAREER') {
      const sav10 = sav[10] || 34;
      const sav6 = sav[6] || 31;
      const sav3 = sav[3] || 27;

      if (subIntent === 'JOB_VS_BUSINESS') {
        const isBusinessFavored = sav10 >= 30 || sav3 >= 28;
        return `### 💼 करियर दिशा: नौकरी बनाम व्यवसाय व उद्यम

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *${
          isBusinessFavored ? 'स्वतंत्र व्यवसाय, परामर्श एवं रणनीतिक उद्यम में सर्वाधिक सफलता' : 'उच्च स्तरीय कार्यकारी नेतृत्व एवं विशेषज्ञता आधारित भूमिका'
        }*  
> **⏳ प्रगति काल:** **${context.careerLeapWindow || rating.coreTriggerWindow}**

---

#### 🪐 ग्रहीय विश्लेषण
* **दशम भाव (${sav10} बिंदु):** रणनीतिक स्वायत्तता और नेतृत्वकारी भूमिकाओं में बड़ी सफलता का संकेत देता है।
* **अमात्यकारक (${amatyakaraka}):** तकनीकी उत्पादों, डोमेन एडवाइजरी और बौद्धिक उद्यम में उच्च लाभ दर्शाता है।
* **छठा भाव (${sav6} बिंदु) vs तीसरा भाव (${sav3} बिंदु):** पहले विशेषज्ञता हासिल कर बाद में स्वतंत्र व्यवसाय में कदम रखना सर्वोत्तम रहेगा।

---

#### 💡 रणनीतिक मार्गदर्शन
* **✅ करें:** उच्च-मूल्य वाले दुर्लभ कौशलों में अपनी पकड़ बनाएं और स्वतंत्र अधिकार वाले क्षेत्रों में आगे बढ़ें।
* **❌ बचें:** ऐसी सीमित भूमिकाओं में लंबे समय तक रहने से बचें जहां आपकी रणनीतिक क्षमता का उपयोग न हो।

---

#### 🌿 दैनिक उपाय
* **एकाग्र कार्य:** प्रातः काल के 90 मिनट अपने मुख्य कौशल व महत्वपूर्ण कार्य को समर्पित करें।`;
      }

      if (subIntent === 'INDUSTRY_SELECTION') {
        return `### 🎯 आपके लिए सबसे उपयुक्त उद्योग एवं कार्यक्षेत्र

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *उच्च मूल्य वाले तकनीकी व रणनीतिक क्षेत्र*  
> **⏳ मुख्य समय:** **${context.careerLeapWindow || rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारक
* **अमात्यकारक (${amatyakaraka}):** सॉफ्टवेयर आर्किटेक्चर, डेटा, रणनीतिक परामर्श, शोध अथवा प्रबंधन में स्वाभाविक योग्यता।
* **दशम भाव (${sav10} बिंदु):** प्रतिष्ठा, नवाचार और व्यवस्था निर्माण से जुड़े कार्यों में विशेष यश।

---

#### 💡 शीर्ष 3 उपयुक्त कार्यक्षेत्र
1. **प्रौद्योगिकी, एआई एवं सिस्टम्स इंजीनियरिंग:** बड़े पैमाने पर तकनीकी प्रणालियों का निर्माण।
2. **रणनीतिक परामर्श एवं विश्लेषिकी:** जटिल संगठनात्मक व डेटा समस्याओं का समाधान।
3. **स्वायत्त उद्यम एवं उत्पाद निर्माण:** स्वतंत्र व्यापारिक व परामर्श सेवाएं।

---

#### 🌿 दैनिक उपाय
* **ज्ञान संवर्धन:** अपने क्षेत्र के नवीनतम तकनीकी विकास से निरंतर जुड़े रहें।`;
      }

      // Default CAREER
      return `### 💼 करियर एवं व्यवसायिक मार्गदर्शन

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *नेतृत्व एवं स्वतंत्र कार्यक्षेत्र में उन्नति*  
> **⏳ प्रगति का समय:** **${context.careerLeapWindow || rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **दशम भाव (${sav10} बिंदु):** उच्च अधिकार योग जो रणनीतिक स्वतंत्रता और विशेषज्ञता आधारित कार्यों में विशेष सफलता दिलाता है।
* **अमात्यकारक (${amatyakaraka}):** तकनीकी दक्षता, परामर्श और रणनीतिक निर्णयों से करियर में बड़ा उछाल दर्शाता है।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** उच्च-मूल्य वाले कौशलों में अपनी विशेषज्ञता बढ़ाएं और स्वायत्त भूमिकाओं को प्राथमिकता दें।
* **❌ बचें:** ऐसे सीमित वातावरण में रुकने से बचें जहां आपके नवाचार पर पाबंदी हो।

---

#### 🌿 दैनिक उपाय
* **सूर्य नमस्कार व अनुशासन:** प्रतिदिन एकाग्रता के साथ महत्वपूर्ण कार्यों को प्राथमिकता दें।`;
    }

    // 3. ABROAD
    if (context.detectedTopic === 'ABROAD') {
      const sav12 = sav[12] || 30;
      return `### ✈️ विदेश यात्रा एवं निवास विश्लेषण

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *विदेश गमन एवं निवास के प्रबल योग*  
> **⏳ शुभ समय:** **${context.relocationWindow || rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **द्विस्वभाव लग्न (${context.lagnaSign}):** नई संस्कृति और वैश्विक परिवेश में सहज समायोजन की स्वाभाविक क्षमता।
* **द्वादश भाव (${sav12} सर्वाष्टकवर्ग बिंदु):** 28 से अधिक बिंदु विदेश में दीर्घकालिक स्थायित्व और धन संचय सुनिश्चित करते हैं।
* **${context.activeMahadasha}-${context.activeAntardasha} महादशा:** अंतरराष्ट्रीय प्रोजेक्ट्स, वीजा स्वीकृति और यात्रा को सक्रिय कर रही है।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** बहुराष्ट्रीय कंपनियों या विदेशी अवसरों हेतु अपने दस्तावेज और संपर्क तैयार रखें।
* **❌ बचें:** बिना ठोस लिखित अनुबंध या वैध अनुमति के जल्दबाजी में कोई कदम न उठाएं।

---

#### 🌿 दैनिक उपाय
* **प्रातः सूर्य अर्घ्य:** तांबे के पात्र से उगते सूर्य को जल अर्पित करें जिससे प्रशासनिक व यात्रा कार्य निर्विघ्न हों।`;
    }

    // 4. WEALTH
    if (context.detectedTopic === 'WEALTH') {
      const sav11 = sav[11] || 35;
      const sav12 = sav[12] || 30;
      return `### 💰 धन एवं आर्थिक समृद्धि विश्लेषण

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *शुद्ध पूंजी संचय एवं धन वृद्धि*  
> **⏳ मुख्य वृद्धि काल:** **${rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **लाभ बनाम व्यय (11वां भाव: ${sav11} vs 12वां भाव: ${sav12} बिंदु):** आय का भाव व्यय से अधिक बली है, जिससे दीर्घकालिक बचत सुनिश्चित होती है।
* **धन संचय प्रणाली:** बौद्धिक संपदा, व्यवस्थित निवेश और परिसंपत्तियों से धन निरंतर बढ़ता रहेगा।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** उत्पादक संपत्तियों में नियमित व्यवस्थित निवेश करें और 6 माह का आपातकालीन फंड रखें।
* **❌ बचें:** बिना सोचे-समझे सट्टेबाजी, त्वरित धन के प्रलोभन या भारी कर्ज लेने से बचें।

---

#### 🌿 दैनिक उपाय
* **उत्तर दिशा की स्वच्छता:** अपने कार्यस्थल की उत्तर दिशा को स्वच्छ रखें और गुरुवार को कुछ दान करें।`;
    }

    // 5. STRUGGLE
    if (context.detectedTopic === 'STRUGGLE') {
      return `### 🌊 जीवन चक्र एवं रुकावटों का विश्लेषण

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% ज्योतिषीय निश्चितता** — *अस्थायी निर्माण व सुदृढ़ीकरण काल*  
> **⏳ राहत का समय:** **लगभग ${context.struggleReliefDate} से परिस्थितियों में सुधार**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **${context.activeMahadasha}-${context.activeAntardasha} का प्रभाव:** यह समय कमजोर विकल्पों को हटाकर स्थायी कार्यप्रणाली स्थापित करने का है।
* **कर्मिक दिशा:** वर्तमान की चुनौतियां असफलता नहीं बल्कि भविष्य के बड़े अवसरों के लिए आवश्यक तैयारी हैं।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** अपने कौशल में निपुणता, नियमित दिनचर्या और दीर्घकालिक लक्ष्यों पर ध्यान केंद्रित करें।
* **❌ बचें:** जोखिम भरे वित्तीय दांव या तात्कालिक रुकावटों से निराश होने से बचें।

---

#### 🌿 दैनिक उपाय
* **प्राणायाम एवं धैर्य:** सांध्यकाल में 10 मिनट अनुलोम-विलोम करें और प्रातः अनुशासन बनाए रखें।`;
    }

    // 6. HEALTH & AYUR_JYOTISH
    if (context.detectedTopic === 'HEALTH' || context.detectedTopic === 'AYUR_JYOTISH') {
      const sav6 = sav[6] || 31;
      const dosha = context.doshaProfile || {
        primaryDosha: 'Vata-Pitta (वात-पित्त)',
        dominantElements: 'वायु एवं अग्नि तत्व',
        digestiveFire: 'तीक्ष्णाग्नि / संवेदनशील जठराग्नि',
        doshaBreakdown: { vataPercentage: 45, pittaPercentage: 35, kaphaPercentage: 20 },
      };
      return `### 🌿 स्वास्थ्य एवं पाचन तंत्र विश्लेषण

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% प्रकृति संरेखण** — *${dosha.primaryDosha} (${dosha.dominantElements})*  
> **⏳ सुधार अवधि:** **नियमित दिनचर्या व खान-पान से 3–4 सप्ताह में लाभ**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **सूर्य कन्या राशि में (पाचन भाव):** कन्या राशि आंतों व जठराग्नि को नियंत्रित करती है, जिससे खान-पान में संवेदनशीलता रहती है।
* **मिथुन-कन्या नर्वस-गट अक्ष:** अधिक सोचने (Overthinking) व तनाव का सीधा असर आमाशय की गति व एसिडिटी पर पड़ता है।
* **छठा भाव (${sav6} बिंदु):** रोग प्रतिरोधक क्षमता उत्तम है; समय पर भोजन करने से शीघ्र स्वास्थ्य लाभ होगा।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** भोजन के बाद गुनगुना पानी या सौंफ-जीरा का हल्का पानी लें; भोजन का समय निश्चित रखें।
* **❌ बचें:** देर रात भारी भोजन, ठंडे पेय पदार्थ और तनावग्रस्त मनःस्थिति में खाने से बचें।

---

#### 🌿 दैनिक उपाय
* **प्रातः प्राणायाम व ध्यान:** भोजन से पूर्व 5 मिनट धीमी व गहरी सांस लें जिससे पाचन तंत्र शांत अवस्था में कार्य करे।`;
    }

    // 7. PROPERTY
    if (context.detectedTopic === 'PROPERTY') {
      const sav4 = sav[4] || 29;
      return `### 🏡 भवन व भूमि क्रय योग

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *स्थायी संपत्ति व आवास प्राप्ति के अनुकूल योग*  
> **⏳ शुभ समय:** **${context.propertyPurchaseWindow || rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **चतुर्थ भाव (${sav4} बिंदु):** घरेलू सुख-शांति, भूमि व स्वयं के मकान का मजबूत आधार प्रस्तुत करता है।
* **अनुकूल आवास:** प्राकृतिक प्रकाश व वायु से युक्त तैयार मकान या अपार्टमेंट आपके लिए विशेष शुभ रहेगा।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** संपत्ति के कानूनी दस्तावेजों की पूरी जांच करें और ईएमआई को आय के 30% के भीतर रखें।
* **❌ बचें:** बिना स्पष्ट स्वामित्व वाले विवादित सौदों में जल्दबाजी न करें।

---

#### 🌿 दैनिक उपाय
* **गृह शांति:** घर के ईशान कोण (North-East) को हमेशा साफ व खुला रखें।`;
    }

    // 8. GENERAL
    return this.buildDynamicAstrologicalResponse(context, rating, resolved, 'hi');
  }

  // ==========================================
  // HINGLISH SUB-INTENT HANDLERS
  // ==========================================
  private generateHinglishRAGResponse(
    context: any,
    rating: any,
    sav: Record<number, number>,
    jaimini: any
  ): string {
    // Check for specific entity matches across any question in Hinglish
    const resolved = this.resolveQuestionAstrology(context.questionQuery, context);
    if (resolved.matched) {
      return this.buildDynamicAstrologicalResponse(context, rating, resolved, 'hinglish');
    }

    const subIntent = context.detectedSubIntent || 'GENERAL';
    const darakaraka = jaimini.darakaraka || 'Venus';
    const amatyakaraka = jaimini.amatyakaraka || 'Mercury';
    const dkTraits = getDarakarakaTraits(darakaraka, 'hinglish');
    const seventhHouse = context.houseDetails?.find((h: any) => h.houseNumber === 7);
    const seventhSign = seventhHouse?.signName || 'Sagittarius';
    const seventhTraits = getSeventhHouseTraits(seventhSign, 'hinglish');
    const d9Lagna = context.divisionalHighlights?.d9Lagna || 'Libra';

    // 1. MARRIAGE & RELATIONSHIPS
    if (context.detectedTopic === 'MARRIAGE') {
      const sav7 = sav[7] || 27;
      const sav5 = sav[5] || 28;
      const sav9 = sav[9] || 30;

      if (subIntent === 'SPOUSE_TRAITS') {
        return `### 💍 Future Life Partner ka Nature & Personality Breakdown

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *High Intellectual Compatibility & Deep Understanding*  
> **⏳ Expected Window:** **${context.marriageTimingWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Markers
* **7th House (${seventhSign} / ${sav7} SAV Bindus):** Partner ka nature **${seventhTraits}** indicate hota hai.
* **Darakaraka (${darakaraka}):** Jaimini soul indicator ke hisab se spouse ka core temperament **${dkTraits}** hoga.
* **D9 Navamsha (${d9Lagna} Lagna):** Mutual respect aur personal space dene se relationship long-term me bahut stable aur fulfilling rahega.

---

#### 💼 Likely Career & Background
* **Aligned Fields:** Technology, strategic consulting, higher education, management, finance ya creative architecture.
* **Core Personality:** Unnecessary drama se dur, clear conversation, practical loyalty aur mutual growth ko value karne wale.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Unki independent thinking ko appreciate karein aur joint intellectual goals banayein.
* **❌ Avoid:** Chhoti baaton ko over-analyze karna ya partner se identical work style expect karna.

---

#### 🌿 Daily Practice
* **Relationship Harmony:** Daily mutual appreciation rakhein aur ghar ka North-East corner clean rakhein.`;
      }

      if (subIntent === 'LOVE_VS_ARRANGED') {
        const isLoveDominant = sav5 >= 28 || darakaraka === 'Venus' || darakaraka === 'Mercury';
        return `### 💖 Love Marriage vs Arranged Marriage Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${
          isLoveDominant ? 'Self-Chosen Match jisme family ka full blessing milega' : 'Arranged Introduction with High Intellectual & Emotional Bonding'
        }*  
> **⏳ Prime Timeline:** **${context.marriageTimingWindow || rating.coreTriggerWindow}**

---

#### 🪐 Astrological Mechanics
* **5th House (Romantic Connection - ${sav5} Bindus):** Strong personal discernment aur mutual intellectual attraction support karta hai.
* **7th House & Darakaraka (${darakaraka}):** Shared values aur genuine friendship par based relationship indicate karta hai.
* **9th House (Family Consensus - ${sav9} Bindus):** Confirm karta hai ki calm dialogue se family ka full approval milega.

---

#### 💡 Meeting Setting
* **How you will connect:** Work network, higher studies, shared intellectual community ya trusted mutual connections ke through milne ke strong yog hain.

---

#### 🌿 Daily Practice
* **Harmonious Communication:** Marriage discussions me family ke sath transparent aur respectful dialogue maintain karein.`;
      }

      if (subIntent === 'OBSTACLES_MANGLIK') {
        return `### 🛡️ Marriage Delays, Manglik Status & Solutions

> **🎯 Verdict:** **${rating.probabilityPercentage}% Certainty** — *Maturity Building Phase (No Superstition)*  
> **⏳ Relief Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Astrological Reality Check
* **Delay ka Asli Reason:** Vedic astrology me Saturn ya Mars ka influence koi shrap nahi hai—ye financial self-reliance aur emotional maturity develop karne ke liye hota hai.
* **Manglik Energy:** Mars ki dynamic energy ko fitness aur career building me channelize karne se relationship friction completely resolve ho jata hai.
* **7th House Transit:** Jupiter-Saturn ka dual transit current sub-period me marriage ke obstacles clear kar raha hai.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Emotional self-regulation aur career stability par focus karein.
* **❌ Avoid:** Fear-based superstitions, expensive rituals ya social pressure me hurried decision lena.

---

#### 🌿 Sattvic Daily Practice
* **Grounding:** Daily 10 mins Surya Namaskar karein aur interpersonal conversations me patience maintain karein.`;
      }

      // Default MARRIAGE
      return `### ❤️ Marriage & Relationship Timing Blueprint

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Matrimonial & Partnership Alignment*  
> **⏳ Prime Window:** **${context.marriageTimingWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **7th House (${sav7} SAV Bindus) & Darakaraka (${darakaraka}):** Intelligent, grounded aur supportive life partner indicate karta hai.
* **D9 Navamsha Harmony:** Mutual respect aur personal space maintain karne se long-term marital harmony banti hai.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Open transparent communication rakhein aur emotional stability ko value karein.
* **❌ Avoid:** Chhoti baaton ko over-analyze karna ya partner se identical nature expect karna.

---

#### 🌿 Daily Practice
* **Joint Gratitude:** Daily mutual appreciation aur individual creative growth ko encourage karein.`;
    }

    // 2. CAREER & BUSINESS
    if (context.detectedTopic === 'CAREER') {
      const sav10 = sav[10] || 34;
      const sav6 = sav[6] || 31;
      const sav3 = sav[3] || 27;

      if (subIntent === 'JOB_VS_BUSINESS') {
        const isBusinessFavored = sav10 >= 30 || sav3 >= 28;
        return `### 💼 Career Direction: Job vs. Business / Startup

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${
          isBusinessFavored ? 'Autonomous Business & Strategic Consulting me High Success' : 'Executive Leadership in Specialized High-Growth Roles'
        }*  
> **⏳ Growth Window:** **${context.careerLeapWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **10th House (${sav10} SAV Bindus):** Strong authority configuration jo strategic autonomy aur scalable enterprise me big outcome deta hai.
* **Amatyakaraka (${amatyakaraka}):** Tech products, strategic advisory aur domain expertise me high growth confirm karta hai.
* **6th House (${sav6} bindus) vs 3rd House (${sav3} bindus):** Pehle high expertise build karke independent venture me shift hona highest ROI dega.

---

#### 💡 Actionable Advice
* **✅ Do:** Rare skills master karein aur decisive, autonomous roles ko target karein.
* **❌ Avoid:** Low-growth repetitive bureaucratic setups me permanently comfortable ho jana.

---

#### 🌿 Daily Practice
* **Deep Work Focus:** Daily morning ke 90 mins bina kisi phone/distraction ke core skills par lagayein.`;
      }

      // Default CAREER
      return `### 💼 Career & Professional Guidance

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Leadership & Strategic Growth*  
> **⏳ Peak Window:** **${context.careerLeapWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **10th House (${sav10} SAV Bindus):** Strong authority configuration jo strategic autonomy, leadership aur specialized business me bada success deta hai.
* **Amatyakaraka (${amatyakaraka}):** Technology architecture, strategic consulting aur domain expertise se career me high elevation confirm karta hai.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** High-value rare skills develop karein aur decisive, autonomous roles ko target karein.
* **❌ Avoid:** Low-growth repetitive bureaucratic jobs me comfortable ho jana avoid karein.

---

#### 🌿 Daily Practice
* **Deep Work Focus:** Daily fixed morning hours me bina distraction ke high-impact tasks complete karein.`;
    }

    // 3. ABROAD
    if (context.detectedTopic === 'ABROAD') {
      const sav12 = sav[12] || 30;
      return `### ✈️ Foreign Travel & Relocation Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Foreign Travel & Relocation ke strong yog*  
> **⏳ Best Window:** **${context.relocationWindow || rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **Dual Lagna (${context.lagnaSign}):** International culture aur global environment me easily adapt hone ki natural capability.
* **12th House Foreign Axis (${sav12} SAV Bindus):** 28+ points confirm karte hain ki overseas rehne aur income sustain karne me favorable support milega.
* **${context.activeMahadasha}-${context.activeAntardasha} Dasha:** Current period foreign assignments, visa approvals aur cross-border career ko activate kar raha hai.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** MNC teams, overseas job applications aur travel documentation ready rakhein.
* **❌ Avoid:** Bina verified contract ya proper legal visa ke hasty decisions na lein.

---

#### 🌿 Daily Practice
* **Surya Arghya:** Daily morning copper vessel se Surya Dev ko jal arpit karein for smooth journeys aur clarity.`;
    }

    // 4. WEALTH
    if (context.detectedTopic === 'WEALTH') {
      const sav11 = sav[11] || 35;
      const sav12 = sav[12] || 30;
      return `### 💰 Wealth & Financial Growth Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Net Capital Growth & Asset Surplus*  
> **⏳ Prime Growth Phase:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **Gains vs Expense Ratio (11H: ${sav11} vs 12H: ${sav12} Bindus):** Favorable surplus ratio confirm karta hai ki long-term me savings aur net wealth compound hogi.
* **Wealth Architecture:** Long-term wealth quality assets aur intellectual property se build hogi, short-term betting se nahi.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Automated systematic investment karein verified assets me aur 6-month liquid emergency fund rakhein.
* **❌ Avoid:** High-risk speculative trading, FOMO investments aur unnecessary heavy loans.

---

#### 🌿 Daily Practice
* **Clean Workspace:** Apne workspace ki North zone clean rakhein aur Thursdays ko small charity karein.`;
    }

    // 5. STRUGGLE
    if (context.detectedTopic === 'STRUGGLE') {
      return `### 🌊 Life Phase & Obstacle Diagnosis

> **🎯 Verdict:** **${rating.probabilityPercentage}% Planetary Certainty** — *Temporary Consolidation Phase*  
> **⏳ Relief Horizon:** **Turning point around ${context.struggleReliefDate}**

---

#### 🪐 Root Cause Mechanics
* **${context.activeMahadasha}-${context.activeAntardasha} Pressure Test:** Ye phase weak shortcuts ko khatam karke strong, long-term foundation banane ke liye hai.
* **Karmic Direction:** Abhi ke setbacks permanent failure nahi, balki future ke bade breakthrough ke liye structural redirection hain.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Apne core skills par focus karein, sleep routine theek rakhein aur daily disciplined execution karein.
* **❌ Avoid:** High-risk quick money shortcuts ya temporary delays se emotionally panic hona avoid karein.

---

#### 🌿 Daily Practice
* **Grounding & Patience:** Evening me 10 mins Anulom-Vilom karein aur morning discipline maintain rakhein.`;
    }

    // 6. HEALTH & AYUR_JYOTISH
    if (context.detectedTopic === 'HEALTH' || context.detectedTopic === 'AYUR_JYOTISH') {
      const sav6 = sav[6] || 31;
      return `### 🌿 Health & Digestive Vitality Diagnosis

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Brain-Gut Connection & Digestion Sensitivity*  
> **⏳ Recovery Window:** **3–4 Weeks proper diet aur routine ke sath**

---

#### 🪐 Key Astrological Drivers
* **Sun in Virgo (Digestive Axis):** Virgo digestive fire (*Jatharagni*) aur gut microbiome govern karta hai, isliye diet me balance zaroori hai.
* **Gemini-Virgo Brain-Gut Axis:** Overthinking aur work stress ka direct asar stomach acidity aur digestion par padta hai.
* **6th House Resilience (${sav6} SAV Bindus):** Strong recovery baseline confirm karta hai; time par khana khane se jaldi relief milega.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Meals ke baad warm saunf-jeera water lein aur fixed meal times follow karein.
* **❌ Avoid:** Late-night heavy khana, cold drinks aur stress me jaldbazi me khana.

---

#### 🌿 Daily Practice
* **Morning Breathwork:** Meals se pehle 5 mins slow belly breathing karein to activate rest-and-digest mode.`;
    }

    // 7. GENERAL
    return this.buildDynamicAstrologicalResponse(context, rating, resolved, 'hinglish');
  }
}
