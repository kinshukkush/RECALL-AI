'use client';

import { useState } from 'react';
import { Card } from '@/types';
import { Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashCardProps {
  card: Card;
  showAnswer: boolean;
  onReveal: () => void;
}

export default function FlashCard({ card, showAnswer, onReveal }: FlashCardProps) {
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const difficultyColors: Record<string, string> = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  };

  const typeColors: Record<string, string> = {
    definition: 'badge-definition',
    concept: 'badge-concept',
    application: 'badge-application',
    reasoning: 'badge-reasoning',
  };

  const handleExplain = async () => {
    if (explanation) {
      setShowExplanation(!showExplanation);
      return;
    }
    setExplaining(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: card.answer }),
      });
      const data = await res.json();
      if (data.explanation) {
        setExplanation(data.explanation);
        setShowExplanation(true);
      }
    } catch {
      // silently fail
    }
    setExplaining(false);
  };

  return (
    <div className="perspective-container w-full max-w-700px mx-auto h-[480px]">
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: showAnswer ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glowing Edge Effect */}
        <div className={`absolute inset-[-2px] rounded-xl z-[-1] transition-opacity duration-500 ${showAnswer ? 'opacity-100 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 animate-pulse' : 'opacity-0'}`} />

        {/* FRONT - Question */}
        <div
          className="flashcard-face glass absolute inset-0 backface-hidden flex flex-col gap-5 p-9 border border-white/10 overflow-y-auto"
          style={{ backfaceVisibility: "hidden", background: "linear-gradient(135deg, rgba(8,11,20,0.8) 0%, rgba(20,27,45,0.9) 100%)" }}
        >
          <div className="card-badges flex gap-2 flex-wrap">
            <span className={`badge ${difficultyColors[card.difficulty]}`}>
              {card.difficulty}
            </span>
            <span className={`badge ${typeColors[card.type]}`}>
              {card.type}
            </span>
          </div>
          <div className="card-question-wrap flex-1 flex flex-col justify-center gap-3 relative z-10">
            <p className="card-label drop-shadow-sm">Question</p>
            <h2 className="card-question drop-shadow-md text-white text-2xl font-semibold leading-relaxed">{card.question}</h2>
          </div>
          {!showAnswer && (
            <motion.button
              className="reveal-btn relative overflow-hidden group"
              id="reveal-answer-btn"
              onClick={onReveal}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
              <Eye size={18} className="relative z-10" />
              <span className="relative z-10">Reveal Answer</span>
            </motion.button>
          )}
        </div>

        {/* BACK - Answer */}
        <div
          className="flashcard-face glass absolute inset-0 backface-hidden flex flex-col gap-5 p-9 border border-purple-500/30 overflow-y-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(20,27,45,0.95) 100%)" }}
        >
          <div className="card-badges flex gap-2 flex-wrap">
            <span className={`badge ${difficultyColors[card.difficulty]}`}>
              {card.difficulty}
            </span>
            <span className={`badge ${typeColors[card.type]}`}>
              {card.type}
            </span>
          </div>
          <div className="card-answer-wrap flex-1 flex flex-col justify-center gap-3 relative z-10">
            <p className="card-label">Answer</p>
            <p className="card-answer text-gray-200 text-lg leading-relaxed drop-shadow-sm">{card.answer}</p>
          </div>

          {/* Explain Better */}
          {showAnswer && (
            <div className="explain-section flex flex-col gap-3 relative z-10">
              <motion.button
                className="explain-btn border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 group relative overflow-hidden"
                id="explain-better-btn"
                onClick={handleExplain}
                disabled={explaining}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {explaining ? (
                  <><Loader2 size={16} className="spinning" /> Simplifying...</>
                ) : (
                  <><Sparkles size={16} className="group-hover:animate-spin" /> Explain Better</>
                )}
              </motion.button>

              <AnimatePresence>
                {showExplanation && explanation && (
                  <motion.div
                    className="explanation-box glass border-cyan-500/30 bg-cyan-900/20"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="explanation-label text-cyan-400 border-b border-cyan-500/20 pb-2 mb-2">
                      <Sparkles size={14} /> Simplified
                    </p>
                    <p className="explanation-text text-gray-300">{explanation}</p>
                    <button className="hide-explain-btn hover:text-cyan-300 mt-2" onClick={() => setShowExplanation(false)}>
                      <EyeOff size={14} /> Hide
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
