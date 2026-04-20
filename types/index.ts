// Shared TypeScript types for RecallAI

export interface Deck {
  id: string;
  title: string;
  source_filename?: string;
  card_count: number;
  created_at: string;
}

export interface Card {
  id: string;
  deck_id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'definition' | 'concept' | 'application' | 'reasoning';
  interval: number;
  ease_factor: number;
  next_review: string;
  created_at: string;
}

export interface Review {
  id: string;
  card_id: string;
  rating: Rating;
  timestamp: string;
}

export type Rating = 'again' | 'hard' | 'good' | 'easy';

export interface DeckWithCards extends Deck {
  cards: Card[];
}

export interface DashboardStats {
  totalCards: number;
  masteredCards: number;
  weakCards: number;
  dueToday: number;
  totalDecks: number;
}

export interface GenerateCardsRequest {
  text: string;
  deckTitle: string;
}

export interface ReviewCardRequest {
  cardId: string;
  rating: Rating;
}

export interface ExplainRequest {
  answer: string;
}

export interface ApiError {
  error: string;
}
