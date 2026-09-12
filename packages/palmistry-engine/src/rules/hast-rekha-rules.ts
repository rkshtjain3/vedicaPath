import {
  DigitalRatios,
  HastRekhaRuleResult,
  PalmarLines,
  PalmarMounts,
  PalmistryObservation,
} from '../types/palmistry-types.js';

export function buildPalmistryObservations(
  digitalRatios: DigitalRatios,
  lines: PalmarLines,
  mounts: PalmarMounts
): PalmistryObservation[] {
  return [
    {
      stageId: 4,
      stageName: 'Landmarks & Ratios',
      featureKey: '2D:4D Digital Ratio',
      value: `${digitalRatios.ratio2D4D} (${digitalRatios.digitClassification})`,
      confidence: 95,
      evidence: digitalRatios.temperamentHint,
    },
    {
      stageId: 5,
      stageName: 'Primary Lines',
      featureKey: 'Life Line Arc',
      value: `Length: ${lines.lifeLine.lengthPercentage}%, Clarity: ${lines.lifeLine.clarity}`,
      confidence: 92,
      evidence: lines.lifeLine.keyObservation,
    },
    {
      stageId: 5,
      stageName: 'Primary Lines',
      featureKey: 'Head Line Curvature & Fork',
      value: `${lines.headLine.curvature} with ${lines.headLine.hasForkAtEnd ? "Writer's Fork" : 'Single Terminus'}`,
      confidence: 90,
      evidence: lines.headLine.keyObservation,
    },
    {
      stageId: 5,
      stageName: 'Primary Lines',
      featureKey: 'Heart Line Apex',
      value: `Terminates under ${lines.heartLine.endRegion}`,
      confidence: 91,
      evidence: lines.heartLine.keyObservation,
    },
    {
      stageId: 5,
      stageName: 'Primary Lines',
      featureKey: 'Fate Line Shaft',
      value: `Ascends from ${lines.fateLine.startRegion} to ${lines.fateLine.endRegion}`,
      confidence: 88,
      evidence: lines.fateLine.keyObservation,
    },
    {
      stageId: 6,
      stageName: 'Mount Prominence',
      featureKey: 'Jupiter Mount',
      value: mounts.jupiter.prominence,
      confidence: 90,
      evidence: mounts.jupiter.significance,
    },
    {
      stageId: 6,
      stageName: 'Mount Prominence',
      featureKey: 'Venus Mount',
      value: mounts.venus.prominence,
      confidence: 94,
      evidence: mounts.venus.significance,
    },
  ];
}

