import { PlanetName } from '@vedica/astrology-core';

export type DignityType = 'Exalted' | 'Moolatrikona' | 'OwnSign' | 'GreatFriend' | 'Friend' | 'Neutral' | 'Enemy' | 'GreatEnemy' | 'Debilitated';

export interface PlanetaryDignity {
  planet: PlanetName;
  dignity: DignityType;
}
