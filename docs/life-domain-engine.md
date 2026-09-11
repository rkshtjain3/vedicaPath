# Vedica Life Domain Synthesis Engine (@vedica/life-domain-engine)

## Overview

The `@vedica/life-domain-engine` is a deterministic, rule-based synthesis package within the Vedica monorepo. It aggregates normalized outputs from all core calculation and interpretation engines to evaluate 7 fundamental life domains without relying on generative AI or ungrounded predictions.

## Evaluated Life Domains

1. **CAREER (Career & Vocation)**: 10th house, 10th lord, Saturn/Sun strength, D10 Dashamsha, Rajayogas.
2. **WEALTH (Wealth & Assets)**: 2nd house (accumulated wealth), 11th house (gains), 5th/9th Trikonas, Dhanakaraka Jupiter, Ashtakavarga SAV.
3. **RELATIONSHIPS (Relationships & Partnerships)**: 7th house, 7th lord, Kalatrakaraka Venus, D9 Navamsha.
4. **HEALTH (Health & Vitality)**: 1st house Lagna lord, Sun vitality, Moon mental constitution, Trik house configurations. *(Includes mandatory medical disclaimer)*.
5. **EDUCATION (Education & Intellect)**: 4th/5th/9th houses, Mercury intellect, Jupiter wisdom, Budhaditya & Saraswati Yogas.
6. **PROPERTY (Property & Real Estate)**: 4th house, 4th lord, Bhoomikaraka Mars, fixed asset yogas.
7. **SPIRITUALITY (Spirituality & Dharma)**: 9th/12th houses, Mokshakaraka Ketu, Dharmakaraka Jupiter, spiritual yogas.

## Non-Predictive Architecture

- **Independent Scoring**: Supportive, challenging, and neutral scores are calculated independently.
- **Mixed Signal Preservation**: Conflicting evidence is preserved explicitly; contradictory factors do not cancel each other.
- **Auditable Reproducibility**: Computes SHA-256 audit hash over domain states and evaluated rule IDs.
- **Evidentiary Language**: Outputs evidence traces (`whyEvidence`) explaining exact astrological factors behind every evaluation.
