'use client';

import { Rating } from '@/types';
import { RotateCcw, ThumbsDown, ThumbsUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface RatingButtonsProps {
  onRate: (rating: Rating) => void;
  disabled?: boolean;
}

const ratings: { value: Rating; label: string; icon: React.ReactNode; colorClass: string; glowClass: string; isDefault?: boolean }[] = [
  { value: 'again', label: 'Again', icon: <RotateCcw size={18} />, colorClass: 'text-rose-500 border-rose-500/30 bg-rose-500/5', glowClass: 'hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:bg-rose-500/20' },
  { value: 'hard', label: 'Hard', icon: <ThumbsDown size={18} />, colorClass: 'text-amber-500 border-amber-500/30 bg-amber-500/5', glowClass: 'hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:bg-amber-500/20' },
  { value: 'good', label: 'Good', icon: <ThumbsUp size={18} />, colorClass: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5', glowClass: 'hover:shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:bg-emerald-400/20', isDefault: true },
  { value: 'easy', label: 'Easy', icon: <Zap size={18} />, colorClass: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5', glowClass: 'hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:bg-cyan-400/20' },
];

export default function RatingButtons({ onRate, disabled }: RatingButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
      {ratings.map(({ value, label, icon, colorClass, glowClass, isDefault }) => (
        <motion.button
          key={value}
          id={`rate-${value}-btn`}
          onClick={() => onRate(value)}
          disabled={disabled}
          aria-label={`Rate as ${label}`}
          className={`flex-1 min-w-[120px] flex flex-col items-center gap-2 py-3 px-4 rounded-2xl glass border border-white/5 transition-colors duration-300 ${colorClass} ${glowClass} ${isDefault ? 'animate-[pulse-glow_2s_infinite]' : ''}`}
          whileHover={disabled ? {} : { y: -4, scale: 1.05 }}
          whileTap={disabled ? {} : { y: 2, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {icon}
          <span className="font-semibold tracking-wide text-sm">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
