'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Rating } from '@/types';
import FlashCard from '@/components/FlashCard';
import RatingButtons from '@/components/RatingButtons';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, CheckCircle, RotateCcw, Home } from 'lucide-react';

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [cards, setCards] = useState<Card[]>([]);
  const [deckTitle, setDeckTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`/api/decks/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load deck');

        setDeckTitle(data.deck.title);

        // Prioritize due cards, then add the rest
        const today = new Date().toISOString().split('T')[0];
        const due = data.cards.filter((c: Card) => c.next_review <= today);
        const notDue = data.cards.filter((c: Card) => c.next_review > today);

        // Shuffle due cards for variety
        const shuffled = [...due].sort(() => Math.random() - 0.5);
        const reviewQueue = shuffled.length > 0 ? shuffled : [...notDue].sort(() => Math.random() - 0.5);

        if (reviewQueue.length === 0) {
          setCompleted(true);
        } else {
          setCards(reviewQueue);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cards');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [id]);

  const handleReveal = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const handleRate = useCallback(async (selectedRating: Rating) => {
    if (rating || !cards[currentIndex]) return;
    setRating(true);

    const currentCard = cards[currentIndex];

    try {
      await fetch('/api/review-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: currentCard.id, rating: selectedRating }),
      });
    } catch {
      // Continue even if API fails
    }

    setReviewedCount(prev => prev + 1);

    // Move to next card
    setTimeout(() => {
      if (currentIndex + 1 >= cards.length) {
        setCompleted(true);
      } else {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
        setRating(false);
      }
    }, 300);
  }, [rating, cards, currentIndex]);

  if (loading) return <LoadingSpinner text="Loading review session..." />;

  if (error) return (
    <div className="review-layout">
      <div className="error-banner">{error}</div>
      <Link href={`/deck/${id}`} className="btn-secondary" style={{ marginTop: '16px', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back to Deck
      </Link>
    </div>
  );

  if (completed) return (
    <div className="review-layout">
      <div className="review-complete">
        <div className="complete-icon">
          <CheckCircle size={40} />
        </div>
        <h1 className="complete-title">Session Complete!</h1>
        <p className="complete-subtitle">
          You reviewed {reviewedCount} card{reviewedCount !== 1 ? 's' : ''} from <strong>{deckTitle}</strong>.
          Great work — keep building your streak!
        </p>
        <div className="complete-actions">
          <Link href={`/review/${id}`} className="btn-primary" onClick={() => {
            setCurrentIndex(0); setCompleted(false); setReviewedCount(0);
          }}>
            <RotateCcw size={18} /> Review Again
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            <Home size={18} /> Dashboard
          </Link>
          <Link href={`/deck/${id}`} className="btn-secondary">
            <ArrowLeft size={18} /> Back to Deck
          </Link>
        </div>
      </div>
    </div>
  );

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;

  return (
    <div className="review-layout">
      {/* Header */}
      <div className="review-header">
        <Link href={`/deck/${id}`} className="btn-secondary">
          <ArrowLeft size={16} /> {deckTitle || 'Back'}
        </Link>
        <div className="review-progress">
          <div className="review-progress-label">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="review-flashcard-area">
        <FlashCard
          card={currentCard}
          showAnswer={showAnswer}
          onReveal={handleReveal}
        />
      </div>

      {/* Rating — only visible after reveal */}
      {showAnswer && (
        <div className="review-actions">
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            How well did you know this?
          </p>
          <RatingButtons onRate={handleRate} disabled={rating} />
        </div>
      )}
    </div>
  );
}
