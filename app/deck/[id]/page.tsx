'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Deck, Card } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BookOpen, Play, ArrowLeft, Calendar, Zap } from 'lucide-react';

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
      <Link href="/decks" className="btn-secondary" style={{ marginTop: '16px', display: 'inline-flex' }}>
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
      <div className="deck-header">
        <div className="deck-header-info">
          <Link href="/decks" className="btn-secondary" style={{ marginBottom: '16px', display: 'inline-flex' }}>
            <ArrowLeft size={16} /> All Decks
          </Link>
          <h1 className="page-title">{deck.title}</h1>
          <p className="page-subtitle">
            {cards.length} flashcards
            {deck.source_filename && ` · from ${deck.source_filename}`}
            {' · '}Created {new Date(deck.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="deck-header-actions">
          {dueCards.length > 0 && (
            <Link href={`/review/${id}`} className="btn-primary" id="start-review-btn">
              <Play size={18} /> Start Review ({dueCards.length} due)
            </Link>
          )}
          {dueCards.length === 0 && (
            <Link href={`/review/${id}`} className="btn-secondary" id="review-all-btn">
              <Zap size={18} /> Review All
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div className="stats-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={18} color="var(--warning)" />
          <span style={{ fontWeight: 600 }}>{dueCards.length} due today</span>
        </div>
        <div className="stats-card" style={{ padding: '16px 24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="badge badge-easy">{difficultyCount.easy} easy</span>
          <span className="badge badge-medium">{difficultyCount.medium} medium</span>
          <span className="badge badge-hard">{difficultyCount.hard} hard</span>
        </div>
      </div>

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><BookOpen size={36} /></div>
          <p className="empty-title">No cards in this deck</p>
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map((card, i) => (
            <div key={card.id} className="card-item">
              <div className="card-item-badges">
                <span className={`badge badge-${card.difficulty}`}>{card.difficulty}</span>
                <span className={`badge badge-${card.type}`}>{card.type}</span>
              </div>
              <p className="card-item-question">{i + 1}. {card.question}</p>
              <p className="card-item-answer">{card.answer}</p>
              <div className="card-item-footer">
                <span>Next review: {new Date(card.next_review).toLocaleDateString()}</span>
                <span>Interval: {card.interval}d</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
