export interface ExtractedNatalContext {
    sign?: string;
    house?: number;
    dignity?: string;
    isRetrograde?: boolean;
    isCombust?: boolean;
    ownedHouses?: number[];
}
export declare function extractNatalContext(planetName: string, engineData: any): ExtractedNatalContext;
//# sourceMappingURL=natal-context.d.ts.map