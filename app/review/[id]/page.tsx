'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Rating } from '@/types';
import FlashCard from '@/components/FlashCard';
import RatingButtons from '@/components/RatingButtons';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, CheckCircle, RotateCcw, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <Link href={`/deck/${id}`} className="btn-secondary glass mt-4 inline-flex">
        <ArrowLeft size={16} /> Back to Deck
      </Link>
    </div>
  );

  if (completed) return (
    <div className="review-layout">
      <motion.div 
        className="review-complete glass p-10 max-w-lg mx-auto text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="complete-icon bg-emerald-500/20 text-emerald-400 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)] animate-pulse">
          <CheckCircle size={48} />
        </div>
        <h1 className="complete-title text-3xl font-display font-bold text-white mb-4">Session Complete!</h1>
        <p className="complete-subtitle text-gray-300 mb-8 leading-relaxed">
          You reviewed <span className="text-emerald-400 font-bold">{reviewedCount}</span> card{reviewedCount !== 1 ? 's' : ''} from <strong className="text-white">{deckTitle}</strong>.
          <br />Great work — keep building your streak!
        </p>
        <div className="complete-actions flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={`/review/${id}`} className="btn-primary shadow-[0_0_20px_rgba(108,99,255,0.4)]" onClick={() => {
              setCurrentIndex(0); setCompleted(false); setReviewedCount(0);
            }}>
              <RotateCcw size={18} /> Review Again
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/dashboard" className="btn-secondary glass border border-white/10 hover:bg-white/10">
              <Home size={18} /> Dashboard
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const currentCard = cards[currentIndex];
  // Calculate progress properly
  const progress = cards.length > 0 ? (reviewedCount / cards.length) * 100 : 0;

  return (
    <div className="review-layout relative overflow-hidden">
      {/* Background radial gradient for focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl opacity-50" />

      {/* Header */}
      <motion.div 
        className="review-header flex flex-col sm:flex-row justify-between items-center mb-10 w-full max-w-4xl mx-auto gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href={`/deck/${id}`} className="btn-secondary glass border-white/10 hover:bg-white/10">
          <ArrowLeft size={16} /> {deckTitle || 'Back'}
        </Link>
        <div className="review-progress w-full sm:w-1/2">
          <div className="review-progress-label flex justify-between text-sm text-gray-400 font-medium mb-2">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span className="text-cyan-400">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="progress-fill h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-white/20 blur-[2px]" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Flashcard Area */}
      <div className="review-flashcard-area flex justify-center w-full relative z-10 flex-col items-center flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id + (showAnswer ? '-back' : '-front')}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full flex justify-center"
          >
            <FlashCard
              card={currentCard}
              showAnswer={showAnswer}
              onReveal={handleReveal}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating Buttons */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div 
            className="review-actions mt-8 w-full z-20 flex flex-col items-center gap-4 fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#080b14] via-[#080b14]/90 to-transparent pointer-events-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="pointer-events-auto w-full max-w-4xl mx-auto flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-gray-400 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                How well did you know this?
              </p>
              <div className="w-full">
                <RatingButtons onRate={handleRate} disabled={rating} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spacer to prevent hidden content at the bottom when review actions appear */}
      <div className="h-32 w-full flex-shrink-0" />
    </div>
  );
}
