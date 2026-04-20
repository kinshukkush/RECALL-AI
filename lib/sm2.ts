import { Rating } from '@/types';

interface SM2Input {
  interval: number;
  ease_factor: number;
  rating: Rating;
}

interface SM2Output {
  interval: number;
  ease_factor: number;
  next_review: string;
}

/**
 * Simplified SM-2 Spaced Repetition Algorithm
 * Calculates next review date based on card performance rating
 */
export function calculateSM2({ interval, ease_factor, rating }: SM2Input): SM2Output {
  let newInterval = interval;
  let newEaseFactor = ease_factor;

  switch (rating) {
    case 'again':
      // Card forgotten — restart from 1 day
      newInterval = 1;
      newEaseFactor = Math.max(1.3, ease_factor - 0.2);
      break;
    case 'hard':
      // Struggled — slight increase
      newInterval = Math.max(1, Math.round(interval * 1.2));
      newEaseFactor = Math.max(1.3, ease_factor - 0.15);
      break;
    case 'good':
      // Normal recall — use ease factor
      newInterval = Math.round(interval * ease_factor);
      // ease_factor stays the same
      break;
    case 'easy':
      // Perfect recall — bonus multiplier + ease_factor boost
      newInterval = Math.round(interval * ease_factor * 1.3);
      newEaseFactor = Math.min(4.0, ease_factor + 0.15);
      break;
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  const next_review = nextReviewDate.toISOString().split('T')[0];

  return {
    interval: newInterval,
    ease_factor: newEaseFactor,
    next_review,
  };
}

/**
 * Check if a card is due for review today or overdue
 */
export function isDue(nextReview: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return nextReview <= today;
}

/**
 * Get cards due today from a list
 */
export function getDueCards<T extends { next_review: string }>(cards: T[]): T[] {
  return cards.filter(card => isDue(card.next_review));
}
