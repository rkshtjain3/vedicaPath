# Palmistry & Hast Rekha Methodology: `vedica-palmistry-v1`

## 1. Overview
`vedica-palmistry-v1` is a deterministic Palmistry (Hast Rekha / हस्तरेखा) engine implemented in `@vedica/palmistry-engine`. Adhering to Vedica's philosophy of "Metaphysics & Astrology Without Superstition," all analyses rely on mathematical palmar measurements, 2D:4D finger digital ratios, geometric line vectors, and classical Hast Rekha AST rules.

---

## 2. 9-Stage Pipeline Specification

```
Photo Input ➔ Quality Assessment ➔ Hand Detection ➔ Landmark Extraction ➔ Line Vector Detection ➔ Mount Measurements ➔ Structured Observations ➔ Deterministic Rules ➔ Structured Interpretation
```

### Stage 1: Photo Input & Frame Ingestion
Ingests palmar images (JPEG/PNG/Canvas frame).

### Stage 2: Image Quality Assessment
Validates image quality before performing analysis:
- **Minimum Resolution**: $600 \times 600$ pixels.
- **Sharpness Score**: Calculated via Laplacian variance of grayscale pixels ($\sigma^2 > 100$).
- **Lighting Contrast**: Brightness mean between 40 and 220; contrast ratio $> 1.5$.
- **Hand Visibility Confidence**: Minimum 85% palmar region coverage.

### Stage 3: Hand Detection & Segmentation
- Hand Orientation: Left vs. Right hand identification.
- Palmar Mask: Isolates palm surface area ($A_{\text{palm}}$) excluding background noise.

### Stage 4: Landmark Extraction (8 Key Anchor Points)
1. **Wrist Center (Rasayana/Manibandha)**: Base center.
2. **Thumb Base (Shukra/Venus Mount Origin)**.
3. **Index Finger Base (Guru/Jupiter Mount Origin)**.
4. **Middle Finger Base (Shani/Saturn Mount Origin)**.
5. **Ring Finger Base (Surya/Sun Mount Origin)**.
6. **Pinky Finger Base (Budh/Mercury Mount Origin)**.
7. **Palmar Radial Edge (Upper/Lower Mars)**.
8. **Palmar Ulnar Edge (Chandra/Moon Mount)**.

#### Digital Ratios:
- **2D:4D Ratio**: Index Finger Length / Ring Finger Length.
  - $\text{2D:4D} < 0.96$: High prenatal testosterone balance (high drive, risk tolerance).
  - $\text{2D:4D} \ge 0.96$: Balanced prenatal estrogen/androgen equilibrium (verbal agility, social empathy).

### Stage 5: Line Detection & Vectorization

#### Primary Lines:
1. **Life Line (Pitru/Aayu Rekha)**: Wraps around Venus Mount (Shukra). Measures vitality, stamina, and physical longevity baseline.
2. **Head Line (Matri/Masti Rekha)**: Originates near Index/Thumb base across palm towards Moon/Mars. Measures cognitive style (Straight = Analytical/Pragmatic, Curved/Sloped = Creative/Intuitive).
3. **Heart Line (Ayu/Hridaya Rekha)**: Originates under Pinky towards Jupiter/Saturn mounts. Measures emotional expressiveness and relationship harmony.
4. **Fate Line (Bhagya Rekha)**: Rises vertically from Wrist/Moon towards Saturn Mount. Measures career continuity, purpose, and external structure.

#### Secondary Lines:
- **Sun Line (Surya Rekha)**: Fame, artistic recognition, public credibility.
- **Mercury Line (Budh/Health Rekha)**: Digestive fire, commercial acumen, health stamina.

### Stage 6: 7 Palmar Mounts Prominence

| Mount | Location | Attributes |
|---|---|---|
| **Jupiter (Guru)** | Below Index Finger | Leadership, ambition, spiritual dignity, honor |
| **Saturn (Shani)** | Below Middle Finger | Discipline, patience, research, analytical rigor |
| **Sun (Surya)** | Below Ring Finger | Artistry, charisma, optimism, public authority |
| **Mercury (Budh)** | Below Pinky Finger | Business intellect, communication, eloquence |
| **Mars (Mangal Upper & Lower)** | Inner/Outer Edge | Moral courage, resilience, defensive energy |
| **Venus (Shukra)** | Base of Thumb | Vitality, warmth, appreciation for aesthetics |
| **Moon (Chandra)** | Base opposite Thumb | Imagination, travel inclination, intuitive depth |

### Stage 7: Structured Observations Generator
Generates normalized vector data (Length %, Depth score 0–1, Curvature rating, Islands count, Branches, Forks).

### Stage 8: AST Rule Evaluator
Evaluates Hast Rekha AST rules deterministically against observations to generate evidence-backed findings.

### Stage 9: Structured Interpretation
Assembles insights across 4 core life domains:
1. Physical Vitality & Energy Dynamics
2. Cognitive & Intellectual Orientation
3. Emotional Equilibrium & Relationship Style
4. Career Destiny, Ambition & Material Compounding

---

## 3. Versioning & Determinism
- Protocol Version: `vedica-palmistry-v1`
- Calculation SHA-256 Hash generated from canonical inputs, landmark coordinates, line metrics, and mount prominence ratings.
