// src/app/dinosaur/[slug]/DinosaurDetailClient.tsx
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Dinosaur } from '@/types';
import { PERIOD_COLORS, DIET_ICONS, HABITAT_ICONS, formatNumber } from '@/lib/utils';
import { DINOSAURS } from '@/data/dinosaurs';

export default function DinosaurDetailClient({ dino }: { dino: Dinosaur }) {
  const related = DINOSAURS.filter(
    d => d.id !== dino.id && (d.period === dino.period || d.diet === dino.diet)
  ).slice(0, 3);

  const STATS_CONFIG = [
    { key: 'height',    label: 'Height',      unit: 'm',    icon: '📏', max: 15    },
    { key: 'length',    label: 'Length',       unit: 'm',    icon: '↔️', max: 30   },
    { key: 'weight',    label: 'Weight',       unit: 'kg',   icon: '⚖️', max: 60000 },
    { key: 'speed',     label: 'Top Speed',    unit: 'km/h', icon: '⚡', max: 150   },
    { key: 'biteForce', label: 'Bite Force',   unit: 'N',    icon: '🦷', max: 60000 },
    { key: 'lifespan',  label: 'Lifespan',     unit: 'yrs',  icon: '🕐', max: 120   },
    { key: 'iq',        label: 'Intelligence', unit: '/100', icon: '🧠', max: 100   },
  ] as const;

  return (
    <main className="min-h-screen bg-dino-black" aria-label={`${dino.name} detail page`}>
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/#gallery">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card border border-white/10 rounded-xl px-4 py-2 text-sm
                       font-mono text-white/60 hover:text-white hover:border-white/25
                       flex items-center gap-2 transition-colors"
          >
            ← Back
          </motion.div>
        </Link>
      </div>

      {/* Hero */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src={dino.image}
          alt={dino.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dino-black via-dino-black/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${dino.glowColor}40, transparent 70%)` }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest"
                style={{ color: PERIOD_COLORS[dino.period], backgroundColor: `${PERIOD_COLORS[dino.period]}18`,
                         border: `1px solid ${PERIOD_COLORS[dino.period]}30` }}>
                {dino.period} · {dino.periodStart}–{dino.periodEnd} Ma
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest
                               bg-white/5 border border-white/10 text-white/60">
                {DIET_ICONS[dino.diet]} {dino.diet}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest
                               bg-white/5 border border-white/10 text-white/60">
                {HABITAT_ICONS[dino.habitat]} {dino.habitat}
              </span>
            </div>
            <h1 className="font-display font-black text-[clamp(3rem,10vw,7rem)]
                           leading-none tracking-tight text-white mb-2">
              {dino.name}
            </h1>
            <p className="text-white/40 font-mono italic text-lg md:text-xl">
              {dino.scientificName}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="font-display font-bold text-2xl text-white mb-4">About</h2>
              <p className="text-white/65 leading-relaxed text-lg mb-4">{dino.description}</p>
              <p className="text-white/50 leading-relaxed">{dino.behavior}</p>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="font-display font-bold text-2xl text-white mb-6">Statistics</h2>
              <div className="space-y-5">
                {STATS_CONFIG.map((s) => {
                  const val = dino.stats[s.key as keyof typeof dino.stats];
                  const pct = Math.min((val / s.max) * 100, 100);
                  return (
                    <div key={s.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-white/50 font-mono">{s.icon} {s.label}</span>
                        <span className="font-mono font-bold" style={{ color: dino.color }}>
                          {formatNumber(val)} {s.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${dino.color}, ${dino.glowColor})` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Facts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="font-display font-bold text-2xl text-white mb-6">Key Facts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dino.facts.map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="bg-white/3 border border-white/5 rounded-xl p-4 hover:border-white/12
                               transition-colors"
                  >
                    <div className="text-2xl mb-2">{fact.icon}</div>
                    <div className="font-bold text-sm text-white mb-1" style={{ color: dino.color }}>
                      {fact.title}
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed">{fact.body}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6">
              <h3 className="font-mono text-sm text-white/40 uppercase tracking-widest mb-4">
                📋 Profile
              </h3>
              {[
                { label: 'Period',    value: `${dino.period} (${dino.periodStart}–${dino.periodEnd} Ma)` },
                { label: 'Diet',     value: `${DIET_ICONS[dino.diet]} ${dino.diet}` },
                { label: 'Habitat',  value: `${HABITAT_ICONS[dino.habitat]} ${dino.habitat}` },
                { label: 'Continents', value: dino.continents.join(', ') },
                { label: 'Discovered', value: `${dino.discoveryYear}` },
                { label: 'Found at', value: dino.discoveryPlace },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-white/35 text-xs font-mono">{item.label}</span>
                  <span className="text-white/70 text-xs font-mono text-right max-w-[55%]">{item.value}</span>
                </div>
              ))}
            </motion.div>

            {/* Food chain */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6">
              <h3 className="font-mono text-sm text-white/40 uppercase tracking-widest mb-4">
                🍖 Food Chain
              </h3>
              {dino.predators.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-dino-lava font-mono mb-2 uppercase tracking-wide">
                    ⬆ Predators
                  </div>
                  {dino.predators.map((p, i) => (
                    <div key={i} className="text-white/55 text-sm py-1 border-b border-white/5 last:border-0">
                      {p}
                    </div>
                  ))}
                </div>
              )}
              {dino.prey.length > 0 && (
                <div>
                  <div className="text-xs text-dino-emerald font-mono mb-2 uppercase tracking-wide">
                    ⬇ Prey / Diet
                  </div>
                  {dino.prey.map((p, i) => (
                    <div key={i} className="text-white/55 text-sm py-1 border-b border-white/5 last:border-0">
                      {p}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Human size comparison */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
              className="glass-card rounded-2xl p-6">
              <h3 className="font-mono text-sm text-white/40 uppercase tracking-widest mb-4">
                👤 Size vs Human
              </h3>
              <div className="flex items-end justify-center gap-6">
                <div className="text-center">
                  <div
                    className="w-10 mx-auto rounded-t-lg mb-1"
                    style={{
                      height: `${Math.max((dino.stats.height / 15) * 120, 8)}px`,
                      backgroundColor: dino.color,
                      opacity: 0.8,
                    }}
                  />
                  <div className="text-xs font-mono" style={{ color: dino.color }}>
                    {dino.name}
                  </div>
                  <div className="text-white/30 text-xs font-mono">{dino.stats.height}m</div>
                </div>
                <div className="text-center">
                  <div className="w-6 mx-auto rounded-t-lg mb-1 bg-white/30"
                    style={{ height: `${(1.8 / 15) * 120}px` }} />
                  <div className="text-xs font-mono text-white/40">Human</div>
                  <div className="text-white/30 text-xs font-mono">1.8m</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display font-bold text-3xl text-white mb-8">
              Related Species
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.id} href={`/dinosaur/${r.slug}`}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="glass-card rounded-xl overflow-hidden border border-white/5
                               hover:border-white/15 transition-colors"
                    data-cursor
                  >
                    <div className="relative h-32">
                      <Image src={r.image} alt={r.name} fill sizes="400px" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <div className="font-bold text-white text-sm">{r.name}</div>
                        <div className="text-white/40 text-xs font-mono italic">{r.scientificName}</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
