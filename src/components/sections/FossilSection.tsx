// src/components/sections/FossilSection.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { DINOSAURS } from '@/data/dinosaurs';

type Cell = { revealed: boolean; hasFossil: boolean; brushCount: number };
const GRID_SIZE   = 8;
const FOSSIL_COUNT = 6;

function createGrid(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ revealed: false, hasFossil: false, brushCount: 0 }))
  );
  let placed = 0;
  while (placed < FOSSIL_COUNT) {
    const r = Math.floor(Math.random() * GRID_SIZE);
    const c = Math.floor(Math.random() * GRID_SIZE);
    if (!grid[r][c].hasFossil) { grid[r][c].hasFossil = true; placed++; }
  }
  return grid;
}

export default function FossilSection() {
  const [grid,     setGrid]     = useState<Cell[][]>(createGrid);
  const [found,    setFound]    = useState<number[]>([]);
  const [brushing, setBrushing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [reward,   setReward]   = useState<typeof DINOSAURS[0] | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true });

  const BRUSHES_TO_REVEAL = 3;

  const brush = useCallback((row: number, col: number) => {
    if (!brushing) return;
    setGrid(prev => {
      const next = prev.map(r => r.map(c => ({ ...c })));
      const cell = next[row][col];
      if (cell.revealed) return prev;
      cell.brushCount = Math.min(cell.brushCount + 1, BRUSHES_TO_REVEAL);
      if (cell.brushCount >= BRUSHES_TO_REVEAL) {
        cell.revealed = true;
        if (cell.hasFossil) {
          setFound(f => {
            const newFound = [...f, row * GRID_SIZE + col];
            if (newFound.length >= FOSSIL_COUNT) {
              setComplete(true);
              const rDino = DINOSAURS[Math.floor(Math.random() * DINOSAURS.length)];
              setReward(rDino);
            }
            return newFound;
          });
        }
      }
      return next;
    });
  }, [brushing]);

  const reset = () => {
    setGrid(createGrid());
    setFound([]);
    setComplete(false);
    setReward(null);
  };

  const totalRevealed = grid.flat().filter(c => c.revealed).length;
  const progress = (found.length / FOSSIL_COUNT) * 100;

  return (
    <section
      id="fossil"
      ref={sectionRef}
      className="py-28 md:py-36 bg-dino-charcoal/20 relative overflow-hidden"
      aria-labelledby="fossil-title"
    >
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5
                          border border-dino-amber/30 rounded-full bg-dino-amber/5">
            <span className="text-dino-amber text-xs font-mono tracking-widest uppercase">
              Interactive Lab
            </span>
          </div>
          <h2
            id="fossil-title"
            className="font-display font-black text-[clamp(2.5rem,7vw,5rem)]
                       text-white leading-none tracking-tight mb-4"
          >
            Fossil <span className="text-dino-amber">Excavation</span>
          </h2>
          <p className="text-white/50 text-lg max-w-md mx-auto">
            Hold click and drag over the grid to brush away sediment and uncover hidden fossils
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grid */}
          <div className="lg:col-span-2">
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/40 text-sm font-mono">
                {found.length} / {FOSSIL_COUNT} fossils found
              </span>
              <div className="flex items-center gap-2 text-sm font-mono text-white/30">
                <div className={`w-2 h-2 rounded-full ${brushing ? 'bg-dino-amber animate-pulse' : 'bg-white/20'}`} />
                {brushing ? 'Brushing...' : 'Hold to brush'}
              </div>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full bg-gradient-to-r from-dino-amber to-dino-lava rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Excavation grid */}
            <div
              className="relative rounded-2xl overflow-hidden border border-white/10 select-none"
              style={{ background: 'linear-gradient(135deg, #3d2f1a, #2a1f0f, #1a1305)' }}
              onMouseDown={() => setBrushing(true)}
              onMouseUp={() => setBrushing(false)}
              onMouseLeave={() => setBrushing(false)}
              onTouchStart={() => setBrushing(true)}
              onTouchEnd={() => setBrushing(false)}
            >
              {/* Sand texture overlay */}
              <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(200,160,80,0.1) 2px, rgba(200,160,80,0.1) 4px)' }}
              />

              <div
                className="grid"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              >
                {grid.map((row, ri) =>
                  row.map((cell, ci) => {
                    const opacity = 1 - (cell.brushCount / BRUSHES_TO_REVEAL) * 0.8;
                    return (
                      <div
                        key={`${ri}-${ci}`}
                        onMouseEnter={() => brush(ri, ci)}
                        onTouchMove={() => brush(ri, ci)}
                        className="relative flex items-center justify-center"
                        style={{
                          aspectRatio: '1',
                          cursor: 'crosshair',
                        }}
                      >
                        {/* Sand layer */}
                        {!cell.revealed && (
                          <div
                            className="absolute inset-0.5 rounded transition-opacity duration-200"
                            style={{
                              opacity,
                              background: `linear-gradient(135deg, #c8a050${Math.floor(opacity * 255).toString(16).padStart(2,'0')}, #8b6028${Math.floor(opacity * 200).toString(16).padStart(2,'0')})`,
                            }}
                          />
                        )}

                        {/* Fossil or empty */}
                        {cell.revealed && (
                          <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="text-xl z-10"
                          >
                            {cell.hasFossil ? '🦴' : '·'}
                          </motion.div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={reset}
                className="px-5 py-2 bg-white/5 border border-white/10 rounded-lg text-sm
                           font-mono text-white/60 hover:bg-white/10 transition-colors"
              >
                🔄 New Dig Site
              </button>
              <div className="flex-1 glass-card rounded-lg px-4 py-2 text-xs font-mono text-white/30
                              flex items-center">
                {totalRevealed} cells excavated · {GRID_SIZE * GRID_SIZE} total
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-mono text-sm text-white/40 uppercase tracking-widest mb-4">
                🔬 Lab Notes
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/50 font-mono">
                  <span>Grid size</span>
                  <span className="text-dino-amber">{GRID_SIZE}×{GRID_SIZE}</span>
                </div>
                <div className="flex justify-between text-white/50 font-mono">
                  <span>Hidden fossils</span>
                  <span className="text-dino-amber">{FOSSIL_COUNT}</span>
                </div>
                <div className="flex justify-between text-white/50 font-mono">
                  <span>Found</span>
                  <span className="text-dino-emerald">{found.length}</span>
                </div>
                <div className="flex justify-between text-white/50 font-mono">
                  <span>Remaining</span>
                  <span className="text-dino-lava">{FOSSIL_COUNT - found.length}</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-mono text-sm text-white/40 uppercase tracking-widest mb-3">
                🧪 How to Play
              </h3>
              <ol className="space-y-2 text-sm text-white/50 list-decimal list-inside">
                <li>Hold the mouse button down</li>
                <li>Move over the sandy grid</li>
                <li>Brush cells multiple times to reveal</li>
                <li>Find all {FOSSIL_COUNT} hidden fossils</li>
                <li>Unlock a dinosaur fact card!</li>
              </ol>
            </div>

            {/* Reward panel */}
            <AnimatePresence>
              {reward && complete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card rounded-2xl p-5 border"
                  style={{ borderColor: `${reward.color}40` }}
                >
                  <div className="text-2xl mb-2">🎉</div>
                  <h3 className="font-display font-bold text-white mb-1">
                    Fossil Unlocked!
                  </h3>
                  <p className="text-dino-amber text-sm font-mono mb-3">{reward.name}</p>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {reward.facts[0].body}
                  </p>
                  <div
                    className="mt-3 text-xs font-mono px-3 py-1 rounded-full inline-block"
                    style={{ color: reward.color, backgroundColor: `${reward.color}15`, border: `1px solid ${reward.color}30` }}
                  >
                    {reward.scientificName}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
