import { BirthChart, PlanetName } from '@vedica/astrology-core';
import { BasicRelationship, CompoundRelationship, CompoundRelationshipResult, RelationshipMatrix } from '../types/strength-types.js';
export declare const CLASSICAL_PLANETS: PlanetName[];
export declare function getNaturalRelationship(planetA: PlanetName, planetB: PlanetName): BasicRelationship;
export declare function getTemporaryRelationship(planetA: PlanetName, planetB: PlanetName, chart: BirthChart): 'FRIEND' | 'ENEMY';
export declare function computePanchadhaMaitri(natural: BasicRelationship, temporary: 'FRIEND' | 'ENEMY'): CompoundRelationship;
export declare function getCompoundRelationship(planetA: PlanetName, planetB: PlanetName, chart: BirthChart): CompoundRelationshipResult;
export declare function calculateRelationshipMatrix(chart: BirthChart): RelationshipMatrix;
