# Classical Yoga Engine Documentation (`@vedica/yoga-engine`)

## Overview

The `@vedica/yoga-engine` package provides a standalone, zero-dependency, deterministic evaluation engine for 24 canonical classical Vedic Yogas. It calculates Yoga status (`DETECTED`, `NOT_DETECTED`, or `NOT_SUPPORTED`) and produces machine-readable condition breakdowns and evidence graphs without predictive language or speculative scoring.

## Supported 24 Classical Yogas

### 1. Pancha Mahapurusha Yogas (5)
- **RUCHAKA_YOGA**: Mars exalted (Capricorn) or in own sign (Aries/Scorpio) in a Kendra house (1, 4, 7, 10) from Lagna.
- **BHADRA_YOGA**: Mercury exalted (Virgo) or in own sign (Gemini) in a Kendra house (1, 4, 7, 10) from Lagna.
- **HAMSA_YOGA**: Jupiter exalted (Cancer) or in own sign (Sagittarius/Pisces) in a Kendra house (1, 4, 7, 10) from Lagna.
- **MALAVYA_YOGA**: Venus exalted (Pisces) or in own sign (Taurus/Libra) in a Kendra house (1, 4, 7, 10) from Lagna.
- **SASA_YOGA**: Saturn exalted (Libra) or in own sign (Capricorn/Aquarius) in a Kendra house (1, 4, 7, 10) from Lagna.

### 2. Raja Yogas (5)
- **DHARMA_KARMADHIPATI_YOGA**: Conjunction or mutual aspect between 9th Lord (Dharma) and 10th Lord (Karma).
- **KENDRA_TRIKONA_RAJA_YOGA**: Conjunction or mutual aspect between a Kendra Lord (1, 4, 7, 10) and a Trikona Lord (5, 9).
- **VIPARITA_RAJA_YOGA_HARSHA**: 6th Lord positioned in 6th, 8th, or 12th Dusthana house without benefic association.
- **VIPARITA_RAJA_YOGA_SARALA**: 8th Lord positioned in 6th, 8th, or 12th Dusthana house without benefic association.
- **VIPARITA_RAJA_YOGA_VIMALA**: 12th Lord positioned in 6th, 8th, or 12th Dusthana house without benefic association.

### 3. Dhana Yogas (5)
- **DHANA_YOGA_2_11**: Association (conjunction/aspect) between 2nd Lord (Wealth) and 11th Lord (Gains).
- **DHANA_YOGA_1_2**: Association between 1st Lord (Self/Lagna) and 2nd Lord (Wealth).
- **DHANA_YOGA_1_11**: Association between 1st Lord (Self/Lagna) and 11th Lord (Gains).
- **DHANA_YOGA_5_9**: Association between 5th Lord (Purva Punya) and 9th Lord (Bhagya).
- **DHANA_YOGA_9_11**: Association between 9th Lord (Fortune) and 11th Lord (Gains).

### 4. Lunar Yogas (5)
- **GAJAKESARI_YOGA**: Jupiter in a Kendra house (1, 4, 7, 10) from Moon, provided Jupiter is not debilitated.
- **SUNAPHA_YOGA**: Planets (other than Sun, Rahu, Ketu) occupying the 2nd house from Moon.
- **ANAPHA_YOGA**: Planets (other than Sun, Rahu, Ketu) occupying the 12th house from Moon.
- **DURUDHARA_YOGA**: Planets (other than Sun, Rahu, Ketu) occupying both the 2nd AND 12th houses from Moon.
- **KEMADRUMA_YOGA**: No planets (other than Sun, Rahu, Ketu) in 2nd or 12th house from Moon, and no planet conjunct or in Kendra from Moon/Lagna (Cancellation check).

### 5. Special & Miscellaneous Yogas (4)
- **BUDHA_ADITYA_YOGA**: Sun and Mercury conjunct in the same rashi/house or within conjunction orb.
- **NEECHA_BHANGA_RAJA_YOGA**: Cancellation of a planet's debilitation via its sign dispositor being in a Kendra house from Lagna or Moon.
- **PARIVARTANA_YOGA**: Mutual sign/house exchange between two house lords.
- **CHANDRA_MANGALA_YOGA**: Moon and Mars conjunct or in 7th mutual aspect.

## Data Structures & Evidence Model

```typescript
export interface YogaCondition {
  id: string;
  description: string;
  passed: boolean;
  result?: boolean;
  expectedValue?: unknown;
  actualValue?: unknown;
  evidence: string[];
}

export interface YogaEvidence {
  type: 'PLANET_POSITION' | 'HOUSE_LORDSHIP' | 'ASPECT' | 'CONJUNCTION' | 'DIGNITY' | 'HOUSE_RELATIONSHIP' | 'CANCELLATION';
  planet?: string;
  targetPlanet?: string;
  house?: number;
  details: string[];
}

export interface YogaResult {
  id: string;
  name: string;
  category: 'MAHAPURUSHA' | 'RAJA' | 'DHANA' | 'LUNAR' | 'SPECIAL';
  status: 'DETECTED' | 'NOT_DETECTED' | 'NOT_SUPPORTED';
  detected: boolean;
  chartScope: 'D1' | 'D9' | 'D10' | 'CROSS_CHART';
  conditions: YogaCondition[];
  evidence: YogaEvidence[];
  methodologyVersion: string;
  notes?: string[];
}
```

## Calculation Pipeline Integration

The engine is called in `apps/web/src/app/api/calculate/route.ts`:

```typescript
import { evaluateYogaEngine, PERSONAL_YOGA_V1 } from '@vedica/yoga-engine';

const yogaAnalysis = evaluateYogaEngine(chart, analysis, PERSONAL_YOGA_V1);
```

The UI (`apps/web/src/app/page.tsx`) provides `#tab-yogas` with category filtering (`ALL`, `MAHAPURUSHA`, `RAJA`, `DHANA`, `LUNAR`, `SPECIAL`) and interactive "WHY?" evidence breakdown panels.
