import {
  ELEMENT_CONTROLLING_CYCLE,
  ELEMENT_GENERATING_CYCLE,
} from '../constants/ganzhi-constants.js';
import {
  FourPillars,
  HeavenlyStemDetails,
  TenGodCount,
} from '../types/bazi-types.js';

export interface TenGodDefinition {
  name: string;
  chinese: string;
  pinyin: string;
  category: 'SELF' | 'OUTPUT' | 'WEALTH' | 'OFFICER' | 'RESOURCE';
  description: string;
  descriptionHi: string;
}

export function classifyTenGod(
  dayMaster: HeavenlyStemDetails,
  targetStem: HeavenlyStemDetails
): TenGodDefinition {
  const samePolarity = dayMaster.polarity === targetStem.polarity;
  const dmElem = dayMaster.element;
  const targetElem = targetStem.element;

  // 1. Same Element (Self / Peers)
  if (dmElem === targetElem) {
    if (samePolarity) {
      return {
        name: 'Friend',
        chinese: '比肩',
        pinyin: 'Bǐ Jiān',
        category: 'SELF',
        description: 'Self, peers, colleagues, independent drive, equal partnerships.',
        descriptionHi: 'आत्म, समकक्ष, स्वतंत्र कार्यक्षमता एवं समान सहयोग।',
      };
    } else {
      return {
        name: 'Rob Wealth',
        chinese: '劫财',
        pinyin: 'Jié Cái',
        category: 'SELF',
        description: 'Competitive peers, charisma, risk-taking, sharing of resources.',
        descriptionHi: 'प्रतिस्पर्धा, करिश्मा, जोखिम क्षमता एवं संपत्ति विभाजन।',
      };
    }
  }

  // 2. DM Produces Target (Output / Expression)
  if (ELEMENT_GENERATING_CYCLE[dmElem] === targetElem) {
    if (samePolarity) {
      return {
        name: 'Eating God',
        chinese: '食神',
        pinyin: 'Shí Shén',
        category: 'OUTPUT',
        description: 'Creative mastery, enjoyment, refined expression, peaceful output.',
        descriptionHi: 'रचनात्मकता, आनंद, सहज अभिव्यक्ति एवं बौद्धिक शांति।',
      };
    } else {
      return {
        name: 'Hurting Officer',
        chinese: '伤官',
        pinyin: 'Shāng Guān',
        category: 'OUTPUT',
        description: 'Bold innovation, ambition, unconventional brilliance, challenging rules.',
        descriptionHi: 'बोल्ड नवाचार, उच्च महत्वाकांक्षा, अपरंपरागत प्रतिभा।',
      };
    }
  }

  // 3. DM Controls Target (Wealth)
  if (ELEMENT_CONTROLLING_CYCLE[dmElem] === targetElem) {
    if (samePolarity) {
      return {
        name: 'Indirect Wealth',
        chinese: '偏财',
        pinyin: 'Piān Cái',
        category: 'WEALTH',
        description: 'Speculative wealth, business ventures, windfalls, entrepreneurial income.',
        descriptionHi: 'व्यापारिक लाभ, आकस्मिक धन, उद्यमिता एवं सट्टेबाज़ी आय।',
      };
    } else {
      return {
        name: 'Direct Wealth',
        chinese: '正财',
        pinyin: 'Zhèng Cái',
        category: 'WEALTH',
        description: 'Stable salary, hard-earned wealth, tangible assets, financial discipline.',
        descriptionHi: 'स्थायी वेतन, परिश्रम से अर्जित संपत्ति एवं वित्तीय अनुशासन।',
      };
    }
  }

  // 4. Target Controls DM (Officer / Power / Pressure)
  if (ELEMENT_CONTROLLING_CYCLE[targetElem] === dmElem) {
    if (samePolarity) {
      return {
        name: 'Seven Killings',
        chinese: '七杀',
        pinyin: 'Qī Shā',
        category: 'OFFICER',
        description: 'Commanding power, intense pressure, strict discipline, leadership under fire.',
        descriptionHi: 'कमांडिंग अधिकार, तीव्र दबाव, सख्त अनुशासन एवं कड़ा नेतृत्व।',
      };
    } else {
      return {
        name: 'Direct Officer',
        chinese: '正官',
        pinyin: 'Zhèng Guān',
        category: 'OFFICER',
        description: 'Lawful authority, executive status, societal respect, diplomatic governance.',
        descriptionHi: 'वैधानिक अधिकार, प्रशासनिक पद, सामाजिक सम्मान एवं कूटनीति।',
      };
    }
  }

  // 5. Target Produces DM (Resource / Support)
  if (ELEMENT_GENERATING_CYCLE[targetElem] === dmElem) {
    if (samePolarity) {
      return {
        name: 'Indirect Resource',
        chinese: '偏印',
        pinyin: 'Piān Yìn',
        category: 'RESOURCE',
        description: 'Unconventional wisdom, research, intuition, esoteric knowledge, mentors.',
        descriptionHi: 'अपरंपरागत ज्ञान, अनुसंधान, अंतर्ज्ञान एवं गूढ़ विद्या।',
      };
    } else {
      return {
        name: 'Direct Resource',
        chinese: '正印',
        pinyin: 'Zhèng Yìn',
        category: 'RESOURCE',
        description: 'Academic education, maternal care, reputational support, wisdom.',
        descriptionHi: 'शैक्षणिक शिक्षा, मातृ स्नेह, प्रतिष्ठित समर्थन एवं ज्ञान।',
      };
    }
  }

  // Default fallback
  return {
    name: 'Friend',
    chinese: '比肩',
    pinyin: 'Bǐ Jiān',
    category: 'SELF',
    description: 'Self element.',
    descriptionHi: 'स्वयं तत्व।',
  };
}

