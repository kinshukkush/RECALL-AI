'use client';

import Link from 'next/link';
import { Deck } from '@/types';
import { BookOpen, Calendar, Play, Trash2, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeckCardProps {
  deck: Deck & { due_count?: number };
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export default function DeckCard({ deck, onDelete, isDeleting }: DeckCardProps) {
  const createdAt = new Date(deck.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm(`Delete "${deck.title}"? This cannot be undone.`)) {
      onDelete(deck.id);
    }
  };

  return (
    <motion.div 
      className="deck-card glass relative overflow-hidden group perspective-container"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -5,
        rotateX: 2,
        rotateY: -2,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-primary to-accent rounded-l-lg opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-all duration-300 pointer-events-none" />

      <div className="deck-card-header relative z-10">
        <div className="deck-icon-wrap bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
          <BookOpen size={20} className="deck-icon text-gray-300 group-hover:text-primary-light transition-colors" />
        </div>
        <button
          className="deck-delete-btn hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete deck"
          id={`delete-deck-${deck.id}`}
        >
          {isDeleting ? <Loader2 size={16} className="animate-spin text-red-400" /> : <Trash2 size={16} />}
        </button>
      </div>

      <div className="deck-card-body relative z-10">
        <h3 className="deck-title text-white group-hover:text-primary-light transition-colors truncate" title={deck.title}>{deck.title}</h3>
        <div className="deck-meta">
          <span className="deck-meta-item">
            <BookOpen size={13} />
            {deck.card_count} cards
          </span>
          <span className="deck-meta-item">
            <Calendar size={13} />
            {createdAt}
          </span>
        </div>
        {(deck.due_count ?? 0) > 0 && (
          <div className="deck-due-badge bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Clock size={13} />
            {deck.due_count} due today
          </div>
        )}
      </div>

      <div className="deck-card-footer relative z-10 border-t border-white/10 mt-4 pt-4 flex justify-between items-center">
        <Link href={`/deck/${deck.id}`} className="deck-view-btn text-sm text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-white/5">
          View Cards
        </Link>
        <Link href={`/review/${deck.id}`} className="deck-review-btn flex items-center gap-1.5 px-4 py-2 bg-primary/20 text-primary-light hover:bg-primary hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.6)] rounded-md transition-all duration-300 font-medium" id={`review-deck-${deck.id}`}>
          <Play size={15} />
          Review
        </Link>
      </div>
    </motion.div>
  );
}
