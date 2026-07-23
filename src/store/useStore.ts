// src/store/useStore.ts
'use client';

import { create } from 'zustand';
import type { Dinosaur, WeatherType } from '@/types';

interface DinoStore {
  // Loading
  isLoaded:        boolean;
  setLoaded:       (v: boolean) => void;

  // Audio
  isMuted:         boolean;
  masterVolume:    number;
  toggleMute:      () => void;
  setVolume:       (v: number) => void;

  // Environment
  weather:         WeatherType;
  setWeather:      (w: WeatherType) => void;

  // Gallery
  searchQuery:     string;
  filterDiet:      string;
  filterPeriod:    string;
  filterHabitat:   string;
  setSearch:       (q: string) => void;
  setFilterDiet:   (d: string) => void;
  setFilterPeriod: (p: string) => void;
  setFilterHabitat:(h: string) => void;

  // Comparison
  compareA:        Dinosaur | null;
  compareB:        Dinosaur | null;
  setCompareA:     (d: Dinosaur | null) => void;
  setCompareB:     (d: Dinosaur | null) => void;

  // Easter egg
  indominus:       boolean;
  activateIndominus: () => void;

  // Quiz
  quizScore:       number;
  setQuizScore:    (s: number) => void;
}

export const useStore = create<DinoStore>((set) => ({
  isLoaded:      false,
  setLoaded:     (v) => set({ isLoaded: v }),

  isMuted:       false,
  masterVolume:  0.7,
  toggleMute:    () => set((s) => ({ isMuted: !s.isMuted })),
  setVolume:     (v) => set({ masterVolume: v }),

  weather:       'clear',
  setWeather:    (w) => set({ weather: w }),

  searchQuery:   '',
  filterDiet:    'all',
  filterPeriod:  'all',
  filterHabitat: 'all',
  setSearch:     (q) => set({ searchQuery: q }),
  setFilterDiet: (d) => set({ filterDiet: d }),
  setFilterPeriod:(p) => set({ filterPeriod: p }),
  setFilterHabitat:(h) => set({ filterHabitat: h }),

  compareA:      null,
  compareB:      null,
  setCompareA:   (d) => set({ compareA: d }),
  setCompareB:   (d) => set({ compareB: d }),

  indominus:     false,
  activateIndominus: () => set({ indominus: true }),

  quizScore:     0,
  setQuizScore:  (s) => set({ quizScore: s }),
}));
