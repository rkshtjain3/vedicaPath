export type PalaceType = 'LIFE' | 'SIBLINGS' | 'SPOUSE' | 'CHILDREN' | 'WEALTH' | 'HEALTH' | 'TRAVEL' | 'FRIENDS' | 'CAREER' | 'PROPERTY' | 'FORTUNE' | 'PARENTS';
export type EarthlyBranch = 'Zi' | 'Chou' | 'Yin' | 'Mao' | 'Chen' | 'Si' | 'Wu' | 'Wei' | 'Shen' | 'You' | 'Xu' | 'Hai';
export type HeavenlyStem = 'Jia' | 'Yi' | 'Bing' | 'Ding' | 'Wu' | 'Ji' | 'Geng' | 'Xin' | 'Ren' | 'Gui';
export type ElementBureauName = 'Water 2' | 'Wood 3' | 'Metal 4' | 'Earth 5' | 'Fire 6';
export interface ElementBureau {
    name: ElementBureauName;
    number: 2 | 3 | 4 | 5 | 6;
    element: 'Water' | 'Wood' | 'Metal' | 'Earth' | 'Fire';
    chineseName: string;
}
export type StarCategory = 'MAJOR_NORTH' | 'MAJOR_SOUTH' | 'AUXILIARY_BENEFIC' | 'AUXILIARY_MALEFIC' | 'TRANSFORMATION';
export type StarBrightness = 'Temple' | 'Radiance' | 'Gain' | 'Flat' | 'Trapped';
export type SiHuaTransformationType = 'Hua Lu' | 'Hua Quan' | 'Hua Ke' | 'Hua Ji';
export interface SiHuaTransformation {
    type: SiHuaTransformationType;
    chinese: '化祿' | '化權' | '化科' | '化忌';
    starName: string;
    effect: string;
}
export interface ZiWeiStar {
    id: string;
    nameEn: string;
    nameCn: string;
    category: StarCategory;
    brightness: StarBrightness;
    transformation?: SiHuaTransformationType;
}
export interface ZiWeiPalace {
    type: PalaceType;
    nameEn: string;
    nameCn: string;
    branch: EarthlyBranch;
    branchIndex: number;
    stem: HeavenlyStem;
    isLifePalace: boolean;
    isBodyPalace: boolean;
    majorStars: ZiWeiStar[];
    auxiliaryStars: ZiWeiStar[];
    transformations: SiHuaTransformation[];
    evidence: string[];
}
export interface ZiWeiChartResult {
    profileVersion: 'chinese-ziwei-v1';
    lunarDate: {
        year: number;
        month: number;
        day: number;
        isLeapMonth: boolean;
    };
    bureau: ElementBureau;
    lifePalaceBranch: EarthlyBranch;
    bodyPalaceBranch: EarthlyBranch;
    palaces: ZiWeiPalace[];
    siHuaTransformations: SiHuaTransformation[];
    calculationHash: string;
    auditTrail: {
        ruleSet: string;
        mingGongCalculation: string;
        shenGongCalculation: string;
        bureauCalculation: string;
        ziWeiStarPlacement: string;
    };
}
