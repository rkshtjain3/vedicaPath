import { PlanetName } from '@vedica/astrology-core';
import { KaalaBalaSubcomponent } from '../types/shadbala-types.js';
/**
 * Calculates Lord of Year, Month, Day, and Hour Strengths (BPHS Chapter 27):
 * - Varsha Lord (Year Lord): 15 Virupas
 * - Masa Lord (Month Lord): 30 Virupas
 * - Dina Lord (Weekday Lord): 45 Virupas
 * - Hora Lord (Hour Lord): 60 Virupas
 */
export declare function calculateVarshaMasaDinaHoraBala(planet: PlanetName, birthDate: Date | string, sunSignLord: PlanetName): KaalaBalaSubcomponent;
