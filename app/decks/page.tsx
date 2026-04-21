'use client';

import { useEffect, useState } from 'react';
import { Deck } from '@/types';
import DeckCard from '@/components/DeckCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { BookOpen, Upload, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function DecksPage() {
  const [decks, setDecks] = useState<(Deck & { due_count?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      const res = await fetch('/api/decks');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch decks');
      setDecks(data.decks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch decks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deckId: string) => {
    try {
      const res = await fetch(`/api/decks?id=${deckId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      setDecks(prev => prev.filter(d => d.id !== deckId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete deck');
    }
  };

  if (loading) return <LoadingSpinner text="Loading decks..." />;

  return (
    <div className="page-content">
      <motion.div 
        className="page-header flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="page-title text-white">My Decks</h1>
          <p className="page-subtitle text-gray-400">{decks.length} deck{decks.length !== 1 ? 's' : ''} — select one to start reviewing</p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/upload" className="btn-primary shadow-[0_0_15px_rgba(108,99,255,0.4)]" id="new-deck-btn">
            <Upload size={18} /> New Deck
          </Link>
        </motion.div>
      </motion.div>

      {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-banner mb-6">{error}</motion.div>}

      {decks.length === 0 ? (
        <motion.div 
          className="empty-state glass"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="empty-icon bg-gradient-to-br from-purple-500/20 to-cyan-500/20"><BookOpen size={36} className="text-cyan-400 drop-shadow-md" /></div>
          <p className="empty-title text-white">No decks yet</p>
          <p className="empty-subtitle text-gray-400">Upload a PDF to create your first flashcard deck.</p>
          <Link href="/upload" className="btn-primary shadow-lg shadow-purple-500/30">
            <Upload size={18} /> Upload PDF <ArrowRight size={16} />
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="decks-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {decks.map(deck => (
              <motion.div key={deck.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                <DeckCard deck={deck} onDelete={handleDelete} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
