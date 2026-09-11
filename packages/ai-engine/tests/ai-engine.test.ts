import { describe, it, expect } from 'vitest';
import { synthesizeAstrologicalPrompt, classifyLifeDomain, generateFollowUpSuggestions } from '../src/prompt-synthesizer.js';
import { LocalLLMService } from '../src/local-llm-service.js';

describe('AI Engine - Prompt Synthesizer & Local LLM Service', () => {
  const mockCalculationData = {
    astrology: {
      lagna: { sign: { name: 'Gemini' } },
      moonSign: { name: 'Capricorn' },
      birthNakshatra: { name: 'Uttara Ashadha' },
      planets: [{ planet: 'Sun', sign: { name: 'Virgo' } }],
    },
    jaimini: {
      charaKarakas: [
        { karaka: 'AK', planet: 'Sun' },
        { karaka: 'AmK', planet: 'Mercury' },
        { karaka: 'DK', planet: 'Venus' },
      ],
    },
    dasha: {
      current: {
        mahadasha: { planet: 'Jupiter' },
        antardasha: { planet: 'Saturn', endDate: '2027-03-01' },
      },
    },
    milestones: {
      careerWindows: [
        {
          startDate: '2026-10-01',
          endDate: '2027-04-15',
          confidenceLabel: 'HIGH CONFIDENCE',
        },
      ],
      propertyWindows: [
        {
          startDate: '2027-05-01',
          endDate: '2028-02-15',
          confidenceLabel: 'STRONG TIMING',
        },
      ],
      marriageWindows: [
        {
          startDate: '2026-11-15',
          endDate: '2027-08-30',
          confidenceLabel: 'VERY HIGH PROBABILITY',
        },
      ],
      relocationWindows: [
        {
          startDate: '2026-09-01',
          endDate: '2027-03-01',
          confidenceLabel: 'TRAVEL / SHIFT ACTIVE',
        },
      ],
    },
    struggles: {
      activeCauses: [{ category: 'SADE_SATI' }],
      rootExplanation: 'Structural consolidation under Saturn transit.',
      reliefDate: '2027-03-01',
      actionProtocol: [
        { title: 'Surya Arghya', description: 'Daily morning solar offering' },
        { title: 'Focus on Craft', description: 'Avoid impulsive career pivots' },
      ],
    },
    lifeStorybook: {
      primaryArchetype: 'The Strategic Innovator',
      coreLifeMission: 'Building scalable enterprises through technological and creative excellence.',
    },
  };

  it('correctly classifies diverse intent triggers across life domains', () => {
    expect(classifyLifeDomain('is there any possibility to go abroad for me').topic).toBe('ABROAD');
    expect(classifyLifeDomain('will I get visa for canada or settle overseas').topic).toBe('ABROAD');
    expect(classifyLifeDomain('videsh yatra ke yog kab hain').topic).toBe('ABROAD');
    expect(classifyLifeDomain('what is my career path in detail? job vs startup?').topic).toBe('CAREER');
    expect(classifyLifeDomain('when will my debt be cleared and how will I build wealth').topic).toBe('WEALTH');
    expect(classifyLifeDomain('when will I get married and how will my spouse be').topic).toBe('MARRIAGE');
    expect(classifyLifeDomain('shaadi kab hogi aur life partner kaisa hoga').topic).toBe('MARRIAGE');
    expect(classifyLifeDomain('when will I buy a home or flat').topic).toBe('PROPERTY');
    expect(classifyLifeDomain('why am I having severe anxiety and mental stress').topic).toBe('HEALTH');
    expect(classifyLifeDomain('will I clear UPSC competitive exam').topic).toBe('EDUCATION');
    expect(classifyLifeDomain('when will we have a baby / child').topic).toBe('CHILDREN');
    expect(classifyLifeDomain('why am I facing failure from last 2 years').topic).toBe('STRUGGLE');
  });

  it('correctly handles ABROAD query and generates direct, tailored RAG response with followUps', async () => {
    const prompt = synthesizeAstrologicalPrompt({
      question: 'is there any possibility to go abroad for me',
      calculationData: mockCalculationData,
      fullName: 'Rakshit Jain',
      language: 'en',
    });

    expect(prompt.context.detectedTopic).toBe('ABROAD');
    expect(prompt.context.lagnaSign).toBe('Gemini');
    expect(prompt.context.lagnaModality).toBe('Dual');
    expect(prompt.context.jaiminiKarakas.amatyakaraka).toBe('Mercury');
    expect(prompt.followUpSuggestions.length).toBe(3);
    expect(prompt.userPrompt).toContain('Rakshit Jain');
    expect(prompt.userPrompt).toContain('Amatyakaraka=Mercury');

    const llmService = new LocalLLMService({ endpoint: 'http://127.0.0.1:99999' });
    const chunks: string[] = [];
    const stream = llmService.streamResponse(prompt);

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const fullResponse = chunks.join('');
    expect(fullResponse).toContain('Foreign Travel & Relocation Assessment');
    expect(fullResponse).toContain('86% Alignment');
    expect(fullResponse).toContain('12th House Foreign Axis');
    expect(fullResponse).toContain('Dual');
    expect(fullResponse).toContain('Morning Surya Arghya');
  });

  it('supports multi-turn conversation history in synthesized prompt', () => {
    const prompt = synthesizeAstrologicalPrompt({
      question: 'Which country would be best for my career?',
      calculationData: mockCalculationData,
      fullName: 'Rakshit Jain',
      conversationHistory: [
        { role: 'user', content: 'Is there any possibility to go abroad for me?' },
        { role: 'assistant', content: 'Yes, your chart indicates favorable travel between 2026-09-01 and 2027-03-01.' },
      ],
    });

    expect(prompt.userPrompt).toContain('PREVIOUS CONVERSATION THREAD');
    expect(prompt.userPrompt).toContain('Is there any possibility to go abroad for me?');
    expect(prompt.userPrompt).toContain('Which country would be best for my career?');
  });

  it('generates contextual follow-up suggestions across topics', () => {
    const abroadChips = generateFollowUpSuggestions('ABROAD', {});
    expect(abroadChips.length).toBe(3);
    expect(abroadChips[0].en).toContain('Which directions or countries');

    const careerChips = generateFollowUpSuggestions('CAREER', {});
    expect(careerChips.length).toBe(3);
    expect(careerChips[0].en).toContain('Amatyakaraka');
  });

  it('correctly detects STRUGGLE topic and synthesizes ground-truth context', () => {
    const prompt = synthesizeAstrologicalPrompt({
      question: 'Why am I facing so much failure and delay for the last 2 years?',
      calculationData: mockCalculationData,
      fullName: 'Rahul Sharma',
      language: 'en',
    });

    expect(prompt.context.detectedTopic).toBe('STRUGGLE');
    expect(prompt.context.fullName).toBe('Rahul Sharma');
    expect(prompt.context.lagnaSign).toBe('Gemini');
    expect(prompt.context.activeMahadasha).toBe('Jupiter');
    expect(prompt.context.activeAntardasha).toBe('Saturn');
    expect(prompt.context.struggleReliefDate).toBe('2027-03-01');
    expect(prompt.systemPrompt).toContain('Vedica AI');
    expect(prompt.userPrompt).toContain('Rahul Sharma');
  });

  it('supports Hindi language system prompt and deterministic RAG response', async () => {
    const prompt = synthesizeAstrologicalPrompt({
      question: 'मेरी शादी कब होगी?',
      calculationData: mockCalculationData,
      language: 'hi',
    });

    expect(prompt.systemPrompt).toContain('वेदिका एआई');
    expect(prompt.systemPrompt).toContain('वैदिक जीवन मार्गदर्शक');
    expect(prompt.context.language).toBe('hi');

    const llmService = new LocalLLMService({ endpoint: 'http://127.0.0.1:99999' });
    const chunks: string[] = [];
    for await (const chunk of llmService.streamResponse(prompt)) {
      chunks.push(chunk);
    }
    const full = chunks.join('');
    expect(full).toContain('विवाह एवं दांपत्य जीवन मार्गदर्शन');
    expect(full).toContain('निष्कर्ष:');
    expect(full).toContain('मुख्य ज्योतिषीय कारण');
  });

  it('auto-detects Hinglish and streams tailored conversational Hinglish response', async () => {
    const prompt = synthesizeAstrologicalPrompt({
      question: 'meri kundali me videsh jane ka yog kab ban raha hai',
      calculationData: mockCalculationData,
      language: 'auto',
    });

    expect(prompt.context.language).toBe('hinglish');
    expect(prompt.systemPrompt).toContain('Hinglish');

    const llmService = new LocalLLMService({ endpoint: 'http://127.0.0.1:99999' });
    const chunks: string[] = [];
    for await (const chunk of llmService.streamResponse(prompt)) {
      chunks.push(chunk);
    }
    const full = chunks.join('');
    expect(full).toContain('Foreign Travel & Relocation Assessment');
    expect(full).toContain('Foreign Travel & Relocation ke strong yog');
    expect(full).toContain('Key Astrological Drivers');
    expect(full).toContain('Surya Arghya');
  });

  it('correctly routes "meri shadi kb hogi" to MARRIAGE domain in Hinglish', async () => {
    const prompt = synthesizeAstrologicalPrompt({
      question: 'meri shadi kb hogi',
      calculationData: mockCalculationData,
      language: 'auto',
    });

    expect(prompt.context.detectedTopic).toBe('MARRIAGE');
    expect(prompt.context.language).toBe('hinglish');

    const llmService = new LocalLLMService({ endpoint: 'http://127.0.0.1:99999' });
    const chunks: string[] = [];
    for await (const chunk of llmService.streamResponse(prompt)) {
      chunks.push(chunk);
    }
    const full = chunks.join('');
    expect(full).toContain('Marriage & Relationship Timing Blueprint');
    expect(full).toContain('Matrimonial & Partnership Alignment');
    expect(full).toContain('7th House');
    expect(full).toContain('Darakaraka');
  });

  it('correctly handles DECISION_SIMULATION and What-If comparison queries', async () => {
    const prompt = synthesizeAstrologicalPrompt({
      question: 'Compare Option A vs Option B for my career decision simulator',
      calculationData: mockCalculationData,
      language: 'en',
    });

    expect(prompt.context.detectedTopic).toBe('DECISION_SIMULATION');
    expect(prompt.followUpSuggestions.length).toBe(3);

    const llmService = new LocalLLMService({ endpoint: 'http://127.0.0.1:99999' });
    const chunks: string[] = [];
    for await (const chunk of llmService.streamResponse(prompt)) {
      chunks.push(chunk);
    }
    const full = chunks.join('');
    expect(full).toContain('Strategic "What-If" Decision Simulation');
    expect(full).toContain('Option A');
    expect(full).toContain('Option B');
  });

  it('correctly handles AYUR_JYOTISH queries and computes Dosha profile', async () => {
    const prompt = synthesizeAstrologicalPrompt({
      question: 'what is my Ayurvedic Dosha and circadian bio-rhythm breakdown',
      calculationData: mockCalculationData,
      language: 'en',
    });

    expect(prompt.context.detectedTopic).toBe('AYUR_JYOTISH');
    expect(prompt.context.doshaProfile).toBeDefined();
    expect(prompt.context.doshaProfile.primaryDosha).toBeDefined();

    const llmService = new LocalLLMService({ endpoint: 'http://127.0.0.1:99999' });
    const chunks: string[] = [];
    for await (const chunk of llmService.streamResponse(prompt)) {
      chunks.push(chunk);
    }
    const full = chunks.join('');
    expect(full).toContain('Ayur-Jyotish & Circadian Bio-Rhythm Blueprint');
    expect(full).toContain('Vata');
    expect(full).toContain('Circadian Windows');
  });

  it('correctly discriminates nuanced marriage sub-intents (spouse traits, love vs arranged, obstacles)', async () => {
    const llmService = new LocalLLMService({ endpoint: 'http://127.0.0.1:99999' });

    // 1. Spouse traits query
    const traitsPrompt = synthesizeAstrologicalPrompt({
      question: 'What kind of partner or future spouse will I get?',
      calculationData: mockCalculationData,
      language: 'en',
    });
    expect(traitsPrompt.context.detectedTopic).toBe('MARRIAGE');
    expect(traitsPrompt.context.detectedSubIntent).toBe('SPOUSE_TRAITS');
    const traitsChunks: string[] = [];
    for await (const chunk of llmService.streamResponse(traitsPrompt)) {
      traitsChunks.push(chunk);
    }
    const traitsRes = traitsChunks.join('');
    expect(traitsRes).toContain('Future Spouse Profile & Personality Analysis');
    expect(traitsRes).toContain('Darakaraka');
    expect(traitsRes).toContain('Likely Profession & Background');

    // 2. Love vs arranged query
    const lovePrompt = synthesizeAstrologicalPrompt({
      question: 'Will my marriage be love or arranged?',
      calculationData: mockCalculationData,
      language: 'en',
    });
    expect(lovePrompt.context.detectedSubIntent).toBe('LOVE_VS_ARRANGED');
    const loveChunks: string[] = [];
    for await (const chunk of llmService.streamResponse(lovePrompt)) {
      loveChunks.push(chunk);
    }
    const loveRes = loveChunks.join('');
    expect(loveRes).toContain('Marriage Type Dynamics: Love vs. Arranged Assessment');

    // 3. Marriage delay / obstacles query
    const delayPrompt = synthesizeAstrologicalPrompt({
      question: 'Is there any delay or Manglik problem in my marriage?',
      calculationData: mockCalculationData,
      language: 'en',
    });
    expect(delayPrompt.context.detectedSubIntent).toBe('OBSTACLES_MANGLIK');
    const delayChunks: string[] = [];
    for await (const chunk of llmService.streamResponse(delayPrompt)) {
      delayChunks.push(chunk);
    }
    const delayRes = delayChunks.join('');
    expect(delayRes).toContain('Marriage Timing Obstacles & Manglik Assessment');

    // 4. Job vs Business query
    const jobPrompt = synthesizeAstrologicalPrompt({
      question: 'Should I do job or start my own business/startup?',
      calculationData: mockCalculationData,
      language: 'en',
    });
    expect(jobPrompt.context.detectedTopic).toBe('CAREER');
    expect(jobPrompt.context.detectedSubIntent).toBe('JOB_VS_BUSINESS');
    const jobChunks: string[] = [];
    for await (const chunk of llmService.streamResponse(jobPrompt)) {
      jobChunks.push(chunk);
    }
    const jobRes = jobChunks.join('');
    expect(jobRes).toContain('Career Direction: Job vs. Business');
  });
});
