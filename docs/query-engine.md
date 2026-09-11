# Vedica Query Engine (@vedica/query-engine)

## Overview
The `@vedica/query-engine` package provides a **100% deterministic, evidence-based exploration layer** for Vedic astrology calculations. It operates without Large Language Models (LLMs) or generative AI to guarantee absolute reproducibility, non-predictive interpretations, and full transparency into the source calculation engines.

---

## Core Principles
1. **Zero-LLM / Deterministic Output**: All question normalizations, tokenizations, intent classifications, entity extractions, and evidence rankings use fixed pattern-matching rules and canonical dictionaries (`PERSONAL_QUERY_V1`).
2. **Traceable Evidence Chain**: Every answer links directly to its underlying calculation engines (`ASTROLOGY_CORE`, `DIVISIONAL_CHART`, `DASHA`, `TIMELINE`, `TRANSIT`, `ASHTAKAVARGA`, `STRENGTH`, `SHADBALA`, `YOGA`, `LIFE_DOMAIN`, `NUMEROLOGY`, `RULES_ENGINE`).
3. **Non-Predictive Redirects**: Queries attempting future predictions (e.g., *"Will I become a billionaire?"*) are redirected to present deterministic chart evidence with clear non-predictive disclaimers.
4. **Name Astrology Isolation**: Personal full names are strictly excluded from input fingerprinting unless the query explicitly requests name-based numerology.
5. **No Score Subtraction for Conflicts**: Contradictory evidence factors (supportive vs. challenging) are preserved side-by-side without arbitrary score masking.

---

## Package Architecture

```
packages/query-engine/src/
├── profile.ts                      # Canonical query profile (PERSONAL_QUERY_V1)
├── types.ts                        # Core interfaces & types
├── index.ts                        # Main executeQueryEngine entrypoint
├── question/                       # Parsing & Intent Pipeline
│   ├── question-normalizer.ts       # Text cleaning & normalization
│   ├── question-tokenizer.ts        # Word tokenization
│   ├── entity-extractor.ts         # Entities (domains, planets + Sanskrit aliases)
│   ├── intent-classifier.ts        # Intent classification & confidence rating
│   └── question-parser.ts          # Unified question parser
├── retrieval/                      # Evidence Retrievers
│   ├── evidence-retriever.ts       # Orchestrator
│   ├── natal-retriever.ts          # Astrology core placements & house lords
│   ├── dasha-retriever.ts          # Active Mahadasha/Antardasha/Pratyantardasha
│   ├── transit-retriever.ts        # Gochar transits & NDT convergence
│   ├── ashtakavarga-retriever.ts   # BAV & SAV bindu points
│   ├── strength-retriever.ts       # Dignities & strength scores
│   ├── shadbala-retriever.ts       # Classical Shadbala components (Rupas)
│   ├── yoga-retriever.ts           # Classical detected Yogas
│   ├── divisional-retriever.ts     # D9 Navamsha & D10 Dashamsha placements
│   ├── life-domain-retriever.ts    # Life domain supporting & challenging factors
│   └── numerology-retriever.ts     # Birth date & name numerology
├── synthesis/                      # Synthesis & Answer Assembly
│   ├── evidence-ranking.ts         # Deterministic scoring & ranking
│   ├── evidence-grouping.ts        # Engine-level grouping
│   ├── mixed-signal-detector.ts    # Conflict detection
│   └── answer-builder.ts           # Template answer generation
├── explainability/                 # Traceability
│   ├── why-chain-builder.ts        # Step-by-step calculation trace builder
│   └── answer-evidence.ts          # Answer-wide why chain extractor
└── reproducibility/                # Audit & Fingerprinting
    └── query-fingerprint.ts        # SHA-256 fingerprinting
```

---

## Supported Query Intent Categories
- `DOMAIN`: Career, Wealth, Relationships, Health, Education, Property, Spirituality.
- `PLANET`: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu (and Sanskrit aliases *Surya*, *Chandra*, *Mangal*, *Budh*, *Guru*, *Shukra*, *Shani*).
- `TIMING`: Current Dasha periods, active timing windows, transits, timing alignment.
- `YOGA`: Raja Yogas, Dhana Yogas, Mahapurusha Yogas, Gajakesari Yoga, etc.
- `STRENGTH`: Planetary dignity, strength ratings, classical Shadbala Rupas.
- `TRANSIT`: Gochar placements, transit aspects, conjunctions, Ashtakavarga transit scores.
- `NUMEROLOGY`: Life Path, Birthday, Personal Year, Expression & Soul Urge numbers.
- `EVIDENCE`: Filter queries (supportive only, challenging only, neutral).
- `COMPARISON`: Varga placements vs. D1 placements.

---

## Quick Usage

```typescript
import { executeQueryEngine } from '@vedica/query-engine';

const result = executeQueryEngine(calculationData, "What does my chart show about career?", {
  transitDate: "2026-08-30",
  fullName: "Rakshit Jain",
});

console.log(result.query.summary);
console.log(result.query.evidenceGroups);
console.log(result.audit.queryFingerprint);
```
