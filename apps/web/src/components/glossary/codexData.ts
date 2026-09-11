export interface CodexEntry {
  id: string;
  term: string;
  sanskrit: string;
  category: 'HOUSES_ARCH' | 'TIMING_DASHA' | 'STRENGTH_BALA' | 'YOGAS_DOSHAS' | 'DIVISIONAL' | 'PHILOSOPHY';
  plainEnglish: string;
  summary: string;
  practicalMeaning: string;
  mythVsReality?: {
    myth: string;
    reality: string;
  };
  empowermentAction: string;
  relatedTerms?: string[];
}

export const CODEX_CATEGORIES = [
  { id: 'ALL', label: 'All Terms', icon: 'Sparkles' },
  { id: 'PHILOSOPHY', label: 'Karma & Free Will', icon: 'Compass' },
  { id: 'HOUSES_ARCH', label: 'Houses & Architecture', icon: 'Layers' },
  { id: 'TIMING_DASHA', label: 'Timing & Dashas', icon: 'Clock' },
  { id: 'STRENGTH_BALA', label: 'Planetary Strengths', icon: 'Shield' },
  { id: 'YOGAS_DOSHAS', label: 'Yogas & Doshas Debunked', icon: 'CheckCircle' },
  { id: 'DIVISIONAL', label: 'Divisional Charts (Vargas)', icon: 'Table' },
] as const;

