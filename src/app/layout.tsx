// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Dino World – Prehistoric Immersive Experience',
  description:
    'Explore 12 prehistoric species with cinematic 3D visuals, interactive timelines, fossil excavation, and immersive educational experiences.',
  keywords: [
    'dinosaurs',
    'prehistoric',
    'jurassic',
    'cretaceous',
    'triassic',
    'paleontology',
    '3D',
  ],
  manifest: '/manifest.json',
  openGraph: {
    title: 'Dino World',
    description: 'Journey through the Lost World of Prehistoric Giants',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
        width: 1200,
        height: 630,
        alt: 'Dino World',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050505] text-white antialiased selection:bg-amber-500/30 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}