'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Static imports for critical path
import LoadingScreen from '@/components/ui/LoadingScreen';
import Navigation from '@/components/ui/Navigation';
import ScrollProgress from '@/components/ui/ScrollProgress';
import AudioControl from '@/components/ui/AudioControl';

// Dynamic imports to reduce initial bundle
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), {
  ssr: false,
});
const HeroSection = dynamic(
  () => import('@/components/sections/HeroSection'),
  { ssr: false }
);
const TimelineSection = dynamic(
  () => import('@/components/sections/TimelineSection')
);
const GallerySection = dynamic(
  () => import('@/components/sections/GallerySection')
);
const CompareSection = dynamic(
  () => import('@/components/sections/CompareSection')
);
const WorldMapSection = dynamic(
  () => import('@/components/sections/WorldMapSection')
);
const FossilSection = dynamic(
  () => import('@/components/sections/FossilSection')
);
const QuizSection = dynamic(
  () => import('@/components/sections/QuizSection')
);

// Lenis smooth scroll
function LenisInit() {
  useEffect(() => {
    let lenis: any;
    const init = async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    };
    init();
    return () => lenis?.destroy();
  }, []);
  return null;
}

// Konami Code Easter Egg
function KonamiWatcher({ onActivate }: { onActivate: () => void }) {
  useEffect(() => {
    const CODE = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    let seq: string[] = [];
    const handler = (e: KeyboardEvent) => {
      seq = [...seq, e.key].slice(-CODE.length);
      if (seq.join(',') === CODE.join(',')) onActivate();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onActivate]);
  return null;
}

// Footer
function Footer() {
  return (
    <footer className="bg-dino-black border-t border-white/5 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦖</span>
            <span className="font-display font-black text-white tracking-widest text-sm uppercase">
              DINO<span className="text-dino-cyan">WORLD</span>
            </span>
          </div>
          <p className="text-white/25 text-xs font-mono text-center">
            Educational content inspired by real paleontological research.
          </p>
          <p className="text-white/15 text-xs font-mono">
            © {new Date().getFullYear()} DinoWorld
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-white/20">
          {[
            'Next.js 14',
            'React Three Fiber',
            'Framer Motion',
            'TypeScript',
            'Tailwind CSS',
            'Lenis',
          ].map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded bg-white/3 border border-white/5"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [indominus, setIndominus] = useState(false);

  const handleLoaded = useCallback(() => setLoaded(true), []);
  const activateEaster = useCallback(() => {
    setIndominus(true);
    if (typeof window !== 'undefined') {
      document.documentElement.style.filter =
        'hue-rotate(160deg) saturate(1.5)';
      setTimeout(() => {
        document.documentElement.style.filter = '';
        setIndominus(false);
      }, 8000);
    }
  }, []);

  return (
    <>
      <LoadingScreen onComplete={handleLoaded} />
      {loaded && (
        <>
          <LenisInit />
          <KonamiWatcher onActivate={activateEaster} />
          <CustomCursor />
          <ScrollProgress />
          <Navigation />
          <AudioControl />

          {indominus && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-dino-lava/90 backdrop-blur-xl rounded-full border border-dino-lava text-white font-mono font-bold text-sm animate-pulse">
              🦖 INDOMINUS REX MODE ACTIVATED
            </div>
          )}

          <main>
            <HeroSection />
            <TimelineSection />
            <GallerySection />
            <WorldMapSection />
            <CompareSection />
            <FossilSection />
            <QuizSection />
          </main>

          <Footer />
        </>
      )}
    </>
  );
}