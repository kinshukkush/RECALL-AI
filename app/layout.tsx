import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

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
      <body>
        <div className="bg-orbs" aria-hidden="true">
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>
        <Navbar />
        <main className="page-wrapper">
          {children}
        </main>
      </body>
    </html>
  );
}
