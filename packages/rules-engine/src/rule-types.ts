import { BirthChart } from '@vedica/astrology-core';

export interface AstrologyRule {
  id: string;
  name: string;
  category: string;
  evaluate(chart: BirthChart): { triggered: boolean; reasoning: string };
}
