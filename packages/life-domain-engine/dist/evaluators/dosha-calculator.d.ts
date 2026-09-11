export type AyurvedicDosha = 'VATA' | 'PITTA' | 'KAPHA' | 'VATA_PITTA' | 'PITTA_KAPHA' | 'VATA_KAPHA' | 'TRIDOSHIC';
export interface DoshaProfile {
    primaryDosha: AyurvedicDosha;
    scores: {
        vata: number;
        pitta: number;
        kapha: number;
    };
    percentages: {
        vata: number;
        pitta: number;
        kapha: number;
    };
    digestiveFireType: 'Vishama (Irregular/Vata)' | 'Tikshna (Intense/Pitta)' | 'Manda (Slow/Kapha)' | 'Sama (Balanced)';
    circadianBioClock: {
        idealWakeWindow: string;
        peakDigestionWindow: string;
        deepWorkWindow: string;
        windDownWindow: string;
        idealSleepWindow: string;
    };
    adaptogensAndHerbs: string[];
    sattvicDietGuidelines: {
        favored: string[];
        toAvoid: string[];
    };
    breathworkProtocol: string;
}
export declare function calculateAyurvedicDoshaProfile(calculationData: any): DoshaProfile;
//# sourceMappingURL=dosha-calculator.d.ts.map