// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export const PERIOD_COLORS: Record<string, string> = {
  triassic:   '#f97316',
  jurassic:   '#10b981',
  cretaceous: '#06b6d4',
};

export const PERIOD_LABELS: Record<string, string> = {
  triassic:   'Triassic',
  jurassic:   'Jurassic',
  cretaceous: 'Cretaceous',
};

export const DIET_ICONS: Record<string, string> = {
  carnivore: '🥩',
  herbivore: '🌿',
  omnivore:  '🍖',
  piscivore: '🐟',
};

export const HABITAT_ICONS: Record<string, string> = {
  terrestrial:  '🌍',
  aerial:       '🦅',
  aquatic:      '🌊',
  'semi-aquatic':'💧',
};
