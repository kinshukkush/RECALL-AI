import Link from 'next/link';
import { Brain, Zap, RotateCcw, BarChart3, Upload, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'PDF Upload & Parsing',
    desc: 'Drag and drop any PDF — textbooks, notes, papers. We extract and clean the content automatically.',
  },
  {
    icon: Sparkles,
    title: 'AI Flashcard Generation',
    desc: 'Advanced AI analyzes your content and creates targeted questions with precise, concise answers.',
  },
  {
    icon: RotateCcw,
    title: 'Active Recall Practice',
    desc: 'Animated 3D flip cards test your knowledge with one question at a time for focused learning.',
  },
  {
    icon: Zap,
    title: 'Spaced Repetition (SM-2)',
    desc: 'The proven SM-2 algorithm schedules reviews at optimal intervals — never review too early or too late.',
  },
  {
    icon: BarChart3,
    title: 'Progress Dashboard',
    desc: 'Track mastered cards, weak spots, and cards due today with a beautiful analytics dashboard.',
  },
  {
    icon: BookOpen,
    title: '"Explain Better" AI',
    desc: 'Confused by an answer? Ask AI to simplify it with plain language and real-world examples.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-badge">
            <Brain size={14} />
            AI-Powered Learning
          </div>
          <h1 className="hero-title">
            Transform PDFs into
            <br />
            <span className="gradient-text">Mastery-Level Knowledge</span>
          </h1>
          <p className="hero-subtitle">
            RecallAI turns your study materials into intelligent flashcard decks.
            Practice with spaced repetition, track your progress, and never forget what you learned.
          </p>
          <div className="hero-buttons">
            <Link href="/upload" className="btn-primary hero-btn-primary" id="hero-upload-btn">
              <Upload size={20} />
              Upload a PDF
              <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn-secondary" id="hero-dashboard-btn">
              <BarChart3 size={18} />
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">
          Everything you need to <span className="gradient-text">learn faster</span>
        </h2>
        <p className="section-subtitle">
          RecallAI combines proven cognitive science with modern AI to supercharge your learning.
        </p>
        <div className="features-grid">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon-wrap">
                <Icon size={24} />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card">
          <h2 className="cta-title">Ready to study smarter?</h2>
          <p className="cta-subtitle">
            Upload your first PDF and have AI-generated flashcards ready in under a minute.
          </p>
          <Link href="/upload" className="btn-primary" id="cta-upload-btn">
            <Upload size={18} />
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>
    </>
  );
}
