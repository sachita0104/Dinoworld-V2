// src/components/ui/LoadingScreen.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress,  setProgress]  = useState(0);
  const [cracked,   setCracked]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(id); setCracked(true); return 100; }
        return p + Math.random() * 3.5;
      });
    }, 55);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!cracked) return;
    const t = setTimeout(() => { setDismissed(true); onComplete(); }, 2200);
    return () => clearTimeout(t);
  }, [cracked, onComplete]);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center
                     bg-dino-black overflow-hidden"
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Particles */}
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top:  `${Math.random() * 100}%`,
                width:  Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                backgroundColor: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#f59e0b' : '#10b981',
              }}
              animate={{ opacity: [0, 1, 0], y: [0, -60], scale: [0, 1.5, 0] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4 }}
            />
          ))}

          {/* Egg SVG */}
          <motion.div
            className="mb-8"
            animate={cracked
              ? { y: [-4, 4, -2, 2, 0], rotate: [-3, 3, -2, 2, 0] }
              : { y: [0, -8, 0] }}
            transition={cracked
              ? { duration: 0.4, ease: 'easeInOut' }
              : { duration: 2, repeat: Infinity }}
          >
            <svg width="130" height="165" viewBox="0 0 130 165">
              <defs>
                <radialGradient id="eg" cx="40%" cy="35%" r="65%">
                  <stop offset="0%"   stopColor="#e8dcc8" />
                  <stop offset="65%"  stopColor="#c49a50" />
                  <stop offset="100%" stopColor="#7a5514" />
                </radialGradient>
              </defs>
              <ellipse cx="65" cy="88" rx="48" ry="66" fill="url(#eg)" />
              {[[40,55],[85,48],[52,95],[80,105],[62,122]].map(([cx,cy],i) => (
                <ellipse key={i} cx={cx} cy={cy} rx="2.5" ry="1.8"
                  fill="#5a3a0a" opacity="0.35"
                  transform={`rotate(${i * 36} ${cx} ${cy})`} />
              ))}
              {cracked && (
                <g stroke="#f97316" strokeWidth="2.5" fill="none" opacity="0.9">
                  <path d="M 55 65 L 50 85 L 62 78 L 57 100" />
                  <path d="M 72 62 L 76 76 L 66 84 L 73 96" />
                  <path d="M 46 90 L 58 96" />
                  <path d="M 76 90 L 68 100" />
                </g>
              )}
              {cracked && (
                <motion.ellipse cx="65" cy="88" rx="42" ry="58" fill="#f97316"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.35, 0.15, 0.4, 0] }}
                  transition={{ duration: 1.8 }} />
              )}
            </svg>
            {cracked && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.35, type: 'spring' }}
                className="text-center text-4xl mt-2"
              >🦕</motion.div>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-display font-black text-5xl md:text-7xl tracking-widest mb-2
                       text-shimmer uppercase"
          >
            DINO WORLD
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-dino-cyan/50 tracking-[0.3em] text-xs uppercase font-mono mb-10"
          >
            Prehistoric Experience
          </motion.p>

          <div className="w-56 h-px bg-white/8 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-dino-cyan to-dino-emerald"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-2.5 text-white/25 text-xs font-mono tracking-widest">
            {Math.floor(Math.min(progress, 100))}%
          </p>

          {/* Scan line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-8">
            <motion.div
              className="absolute left-0 right-0 h-px bg-dino-cyan"
              animate={{ y: ['0vh', '100vh'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