/**
 * Assigns Ten Gods to all visible and hidden stems across the 4 pillars relative to the Day Master.
 */
export function populateTenGods(fourPillars: FourPillars): TenGodCount[] {
  const dayMaster = fourPillars.day.stem;

  const pillarsList = [
    fourPillars.year,
    fourPillars.month,
    fourPillars.day,
    fourPillars.hour,
  ];

  // Map Ten Gods to each visible stem
  for (const p of pillarsList) {
    if (p === fourPillars.day) {
      p.tenGodStem = 'Day Master (日主)';
    } else {
      const god = classifyTenGod(dayMaster, p.stem);
      p.tenGodStem = `${god.name} (${god.chinese})`;
    }

    // Populate hidden stems Ten Gods
    for (const hs of p.hiddenStems) {
      const god = classifyTenGod(dayMaster, hs.stem);
      hs.tenGod = `${god.name} (${god.chinese})`;
    }
  }

  // Aggregate Ten Gods counts across visible and hidden stems
  const godMap = new Map<string, TenGodCount>();

  const allStems: { stem: HeavenlyStemDetails; isVisible: boolean }[] = [];

  // Visible stems (excluding Day Master for Ten God counts)
  allStems.push({ stem: fourPillars.year.stem, isVisible: true });
  allStems.push({ stem: fourPillars.month.stem, isVisible: true });
  allStems.push({ stem: fourPillars.hour.stem, isVisible: true });

  // Hidden stems
  for (const p of pillarsList) {
    for (const hs of p.hiddenStems) {
      allStems.push({ stem: hs.stem, isVisible: false });
    }
  }

  for (const item of allStems) {
    const god = classifyTenGod(dayMaster, item.stem);
    const existing = godMap.get(god.name);
    if (existing) {
      if (item.isVisible) existing.visibleCount += 1;
      else existing.hiddenCount += 1;
    } else {
      godMap.set(god.name, {
        godName: god.name,
        chineseName: god.chinese,
        pinyin: god.pinyin,
        category: god.category,
        visibleCount: item.isVisible ? 1 : 0,
        hiddenCount: item.isVisible ? 0 : 1,
        description: god.description,
      });
    }
  }

  return Array.from(godMap.values());
}
