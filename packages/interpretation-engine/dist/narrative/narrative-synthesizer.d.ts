import { BirthChart } from '@vedica/astrology-core';
import { ChartAnalysisResult } from '@vedica/analysis-engine';
export interface LifeStorybookChapter {
    id: string;
    chapterNumber: number;
    title: string;
    titleHi: string;
    subtitle: string;
    subtitleHi: string;
    archetypeBadge?: string;
    archetypeBadgeHi?: string;
    executiveSummary: string;
    executiveSummaryHi: string;
    sections: Array<{
        heading: string;
        headingHi: string;
        content: string;
        contentHi: string;
        highlights?: string[];
        highlightsHi?: string[];
    }>;
    astrologicalEvidenceSummary: string;
    astrologicalEvidenceSummaryHi: string;
}
export interface LifeStorybook {
    fullName?: string;
    primaryArchetype: string;
    primaryArchetypeHi: string;
    coreLifeMission: string;
    coreLifeMissionHi: string;
    chapters: LifeStorybookChapter[];
}
export declare function synthesizeLifeStorybook(params: {
    chart: BirthChart;
    analysis: ChartAnalysisResult;
    fullName?: string;
    dashaData?: any;
    timingData?: any;
    milestones?: any;
    struggles?: any;
}): LifeStorybook;
//# sourceMappingURL=narrative-synthesizer.d.ts.map