export const CODEX_ENTRIES: CodexEntry[] = [
  {
    id: 'lagna',
    term: 'Lagna (Ascendant)',
    sanskrit: 'लग्न',
    category: 'HOUSES_ARCH',
    plainEnglish: 'The Rising Sign & Life Operating System',
    summary: 'The exact zodiac sign rising on the eastern horizon at your birth minute. Defines your primary lens of consciousness and physical vitality.',
    practicalMeaning: 'While Western astrology focuses on the Sun sign, Vedic astrology places Lagna at the center. It determines how you perceive the world, your natural instincts, stamina, and foundational life trajectory.',
    mythVsReality: {
      myth: 'Your Sun sign alone dictates your fate and compatibility.',
      reality: 'Lagna is 10x more personalized than Sun sign. The Sun stays in a sign for 30 days, but Lagna changes every 2 hours, giving your birth chart its unique architecture.'
    },
    empowermentAction: 'Harmonize with your Lagna lord (the planet governing your rising sign) through disciplined daily physical habits.',
    relatedTerms: ['Bhavas', 'Kendra', 'Trikona']
  },
  {
    id: 'kendra',
    term: 'Kendra Houses (1, 4, 7, 10)',
    sanskrit: 'केन्द्र',
    category: 'HOUSES_ARCH',
    plainEnglish: 'The Four Pillars of Life',
    summary: 'The cardinal houses representing Self (1st), Inner Peace & Home (4th), Partnership (7th), and Public Action/Career (10th).',
    practicalMeaning: 'Like four pillars holding up a temple, planets placed in Kendra houses possess immense strength to manifest tangible results in the physical world. When benefic planets inhabit Kendras, life possesses strong stability.',
    mythVsReality: {
      myth: 'Empty Kendra houses mean you will have no stability or success.',
      reality: 'Empty houses are simply governed by their lords from other houses. Many historical leaders have empty Kendras whose lords create powerful yogas elsewhere.'
    },
    empowermentAction: 'Focus on balancing work (10th) with home sanctuary (4th) and self-care (1st) with relationships (7th).',
    relatedTerms: ['Trikona', 'Dusthana', 'Lagna']
  },
  {
    id: 'trikona',
    term: 'Trikona Houses (1, 5, 9)',
    sanskrit: 'त्रिकोण',
    category: 'HOUSES_ARCH',
    plainEnglish: 'The Trines of Dharma & Creative Grace',
    summary: 'The houses of purpose, intellectual creativity, and good fortune. Form the equilateral spiritual triangle of the chart.',
    practicalMeaning: 'Trikona houses (1st = Self, 5th = Intellect & Past Merit, 9th = Higher Wisdom & Ethics) bring natural flow, intuitive intelligence, and ethical alignment. They represent the grace that comes from righteous living.',
    mythVsReality: {
      myth: 'Strong Trikona houses mean you never have to work hard.',
      reality: 'Trikona gives opportunities, ethical clarity, and rapid learning, but without action (Kendra/Upachaya), potential remains unexpressed.'
    },
    empowermentAction: 'Invest daily in lifelong learning, creative problem solving, and mentorship to activate 5th and 9th house grace.',
    relatedTerms: ['Kendra', 'Purushartha', 'Dharma']
  },
  {
    id: 'dusthana',
    term: 'Dusthana Houses (6, 8, 12)',
    sanskrit: 'दुस्थान',
    category: 'HOUSES_ARCH',
    plainEnglish: 'Houses of Transformation Through Challenge',
    summary: 'Houses dealing with obstacles & service (6th), deep psychology & longevity (8th), and letting go & spiritual liberation (12th).',
    practicalMeaning: 'Priests often label these as "evil houses". In classical Vedic science, they are the gymnasiums of the soul. Without the 6th, you have no resilience or work ethic; without the 8th, you lack depth and crisis management; without the 12th, you cannot sleep, detach, or find peace.',
    mythVsReality: {
      myth: 'Planets in the 6th, 8th, or 12th house curse your life with ruin.',
      reality: 'Many top surgeons, lawyers, spiritual leaders, and researchers have their key planets in Dusthanas. They excel precisely because they solve tough problems.'
    },
    empowermentAction: 'Channel 6th house energy into fitness/service, 8th house into investigative research/mindfulness, and 12th into restful sleep and meditation.',
    relatedTerms: ['Upachaya', 'Viparita Raja Yoga']
  },
  {
    id: 'upachaya',
    term: 'Upachaya Houses (3, 6, 10, 11)',
    sanskrit: 'उपचय',
    category: 'HOUSES_ARCH',
    plainEnglish: 'Houses of Compounding Growth',
    summary: 'The houses that naturally improve and yield greater results over time through human effort, self-discipline, and persistence.',
    practicalMeaning: 'Planets placed in Upachaya houses (3rd = initiative, 6th = problem-solving, 10th = mastery, 11th = gains & network) blossom with age. Even malefics like Saturn or Mars perform exceptionally well here because raw grit converts into compounding success.',
    mythVsReality: {
      myth: 'Your destiny is fixed at birth.',
      reality: 'Upachaya houses are the definitive Vedic proof of free will. They explicitly prove that hard work, self-correction, and grit multiply your starting position.'
    },
    empowermentAction: 'Treat early setbacks as compounding interest. Consistency in Upachaya domains guarantees maturity and success in your 30s, 40s, and beyond.',
    relatedTerms: ['Purushartha', 'Kendra']
  },
  {
    id: 'vimshottari-dasha',
    term: 'Vimshottari Dasha System',
    sanskrit: 'विंशोत्तरी दशा',
    category: 'TIMING_DASHA',
    plainEnglish: 'The 120-Year Cosmic Developmental Clock',
    summary: 'A mathematical timing system mapping human life into 120 years across 9 planetary cycles, starting from the Moon’s exact birth Nakshatra.',
    practicalMeaning: 'Just as nature has winter, spring, summer, and autumn, your psyche moves through distinct planetary developmental seasons. A Dasha does not cause events; it sets the internal focus and environmental resonance for that period.',
    mythVsReality: {
      myth: 'A bad dasha means guaranteed disaster and misery.',
      reality: 'No dasha is universally bad. A Saturn dasha builds long-term endurance; a Rahu dasha breaks old paradigms; a Jupiter dasha expands wisdom. Every season has a constructive purpose.'
    },
    empowermentAction: 'Align your career and lifestyle choices with your active season instead of fighting against its natural current.',
    relatedTerms: ['Mahadasha', 'Antardasha', 'Gochar']
  },
  {
    id: 'mahadasha',
    term: 'Mahadasha',
    sanskrit: 'महादशा',
    category: 'TIMING_DASHA',
    plainEnglish: 'The Major Life Chapter',
    summary: 'The primary planetary cycle spanning between 6 and 20 years, governing your macro life direction and dominant psychological theme.',
    practicalMeaning: 'The Mahadasha lord sets the agenda. For example, during a 16-year Jupiter Mahadasha, themes of higher education, teaching, financial expansion, and family flourish. During an 18-year Rahu chapter, themes of technology, ambition, and boundary-pushing dominate.',
    empowermentAction: 'Understand the core lessons of your current Mahadasha lord to make high-conviction multi-year strategic plans.',
    relatedTerms: ['Vimshottari Dasha', 'Antardasha']
  },
  {
    id: 'antardasha',
    term: 'Antardasha (Bhukti)',
    sanskrit: 'अन्तर्दशा / भुक्ति',
    category: 'TIMING_DASHA',
    plainEnglish: 'The Active Sub-Season',
    summary: 'The secondary planetary period (lasting several months to ~3 years) that colors and activates the themes of the overarching Mahadasha.',
    practicalMeaning: 'While the Mahadasha lord provides the canvas, the Antardasha lord holds the paintbrush. If you are in Rahu-Jupiter, the boundless drive of Rahu is tempered and guided by the wisdom of Jupiter.',
    empowermentAction: 'Review your 1 to 2 year goals based on your active Antardasha lord to maximize timing efficiency.',
    relatedTerms: ['Mahadasha', 'Pratyantardasha']
  },
  {
    id: 'gochar',
    term: 'Gochar (Transits)',
    sanskrit: 'गोचर',
    category: 'TIMING_DASHA',
    plainEnglish: 'Real-Time Planetary Weather',
    summary: 'The live, day-to-day positions of the planets in the sky right now as they interact with your static birth chart.',
    practicalMeaning: 'If your Dasha is the climate of your life (e.g. tropical climate), Gochar is the daily weather (e.g. an afternoon rain shower). A heavy transit during a strong dasha is easily weathered, like rain falling on a sturdy roof.',
    mythVsReality: {
      myth: 'A transit alone can destroy or elevate your life overnight.',
      reality: 'Classical authority (Parashara) mandates: Dasha is the foundation (70-80% impact). Transits merely act as triggers or modifiers (20-30% impact).'
    },
    empowermentAction: 'Use transits like a weather forecast: carry an umbrella during stormy transits; launch bold initiatives during sunny transits.',
    relatedTerms: ['Sade Sati', 'Ashtakavarga', 'Vimshottari Dasha']
  },
  {
    id: 'sade-sati',
    term: 'Sade Sati (Saturn Transit)',
    sanskrit: 'साढ़े साती',
    category: 'TIMING_DASHA',
    plainEnglish: 'The 7.5-Year Emotional & Foundation Reality Check',
    summary: 'The period when transiting Saturn passes through the 12th, 1st, and 2nd houses relative to your natal Moon sign.',
    practicalMeaning: 'Occurring roughly every 29.5 years, Sade Sati is widely exploited by superstitious astrologers to instill panic. In reality, it is nature’s great maturity cycle. It strips away superficial illusions, teaches emotional resilience, strengthens realistic work habits, and creates authentic humility.',
    mythVsReality: {
      myth: 'Sade Sati will bring death, ruin, financial bankruptcy, or constant suffering.',
      reality: 'Most people experience their greatest career promotions, marriage, home acquisitions, and life milestones during Sade Sati because Saturn rewards serious discipline and genuine effort.'
    },
    empowermentAction: 'Embrace radical self-honesty, simplify your commitments, maintain punctual sleep rhythms, and cut out wasteful distractions.',
    relatedTerms: ['Gochar', 'Saturn', 'Ashtakavarga']
  },
  {
    id: 'shadbala',
    term: 'Shadbala (6-Fold Strength)',
    sanskrit: 'षड्बल',
    category: 'STRENGTH_BALA',
    plainEnglish: 'The 6-Dimensional Planetary Strength Matrix',
    summary: 'A rigorous mathematical system calculating planetary strength across six criteria: Positional, Directional, Motional, Temporal, Motional, and Aspectual.',
    practicalMeaning: 'A planet is not simply "good" or "bad". Shadbala mathematically measures its actual capacity to deliver results. A planet with high Shadbala (> 1.0 Rupas) possesses the stamina and vitality to bring its promise into reality.',
    mythVsReality: {
      myth: 'A debilitated planet is completely powerless and useless.',
      reality: 'A debilitated planet with high Shadbala (due to directional or temporal strength) is exceptionally capable, often producing resilient leaders who overcome early underdog status.'
    },
    empowermentAction: 'Check which planets have the highest Shadbala in your chart to identify your most reliable innate cognitive strengths.',
    relatedTerms: ['Ashtakavarga', 'Digbala']
  },
  {
    id: 'ashtakavarga',
    term: 'Ashtakavarga & SAV Points',
    sanskrit: 'अष्टकवर्ग',
    category: 'STRENGTH_BALA',
    plainEnglish: 'Collective Planetary Energy Scorecard',
    summary: 'An objective mathematical matrix tallying benefic bindus (points) contributed by all 7 planets plus the Ascendant for each zodiac sign.',
    practicalMeaning: 'Samudaya Ashtakavarga (SAV) gives each house a score out of 56. The benchmark average is 28 points. Houses with > 28 points experience smooth, effortless energy flow. Houses with < 28 points simply require conscious awareness, structure, and extra preparation.',
    mythVsReality: {
      myth: 'Low SAV points mean you are cursed in that house.',
      reality: 'Low SAV points indicate concentrated, high-friction areas that build mastery. Many self-made billionaires have lower scores in wealth houses that forced them to develop rigorous financial intelligence.'
    },
    empowermentAction: 'Schedule demanding endeavors when transiting planets pass through signs with 30+ SAV points.',
    relatedTerms: ['Gochar', 'Shadbala']
  },
  {
    id: 'raja-yoga',
    term: 'Raja Yoga',
    sanskrit: 'राजयोग',
    category: 'YOGAS_DOSHAS',
    plainEnglish: 'Combinations of Leadership & High Impact',
    summary: 'A planetary union or mutual aspect between the lord of a Kendra (action/structure) and a Trikona (grace/dharma).',
    practicalMeaning: 'Raja means "royal" or "sovereign". When your moral purpose (Trikona) aligns with your executive capacity to execute (Kendra), you naturally gain the trust of peers and achieve positions of responsibility and positive influence.',
    mythVsReality: {
      myth: 'Having a Raja Yoga guarantees you will become a king or celebrity without working.',
      reality: 'Raja Yogas operate like seeds. They provide the soil and fertility for leadership, but you must still develop communication, competence, and work ethic.'
    },
    empowermentAction: 'Step forward to lead projects where purpose and practical execution meet.',
    relatedTerms: ['Dhana Yoga', 'Kendra', 'Trikona']
  },
  {
    id: 'dhana-yoga',
    term: 'Dhana Yoga',
    sanskrit: 'धनयोग',
    category: 'YOGAS_DOSHAS',
    plainEnglish: 'Combinations of Sustainable Abundance',
    summary: 'Benefic relationships between wealth-generating houses (2nd = savings/assets, 11th = cash flow/gains) and purpose houses (1st, 5th, 9th).',
    practicalMeaning: 'Indicates the natural capacity to generate and preserve financial and intellectual resources. It signifies that your work creates genuine value that the marketplace rewards.',
    mythVsReality: {
      myth: 'Dhana Yoga means instant lottery wins or unearned riches.',
      reality: 'True Vedic wealth is sustainable abundance built on ethical value creation, smart reinvestment, and sound wealth preservation.'
    },
    empowermentAction: 'Build disciplined automated savings habits and invest in assets that produce long-term compounding utility.',
    relatedTerms: ['Raja Yoga', 'Upachaya']
  },
  {
    id: 'manglik-dosha',
    term: 'Manglik (Kuja Dosha) Debunked',
    sanskrit: 'माङ्गलिक / कुज दोष',
    category: 'YOGAS_DOSHAS',
    plainEnglish: 'High Mars Energy & Passionate Drive',
    summary: 'Occurs when Mars resides in houses 1, 4, 7, 8, or 12 relative to the Ascendant or Moon.',
    practicalMeaning: 'Mars represents physical energy, assertiveness, initiative, and passionate boundaries. In conservative feudal eras, independent and assertive individuals (especially women) were considered disruptive to submissive domestic structures. Astrologers weaponized "Manglik" to force compliance and expensive "remedies".',
    mythVsReality: {
      myth: 'A Manglik person will cause the death of their spouse or an inevitable divorce.',
      reality: 'Statistically, over 50% of the entire human population has Mars in one of these houses! Mars gives courage, ambition, athleticism, and directness. In modern equal partnerships, it is a tremendous asset for getting things done.'
    },
    empowermentAction: 'Channel intense physical energy into regular strenuous exercise, constructive sports, and direct, compassionate communication in relationships.',
    relatedTerms: ['Mars', 'Yogas']
  },
  {
    id: 'kaal-sarp-dosha',
    term: 'Kaal Sarp Yoga Debunked',
    sanskrit: 'काल सर्प योग',
    category: 'YOGAS_DOSHAS',
    plainEnglish: 'The Evolutionary Nodal Axis',
    summary: 'Occurs when all seven traditional planets are hemmed on one side of the lunar nodes (Rahu and Ketu).',
    practicalMeaning: 'Kaal Sarp does not appear in classical foundational treatises like Parashara’s Brihat Parashara Hora Shastra. It was popularized in modern centuries to sell expensive pilgrimage rituals. In authentic Jyotish, having planets clustered between Rahu and Ketu indicates intense focus on specific life arenas.',
    mythVsReality: {
      myth: 'A fatalistic curse that ruins your life until age 42, requiring expensive snake poojas.',
      reality: 'Many of the greatest historical leaders, inventors, and artists have this placement. It concentrates energy like a laser beam, fueling extraordinary achievements when directed purposefully.'
    },
    empowermentAction: 'Harness your deep focus. Avoid all fear-mongering rituals; channel your obsession into creative, societal, or scientific breakthroughs.',
    relatedTerms: ['Rahu', 'Ketu', 'Vimshottari Dasha']
  },
  {
    id: 'navamsha-d9',
    term: 'Navamsha Chart (D9)',
    sanskrit: 'नवांश (D9)',
    category: 'DIVISIONAL',
    plainEnglish: 'The Soul’s Harmonic & Second-Half-of-Life Map',
    summary: 'The 9th harmonic divisional chart, dividing each sign into nine 3°20’ segments (identical to one Nakshatra Pada).',
    practicalMeaning: 'If the primary birth chart (D1) is the tree, Navamsha (D9) is the fruit. It reveals the true inner dignity of planets after age 30-36, marital partnership dynamics, and your innate spiritual orientation (Dharma).',
    mythVsReality: {
      myth: 'D9 is only used for marriage compatibility.',
      reality: 'D9 is the universal confirmation chart for every life domain. A planet weak in D1 but strong in D9 (Vargottama) gains immense strength in the second half of life.'
    },
    empowermentAction: 'Cultivate the qualities of your D9 Ascendant and D9 strong planets as you mature to find profound fulfillment.',
    relatedTerms: ['Dashamsha (D10)', 'Varga', 'Dharma']
  },
  {
    id: 'dashamsha-d10',
    term: 'Dashamsha Chart (D10)',
    sanskrit: 'दशांश (D10)',
    category: 'DIVISIONAL',
    plainEnglish: 'The Vocational Impact & Career Matrix',
    summary: 'The 10th harmonic divisional chart, magnifying the 10th house of career, public status, authority, and professional legacy.',
    practicalMeaning: 'D10 reveals your professional calling, how you interact with leadership, and where your greatest vocational impact lies. It highlights the difference between a job (done for income) and a vocation (done for societal contribution).',
    mythVsReality: {
      myth: 'You are destined for only one specific rigid career title.',
      reality: 'D10 shows vocational archetypes (e.g. strategic leadership, technological innovation, healing, advisory) which can be expressed in dozens of modern career paths.'
    },
    empowermentAction: 'Identify the strongest planetary archetype in your D10 to guide your next career pivot or executive focus.',
    relatedTerms: ['Navamsha (D9)', 'Kendra', 'Upachaya']
  },
  {
    id: 'karma-free-will',
    term: 'Karma vs. Free Will (Purushartha)',
    sanskrit: 'प्रारब्ध vs पुरुषार्थ',
    category: 'PHILOSOPHY',
    plainEnglish: 'The Science of Free Will & Conscious Effort',
    summary: 'The foundational Vedic doctrine balancing predetermined starting conditions (Prarabdha) with active free will and self-effort (Purushartha).',
    practicalMeaning: 'Vedic astrology is NOT fatalistic. The birth chart is like the hand of cards you are dealt (Prarabdha Karma: your DNA, birth family, innate talents). But how you play those cards is 100% Free Will (Kriyamana Karma / Purushartha). Classical texts declare that conscious effort can overcome, neutralize, or transcend difficult chart positions.',
    mythVsReality: {
      myth: 'Astrology proves everything is predestined, so effort is futile.',
      reality: 'The Brihat Parashara Hora Shastra and Sage Vasishtha in Yoga Vasishtha state: "There is no power in the world greater than right human effort (Purushartha). Past karma is like a weak horse, and present effort is like a strong horse; the strong horse always wins."'
    },
    empowermentAction: 'Never surrender your agency to a chart. Use astrology as a weather map, not a prison cell.',
    relatedTerms: ['Purushartha', 'Sattvic Remedies']
  },
  {
    id: 'sattvic-remedies',
    term: 'Authentic Sattvic Remedies vs Superstition',
    sanskrit: 'सात्त्विक उपाय',
    category: 'PHILOSOPHY',
    plainEnglish: 'Lifestyle Alignment vs Paid Fear Rituals',
    summary: 'The authentic, non-superstitious remedies taught by classical sages: circadian rhythm, selfless service, breathwork, and ethical living.',
    practicalMeaning: 'Greedy charlatans sell $2,000 gemstones, fear-based poojas, and magic rings. Authentic Vedic remedial measures (Upayas) cost nothing and require personal growth: (1) Sun alignment through morning light and Surya Namaskar; (2) Moon balance through pranayama and emotional hygiene; (3) Saturn alignment through honest hard work and helping the underprivileged (Seva); (4) Jupiter alignment through study and ethics.',
    mythVsReality: {
      myth: 'Buying a gemstone or paying a priest to chant mantras will magically erase your challenges.',
      reality: 'No gemstone or ritual replaces self-discipline, therapy, physical exercise, and ethical choices. Planetary remedies work by cultivating internal neurochemical balance and virtuous character.'
    },
    empowermentAction: 'Adopt the 4 Authentic Sattvic Daily Pillars: Early sun exposure, 10 min pranayama, voluntary weekly Seva, and truthful speech.',
    relatedTerms: ['Karma vs Free Will', 'Purushartha']
  }
];

export function getCodexEntry(id: string): CodexEntry | undefined {
  const norm = id.toLowerCase().trim();
  return CODEX_ENTRIES.find((e) => e.id.toLowerCase() === norm || e.term.toLowerCase().includes(norm));
}
