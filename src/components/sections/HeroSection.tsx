// src/components/sections/HeroSection.tsx
'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Cloud, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/* ── Procedural T-Rex ────────────────────────────────────────────── */
function TRexMesh({ roaring }: { roaring: boolean }) {
  const group  = useRef<THREE.Group>(null);
  const head   = useRef<THREE.Group>(null);
  const jaw    = useRef<THREE.Mesh>(null);
  const tail   = useRef<THREE.Group>(null);
  const eyeL   = useRef<THREE.Mesh>(null);
  const eyeR   = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!group.current) return;
    // Breathing — body swell
    group.current.scale.y = 1 + Math.sin(t * 1.3) * 0.012;
    // Head sway
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.4) * 0.1;
      head.current.rotation.x = Math.sin(t * 0.7) * 0.03 + (roaring ? 0.15 : 0);
    }
    // Jaw
    if (jaw.current) {
      jaw.current.rotation.x = roaring
        ? 0.5 + Math.sin(t * 10) * 0.25
        : Math.abs(Math.sin(t * 1.8)) * 0.02;
    }
    // Tail
    if (tail.current) {
      tail.current.rotation.y = Math.sin(t * 0.6) * 0.15;
      tail.current.rotation.z = Math.sin(t * 0.8) * 0.05;
    }
    // Eye glow blink
    if (eyeL.current && eyeR.current) {
      const blink = Math.sin(t * 0.5) > 0.97 ? 0 : 1;
      (eyeL.current.material as THREE.MeshStandardMaterial).emissiveIntensity = blink * 2.5;
      (eyeR.current.material as THREE.MeshStandardMaterial).emissiveIntensity = blink * 2.5;
    }
  });

  const body = '#2a3040';
  const dark = '#1a1f2c';
  const skin = '#3d4860';

  return (
    <group ref={group} position={[0, -1.5, 0]} scale={[0.9, 0.9, 0.9]}>
      {/* Torso */}
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[1.5, 14, 10]} />
        <meshStandardMaterial color={body} roughness={0.88} metalness={0.05} />
      </mesh>
      <mesh position={[0, 2.1, 0.25]}>
        <sphereGeometry args={[1.1, 10, 8]} />
        <meshStandardMaterial color={skin} roughness={0.85} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 4.1, 0.15]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.78, 1.6, 10]} />
        <meshStandardMaterial color={body} roughness={0.85} />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 5.3, 0.55]}>
        <mesh>
          <boxGeometry args={[1.0, 0.78, 1.5]} />
          <meshStandardMaterial color={body} roughness={0.82} />
        </mesh>
        {/* Snout */}
        <mesh position={[0, -0.12, 0.88]}>
          <boxGeometry args={[0.75, 0.5, 0.8]} />
          <meshStandardMaterial color={skin} roughness={0.82} />
        </mesh>
        {/* Upper teeth */}
        {[-0.28, 0, 0.28].map((x, i) => (
          <mesh key={i} position={[x, -0.38, 0.9]}>
            <coneGeometry args={[0.055, 0.22, 4]} />
            <meshStandardMaterial color="#f0ebe0" roughness={0.25} />
          </mesh>
        ))}
        {/* Lower jaw */}
        <mesh ref={jaw} position={[0, -0.44, 0.3]}>
          <boxGeometry args={[0.7, 0.22, 1.15]} />
          <meshStandardMaterial color={dark} roughness={0.85} />
        </mesh>
        {/* Eyes */}
        <mesh ref={eyeL} position={[-0.36, 0.18, 0.5]}>
          <sphereGeometry args={[0.115, 10, 10]} />
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={2.5} roughness={0.2} />
        </mesh>
        <mesh ref={eyeR} position={[0.36, 0.18, 0.5]}>
          <sphereGeometry args={[0.115, 10, 10]} />
          <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={2.5} roughness={0.2} />
        </mesh>
        {/* Brow ridges */}
        {[-0.35, 0.35].map((x, i) => (
          <mesh key={i} position={[x, 0.34, 0.42]}>
            <boxGeometry args={[0.28, 0.1, 0.22]} />
            <meshStandardMaterial color={dark} roughness={0.8} />
          </mesh>
        ))}
        {/* Crest spines */}
        {[0.1, 0.4, 0.7].map((z, i) => (
          <mesh key={i} position={[0, 0.5, z - 0.6]}>
            <coneGeometry args={[0.055 - i * 0.01, 0.24 + i * 0.04, 4]} />
            <meshStandardMaterial color={dark} roughness={0.75} />
          </mesh>
        ))}
        {/* Roar glow */}
        {roaring && (
          <pointLight color="#f97316" intensity={5} distance={8} />
        )}
      </group>

      {/* Arms */}
      {([-1, 1] as const).map((side, i) => (
        <group key={i} position={[side * 0.95, 3.0, 0.5]}>
          <mesh rotation={[0.4, 0, side * 0.5]}>
            <cylinderGeometry args={[0.13, 0.09, 0.75, 7]} />
            <meshStandardMaterial color={body} roughness={0.85} />
          </mesh>
          {/* Claws */}
          {[0, 1].map((c) => (
            <mesh key={c} position={[side * 0.08, -0.45, 0.1 + c * 0.08]}
              rotation={[0.5, 0, side * 0.2]}>
              <coneGeometry args={[0.03, 0.14, 4]} />
              <meshStandardMaterial color={dark} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Thighs & lower legs */}
      {([-1, 1] as const).map((side, i) => (
        <group key={i}>
          <mesh position={[side * 0.72, 1.3, 0.18]} rotation={[0.25, 0, side * 0.18]}>
            <cylinderGeometry args={[0.4, 0.3, 1.5, 10]} />
            <meshStandardMaterial color={body} roughness={0.85} />
          </mesh>
          <mesh position={[side * 0.78, 0.2, 0.52]} rotation={[-0.45, 0, side * 0.12]}>
            <cylinderGeometry args={[0.25, 0.2, 1.3, 9]} />
            <meshStandardMaterial color={dark} roughness={0.85} />
          </mesh>
          {/* Foot */}
          <mesh position={[side * 0.8, -0.6, 0.82]}>
            <boxGeometry args={[0.38, 0.18, 0.62]} />
            <meshStandardMaterial color={dark} roughness={0.9} />
          </mesh>
          {/* Toe claws */}
          {[-0.12, 0, 0.12].map((x, ci) => (
            <mesh key={ci} position={[side * 0.8 + x, -0.72, 1.12]}
              rotation={[0.4, 0, 0]}>
              <coneGeometry args={[0.04, 0.18, 4]} />
              <meshStandardMaterial color={dark} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Tail */}
      <group ref={tail} position={[0, 2.2, -1.4]}>
        <mesh rotation={[-0.35, 0, 0]}>
          <cylinderGeometry args={[0.56, 0.2, 2.8, 10]} />
          <meshStandardMaterial color={body} roughness={0.85} />
        </mesh>
        <mesh position={[0, -1.5, -0.95]} rotation={[-0.7, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.04, 1.4, 7]} />
          <meshStandardMaterial color={dark} roughness={0.85} />
        </mesh>
      </group>

      {/* Dorsal ridge */}
      {[0, 0.4, 0.8, 1.2, 1.6].map((z, i) => (
        <mesh key={i} position={[0, 4.3 - i * 0.08, -z]} rotation={[0.1 * i, 0, 0]}>
          <coneGeometry args={[0.055, 0.28 + i * 0.03, 4]} />
          <meshStandardMaterial color={dark} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Volcano ──────────────────────────────────────────────────────── */
function Volcano({ pos }: { pos: [number, number, number] }) {
  const smokeRef = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (smokeRef.current) {
      smokeRef.current.position.y = pos[1] + 6.5 + Math.sin(t * 0.6) * 0.4;
      smokeRef.current.scale.setScalar(1 + Math.sin(t * 0.9) * 0.2);
      (smokeRef.current.material as THREE.MeshBasicMaterial).opacity = 0.28 + Math.sin(t) * 0.08;
    }
    if (glowRef.current) {
      glowRef.current.intensity = 3 + Math.sin(t * 3 + pos[0]) * 1.5;
    }
  });
  return (
    <group position={pos}>
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[3.5, 9, 9]} />
        <meshStandardMaterial color="#111318" roughness={0.95} metalness={0.05} />
      </mesh>
      <mesh position={[0, 8.1, 0]}>
        <cylinderGeometry args={[0.75, 1.3, 0.6, 9]} />
        <meshStandardMaterial color="#f97316" emissive="#ea580c" emissiveIntensity={3} />
      </mesh>
      <mesh ref={smokeRef} position={[0, 9, 0]}>
        <sphereGeometry args={[1.8, 9, 9]} />
        <meshBasicMaterial color="#2a2a2a" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <pointLight ref={glowRef} position={[0, 8, 0]} color="#f97316" intensity={3} distance={28} />
    </group>
  );
}

/* ── Ground ──────────────────────────────────────────────────────── */
function Ground() {
  return (
    <mesh position={[0, -2.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[120, 80, 1, 1]} />
      <meshStandardMaterial color="#0f1318" roughness={0.97} metalness={0.02} />
    </mesh>
  );
}

/* ── Fog Plane ───────────────────────────────────────────────────── */
function FogDrift() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = Math.sin(clock.elapsedTime * 0.04) * 5;
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.14 + Math.sin(clock.elapsedTime * 0.25) * 0.05;
  });
  return (
    <mesh ref={ref} position={[0, -1.2, -1]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 50]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.14} depthWrite={false} />
    </mesh>
  );
}

/* ── Camera Shake ─────────────────────────────────────────────────── */
function ShakeCamera({ active }: { active: boolean }) {
  const { camera } = useThree();
  const base = useRef(new THREE.Vector3(0, 2, 12));
  useFrame(() => {
    if (active) {
      camera.position.x = base.current.x + (Math.random() - 0.5) * 0.12;
      camera.position.y = base.current.y + (Math.random() - 0.5) * 0.08;
    } else {
      camera.position.lerp(base.current, 0.06);
    }
  });
  return null;
}

/* ── Scene Lights ─────────────────────────────────────────────────── */
function SceneLights({ roaring }: { roaring: boolean }) {
  const fillRef = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (fillRef.current) {
      fillRef.current.intensity = roaring
        ? 8 + Math.sin(clock.elapsedTime * 15) * 4
        : 1.2;
    }
  });
  return (
    <>
      <ambientLight intensity={0.18} color="#1a2535" />
      <directionalLight position={[-8, 12, 5]} intensity={1.2} color="#c8d8f0" castShadow />
      <directionalLight position={[6, 3, -4]}  intensity={0.5} color="#f97316" />
      <pointLight ref={fillRef} position={[0, 6, 6]} color="#06b6d4" intensity={1.2} distance={22} />
      <pointLight position={[0, 0, 3]} color="#10b981" intensity={0.4} distance={15} />
    </>
  );
}

/* ── Main Hero Section ────────────────────────────────────────────── */
export default function HeroSection() {
  const [roaring, setRoaring] = useState(false);
  const [showRoarText, setShowRoarText] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const y1  = useTransform(scrollY, [0, 600], [0, -180]);
  const op  = useTransform(scrollY, [0, 500], [1, 0]);

  /* Roar cycle every 25-35 seconds */
  useEffect(() => {
    const scheduleRoar = () => {
      const delay = 25000 + Math.random() * 10000;
      return setTimeout(() => {
        setRoaring(true);
        setShowRoarText(true);
        setTimeout(() => { setRoaring(false); setShowRoarText(false); }, 2600);
        scheduleRoar();
      }, delay);
    };
    const id = scheduleRoar();
    return () => clearTimeout(id);
  }, []);

  const handleExplore = () => {
    document.querySelector('#timeline')?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleMeet = () => {
    document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-dino-black"
      aria-label="Hero — Prehistoric World"
    >
      {/* ── 3D Canvas ─────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 2, 12], fov: 60 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <fog attach="fog" args={['#050810', 22, 70]} />
          <SceneLights roaring={roaring} />
          <ShakeCamera active={roaring} />

          <Suspense fallback={null}>
            <TRexMesh roaring={roaring} />
            <Volcano pos={[-18, -2, -20]} />
            <Volcano pos={[22,  -2, -28]} />
            <Volcano pos={[-32, -2, -36]} />
            <Ground />
            <FogDrift />

            <Stars radius={100} depth={50} count={4000} factor={3} saturation={0.3} fade speed={0.5} />

            <Sparkles
              count={120}
              scale={[24, 10, 12]}
              size={1.2}
              speed={0.25}
              opacity={0.6}
              color="#06b6d4"
              position={[0, 1, 0]}
            />
            <Sparkles
              count={60}
              scale={[18, 6, 8]}
              size={0.8}
              speed={0.15}
              opacity={0.4}
              color="#f97316"
              position={[0, -1.2, 0]}
            />

            <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.4}>
              <Cloud
                position={[-12, 7, -18]}
                opacity={0.18}
                speed={0.15}
                segments={16}
              />
            </Float>
            <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.3}>
              <Cloud
                position={[14, 9, -24]}
                opacity={0.14}
                speed={0.1}
                width={18}
                depth={2}
                segments={14}
              />
            </Float>
          </Suspense>
        </Canvas>
      </div>

      {/* ── Gradient Overlays ─────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-dino-black via-transparent to-dino-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-dino-black/60 via-transparent to-dino-black/60 pointer-events-none" />

      {/* ── Roar Flash ────────────────────────────────────────────── */}
      <AnimatePresence>
        {roaring && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0, 0.18, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, times: [0, 0.1, 0.3, 0.5, 1] }}
            style={{ background: 'radial-gradient(circle at 50% 40%, rgba(249,115,22,0.4), transparent 70%)' }}
          />
        )}
      </AnimatePresence>

      {/* ── Hero Text ─────────────────────────────────────────────── */}
      <motion.div
        style={{ y: y1, opacity: op }}
        className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4 text-center
                   pointer-events-none select-none"
      >
        {/* Period badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mb-6 px-4 py-1.5 border border-dino-cyan/30 rounded-full
                     bg-dino-cyan/5 backdrop-blur-sm"
        >
          <span className="text-dino-cyan text-xs font-mono tracking-[0.3em] uppercase">
            66 — 252 Million Years Ago
          </span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-[clamp(4rem,15vw,11rem)]
                     leading-none tracking-tighter text-shimmer mb-4"
        >
          DINOSAURS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-dino-bone/70 text-[clamp(0.875rem,2.5vw,1.25rem)]
                     font-light tracking-wide max-w-xl mb-10"
        >
          Journey Through the Lost World of Prehistoric Giants
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 pointer-events-auto"
        >
          <motion.button
            onClick={handleExplore}
            whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(6,182,212,0.5)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 bg-dino-cyan text-dino-black font-bold font-mono
                       text-sm tracking-widest uppercase rounded-lg hover:bg-dino-cyan-glow
                       transition-colors shadow-glow-cyan"
          >
            Explore
          </motion.button>
          <motion.button
            onClick={handleMeet}
            whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(245,158,11,0.4)' }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 border border-dino-amber/40 text-dino-amber
                       font-bold font-mono text-sm tracking-widest uppercase rounded-lg
                       hover:bg-dino-amber/10 transition-all backdrop-blur-sm"
          >
            Meet the Dinosaurs
          </motion.button>
        </motion.div>

        {/* Roar text */}
        <AnimatePresence>
          {showRoarText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.3, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute top-1/3 glow-text-lava font-display font-black
                         text-5xl md:text-7xl text-dino-lava tracking-widest select-none"
            >
              ROAAARRR!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Scroll Indicator ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-dino-cyan to-transparent"
        />
      </motion.div>

      {/* ── Stats strip ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-0 inset-x-0 z-20 border-t border-white/5
                   bg-dino-black/60 backdrop-blur-xl"
      >
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-around items-center
                        flex-wrap gap-2">
          {[
            { label: 'Species Discovered', value: '1,000+' },
            { label: 'Years Dominant',     value: '165M'   },
            { label: 'Largest Predator',   value: '15 m'   },
            { label: 'Mass Extinctions',   value: '5'      },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-dino-cyan font-mono font-bold text-lg md:text-xl">
                {s.value}
              </div>
              <div className="text-white/30 text-xs font-mono tracking-wide">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
