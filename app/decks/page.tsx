'use client';

import { useEffect, useState } from 'react';
import { Deck } from '@/types';
import DeckCard from '@/components/DeckCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { BookOpen, Upload, ArrowRight } from 'lucide-react';

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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">My Decks</h1>
          <p className="page-subtitle">{decks.length} deck{decks.length !== 1 ? 's' : ''} — select one to start reviewing</p>
        </div>
        <Link href="/upload" className="btn-primary" id="new-deck-btn">
          <Upload size={18} /> New Deck
        </Link>
      </div>

      {error && <div className="error-banner" style={{ marginBottom: '24px' }}>{error}</div>}

      {decks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><BookOpen size={36} /></div>
          <p className="empty-title">No decks yet</p>
          <p className="empty-subtitle">Upload a PDF to create your first flashcard deck.</p>
          <Link href="/upload" className="btn-primary">
            <Upload size={18} /> Upload PDF <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="decks-grid">
          {decks.map(deck => (
            <DeckCard key={deck.id} deck={deck} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
