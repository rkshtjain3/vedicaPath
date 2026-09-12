import { BirthChart } from '@vedica/astrology-core';
import { AnnualPillarInfo, DaYunDetails, FourPillars } from '../types/bazi-types.js';
export declare function calculateLuckPillars(chart: BirthChart, fourPillars: FourPillars, gender?: 'MALE' | 'FEMALE'): DaYunDetails;
export declare function calculateAnnualPillar(fourPillars: FourPillars, targetYear?: number): AnnualPillarInfo;
