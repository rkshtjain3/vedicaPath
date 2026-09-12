import { BirthChart, PlanetName } from '@vedica/astrology-core';
import {
  ArudhaPada,
  CharaKarakaInfo,
  JaiminiYoga,
  JaiminiYogaEvidence,
  KarakamshaAnalysis,
  RashiDrishtiItem,
} from '../types/jaimini-types.js';

export function evaluateJaiminiYogas(
  chart: BirthChart,
  charaKarakas: CharaKarakaInfo[],
  karakamsha: KarakamshaAnalysis,
  arudhaPadas: ArudhaPada[],
  rashiDrishti: RashiDrishtiItem[]
): JaiminiYoga[] {
  const yogas: JaiminiYoga[] = [];

  const ak = charaKarakas.find((k) => k.role === 'AK');
  const amk = charaKarakas.find((k) => k.role === 'AmK');

  if (!ak || !amk) return yogas;

  // Helper: check if two planets mutually aspect or conjoin via Rashi Drishti
  const arePlanetsAspectingOrConjoined = (p1: PlanetName, p2: PlanetName): boolean => {
    const p1Item = chart.planets.find((p) => p.planet === p1);
    const p2Item = chart.planets.find((p) => p.planet === p2);
    if (!p1Item || !p2Item) return false;

    const sign1 = Math.floor(p1Item.longitude / 30) + 1;
    const sign2 = Math.floor(p2Item.longitude / 30) + 1;

    if (sign1 === sign2) return true; // Conjunction

    const drishti1 = rashiDrishti.find((d) => d.sign.id === sign1);
    if (drishti1 && drishti1.aspectingSigns.some((as) => as.id === sign2)) {
      return true;
    }
    return false;
  };

  // 1. AK-AmK Jaimini Maharaja Yoga
  const akAmkConnected = arePlanetsAspectingOrConjoined(ak.planet, amk.planet);
  if (akAmkConnected) {
    const isConjoined = ak.sign.id === amk.sign.id;
    const desc = isConjoined
      ? `Atmakaraka (${ak.planet}) and Amatyakaraka (${amk.planet}) are conjoined in ${ak.sign.name}. Formidable Jaimini Raja Yoga conferring high status, authority, and professional prominence.`
      : `Atmakaraka (${ak.planet}) and Amatyakaraka (${amk.planet}) are in mutual Rashi Drishti aspect (${ak.sign.name} <-> ${amk.sign.name}). Auspicious Jaimini Raja Yoga for leadership and public standing.`;

    const descHi = isConjoined
      ? `आत्मकारक (${ak.planet}) और अमात्यकारक (${amk.planet}) ${ak.sign.name} में एक साथ स्थित हैं। उच्च पद-प्रतिष्ठा एवं आजीविका में सफलता देने वाला प्रबल जैमिनी राजयोग।`
      : `आत्मकारक (${ak.planet}) और अमात्यकारक (${amk.planet}) परस्पर राशि दृष्टि (${ak.sign.name} <-> ${amk.sign.name}) से जुड़े हैं। नेतृत्व व मान-प्रतिष्ठा का शुभ राजयोग।`;

    const evidence: JaiminiYogaEvidence = {
      ruleId: 'JAIMINI_RAJA_YOGA_AK_AMK',
      name: 'Jaimini AK-AmK Raja Yoga',
      nameHi: 'जैमिनी आत्मकारक-अमात्यकारक राजयोग',
      planetsInvolved: [ak.planet, amk.planet],
      signsInvolved: [ak.sign.name, amk.sign.name],
      evidenceTrace: [
        `AK: ${ak.planet} in ${ak.sign.name} (${ak.degreeInSign}°)`,
        `AmK: ${amk.planet} in ${amk.sign.name} (${amk.degreeInSign}°)`,
        isConjoined ? `Conjunction in sign ${ak.sign.name}` : `Mutual Rashi Drishti aspect between ${ak.sign.name} and ${amk.sign.name}`,
      ],
      significance: desc,
      significanceHi: descHi,
    };

    yogas.push({
      ruleId: 'JAIMINI_RAJA_YOGA_AK_AMK',
      category: 'RAJA_YOGA',
      name: 'Jaimini AK-AmK Raja Yoga',
      nameHi: 'जैमिनी आत्मकारक-अमात्यकारक राजयोग',
      planetsInvolved: [ak.planet, amk.planet],
      signsInvolved: [ak.sign.name, amk.sign.name],
      strength: isConjoined ? 'STRONG' : 'MODERATE',
      description: desc,
      descriptionHi: descHi,
      evidence,
    });
  }

  // 2. Arudha Lagna - Amatyakaraka Connection (Jaimini Dhana / Authority Yoga)
  const al = arudhaPadas.find((a) => a.code === 'AL');
  if (al) {
    const amkInAL = amk.sign.id === al.signId;
    const amkAspectsAL = rashiDrishti.find((d) => d.sign.id === al.signId)?.aspectingPlanets.includes(amk.planet);

    if (amkInAL || amkAspectsAL) {
      const desc = amkInAL
        ? `Amatyakaraka (${amk.planet}) is placed directly in Arudha Lagna (${al.sign.name}). Indicates rapid public recognition and wealth accumulation.`
        : `Amatyakaraka (${amk.planet}) casts Rashi Drishti on Arudha Lagna (${al.sign.name}). Promotes societal influence and economic progress.`;

      const descHi = amkInAL
        ? `अमात्यकारक (${amk.planet}) सीधे आरूढ़ लग्न (${al.sign.name}) में स्थित है। लोक-प्रतिष्ठा व त्वरित आर्थिक उन्नति का योग।`
        : `अमात्यकारक (${amk.planet}) आरूढ़ लग्न (${al.sign.name}) पर राशि दृष्टि डालता है। सामाजिक प्रभाव व आर्थिक समृद्धि का संकेत।`;

      const evidence: JaiminiYogaEvidence = {
        ruleId: 'JAIMINI_DHANA_YOGA_AMK_AL',
        name: 'Amatyakaraka-Arudha Lagna Association',
        nameHi: 'अमात्यकारक-आरूढ़ लग्न संबंध योग',
        planetsInvolved: [amk.planet],
        signsInvolved: [al.sign.name],
        evidenceTrace: [
          `AmK: ${amk.planet} in ${amk.sign.name}`,
          `Arudha Lagna: ${al.sign.name}`,
          amkInAL ? 'Direct placement in AL' : 'Rashi Drishti on AL',
        ],
        significance: desc,
        significanceHi: descHi,
      };

      yogas.push({
        ruleId: 'JAIMINI_DHANA_YOGA_AMK_AL',
        category: 'DHANA_YOGA',
        name: 'Amatyakaraka-Arudha Lagna Association',
        nameHi: 'अमात्यकारक-आरूढ़ लग्न संबंध योग',
        planetsInvolved: [amk.planet],
        signsInvolved: [al.sign.name],
        strength: amkInAL ? 'STRONG' : 'MODERATE',
        description: desc,
        descriptionHi: descHi,
        evidence,
      });
    }
  }

  // 3. Karakamsha Benefic Support Yoga
  const klDrishti = rashiDrishti.find((d) => d.sign.name === karakamsha.karakamshaSign.name);
  if (klDrishti) {
    const benefics: PlanetName[] = ['Jupiter', 'Venus', 'Mercury'];
    const aspectingBenefics = klDrishti.aspectingPlanets.filter((p) => benefics.includes(p));

    if (aspectingBenefics.length > 0) {
      const desc = `Karakamsha sign (${karakamsha.karakamshaSign.name}) receives Rashi Drishti from benefic planet(s): ${aspectingBenefics.join(', ')}. Indicates high moral character, wisdom, and spiritual progress.`;
      const descHi = `कारकांश राशि (${karakamsha.karakamshaSign.name}) पर शुभ ग्रह ${aspectingBenefics.join(', ')} की राशि दृष्टि है। उच्च विचार, विवेक एवं आध्यात्मिक उन्नति का योग।`;

      const evidence: JaiminiYogaEvidence = {
        ruleId: 'JAIMINI_KARAKAMSHA_BENEFIC_ASPECT',
        name: 'Karakamsha Benefic Aspect Yoga',
        nameHi: 'कारकांश शुभ ग्रह दृष्टि योग',
        planetsInvolved: aspectingBenefics,
        signsInvolved: [karakamsha.karakamshaSign.name],
        evidenceTrace: [
          `Karakamsha Sign: ${karakamsha.karakamshaSign.name}`,
          `Benefic Aspecting Planets: ${aspectingBenefics.join(', ')}`,
        ],
        significance: desc,
        significanceHi: descHi,
      };

      yogas.push({
        ruleId: 'JAIMINI_KARAKAMSHA_BENEFIC_ASPECT',
        category: 'KARAKAMSHA_YOGA',
        name: 'Karakamsha Benefic Aspect Yoga',
        nameHi: 'कारकांश शुभ ग्रह दृष्टि योग',
        planetsInvolved: aspectingBenefics,
        signsInvolved: [karakamsha.karakamshaSign.name],
        strength: aspectingBenefics.length > 1 ? 'STRONG' : 'MODERATE',
        description: desc,
        descriptionHi: descHi,
        evidence,
      });
    }
  }

  return yogas;
}
