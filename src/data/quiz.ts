// src/data/quiz.ts
import type { QuizQuestion } from '@/types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What does "Tyrannosaurus rex" literally translate to?',
    options: ['King of the lizards', 'Tyrant lizard king', 'Terror of the deep', 'Bone crusher supreme'],
    correct: 1,
    explanation: 'Tyrannosaurus comes from Greek "tyrannos" (tyrant) + "sauros" (lizard), and "rex" is Latin for king. Henry Fairfield Osborn named it in 1905.',
  },
  {
    id: 2,
    question: 'Which animal holds the record for the largest wingspan of any flying creature ever?',
    options: ['Pteranodon', 'Tapejara', 'Quetzalcoatlus', 'Dimorphodon'],
    correct: 2,
    explanation: 'Quetzalcoatlus northropi had a wingspan of up to 11 meters — larger than a small aircraft — making it the largest flying animal ever discovered on Earth.',
  },
  {
    id: 3,
    question: 'Were Velociraptors actually the size shown in Jurassic Park?',
    options: ['Yes, exactly that size', 'Bigger — closer to 3 meters', 'No — they were turkey-sized', 'Similar but without feathers'],
    correct: 2,
    explanation: 'Real Velociraptors were about the size of a large turkey (0.5 m tall, 2 m long) and fully feathered. The Jurassic Park version was closer to Deinonychus or Utahraptor.',
  },
  {
    id: 4,
    question: 'What was the primary purpose of Stegosaurus\'s back plates?',
    options: ['Pure armor for protection', 'Thermoregulation and display', 'Used as a weapon', 'Swimming aid'],
    correct: 1,
    explanation: 'The plates were richly vascularized (filled with blood vessels) and were primarily used for thermoregulation — absorbing heat or cooling off — and as colorful visual displays.',
  },
  {
    id: 5,
    question: 'Which period saw the very first true dinosaurs evolve?',
    options: ['Permian', 'Jurassic', 'Triassic', 'Cretaceous'],
    correct: 2,
    explanation: 'The first true dinosaurs appeared approximately 230 million years ago during the Triassic period, following the massive Permian extinction event that cleared ecological niches.',
  },
  {
    id: 6,
    question: 'What was Spinosaurus\'s primary food source?',
    options: ['Sauropods', 'Triceratops', 'Fish', 'Insects'],
    correct: 2,
    explanation: 'Spinosaurus was primarily piscivorous (fish-eating). Dense bones, high-placed nostrils, conical teeth, and paddle-like feet all confirm a semi-aquatic fish-hunting lifestyle.',
  },
  {
    id: 7,
    question: 'Are birds actually dinosaurs?',
    options: ['No — birds evolved separately', 'Yes — they are avian theropod dinosaurs', 'Partially — they share an ancestor', 'Only some birds are dinosaurs'],
    correct: 1,
    explanation: 'Birds ARE dinosaurs — specifically avian theropods descended from small feathered dinosaurs. They are the only dinosaur lineage that survived the K-Pg extinction 66 million years ago.',
  },
  {
    id: 8,
    question: 'Which dinosaur had the strongest bite force ever recorded?',
    options: ['Spinosaurus', 'Allosaurus', 'Tyrannosaurus rex', 'Mosasaurus'],
    correct: 2,
    explanation: 'T. rex had a bite force of up to 57,000 Newtons — the strongest bite force of any land animal ever measured, capable of crushing solid bone completely.',
  },
  {
    id: 9,
    question: 'What ended the age of non-avian dinosaurs 66 million years ago?',
    options: ['Volcanic winter only', 'Asteroid impact only', 'Sea level rise', 'Both asteroid impact AND intense volcanism'],
    correct: 3,
    explanation: 'The K-Pg extinction was caused by a combination: the Chicxulub asteroid (10 km wide) AND the Deccan Traps volcanic eruptions in India — creating a perfect extinction storm.',
  },
  {
    id: 10,
    question: 'How long is 66 million years in perspective?',
    options: [
      'If Earth\'s history is 1 year, dinosaurs died 4 days ago',
      'If Earth\'s history is 1 year, dinosaurs died yesterday',
      'About the same time as when humans evolved',
      'Approximately 10 million human generations',
    ],
    correct: 0,
    explanation: 'On the cosmic calendar (Earth\'s 4.5 billion years = 1 year), 66 million years ago is about December 28th — just 4 days before "midnight" on December 31st when humans appeared.',
  },
];
