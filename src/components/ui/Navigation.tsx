// src/components/ui/Navigation.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { label: 'Timeline',  href: '#timeline' },
  { label: 'Dinosaurs', href: '#gallery'  },
  { label: 'World Map', href: '#worldmap' },
  { label: 'Compare',   href: '#compare'  },
  { label: 'Fossil Lab',href: '#fossil'   },
  { label: 'Quiz',      href: '#quiz'     },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-dino-black/85 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 3.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 group" aria-label="Back to top">
          <span className="text-xl">🦕</span>
          <span className="font-display font-black text-white tracking-widest text-sm uppercase
                           group-hover:text-dino-amber transition-colors">
            DINO<span className="text-dino-cyan">WORLD</span>
          </span>
        </button>

        <ul className="hidden md:flex items-center gap-1" role="menubar">
          {LINKS.map(l => (
            <li key={l.href} role="none">
              <button onClick={() => go(l.href)}
                className="relative px-3 py-2 text-white/55 hover:text-white text-sm
                           font-mono tracking-wide transition-colors group"
                role="menuitem">
                {l.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-dino-cyan
                                 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
          ))}
        </ul>

        <motion.button
          onClick={() => go('#gallery')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:flex px-4 py-2 bg-dino-cyan/10 border border-dino-cyan/30
                     text-dino-cyan text-sm font-mono rounded-lg hover:bg-dino-cyan/20
                     hover:border-dino-cyan/50 transition-all"
          data-cursor
        >
          Explore →
        </motion.button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 p-2 hover:text-white"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <div className="w-6 flex flex-col gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.span key={i} className="block h-px bg-current"
                animate={
                  i === 0 ? { rotate: open ? 45  : 0, y: open ? 8 : 0 } :
                  i === 1 ? { opacity: open ? 0  : 1 } :
                            { rotate: open ? -45 : 0, y: open ? -8 : 0 }
                } />
            ))}
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-dino-black/96 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <ul className="px-4 py-4 flex flex-col gap-1">
              {LINKS.map(l => (
                <li key={l.href}>
                  <button onClick={() => go(l.href)}
                    className="w-full text-left px-4 py-3 text-white/65 hover:text-dino-cyan
                               font-mono text-sm rounded-lg hover:bg-white/5 transition-colors">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