export function evaluateHastRekhaRules(
  digitalRatios: DigitalRatios,
  lines: PalmarLines,
  mounts: PalmarMounts
): HastRekhaRuleResult[] {
  const results: HastRekhaRuleResult[] = [];

  // Rule 1: High Vitality & Broad Life Line Arc
  if (lines.lifeLine.lengthPercentage >= 75 && mounts.venus.prominence === 'PROMINENT_WELL_DEVELOPED') {
    results.push({
      ruleId: 'HR_VITALITY_01',
      title: 'Broad Vitality Arc & Robust Shukra Mount',
      titleHi: 'दीर्घ आयु रेखा एवं सुदृढ़ शुक्र पर्वत (ओजस एवं जीवन शक्ति)',
      category: 'VITALITY',
      triggered: true,
      severity: 'HIGH_BENEFIC',
      finding: 'Deep, unbroken Life Line sweeping broadly around a well-developed Venus Mount indicates high cellular vitality, strong immune recovery, and long physical stamina.',
      findingHi: 'स्पष्ट एवं निर्बाध आयु रेखा का विशाल चाप शरीर में उच्च ओजस, प्रतिरोधक क्षमता और दीर्घ जीवन शक्ति का संकेत देता है।',
      evidenceTrace: [
        `Life Line Length: ${lines.lifeLine.lengthPercentage}% (Threshold >= 75%)`,
        `Venus Mount Score: ${mounts.venus.score}/100 (${mounts.venus.prominence})`,
      ],
    });
  }

  // Rule 2: Dual Cognitive Synthesis (Writer's Fork)
  if (lines.headLine.hasForkAtEnd && lines.headLine.lengthPercentage >= 70) {
    results.push({
      ruleId: 'HR_COGNITION_02',
      title: 'Writer’s Fork & Dual Cognitive Capacity',
      titleHi: 'द्विशाखित मस्तिष्क रेखा (व्यावहारिक एवं रचनात्मक मेधा)',
      category: 'COGNITION',
      triggered: true,
      severity: 'HIGH_BENEFIC',
      finding: 'Head Line terminating in a distinct dual fork (Writer’s Fork) combines logical mathematical precision with imaginative creative execution.',
      findingHi: 'मस्तिष्क रेखा का अंत में दो शाखाओं में विभाजित होना तार्किक विश्लेषण और रचनात्मक कल्पनाशीलता का उत्कृष्ट संतुलन प्रदर्शित करता है।',
      evidenceTrace: [
        `Head Line Length: ${lines.headLine.lengthPercentage}%`,
        `Terminal Fork: Present (Writer's Fork detected)`,
        `Curvature: ${lines.headLine.curvature}`,
      ],
    });
  }

  // Rule 3: Sovereign Career & Saturn Fate Line Alignment
  if (lines.fateLine.detected && lines.fateLine.lengthPercentage >= 60 && mounts.jupiter.prominence === 'PROMINENT_WELL_DEVELOPED') {
    results.push({
      ruleId: 'HR_DESTINY_03',
      title: 'Ascending Fate Line & Prominent Jupiter Mount',
      titleHi: 'उर्ध्वगामी भाग्य रेखा एवं प्रबुद्ध गुरु पर्वत (स्वायत्त नेतृत्व)',
      category: 'DESTINY',
      triggered: true,
      severity: 'HIGH_BENEFIC',
      finding: 'Clear vertical Fate Line ascending to Saturn combined with a prominent Jupiter Mount indicates self-built career destiny, executive authority, and domain mastery.',
      findingHi: 'शनि पर्वत की ओर अग्रसर भाग्य रेखा तथा बली गुरु पर्वत आत्मनिर्भर आजीविका, उच्च प्रतिष्ठा और नेतृत्व क्षमता प्रदान करते हैं।',
      evidenceTrace: [
        `Fate Line Length: ${lines.fateLine.lengthPercentage}%`,
        `Jupiter Mount Score: ${mounts.jupiter.score}/100 (${mounts.jupiter.prominence})`,
      ],
    });
  }

  // Rule 4: High Prenatal Androgen Balance (2D:4D Ratio)
  if (digitalRatios.ratio2D4D < 0.96) {
    results.push({
      ruleId: 'HR_RATIO_04',
      title: 'Autonomous Digital Ratio (2D:4D < 0.96)',
      titleHi: 'स्वायत्त डिजिटल अनुपात (तर्जनी-अनामिका अनुपात)',
      category: 'COGNITION',
      triggered: true,
      severity: 'MODERATE_BENEFIC',
      finding: 'Digit ratio (2D:4D = ' + digitalRatios.ratio2D4D + ') aligns with high spatial intuition, decisive risk-taking, and preference for independent craft.',
      findingHi: 'तर्जनी एवं अनामिका का यह अनुपात उच्च स्थानिक मेधा, स्वतंत्र निर्णय क्षमता और रणनीतिक साहस का सूचक है।',
      evidenceTrace: [
        `Index Finger Length: ${digitalRatios.indexLength}`,
        `Ring Finger Length: ${digitalRatios.ringLength}`,
        `2D:4D Ratio: ${digitalRatios.ratio2D4D} (< 0.96)`,
      ],
    });
  }

  return results;
}
