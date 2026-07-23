// src/components/sections/QuizSection.tsx
'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '@/data/quiz';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

type Phase = 'idle' | 'active' | 'complete';

export default function QuizSection() {
  const [phase,   setPhase]   = useState<Phase>('idle');
  const [qIndex,  setQIndex]  = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score,   setScore]   = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const { setQuizScore } = useStore();

  const sectionRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true });

  const current = QUIZ_QUESTIONS[qIndex];
  const total   = QUIZ_QUESTIONS.length;

  const startQuiz = () => {
    setPhase('active');
    setQIndex(0);
    setScore(0);
    setAnswers([]);
    setSelected(null);
  };

  const handleAnswer = useCallback((optIndex: number) => {
    if (selected !== null) return;
    setSelected(optIndex);
    const correct = optIndex === current.correct;
    const newScore = correct ? score + 1 : score;
    if (correct) setScore(newScore);
    setAnswers((prev) => [...prev, correct]);

    setTimeout(() => {
      if (qIndex < total - 1) {
        setQIndex((i) => i + 1);
        setSelected(null);
      } else {
        setPhase('complete');
        setQuizScore(newScore);
        if (newScore >= total * 0.7) {
          confetti({
            particleCount: 160,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#10b981', '#f59e0b', '#f97316'],
          });
        }
      }
    }, 1800);
  }, [selected, current, score, qIndex, total, setQuizScore]);

  const grade = score / total;
  const gradeLabel = grade >= 0.9 ? '🏆 Paleontologist!' :
                     grade >= 0.7 ? '🎖️ Dino Expert!'    :
                     grade >= 0.5 ? '🦕 Dino Fan!'        :
                                    '🥚 Keep Learning!';

  return (
    <section
      id="quiz"
      ref={sectionRef}
      className="py-28 md:py-36 bg-dino-black relative overflow-hidden"
      aria-labelledby="quiz-title"
    >
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5
                          border border-dino-emerald/30 rounded-full bg-dino-emerald/5">
            <span className="text-dino-emerald text-xs font-mono tracking-widest uppercase">
              Knowledge Test
            </span>
          </div>
          <h2
            id="quiz-title"
            className="font-display font-black text-[clamp(2.5rem,7vw,5rem)]
                       text-white leading-none tracking-tight mb-4"
          >
            Prehistoric <span className="text-dino-emerald">Quiz</span>
          </h2>
          <p className="text-white/50 text-lg max-w-md mx-auto">
            {total} questions to test your dinosaur knowledge
          </p>
        </motion.div>

        {/* Quiz body */}
        <AnimatePresence mode="wait">

          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-8 md:p-12 text-center"
            >
              <div className="text-7xl mb-6">🦕</div>
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Ready to test your knowledge?
              </h3>
              <p className="text-white/50 mb-8 max-w-sm mx-auto">
                {total} multiple-choice questions covering dinosaur science, anatomy, and prehistoric history.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-xs mx-auto">
                {[
                  { icon: '📋', label: 'Questions', value: total },
                  { icon: '⏱️', label: 'Timed',     value: 'No' },
                  { icon: '🏆', label: 'Score',     value: '100%' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/3 rounded-xl p-3">
                    <div className="text-xl mb-1">{s.icon}</div>
                    <div className="font-bold text-white font-mono">{s.value}</div>
                    <div className="text-white/30 text-xs font-mono">{s.label}</div>
                  </div>
                ))}
              </div>
              <motion.button
                onClick={startQuiz}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(16,185,129,0.5)' }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-3.5 bg-dino-emerald text-dino-black font-bold font-mono
                           text-sm tracking-widest uppercase rounded-xl"
                data-cursor
              >
                Start Quiz →
              </motion.button>
            </motion.div>
          )}

          {phase === 'active' && (
            <motion.div
              key={`q-${qIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-6 md:p-8"
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1">
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        i < qIndex  ? (answers[i] ? 'bg-dino-emerald' : 'bg-dino-lava') :
                        i === qIndex ? 'bg-dino-cyan w-6' : 'bg-white/10'
                      )}
                      style={{ width: i === qIndex ? undefined : '1rem' }}
                    />
                  ))}
                </div>
                <span className="text-white/40 text-xs font-mono">
                  {qIndex + 1} / {total}
                </span>
              </div>

              {/* Question */}
              <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-6 leading-snug">
                {current.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {current.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect  = i === current.correct;
                  const show       = selected !== null;

                  let bgClass = 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/25';
                  if (show && isCorrect)  bgClass = 'bg-dino-emerald/20 border-dino-emerald text-dino-emerald';
                  if (show && isSelected && !isCorrect) bgClass = 'bg-dino-lava/20 border-dino-lava text-dino-lava';

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selected !== null}
                      whileHover={selected === null ? { scale: 1.01 } : {}}
                      whileTap={selected === null ? { scale: 0.99 } : {}}
                      className={cn(
                        'w-full text-left px-5 py-3.5 rounded-xl border font-mono text-sm',
                        'transition-all duration-300 flex items-center gap-3',
                        bgClass
                      )}
                      aria-label={`Option ${i + 1}: ${opt}`}
                    >
                      <span className={cn(
                        'w-6 h-6 rounded-full border flex items-center justify-center text-xs flex-shrink-0',
                        show && isCorrect  ? 'border-dino-emerald text-dino-emerald' :
                        show && isSelected ? 'border-dino-lava text-dino-lava'       :
                                             'border-white/20 text-white/30'
                      )}>
                        {show && isCorrect ? '✓' : show && isSelected ? '✗' : String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {selected !== null && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={cn(
                      'rounded-xl p-4 text-sm font-mono leading-relaxed border overflow-hidden',
                      selected === current.correct
                        ? 'bg-dino-emerald/10 border-dino-emerald/30 text-dino-emerald/80'
                        : 'bg-dino-lava/10 border-dino-lava/30 text-dino-lava/80'
                    )}
                  >
                    <span className="font-bold">
                      {selected === current.correct ? '✓ Correct! ' : '✗ Incorrect. '}
                    </span>
                    {current.explanation}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Score running tally */}
              <div className="flex justify-between items-center mt-5">
                <span className="text-white/25 text-xs font-mono">
                  Score: {score} / {qIndex + (selected !== null ? 1 : 0)}
                </span>
                {selected === null && (
                  <span className="text-white/20 text-xs font-mono">Select an answer</span>
                )}
              </div>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-8 md:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-6xl mb-4"
              >
                {gradeLabel.split(' ')[0]}
              </motion.div>
              <h3 className="font-display text-3xl font-bold text-white mb-2">
                Quiz Complete!
              </h3>
              <p className="text-dino-cyan font-mono text-lg mb-1">{gradeLabel}</p>
              <p className="text-white/40 text-sm font-mono mb-8">
                You scored {score} out of {total} ({Math.round((score / total) * 100)}%)
              </p>

              {/* Score bar */}
              <div className="max-w-xs mx-auto mb-8">
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / total) * 100}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-dino-cyan to-dino-emerald"
                  />
                </div>
              </div>

              {/* Answer review */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {answers.map((correct, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold',
                      correct
                        ? 'bg-dino-emerald/20 border border-dino-emerald text-dino-emerald'
                        : 'bg-dino-lava/20 border border-dino-lava text-dino-lava'
                    )}
                    title={`Q${i + 1}: ${correct ? 'Correct' : 'Incorrect'}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              <motion.button
                onClick={startQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3 bg-dino-cyan text-dino-black font-bold font-mono
                           text-sm tracking-widest uppercase rounded-xl"
                data-cursor
              >
                Try Again →
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  );
}
