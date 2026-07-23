// src/components/sections/CompareSection.tsx
'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { DINOSAURS } from '@/data/dinosaurs';
import { useStore } from '@/store/useStore';
import { cn, DIET_ICONS } from '@/lib/utils';
import type { Dinosaur } from '@/types';

const METRICS: Array<{ key: keyof Dinosaur['stats']; label: string; unit: string; max: number; icon: string }> = [
  { key: 'height',    label: 'Height',     unit: 'm',   max: 15,    icon: '📏' },
  { key: 'length',    label: 'Length',     unit: 'm',   max: 30,    icon: '↔️' },
  { key: 'weight',    label: 'Weight',     unit: 'kg',  max: 60000, icon: '⚖️' },
  { key: 'speed',     label: 'Speed',      unit: 'km/h',max: 150,   icon: '⚡' },
  { key: 'biteForce', label: 'Bite Force', unit: 'N',   max: 60000, icon: '🦷' },
  { key: 'lifespan',  label: 'Lifespan',   unit: 'yrs', max: 120,   icon: '🕐' },
  { key: 'iq',        label: 'Intelligence',unit: '/100',max: 100,  icon: '🧠' },
];

function DinoSelector({
  label, value, onChange,
}: { label: string; value: Dinosaur | null; onChange: (d: Dinosaur | null) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full glass-card rounded-xl p-4 text-left flex items-center gap-3
                   hover:border-white/20 transition-colors"
        aria-expanded={open}
        aria-label={`Select ${label}`}
      >
        {value ? (
          <>
            <span className="text-2xl">{DIET_ICONS[value.diet]}</span>
            <div>
              <div className="font-bold text-white">{value.name}</div>
              <div className="text-white/35 text-xs font-mono italic">{value.scientificName}</div>
            </div>
          </>
        ) : (
          <>
            <span className="text-2xl opacity-30">🦕</span>
            <div className="text-white/30 font-mono text-sm">{label}</div>
          </>
        )}
        <svg className="w-4 h-4 text-white/30 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 glass-card
                       border border-white/10 rounded-xl overflow-hidden max-h-64 overflow-y-auto"
          >
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full px-4 py-2.5 text-left text-white/30 text-sm font-mono
                         hover:bg-white/5 transition-colors border-b border-white/5"
            >
              — Clear selection —
            </button>
            {DINOSAURS.map((d) => (
              <button
                key={d.id}
                onClick={() => { onChange(d); setOpen(false); }}
                className={cn(
                  'w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 transition-colors',
                  'flex items-center gap-2',
                  value?.id === d.id && 'bg-white/8'
                )}
              >
                <span>{DIET_ICONS[d.diet]}</span>
                <span className="text-white">{d.name}</span>
                <span className="text-white/30 text-xs ml-auto font-mono italic">{d.scientificName}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricBar({ metric, valueA, valueB, colorA, colorB }: {
  metric: typeof METRICS[0];
  valueA: number;
  valueB: number;
  colorA: string;
  colorB: string;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const pctA = (valueA / metric.max) * 100;
  const pctB = (valueB / metric.max) * 100;
  const winner = valueA > valueB ? 'A' : valueB > valueA ? 'B' : 'tie';

  return (
    <div ref={ref} className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white/50 font-mono">
          {metric.icon} {metric.label}
        </span>
        <span className="text-xs font-mono text-white/30">{metric.unit}</span>
      </div>

      <div className="space-y-1.5">
        {/* Bar A */}
        <div className="flex items-center gap-2">
          <div className="w-12 text-xs font-mono text-right" style={{ color: colorA }}>
            {valueA.toLocaleString()}
          </div>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${pctA}%` } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: colorA }}
            />
          </div>
          {winner === 'A' && <span className="text-xs text-dino-amber">★</span>}
        </div>

        {/* Bar B */}
        <div className="flex items-center gap-2">
          <div className="w-12 text-xs font-mono text-right" style={{ color: colorB }}>
            {valueB.toLocaleString()}
          </div>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${pctB}%` } : {}}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: colorB }}
            />
          </div>
          {winner === 'B' && <span className="text-xs text-dino-amber">★</span>}
        </div>
      </div>
    </div>
  );
}

export default function CompareSection() {
  const { compareA, compareB, setCompareA, setCompareB } = useStore();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true });

  return (
    <section
      id="compare"
      ref={sectionRef}
      className="py-28 md:py-36 bg-dino-charcoal/30 relative overflow-hidden"
      aria-labelledby="compare-title"
    >
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5
                          border border-dino-lava/30 rounded-full bg-dino-lava/5">
            <span className="text-dino-lava text-xs font-mono tracking-widest uppercase">
              Species Comparison
            </span>
          </div>
          <h2
            id="compare-title"
            className="font-display font-black text-[clamp(2.5rem,7vw,5rem)]
                       text-white leading-none tracking-tight mb-4"
          >
            Battle of the <span className="text-dino-lava">Giants</span>
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Select two species and compare their vital statistics head-to-head
          </p>
        </motion.div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <DinoSelector label="Select Dinosaur A" value={compareA} onChange={setCompareA} />
          <DinoSelector label="Select Dinosaur B" value={compareB} onChange={setCompareB} />
        </div>

        {/* VS badge */}
        {compareA && compareB && (
          <div className="flex items-center justify-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-14 h-14 rounded-full bg-dino-lava/20 border-2 border-dino-lava/50
                         flex items-center justify-center font-black text-dino-lava text-lg"
            >
              VS
            </motion.div>
          </div>
        )}

        {/* Comparison display */}
        {compareA && compareB ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-6 md:p-8"
          >
            {/* Names header */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-center">
              <div>
                <div className="text-2xl mb-1">{DIET_ICONS[compareA.diet]}</div>
                <div className="font-display font-bold text-xl" style={{ color: compareA.color }}>
                  {compareA.name}
                </div>
                <div className="text-white/30 text-xs font-mono italic">{compareA.scientificName}</div>
              </div>
              <div>
                <div className="text-2xl mb-1">{DIET_ICONS[compareB.diet]}</div>
                <div className="font-display font-bold text-xl" style={{ color: compareB.color }}>
                  {compareB.name}
                </div>
                <div className="text-white/30 text-xs font-mono italic">{compareB.scientificName}</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mb-6 text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: compareA.color }} />
                <span style={{ color: compareA.color }}>{compareA.name}</span>
              </div>
              <div className="text-white/20">|</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: compareB.color }} />
                <span style={{ color: compareB.color }}>{compareB.name}</span>
              </div>
              <div className="text-white/20">|</div>
              <div className="flex items-center gap-2">
                <span className="text-dino-amber">★</span>
                <span className="text-white/40">Winner</span>
              </div>
            </div>

            {/* Metric bars */}
            {METRICS.map((m) => (
              <MetricBar
                key={m.key}
                metric={m}
                valueA={compareA.stats[m.key]}
                valueB={compareB.stats[m.key]}
                colorA={compareA.color}
                colorB={compareB.color}
              />
            ))}

            {/* Habitat & Period info */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
              {[compareA, compareB].map((d, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/30 font-mono">Period</span>
                    <span className="capitalize font-mono" style={{ color: d.color }}>{d.period}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/30 font-mono">Diet</span>
                    <span className="capitalize font-mono text-white/70">{d.diet}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/30 font-mono">Habitat</span>
                    <span className="capitalize font-mono text-white/70">{d.habitat}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/30 font-mono">Continents</span>
                    <span className="font-mono text-white/70 text-right max-w-[120px]">
                      {d.continents.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass-card rounded-2xl"
          >
            <div className="text-5xl mb-4">⚔️</div>
            <p className="text-white/30 font-mono">Select two dinosaurs above to begin the comparison</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
