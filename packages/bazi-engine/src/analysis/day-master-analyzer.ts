import {
  DayMasterDetails,
  FiveElement,
  FiveElementCount,
  FourPillars,
} from '../types/bazi-types.js';

export function analyzeDayMasterAndElements(fourPillars: FourPillars): {
  dayMaster: DayMasterDetails;
  fiveElements: FiveElementCount[];
} {
  const dmStem = fourPillars.day.stem;
  const monthBranch = fourPillars.month.branch;

  // Determine Seasonal Status based on Month Branch
  const seasonElement = monthBranch.element;
  const dmElement = dmStem.element;

  let seasonalStatus: DayMasterDetails['seasonalStatus'] = 'WEAKENING';
  let seasonalDescription = '';
  let seasonalDescriptionHi = '';

  if (dmElement === seasonElement) {
    seasonalStatus = 'IN_SEASON';
    seasonalDescription = `Day Master (${dmStem.name} ${dmElement}) is born In Season (旺 Wang) in ${monthBranch.name} (${monthBranch.zodiacAnimal}) month. Peak elemental strength.`;
    seasonalDescriptionHi = `दिन का स्वामी (${dmStem.name} ${dmElement}) ${monthBranch.name} माह में ऋतु-अनुकूल (旺旺 Wang) उत्पन्न हुआ है। सर्वोच्च ऊर्जा का प्रतीक।`;
  } else if (
    (seasonElement === 'Wood' && dmElement === 'Fire') ||
    (seasonElement === 'Fire' && dmElement === 'Earth') ||
    (seasonElement === 'Earth' && dmElement === 'Metal') ||
    (seasonElement === 'Metal' && dmElement === 'Water') ||
    (seasonElement === 'Water' && dmElement === 'Wood')
  ) {
    seasonalStatus = 'PROSPEROUS';
    seasonalDescription = `Day Master (${dmStem.name} ${dmElement}) is Flourishing (相 Xiang) as Month Season (${seasonElement}) produces Day Master element. High strength.`;
    seasonalDescriptionHi = `माह की ऋतु (${seasonElement}) दिन के स्वामी तत्व को जन्म देती है (相 Xiang)। उच्च ऊर्जा एवं समर्थन।`;
  } else if (
    (dmElement === 'Wood' && seasonElement === 'Fire') ||
    (dmElement === 'Fire' && seasonElement === 'Earth') ||
    (dmElement === 'Earth' && seasonElement === 'Metal') ||
    (dmElement === 'Metal' && seasonElement === 'Water') ||
    (dmElement === 'Water' && seasonElement === 'Wood')
  ) {
    seasonalStatus = 'WEAKENING';
    seasonalDescription = `Day Master (${dmStem.name} ${dmElement}) is Resting/Exhausting (休 Xiu) as Day Master produces the Month Season. Moderate strength.`;
    seasonalDescriptionHi = `दिन का स्वामी माह की ऋतु को ऊर्जा प्रदान करके विश्राम अवस्था में है (休 Xiu)। मध्यम ऊर्जा।`;
  } else if (
    (seasonElement === 'Wood' && dmElement === 'Earth') ||
    (seasonElement === 'Fire' && dmElement === 'Metal') ||
    (seasonElement === 'Earth' && dmElement === 'Water') ||
    (seasonElement === 'Metal' && dmElement === 'Wood') ||
    (seasonElement === 'Water' && dmElement === 'Fire')
  ) {
    seasonalStatus = 'TRAPPED';
    seasonalDescription = `Day Master (${dmStem.name} ${dmElement}) is Trapped (囚 Qiu) as Month Season controls Day Master element. Vulnerable strength.`;
    seasonalDescriptionHi = `माह की ऋतु दिन के स्वामी तत्व को नियंत्रित करती है (囚 Qiu)। दबाव एवं सीमित स्थिति।`;
  } else {
    seasonalStatus = 'DEAD';
    seasonalDescription = `Day Master (${dmStem.name} ${dmElement}) is Dead/Exhausted (死 Si) in ${monthBranch.name} month. Requires strong Resource/Peer support.`;
    seasonalDescriptionHi = `दिन का स्वामी (${dmStem.name}) ${monthBranch.name} माह में न्यूनतम स्थिति में है (死 Si)। समर्थन की आवश्यकता।`;
  }

  // Calculate Five Element Balance (Visible counts & Hidden stem weights)
  const elements: FiveElement[] = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const visibleMap: Record<FiveElement, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const hiddenWeightMap: Record<FiveElement, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

  const pillarsList = [
    fourPillars.year,
    fourPillars.month,
    fourPillars.day,
    fourPillars.hour,
  ];

  for (const p of pillarsList) {
    visibleMap[p.stem.element] += 1;
    for (const hs of p.hiddenStems) {
      hiddenWeightMap[hs.stem.element] += hs.percentageWeight;
    }
  }

  const fiveElements: FiveElementCount[] = elements.map((elem) => {
    const vis = visibleMap[elem];
    const weight = hiddenWeightMap[elem];
    let status: FiveElementCount['status'] = 'BALANCED';

    if (vis >= 3 || weight >= 150) status = 'DOMINANT';
    else if (vis >= 2 || weight >= 90) status = 'STRONG';
    else if (weight >= 40) status = 'BALANCED';
    else if (weight > 0) status = 'WEAK';
    else status = 'DEFICIENT';

    return {
      element: elem,
      visibleCount: vis,
      hiddenWeightPercentage: weight,
      status,
    };
  });

  // Calculate overall Day Master strength score (0 to 100)
  let score = 30; // base score
  if (seasonalStatus === 'IN_SEASON') score += 40;
  else if (seasonalStatus === 'PROSPEROUS') score += 30;
  else if (seasonalStatus === 'WEAKENING') score += 10;
  else if (seasonalStatus === 'TRAPPED') score -= 10;
  else if (seasonalStatus === 'DEAD') score -= 20;

  // Add support from same element (Peers) and Resource elements
  const sameElemInfo = fiveElements.find((e) => e.element === dmElement);
  if (sameElemInfo) score += sameElemInfo.hiddenWeightPercentage * 0.15;

  score = Math.max(5, Math.min(95, Math.round(score)));

  let classification: DayMasterDetails['strengthClassification'] = 'BALANCED';
  if (score >= 80) classification = 'EXTREMELY_STRONG';
  else if (score >= 60) classification = 'STRONG';
  else if (score >= 40) classification = 'BALANCED';
  else if (score >= 25) classification = 'WEAK';
  else classification = 'EXTREMELY_WEAK';

  const reasoning = `Day Master ${dmStem.name} (${dmStem.element}) is ${seasonalStatus} in ${monthBranch.name} month. Overall strength score: ${score}/100 (${classification}).`;
  const reasoningHi = `दिन का स्वामी ${dmStem.name} (${dmStem.element}) ${monthBranch.name} माह में ${seasonalStatus} अवस्था में है। कुल ऊर्जा अंक: ${score}/100 (${classification})।`;

  const dayMaster: DayMasterDetails = {
    stem: dmStem,
    monthBranch,
    seasonalStatus,
    seasonalDescription,
    seasonalDescriptionHi,
    strengthScore: score,
    strengthClassification: classification,
    reasoning,
    reasoningHi,
  };

  return {
    dayMaster,
    fiveElements,
  };
}
