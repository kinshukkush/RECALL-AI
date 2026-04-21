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

    // Fire and forget to not block UI
    fetch('/api/review-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: currentCard.id, rating: selectedRating }),
    }).catch(console.error);

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
    <div className="review-layout min-h-screen relative overflow-hidden flex flex-col pt-24 pb-12 px-4">
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

      {/* Main Study Area */}
      <div className="flex flex-col items-center justify-center flex-1 w-full gap-4">
        {/* Flashcard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
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

        {/* Rating Buttons */}
        <div className="min-h-[120px] w-full flex items-center justify-center relative z-20">
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="w-full px-4 mx-auto flex flex-col items-center gap-6">
                  {/* Premium styled question pill */}
                  <motion.div
                    className="relative inline-flex items-center px-6 py-2.5 rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/20 to-cyan-900/40 backdrop-blur-md shadow-[0_0_20px_rgba(108,99,255,0.15)] overflow-hidden group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 text-white/90 text-[13px] font-bold tracking-[0.15em] uppercase drop-shadow-sm">
                      How well did you know this?
                    </span>
                  </motion.div>
                  
                  {/* Rating buttons wrapper */}
                  <div className="w-full max-w-4xl px-2 sm:px-0 flex justify-center">
                    <RatingButtons onRate={handleRate} disabled={rating} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
