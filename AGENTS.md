# VedicaPath - Core Architecture & Technical Distillations

## Project Philosophy
1. **Astrology Without Superstition**: Transparent mathematical algorithms, deterministic calculation ASTs, and evidence-backed interpretations replacing fatalism.
2. **Deterministic Calculations**: Astronomical and astrological computations are 100% deterministic (Swiss Ephemeris v2.10). No Large Language Model generates raw astrological data.
3. **Hybrid Local AI Navigation**: Multi-language conversational AI assistant (`@vedica/ai-engine`) with zero-latency deterministic RAG synthesis fallback and local Ollama streaming support.

---

## Monorepo Structure & Package Layers (23 Packages)

### 1. Foundation Layer
- `@vedica/shared`: Common types, error structures, and interfaces.
- `@vedica/astrology-core`: Swiss Ephemeris wrapper, sidereal planetary coordinates, house cusps, Nakshatras.
- `@vedica/location-engine`: City coordinate lookup, timezone calculation, LMT / DST conversions.
- `@vedica/panchanga-engine`: Classical 5-limbed timing (Tithi, Vaara, Nakshatra, Yoga, Karana, Rahu Kaal, Solar Hora).
- `@vedica/numerology-engine`: Chaldean and Pythagorean name/date numerology calculators.

### 2. Analytical & Strength Layer
- `@vedica/analysis-engine`: Composite chart analyzer and analytical coordinator.
- `@vedica/shadbala-engine`: Full 6-fold Shadbala calculation (Sthana, Dig, Kaala, Cheshta, Naisargika, Drik Bala).
- `@vedica/strength-engine`: Dignity matrix, combustion, planetary states, Panchadha Maitri.
- `@vedica/ashtakavarga-engine`: BAV for 7 planets + Lagna, SAV (337 bindus), Trikona/Ekadhipatya Shodhana, Shodhya Pinda.
- `@vedica/divisional-chart-engine`: Complete Shodashavarga (D1 through D60).
- `@vedica/jaimini-engine`: 7 and 8 Chara Karakas (AK, AmK, BK, MK, PK, GK, DK) and Arudha Padas.
- `@vedica/yoga-engine`: 50+ classical yogas (Mahapurusha, Raja, Dhana, Gajakesari, Budhaditya, Neechabhanga).

### 3. Timing & Life Domain Layer
- `@vedica/dasha-engine`: Vimshottari Dasha (Maha, Antar, Pratyantar) & Yogini Dasha.
- `@vedica/transit-engine`: Real-time planetary transits (Gochar), house transits, Sade Sati & Dhaiya.
- `@vedica/timeline-engine`: Multi-year cosmic timeline and weather periods.
- `@vedica/timing-engine`: Life milestone windows and auspicious timing horizons.
- `@vedica/rules-engine`: AST rule evaluation for life domain recommendations.
- `@vedica/interpretation-engine`: Structured domain interpretation synthesis.
- `@vedica/life-domain-engine`: 12 Life Domains, Failure Diagnostics, and Ayur-Jyotish Dosha profiling (`calculateAyurvedicDoshaProfile`).

### 4. Consumer, AI & UI Layer
- `@vedica/ai-engine`: Local LLM Hybrid RAG Conversational Engine, multi-language prompt synthesizer (EN/HI/Hinglish), zero-latency deterministic fallback.
- `@vedica/query-engine`: Natural language semantic retrieval for Ask Vedica.
- `@vedica/report-engine`: Comprehensive life report assembler.
- `@vedica/report-export`: Multi-format PDF and print export.
- `@vedica/chart-renderer`: SVG North & South Indian chart renderer with aspect rays and transit overlays.
- `apps/web`: Next.js 14 web app with Observatory, Life Navigator, Timeline, Personal Report, and Ask Vedica AI Console.

---

## Critical Rules & Development Workflows
1. **Monorepo Builds**: Next.js consumes compiled outputs from package `dist/` directories. After modifying any package in `packages/*`, always run:
   ```bash
   npm --prefix packages/<package-name> run build
   ```
2. **Testing**: Run tests with `npm test` across all 70 test suites. All 327 tests must pass cleanly.
3. **Multi-Language Support**:
   - `en`: Concise, executive scannable format.
   - `hi`: Pure Devanagari Hindi (शुद्ध एवं आत्मीय).
   - `hinglish`: Natural conversational Roman Hindi.
