'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Deck, Card } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BookOpen, Play, ArrowLeft, Calendar, Zap } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200 } }
};

export default function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const res = await fetch(`/api/decks/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load deck');
        setDeck(data.deck);
        setCards(data.cards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deck');
      } finally {
        setLoading(false);
      }
    };
    fetchDeck();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading deck..." />;
  if (error) return (
    <div className="page-content">
      <div className="error-banner">{error}</div>
      <Link href="/decks" className="btn-secondary glass mt-4 inline-flex">
        <ArrowLeft size={16} /> Back to Decks
      </Link>
    </div>
  );
  if (!deck) return null;

  const today = new Date().toISOString().split('T')[0];
  const dueCards = cards.filter(c => c.next_review <= today);

  const difficultyCount = {
    easy: cards.filter(c => c.difficulty === 'easy').length,
    medium: cards.filter(c => c.difficulty === 'medium').length,
    hard: cards.filter(c => c.difficulty === 'hard').length,
  };

  return (
    <div className="page-content">
      {/* Header */}
      <motion.div
        className="deck-header bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-cyan-900/15 p-8 md:p-10 rounded-3xl border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.4)] backdrop-blur-md mb-10 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Background glow accent */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="deck-header-info flex-1 relative z-10">
          <Link href="/decks" className="btn-secondary glass hover:bg-white/10 mb-5 inline-flex shadow-sm text-sm py-2.5 px-4 gap-2">
            <ArrowLeft size={15} /> All Decks
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-white via-white/90 to-gray-300 bg-clip-text text-transparent drop-shadow-sm leading-tight mb-3">{deck.title}</h1>
          <p className="mt-1 text-gray-400 text-base leading-relaxed">
            <span className="text-white/70 font-medium">{cards.length}</span> flashcards
            {deck.source_filename && <span className="text-white/40 mx-2">·</span>}
            {deck.source_filename && <span className="text-accent/80">{deck.source_filename}</span>}
            <span className="text-white/40 mx-2">·</span>
            <span>Created {new Date(deck.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </p>
        </div>
        <div className="deck-header-actions flex gap-3 relative z-10">
          {dueCards.length > 0 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={`/review/${id}`} className="btn-primary shadow-[0_0_20px_rgba(34,211,238,0.4)]" id="start-review-btn">
                <Play size={18} /> Start Review ({dueCards.length} due)
              </Link>
            </motion.div>
          )}
          {dueCards.length === 0 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={`/review/${id}`} className="btn-secondary glass shadow-[0_0_15px_rgba(108,99,255,0.2)]" id="review-all-btn">
                <Zap size={18} className="text-purple-400" /> Review All
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="flex flex-wrap gap-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="glass px-6 py-4 rounded-xl flex items-center gap-3 border border-orange-500/20 shadow-[0_4px_15px_rgba(249,115,22,0.05)]">
          <Calendar size={18} className="text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
          <span className="font-semibold tracking-wide text-orange-50">{dueCards.length} due today</span>
        </div>
        <div className="glass px-6 py-4 rounded-xl flex items-center gap-3 border border-white/5 shadow-inner">
          <span className="badge badge-easy shadow-sm">{difficultyCount.easy} easy</span>
          <span className="badge badge-medium shadow-sm">{difficultyCount.medium} medium</span>
          <span className="badge badge-hard shadow-sm">{difficultyCount.hard} hard</span>
        </div>
      </motion.div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <motion.div
          className="empty-state glass py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="empty-icon bg-gradient-to-br from-cyan-500/20 to-purple-500/20"><BookOpen size={36} className="text-cyan-400" /></div>
          <p className="empty-title text-white">No cards in this deck</p>
        </motion.div>
      ) : (
        <motion.div
          className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01, z: 10 }}
              className="card-item glass relative overflow-hidden flex flex-col p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 hover:shadow-[0_8px_25px_rgba(0,212,255,0.1)] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-6xl font-display font-black italic">{i + 1}</span>
              </div>
              <div className="card-item-badges flex gap-2 mb-4 relative z-10">
                <span className={`badge badge-${card.difficulty}`}>{card.difficulty}</span>
                <span className={`badge badge-${card.type}`}>{card.type}</span>
              </div>
              <p className="card-item-question font-medium text-white mb-3 text-lg leading-snug drop-shadow-sm relative z-10">{card.question}</p>
              <p className="card-item-answer text-gray-400 text-sm mb-6 flex-1 line-clamp-4 relative z-10">{card.answer}</p>
              <div className="card-item-footer flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-white/5 relative z-10">
                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(card.next_review).toLocaleDateString()}</span>
                <span className="bg-white/5 px-2 py-1 rounded">Int: {card.interval}d</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
