// src/components/ui/CustomCursor.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface Print { id: number; x: number; y: number; rot: number; }

export default function CustomCursor() {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const sx = useSpring(mx, { stiffness: 500, damping: 30 });
  const sy = useSpring(my, { stiffness: 500, damping: 30 });

  const [prints, setPrints]   = useState<Print[]>([]);
  const [hover,  setHover]    = useState(false);
  const [click,  setClick]    = useState(false);
  const counter = useRef(0);
  const lastP   = useRef(0);

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const move = (e: MouseEvent) => {
      mx.set(e.clientX); my.set(e.clientY);
      const now = Date.now();
      if (now - lastP.current > 220) {
        lastP.current = now;
        const id = ++counter.current;
        setPrints(p => [...p.slice(-10), { id, x: e.clientX, y: e.clientY, rot: Math.random() * 50 - 25 }]);
        setTimeout(() => setPrints(p => p.filter(pr => pr.id !== id)), 1800);
      }
    };
    const dn = () => setClick(true);
    const up = () => setClick(false);

    const attachHover = () => {
      document.querySelectorAll('a,button,[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => setHover(true));
        el.addEventListener('mouseleave', () => setHover(false));
      });
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', dn);
    window.addEventListener('mouseup',   up);
    attachHover();
    const obs = new MutationObserver(attachHover);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', dn);
      window.removeEventListener('mouseup',   up);
      obs.disconnect();
    };
  }, [mx, my]);

  return (
    <>
      {prints.map(p => (
        <motion.div key={p.id}
          className="pointer-events-none fixed z-[9998] text-xs"
          style={{ left: p.x - 6, top: p.y - 6, rotate: p.rot }}
          animate={{ opacity: [0.7, 0], scale: [1, 1.8] }}
          transition={{ duration: 1.8 }}>
          🐾
        </motion.div>
      ))}

      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border"
        style={{
          left: sx, top: sy, x: '-50%', y: '-50%',
          width:        hover ? 46 : 32,
          height:       hover ? 46 : 32,
          borderColor:  hover ? '#f59e0b' : '#06b6d4',
          borderWidth:  hover ? 2 : 1.5,
          boxShadow:    hover ? '0 0 18px rgba(245,158,11,0.5)' : '0 0 10px rgba(6,182,212,0.35)',
        }}
        animate={{ scale: click ? 0.65 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      <motion.div
        className="pointer-events-none fixed z-[9999]"
        style={{ left: mx, top: my, x: '-50%', y: '-50%', fontSize: click ? '18px' : '14px' }}>
        🦕
      </motion.div>
    </>
  );
}
