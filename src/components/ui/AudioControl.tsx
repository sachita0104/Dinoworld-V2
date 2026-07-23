// src/components/ui/AudioControl.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

export default function AudioControl() {
  const { isMuted, masterVolume, toggleMute, setVolume } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="glass-card border border-white/10 rounded-2xl p-4 w-44"
          >
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">Volume</p>
            <input
              type="range" min={0} max={1} step={0.01}
              value={masterVolume}
              onChange={e => setVolume(+e.target.value)}
              className="w-full"
              aria-label="Master volume"
            />
            <div className="mt-2 text-center text-white/30 text-xs font-mono">
              {Math.round(masterVolume * 100)}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-2">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(o => !o)}
          className="w-10 h-10 rounded-full glass-card border border-white/10 flex items-center
                     justify-center text-white/50 hover:text-dino-cyan hover:border-dino-cyan/30"
          aria-label="Volume settings" data-cursor>
          🔊
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
            isMuted
              ? 'bg-dino-lava/20 border-dino-lava/50 text-dino-lava'
              : 'glass-card border-white/10 text-white/50 hover:text-dino-cyan hover:border-dino-cyan/30'
          }`}
          aria-label={isMuted ? 'Unmute' : 'Mute'} data-cursor>
          {isMuted ? '🔇' : '🔉'}
        </motion.button>
      </div>
    </div>
  );
}
