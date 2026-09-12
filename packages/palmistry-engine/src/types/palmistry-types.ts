export type HandType = 'LEFT_HAND' | 'RIGHT_HAND';
export type HandDominance = 'DOMINANT' | 'PASSIVE';

export interface ImageQualityAssessment {
  resolutionWidth: number;
  resolutionHeight: number;
  sharpnessScore: number; // 0 to 100
  lightingScore: number; // 0 to 100
  contrastScore: number; // 0 to 100
  handVisibilityConfidence: number; // 0 to 100
  passesQualityThreshold: boolean;
  warnings: string[];
}

export interface Point2D {
  x: number; // Normalized 0 to 1 or pixel coordinate
  y: number;
}

export interface PalmarLandmarks {
  wristCenter: Point2D;
  thumbBase: Point2D;
  thumbTip: Point2D;
  indexBase: Point2D;
  indexTip: Point2D;
  middleBase: Point2D;
  middleTip: Point2D;
  ringBase: Point2D;
  ringTip: Point2D;
  pinkyBase: Point2D;
  pinkyTip: Point2D;
  radialEdge: Point2D;
  ulnarEdge: Point2D;
}

export interface DigitalRatios {
  indexLength: number;
  ringLength: number;
  ratio2D4D: number; // indexLength / ringLength
  digitClassification: 'HIGH_TESTOSTERONE_PATTERN' | 'BALANCED_ESTROGEN_PATTERN' | 'EQUIVALENT_PATTERN';
  thumbProportion: number;
  temperamentHint: string;
}

export type LineClarity = 'DEEP_CLEAR' | 'MODERATE' | 'FAINT' | 'CHAINED' | 'BROKEN';

export interface PalmarLineDetail {
  id: string;
  nameEn: string;
  nameCn: string;
  nameSanskrit: string;
  detected: boolean;
  clarity: LineClarity;
  lengthPercentage: number; // 0 to 100
  depthScore: number; // 0 to 100
  curvature: 'STRAIGHT' | 'GENTLE_CURVE' | 'STEEP_ARC' | 'SLOPING_DOWN';
  startRegion: string;
  endRegion: string;
  hasForkAtEnd: boolean;
  islandsCount: number;
  breaksCount: number;
  branchesUpwardCount: number;
  branchesDownwardCount: number;
  keyObservation: string;
}

export interface PalmarLines {
  lifeLine: PalmarLineDetail;
  headLine: PalmarLineDetail;
  heartLine: PalmarLineDetail;
  fateLine: PalmarLineDetail;
  sunLine: PalmarLineDetail;
  mercuryLine: PalmarLineDetail;
}

export type MountProminence = 'PROMINENT_WELL_DEVELOPED' | 'BALANCED_NORMAL' | 'UNDERDEVELOPED_FLAT';

export interface PalmarMountDetail {
  id: string;
  nameEn: string;
  nameSanskrit: string;
  prominence: MountProminence;
  score: number; // 0 to 100
  elementAffinity: string;
  significance: string;
}

export interface PalmarMounts {
  jupiter: PalmarMountDetail;
  saturn: PalmarMountDetail;
  sun: PalmarMountDetail;
  mercury: PalmarMountDetail;
  upperMars: PalmarMountDetail;
  lowerMars: PalmarMountDetail;
  venus: PalmarMountDetail;
  moon: PalmarMountDetail;
}

export interface PalmistryObservation {
  stageId: number;
  stageName: string;
  featureKey: string;
  value: string;
  confidence: number;
  evidence: string;
}

export interface HastRekhaRuleResult {
  ruleId: string;
  title: string;
  titleHi: string;
  category: 'VITALITY' | 'COGNITION' | 'EMOTION' | 'DESTINY' | 'MOUNTS';
  triggered: boolean;
  severity: 'HIGH_BENEFIC' | 'MODERATE_BENEFIC' | 'NEUTRAL' | 'CHALLENGING';
  finding: string;
  findingHi: string;
  evidenceTrace: string[];
}

export interface PalmistryInputPayload {
  imageWidth?: number;
  imageHeight?: number;
  handType?: HandType;
  handDominance?: HandDominance;
  sharpnessScore?: number;
  lightingScore?: number;
  contrastScore?: number;
  customLandmarks?: Partial<PalmarLandmarks>;
  customLineMetrics?: Partial<Record<keyof PalmarLines, Partial<PalmarLineDetail>>>;
}

export interface PalmistryAnalysisResult {
  profileVersion: 'vedica-palmistry-v1';
  handType: HandType;
  handDominance: HandDominance;
  quality: ImageQualityAssessment;
  landmarks: PalmarLandmarks;
  digitalRatios: DigitalRatios;
  lines: PalmarLines;
  mounts: PalmarMounts;
  pipelineStages: Array<{
    stageNumber: number;
    stageName: string;
    status: 'PASSED' | 'WARNING' | 'SKIPPED';
    details: string;
  }>;
  observations: PalmistryObservation[];
  ruleResults: HastRekhaRuleResult[];
  domainInsights: {
    vitalityAndLongevity: string;
    cognitiveStyle: string;
    emotionalHarmony: string;
    careerAndDestiny: string;
  };
  calculationHash: string;
}
