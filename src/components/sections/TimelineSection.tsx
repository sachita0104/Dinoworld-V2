// src/components/sections/TimelineSection.tsx
'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { GEOLOGIC_PERIODS } from '@/data/timeline';
import { PERIOD_COLORS } from '@/lib/utils';
import type { GeologicPeriod } from '@/types';

function PeriodCard({ period, index, isActive, onClick }: {
  period: GeologicPeriod;
  index:  number;
  isActive: boolean;
  onClick:  () => void;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const durationMa = period.start - period.end;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="relative cursor-pointer group"
      data-cursor
    >
      {/* Timeline connector */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-px h-8"
        style={{ background: `linear-gradient(to bottom, transparent, ${period.color})` }} />
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-1 w-3 h-3 rounded-full border-2 z-10 transition-transform duration-300 group-hover:scale-150"
        style={{ backgroundColor: period.color, borderColor: period.color }}
      />

      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`glass-card rounded-2xl p-6 md:p-8 transition-all duration-300 ${
          isActive ? 'ring-2 ring-opacity-60' : 'hover:border-white/15'
        }`}
        style={isActive ? { ringColor: period.color } : {}}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{period.emoji}</span>
              <span
                className="text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ color: period.color, background: `${period.color}18` }}
              >
                {period.start}–{period.end} Ma
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl md:text-3xl text-white">
              {period.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-2xl" style={{ color: period.color }}>
              {durationMa}M
            </div>
            <div className="text-white/30 text-xs font-mono">years long</div>
          </div>
        </div>

        {/* Progress bar for duration */}
        <div className="mb-5 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${(durationMa / 186) * 100}%` } : {}}
            transition={{ delay: 0.5 + index * 0.15, duration: 1.2, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${period.color}, ${period.color}88)` }}
          />
        </div>

        <p className="text-white/60 text-sm leading-relaxed mb-5 line-clamp-3">
          {period.description}
        </p>

        {/* Climate & Flora */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/3 rounded-xl p-3">
            <div className="text-white/30 text-xs font-mono uppercase tracking-wide mb-1">🌡️ Climate</div>
            <p className="text-white/70 text-xs leading-relaxed">{period.climate}</p>
          </div>
          <div className="bg-white/3 rounded-xl p-3">
            <div className="text-white/30 text-xs font-mono uppercase tracking-wide mb-1">🌿 Flora</div>
            <p className="text-white/70 text-xs leading-relaxed">{period.flora}</p>
          </div>
        </div>

        {/* Events */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/5">
                <div className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
                  Key Events
                </div>
                <ul className="space-y-2">
                  {period.events.map((ev, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 text-sm text-white/60"
                    >
                      <span style={{ color: period.color }} className="mt-0.5 shrink-0">▸</span>
                      {ev}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="mt-3 text-xs font-mono tracking-wide transition-colors"
          style={{ color: period.color }}
          aria-expanded={isActive}
          aria-label={`${isActive ? 'Collapse' : 'Expand'} ${period.name} details`}
        >
          {isActive ? '▲ Show less' : '▼ Show key events'}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function TimelineSection() {
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(sectionRef, { once: true });

  const totalSpan = 252 - 66; // 186 million years

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative py-28 md:py-36 bg-dino-black overflow-hidden"
      aria-labelledby="timeline-title"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Particle emitters */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left:            `${Math.random() * 100}%`,
              top:             `${Math.random() * 100}%`,
              backgroundColor: Object.values(PERIOD_COLORS)[i % 3],
            }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -50] }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat:   Infinity,
              delay:    Math.random() * 8,
              ease:     'easeIn',
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5
                          border border-dino-emerald/30 rounded-full bg-dino-emerald/5">
            <span className="text-dino-emerald text-xs font-mono tracking-widest uppercase">
              Geologic Record
            </span>
          </div>
          <h2
            id="timeline-title"
            className="font-display font-black text-[clamp(2.5rem,7vw,5rem)]
                       text-white leading-none tracking-tight mb-4"
          >
            The Age of <span className="text-dino-emerald">Dinosaurs</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            186 million years of evolutionary history — from the first footsteps to the great extinction
          </p>
        </motion.div>

        {/* Global timeline bar */}
        <div className="mb-16 relative">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            {GEOLOGIC_PERIODS.map((p) => (
              <div
                key={p.id}
                className="absolute h-full rounded-full opacity-70"
                style={{
                  left:  `${((p.start - 66) / totalSpan) * 100}%`,
                  width: `${((p.start - p.end) / totalSpan) * 100}%`,
                  backgroundColor: p.color,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-white/30 text-xs font-mono">
            <span>252 Ma</span>
            <span className="text-dino-amber">TODAY →</span>
          </div>
        </div>

        {/* Period cards */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px
                          bg-gradient-to-b from-dino-lava via-dino-emerald to-dino-cyan
                          opacity-20 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {GEOLOGIC_PERIODS.map((period, i) => (
              <PeriodCard
                key={period.id}
                period={period}
                index={i}
                isActive={activePeriod === period.id}
                onClick={() =>
                  setActivePeriod((prev) => (prev === period.id ? null : period.id))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
