import { InterpretationDomain } from '../types/interpretation-types.js';
export interface TemplateVariables {
    domain: InterpretationDomain;
    activity: 'LOW' | 'MODERATE' | 'HIGH';
    supportiveCount: number;
    challengingCount: number;
    neutralCount: number;
}
export interface RenderedTemplate {
    templateKey: string;
    summary: string;
}
export declare function selectAndRenderTemplate(vars: TemplateVariables): RenderedTemplate;
//# sourceMappingURL=template-engine.d.ts.map