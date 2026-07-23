// src/types/index.ts
export type Diet    = 'carnivore' | 'herbivore' | 'omnivore' | 'piscivore';
export type Period  = 'triassic'  | 'jurassic'  | 'cretaceous';
export type Habitat = 'terrestrial' | 'aerial'  | 'aquatic'  | 'semi-aquatic';
export type WeatherType = 'clear' | 'rain' | 'storm' | 'fog' | 'wind';
export type DayPhase    = 'dawn'  | 'day'  | 'dusk'  | 'night';

export interface DinosaurStats {
  height:    number;
  length:    number;
  weight:    number;
  speed:     number;
  biteForce: number;
  lifespan:  number;
  iq:        number;
}

export interface DinosaurFact {
  icon:  string;
  title: string;
  body:  string;
}

export interface Dinosaur {
  id:             string;
  slug:           string;
  name:           string;
  scientificName: string;
  period:         Period;
  periodStart:    number;
  periodEnd:      number;
  diet:           Diet;
  habitat:        Habitat;
  continents:     string[];
  stats:          DinosaurStats;
  description:    string;
  behavior:       string;
  image:          string;
  color:          string;
  glowColor:      string;
  facts:          DinosaurFact[];
  predators:      string[];
  prey:           string[];
  isFeatured:     boolean;
  isFlying:       boolean;
  isAquatic:      boolean;
  discoveryYear:  number;
  discoveryPlace: string;
}

export interface GeologicPeriod {
  id:          string;
  name:        string;
  start:       number;
  end:         number;
  description: string;
  color:       string;
  bgClass:     string;
  events:      string[];
  climate:     string;
  flora:       string;
  emoji:       string;
}

export interface QuizQuestion {
  id:          number;
  question:    string;
  options:     string[];
  correct:     number;
  explanation: string;
}

export interface EnvironmentState {
  weather:   WeatherType;
  dayPhase:  DayPhase;
  intensity: number;
}
