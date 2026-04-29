'use client';

import { useEffect, useState, useRef, MouseEvent } from 'react';
import { Deck } from '@/types';
import DeckCard from '@/components/DeckCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  BookOpen,
  Upload,
  ArrowRight,
  Sparkles,
  Zap,
  Library,
  Plus,
  AlertCircle
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, Variants } from 'framer-motion';

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: -20,
    transition: { duration: 0.2 }
  }
};

// 3D Tilt Card Component
function Tilt3DCard({
  children,
  className = '',
  intensity = 6
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at ${(mouseX.get() + 0.5) * 100}% ${(mouseY.get() + 0.5) * 100}%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function DecksPage() {
  const [decks, setDecks] = useState<(Deck & { due_count?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/decks');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch decks');
      setDecks(data.decks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch decks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(deckId);
      const res = await fetch(`/api/decks?id=${deckId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      setDecks(prev => prev.filter(d => d.id !== deckId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete deck');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your decks..." />;

  const totalCards = decks.reduce((sum, deck) => sum + (deck.card_count || 0), 0);
  const totalDue = decks.reduce((sum, deck) => sum + (deck.due_count || 0), 0);

  return (
    <div className="page-content">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Tilt3DCard className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-[#0f0f15] to-[#080808] p-10 md:p-16 min-h-[320px] flex flex-col justify-center mb-12">
          {/* Background effects */}
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/15 rounded-full blur-[120px] pointer-events-none"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.2, 0.15]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/12 rounded-full blur-[120px] pointer-events-none"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.12, 0.18, 0.12]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Floating particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full pointer-events-none"
              style={{
                top: `${20 + i * 20}%`,
                left: `${15 + i * 18}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Decorative lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="relative z-10 w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left content */}
              <div className="flex-1">
                <motion.div
                  className="inline-flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="p-2 flex-shrink-0 rounded-lg bg-primary/10 border border-primary/20">
                    <Library size={20} className="text-primary-light" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-light/80">
                    Your Learning Library
                  </span>
                </motion.div>

                <motion.h1
                  className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  My Decks
                </motion.h1>

                <motion.p
                  className="text-white/60 text-lg max-w-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {decks.length === 0
                    ? "Start building your knowledge base by uploading a PDF."
                    : `Manage ${decks.length} deck${decks.length !== 1 ? 's' : ''} and review ${totalCards} cards`
                  }
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    href="/upload"
                    className="btn-primary group w-full sm:w-auto inline-flex justify-center sm:justify-start"
                  >
                    <Plus size={18} />
                    <span>Create New Deck</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>

              {/* Right stats */}
              {decks.length > 0 && (
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex-1 w-full sm:w-auto px-6 py-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] shadow-lg flex flex-col justify-center">
                    <div className="text-[12px] text-white/50 uppercase tracking-[0.1em] mb-2 font-bold">Total Cards</div>
                    <div className="text-5xl font-display font-bold text-white tracking-tight">{totalCards}</div>
                  </div>
                  {totalDue > 0 && (
                    <div className="flex-1 w-full sm:w-auto px-6 py-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-lg flex flex-col justify-center">
                      <div className="text-[12px] text-amber-400/80 uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5 font-bold">
                        <Zap size={14} className="text-amber-400 shrink-0" />
                        Due Today
                      </div>
                      <div className="text-5xl font-display font-bold text-amber-400 shadow-amber-400/20 drop-shadow-lg tracking-tight">{totalDue}</div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </Tilt3DCard>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-6 py-4 rounded-lg bg-rose-500/10 border border-rose-500/20 mb-8"
        >
          <AlertCircle size={18} className="text-rose-400" />
          <span className="text-rose-400 font-medium">{error}</span>
        </motion.div>
      )}

      {/* Empty State */}
      {decks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Tilt3DCard className="relative overflow-hidden rounded-3xl border border-white/[0.06] p-12 bg-gradient-to-br from-white/[0.03] to-white/[0.01]">
            {/* Background glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/8 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center py-12">
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 border border-white/[0.1] flex items-center justify-center mx-auto mb-8"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(99, 102, 241, 0.2)',
                    '0 0 0 20px rgba(99, 102, 241, 0)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen size={48} className="text-primary-light" />
              </motion.div>

              <motion.h2
                className="text-3xl font-display font-bold text-white mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                No decks yet
              </motion.h2>

              <motion.p
                className="text-white/60 text-lg max-w-md mx-auto mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Upload a PDF to create your first intelligent flashcard deck powered by AI.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/upload"
                  className="btn-primary group mx-auto"
                >
                  <Upload size={18} />
                  <span>Upload PDF</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              {/* Features */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/[0.06]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Sparkles size={20} className="text-primary-light" />
                  <span className="text-sm font-medium text-white">AI-Generated Cards</span>
                  <span className="text-xs text-white/40">Smart extraction from PDFs</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Zap size={20} className="text-accent" />
                  <span className="text-sm font-medium text-white">Spaced Repetition</span>
                  <span className="text-xs text-white/40">Optimized learning schedule</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BookOpen size={20} className="text-cyan-400" />
                  <span className="text-sm font-medium text-white">Track Progress</span>
                  <span className="text-xs text-white/40">Monitor your mastery</span>
                </div>
              </motion.div>
            </div>
          </Tilt3DCard>
        </motion.div>
      ) : (
        <>
          {/* Section header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-white">
              Your Decks
              <span className="text-white/40 font-normal ml-2">({decks.length})</span>
            </h2>
            <Link
              href="/upload"
              className="text-sm font-medium text-primary-light hover:text-primary-light/80 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add Deck
            </Link>
          </motion.div>

          {/* Decks Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {decks.map(deck => (
                <motion.div
                  key={deck.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                >
                  <DeckCard
                    deck={deck}
                    onDelete={handleDelete}
                    isDeleting={deletingId === deck.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Motivational footer */}
          <motion.div
            className="mt-16 p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-r from-primary/5 to-accent/5 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white/60">
              💡 Tip: Review at least one deck daily to maximize retention and mastery.
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}