'use client';

import Link from 'next/link';
import { Deck } from '@/types';
import { BookOpen, Calendar, Play, Trash2, Clock } from 'lucide-react';

interface DeckCardProps {
  deck: Deck & { due_count?: number };
  onDelete: (id: string) => void;
}

export default function DeckCard({ deck, onDelete }: DeckCardProps) {
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
    <div className="deck-card">
      <div className="deck-card-header">
        <div className="deck-icon-wrap">
          <BookOpen size={20} className="deck-icon" />
        </div>
        <button
          className="deck-delete-btn"
          onClick={handleDelete}
          aria-label="Delete deck"
          id={`delete-deck-${deck.id}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="deck-card-body">
        <h3 className="deck-title">{deck.title}</h3>
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
          <div className="deck-due-badge">
            <Clock size={13} />
            {deck.due_count} due today
          </div>
        )}
      </div>

      <div className="deck-card-footer">
        <Link href={`/deck/${deck.id}`} className="deck-view-btn">
          View Cards
        </Link>
        <Link href={`/review/${deck.id}`} className="deck-review-btn" id={`review-deck-${deck.id}`}>
          <Play size={15} />
          Review
        </Link>
      </div>
    </div>
  );
}
