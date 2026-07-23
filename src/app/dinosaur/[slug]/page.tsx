// src/app/dinosaur/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getDinosaurBySlug, DINOSAURS } from '@/data/dinosaurs';
import DinosaurDetailClient from './DinosaurDetailClient';
import type { Metadata } from 'next';

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return DINOSAURS.map(d => ({ slug: d.id || d.slug }));
}
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dino = getDinosaurBySlug(params.slug);
  if (!dino) return { title: 'Not Found' };
  return {
    title:       `${dino.name} — ${dino.scientificName} | Dino World`,
    description: dino.description,
    openGraph:   { images: [dino.image] },
  };
}

export default function DinosaurPage({ params }: Props) {
  const dino = getDinosaurBySlug(params.slug);
  if (!dino) notFound();
  return <DinosaurDetailClient dino={dino} />;
}
