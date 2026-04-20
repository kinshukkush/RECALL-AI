'use client';

import { Rating } from '@/types';
import { RotateCcw, ThumbsDown, ThumbsUp, Zap } from 'lucide-react';

interface RatingButtonsProps {
  onRate: (rating: Rating) => void;
  disabled?: boolean;
}

const ratings: { value: Rating; label: string; icon: React.ReactNode; className: string }[] = [
  { value: 'again', label: 'Again', icon: <RotateCcw size={18} />, className: 'btn-again' },
  { value: 'hard', label: 'Hard', icon: <ThumbsDown size={18} />, className: 'btn-hard' },
  { value: 'good', label: 'Good', icon: <ThumbsUp size={18} />, className: 'btn-good' },
  { value: 'easy', label: 'Easy', icon: <Zap size={18} />, className: 'btn-easy' },
];

export default function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <div className="rating-buttons">
      {ratings.map(({ value, label, icon, className }) => (
        <button
          key={value}
          id={`rate-${value}-btn`}
          className={`rating-btn ${className}`}
          onClick={() => onRate(value)}
          disabled={disabled}
          aria-label={`Rate as ${label}`}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
