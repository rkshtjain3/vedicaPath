# Phase 14D: Cheshta Bala Methodology

## Overview
Cheshta Bala (Motional Strength) represents the strength a planet derives from its apparent motion relative to the Earth and the Sun. Unlike static positional strengths, it is highly dynamic. 

## Source Data
The calculation relies strictly on precise ephemeris data (Swiss Ephemeris):
- True Longitude (Spashta Graha)
- Mean Longitude (Madhya Graha)
- Seeghrochcha (Apogee / Point of fastest motion)
- Speed & Retrograde status

## Special Exceptions
As per BPHS rules:
1. **Sun**: Cheshta Bala is equivalent to its **Ayana Bala** (equinoctial strength). This means Sun's Cheshta calculation delegates to the Ayana Bala formula.
2. **Moon**: Cheshta Bala is equivalent to its **Paksha Bala** (lunar fortnight strength). 

## Formula for Tara Grahas (Mars, Mercury, Jupiter, Venus, Saturn)
The deterministic calculation follows the classical arc of retrogression (Cheshta Kendra) method without arbitrary normalization:

1. **Calculate Average Longitude**: 
   `Average Longitude = (True Longitude + Mean Longitude) / 2`
2. **Calculate Cheshta Kendra (Arc of Retrogression)**:
   `Cheshta Kendra = Seeghrochcha - Average Longitude`
   (Normalized to 0° - 360°)
3. **Normalize Cheshta Kendra**:
   - If `Cheshta Kendra > 180°`, `Cheshta Kendra = 360° - Cheshta Kendra`
4. **Calculate Virupas**:
   `Cheshta Bala (Virupas) = Cheshta Kendra / 3`
   (Maximum 60 Virupas, Minimum 0 Virupas).

## Motion States (Avasthas) & Theoretical Ranges
While the mathematical formula (`Cheshta Kendra / 3`) provides the exact floating-point Virupa value, it maps conceptually to classical planetary motion states:
- **Vakra (Retrograde)**: High strength (~60 Virupas)
- **Anuvakra (Coming out of retrogression)**: ~50 Virupas
- **Margi (Direct)**: ~40 Virupas
- **Manda (Slow)**: ~30 Virupas
- **Mandatara (Near Stationary)**: ~20 Virupas
- **Sama (Normal Speed)**: ~10 Virupas
- **Atichari (Fast Motion)**: Low strength (~5 Virupas)

*Note: We will not use the motion states to assign fixed arbitrary points. The deterministic mathematical formula preserves exact floating-point precision as required by the @vedica architecture.*

## Benchmark Policy
- Output will be validated against JHora using the `@vedica/benchmark-store`.
- Tolerance will be standard angular tolerance defaults unless modified during benchmarking.
- Status will be marked `IMPLEMENTED_UNBENCHMARKED` upon code completion until benchmark data is explicitly seeded and passed.
