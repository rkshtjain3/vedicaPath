import { BirthChart } from '@vedica/astrology-core';

export interface VedicRemedy {
  targetPlanet: string;
  reason: string;
  mantra: {
    sanskrit: string;
    roman: string;
    recitationsCount: number;
    recommendedTime: string;
  };
  danaCharity: {
    items: string[];
    beneficiary: string;
    dayOfWeek: string;
  };
  gemstoneAudit: {
    primaryGem: string;
    isSuitable: boolean;
    contraindicationWarning?: string;
    alternateUpratna: string;
  };
}

export interface RemedialSynthesizerResult {
  remedies: VedicRemedy[];
  generalRemedialGuidance: string;
}

const PLANET_MANTRAS: Record<string, { sanskrit: string; roman: string; gem: string; upratna: string; dana: string[]; day: string }> = {
  Sun: { sanskrit: 'ॐ घृणिः सूर्याय नमः', roman: 'Om Ghrinih Suryaya Namah', gem: 'Ruby (Manikya)', upratna: 'Red Garnet', dana: ['Wheat', 'Jaggery', 'Copper', 'Red Cloth'], day: 'Sunday' },
  Moon: { sanskrit: 'ॐ सों सोमाय नमः', roman: 'Om Som Somaya Namah', gem: 'Pearl (Moti)', upratna: 'Moonstone', dana: ['Rice', 'Milk', 'Silver', 'White Clothes'], day: 'Monday' },
  Mars: { sanskrit: 'ॐ अं अंङ्गारकाय नमः', roman: 'Om Am Angarakaya Namah', gem: 'Red Coral (Moonga)', upratna: 'Red Jasper', dana: ['Red Lentils (Masoor)', 'Jaggery', 'Copper'], day: 'Tuesday' },
  Mercury: { sanskrit: 'ॐ बुं बुधाय नमः', roman: 'Om Bum Budhaya Namah', gem: 'Emerald (Panna)', upratna: 'Peridot / Green Tourmaline', dana: ['Whole Green Gram (Moong)', 'Green Clothes', 'Brass'], day: 'Wednesday' },
  Jupiter: { sanskrit: 'ॐ बृं बृहस्पतये नमः', roman: 'Om Brim Brihaspataye Namah', gem: 'Yellow Sapphire (Pukhraj)', upratna: 'Yellow Topaz / Citrine', dana: ['Yellow Chana Dal', 'Turmeric', 'Gold / Brass', 'Yellow Cloth'], day: 'Thursday' },
  Venus: { sanskrit: 'ॐ शुं शुक्राय नमः', roman: 'Om Shum Shukraya Namah', gem: 'Diamond (Heera)', upratna: 'White Sapphire / Opal', dana: ['Rice', 'Sugar', 'Ghee', 'White Silk'], day: 'Friday' },
  Saturn: { sanskrit: 'ॐ शं शनैश्चराय नमः', roman: 'Om Sham Shanaishcharaya Namah', gem: 'Blue Sapphire (Neelam)', upratna: 'Amethyst / Lapis Lazuli', dana: ['Black Sesame (Til)', 'Mustard Oil', 'Iron', 'Black Cloth'], day: 'Saturday' },
};

export function synthesizeVedicRemedies(chart: BirthChart): RemedialSynthesizerResult {
  const remedies: VedicRemedy[] = [];
  const lagnaLongitude = chart.lagna?.longitude ?? 0;
  const lagnaSignIdx = Math.floor(((lagnaLongitude % 360) + 360) % 360 / 30) + 1;

  // Identify functionally weak or afflicted planets (e.g. Debilitated or 6/8/12 lords)
  for (const p of chart.planets) {
    if (['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.planet)) {
      const pSignIdx = Math.floor(((p.longitude % 360) + 360) % 360 / 30) + 1;
      const houseFromLagna = ((pSignIdx - lagnaSignIdx + 12) % 12) + 1;
      const isDebilitated = p.sign?.name === 'Cancer' && p.planet === 'Mars' ||
                            p.sign?.name === 'Libra' && p.planet === 'Sun' ||
                            p.sign?.name === 'Scorpio' && p.planet === 'Moon' ||
                            p.sign?.name === 'Pisces' && p.planet === 'Mercury' ||
                            p.sign?.name === 'Capricorn' && p.planet === 'Jupiter' ||
                            p.sign?.name === 'Virgo' && p.planet === 'Venus' ||
                            p.sign?.name === 'Aries' && p.planet === 'Saturn';

      const isTrikaPlacement = [6, 8, 12].includes(houseFromLagna);

      if (isDebilitated || isTrikaPlacement) {
        const info = PLANET_MANTRAS[p.planet];
        if (info) {
          // Gemstone suitability check: Maraka (H2/H7) or Dusthana (H6/H8/H12) lords should NOT wear primary gems
          const isMarakaLord = houseFromLagna === 2 || houseFromLagna === 7;
          const isGemSuitable = !isDebilitated && !isMarakaLord && !isTrikaPlacement;

          remedies.push({
            targetPlanet: p.planet,
            reason: isDebilitated
              ? `${p.planet} is Debilitated in ${p.sign?.name} (House ${houseFromLagna}).`
              : `${p.planet} is placed in House ${houseFromLagna} (Dusthana).`,
            mantra: {
              sanskrit: info.sanskrit,
              roman: info.roman,
              recitationsCount: 108,
              recommendedTime: `Mornings on ${info.day} during Brahma/Shubh Hora.`,
            },
            danaCharity: {
              items: info.dana,
              beneficiary: 'Deserving needy persons or spiritual institutions',
              dayOfWeek: info.day,
            },
            gemstoneAudit: {
              primaryGem: info.gem,
              isSuitable: isGemSuitable,
              contraindicationWarning: !isGemSuitable
                ? `Primary gemstone (${info.gem}) NOT recommended due to functional affliction/Dusthana placement. Focus on Mantras & Dāna.`
                : undefined,
              alternateUpratna: info.upratna,
            },
          });
        }
      }
    }
  }

  return {
    remedies,
    generalRemedialGuidance:
      'Vedic remedies focus on harmonizing planetary frequency vibrations through sound recitations (Mantras) and elemental redistribution (Dāna). Gemstones are prescribed strictly when functional lords are benefic and non-afflicted.',
  };
}
