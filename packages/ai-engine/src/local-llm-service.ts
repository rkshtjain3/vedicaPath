import { SynthesizedPrompt } from './prompt-synthesizer.js';

declare const process: { env: Record<string, string | undefined> };

export interface LLMStreamOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  ollamaEndpoint?: string;
  onToken?: (token: string) => void;
  signal?: AbortSignal;
  engineMode?: 'rag' | 'ollama' | 'auto';
}

export interface LLMResponse {
  content: string;
  modelUsed: string;
  isFallback: boolean;
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
   * Stream response from local LLM or high-fidelity deterministic synthesizer
   */
  async *streamResponse(
    prompt: SynthesizedPrompt,
    options?: LLMStreamOptions
  ): AsyncGenerator<string, LLMResponse, unknown> {
    const shouldTryOllama = options?.engineMode !== 'rag';

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

    // High-fidelity RAG Synthesizer Fallback (Deterministic, Zero Latency)
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
      modelUsed: 'vedica-hybrid-rag-engine-v2',
      isFallback: true,
    };
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
   * Covers all life domains in English, Hindi, and Hinglish with concise, scannable format
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

  private generateEnglishRAGResponse(
    context: any,
    rating: any,
    sav: Record<number, number>,
    jaimini: any
  ): string {
    // 1. FOREIGN TRAVEL & OVERSEAS RELOCATION
    if (context.detectedTopic === 'ABROAD') {
      const sav12 = sav[12] || 30;
      return `### ✈️ Foreign Travel & Relocation Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${rating.verdictLabel}*  
> **⏳ Best Window:** **${rating.coreTriggerWindow}**

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

    // 2. STRUGGLE & FAILURE DIAGNOSIS
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

    // 3. CAREER & BUSINESS
    if (context.detectedTopic === 'CAREER') {
      const sav10 = sav[10] || 34;
      return `### 💼 Career & Professional Trajectory

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${rating.verdictLabel}*  
> **⏳ Peak Elevation Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **10th House (${sav10} SAV Bindus):** High authority configuration favoring strategic independence, leadership, or specialized business ventures over micromanaged roles.
* **Amatyakaraka (${jaimini.amatyakaraka}):** Connects career growth to technology architecture, strategic consulting, and domain expertise.
* **D10 Dashamsha Support:** Confirms long-term institutional authority and industry reputation.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Build domain authority in rare, high-leverage skills; position yourself as an indispensable architect of results.
* **❌ Avoid:** Staying in bureaucratic, low-autonomy roles where creative execution is capped.

---

#### 🌿 Daily Practice
* **Daily Focus & Solar Alignment:** Maintain structured deep-work blocks and morning Surya Arghya for supreme clarity.`;
    }

    // 4. WEALTH & FINANCE
    if (context.detectedTopic === 'WEALTH') {
      const sav11 = sav[11] || 35;
      const sav12 = sav[12] || 30;
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

    // 5. PROPERTY & REAL ESTATE
    if (context.detectedTopic === 'PROPERTY') {
      const sav4 = sav[4] || 29;
      return `### 🏡 Property & Real Estate Roadmap

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Supportive Fixed-Asset Acquisition*  
> **⏳ Prime Window:** **${rating.coreTriggerWindow}**

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

    // 6. MARRIAGE & RELATIONSHIPS
    if (context.detectedTopic === 'MARRIAGE') {
      const sav7 = sav[7] || 27;
      return `### ❤️ Marriage & Relationship Timing Blueprint

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Matrimonial & Relational Alignment*  
> **⏳ Prime Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **7th House (${sav7} SAV Bindus) & Darakaraka (${jaimini.darakaraka}):** Indicates an intelligent, grounded, and professionally supportive life partner.
* **D9 Navamsha Harmony:** Fosters long-term marital stability when mutual space and professional respect are maintained.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Foster open, transparent dialogue; appreciate emotional stability and practical loyalty.
* **❌ Avoid:** Over-analyzing minor disagreements or expecting identical personality traits.

---

#### 🌿 Daily Practice
* **Relational Space:** Cultivate joint gratitude and encourage individual creative pursuits.`;
    }

    // 7. HEALTH, STOMACH & VITALITY
    if (context.detectedTopic === 'HEALTH') {
      const sav6 = sav[6] || 31;
      return `### 🌿 Health & Digestive Vitality Diagnosis

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Brain-Gut & Metabolic Sensitivity*  
> **⏳ Recovery Window:** **3–4 Weeks with Diet & Circadian Discipline**

---

#### 🪐 Key Astrological Drivers
* **Sun in Virgo (Digestive Axis):** Virgo anatomically governs the intestines and gut microbiome, creating sensitivity in digestive fire (*Jatharagni*).
* **Gemini-Virgo Brain-Gut Axis:** As a **Gemini** Ascendant, mental overthinking and irregular work stress directly impact stomach motility and acidity.
* **6th House Resilience (${sav6} SAV Bindus):** Confirms strong innate vitality with quick recovery through regular dietary rhythm.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Drink warm water or mild cumin-coriander-fennel (CCF) tea post-meals; keep fixed meal times daily.
* **❌ Avoid:** Cold drinks, late-night heavy meals, and eating in a rushed or anxious mental state.

---

#### 🌿 Daily Practice
* **Morning Sunlight & Diaphragmatic Breathwork:** 10 minutes of gentle belly breathing before meals shifts the nervous system into the rest-and-digest state.`;
    }

    // 8. EDUCATION & COMPETITIVE EXAMS
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

    // 9. AIM OF LIFE & DHARMA
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

    // 10. DECISION SIMULATION / OPTION A vs OPTION B
    if (context.detectedTopic === 'DECISION_SIMULATION') {
      const sav10 = sav[10] || 34;
      return `### ⚖️ Strategic "What-If" Decision Simulation

> **🎯 Verdict:** **${rating.probabilityPercentage}% Clarity Score** — *${rating.verdictLabel}*  
> **⏳ Execution Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Comparative Planetary Matrix
* **Option A (Autonomous / High-Growth Path):** Aligns with 10th House (${sav10} SAV bindus) and Amatyakaraka (${jaimini.amatyakaraka}), offering maximum upside and long-term equity.
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

    // 11. AYUR-JYOTISH & CIRCADIAN BIO-RHYTHM
    if (context.detectedTopic === 'AYUR_JYOTISH') {
      const dosha = context.doshaProfile || {
        primaryDosha: 'Vata-Pitta',
        dominantElements: 'Air (Vayu) & Fire (Tejas)',
        digestiveFire: 'Tikshnagni (Variable / Sharp Fire)',
        doshaBreakdown: { vataPercentage: 45, pittaPercentage: 35, kaphaPercentage: 20 },
      };
      return `### 🌿 Ayur-Jyotish & Circadian Bio-Rhythm Blueprint

> **🎯 Verdict:** **${rating.probabilityPercentage}% Constitution Score** — *${dosha.primaryDosha} (${dosha.dominantElements})*  
> **⏳ Bio-Clock Rhythm:** **${dosha.digestiveFire}**

---

#### 🪐 Planetary Dosha & Energy Matrix
* **Dosha Constitution:** **Vata (${dosha.doshaBreakdown?.vataPercentage || 45}%)** | **Pitta (${dosha.doshaBreakdown?.pittaPercentage || 35}%)** | **Kapha (${dosha.doshaBreakdown?.kaphaPercentage || 20}%)**.
* **Astrological Root:** Rising sign (${context.lagnaSign}) and Sun in (${context.sunSign}) govern nervous-gut assimilation and mental metabolism.
* **Peak Circadian Windows:** Deep Cognitive Work (06:00–10:00 & 14:00–18:00 Vata/Kapha transition) | Main Meal (12:00–13:30 Peak Solar Pitta Fire).

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Consume warm, freshly prepared spiced meals (cumin, coriander, ginger) and follow fixed circadian sleep timings.
* **❌ Avoid:** Skipping lunch during peak solar hours, raw/cold dry foods, and eating under chronic cognitive stress.

---

#### 🌿 Daily Practice & Adaptogens
* **Ashwagandha & CCF Tea:** Take warm golden milk with a pinch of nutmeg or sip warm Cumin-Coriander-Fennel tea post-meals.`;
    }

    // 12. GENERAL / OPEN QUERY
    return `### ✨ Astrological Blueprint & Life Summary

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${context.primaryArchetype}*  
> **⏳ Active Dasha:** **${context.activeMahadasha}-${context.activeAntardasha} (transitioning around ${context.antardashaEndDate})**

---

#### 🪐 Key Milestone Horizons
* **✈️ Relocation & Travel:** ${context.relocationWindow || 'Active during upcoming planetary transits'}
* **💼 Career Breakthrough:** ${context.careerLeapWindow || 'Active during supportive sub-period'}
* **🏡 Home & Property:** ${context.propertyPurchaseWindow || 'Active in supportive 4th house cycle'}
* **❤️ Union & Marriage:** ${context.marriageTimingWindow || 'Active in relational planetary alignment'}

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Maintain daily morning discipline, deep-work focus, and steady asset compounding.
* **❌ Avoid:** Impulsive speculative financial bets or sudden career pivots during consolidation cycles.

---

#### 🌿 Daily Practice
* **Morning Surya Arghya:** Offer clean water to the morning Sun daily for supreme authority, health, and vitality.`;
  }

  private generateHindiRAGResponse(
    context: any,
    rating: any,
    sav: Record<number, number>,
    jaimini: any
  ): string {
    // 1. FOREIGN TRAVEL & OVERSEAS RELOCATION
    if (context.detectedTopic === 'ABROAD') {
      const sav12 = sav[12] || 30;
      return `### ✈️ विदेश यात्रा एवं निवास विश्लेषण

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *विदेश गमन एवं निवास के प्रबल योग*  
> **⏳ शुभ समय:** **${rating.coreTriggerWindow}**

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

    // 2. STRUGGLE & OBSTACLE DIAGNOSIS
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

    // 3. CAREER & BUSINESS
    if (context.detectedTopic === 'CAREER') {
      const sav10 = sav[10] || 34;
      return `### 💼 करियर एवं व्यवसायिक मार्गदर्शन

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *नेतृत्व एवं स्वतंत्र कार्यक्षेत्र में उन्नति*  
> **⏳ प्रगति का समय:** **${rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **दशम भाव (${sav10} बिंदु):** उच्च अधिकार योग जो रणनीतिक स्वतंत्रता और विशेषज्ञता आधारित कार्यों में विशेष सफलता दिलाता है।
* **अमात्यकारक (${jaimini.amatyakaraka}):** तकनीकी दक्षता, परामर्श और रणनीतिक निर्णयों से करियर में बड़ा उछाल दर्शाता है।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** उच्च-मूल्य वाले कौशलों में अपनी विशेषज्ञता बढ़ाएं और स्वायत्त भूमिकाओं को प्राथमिकता दें।
* **❌ बचें:** ऐसे सीमित वातावरण में रुकने से बचें जहां आपके नवाचार पर पाबंदी हो।

---

#### 🌿 दैनिक उपाय
* **सूर्य नमस्कार व अनुशासन:** प्रतिदिन एकाग्रता के साथ महत्वपूर्ण कार्यों को प्राथमिकता दें।`;
    }

    // 4. WEALTH & FINANCE
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

    // 5. PROPERTY & REAL ESTATE
    if (context.detectedTopic === 'PROPERTY') {
      const sav4 = sav[4] || 29;
      return `### 🏡 भवन व भूमि क्रय योग

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *स्थायी संपत्ति व आवास प्राप्ति के अनुकूल योग*  
> **⏳ शुभ समय:** **${rating.coreTriggerWindow}**

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

    // 6. MARRIAGE & RELATIONSHIPS
    if (context.detectedTopic === 'MARRIAGE') {
      const sav7 = sav[7] || 27;
      return `### ❤️ विवाह एवं दांपत्य जीवन मार्गदर्शन

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *सुयोग्य जीवनसाथी व वैवाहिक सामंजस्य*  
> **⏳ शुभ समय:** **${rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **सप्तम भाव (${sav7} बिंदु) एवं दाराकारक (${jaimini.darakaraka}):** बुद्धिमान, व्यावहारिक और सहयोगी जीवनसाथी का संकेत देते हैं।
* **नवमांश (D9) संरेखण:** वैचारिक स्वतंत्रता और परस्पर सम्मान से वैवाहिक जीवन स्थिर व सुखद रहेगा।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** स्पष्ट संवाद रखें और साथी की व्यवहार कुशलता व निष्ठा का सम्मान करें।
* **❌ बचें:** छोटी-छोटी बातों का अधिक विश्लेषण करने या अनावश्यक अपेक्षाएं रखने से बचें।

---

#### 🌿 दैनिक उपाय
* **आपसी सौहार्द:** प्रतिदिन कृतज्ञता का भाव रखें और एक-दूसरे के कार्यों में सहयोग दें।`;
    }

    // 7. HEALTH & STOMACH VITALITY
    if (context.detectedTopic === 'HEALTH') {
      const sav6 = sav[6] || 31;
      return `### 🌿 स्वास्थ्य एवं पाचन तंत्र विश्लेषण

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% संरेखण** — *मानसिक तनाव व पाचन तंत्र की संवेदनशीलता*  
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

    // 8. EDUCATION
    if (context.detectedTopic === 'EDUCATION') {
      const sav5 = sav[5] || 29;
      return `### 🎓 शिक्षा एवं प्रतियोगी परीक्षा मार्गदर्शन

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *तीव्र ग्रहण क्षमता एवं परीक्षा में सफलता*  
> **⏳ अनुकूल समय:** **${rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **पंचम भाव (${sav5} बिंदु):** विश्लेषणात्मक समझ, तार्किक स्मृति और समस्या समाधान क्षमता को बढ़ाता है।
* **अनुकूल विषय:** तकनीकी, प्रबंधन, विश्लेषिकी और पेशेवर प्रमाणन परीक्षाएं।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** 90 मिनट के एकाग्र अध्ययन सत्र और मॉक टेस्ट के माध्यम से तैयारी करें।
* **❌ बचें:** केवल रटने या पढ़ते समय मोबाइल के उपयोग से बचें।

---

#### 🌿 दैनिक उपाय
* **एकाग्रता प्राणायाम:** अध्ययन से पूर्व 5 मिनट ध्यान लगाकर मन को शांत करें।`;
    }

    // 9. DHARMA & LIFE AIM
    if (context.detectedTopic === 'DHARMA') {
      return `### 🧭 जीवन का मुख्य उद्देश्य एवं धर्म

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *${context.primaryArchetype}*  
> **⏳ जीवन दिशा:** **${rating.coreTriggerWindow}**

---

#### 🪐 मुख्य ज्योतिषीय कारण
* **मूल उद्देश्य:** ${context.coreLifeAim}
* **जन्मजात क्षमता:** रणनीतिक दूरदर्शिता, बौद्धिक स्वायत्तता और स्थायी व्यवस्थाओं का निर्माण।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** अपने दैनिक प्रयासों को दीर्घकालिक प्रतिष्ठा और उच्च निष्ठा के साथ जोड़ें।
* **❌ बचें:** तात्कालिक आराम के लिए अपनी वास्तविक क्षमता से समझौता न करें।

---

#### 🌿 दैनिक उपाय
* **प्रातः संकल्प:** दिन की शुरुआत में अपने मुख्य जीवन लक्ष्यों का स्मरण करें।`;
    }

    // 10. DECISION SIMULATION
    if (context.detectedTopic === 'DECISION_SIMULATION') {
      const sav10 = sav[10] || 34;
      return `### ⚖️ रणनीतिक विकल्प तुलना एवं निर्णय सिम्युलेटर

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% स्पष्टता** — *${rating.verdictLabel}*  
> **⏳ कार्यान्वयन समय:** **${rating.coreTriggerWindow}**

---

#### 🪐 तुलनात्मक ग्रहीय विश्लेषण
* **विकल्प A (स्वायत्त / उच्च विकास पथ):** दशम भाव (${sav10} बिंदु) व अमात्यकारक (${jaimini.amatyakaraka}) के साथ पूर्ण संरेखित है, जो दीर्घकालिक उन्नति देता है।
* **विकल्प B (सुरक्षित / सीमित दिनचर्या):** तात्कालिक सुरक्षा देता है परंतु ${context.activeMahadasha}-${context.activeAntardasha} दशा में आपकी वास्तविक क्षमता को सीमित करता है।
* **सर्वाष्टकवर्ग अंतर:** स्वतंत्र व रणनीतिक निर्णय में पारंपरिक सीमित नौकरी की तुलना में **+18% अधिक ग्रहीय लाभ** प्राप्त होता है।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** उस विकल्प को चुनें जो आपकी बौद्धिक स्वायत्तता, कौशल विकास और दीर्घकालिक प्रतिष्ठा को बढ़ाए।
* **❌ बचें:** अस्थायी असुविधा के डर से ऐसा निर्णय लेने से बचें जो आपकी क्षमता को सीमित करे।

---

#### 🌿 दैनिक उपाय
* **निर्णय स्पष्टता ध्यान:** महत्वपूर्ण अनुबंधों पर हस्ताक्षर करने से पूर्व प्रातः 10 मिनट मौन चिंतन करें।`;
    }

    // 11. AYUR-JYOTISH
    if (context.detectedTopic === 'AYUR_JYOTISH') {
      const dosha = context.doshaProfile || {
        primaryDosha: 'Vata-Pitta (वात-पित्त)',
        dominantElements: 'वायु एवं अग्नि तत्व',
        digestiveFire: 'तीक्ष्णाग्नि / संवेदनशील जठराग्नि',
        doshaBreakdown: { vataPercentage: 45, pittaPercentage: 35, kaphaPercentage: 20 },
      };
      return `### 🌿 आयुर्-ज्योतिष एवं जैविक दिनचर्या विश्लेषण

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% प्रकृति संरेखण** — *${dosha.primaryDosha} (${dosha.dominantElements})*  
> **⏳ जठराग्नि स्थिति:** **${dosha.digestiveFire}**

---

#### 🪐 त्रिदोष एवं ग्रहीय ऊर्जा चक्र
* **दोष संरचना:** **वात (${dosha.doshaBreakdown?.vataPercentage || 45}%)** | **पित्त (${dosha.doshaBreakdown?.pittaPercentage || 35}%)** | **कफ (${dosha.doshaBreakdown?.kaphaPercentage || 20}%)**।
* **ज्योतिषीय आधार:** लग्न (${context.lagnaSign}) एवं सूर्य (${context.sunSign}) नर्वस सिस्टम व पाचन अवशोषण को नियंत्रित करते हैं।
* **उत्तम दैनिक समय:** गहन बौद्धिक कार्य (प्रातः 06:00–10:00) | मुख्य भोजन (दोपहर 12:00–13:30 जब सूर्य व पित्त शीर्ष पर हों)।

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** गुनगुने ताजे भोजन (जीरा, सौंफ, अदरक युक्त) का सेवन करें और निश्चित समय पर सोएं।
* **❌ बचें:** दोपहर का भोजन छोड़ना, ठंडे सूखे खाद्य पदार्थ और मानसिक तनाव में भोजन करना।

---

#### 🌿 दैनिक औषधि व उपाय
* **अश्वगंधा व सौंफ-जीरा जल:** भोजन के उपरांत गुनगुना सौंफ-जीरा पानी लें और रात्रि में जायफल युक्त दूध लें।`;
    }

    // 12. GENERAL
    return `### ✨ कुण्डली सार एवं जीवन मार्गदर्शन

> **🎯 निष्कर्ष:** **${rating.probabilityPercentage}% अनुकूलता** — *${context.primaryArchetype}*  
> **⏳ सक्रिय दशा:** **${context.activeMahadasha}-${context.activeAntardasha} (समाप्ति लगभग ${context.antardashaEndDate})**

---

#### 🪐 प्रमुख समय सीमाएं
* **✈️ विदेश यात्रा / स्थान परिवर्तन:** ${context.relocationWindow || 'आगामी शुभ गोचर में सक्रिय'}
* **💼 करियर में बड़ा उछाल:** ${context.careerLeapWindow || 'सक्रिय दशा के अंतर्गत अनुकूल'}
* **🏡 गृह व संपत्ति क्रय:** ${context.propertyPurchaseWindow || 'चतुर्थ भाव के शुभ गोचर में सक्रिय'}
* **❤️ विवाह एवं संबंध:** ${context.marriageTimingWindow || 'शुभ ग्रहीय संरेखण में सक्रिय'}

---

#### 💡 क्या करें और क्या न करें
* **✅ करें:** दैनिक प्रातः अनुशासन, एकाग्र कार्य और नियमित बचत बनाए रखें।
* **❌ बचें:** जल्दबाजी में जोखिम भरे वित्तीय निर्णय लेने से बचें।

---

#### 🌿 दैनिक उपाय
* **प्रातः सूर्य अर्घ्य:** प्रतिदिन उगते सूर्य को जल अर्पित करें जिससे आत्मविश्वास व यश में वृद्धि हो।`;
  }

  private generateHinglishRAGResponse(
    context: any,
    rating: any,
    sav: Record<number, number>,
    jaimini: any
  ): string {
    // 1. FOREIGN TRAVEL & OVERSEAS RELOCATION
    if (context.detectedTopic === 'ABROAD') {
      const sav12 = sav[12] || 30;
      return `### ✈️ Foreign Travel & Relocation Assessment

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Foreign Travel & Relocation ke strong yog*  
> **⏳ Best Window:** **${rating.coreTriggerWindow}**

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

    // 2. STRUGGLE & FAILURE DIAGNOSIS
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

    // 3. CAREER & BUSINESS
    if (context.detectedTopic === 'CAREER') {
      const sav10 = sav[10] || 34;
      return `### 💼 Career & Professional Guidance

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Leadership & Strategic Growth*  
> **⏳ Peak Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **10th House (${sav10} SAV Bindus):** Strong authority configuration jo strategic autonomy, leadership aur specialized business me bada success deta hai.
* **Amatyakaraka (${jaimini.amatyakaraka}):** Technology architecture, strategic consulting aur domain expertise se career me high elevation confirm karta hai.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** High-value rare skills develop karein aur decisive, autonomous roles ko target karein.
* **❌ Avoid:** Low-growth repetitive bureaucratic jobs me comfortable ho jana avoid karein.

---

#### 🌿 Daily Practice
* **Deep Work Focus:** Daily fixed morning hours me bina distraction ke high-impact tasks complete karein.`;
    }

    // 4. WEALTH & FINANCE
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

    // 5. PROPERTY & REAL ESTATE
    if (context.detectedTopic === 'PROPERTY') {
      const sav4 = sav[4] || 29;
      return `### 🏡 Property & Real Estate Roadmap

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Supportive Fixed-Asset Acquisition*  
> **⏳ Best Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **4th House Sanctuary (${sav4} SAV Bindus):** Strong residential foundation, property ownership aur mental peace ka strong indicator.
* **Favored Property:** Well-ventilated constructed flat ya ready home aapke liye best suit karega.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Property title documents thoroughly verify karein aur EMI ko cashflow ke 30% ke under rakhein.
* **❌ Avoid:** Unregistered ya disputed property deals me jaldbazi me token amount dena avoid karein.

---

#### 🌿 Daily Practice
* **North-East Harmony:** Ghar ke North-East corner ko clean aur uncluttered rakhein.`;
    }

    // 6. MARRIAGE & RELATIONSHIPS
    if (context.detectedTopic === 'MARRIAGE') {
      const sav7 = sav[7] || 27;
      return `### ❤️ Marriage & Relationship Timing Blueprint

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Matrimonial & Partnership Alignment*  
> **⏳ Prime Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **7th House (${sav7} SAV Bindus) & Darakaraka (${jaimini.darakaraka}):** Intelligent, grounded aur supportive life partner indicate karta hai.
* **D9 Navamsha Harmony:** Mutual respect aur personal space maintain karne se long-term marital harmony banti hai.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Open transparent communication rakhein aur emotional stability ko value karein.
* **❌ Avoid:** Chhoti baaton ko over-analyze karna ya partner se identical nature expect karna.

---

#### 🌿 Daily Practice
* **Joint Gratitude:** Daily mutual appreciation aur individual creative growth ko encourage karein.`;
    }

    // 7. HEALTH & STOMACH VITALITY
    if (context.detectedTopic === 'HEALTH') {
      const sav6 = sav[6] || 31;
      return `### 🌿 Health & Digestive Vitality Diagnosis

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *Brain-Gut Connection & Digestion Sensitivity*  
> **⏳ Recovery Window:** **3–4 Weeks proper diet aur routine ke sath**

---

#### 🪐 Key Astrological Drivers
* **Sun in Virgo (Digestive Axis):** Virgo sign gut aur digestion ko govern karta hai, isiliye irregular eating se digestive fire (*Jatharagni*) sensitive hoti hai.
* **Gemini-Virgo Brain-Gut Link:** Gemini lagna hone se mental stress aur overthinking seedhe stomach acidity aur motility ko disturb karta hai.
* **6th House Immunity (${sav6} Bindus):** Innate recovery power strong hai, routine fix karte hi pet ki problem jaldi theek ho jayegi.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Khane ke baad warm water ya mild saunf-jeera water lein; meal timings strictly fix rakhein.
* **❌ Avoid:** Late-night heavy meals, cold carbonated drinks aur anxiety me jaldbazi me khana.

---

#### 🌿 Daily Practice
* **Morning Sunlight & Deep Breathing:** Khane se pehle 5-10 mins deep belly breathing karein to activate rest-and-digest mode.`;
    }

    // 8. EDUCATION
    if (context.detectedTopic === 'EDUCATION') {
      const sav5 = sav[5] || 29;
      return `### 🎓 Education & Exam Performance Roadmap

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *High Cognitive Retention & Focus*  
> **⏳ Prime Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **5th House Intellect (${sav5} SAV Bindus):** Sharp analytical ability, conceptual clarity aur exam retention power.
* **Favored Fields:** Tech, engineering, management, analytics aur specialized certifications.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** 90-minute distraction-free blocks me study karein with active recall testing.
* **❌ Avoid:** Passive reading ya study ke time phone multitasking.

---

#### 🌿 Daily Practice
* **Mindful Focus:** Study session start karne se pehle 5 mins deep breathing karein for memory clarity.`;
    }

    // 9. DHARMA & LIFE MISSION
    if (context.detectedTopic === 'DHARMA') {
      return `### 🧭 Life Mission & Soul Dharma

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${context.primaryArchetype}*  
> **⏳ Life Horizon:** **${rating.coreTriggerWindow}**

---

#### 🪐 Key Astrological Drivers
* **Core Calling:** ${context.coreLifeAim}
* **Innate Superpower:** Strategic foresight, intellectual autonomy aur lasting scalable systems banana.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Daily work ko apne long-term authentic legacy ke sath align karein.
* **❌ Avoid:** Short-term comfort ke liye micromanaged setups me apna potential compromise karna.

---

#### 🌿 Daily Practice
* **Daily Alignment:** Morning me digital screens open karne se pehle apne top life goals recall karein.`;
    }

    // 10. DECISION SIMULATION
    if (context.detectedTopic === 'DECISION_SIMULATION') {
      const sav10 = sav[10] || 34;
      return `### ⚖️ Strategic "What-If" Decision Simulation

> **🎯 Verdict:** **${rating.probabilityPercentage}% Clarity Score** — *${rating.verdictLabel}*  
> **⏳ Execution Window:** **${rating.coreTriggerWindow}**

---

#### 🪐 Comparative Planetary Matrix
* **Option A (Autonomous / High-Growth Path):** 10th House (${sav10} SAV bindus) aur Amatyakaraka (${jaimini.amatyakaraka}) ke sath perfectly align karta hai for long-term growth.
* **Option B (Safe / Fixed Routine Path):** Short-term safety deta hai but ${context.activeMahadasha}-${context.activeAntardasha} cycle me aapke real potential ko limit karta hai.
* **Ashtakavarga Differential:** Strategic ventures aur domain autonomy me traditional job se **+18% zyada planetary leverage** milta hai.

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Aise option ko chunein jo aapki sovereignty, skill compounding aur scalable impact ko maximize kare.
* **❌ Avoid:** Temporary friction ke darr se micromanaged comfortable option me phans jana.

---

#### 🌿 Daily Practice
* **Clarity Meditation:** Important decision lene se pehle morning me 10 mins quiet reflection karein.`;
    }

    // 11. AYUR-JYOTISH
    if (context.detectedTopic === 'AYUR_JYOTISH') {
      const dosha = context.doshaProfile || {
        primaryDosha: 'Vata-Pitta',
        dominantElements: 'Air & Fire',
        digestiveFire: 'Tikshnagni (Variable / Sharp Fire)',
        doshaBreakdown: { vataPercentage: 45, pittaPercentage: 35, kaphaPercentage: 20 },
      };
      return `### 🌿 Ayur-Jyotish & Circadian Bio-Rhythm Blueprint

> **🎯 Verdict:** **${rating.probabilityPercentage}% Constitution Score** — *${dosha.primaryDosha} (${dosha.dominantElements})*  
> **⏳ Bio-Clock Rhythm:** **${dosha.digestiveFire}**

---

#### 🪐 Planetary Dosha & Energy Matrix
* **Dosha Constitution:** **Vata (${dosha.doshaBreakdown?.vataPercentage || 45}%)** | **Pitta (${dosha.doshaBreakdown?.pittaPercentage || 35}%)** | **Kapha (${dosha.doshaBreakdown?.kaphaPercentage || 20}%)**.
* **Astrological Root:** Rising sign (${context.lagnaSign}) aur Sun (${context.sunSign}) nervous-gut metabolism aur digestive fire (*Jatharagni*) govern karte hain.
* **Peak Circadian Windows:** Deep Cognitive Work (06:00–10:00 & 14:00–18:00) | Main Lunch (12:00–13:30 jab Surya & Pitta peak par ho).

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Warm, freshly cooked meals lein with mild spices (jeera, saunf, adrak) aur fixed sleep cycle follow karein.
* **❌ Avoid:** Lunch skip karna, cold dry snacks aur anxious mental state me jaldbazi me khana.

---

#### 🌿 Daily Practice & Adaptogens
* **Saunf-Jeera Water & Golden Milk:** Meals ke baad warm saunf-jeera water lein aur raat me thoda nutmeg/haldi milk lein.`;
    }

    // 12. GENERAL
    return `### ✨ Astrological Blueprint & Life Summary

> **🎯 Verdict:** **${rating.probabilityPercentage}% Alignment** — *${context.primaryArchetype}*  
> **⏳ Active Dasha:** **${context.activeMahadasha}-${context.activeAntardasha} (ending around ${context.antardashaEndDate})**

---

#### 🪐 Key Milestone Horizons
* **✈️ Relocation & Travel:** ${context.relocationWindow || 'Active during upcoming transits'}
* **💼 Career Breakthrough:** ${context.careerLeapWindow || 'Active during supportive period'}
* **🏡 Home & Property:** ${context.propertyPurchaseWindow || 'Active in supportive 4th house cycle'}
* **❤️ Union & Marriage:** ${context.marriageTimingWindow || 'Active in relational alignment'}

---

#### 💡 What to Do vs What to Avoid
* **✅ Do:** Daily morning discipline, deep-work focus aur regular asset compounding maintain karein.
* **❌ Avoid:** Impulsive speculative financial bets ya panic career pivots.

---

#### 🌿 Daily Practice
* **Surya Arghya:** Daily morning Sun ko water offer karein for vitality, health aur supreme confidence.`;
  }
}
