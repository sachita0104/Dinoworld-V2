// src/data/timeline.ts
import type { GeologicPeriod } from '@/types';

export const GEOLOGIC_PERIODS: GeologicPeriod[] = [
  {
    id: 'triassic', name: 'Triassic Period',
    start: 252, end: 201,
    emoji: '🌋',
    description: 'The Triassic marked the dawn of the dinosaur age following the greatest mass extinction in Earth\'s history — the Permian-Triassic event that wiped out 96% of marine life. The supercontinent Pangaea dominated the globe, creating vast arid interiors and strong seasonal monsoons. Early dinosaurs were small, bipedal opportunists that quickly diversified.',
    color: '#f97316',
    bgClass: 'from-orange-950/80 via-red-900/60 to-stone-950',
    climate: 'Hot and arid with strong seasonal monsoons. No polar ice caps. CO₂ levels 4–6× higher than today.',
    flora: 'Cycads, ferns, horsetails, seed ferns, and primitive conifers. No flowering plants yet.',
    events: [
      'Permian mass extinction (252 Ma) — 96% of species wiped out',
      'First true dinosaurs evolve (~230 Ma)',
      'First mammals appear (~225 Ma)',
      'First pterosaurs take flight (~228 Ma)',
      'Pangaea begins rifting apart',
      'End-Triassic extinction event (201 Ma)',
    ],
  },
  {
    id: 'jurassic', name: 'Jurassic Period',
    start: 201, end: 145,
    emoji: '🌿',
    description: 'The Jurassic was the golden age of giants. As Pangaea split into Laurasia and Gondwana, new shallow seaways brought humid climates and explosive vegetation growth. Titanosaur sauropods reached their maximum sizes, while the first birds evolved from small feathered theropod dinosaurs.',
    color: '#10b981',
    bgClass: 'from-emerald-950/80 via-green-900/60 to-teal-950',
    climate: 'Warm, humid greenhouse world. No polar ice. Lush equatorial forests extended into mid-latitudes.',
    flora: 'Dense conifer and cycad forests, tree ferns, ginkgo trees, and early flowering plant ancestors.',
    events: [
      'Sauropods reach maximum diversity and body size',
      'Allosaurus becomes dominant apex predator',
      'Archaeopteryx — first known bird (~150 Ma)',
      'Stegosaurus roams the Morrison Formation',
      'Atlantic Ocean begins opening',
      'First lizards diversify',
    ],
  },
  {
    id: 'cretaceous', name: 'Cretaceous Period',
    start: 145, end: 66,
    emoji: '🌺',
    description: 'The Cretaceous was the most diverse and dramatic dinosaur era. The first flowering plants revolutionized ecosystems, new dinosaur groups exploded in diversity, and vast inland seas teemed with enormous marine reptiles and giant sharks. The period ended catastrophically with the Chicxulub asteroid impact.',
    color: '#06b6d4',
    bgClass: 'from-cyan-950/80 via-blue-900/60 to-slate-950',
    climate: 'Initially warm, gradually cooling. Sea levels up to 300 m higher than today. CO₂ dropping toward modern levels.',
    flora: 'First flowering plants and deciduous trees. Diverse ferns, redwoods, magnolias, and early grasses.',
    events: [
      'First flowering plants diversify (~130 Ma)',
      'T. rex and Triceratops co-evolve in North America',
      'Mosasaurs dominate the Late Cretaceous seas',
      'Quetzalcoatlus — largest flying animal ever (~68 Ma)',
      'Deccan Traps volcanism begins (~66 Ma)',
      'Chicxulub asteroid impact — K-Pg extinction (66 Ma)',
    ],
  },
];
