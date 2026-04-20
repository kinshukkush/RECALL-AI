'use client';

import { useState } from 'react';
import { Card } from '@/types';
import { Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';

interface FlashCardProps {
  card: Card;
  showAnswer: boolean;
  onReveal: () => void;
}

export default function FlashCard({ card, showAnswer, onReveal }: FlashCardProps) {
  const [explanation, setExplanation] = useState('');
  const [explaining, setExplaining] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const difficultyColors = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  };

  const typeColors = {
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
    <div className={`flashcard-wrapper ${showAnswer ? 'flipped' : ''}`}>
      <div className="flashcard-inner">

        {/* FRONT - Question */}
        <div className="flashcard-face flashcard-front">
          <div className="card-badges">
            <span className={`badge ${difficultyColors[card.difficulty]}`}>
              {card.difficulty}
            </span>
            <span className={`badge ${typeColors[card.type]}`}>
              {card.type}
            </span>
          </div>
          <div className="card-question-wrap">
            <p className="card-label">Question</p>
            <h2 className="card-question">{card.question}</h2>
          </div>
          {!showAnswer && (
            <button className="reveal-btn" id="reveal-answer-btn" onClick={onReveal}>
              <Eye size={18} />
              Reveal Answer
            </button>
          )}
        </div>

        {/* BACK - Answer */}
        <div className="flashcard-face flashcard-back">
          <div className="card-badges">
            <span className={`badge ${difficultyColors[card.difficulty]}`}>
              {card.difficulty}
            </span>
            <span className={`badge ${typeColors[card.type]}`}>
              {card.type}
            </span>
          </div>
          <div className="card-answer-wrap">
            <p className="card-label">Answer</p>
            <p className="card-answer">{card.answer}</p>
          </div>

          {/* Explain Better */}
          {showAnswer && (
            <div className="explain-section">
              <button
                className="explain-btn"
                id="explain-better-btn"
                onClick={handleExplain}
                disabled={explaining}
              >
                {explaining ? (
                  <><Loader2 size={16} className="spinning" /> Simplifying...</>
                ) : (
                  <><Sparkles size={16} /> Explain Better</>
                )}
              </button>
              {showExplanation && explanation && (
                <div className="explanation-box">
                  <p className="explanation-label">
                    <Sparkles size={14} /> Simplified
                  </p>
                  <p className="explanation-text">{explanation}</p>
                  <button className="hide-explain-btn" onClick={() => setShowExplanation(false)}>
                    <EyeOff size={14} /> Hide
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
