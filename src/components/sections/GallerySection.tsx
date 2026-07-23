// src/components/sections/GallerySection.tsx
'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import { filterDinosaurs } from '@/data/dinosaurs';
import { cn, PERIOD_COLORS, DIET_ICONS, HABITAT_ICONS } from '@/lib/utils';
import type { Dinosaur } from '@/types';

const DIETS    = ['all', 'carnivore', 'herbivore', 'piscivore', 'omnivore'];
const PERIODS  = ['all', 'triassic', 'jurassic', 'cretaceous'];
const HABITATS = ['all', 'terrestrial', 'aerial', 'aquatic', 'semi-aquatic'];

function DinoCard({ dino, index, onSelect }: { dino: Dinosaur; index: number; onSelect: (dino:Dinosaur)=> void; }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div onClick={() => onSelect(dino)} aria-label={`View ${dino.name} details`}>
        <motion.div
          whileHover={{
            y: -10,
            scale: 1.02,
            boxShadow: `0 25px 60px rgba(0,0,0,0.8), 0 0 40px ${dino.glowColor}30`,
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="glass-card rounded-2xl overflow-hidden group cursor-pointer
                     border border-white/5 hover:border-white/15 transition-colors"
          data-cursor
        >
          {/* Image */}
          <div className="relative h-44 overflow-hidden">
            <Image
              src={dino.image}
              alt={dino.name}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Period badge */}
            <div
              className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-mono
                         uppercase tracking-wide"
              style={{ backgroundColor: `${PERIOD_COLORS[dino.period]}25`,
                       color: PERIOD_COLORS[dino.period],
                       border: `1px solid ${PERIOD_COLORS[dino.period]}40` }}
            >
              {dino.period}
            </div>

            {/* Special badges */}
            {dino.isFlying  && (
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-purple-500/20
                              border border-purple-400/40 flex items-center justify-center text-sm">
                🦅
              </div>
            )}
            {dino.isAquatic && (
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-cyan-500/20
                              border border-cyan-400/40 flex items-center justify-center text-sm">
                🌊
              </div>
            )}

            {/* Glow on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 80%, ${dino.glowColor}20, transparent 70%)`,
              }}
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-display font-bold text-xl text-white group-hover:text-dino-bone
                             transition-colors leading-tight">
                {dino.name}
              </h3>
              <span className="text-lg">{DIET_ICONS[dino.diet]}</span>
            </div>
            <p className="text-white/35 text-xs font-mono italic mb-3">{dino.scientificName}</p>

            <p className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-4">
              {dino.description}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
              {[
                { label: 'Height', value: `${dino.stats.height}m`,  icon: '📏' },
                { label: 'Weight', value: `${(dino.stats.weight / 1000).toFixed(1)}t`, icon: '⚖️' },
                { label: 'Speed',  value: `${dino.stats.speed}km/h`, icon: '⚡' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xs text-white/25 font-mono mb-0.5">{stat.icon}</div>
                  <div className="font-mono font-bold text-sm" style={{ color: dino.color }}>
                    {stat.value}
                  </div>
                  <div className="text-white/25 text-[10px] font-mono uppercase">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* View button */}
            <motion.div
              className="mt-4 flex items-center justify-between"
            >
              <div className="flex gap-1">
                {dino.facts.slice(0, 3).map((f) => (
                  <span key={f.title} className="text-base" title={f.title}>{f.icon}</span>
                ))}
              </div>
              <span
                className="text-xs font-mono tracking-wide transition-colors"
                style={{ color: dino.color }}
              >
                View Details →
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function GallerySection() {
  const { searchQuery, filterDiet, filterPeriod, filterHabitat,
          setSearch, setFilterDiet, setFilterPeriod, setFilterHabitat } = useStore();
  const [selectedDino, setSelectedDino] = useState<Dinosaur | null>(null);        

  const results = useMemo(
    () => filterDinosaurs(searchQuery, filterDiet, filterPeriod, filterHabitat),
    [searchQuery, filterDiet, filterPeriod, filterHabitat]
  );

  const titleRef = useRef<HTMLDivElement>(null);
  const inView   = useInView(titleRef, { once: true });

  return (
    <section
      id="gallery"
      className="py-28 md:py-36 bg-dino-black relative overflow-hidden"
      aria-labelledby="gallery-title"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5
                          border border-dino-amber/30 rounded-full bg-dino-amber/5">
            <span className="text-dino-amber text-xs font-mono tracking-widest uppercase">
              Species Database
            </span>
          </div>
          <h2
            id="gallery-title"
            className="font-display font-black text-[clamp(2.5rem,7vw,5rem)]
                       text-white leading-none tracking-tight mb-4"
          >
            Meet the <span className="text-dino-amber">Giants</span>
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Explore {results.length} prehistoric species with full scientific profiles
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-10 space-y-4"
        >
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search by name or scientific name…"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4
                         text-white placeholder-white/25 font-mono text-sm outline-none
                         focus:border-dino-cyan/50 focus:bg-dino-cyan/5 transition-all"
              aria-label="Search dinosaurs"
            />
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {/* Diet filter */}
            <div className="flex gap-1 flex-wrap justify-center">
              {DIETS.map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDiet(d)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-mono tracking-wide transition-all capitalize',
                    filterDiet === d
                      ? 'bg-dino-cyan text-dino-black font-bold'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/8'
                  )}
                  aria-pressed={filterDiet === d}
                >
                  {d === 'all' ? '🦕 All Diet' : `${DIET_ICONS[d]} ${d}`}
                </button>
              ))}
            </div>

            {/* Period filter */}
            <div className="flex gap-1 flex-wrap justify-center">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPeriod(p)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-mono tracking-wide transition-all capitalize',
                    filterPeriod === p
                      ? 'text-dino-black font-bold'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/8'
                  )}
                  style={filterPeriod === p
                    ? { backgroundColor: PERIOD_COLORS[p] || '#06b6d4' }
                    : {}}
                  aria-pressed={filterPeriod === p}
                >
                  {p === 'all' ? '⏳ All Periods' : p}
                </button>
              ))}
            </div>

            {/* Habitat filter */}
            <div className="flex gap-1 flex-wrap justify-center">
              {HABITATS.map((h) => (
                <button
                  key={h}
                  onClick={() => setFilterHabitat(h)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-mono tracking-wide transition-all capitalize',
                    filterHabitat === h
                      ? 'bg-dino-emerald text-dino-black font-bold'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/8'
                  )}
                  aria-pressed={filterHabitat === h}
                >
                  {h === 'all' ? '🌍 All Habitats' : `${HABITAT_ICONS[h]} ${h}`}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Result count */}
        <motion.p
          key={results.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/30 text-sm font-mono mb-8"
        >
          Showing {results.length} species
        </motion.p>

        {/* Cards grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map((dino, i) => (
              <DinoCard key={dino.id} dino={dino} index={i} onSelect={setSelectedDino} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="text-5xl mb-4">🦕</div>
            <p className="text-white/40 font-mono text-lg">No species match your search</p>
            <button
              onClick={() => { setSearch(''); setFilterDiet('all'); setFilterPeriod('all'); setFilterHabitat('all'); }}
              className="mt-4 text-dino-cyan font-mono text-sm hover:underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
      ```tsx
{/* MODAL POPUP */}
{selectedDino && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
    <div className="relative max-w-2xl w-full bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 text-white shadow-2xl overflow-hidden">
      
      {/* Close Button */}
      <button 
        onClick={() => setSelectedDino(null)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white bg-slate-800 p-2 rounded-full transition cursor-pointer"
      >
        ✕
      </button>

      {/* Modal Content */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <img 
          src={selectedDino.image} 
          alt={selectedDino.name} 
          className="w-full md:w-1/2 h-64 object-contain bg-slate-950 rounded-xl p-2 border border-slate-800"
        />
        <div className="flex-1 space-y-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded-full">
            {selectedDino.period || 'Mesozoic'}
          </span>
          <h2 className="text-3xl font-bold text-white">{selectedDino.name}</h2>
          <p className="text-sm italic text-gray-400">{selectedDino.scientificName}</p>
          <p className="text-sm text-gray-300 leading-relaxed">{selectedDino.description}</p>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center">
            <div className="bg-slate-800/50 p-2 rounded-lg">
              <span className="block text-xs text-gray-400">Height</span>
              <span className="text-sm font-bold text-cyan-400">{selectedDino.stats?.height ? `${selectedDino.stats.height}m` : 'N/A'}</span>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg">
              <span className="block text-xs text-gray-400">Weight</span>
              <span className="text-sm font-bold text-amber-400">{selectedDino.stats?.weight ? `${selectedDino.stats.weight}kg` : 'N/A'}</span>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg">
              <span className="block text-xs text-gray-400">Speed</span>
              <span className="text-sm font-bold text-emerald-400">{selectedDino.stats?.speed ? `${selectedDino.stats.speed}km/h` : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
)}
    </section>
  );
}
