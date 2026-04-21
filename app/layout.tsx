import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Background3D from '@/components/Background3D';

export const metadata: Metadata = {
  title: 'RecallAI — AI-Powered Flashcard Learning System',
  description: 'Convert PDFs into high-quality flashcards and master any subject with AI-powered spaced repetition.',
  keywords: ['flashcards', 'spaced repetition', 'AI learning', 'study', 'PDF to flashcards'],
  authors: [{ name: 'Kinshuk Saxena' }],
  openGraph: {
    title: 'RecallAI — AI-Powered Flashcard Learning System',
    description: 'Convert PDFs into high-quality flashcards and master any subject with AI-powered spaced repetition.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased text-white">
        <Background3D />
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb bg-orb-1 opacity-5" />
          <div className="bg-orb bg-orb-2 opacity-5" />
          <div className="bg-orb bg-orb-3 opacity-5" />
        </div>
        <Navbar />
        <main className="page-wrapper relative z-10 block">
          {children}
        </main>
      </body>
    </html>
  );
}
