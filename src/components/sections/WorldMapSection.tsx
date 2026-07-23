// src/components/sections/WorldMapSection.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { DINOSAURS } from '@/data/dinosaurs';
import { DIET_ICONS } from '@/lib/utils';
import type { Dinosaur } from '@/types';

const CONTINENTS = [
  { id: 'north-america', name: 'North America', emoji: '🌎',
    x: '18%', y: '32%', color: '#f97316',
    dinos: ['tyrannosaurus-rex','velociraptor','triceratops','brachiosaurus',
            'stegosaurus','pteranodon','ankylosaurus','quetzalcoatlus','parasaurolophus','dilophosaurus'] },
  { id: 'south-america', name: 'South America', emoji: '🌎',
    x: '26%', y: '62%', color: '#10b981',
    dinos: [] },
  { id: 'europe', name: 'Europe', emoji: '🌍',
    x: '48%', y: '28%', color: '#06b6d4',
    dinos: ['stegosaurus','mosasaurus'] },
  { id: 'africa', name: 'Africa', emoji: '🌍',
    x: '50%', y: '55%', color: '#f59e0b',
    dinos: ['spinosaurus'] },
  { id: 'asia', name: 'Asia', emoji: '🌏',
    x: '67%', y: '30%', color: '#8b5cf6',
    dinos: ['velociraptor'] },
  { id: 'australia', name: 'Australia', emoji: '🌏',
    x: '78%', y: '68%', color: '#ec4899',
    dinos: [] },
];

export default function WorldMapSection() {
  const [activeContinent, setActiveContinent] = useState<typeof CONTINENTS[0] | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true });

  const getDinos = (slugs: string[]): Dinosaur[] =>
    DINOSAURS.filter(d => slugs.includes(d.slug));

  return (
    <section
      id="worldmap"
      ref={sectionRef}
      className="py-28 md:py-36 bg-dino-charcoal/20 relative overflow-hidden"
      aria-labelledby="worldmap-title"
    >
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5
                          border border-dino-cyan/30 rounded-full bg-dino-cyan/5">
            <span className="text-dino-cyan text-xs font-mono tracking-widest uppercase">
              Prehistoric Geography
            </span>
          </div>
          <h2
            id="worldmap-title"
            className="font-display font-black text-[clamp(2.5rem,7vw,5rem)]
                       text-white leading-none tracking-tight mb-4"
          >
            Prehistoric <span className="text-dino-cyan">World Map</span>
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Click any continent to discover which giants roamed that ancient land
          </p>
        </motion.div>

        {/* Map container */}
        <div className="relative glass-card rounded-2xl p-4 md:p-8 mb-8">
          {/* World map (CSS-drawn continents) */}
          <div className="relative w-full" style={{ paddingBottom: '50%' }}>
            <div className="absolute inset-0 rounded-xl overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at 50% 80%, #061a2c, #020509)' }}>
              {/* Ocean grid lines */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
                  backgroundSize: '10% 10%',
                }} />

              {/* Continent markers */}
              {CONTINENTS.map((c) => {
                const hasDinos = c.dinos.length > 0;
                const isActive = activeContinent?.id === c.id;
                return (
                  <motion.button
                    key={c.id}
                    onClick={() => setActiveContinent(isActive ? null : c)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: c.x, top: c.y }}
                    aria-label={`${c.name} — ${hasDinos ? c.dinos.length + ' species' : 'No data'}`}
                  >
                    <motion.div
                      animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center
                                 justify-center text-lg cursor-pointer"
                      style={{
                        borderColor:     c.color,
                        backgroundColor: isActive ? `${c.color}30` : `${c.color}12`,
                        boxShadow:       isActive ? `0 0 25px ${c.color}60` : `0 0 10px ${c.color}25`,
                      }}
                    >
                      {c.emoji}
                      {hasDinos && (
                        <div
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                                     text-xs flex items-center justify-center font-bold font-mono"
                          style={{ backgroundColor: c.color, color: '#050505' }}
                        >
                          {c.dinos.length}
                        </div>
                      )}
                    </motion.div>
                    <span className="mt-1 text-xs font-mono text-white/50 whitespace-nowrap hidden md:block">
                      {c.name}
                    </span>
                  </motion.button>
                );
              })}

              {/* Glowing particles over ocean */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-dino-cyan"
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Continent detail panel */}
        <AnimatePresence>
          {activeContinent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card rounded-2xl p-6 md:p-8"
              style={{ borderColor: `${activeContinent.color}30` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2"
                  style={{ borderColor: activeContinent.color, backgroundColor: `${activeContinent.color}20` }}
                >
                  {activeContinent.emoji}
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-white">
                    {activeContinent.name}
                  </h3>
                  <p className="font-mono text-sm" style={{ color: activeContinent.color }}>
                    {activeContinent.dinos.length} species discovered
                  </p>
                </div>
              </div>

              {activeContinent.dinos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {getDinos(activeContinent.dinos).map((d) => (
                    <div
                      key={d.id}
                      className="bg-white/3 rounded-xl p-3 flex items-center gap-3 border border-white/5"
                    >
                      <span className="text-xl">{DIET_ICONS[d.diet]}</span>
                      <div>
                        <div className="font-bold text-white text-sm">{d.name}</div>
                        <div className="text-white/30 text-xs font-mono capitalize">{d.diet} · {d.period}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 font-mono text-center py-6">
                  No dinosaur fossil data available for this region yet
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continent legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {CONTINENTS.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveContinent(c.id === activeContinent?.id ? null : c)}
              className="px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5
                         border transition-all"
              style={{
                borderColor:     activeContinent?.id === c.id ? c.color : `${c.color}40`,
                color:           c.color,
                backgroundColor: activeContinent?.id === c.id ? `${c.color}15` : 'transparent',
              }}
              aria-pressed={activeContinent?.id === c.id}
            >
              {c.emoji} {c.name}
              {c.dinos.length > 0 && (
                <span className="opacity-60">({c.dinos.length})</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
